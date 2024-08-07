import React from "react";
import ShowData from '../base/showData';
// import { useNavigate } from "react-router";
import request from "../services/requestService";
import { NavLink } from "react-router-dom";
// import hert from "bootstrap-icons/icons/bootstrap-icons.svg#heart-fill"



function showObject(item) {
    return (
        <div class="col-lg-3 col-md-6">
            <div class="item">
                <div class="thumb">
                    <NavLink to={`arts/${item.id}`}><img src={item.image && item.show_art ? item.image : "http://localhost:8000/media/Base/Nothing_2.jpg"} alt="" /></NavLink>
                    <span class="price">{item.price && `$${item.price}`}</span>
                </div>
                <div class="down-content">
                    <span class="category">Name</span>
                    <h4>{item.name}</h4>
                    <NavLink to={`arts/${item.id}`}><i class="fa fa-shopping-bag"></i></NavLink>
                </div>
            </div>
        </div>
    );
}



function showObjects(items) {
    return items.results.map(item => showObject(item));
}



function Home(props) {
    // const navigate = useNavigate();
    // const location = useLocation();

    request.setUrl("market/arts/");

    return (
        <React.Fragment>
            <div className="page-heading header-text" style={{ paddingBottom: 60, paddingTop: 100 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>Home</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section trending">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6" style={{"max-width": "50%"}}>
                            <div class="section-heading">
                                <h6>Trending</h6>
                                <h2>Trending Arts</h2>
                            </div>
                        </div>
                        <div class="col-md-6" style={{"max-width": "50%"}}>
                            <div class="main-button">
                                <NavLink to="/arts">View All</NavLink>
                            </div>
                        </div>

                        <ShowData showObjects={showObjects} name="arts"></ShowData>

                    </div>
                </div>
            </div>

        </React.Fragment>
    );
}

export default Home;