
import {useState, useEffect, useContext} from 'react'  
import { AuthContext } from "../../../contexts";  
import {useNavigate} from "react-router-dom"  
import axios from 'axios'  
  
function ProfileStatus(){  
    const initial_values = {username:"", first_name:"", last_name:"", phone_number:"", email:"", password:"", confirm_password:""};  
    const {token, setToken} = useContext(AuthContext);  
    const [userData, setUserData] = useState(initial_values);  
    const [avatar, setUserAvatar] = useState("");
    const [isAvatar, setIsAvatar] = useState(false);
    const [errors, setErrors] = useState({username:"", first_name:"", last_name:"", phone_number:"", email:"", password:"", confirm_password:""});  
    const [isSubmit, setIsSubmit] = useState(false);  
    const [success, setSuccess] = useState(false);  
    const navigate = useNavigate();  
  
  
    const handleChange = (e) => {  
        const {name, value} = e.target;  
        if(name === "photo"){
            console.log(e.target.files[0]);
            setIsAvatar(true);
            if(e.target.files.length !== 0){
                setUserData({ ...userData, [name]: e.target.files[0]}); 
                setUserAvatar(URL.createObjectURL(e.target.files[0]));
                validateErrors(userData);  
                setSuccess(false);  
            }  
        }
        else{
            setUserData({ ...userData, [name]: value});  
            validateErrors(userData);  
            setSuccess(false);  
        }
  
    }  
  
    const signOut = () => {  
      setToken("");  
      localStorage.setItem('token', "");  
      navigate('/');  
    }  
  
    const fetchToken = () => {  
      setToken(localStorage.getItem('token'));  
 
    }  
  
    const validateErrors = (values) => {  
        const errors = {};  
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;  
        const phone_regex = /^\d{10}$/i;  
        if(!values.username){  
            errors.username = "Username is required";  
        }  
  
  
        if(!values.first_name){  
            errors.first_name = "First name is required";  
        }  
  
        if(!values.last_name){  
            errors.last_name = "Last name is required";  
        }  
  
        if(!values.email){  
            errors.email = "Email is required";  
        }  
  
        if(!values.phone_number){  
            errors.phone_number = "Phone number is required";  
        }  
  
        if (!values.password) {  
            errors.password = "Password is required";  
          } else if (values.password.length < 4) {  
            errors.password = "Password must be more than 4 characters";  
          }   
        if(values.password !== values.confirm_password){  
            errors.password = "Passwords must match";  
            errors.confirm_password = "Passwords must match";  
        }  
  
        if(!regex.test(values.email)){  
            errors.email = "This is not a valid email format";  
        }  
  
        if(!phone_regex.test(values.phone_number)){  
            errors.phone_number = "This is not a valid phone number format";  
        }  
        setErrors(errors);  
    }  
  
    const handleSubmit = (e) => {  
        e.preventDefault();  
        validateErrors(userData);  
        if(Object.keys(errors).length === 0){
            setIsSubmit(true);  
        }
    
    }  
  
    const getUserData = () => {  
        axios({  
            method:'GET',  
            mode: 'cors',  
            url:'http://localhost:8000/accounts/view/',  
            headers: {'Authorization' : 'Bearer ' + token},  
            signal: AbortSignal.timeout(5000)  
        }).then(res => {  
            setUserData(res.data);  
            console.log("initial photo ", res.data.photo);
            setUserAvatar(res.data.photo);
        }).catch(e => {  
          setUserData(initial_values);  
          if(axios.isCancel(e)) return  
        })  
            
    }  
  
    useEffect(() => {  
        fetchToken();  
        getUserData();  
     
    }, [token])  
  
    useEffect(() => {  
        if(Object.keys(errors).length === 0 && isSubmit){  
            console.log("PHOTO ", userData.photo);
            console.log("AVATAR ", avatar);
            let formData = new FormData();
            formData.append("username", userData.username);
            formData.append("first_name", userData.first_name);
            formData.append("last_name", userData.last_name);
            formData.append("email", userData.email);
            formData.append("phone_number", userData.phone_number);
            formData.append("password", userData.password);
            formData.append("confirm_password", userData.confirm_password);
            formData.append("photo", userData.photo);

            axios({  
              method:'PUT',  
              mode: 'cors',  
              url:'http://localhost:8000/accounts/editprofile/',  
              headers: {'Authorization' : 'Bearer ' + token},  
              data: formData, 
              signal: AbortSignal.timeout(5000)  
          }).then(res => {  

              setSuccess(true);  
              setIsSubmit(false);
              window.alert("Profile update successful!");
              window.location.reload();
          }).catch(e => {  
            console.log(e)  
            setIsSubmit(false)  
            if(axios.isCancel(e)) return  
          })  
        }  
    }, [userData, errors, isSubmit])  
  
    return {userData, handleChange, handleSubmit, signOut, errors, success, avatar}  
}  
  
export default ProfileStatus 