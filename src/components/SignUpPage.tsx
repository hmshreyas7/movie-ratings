import React, { ChangeEvent, useState } from 'react';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../actions';

function SignUpPage() {
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
}

export default SignUpPage;
