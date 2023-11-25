import "./App.css";
// import axios from "axios";
import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router";
import request from "./services/requestService";
import auth from "./services/authService";
import Customer from "./components/customer";
import Customers from "./components/customers";
// import Navbar from "./components/navbar";
import Navbar from "./components/navbar_2";
import Login from "./components/login";
import Logout from "./components/logout";
import Arts from "./components/arts";
import Art from "./components/art";
import Home from "./components/home";

class App extends Component {
    state = {};

    async componentDidMount() {
        try {
            const user = auth.getCurrentUser();
            const result = await request.getObjects(
                "/auth/users",
                user.user_id
            );
            this.setState({
                user: {
                    username: result.data.username,
                    id: user.user_id,
                },
            });
        } catch (error) {}
    }

    render() {
        return (
            <React.Fragment>
                <ToastContainer />
                <Navbar user={this.state.user} />
                <Routes>
                    <Route path="/customers" element={<Customers />}></Route>
                    <Route
                        path="/customers/:id"
                        element={<Customer user={this.state.user} />}
                    ></Route>
                    <Route
                        path="/"
                        element={<Home user={this.state.user} />}
                    ></Route>
                    <Route
                        path="arts"
                        element={<Arts user={this.state.user} />}
                    ></Route>
                    <Route
                        path="arts/:id"
                        element={<Art user={this.state.user} />}
                    ></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/logout" element={<Logout />}></Route>
                </Routes>
            </React.Fragment>
        );
    }
}

export default App;
