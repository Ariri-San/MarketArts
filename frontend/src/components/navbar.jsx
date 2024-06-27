import React, {useState} from "react";
import Package from "../../package.json";
import { NavLink } from "react-router-dom";
import "../css/navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

const api = Package.proxy;


function change_menu(state, setState){
    if (state.show_menu == true){
        setState({show_menu: false, scroll_up: state.scroll_up})
    }
    else{
        setState({show_menu: true, scroll_up: state.scroll_up})
    }
}

function listen_scroll(state, setState){
    if (window.scrollY > 300){
        setState({scroll_up: false, show_menu: state.show_menu});
    }
    else {
        setState({scroll_up: true, show_menu: state.show_menu});
    }
}

function Navbar({ user }) {
    const [state, setState] = useState({scroll_up: true, show_menu: false});

    window.addEventListener("scroll", () => listen_scroll(state, setState));

    return (
        <header className={"header-area header-sticky" + (state.scroll_up ? "" : " background-header")}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <nav className="main-nav">
                            {/* <!-- ***** Logo Start ***** --> */}
                            <div className="shopping_cart">
                                <NavLink className="logo">
                                    <img src={`${api}/media/logo/logo.png`} alt="" style={{ "width": 158 }} />
                                </NavLink>
                                {user && <NavLink to="/cart" className="shopping_icon">
                                    <FontAwesomeIcon icon={faCartShopping} size="lg" />
                                </NavLink>}
                            </div>


                            {/* <!-- ***** Logo End ***** --> */}
                            {/* <!-- ***** Menu Start ***** --> */}

                            <ul className="nav" style={{"display" : state.show_menu ? "block" : null}}>
                                <li><NavLink to="/">Home</NavLink></li>
                                <li><NavLink to="/arts">Arts</NavLink></li>
                                {!user &&
                                    <React.Fragment>
                                        <li><NavLink to="/customers">Register</NavLink></li>
                                        <li><NavLink to="/login">Login</NavLink></li>
                                    </React.Fragment>
                                }
                                {user &&
                                    <React.Fragment>
                                        <li><NavLink to={`/customers/${user.id}`}>{user.username}</NavLink></li>
                                        <li><NavLink to="/logout">Logout</NavLink></li>
                                    </React.Fragment>
                                }
                            </ul>
                            <a className={'menu-trigger' + (state.show_menu ? " active" : "")} onClick={() => change_menu(state, setState)}>
                                <span>Menu</span>
                            </a>

                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;