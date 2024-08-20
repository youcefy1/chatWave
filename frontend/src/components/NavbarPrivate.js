import React from "react";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router";
const NavbarPrivate = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/home');
    }
  return (
    <React.Fragment>
      
      <div className="App">
        <nav className="navbar navbar-expand-lg" id="navv">
          <div className="container-fluid">
             
            <a className="navbar-brand" href={"/"} id="logo1">
              <img src="logo4.jpg" id="logo2" alt="ChatWave" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active me-2" aria-current="page" href={"/"} style={{color: "#ffffff"}}>
                    Home
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle me-4"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{color: "#ffffff"}}
                    >
                    Dropdown
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href={"/"}>
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href={"/"}>
                        Another action
                      </a>
                    </li>
                    <li className="dropdown-divider"></li>       
                    <li>
                      <a className="dropdown-item" href={"/"}>
                        Something else here
                      </a>
                    </li>
                  </ul>
                </li>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                      <li className="nav-but">
                        <button className="btn btn-light me-3" onClick={signOut}>Sign Out</button>
                      </li>
                      </ul>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </React.Fragment>
  );
};
export default NavbarPrivate;
