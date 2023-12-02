import React from "react";
// import Joi from "joi-browser";
import FormDjango from "../base/formDjango";
import { useParams, useNavigate, useLocation } from "react-router";
import request from "../services/requestService";
// import DeleteData from '../base/deleteData';
import { NavLink } from "react-router-dom";



function Customer(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    request.setUrl("auth/users/");

    return (

        <React.Fragment>
            <div className="page-heading header-text" style={{ paddingBottom: 60, paddingTop: 100 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>{props.user ? props.user.username : navigate("/customers")}</h3>
                            <span><NavLink to="/">Home</NavLink>{"> "}{props.user ? props.user.username : navigate("/customers")}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container" style={{ padding: 20 }}>
                <FormDjango
                    navigate={navigate}
                    location={location}
                    // urlForm={baseUrl}
                    id={params.id}
                />
                {/* <DeleteData
                    // urlDelete={baseUrl}
                    // toPath={"/"}
                    formData={[{
                        name: "current_password",
                        label: "Current Password",
                        type: "password"
                    }]}
                    data={{ current_password: "" }}
                    schema={{ current_password: Joi.string().label("Password").required() }}
                    id={params.id}
                    location={location}
                    navigate={navigate}
                ></DeleteData> */}
            </div>

        </React.Fragment>
    );
}

export default Customer;
