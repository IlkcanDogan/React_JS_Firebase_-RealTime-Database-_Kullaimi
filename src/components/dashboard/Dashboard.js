import React, { useContext, useState,useEffect }from 'react'
import { AuthContext } from '../extra/auth'

import app from '../extra/base';
import ProductKeyPage from './ProductKeyPage';
import HomePage from './HomePage';
import ManuelPage from './ManuelPage';
import AutoPage from './AutoPage';
import ProfilePage from './ProfilePage';

export default function Dashboard() {
    const [home, setHome] = useState(false);
    const [manuel, setManuel] = useState(false);
    const [auto, setAuto] = useState(false);
    const [profile, setProfile] = useState(false);
    const [productKey, setProductKey] = useState('');
    const [keyEntered, setKeyEntered] = useState(true);

    const [homeActualTemp, setHomeActualTemp] = useState('')
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(AuthContext);
    var db = app.database().ref();
    const push = app.messaging();

    const handleHome = () => {
        setHome(true);
        setManuel(false);
        setAuto(false);
        setProfile(false);
    }
    const handleManuel = () => {
        setHome(false);
        setManuel(true);
        setAuto(false);
        setProfile(false);
    }
    const handleAuto = () => {
        setHome(false);
        setManuel(false);
        setAuto(true);
        setProfile(false);
    }

    const handleProfile = () => {
        setHome(false);
        setManuel(false);
        setAuto(false);
        setProfile(true);
    }
    useEffect(() => {
        db.child(`users/${currentUser.uid}`).on('value', data => {
            if(data.val() === null){
                db.child(`users/${currentUser.uid}`).set({
                    productKey: ''
                })
                setKeyEntered(false);
                setHome(false);
            }
            else if(data.val()["productKey"] === ''){
                setKeyEntered(false);
                setHome(false);
                setLoading(false);
            }
            else{
                setProductKey(data.val()["productKey"]);
                
                setKeyEntered(true);
                setHome(true);
                setLoading(false);
            }
        })
    }, []);

    const handleProductKey = (obj,setSuccess) => {
        if(obj.productKey !== ''){
            db.child(`devices/${obj.productKey}`).on('value', data => {
                if(data.exists()){
                    setHomeActualTemp(data.val()["actualTemp"]);
                    db.child(`users/${currentUser.uid}`).update({ productKey: obj.productKey});
                    
                    setKeyEntered(true);
                    setHome(true);
                    setSuccess(true);
                }
                else{
                    setSuccess(false);
                }
            })
        }
    }

    useEffect(() => {
        db.child(`devices/${productKey}`).on('value', data => {
            setHomeActualTemp(data.val()["actualTemp"])
        });
        
    })
    
    useEffect(() => {
        push.getToken().then((token) => {
            db.child(`users/${currentUser.uid}/browserToken`).on('value', data => {
                if(data.exists()){
                    var isDuplicate = false;

                    Object.keys(data.val()).map(id => {
                        if(String(data.val()[id].token) === String(token)){
                            isDuplicate = true;
                            console.log("Duplicate token found!");
                        }
                    })
                }

                if(!data.exists() || !isDuplicate) {
                    db.child(`users/${currentUser.uid}`).update({
                        token
                    }, err => {
                        if(err) {
                            console.log('Token push error! :' + String(err));
                        }
                   })
                }
            })
        }).catch((error) => {
            console.log(error);
        });

     },[])

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark" id="menu-card">
                <div className="container">
                    <img src="iot-logo.png" width="45" />
                    <span id="f-menu" className="f-text">Device Control Panel</span>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#menu">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="menu">
                        
                        <ul className="navbar-nav" id="f-menu" >
                            <li className={home ? "nav-item active" : "nav-item"} data-toggle="collapse" data-target="#menu">
                                <a className="nav-link menu-item" href="javascript:void(0);" onClick={keyEntered ? () => handleHome() : null} > Home </a>
                            </li>
                            <li className={manuel ? "nav-item active" : "nav-item"} data-toggle="collapse" data-target="#menu">
                                <a className="nav-link menu-item" href="javascript:void(0);" onClick={keyEntered ? () => handleManuel() : null}> Manuel </a>
                            </li>
                            <li className={auto ? "nav-item active" : "nav-item"} data-toggle="collapse" data-target="#menu">
                                <a className="nav-link menu-item" href="javascript:void(0);" onClick={keyEntered ? () => handleAuto() : null}> Auto </a>
                            </li>
                        </ul>

                        <ul className="navbar-nav" id="d-menu" >
                            <li className={home ? "nav-item active" : "nav-item"} data-toggle="collapse">
                                <a className="nav-link menu-item" href="javascript:void(0);" onClick={keyEntered ? () => handleHome() : null} > Home </a>
                            </li>
                            <li className={manuel ? "nav-item active" : "nav-item"} data-toggle="collapse">
                                <a className="nav-link menu-item" href="javascript:void(0);" onClick={keyEntered ? () => handleManuel() : null}> Manuel </a>
                            </li>
                            <li className={auto ? "nav-item active" : "nav-item"} data-toggle="collapse">
                                <a className="nav-link menu-item" href="javascript:void(0);" onClick={keyEntered ? () => handleAuto() : null}> Auto </a>
                            </li>
                        </ul>

                        <form id="f-menu" className="form-inline my-2 my-lg-0">
                            <button type="button" className="btn menu-button" data-toggle="collapse" data-target="#menu" onClick={() => handleProfile()}>
                                <i className="fa fa-user" aria-hidden="true"></i>
                                &nbsp;&nbsp;Profile
                            </button>
                            <button type="button" className="btn menu-button" onClick={()=> app.auth().signOut()}>
                                <i className="fa fa-sign-out" aria-hidden="true"></i>
                                &nbsp;&nbsp;Logout
                            </button>
                        </form>
                    </div>
                    <form id="d-menu" className="form-inline my-2 my-lg-0">
                        <button type="button" className="btn menu-button" onClick={() => handleProfile()}>
                            <i className="fa fa-user" aria-hidden="true"></i>
                            &nbsp;&nbsp;Profile
                        </button>
                        <button type="button" className="btn menu-button" onClick={()=> app.auth().signOut()}>
                            <i className="fa fa-sign-out" aria-hidden="true"></i>
                            &nbsp;&nbsp;Logout
                        </button>
                    </form>
                </div>
            </nav>
            {
                loading ?  <div className="container">
                <div className="row mt-5">
                    <div className="col-12 col-lg-4 col-sm-4 "></div>
                    <div className="col-12 col-lg-4 col-sm-4 mt-5 "> 
                       <div className="d-flex justify-content-center mt-5">
                       <svg className="spinner mt-5" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                            <circle className="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                        </svg>
                       </div>
                    </div>
                    <div className="col-12 col-lg-4 col-sm-4"></div>
                </div>
            </div> : null
            }

            {
                home ?  <HomePage temp={homeActualTemp}/>: null
            }
            {
                keyEntered ? null : <ProductKeyPage productKey={handleProductKey}/>
            }
            {
                manuel ? <ManuelPage fireDb={db} temp={homeActualTemp} productKey={productKey} setHome={setHome} setManuel={setManuel} setProfile={setProfile}/> : null
            }
            {
                auto ? <AutoPage fireDb={db} productKey={productKey} setHome={setHome} setAuto={setAuto} setProfile={setProfile}/> : null
            }
            {
                profile ? <ProfilePage userId={currentUser.uid} fireDb={db} productKey={productKey} setHome={setHome} setAuto={setAuto} setProfile={setProfile} fireDb={db}/> : null
            }
        </div>
    )
}