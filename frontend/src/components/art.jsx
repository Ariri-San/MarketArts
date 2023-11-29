import React, { useState } from "react";
import FormDjango from "../base/formDjango";
import DeleteData from '../base/deleteData';
import { useLocation, useNavigate, useParams } from "react-router";
import request from "../services/requestService";
import getData from '../services/getData';
import { NavLink } from "react-router-dom";
import "../css/art.css";



function showObject(state, setState, user) {
    // console.log(state);

    return (
        <>
            <div className="page-heading header-text" style={{ paddingBottom: 60, paddingTop: 100 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>{state.data.name}</h3>
                            <span>
                                <NavLink to="/">Home</NavLink>
                                {"> "}
                                <NavLink to="/arts">Arts</NavLink>
                                {"> "}
                                {state.data.name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="single-product section">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-7">
                            <div class="left-image">
                                <img className="img-thumbnail" alt="Not Found" src={state.data.image && state.data.show_art ? state.data.image : "http://localhost:8000/media/Base/Nothing_2.jpg"} />
                            </div>
                        </div>
                        <div class="col-lg-5 align-self-center">
                            <h2>{state.data.name}</h2>
                            <span class="price"><em>{state.data.last_price ? "$" + state.data.last_price : ""}</em> ${state.data.price}</span>
                            <p></p>
                            {user && <div className="add_cart">
                                {showAddCart(state.data.id, user) ?
                                    <button onClick={() => addCartItem(state.data.id, user)} type="submit"><i class="fa fa-shopping-bag"></i> ADD TO CART</button>
                                    : <button onClick={() => removeCartItem(state.data.id, user)} type="submit">Remove Item</button>
                                }
                            </div>}
                            <ul>
                                <li><span>Art ID:</span> {state.data.id}</li>
                                <li><span>Owner:</span> {state.data.owner.user.username}</li>
                                <li><span>Artist:</span> {state.data.artist.user.username}</li>
                            </ul>
                        </div>
                        <div class="col-lg-12">
                            <div class="sep"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="more-info">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="tabs-content">
                                <div class="row">
                                    <div class="nav-wrapper ">
                                        <ul class="nav nav-tabs" role="tablist">
                                            <li classn="nav-item" role="presentation">
                                                <button class={"nav-link" + (state.show.description ? " active" : "")} style={{ "border": "none" }} id="description-tab" data-bs-toggle="tab" type="button" role="tab" aria-controls="description" aria-selected={state.show.description} onClick={() => descriptionShow(true, state, setState)}>Description</button>
                                            </li>
                                            <li class="nav-item" role="presentation">
                                                <button class={"nav-link" + (state.show.description ? "" : " active")} style={{ "border": "none" }} id="reviews-tab" data-bs-toggle="tab" type="button" role="tab" aria-controls="reviews" aria-selected={state.show.description} onClick={() => descriptionShow(false, state, setState)}>Reviews (3)</button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="tab-content" id="myTabContent">
                                        <div className={"tab-pane fade" + (state.show.description ? " show active" : "")} id="description" role="tabpanel" aria-labelledby="description-tab">
                                            {state.data.descriptions && <p>{state.data.descriptions}</p>}
                                            <p>Coloring book air plant shabby chic, crucifix normcore raclette cred swag artisan activated charcoal. PBR&B fanny pack pok pok gentrify truffaut kitsch helvetica jean shorts edison bulb poutine next level humblebrag la croix adaptogen. Hashtag poke literally locavore, beard marfa kogi bruh artisan succulents seitan tonx waistcoat chambray taxidermy. Same cred meggings 3 wolf moon lomo irony cray hell of bitters asymmetrical gluten-free art party raw denim chillwave tousled try-hard succulents street art.</p>
                                        </div>
                                        <div className={"tab-pane fade" + (state.show.description ? "" : " show active")} id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                                            <p>Coloring book air plant shabby chic, crucifix normcore raclette cred swag artisan activated charcoal. PBR&B fanny pack pok pok gentrify truffaut kitsch helvetica jean shorts edison bulb poutine next level humblebrag la croix adaptogen. <br></br>Hashtag poke literally locavore, beard marfa kogi bruh artisan succulents seitan tonx waistcoat chambray taxidermy. Same cred meggings 3 wolf moon lomo irony cray hell of bitters asymmetrical gluten-free art party raw denim chillwave tousled try-hard succulents street art.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}


function descriptionShow(bool, state, setState) {
    setState({ data: state.data, show: { description: bool } });
}


function showAddCart(id, user) {
    if (!user) return false;
    for (const item of user.cart.items) {
        if (item.art.id === id) return false;
    }
    return true;
}


async function addCartItem(id, user) {
    try {
        await request.saveObject({ art: id }, "/market/customers/" + user.customer_id + "/carts/" + user.cart.id + "/items");
        window.location.reload();
    } catch (error) {
        request.showError(error);
    }
}


async function removeCartItem(id, user) {
    var item_id = null;
    for (const item of user.cart.items) {
        if (item.art.id === id) item_id = item.id;
    }

    try {
        await request.deleteObject(item_id, "/market/customers/" + user.customer_id + "/carts/" + user.cart.id + "/items/");
        window.location.reload();
    } catch (error) {
        request.showError(error);
    }
}


async function setData(id, setState, state) {
    try {
        if (!state) setState({ data: await getData(null, id), show: { description: true } });
    } catch (error) {
        request.showError(error);
    }
}


function Art(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    request.setUrl("/market/arts");


    const [state, setState] = useState(0);

    setData(params.id, setState, state);

    // console.log(state, props.user);


    if (state) return (
        <React.Fragment>

            {showObject(state, setState, props.user)}

            <div class="container" style={{ padding: 20 }}>

                {(props.user ? state.data.owner.user.id === props.user.id : false) &&
                    <>
                        <FormDjango
                            label={"Edit Art"}
                            navigate={navigate}
                            location={location}
                            // urlForm={baseUrl}
                            data={state.data}
                            id={params.id}
                            toPath={0}
                        />
                        <h2>Delete {params.id}</h2>
                        <DeleteData
                            // urlDelete={baseUrl}
                            toPath={"/arts"}
                            id={params.id}
                            location={location}
                            navigate={navigate}
                        ></DeleteData>
                    </>
                }
            </div>
        </React.Fragment >
    );
}

export default Art;