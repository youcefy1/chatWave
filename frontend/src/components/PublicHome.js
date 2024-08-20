import Navbar from "./Navbar";
import ScrollRevealElement from "./ScrollRevealElement";
import Endbar from "./Endbar";
import "../styles/PublicHome.css";

const PublicHome = () => {
    return (
        <div>
            <Navbar />
            <div className="container-fluid text-center" id="container">
            <img src="logo4.jpg" alt="" className="img-fluid" id="logo" />
                <h1 id="intro">Connect with ChatWave: Introducing Our Chat App</h1>
                <h1 id="des">Your Gateway to Seamless Communication</h1>
                <a href="/register"><button className="btn btn-dark btn-lg">Get Started Today</button></a>
            </div>
            <ScrollRevealElement />
            <Endbar />
        </div>
    )
}
export default PublicHome;