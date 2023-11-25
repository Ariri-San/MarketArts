import React from "react";
import ShowData from '../base/showData';
// import { useNavigate } from "react-router";
import request from "../services/requestService";
import { NavLink } from "react-router-dom";



function showObject(item) {
    // console.log(item);

    return (
        <div class="col-lg-3 col-md-6">
            <div class="item">
                <div class="thumb">
                    <NavLink to={`${item.id}`}><img src={item.image && item.show_art ? item.image : "http://localhost:8000/media/Base/Nothing_2.jpg"} alt="" /></NavLink>
                    <span class="price">{item.price && `$${item.price}`}</span>
                </div>
                <div class="down-content">
                    <span class="category">Name</span>
                    <h4>{item.name}</h4>
                    <NavLink to={`${item.id}`}><i class="fa fa-shopping-bag"></i></NavLink>
                </div>
            </div>
        </div>
    );
}



function showObjects(items) {
    // console.log(items);
    if (items[0]) return items.map(item => showObject(item.art));
}



function Cart(props) {
    // const navigate = useNavigate();
    // const location = useLocation();

    request.setUrl("/market/customers/" + props.user.customer_id + "/carts");
    // console.log(props.user.cart, props.user.cart.items);

    return (
        <React.Fragment>
            <div className="page-heading header-text" style={{ paddingBottom: 60, paddingTop: 100 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>Cart</h3>
                            <span><NavLink to="/">Home</NavLink>{"> Cart"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section trending">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="section-heading">
                                <h6>Trending</h6>
                                <h2>Trending Arts</h2>
                            </div>
                        </div>

                        <ShowData data={props.user.cart.items} showObjects={showObjects} name="arts"></ShowData>

                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default Cart;