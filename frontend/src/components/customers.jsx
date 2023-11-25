import React from "react";
import FormDjango from "../base/formDjango";
import Joi from "joi-browser";
// import ShowData from '../base/showData';
import { useNavigate } from "react-router";
import auth from "../services/authService";
import request from "../services/requestService";
import { NavLink } from "react-router-dom";



async function results(data, results) {
    await auth.login(data.user.username, data.user.password);
    window.location.replace(window.location.origin);
}


function Customers(props) {
    const navigate = useNavigate();
    // const location = useLocation();

    request.setUrl("/market/customers");

    return (
        <React.Fragment>
            <div className="page-heading header-text" style={{ paddingBottom: 60, paddingTop: 100 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>Register</h3>
                            <span><NavLink to="/">Home</NavLink>{"> Register"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container" style={{ padding: 20 }}>
                <FormDjango
                    navigate={navigate}
                    schema={[{ object: Joi.string().label("Password").required().min(8), key: ['user', 'password'] }]}
                    onResults={results}
                />
            </div>

        </React.Fragment>
    );
}

export default Customers;