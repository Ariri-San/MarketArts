import React from "react";
import FormDjango from "../base/formDjango";
import { useNavigate } from "react-router";
import auth from "../services/authService";
import request from "../services/requestService";
import { NavLink } from "react-router-dom";



function doResults(data, results) {
    auth.loginWithJwt(results.data.access, results.data.refresh);
    window.location = "/";
}



function Login(props) {
    const navigate = useNavigate();

    request.setUrl("auth/jwt/create/");

    return (
        <React.Fragment>
            <div className="page-heading header-text" style={{ paddingBottom: 60, paddingTop: 80 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>Login</h3>
                            <span><NavLink to="/">Home</NavLink>{"> Login"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container" style={{ padding: 20 }}>
                <FormDjango
                    navigate={navigate}
                    onResults={doResults}
                    optionsData={[{
                        object: "text",
                        key: ["username", "type"]
                    }]}
                />
            </div>


        </React.Fragment>
    );
}

export default Login;
