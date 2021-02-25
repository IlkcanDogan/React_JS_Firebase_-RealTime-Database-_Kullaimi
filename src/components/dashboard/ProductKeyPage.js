import React, {useState} from 'react';

const ProductKeyPage = (props) => {
    const initValues = {
        productKey: ''
    }

    var [values, setValues] = useState(initValues);
    const [success, setSuccess] = useState(true);

    const handleChange = (event) => {
        var {name, value} = event.target
        setValues({
            ...values,
            [name]: value
        })
        setSuccess(true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.productKey(values,setSuccess);
    }
    return (
        <div class="container">
            <div class="row">
                <div className="middle col-11 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                    <div class="card panel-card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Please enter the product key</label>
                                <input type="text" autoComplete="off" className="form-control" name="productKey" value={values.productKey} onChange={handleChange}/>
                                {
                                    success ? null : <label id="login-error" className="mt-2 ">
                                        * Error! Please make sure you typed the product key correctly and check the internet connection of the device.
                                    </label>
                                }
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">
                                Enter
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductKeyPage;