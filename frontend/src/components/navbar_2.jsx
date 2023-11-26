import React from "react";
import Package from "../../package.json";
import { NavLink } from "react-router-dom";
import "../css/navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

const api = Package.proxy;


function Navbar({ user }) {
    return (
        <header className="header-area header-sticky background-header">
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

                            <ul className="nav">
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
                            <a className='menu-trigger'>
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