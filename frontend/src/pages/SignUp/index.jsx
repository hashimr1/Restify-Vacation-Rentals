import './index.css'
import logo from '../../assets/restifytextlogo.png'
import {useState, useEffect, useContext} from 'react'
import { AuthContext } from "../../contexts";
import {useNavigate} from "react-router-dom"
import axios from 'axios'
import { Link } from 'react-router-dom';

function SignUp(){
    const initial_values = {username: "", first_name: "", last_name: "", email: "", phone: "", password: "", repeat_password: ""}
    const [formValues, setFormValues] = useState(initial_values)
    const [errors, setErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)
    const {token, setToken} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        console.log(e.value);
        const {name, value} = e.target;
        console.log(name, value)
        setFormValues({ ...formValues, [name]: value});
        setErrors(validateValues(formValues));    
        console.log(formValues);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(validateValues(formValues));   
        setIsSubmit(true)
        
      }

    const updateToken = (value) => {
      setToken(value);
    }


    useEffect(() => {
      let cancel;
      if(Object.keys(errors).length === 0 && isSubmit){
        console.log(formValues);
        
        axios({
          method:'POST',
          mode: 'cors',
          url:'http://127.0.0.1:8000/accounts/signup/',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify({"username": formValues.username, "first_name":formValues.first_name,
        "last_name": formValues.last_name, "email": formValues.email, "phone_number": formValues.phone,
      "password": formValues.password,"confirm_password": formValues.repeat_password}),
          cancelToken: new axios.CancelToken(c => cancel = c)
      }).then(res => {
          console.log(res.data)
          console.log(res.data.JSON)
          axios({
                method:'POST',
                mode: 'cors',
                url:'http://localhost:8000/api/token/',
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify({"username": formValues.username, "password": formValues.password}),
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(res => {
                console.log(res);
                console.log("Get " + res.data.access);
                setToken(res.data.access);
                navigate('/');

             
            }).catch(e => {
              console.log(e)
              setIsSubmit(false);
                if(axios.isCancel(e)) return
            })
      }).catch(e => {
        console.log(e)
        setIsSubmit(false)
          if(axios.isCancel(e)) return
      })
      }

    }, [formValues, errors, isSubmit])

    const validateValues = (values) => {
      const errors = {};
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      const phone_regex = /^\d{10}$/i;
      if (!values.username) {
        errors.username = "Username is required";
      }
      if (!values.first_name) {
        errors.first_name = "First name is required";
      }
      if (!values.last_name) {
        errors.last_name = "Last name is required";
      }
      if (!values.email) {
        errors.email = "Email is required";
      } 
      else if (!regex.test(values.email)) {
        errors.email = "This is not a valid email format";
      }
      if (!values.phone) {
        errors.phone = "Phone number is required";
      } 
      else if (!phone_regex.test(values.phone)){
        errors.phone = "This is not a valid phone number format";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 4) {
        errors.password = "Password must be more than 4 characters";
      } 
      if(values.password !== values.repeat_password){
        errors.password = "Passwords must match";
        errors.repeat_password = "Passwords must match";
      }
      return errors;
      
    }

    return <>
        <div className="signup-page-content">
      <img className="signup-logo" src={logo} alt="restify-logo"/>
      <form className="signup-info" onSubmit={handleSubmit} onClick={validateValues}>
          <div className="first-last-names">
              <div className="floating-label-search-bar" >
                <label className="search-bar-details-label">First name</label>
                <input type="text" name="first_name" className="profile-buttons login-profile-button first-name" placeholder="" 
                value={formValues.first_name} onChange = {handleChange} required/>
                <p>{errors.first_name}</p>
              </div>
              <div className="floating-label-search-bar" >
                <label className="search-bar-details-label">Last name</label>
                <input type="text" name="last_name" className="profile-buttons login-profile-button last-name" placeholder="" 
                value={formValues.last_name} onChange = {handleChange} required/>
                <p>{errors.last_name}</p>
              </div>
          </div>
          <div className="floating-label-search-bar" >
                <label className="search-bar-details-label">Username</label>
                <input type="text" name="username" className="signup-page-field profile-buttons" placeholder="" 
                value={formValues.username} onChange = {handleChange} required/>
                <p>{errors.username}</p>
              </div>
          <div className="floating-label-search-bar" >
            <label className="search-bar-details-label">Email</label>
            <input type="email" name="email" className="signup-page-field profile-buttons" placeholder="" 
            value={formValues.email} onChange = {handleChange} required/>
            <p>{errors.email}</p>
              
          </div>
          <div className="floating-label-search-bar" >
            <label className="search-bar-details-label">Phone number</label>
            <input type="tel" name="phone" className="signup-page-field profile-buttons" placeholder="" 
            value={formValues.phone} onChange = {handleChange} required/>
            <p>{errors.phone}</p>
              
          </div>
          <div className="floating-label-search-bar" >
            <label className="search-bar-details-label">Password</label>
            <input type="password" name="password" className="signup-page-field profile-buttons" placeholder="" 
            value={formValues.password} onChange = {handleChange} onMouseLeave={handleChange} required/>
            <p>{errors.password}</p>
              
          </div>

          <div className="floating-label-search-bar" >
            <label className="search-bar-details-label">Password</label>
            <input type="password" name="repeat_password" className="signup-page-field profile-buttons" placeholder="" 
            value={formValues.repeat_password} onChange = {handleChange} onMouseLeave ={handleChange} required/>
            <p>{errors.repeat_password}</p>
              
          </div>
        
          <button type="submit" className="signup-button" >Sign up</button>
          <div className="account-exists-text">Already have an account?</div>
          <Link className="signup-button" to="/login">Log in</Link>

        </form>

    </div>
    </>
}

export default SignUp