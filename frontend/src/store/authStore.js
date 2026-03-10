import {create} from 'zustand'
import axios from 'axios'
import Login from '../components/Login';

export const useAuth=create((set)=>({
    currentUser:null,
    loading:false,
    error:null,
    isAuthenticated:false,
    login:async(userCredWithRole)=>{
        const {role,...userCredObj}=userCredWithRole
        try{
            set({loading:true,error:null})

            let res=await axios.post("http://localhost:4000/common-api/login",userCredObj,{withCredentials:true})

            set({
                loading:false,
                isAuthenticated:true,
                currentUser:res.data.payload
            })
        }
        catch(err){
            set({
                loading:false,
                isAuthenticated:false,
                currentUser:null,
                error:err.response?.data?.error||"Login failed",
            })
        }
    },
    logout:async()=>{
        try{
            //set the loading state
            set({loading:true,error:null})
            //make the api req
            let res = await axios.get("http://localhost:4000/common-api/logout",{withCredentials:true}) // this is mandatory
            //update the state
            set({
                loading:false,
                isAuthenticated:false,
                currentUser:null
            })
        }catch(err){
            set({
                loading:false,
                isAuthenticated:false,
                currentUser:null,
                error:err.response?.data?.error||"Logout failed",
            })
        }
    }
}));