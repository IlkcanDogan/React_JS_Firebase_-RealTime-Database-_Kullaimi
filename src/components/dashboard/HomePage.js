import React, {useContext, useState, useEffect} from 'react';

const HomePage = (props) => {
    //console.log(props);
    return (
        <div className="container">
            <div className="row mb-5">
                <div className="middle col-11 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                    <div className="card panel-card text-center">
                        <h2 className="mb-3 mt-3" style={{fontSize: 'x-large'}}>Actual Temperature</h2>
                        <h2 className="text-center mb-3" style={{fontSize: 'x-large'}}>{props.temp} &#8451;</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;