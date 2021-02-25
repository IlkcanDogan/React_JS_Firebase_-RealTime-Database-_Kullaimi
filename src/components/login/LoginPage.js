import React, {Component} from 'react'
import InfoPanel from './InfoPanel'
import Sign from './Sign'

export default class LoginPage extends Component {

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <InfoPanel/>
                        <Sign/>
                    </div>
                </div>
            </div>
        )
    }
}
