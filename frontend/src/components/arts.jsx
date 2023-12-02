import React, { useState } from "react";
import FormDjango from "../base/formDjango";
import ShowData from '../base/showData';
import { useNavigate, useLocation } from "react-router";
import request from "../services/requestService";
import getData from '../services/getData';
import { NavLink } from "react-router-dom";
import "../css/arts.css";


function pagination(links) {
    return (
        <div class="row">
            <div class="col-lg-12">
                <ul class="pagination">
                    <li><a href={links.previous_url ? links.previous_url.replace("http://localhost:8000/market", "") : ""}> &lt; </a></li>
                    {links.page_links.map(item =>
                        <li><a
                            className={item[2] ? "is_active" : ""}
                            href={item[0] ? item[0].replace("http://localhost:8000/market", "") : ""}>
                            {item[1] ? item[1] : "..."}
                        </a></li>
                    )}
                    <li><a href={links.next_url ? links.next_url.replace("http://localhost:8000/market", "") : ""}> &gt; </a></li>
                </ul>
            </div>
        </div >
    );
}

function showObject(item) {
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
    return items.results.map(item => showObject(item));
}


async function setData(setState, state) {
    try {
        if (!state.data) {
            setState({ data: await getData(), ...state });
        }
    } catch (error) {
        request.showError(error);
    }
}


function Arts(props) {
    const navigate = useNavigate();
    const location = useLocation();

    request.setUrl("/market/arts/" + location.search);

    const fields = location.search.replace("?", "").split("&");
    const state_field = {};
    for (const field of fields) {
        var index = field.search("=");
        state_field[field.slice(0, index)] = field.slice(index + 1);
    }
    // console.log(state_field);
    const [state, setState] = useState({
        search: state_field["search"],
        ordering: state_field["ordering"],
        page: state_field["page"],
    });

    setData(setState, state);

    console.log(state);

    return (
        <React.Fragment>
            <div className="page-heading header-text" style={{ paddingBottom: 60, paddingTop: 100 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>Arts</h3>

                            <span><NavLink to="/">Home</NavLink>{"> Arts"}</span>
                            <div class="search">
                                <form id="search">
                                    <input
                                        type="text"
                                        defaultValue={state.search}
                                        placeholder="Type Something"
                                        id="search"
                                        name="search"
                                        onkeypress="handle"
                                    />

                                    <button>Search Now</button>
                                    <select defaultValue={state.ordering} id="ordering" name="ordering">
                                        <option value="name">A to Z</option>
                                        <option value="-name">Z to A</option>
                                        <option value="id">Id</option>
                                        <option value="-id">-Id</option>
                                    </select>
                                </form>
                            </div>
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
                        {/* <div class="col-lg-6">
                            <div class="main-button">
                                <a href="shop.html">View All</a>
                            </div>
                        </div> */}

                        {state.data && <ShowData data={state.data} showObjects={showObjects} name="arts"></ShowData>}

                    </div>
                </div>
            </div>

            {state.data && pagination(state.data.links)}

            <main className="container">


                {props.user &&
                    <FormDjango navigate={navigate} label={"Form Arts"} toPath={0} />
                }
            </main>

        </React.Fragment>
    );
}

export default Arts;