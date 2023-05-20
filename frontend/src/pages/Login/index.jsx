import './index.css'
import logo from '../../assets/restifytextlogo.png'
import {useState, useEffect, useContext} from 'react'
import { AuthContext } from "../../contexts";
import {useNavigate} from "react-router-dom"
import axios from 'axios'
import { Link } from 'react-router-dom';

function Login(){
  const initial_values = {username: "", password: ""};
  const initial_errors = {validation:"", username:"", password:""}
  const [formValues, setFormValues] = useState(initial_values)
  const [errors, setErrors] = useState(initial_errors);
  const [isSubmit, setIsSubmit] = useState(false)
  const {token, setToken} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormValues({ ...formValues, [name]: value});
    validateErrors(formValues);
    console.log(errors);
    console.log(formValues);
  }

  const validateErrors = (values) => {
    const new_errors = {validation: errors.validation};
    if(!formValues.username){
      new_errors.username = "Username is required";
    }
    if(!formValues.password){
      new_errors.password = "Password is required";
    }
    setErrors(new_errors);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    validateErrors(formValues);
    console.log("SUBMITING");
    setIsSubmit(true);
  }

  useEffect (() => {
    console.log(Object.keys(errors));
    if(isSubmit && (Object.keys(errors).length === 0 || (Object.keys(errors).length === 1 && Object.keys(errors)[0] === "validation"))){
      axios({
          method:'POST',
          mode: 'cors',
          url:'http://127.0.0.1:8000/api/token/',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify({"username": formValues.username, "password":formValues.password}),
          signal: AbortSignal.timeout(5000)
      }).then(res => {

          setToken(res.data.access);
          console.log("success");
          console.log(token);
          window.localStorage.setItem('token', token);
          setIsSubmit(false);
          navigate('/');
      }).catch(e => {
        console.log(e.response.data.detail);
        setErrors({validation:e.response.data.detail});
        setIsSubmit(false);
        if(axios.isCancel(e)) return
      })
      
    }
  })

    return <>
        <div className="signup-page-content">
      <img className="signup-logo" src={logo} alt="restify-logo"/>
      <form className="signup-info" onSubmit={handleSubmit}>
        <div className="login-welcome-back">Welcome Back!</div>
        <p>{errors.validation}</p>
            <div className="floating-label-search-bar" >
              <label className="search-bar-details-label">Username</label>
              <input type="text" className="profile-buttons login-profile-button" placeholder="" name="username" onChange={handleChange} onMouseLeave={handleChange} value={formValues.username} required/>
              <p>{errors.username}</p>
            </div>
            <div className="floating-label-search-bar" >
              <label className="search-bar-details-label">Password</label>
              <input type="password" className="profile-buttons login-profile-button" name="password" placeholder="" onChange={handleChange} onMouseLeave={handleChange} value={formValues.password} required/>
              <p>{errors.password}</p>
            </div>
          
          <div className="login-center-buttons">
            <button type="submit" className="signup-button">Log in</button>
            <Link className="signup-button" to="/signup">Create account</Link>
        </div>

        </form>

    </div>
    </>
}

export default Login