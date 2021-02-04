import React, { ChangeEvent, useState } from 'react';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions';
import { RootState } from '../rootState';
import NoData from './NoData';
import axios from 'axios';

function SignUpPage() {
  const user = useSelector((state: RootState) => state.user);
  let [signUpInfo, setSignUpInfo] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
  });
  let history = useHistory();
  let dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setSignUpInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  };

  const createAcc = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(signUpInfo.email, signUpInfo.password)
      .then((userCredential) => {
        if (userCredential.user) {
          let newUser = userCredential.user;

          newUser
            .updateProfile({
              displayName: `${signUpInfo.fname} ${signUpInfo.lname}`,
            })
            .then(() => {
              dispatch(login(newUser));
              history.push('/');

              return axios.post('http://localhost:5000/login', {
                _id: newUser.uid,
                name: newUser.displayName,
                email: newUser.email,
                birthday: '',
                joinDateTime: newUser.metadata.creationTime,
                lastSignInDateTime: newUser.metadata.lastSignInTime,
              });
            })
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setSignUpInfo({
      fname: '',
      lname: '',
      email: '',
      password: '',
    });
  };

  if (!user.uid) {
    return (
      <div className='signup-page-wrapper'>
        <div className='signup-module-wrapper'>
          <input
            placeholder='First name'
            name='fname'
            value={signUpInfo.fname}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Last name'
            name='lname'
            value={signUpInfo.lname}
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={signUpInfo.email}
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={signUpInfo.password}
            onChange={handleChange}
          />
          <input
            type='button'
            value='Create Account'
            onClick={createAcc}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className='signup-page-wrapper'>
        <NoData />
      </div>
    );
  }
}

export default SignUpPage;
