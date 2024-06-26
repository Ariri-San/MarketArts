import React, { useState } from "react";
import FormDjango from "../base/formDjango";
import ShowData from '../base/showData';
import { useNavigate, useLocation } from "react-router";
import request from "../services/requestService";
import getData from '../services/getData';
import { NavLink } from "react-router-dom";
import config from "../config.json";
import "../css/arts.css";

const base_url = config.BaseUrl


function pagination(state, setState) {
    const links = state.data.links;

    return (
        <div class="row">
            <div class="col-lg-12">
                <ul class="pagination">
                    <li><NavLink
                        className={links.previous_url ? "" : "disable"}
                        to={links.previous_url ? links.previous_url.replace(base_url + "market", "") : ""}
                        onClick={() => changeState(state, setState)}
                    > &lt; </NavLink></li>

                    {links.page_links.map(item =>
                        <li><NavLink
                            className={(item[2] ? "is_active" : "") + (item[0] ? "" : " disable")}
                            to={item[0] ? item[0].replace(base_url + "market", "") : ""}
                            onClick={() => changeState(state, setState)}>
                            {item[1] ? item[1] : "..."}
                        </NavLink></li>
                    )}

                    <li><NavLink
                        className={links.next_url ? "" : "disable"}
                        to={links.next_url ? links.next_url.replace(base_url + "market", "") : ""}
                        onClick={() => changeState(state, setState)}
                    > &gt; </NavLink></li>
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


function changeState(state, setState) {
    setState({ ...state, change: false });
}


function customSubmit(event, state, setState, location, navigate) {
    event.preventDefault();

    const listFilter = ["search", "ordering", "page"];
    var first = true;
    location.search = "";

    for (const filter of listFilter) {
        if (state[filter]) {
            if (first) {
                location.search += `?${filter}=` + state[filter];
                first = false;
            }
            else location.search += `&${filter}=` + state[filter];
        }
    }

    navigate(location.search);
    changeState(state, setState);
}


async function setData(setState, state) {
    try {
        setState({ ...state, data: await getData(), change: true });
    } catch (error) {
        request.showError(error);
        setState({ ...state, change: true });
    }
}



function Arts(props) {
    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState({});

    request.setUrl("market/arts/" + (location.search ? location.search : ""));

    if (!state.change) setData(setState, state);
    // console.log(state);

    else return (
        <React.Fragment>
            <div className="page-heading header-text" style={{ paddingBottom: 60, paddingTop: 100 }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>Arts</h3>

                            <span><NavLink to="/">Home</NavLink>{"> Arts"}</span>
                            <div class="search">
                                <form id="search" onSubmit={event => customSubmit(event, state, setState, location, navigate)}>
                                    <input
                                        type="text"
                                        defaultValue={state.search}
                                        onChange={event => setState({ ...state, search: event.target.value })}
                                        placeholder="Type Something"
                                        id="search"
                                        name="search"
                                        onkeypress="handle"
                                    />

                                    <button>Search Now</button>
                                    <select
                                        defaultValue={state.ordering}
                                        id="ordering" name="ordering"
                                        onChange={event => setState({ ...state, ordering: event.target.value })}
                                    >
                                        <option value="">Id</option>
                                        <option value="-id">-Id</option>
                                        <option value="name">A to Z</option>
                                        <option value="-name">Z to A</option>
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
                                <h2>Trending Arts - {state.data.count}</h2>
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

            {state.data && pagination(state, setState)}

            <main className="container">


                {props.user &&
                    <FormDjango navigate={navigate} label={"Form Arts"} toPath={0} />
                }
            </main>

        </React.Fragment>
    );
}

export default Arts;