import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
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
  let [errorMessage, setErrorMessage] = useState('');
  let history = useHistory();
  let dispatch = useDispatch();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'email' || name === 'password') {
      setErrorMessage('');
    }

    setSignUpInfo((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  };

  const createAcc = (event: any) => {
    event.preventDefault();

    firebase
      .auth()
      .createUserWithEmailAndPassword(signUpInfo.email, signUpInfo.password)
      .then((userCredential) => {
        setSignUpInfo({
          fname: '',
          lname: '',
          email: '',
          password: '',
        });
        setErrorMessage('');

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
        setErrorMessage(err.message);
      });
  };

  if (!user.uid) {
    return (
      <div className='signup-page-wrapper'>
        <form className='signup-module-wrapper' onSubmit={createAcc}>
          <input
            placeholder='First name'
            name='fname'
            value={signUpInfo.fname}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            required
            autoCapitalize='words'
          />
          <input
            placeholder='Last name'
            name='lname'
            value={signUpInfo.lname}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            required
            autoCapitalize='words'
          />
          <input
            type='email'
            placeholder='Email'
            name='email'
            value={signUpInfo.email}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={signUpInfo.password}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            required
          />
          <input type='submit' value='Create Account' />
          {errorMessage && <p>{errorMessage}</p>}
        </form>
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
