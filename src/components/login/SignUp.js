import React, { useCallback,useState } from 'react'
import {withRouter} from 'react-router'
import app from '../extra/base';

const SignUp = ({history}) => {
    const [isEmpty, setIsEmpty] = useState(false);
    const [matchPassword, setMatchPassword] = useState(false);
    const [alreadyAccount, setAlreadyAccount] = useState(false);
    const [passLen, setPasslen] = useState(false);

    const handleSignUp = useCallback(
        async event => {
            event.preventDefault();
            const {email, password, confirmPassword} = event.target.elements;
            if(email.value !== '' && password.value !== '' && confirmPassword !== ''){
                if(password.value === confirmPassword.value){
                    try {
                        await app.auth().createUserWithEmailAndPassword(email.value, password.value);
                        history.push('/dashboard');
                    }catch(error) {
                        if(error === 'Error: Password should be at least 6 characters') {
                            setPasslen(true);
                        }
                        else{
                            setAlreadyAccount(true);
                        }
                    }
                }
                else{
                    setMatchPassword(true);
                }
            }
            else{
                setIsEmpty(true);
            }
        },
        [history]
    );
    
    const handleChange = () => {
        setIsEmpty(false);
        setMatchPassword(false);
        setAlreadyAccount(false);
        setPasslen(false);
    }
    return (
        <div id="register-panel" className="container register-card mt-4 mb-5">
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" className="form-control" name="email" autoComplete="off" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" name="password" autoComplete="off" onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" className="form-control" name="confirmPassword" autoComplete="off" onChange={handleChange}/>
                </div>
                {
                    isEmpty ? <label id="login-error">* Please type email, password and confirm password!</label>: null
                }
                {
                    matchPassword ? <label id="login-error">* Password does not match!</label> : null
                }
                {
                    alreadyAccount ? <label id="login-error">* The email address is already in use by another account!</label> : null
                }
                {
                    passLen ? <label id="login-error">* Password should be at least 6 characters!</label> : null
                }
                <button type="submit" className="btn btn-primary btn-block">
                    Sign Up
                </button>
            </form>
           
        </div>
    )
}

export default withRouter(SignUp)