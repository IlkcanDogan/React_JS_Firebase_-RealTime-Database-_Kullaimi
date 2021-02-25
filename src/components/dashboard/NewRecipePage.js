import React, {useState,useEffect,useContext} from 'react';
import { AuthContext } from '../extra/auth';

const NewRecipePage = (props) => {
	const { currentUser } = useContext(AuthContext);

	const db = props.fireDb;
	const productKey = props.productKey;
	const thisPageClose = props.thisPageClose;
	const objectId = props.updateId;

	const [emptyField, setEmptyField] = useState(false);
	const [buttonDisable, setButtonDisable] = useState(false);

	const [recipeName, setRecipeName] = useState('');
	const [steps, setSteps] = useState([{ stepTemp: '', stepTime: ''}]);
	//#region Steps
	const handleChangeSteps = (index, event) => {
		const values = [...steps];
		if(!isNaN(event.target.value.replace(',', '.'))){
			values[index][event.target.name] = event.target.value.replace(',', '.').trim();
			setSteps(values);
			setEmptyField(false);
        }
	}
	
	const addStep = () => {
		const values = [...steps, {
			stepTemp: '',
			stepTime: ''
		}]
		setSteps(values);
	}
	const removeStep = (index) => {
		const values = [...steps];
		values.splice(index, 1)
		setSteps(values);
	}
	//#endregion

	const [temp, setTemp] = useState('');
	//#region Temp
	const handleSetTemp = (event) => {
		if(!isNaN(event.target.value.replace(',', '.'))){
			setTemp(event.target.value.replace(',', '.').trim());
			setEmptyField(false);
        }
	}
	//#endregion

	const [times, setTimes] = useState({ time1: '', time2: '', time3: '' })
	//#region Times
	const handleSetTime = (event) => {
		const values = {...times};
		if(!isNaN(event.target.value.replace(',', '.'))){
			values[event.target.name] = event.target.value.replace(',', '.').trim();
			setTimes(values);
			setEmptyField(false);
        }

	}
	//#endregion

	//#region Save
	const handleSave = () => {
		var isEmpty = false;
		var totalTime = 0;
		var totalStep = steps.length;

		if(recipeName !== '' && temp !== '' && (times.time1 !== '' && times.time2 !== '' && times.time3 !== '')){
			steps.map(function(item,index) {
				totalTime += parseInt(item.stepTime);
				
				if(item.stepTemp === '' || item.stepTime === ''){
					isEmpty = true;
				}
			})

			if(!isEmpty){
				setButtonDisable(true);
				db.child(`devices/${productKey}`).update({
					userObjectId: currentUser.uid
				})

				db.child(`devices/${productKey}/recipes`).push({
					name: recipeName,
					totalTime: totalTime,
					totalStep: totalStep,
					temp: temp,
					steps: steps,
					hopAdd: times
				}, (err) => {
					if(!err){
						thisPageClose();
					}
					else{
						//
					}
				})
			}
			else{
				setEmptyField(true);
			}
		}
		else{
			setEmptyField(true);
		}
	}
	//#endregion
	
	//#region Prepare Update
	const prepareUpdate = () => {
		db.child(`devices/${productKey}/recipes/${objectId}`).on('value', data => {
			if(data.exists()){
				setRecipeName(data.val().name);
				setTemp(data.val().temp);
				setTimes(data.val().hopAdd);
				setSteps(data.val().steps);
			}
		})
	}

	useEffect(() => {
		if(objectId) {
			prepareUpdate();
		}
	},[])
	//#endregion
	
	//#region Update
	const recipeUpdate = () => {
		var isEmpty = false;
		var totalTime = 0;
		var totalStep = steps.length;

		if(recipeName !== '' && temp !== '' && (times.time1 !== '' && times.time2 !== '' && times.time3 !== '')){
			steps.map(function(item,index) {
				totalTime += parseInt(item.stepTime);
				
				if(item.stepTemp === '' || item.stepTime === ''){
					isEmpty = true;
				}
			})

			if(!isEmpty){
				setButtonDisable(true);
				db.child(`devices/${productKey}/recipes/${objectId}`).update({
					name: recipeName,
					totalTime: totalTime,
					totalStep: totalStep,
					temp: temp,
					steps: steps,
					hopAdd: times
				}, (err) => {
					if(!err){
						thisPageClose();
					}
					else{
						//
					}
				})
			}
			else{
				setEmptyField(true);
			}
		}
		else{
			setEmptyField(true);
		}
	}
	//#endregion

	return (
        <div className="row" >
			<div className="col-12 col-lg-3"></div>
			<div className="col-12 col-lg-6">
				<div className="card panel-card mt-5 mb-5">
					<div className="row">
						<div className="col-12">
							<div className="form-group">
								<label for="txtRecipeName" className="new-head">Recipe Name</label>
								<input id="txtRecipeName" style={{whiteSpace: 'nowrap'}} type="text" className="btn-block" name="recipeName" autoComplete="off" value={recipeName} onChange={(event) => { setRecipeName(event.target.value); setEmptyField(false);}}/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-6">
							<div className="form-group">
								<span for="txtTempature" className="new-head" style={{whiteSpace: 'nowrap'}}>Temperature </span>
								<input id="txtTempature" inputmode="numeric" type="text" placeholder="&#8451;" className="new-recipe-input" autoComplete="off" value={temp} onChange={(event) => handleSetTemp(event)}/>
							</div>
						</div>
					</div>
					{
						steps.map(function(item,index) {
							return (
								<div className="row" key={index}>
									<div className="col-2">
										<div className="form-group new-head">
											<span style={{whiteSpace: 'nowrap'}}>Step {index + 1}</span>
										</div>
									</div>
									<div className="col-4">
										<div className="form-group">
											<span for="txtTemp" style={{whiteSpace: 'nowrap'}}>Temp: </span>
											<input name="stepTemp" style={{whiteSpace: 'nowrap'}} placeholder="&#8451;" inputmode="numeric" type="text" className="new-recipe-input" autoComplete="off" value={item.stepTemp} onChange={(event) => handleChangeSteps(index,event)}/>
										</div>
									</div>
									<div className="col-4">
										<div className="form-group">
											<span for="txtTime" style={{whiteSpace: 'nowrap'}}>Time: </span>
											<input name="stepTime" style={{whiteSpace: 'nowrap'}} placeholder="min" inputmode="numeric" type="text" className="new-recipe-input" autoComplete="off" value={item.stepTime} onChange={(event) => handleChangeSteps(index,event)}/>
										</div>
									</div>
									<div className="col-2">
										{
											steps.length === 1 ? null : <span onClick={() => removeStep(index)}><i className="fa fa-close mt-1 cursor" aria-hidden="true"></i></span>
										}
									</div>
								</div>
							)
						})
					}
					
					<div className="row">
						<div className="col-12">
							<div className="form-group cursor" onClick={addStep}>
								<span><i className="fa fa-plus mt-3" aria-hidden="true"></i> Add Step</span>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-3">
							<div className="form-group new-head">
								<span>Hop Add</span>
							</div>
						</div>
						<div className="col-3" id="hot-add">
							<div className="form-group">
								<span style={{whiteSpace: 'nowrap'}} >Time: </span>
								<input type="text" placeholder="min" inputmode="numeric" className="hot-time" name="time1" autoComplete="off" value={times.time1} onChange={(event) => handleSetTime(event)}/>
							</div>
						</div>
						<div className="col-3">
							<div className="form-group">
								<span style={{whiteSpace: 'nowrap'}}>Time: </span>
								<input type="text" placeholder="min" inputmode="numeric" className="hot-time" name="time2" autoComplete="off" value={times.time2} onChange={(event) => handleSetTime(event)}/>
							</div>
						</div>
						<div className="col-3">
							<div className="form-group">
								<span style={{whiteSpace: 'nowrap'}}>Time: </span>
								<input type="text" placeholder="min" inputmode="numeric" className="hot-time" name="time3" autoComplete="off" value={times.time3} onChange={(event) => handleSetTime(event)}/>
							</div>
						</div>

					</div>
					{
						emptyField ? <label id="login-error">* Please do not leave blank!</label> : null
					}
					<div>
						{
							buttonDisable ? (
								<div className="form-group mt-3" style={{float: 'right'}}>
									<button type="button" className="btn btn-danger mr-2" onClick={props.goBack} disabled>
										<i className="fa fa-close" aria-hidden="true"></i>
										&nbsp;&nbsp;Cancel
									</button>
									<button type="button" className="btn btn-success" onClick={objectId ? recipeUpdate : handleSave} disabled>
										<i className={objectId ? 'fa fa-refresh' : 'fa fa-save'} aria-hidden="true"></i>
										&nbsp;&nbsp;{objectId ? 'Update' : 'Save'}
									</button>
								</div>
							) : (
								<div className="form-group mt-3" style={{float: 'right'}}>
									<button type="button" className="btn btn-danger mr-2" onClick={props.goBack} >
										<i className="fa fa-close" aria-hidden="true"></i>
										&nbsp;&nbsp;Cancel
									</button>
									<button type="button" className="btn btn-success" onClick={objectId ? recipeUpdate : handleSave}>
										<i className={objectId ? 'fa fa-refresh' : 'fa fa-save'} aria-hidden="true"></i>
										&nbsp;&nbsp;{objectId ? 'Update' : 'Save'}
									</button>
								</div>
							)
						}
					</div>
				</div>
			</div>
			<div className="col-12 col-lg-3"></div>
		</div>
    )
} 

export default NewRecipePage;