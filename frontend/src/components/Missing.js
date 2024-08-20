import { Link } from "react-router-dom"
import Navbar from "./Navbar"
import Endbar from "./Endbar"

const Missing = () => {
    return (
        <>
        <Navbar />
        <article style={{ padding: "100px" }}>
            <h1>Oops!</h1>
            <p>Page Not Found</p>
            <div className="flexGrow">
                <Link to="/">Visit Our Homepage</Link>
            </div>
        </article>
        <Endbar />
        </>
    )
}

export default Missing
