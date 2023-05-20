import './index.css'
import ProfileStatus from './ProfileStatus'
import {LogOut } from 'react-feather';


function EditProfile(){

    const {userData, handleChange, handleSubmit, signOut, errors, success, avatar} = ProfileStatus()
    

    return <>
    <div className="wrapper-edit-profile-page">
    <div className="edit-profile-title">Edit Profile</div>
    <div className="user-profile">
    <form onSubmit={handleSubmit}>
      <div className="edit-profile-with-icon" >
        <label for="user-upload-profile-pic" class="edit-profile-pic" style={{backgroundImage: 'url(' + avatar + ')'}}></label>
        <input type="file" accept="image/*" name="photo" onChange={handleChange} onMouseLeave={handleChange} id="user-upload-profile-pic" />
      </div>
      <div className="edit-profile-name">{userData.first_name} {userData.last_name}</div>
      <div className="edit-profile-location"></div>
      
        <div className="edit-profile-grid">
        <div className="floating-label-search-bar" >
              <label className="search-bar-details-label">Username</label>
              <input type="text" className="profile-buttons" placeholder="" name="username" onChange={handleChange} value={userData.username} required/>
              <p>{errors.username}</p>
          </div>
          <div className="floating-label-search-bar" >
              <label className="search-bar-details-label">First Name</label>
              <input type="text" className="profile-buttons" placeholder="" name="first_name" onChange={handleChange}value={userData.first_name} required/>
              <p>{errors.first_name}</p>
          </div>
          <div className="floating-label-search-bar">
              <label className="search-bar-details-label">Last Name</label>
              <input type="text" className="profile-buttons" placeholder="" name="last_name" onChange={handleChange}  value={userData.last_name} required/>
              <p>{errors.last_name}</p>
          </div>
          <div className="floating-label-search-bar">
              <label className="search-bar-details-label">Phone number</label>
              <input type="text" className="profile-buttons" placeholder="" name="phone_number" onChange={handleChange} value={userData.phone_number} required/>
              <p>{errors.phone_number}</p>
          </div>
          <div className="floating-label-search-bar" >
              <label className="search-bar-details-label">Email</label>
              <input type="email" className="profile-buttons" placeholder="" name="email" onChange={handleChange} value={userData.email} required/>
              <p>{errors.email}</p>
          </div>
          <div className="floating-label-search-bar" >
              <label className="search-bar-details-label">Password</label>
              <input type="password" className="profile-buttons" placeholder="" name="password" onChange={handleChange} value={userData.password}/>
              <p>{errors.password}</p>
          </div>
          <div className="floating-label-search-bar" >
              <label className="search-bar-details-label">Repeat Password</label>
              <input type="password" className="profile-buttons" placeholder="" name="confirm_password" onChange={handleChange} value={userData.confirm_password} onMouseLeave={handleChange} />
              <p>{errors.confirm_password}</p>
          </div>
        </div>
          <div className="search-button-center">
            <button type="submit" className="search-options-search-bar">Save Changes</button>
          </div>
        </form>
        {success && (<p className="success-tag">Profile updated successfully!</p>)}

    </div>
    <div class="edit-profile-logout">
      <LogOut></LogOut>
      <div><button onClick={signOut}>Sign out</button></div>
    </div>
</div>
    </>
}

export default EditProfile