import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import EditProfile from './pages/EditProfile';
import UserReservations from './pages/UserReservations';
import UserRequests from './pages/ListingRequests';
import MyListings from './pages/MyListings';
import Layout from './pages/Navbar/Layout';
import EditProperty from './pages/EditProperty';
import CreateProperty from './pages/CreateProperty';
import ViewListing from './pages/ViewListing';
import WriteComment from './pages/WriteComment';
import CommentReply from './pages/CommentReply';
import ViewProfile from './pages/ViewProfile';
import AddAvailability from './pages/AddAvailability';
import { AuthProvider } from './contexts';


function App() {
  return <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='user_reservations' element={<UserReservations />} />
          <Route path='user_requests' element={<UserRequests />} />
          <Route path='my_listings' element={<MyListings />} />
          <Route path='edit_property/:id' element={<EditProperty />} />
          <Route path='create_listing' element={<CreateProperty />} />
          <Route path='view_listing/:id' element={<ViewListing />} />
          <Route path=':type/comment/:resid/:target_name' element={<WriteComment />} />
          <Route path=':type/reply/:commentid/:target_name' element={<CommentReply />} />
          <Route path='edit_profile' element={<EditProfile />} />
          <Route path=':id/view_profile' element={<ViewProfile />} />
          <Route path=':id/:prop_name/addavailability' element={<AddAvailability/>}/>
        </Route>
        <Route path="/">
          <Route path='signup' element={<SignUp />} />
          <Route path='login' element={<Login />} />
        </Route>
        
      </Routes>
    </AuthProvider>
  </BrowserRouter>
}

export default App;
