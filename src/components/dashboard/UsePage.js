import React, {useState, useEffect} from 'react';
import { Simulate } from 'react-dom/test-utils';

const UsePage = (props) => {
    const db = props.fireDb;
    const productKey = props.productKey;
    const recipeId = props.useId;

    var cont = true;

    const [actualTemp, setActualTemp] = useState(0);
    const [actualTime, setActualTime] = useState(0);

    const [setTempature, setSetTempature] = useState(0);
    const [setTime, setSetTime] = useState(0);
    const [start, setStart] = useState(false);
    const [thisRecipe, setThisRecipe] = useState(false);

    const [used, setUsed] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [currentStep, setCurrentStep] = useState('');
    const [recipeName, setRecipeName] = useState('');

    useEffect(() => {
       db.child(`devices/${productKey}`).on('value', data => {    
             
           if(used && cont){
                if(((data.val()["actualTemp"] === setTempature) || (data.val()["actualTemp"] > setTempature)) && used && !waiting && (recipeId === data.val()["usedRecipeId"])) {
                    db.child(`devices/${productKey}`).update({
                        start: false,
                        waiting : true
                    }, err => {
                        cont = false;
                    })
                }
                else{
                    setUsed(false);
                }
           }

           if(recipeId === data.val()["usedRecipeId"]){
               setThisRecipe(true);
           }
        })
    })
    useEffect(() => {
        db.child(`devices/${productKey}/actualTemp`).on('value', data => {
            if(data.exists()){
                setActualTemp(data.val());
            }
            else{
                setActualTemp(0);
            }
        })

        db.child(`devices/${productKey}/usedRecipeId`).on('value', data => {
            if(data.exists()){
                if(recipeId === data.val()){
                    setUsed(true);
                }
                else{
                    setUsed(false);
                }
            }
            else{
                setUsed(false);
            }
        })

        db.child(`devices/${productKey}/waiting`).on('value', data => {
            if(data.exists()){
                if(data.val()){
                    setWaiting(true);
                }
                else{
                    setWaiting(false);
                }
            }
            else{
                setWaiting(false);
            }
        })

        db.child(`devices/${productKey}/start`).on('value', data => {
            if(data.exists()){
                if(data.val()){
                    setStart(true);
                }
                else{
                    setStart(false);
                }
            }
            else{
                setStart(false);
            }
        })

        db.child(`devices/${productKey}/currentStep`).on('value', data => {
            if(data.exists()){
                setCurrentStep(data.val());
            }
            else{
                setCurrentStep('');
            }
        })

        db.child(`devices/${productKey}/recipes/${recipeId}`).on('value', data => {
            if(data.exists()){
                setSetTempature(data.val()["temp"]);
                db.child(`devices/${productKey}/recipes/${recipeId}/steps/${currentStep - 1}/stepTime`).on('value', data => {
                    if(data.exists()){
                        setSetTime(data.val());
                    }
                    else{
                        setSetTime(0);
                    }
                })
            }
            else{
                setSetTempature(0);
            }
        })

        db.child(`devices/${productKey}/actualTime`).on('value', data => {
            if(data.exists()){
                setActualTime(data.val())
            }
            else{
                setActualTime(0)
            }
        })
    })

    useEffect(() => {
        db.child(`devices/${productKey}/recipes/${recipeId}/name`).on('value', data => {
            if(data.exists()){
                setRecipeName(data.val());
            }
        })
    })
    const firstStart = () => {
        cont = false;
        db.child(`devices/${productKey}`).update({
            usedRecipeId: recipeId,
            start: true,
            waiting : false,
            currentStep: '',
            actualTime: '',
            continue: false
        }, err => {
            if(!err){
                console.log("Kayıt Edildi!");
            }
        })
    }

    const firstStop = () => {
        cont = true;
        db.child(`devices/${productKey}`).update({
            usedRecipeId: '',
            start: false,
            waiting : false,
            continue: false,
            currentStep: '',
            actualTime: ''
        }, err => {
            if(!err){
                
            }
        })
    }
    const afterContinue = () => {
        cont = false;
        db.child(`devices/${productKey}`).update({
            continue: true,
            start: true,
        }, err => {
            if(!err){
                console.log("Kayıt Edildi!");
            }
        })
    }

    const [test, setTest] = useState(false);
    const simule = () => {
        if(test) {
            db.child(`devices/${productKey}`).update({
                actualTime: '',
                actualTemp: 20,
                currentStep: ''
            })
            setTest(false);
        }
        else{
            db.child(`devices/${productKey}`).update({
                actualTime: '01:22:50',
                actualTemp: setTempature,
                currentStep: '1'
            })
            setTest(true);
        }
    }
    return (
        <div className="container">
            <div className="row">
                <div className={thisRecipe && waiting ? 'col-6 col-sm-6 col-lg-6 col-xl-6 mt-3' : 'col-6 col-sm-6 col-lg-6 col-xl-6 mt-5'}>
                
                    <div className="card panel-card">
                        <h2 className="text-center mb-3 mt-3">Actual Temperature</h2>
                        <h2 className="text-center mb-3">{actualTemp} &#8451;</h2>
                    </div>
                </div>
                <div  className={thisRecipe && waiting  ? 'col-6 col-sm-6 col-lg-6 col-xl-6 mt-3' : 'col-6 col-sm-6 col-lg-6 col-xl-6 mt-5'}>
                    <div className="card panel-card" style={{height: '100%'}}>
                        <h2 className="text-center mb-3 mt-3">Set Temperature&nbsp;&nbsp;</h2>
                        <h2 className="text-center mb-3">{setTempature} &#8451;</h2>
                    </div>
                </div>
            </div>
            {
                thisRecipe && waiting ? (
                    <div class="row">
                        <div class="col-6 col-sm-6 col-lg-6 col-xl-6 mt-3">
                            <div class="card panel-card">
                                <h2 class="text-center mb-3 mt-3">Actual Time</h2>
                                <h2 class="text-center mb-3">{!actualTime ? '0' : actualTime}</h2>
                            </div>
                        </div>
                        <div class="col-6 col-sm-6 col-lg-6 col-xl-6 mt-3">
                            <div class="card panel-card">
                                <h2 class="text-center mb-3 mt-3">Set Time</h2>
                                <h2 class="text-center mb-3">{setTime} ''min</h2>
                            </div>
                        </div>
                    </div>
                ) : null
            }
            <div className="row">
                <div className="col-12 col-lg-4 col-sm-3 "></div>
                <div className="col-12 col-lg-4 col-sm-6 mt-3 mb-3">
                    {
                       thisRecipe && waiting && !start ? (
                            <div className="card panel-card text-center">
                                <label style={{whiteSpace: 'pre-wrap'}}><span style={{fontWeight: 'bold',whiteSpace: 'pre-wrap'}}>Recipe Name: </span> {recipeName}</label>
                                <label style={{fontSize: '20px',whiteSpace: 'pre-wrap'}}><span style={{fontWeight: 'bold',whiteSpace: 'pre-wrap'}}>Current Step: </span> Step {currentStep}</label>
                                <button className="btn btn-success mt-3 mb-2" style={{width: '120px'}, {margin: '0 auto'}} onClick={() => afterContinue()}>
                                    <i id="manuel-icon" className="fa fa-check" aria-hidden="true"></i>
                                    Continue
                                </button>
                                <button class="btn btn-primary btn-block mt-3" onClick={props.goBack}>
                                    Show Recipe List
                                </button>
                            </div>
                        ) : (
                            <div className="card panel-card text-center">
                                
                                <label style={{whiteSpace: 'pre-wrap'}}><span style={{fontWeight: 'bold',whiteSpace: 'pre-wrap'}}>Recipe Name: </span> {recipeName}</label>
                                {
                                    thisRecipe && waiting ? <label style={{fontSize: '20px',whiteSpace: 'pre-wrap'}}><span style={{fontWeight: 'bold',whiteSpace: 'pre-wrap'}}>Current Step: </span> Step {currentStep}</label> : (thisRecipe && start ? 'Please wait...' : 'Unused Recipe')
                                }
                                <button className={thisRecipe && start ? 'btn btn-danger mt-3 mb-2': 'btn btn-success mt-3 mb-2'} style={{width: '120px'}, {margin: '0 auto'}} onClick={() => thisRecipe && start ? firstStop(): firstStart()}>
                                    <i id="manuel-icon" className={thisRecipe && start ? 'fa fa-stop' : 'fa fa-check'} aria-hidden="true"></i>
                                    {thisRecipe &&  start ? 'Stop': 'Start'}
                                </button>
                                <button class="btn btn-primary btn-block mt-3" onClick={props.goBack}>
                                    Show Recipe List
                                </button>
                            </div>
                        )
                    }
                    
                    {
                        /*
                        */
                    }
                    <button onClick={() => simule()}>
                        Device Simulation
                    </button> 
                    
                </div>
                <div className="col-12 col-lg-4 col-sm-3"></div>
            </div>
        </div>
    )
}

export default UsePage;