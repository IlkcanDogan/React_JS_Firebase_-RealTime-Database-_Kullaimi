import React, { useContext, useState,useEffect } from 'react';
import app from '../extra/base';
import { AuthContext } from '../extra/auth'
import firebase, { auth } from 'firebase';
import SignIn from '../login/SignIn';
import { Button, Modal } from 'react-bootstrap';

const ProfilePage = (props) => {
    const { currentUser } = useContext(AuthContext);
    const loginType = currentUser.providerData[0].providerId;

    props.setHome(false);
    var db = props.fireDb;
    var productKey = props.productKey;
    var userId = props.userId;

    if(!props.productKey) {
        props.setAuto(false);
        props.setProfile(false);
    }
    const [currentPassword , setCurrentPassowrd] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [newEmail, setNewEmail] = useState(currentUser.email);
    const [newEmailError, setNewEmailError] = useState(false);
    const [newEmailSuccess, setNewEmailSuccess] = useState(false);

    const [invalidTypeModal, setInvalidTypeModal] = useState(false);
    const [enterPassword, setEnterPassword] = useState(false);
    const [nextError, setNextError] = useState('');
    const [nextPassword, setNextPassword] = useState('');

    const [mailShow, setMailShow] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);
    const [keyShow, setKeyShow] = useState(false);

    const [keyError, setKeyError] = useState('');
    const [keySuccess, setKeySuccess] = useState(''); 

    const [key, setKey] = useState(productKey);

    const invalidModal = () => {
        return (
            <>
                <Modal show={invalidTypeModal} onHide={() => setInvalidTypeModal(false)} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Cannot be used for social media account!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={() => setInvalidTypeModal(false)}>
                        Ok
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

    const enterPasswordModal = () => {
        return (
            <>
                <Modal show={enterPassword} onHide={() => setEnterPassword(false)} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Enter your password to continue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password"  className="form-control" onFocus={() => setNextError('')} value={nextPassword} onChange={(event) => setNextPassword(event.target.value)}/>
                            {
                                nextError !== '' ? <label id="login-error" className="mt-3">{nextError}</label> : null
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="danger" onClick={() => setEnterPassword(false)}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={() => handleMailChange(true)}>
                        Next
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
    const returnCred = (pass) => {
        return firebase.auth.EmailAuthProvider.credential(currentUser.email, pass);
    }

    const handleMailChange = (next) => {
        if(loginType === 'password'){
            if(newEmail !== ''){
                if(!next){
                    setEnterPassword(true);
                }
                else{
                    if(nextPassword !== ''){
                        var cred = returnCred(nextPassword);
                        currentUser.reauthenticateWithCredential(cred).then(() => {
                            currentUser.updateEmail(newEmail).then(() => {
                                setNewEmailSuccess("Success! The email was changed");
                            }).catch((error) => { 
                                setNewEmailError('* The email address is already in use by another account');
                            })
                            setEnterPassword(false);
                            setNextPassword('');
                        }).catch((error) => {
                            setNextError("* Password is invalid");
                        })
                    }
                    else{
                        setNextError('* Please do not leave blank');
                    }
                }
            }
            else{
                setNewEmailError('* Please do not leave blank');
            }
            
        }
       
    }

    const handlePassChange = () => {
        if(currentPassword !== '' && newPassword !== '' && confirmPassword !== ''){
            if(newPassword === confirmPassword){
                if(newPassword.length >= 6){
                    var cred = returnCred(currentPassword);
                    currentUser.reauthenticateWithCredential(cred).then(() => {
                        currentUser.updatePassword(newPassword).then(() => {
                           setPasswordSuccess('Success! The password was changed');
                           setCurrentPassowrd('');
                           setNewPassword('');
                           setConfirmPassword('');
                        }).catch((error) => { 
                           setPasswordError(JSON.stringify(error));
                        })
                    }).catch((error) => {
                        setPasswordError('* Password is invalid');
                        setPasswordSuccess('');
                    })
                }
                else{
                    setPasswordError('* Password should be at least 6 characters');
                    setPasswordSuccess('');
                }
            }
            else{
                setPasswordError('* Password does not match');
                setPasswordSuccess('');
            }
        }
        else{
            setPasswordError('* Please do not leave blank');
            setPasswordSuccess('');
        }
    }

    const handleKeyChange = () => {
       if(key !== ''){
            db.child(`devices/${key}`).on('value', data => {
                if(data.exists()){
                    db.child(`users/${userId}`).update({
                        productKey: key
                    }, err => {
                        if(!err){
                            setKeySuccess('Success');
                            setKeyError('');
                        }
                    })
                    
                }
                else{
                    setKeyError('Invalid product key');
                    setKeySuccess('');
                }
            });
       }
       else{
            setKeyError('Please do not leave blank');
            setKeySuccess('');
       }
    } 

    return (
        <div className="container">
            {
                invalidTypeModal ? invalidModal() : null
            }
            {
                enterPassword ? enterPasswordModal() : null
            }
            <div className="row mb-5 mt-5">
                <div className="col-12 col-sm-12 col-lg-6 col-xl-6 mb-2">
                    <div className="card panel-card">
                        <div id="accordion1">

                        <div className="card mb-3">
                            <div className="card-header" id="headingOne">
                            <h5 className="mb-0">
                                <button className="btn btn-primary profile-button" data-toggle="" data-target="#emailSettings" aria-expanded="true" aria-controls="emailSettings" onClick={loginType === 'password' ? (() => {setMailShow(!mailShow); setPasswordShow(false)}) : () => setInvalidTypeModal(true)}>
                                <i className="fa fa-envelope" aria-hidden="true"></i>
                                &nbsp;&nbsp;Email Settings
                                </button>
                            </h5>
                            </div>

                            <div id="emailSettings" className={mailShow ? "collapse show": "collapse hide"} aria-labelledby="headingOne" data-parent="#accordion1">
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" className="form-control" name="email" autoComplete="off" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} onFocus={() => {setNewEmailError(''); setNewEmailSuccess('')}}/>
                                        {
                                            newEmailError !== '' ? <label id="login-error" className="mt-1">{newEmailError}</label> : null
                                        }
                                        {
                                            newEmailSuccess !== '' ? <label id="forget-success" className="mt-1">{newEmailSuccess}</label> : null
                                        }
                                    </div>
                                    <button type="button" className="btn btn-success" onClick={() => handleMailChange(false)}>
                                        Change
                                    </button>
                                </form>
                            </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header" id="headingOne">
                            <h5 className="mb-0">
                                <button className="btn btn-primary profile-button" data-toggle="" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick={loginType === 'password' ? () => {setPasswordShow(!passwordShow); setMailShow(false)}: () => setInvalidTypeModal(true) }>
                                <i className="fa fa-lock" aria-hidden="true"></i>
                                &nbsp;&nbsp;Password Settings
                                </button>
                            </h5>
                            </div>

                            <div id="collapseOne" className={passwordShow  ? "collapse show": "collapse hide"} aria-labelledby="headingOne" data-parent="#accordion1">
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input type="password" className="form-control" name="currnetPassword" value={currentPassword} onChange={(event) => setCurrentPassowrd(event.target.value)} onFocus={() => {setPasswordError(''); setPasswordSuccess('')}}/>
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input type="password" className="form-control" name="newPassword" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} onFocus={() => {setPasswordError(''); setPasswordSuccess('')}}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <input type="password" className="form-control" name="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} onFocus={() => {setPasswordError(''); setPasswordSuccess('')}}/>
                                    </div>
                                    {
                                        passwordSuccess !== '' ? <label id="forget-success" className="mt-1">{passwordSuccess}</label> : null
                                    }
                                    {
                                        passwordError !== '' ? <label id="login-error" className="mt-1">{passwordError}</label> : null
                                    }
                                </form>
                                <button className="btn btn-success" onClick = {() => handlePassChange()}>
                                    Change
                                </button>
                            </div>
                            </div>
                        </div>

                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-12 col-lg-6 col-xl-6 ">
                    <div className="card panel-card">
                        <div id="accordion2">

                        <div className="card">
                            <div className="card-header" id="headingTwo">
                            <h5 className="mb-0">
                                <button className="btn btn-primary profile-button" data-toggle="" data-target="#productKey" aria-expanded="true" aria-controls="productKey" onClick={() => setKeyShow(!keyShow)}>
                                <i className="fa fa-key" aria-hidden="true"></i>
                                &nbsp;&nbsp;Product Key Settings
                                </button>
                            </h5>
                            </div>

                            <div id="productKey" className={keyShow ? "collapse show": "collapse hide"} aria-labelledby="headingTwo" data-parent="#accordion2">
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Product Key</label>
                                    <input type="text" className="form-control" name="productKey" autoComplete="off" value={key} onChange={(event) => setKey((event.target.value))} onFocus={() => {setKeyError(''); setKeySuccess('')}}/>
                                    {
                                        keySuccess !== '' ? <label className="mt-1" id="forget-success">{keySuccess}</label> : null
                                    }
                                    {
                                        keyError !== '' ? <label className="mt-1" id="login-error">* {keyError}</label> : null
                                    }
                                </div>
                                
                                <button type="submit" className="btn btn-success" onClick={() => handleKeyChange()}>
                                    Change
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;