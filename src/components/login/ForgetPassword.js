import React, { useCallback,useState } from 'react'
import app from '../extra/base';

const ForgetPassword = (props) => {
    const [message, setMessage] = useState(false);
    const [err, setErr] = useState(false);
    const [err2, setErr2] = useState(false);

    const handleReset = useCallback(
        async event => {
            event.preventDefault();
            const {email} = event.target.elements;
            if(email.value !== ''){
                try {
                    await app
                        .auth()
                        .sendPasswordResetEmail(email.value).then(function (user) {
                          setErr(true)
                        }).catch(function (error) {
                           setErr2(true)
                        })
                }catch(error){
                    //
                }
            }
            else{
                setMessage(true);
            }
        },
        []
    );

    const handleChange = () => {
        setMessage(false);
        setErr2(false)
        setErr(false)
    }
    return (
        <div className="container forget-card mt-5 mb-5">
            <form onSubmit={handleReset}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="text" className="form-control" name="email" onChange={handleChange} autoComplete="off"/>
                </div>
                {
                    message ? <label id="login-error">* Please type email.</label> : null
                }
                {
                    err ? <label id="forget-success"><i className="fa fa-check fa-lg" aria-hidden="true"></i>&nbsp;Successful. Please check email address!</label> : null
                }
                {
                    err2 ? <label id="login-error">* This email address is not registered.</label> : null
                }
                <button type="submit" className="btn btn-success btn-block">
                    Send Reset Link
                </button>
            </form>
            <button type="button" className="btn btn-primary btn-block mt-3" onClick={props.goBack}>
                <i className="fa fa-arrow-circle-left fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;
                Go Back Login
            </button>
        </div>
    )
}

export default ForgetPassword;