import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js'
import { startAsync, makeRedirectUri } from 'expo-auth-session';
import { axios } from '../../components/Utils/ServiceCall'
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
    const siginAccount  =   await siginToAccount(response.params?.refresh_token,response.params)
    const userProfile = await signInEmailPassword(siginAccount,siginAccount)
    const authToken = await generateAuthToken(siginAccount,response.params)
    userProfile.profile.authToken = authToken
    userProfile.login.authToken = authToken
    return userProfile
  } catch (error) {
    const err = error as AxiosError
    console.log('error',error)
  }

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
async  function validateExistingUser() {
  // authService
}
