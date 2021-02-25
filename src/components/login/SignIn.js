import React, { useCallback,useContext,useState } from 'react'
import {withRouter, Redirect} from 'react-router'
import { AuthContext } from '../extra/auth'
import app from '../extra/base';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

const SignIn = (props,{history}) => {
    
    const [loginError, setLoginError] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const {email, password} = event.target.elements;
            if(email.value !== '' && password.value !== ''){
                try {
                    await app
                        .auth()
                        .signInWithEmailAndPassword(email.value, password.value);
                    history.push('/dashboard')
                }
                catch (error) {
                    setLoginError(true)
                }
            }
            else{
                setIsEmpty(true);
            }
        },
        [history]
    );
    
    const handleChange = () => {
        setLoginError(false);
        setIsEmpty(false);
    }
    const { currentUser } = useContext(AuthContext);
    if(currentUser){
        return <Redirect to='/dashboard' />
    }

    const uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccess: () => false
        }
    }
    return (
        <div id="login-panel" className="container login-card mt-4 mb-5">
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" className="form-control" name="email" autoComplete="off" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <label id="forget" onClick={props.forgetPassword}>Forget Password</label>
                    <input type="password" className="form-control" name="password" autoComplete="off" onChange={handleChange}/>
                </div>
                {
                    loginError ? <label id="login-error">* Email or password is incorrect!</label> : null
                }
                {
                    isEmpty ? <label id="login-error">* Please type Email and password!</label> : null
                }
                <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                </button>
            </form>
           
            <div className="d-flex justify-content-center mt-3">
                <span className="or"></span>
                <span id="or-text">OR</span>
                <span className="or"></span>
            </div>
            {/*<button type="button" id="google-login" className="btn btn-block mt-2">
                <i className="fa fa-google fa-lg social-login-icon" aria-hidden="true"></i>
                Sign In with Google
            </button>
            <button type="button" id="twitter-login" className="btn btn-block mt-3">
                <i className="fa fa-twitter fa-lg social-login-icon" aria-hidden="true"></i>
                Sign In with Twitter
            </button>
            <button type="button" id="facebook-login" className="btn btn-block mt-3">
                <i className="fa fa-facebook fa-lg social-login-icon" aria-hidden="true"></i>
                Sign In with Facebook
            </button>*/}
            <StyledFirebaseAuth 
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
            />
        </div>
    )
}

export default withRouter(SignIn)