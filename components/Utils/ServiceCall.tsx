import  React,{useEffect,useState,PureComponent,useRef, useContext}from 'react';
import Axios from 'axios'; 
import { BookingContext } from '../../components/Context/UserBookingContext';
export const url =  "https://loogyapi.digital"  //  "http://192.168.1.148:9091" //   "http://139.162.5.101"      //"http://139.162.5.101"  "https://loogyapi.digital" // 
export const urlFirebase =  "http://192.53.114.35:8080" // "https://www.smestoreph.com"  //
export const urlSupBase = "https://www.smestoreph.com"  // "http://192.168.1.148:3001" // 
export const mapBoxUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/" 
 
export const axiosV2Local = (token,id)=>  Axios.create({
    baseURL:'http://192.168.1.148:9091',
    timeOut:3000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "userID":id
    }
});

export const axios = Axios.create({
    baseURL:url,
    timeOut:3000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDA4NDI2NywiZXhwIjoxOTU1NjYwMjY3fQ.xolRkFiSZYYgBKQkH4NzNstJJVPtABmJBQwFtAHgDg0"
    }
});
export const axiosV2 = (token,id)=>  Axios.create({
    baseURL:url,
    timeOut:3000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "userID":id
    }
});
 
export const productStats = Axios.create({
    baseURL:urlFirebase,
    timeOut:3000,
    headers: {
        "Content-Type": "application/json"
    }
});

export const productLike = Axios.create({
    baseURL:urlSupBase,
    timeOut:3000,
    headers: {
        "Content-Type": "application/json"
    }
});


export const MapBox = Axios.create({
    baseURL:mapBoxUrl,
    timeOut:3000,
    headers: {
        "Content-Type": "application/json"
    }
});



