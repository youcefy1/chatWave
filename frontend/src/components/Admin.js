import { Link } from "react-router-dom";
import Users from './Users';
import NavbarPrivate from "./NavbarPrivate";
import Endbar from "./Endbar";

const Admin = () => {
    return (
        <section>
            <NavbarPrivate />
            <h1>Admins Page</h1>
            <br />
            <Users />
            <br />
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
            <Endbar />
        </section>
    )
}

export default Admin
