import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import GlobalAlert from './user/components/GlobalAlert'

import AuthRoute from './authorization/AuthRoute';
import Register from './authentication/Register';
import Login from './authentication/Login';

import UserRoute from './authorization/UserRoute';
import Home from './user/Home';
import Profile from './user/Profile';
import Chat from './user/Chat';
import Feedback from './user/Feedback';

import AdminRoute from './authorization/AdminRoute';
import AdminHome from './admin/AdminHome';
import Students from './admin/Students';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <GlobalAlert />
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route element={<AuthRoute />} >
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
            </Route>
            <Route element={<UserRoute />}>
              <Route path='/user/home' element={<Home />} />
              <Route path='/user/chats/:id' element={<Chat />} />
              <Route path='/user/profile' element={<Profile />} />
              <Route path='/user/feedback' element={<Feedback />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path='/admin/home' element={<AdminHome />} />
              <Route path='/admin/students' element={<Students />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>

  )
}

export default App
