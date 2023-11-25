import auth from "../services/authService";

function Logout(props) {
    auth.logout();

    window.location = "/";
}

export default Logout;