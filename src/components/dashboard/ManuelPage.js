import React, {useState, useEffect} from 'react';

const ManuelPage = (props) => {
    props.setHome(false);
    if(!props.productKey) {
        props.setManuel(false);
        props.setProfile(false);
    }

    const [tempValue, setTempValue] = useState('');
    const [setTemp, setSetTemp] = useState('');
    const [start, setStart] = useState(false);
    const [error, setError] = useState('');
    const [isUsed, setIsUsed] = useState(false);

    const handleChange = (event) => {
        if(!isNaN(event.target.value.replace(',', '.'))){
            setTempValue(event.target.value.replace(',', '.').trim());
            setError('');
        }
        else{
            setError(' * Enter numbers only');
        }
        
    }

    useEffect(() => {
        props.fireDb.child(`devices/${props.productKey}/manuel`).on('value', data =>{
            console.log()
            if(data.exists()){
                setSetTemp(data.val()["setTemp"]);
                setStart(data.val()["start"]);
            }
        })
    })

    useEffect(() => {
        props.fireDb.child(`devices/${props.productKey}/usedRecipeId`).on('value', data => {
            if(data.val() === '' || data.val() === null){
                setIsUsed(false);
            }
            else{
                setIsUsed(true);
            }
        })
    })

    const handleSave = () => {
        if(tempValue !== ''){
            props.fireDb.child(`devices/${props.productKey}/manuel`).update({
                start: false,
                setTemp: tempValue,
            }, (err) => {
                if(!err) {
                    setTempValue('');
                }
            })
            
        }
        else{
            setError("* Please do not leave blank");
        }
    }

    const handleStart = () => {
        if(setTemp !== ''){
            if(!isUsed){
                //
                props.fireDb.child(`devices/${props.productKey}/manuel`).update({
                    start: true
                }, (err) => {
                    //
                })
                setError('');
                //
            }
            else{
                setError('* There is an automatic recipe in use!');
            }
        }
        else{
            setError("* Please save a value");
        }
    }

    const handleStop = () => {
        if(start) {
            props.fireDb.child(`devices/${props.productKey}/manuel`).update({
                start: false
            });
        }
    }
    return (
        
        <div className="container">
            <div className="row">
                <div className="col-12 col-sm-6 col-lg-6 col-xl-6 mt-5">
                    <div className="card panel-card">
                        <h2 className="text-center mb-3 mt-3" style={{fontSize: 'x-large'}}>Actual Temperature</h2>
                        <h2 className="text-center mb-3" style={{fontSize: 'x-large'}}>{props.temp} &#8451;</h2>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-6 col-xl-6 mt-5">
                    <div className="card panel-card">
                        <h2 className="text-center mb-3 mt-3" style={{fontSize: 'x-large'}}>Set Temperature</h2>
                        <h2 className="text-center mb-3" style={{fontSize: 'x-large'}}>{setTemp ? setTemp : 0} &#8451;</h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-lg-4 col-sm-3"></div>
                <div className="col-12 col-lg-4 col-sm-6 mt-3">
                    <div className="card panel-card">
                        <label htmlFor="txtSetTemp"><span>Set Temp</span></label>
                        <input type="text" inputmode="numeric" id="txtSetTemp" name="tempValue" value={tempValue} className="form-control mb-2" onChange={handleChange}/>
                        <label id="login-error">{error ? error : null}</label>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-sm-3"></div>
            </div>
            <div className="row">
                <div className="col-12 col-lg-4 col-sm-3"></div>
                <div className="col-12 col-lg-4 col-sm-6">
                    <div className="row">
                        <div className="col-6 col-sm-6">
                            {
                                tempValue != '' ? (
                                    start ? 
                                    (<button className="btn btn-primary btn-block mt-3 mb-3" disabled>
                                        <i id="manuel-icon" className="fa fa-save" aria-hidden="true"></i>
                                        Save
                                    </button>) : (
                                        <button className="btn btn-primary btn-block mt-3 mb-3" onClick={handleSave} >
                                            <i id="manuel-icon" className="fa fa-save" aria-hidden="true"></i>
                                            Save
                                        </button>
                                    )
                                ) : null 
                            }
                            
                            {
                                tempValue == '' ? (
                                    start ? 
                                    (<button className="btn btn-primary btn-block mt-3 mb-3" disabled>
                                        <i id="manuel-icon" className="fa fa-save" aria-hidden="true"></i>
                                        Save
                                    </button>) : (
                                        <button className="btn btn-primary btn-block mt-3 mb-3" onClick={handleSave} disabled >
                                            <i id="manuel-icon" className="fa fa-save" aria-hidden="true"></i>
                                            Save
                                        </button>
                                    )
                                ) : null 
                            }
                        </div>
                        
                        <div className="col-6 col-sm-6">
                            {
                                tempValue == '' ? (
                                    <button className={start ? 'btn btn-danger btn-block mt-3 mb-3' : 'btn btn-success btn-block mt-3 mb-3'} onClick={start ? handleStop : handleStart} >
                                    <i id="manuel-icon" className={start ? "fa fa-stop" : "fa fa-check"} aria-hidden="true"></i>
                                    {start ? 'Stop' : 'Start'}
                                </button>
                                ) : null
                            }

                            {
                                tempValue != '' ? (
                                    <button className={start ? 'btn btn-danger btn-block mt-3 mb-3' : 'btn btn-success btn-block mt-3 mb-3'} onClick={start ? handleStop : handleStart} disabled>
                                    <i id="manuel-icon" className={start ? "fa fa-stop" : "fa fa-check"} aria-hidden="true"></i>
                                    {start ? 'Stop' : 'Start'}
                                </button>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
                <div className="col-6 col-lg-4 col-sm-3"></div>
            </div>
        </div>
    )
} 

export default ManuelPage;