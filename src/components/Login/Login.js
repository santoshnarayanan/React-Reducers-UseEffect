import React, { useState, useEffect, useReducer, useContext } from 'react';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
  if(action.type  === 'USER_INPUT'){
    return {value: action.val, isValid: action.val.includes('@')};
  }
  if(action.type  === 'USER_BLUR'){
    return {value: state.value, isValid: state.value.includes('@')};
  }
  //new state
  return {value: '', isValid: false};
};

const passwordReducer = (state, action) => {
  if(action.type  === 'USER_INPUT'){
    return {value: action.val, isValid: action.val.trim().length > 6};
  }
  if(action.type  === 'USER_BLUR'){
    return {value: state.value, isValid: state.value.trim().length > 6};
  }
  //new state
  return {value: '', isValid: false};
};


const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  //initial state
  const [emailState, dispatchEmail] = useReducer(emailReducer,
      {value:'',
        isValid: null
      });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer,
      {value:'',
        isValid: null
      });

  const authCtx = useContext(AuthContext);  

  useEffect(()=> {
    console.log('EFFECT RUNNING');
    return () =>{
      console.log("EFFECT RUNNING");
    };
  },[]);

  //const {isValid: emailIsValid } = emailState;
  //const {isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(()=>{
      console.log('Checking form validity');
      setFormIsValid(emailState.isValid && passwordState.isValid);
    },500);

    //clear the timer before next run happens
    return() => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    }
  },[emailState, passwordState]);

  const emailChangeHandler = (event) => {
    dispatchEmail({type:'USER_INPUT', val: event.target.value});

    //setFormIsValid(event.target.value.includes('@') && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type:'USER_INPUT', val: event.target.value});
    setFormIsValid(
        event.target.value.trim().length > 6 && emailState.isValid
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type:'USER_BLUR'});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type:'USER_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
