import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient,SupabaseClient } from '@supabase/supabase-js'
import { startAsync, makeRedirectUri } from 'expo-auth-session';
import { axios,axiosV2Local } from '../../components/Utils/ServiceCall'
export const supabaseUrl =  'https://qthtoedmibuvqobvxagd.supabase.co'
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDA4NDI2NywiZXhwIjoxOTU1NjYwMjY3fQ.xolRkFiSZYYgBKQkH4NzNstJJVPtABmJBQwFtAHgDg0'
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage as string,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});


import * as Linking from 'expo-linking';


export const siginWithSupabase = async (provider) => {
  const returnUrl = makeRedirectUri({ useProxy: false ,path:'/'});
  console.log('returnUrl',returnUrl)
  const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${returnUrl}`;
  Linking.addEventListener(authUrl, event => {
    console.log('EVENT URL LINKING',event)

    
  })
 
  try {
   
    const response = await startAsync({ authUrl, returnUrl })
    if (!response || !response.params?.refresh_token) {
      console.log('RESPONSE REDIRECT URL',response)
      return;
    }else {}
    
    console.log('authService Done------')
    const signingAccount  =   await siginToAccount(response.params?.refresh_token,response.params)
    const userProfile = await signInEmailPassword(signingAccount,signingAccount)
    const authToken = await generateAuthToken(signingAccount,response.params)
    const profile = await getSupabaseProfile(signingAccount.id)
    userProfile.profile.authToken = authToken
    userProfile.login.authToken = authToken
    userProfile.profile.extendProfile = profile

    console.log('navigating to dashboard')
    return userProfile
  } catch (error) {
    const err = error as AxiosError
    console.log('error',error)
  }

}

async function getSupabaseProfile(id){

  try {
    const data = {id:id};
    const response = await axiosV2Local('null','null').post("/user/fetchProfile", data)
    if (response.data.status) {
      return 	response.data.result.user_details;
    }else {
      return   {status:'error-getSupabaseProfile'}
    }
  } catch (error) {
    console.log('error fetchDasboardUtilies ',error)
    return  {status:'error-getSupabaseProfile'}
  }
  
  
// try {










//   let { data: profile, error } = await supabase
//   .from('profile')
//   .select("*")
//   .eq('id', 'c0a8ec36-19cb-46c0-8bac-9bbf2f040dda')
//   return profile
// } catch (error) {
//   console.log('error getSupabaseProfile ',error)
//   return {status:'emptyProfile'}
// }
}
export async function siginWithSupabaseV2(provider){ 
  
    try {
      const returnUrl = makeRedirectUri({ useProxy: false });

      const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${returnUrl}`;
      const response = await startAsync({ authUrl, returnUrl })
      if (!response || !response.params?.refresh_token) {

        return;
      }
       siginToAccount(response.params?.refresh_token,response.params)
        } catch (error) {
          const err = error as AxiosError
          // console.log('error',error)
     }
};

async function siginToAccount(token,login){
  try { 
    const { user, session, error } = await supabase.auth.signIn({
      refreshToken: token,
    });
    // console.log('PASSWORDLESS SERVICE',user)
    user.authToken = session.access_token
    return user
  }catch(error) {
    console.log('ERROR',error)
  }
}

async function signInEmailPassword (e,login) { 
  try {
    const response = await axios.post('/signup/authService',{"objectKeys":"*","id":e.id,"email":e.email,"user":e}); 
     var userProfile = {profile: response.data.result,login:login}
     return userProfile
  }  catch (error){
      return error
  }
}
async function generateAuthToken (e) {
  // console.log('e.email',e)
  try {
    const response = await axios.post('/createAuthToken',{"email":e.email,"user":e}); 
     return response.data.authToken
  }  catch (error){
      return error
  }
}

async function deletUserAccount (){
  try {
    const { data, error } = await supabase.deleteUser(
      '715ed5db-f090-4b8c-a067-640ecee36aa0'
    )
  } catch (error) {
    console.log('error deletUserAccount',error)
  }

}
async  function validateExistingUser() {
  // authService
}
// https://appleid.apple.com/appleauth/auth/oauth/consent?client_id=supabase.com.raffin0000.loogy&redirect_uri=https%3A%2F%2Fqthtoedmibuvqobvxagd.supabase.co%2Fauth%2Fv1%2Fcallback&response_mode=form_post&response_type=code&scope=email+name&state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODI1OTY5NDYsInNpdGVfdXJsIjoibG9vZ3k6Ly8iLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImZ1bmN0aW9uX2hvb2tzIjpudWxsLCJwcm92aWRlciI6ImFwcGxlIiwicmVmZXJyZXIiOiJodHRwczovL2FwcC5sb29neS5jby9EYXNoYm9hcmQvYXV0aD8iLCJmbG93X3N0YXRlX2lkIjoiIn0.eMy9fW6uf102vDk-HSYAhGWAX9PUooMj3G9jP-sTzDI


