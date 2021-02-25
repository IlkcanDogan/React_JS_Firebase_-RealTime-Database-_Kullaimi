import React, {useState, useEffect} from 'react';
import NewRecipePage from './NewRecipePage';
import UsePage from './UsePage';
import { Button, Modal } from 'react-bootstrap';

const AutoPage = (props) => {
    props.setHome(false);
    if(!props.productKey) {
        props.setAuto(false);
        props.setProfile(false);
    }
    const [usePage, setUsePage] = useState(false);
    const [newRecipe, setNewRecipe] = useState(false);
    const [objectId, setObjectId] = useState('');

    const [isManuel, setIsManuel] = useState(false);
    const [table, setTable] = useState([]);
    const [isData,setIsData] = useState(false);

    const [show, setShow] = useState(false);
    const [warningShow, setWarningShow] = useState(false);

    const handleClose = () => {
        setShow(false); 
        setWarningShow(false);
    }
    useEffect(() => {
        props.fireDb.child(`devices/${props.productKey}/recipes`).on('value', data => {
            if(data.exists()){
                setIsData(true);
                var values = [];
                var items = data.val();
                values.push(items);
                setTable(...values);
            }else if(data.val() === null){
                setIsData(false);
            }
        })
        
    },[])

    useEffect(() => {
        props.fireDb.child(`devices/${props.productKey}/manuel/start`).on('value', data => {
            if(data.exists()){
                if(data.val()){
                    setIsManuel(true)
                }
                else{
                    setIsManuel(false)
                }
            }
            else{
                setIsManuel(false)
            }
        })
    })
    
    useEffect(() => {
        props.fireDb.child(`devices/${props.productKey}/usedRecipeId`).on('value', data => {
            if(data.exists()){
                //useRecipe(data.val());
                if(data.val() !== ''){
                    setUsePage(true);
                    setObjectId(data.val());
                }
            }
        })
    }, [])
    //#region Use Recipe
    const useRecipe = (objId) => {
        if(!isManuel){
            setObjectId(objId);
            setUsePage(true);
        }
        else{
            setWarningShow(true);
        }
    }
    //#endregion

    //#region Update Recipe
    const updateRecipe = (objId) => {
        setObjectId(objId);
        setNewRecipe(true);
    }
    //#endregion
    
    //#region Delete Modal
    const deleteModal = () => {
        return (
            <>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Recipe Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => deleteRecipe(objectId,true)}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
    //#endregion

    //#region Warning Modal
    const warningModal = () => {
        return (
            <>
                <Modal show={warningShow} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>There are manual settings currently in use!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        OK
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
    //#endregion

    //#region Delete Recipe
    const deleteRecipe = (objId,isDelete) => {
        setObjectId(objId);
        if(isDelete) {
            props.fireDb.child(`devices/${props.productKey}/recipes/${objId}`).remove().then(()=> {
                console.log("delete recipe!");
            })
            props.fireDb.child(`devices/${props.productKey}`).update({
                actualTime: '',
                continue: false,
                currentStep: '',
                start: false,
                usedRecipeId: '',
                waiting: false
            }, err => {
                console.log("Delete and update!");
            })
            setShow(false);
        }
        else{
            setShow(true);
        }
        
    }
    //#endregion
    
    return (
        <div className="container">
           {
             usePage ? <UsePage goBack={() => setUsePage(false)} useId={objectId} setUsePage={setUsePage} productKey={props.productKey} fireDb={props.fireDb}/> : 
            (
                newRecipe ? <NewRecipePage goBack={() => setNewRecipe(false)} updateId={objectId} productKey={props.productKey} fireDb={props.fireDb} thisPageClose={() => setNewRecipe(false)}/> : 
                <div> 
                        <div className="row">
                            <div id="new-recipe" className="mt-4" onClick={() => {setNewRecipe(true); setObjectId('')}}>
                                <span className="new-head"><i className="fa fa-plus fa-1x" aria-hidden="true"></i>&nbsp;&nbsp;New Recipe</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-2"></div>
                            <div className="col-12 col-lg-8">
                                <div className="card panel-card mt-3 mb-3">
                                    <div className="table-responsive">
                                        {deleteModal()}
                                        {warningModal()}
                                        {isData ? recipeTable(table,updateRecipe,deleteRecipe,useRecipe,props) : <label><i className="fa fa-th-list" aria-hidden="true"></i>&nbsp;&nbsp;Recipe not found!</label>}
                                    </div>
                                </div>
                            </div>			
                        </div>
                </div>
            )
           }
        </div>
    )
}

const recipeTable = (table,updateRecipe,deleteRecipe,useRecipe,props) => {
    var used = '';

    props.fireDb.child(`devices/${props.productKey}/usedRecipeId`).on('value', data => {
        if(data.exists()){
            used = data.val();
        }
    })
    return (
        <table className="table table-borderless">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col" style={{whiteSpace: 'nowrap'}}>Recipe Name</th>
                    <th scope="col" style={{whiteSpace: 'nowrap'}}>Steps</th>
                    <th scope="col" style={{whiteSpace: 'nowrap'}}>Total Time</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {   
                    Object.keys(table).map(id => {
                        return(
                            <tr key={id}>
                                <td scope="row"></td>
                                {
                                    table[id].name.length > 15 ? <td style={{whiteSpace: 'nowrap'}}>{table[id].name.substring(0,15)}...</td> : <td>{table[id].name}</td>
                                }
                                <td>{table[id].totalStep}</td>
                                <td>{table[id].totalTime}</td>
                                <td className="action-td">
                                    <button className="btn btn-success" onClick={() => useRecipe(id)}>
                                        <i className="fa fa-check fa-lg" aria-hidden="true"></i>
                                        &nbsp;&nbsp;{used === id ? 'Used' : 'Use'}
                                    </button>
                                    {
                                        used === id ? (
                                            <button className="btn  btn-primary" onClick={()=> updateRecipe(id)} disabled>
                                            <i className="fa fa-edit fa-lg" aria-hidden="true"></i>
                                            &nbsp;&nbsp;Edit
                                            </button>
                                        ): (
                                            <button className="btn  btn-primary" onClick={()=> updateRecipe(id) }>
                                            <i className="fa fa-edit fa-lg" aria-hidden="true"></i>
                                            &nbsp;&nbsp;Edit
                                            </button>
                                        )
                                    }
                                    <button className="btn btn-danger" onClick={()=> deleteRecipe(id,false)}>
                                        <i className="fa fa-trash fa-lg" aria-hidden="true"></i>
                                        &nbsp;&nbsp;Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table> 
    )
}


export default AutoPage;