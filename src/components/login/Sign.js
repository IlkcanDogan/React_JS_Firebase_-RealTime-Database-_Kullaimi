import React,{useState} from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import ForgetPassword from './ForgetPassword'

export default function Sign() {
    const [panel, setPanel] = useState(true);
    const [forget, setForget] = useState(false);

    return (
        <div id="login-and-register-card" className="col-12 col-md-7 col-xl-7">
            {
                forget ? null : 
                (<div className="d-flex justify-content-center mt-4">
                    <nav className="nav">
                        <a id="sign-in" className={panel ? "nav-link active sign-head": "nav-link active sign-head inactive-panel" } href="javascript:void(0)" onClick={() => setPanel(true)}>
                            Sign In
                            <div className="hr"></div>
                        </a>
                        <a id="sign-up" className={panel ? "nav-link active sign-head inactive-panel" : "nav-link active sign-head"} href="javascript:void(0)" onClick={() => setPanel(false)}>
                            Sign Up
                            <div className="hr" ></div>
                        </a>
                    </nav>
                </div>)
            }

            {
                forget ? <ForgetPassword goBack={() => setForget(false)}/> : ( panel ? <SignIn forgetPassword={()=> setForget(true)} /> : <SignUp/> )
            }
            
            <div className="d-flex justify-content-center mb-5">
                <a href="https://ilkcandogan.com">www.ilkcandogan.com</a>
            </div>
        </div>
    )
}
