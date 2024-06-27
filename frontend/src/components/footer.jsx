import React, {useState} from "react";
import { NavLink } from "react-router-dom";


function Footer({ user }) {
    return (
        <footer>
            <div class="container">
                <div class="col-lg-12">
                    <p>Copyright © 2048 LUGX Gaming Company. All rights reserved. &nbsp;&nbsp; <a rel="nofollow" href="http://shayan-projects.ir" target="_blank">Developer: Shayan Ghoddos</a></p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;