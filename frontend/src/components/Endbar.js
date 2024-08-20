import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";


function Endbar() {
  return (
    <footer class="end-bar">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h4>Contact Us</h4>
            <p>
              If you have any questions or need assistance, feel free to reach
              out to our support team.
            </p>
            <p>Email: ChatWave@gmail.com</p>
          </div>
          <div class="col-md-6">
            <h4>Follow Us</h4>
            <ul className="social-icons">
              <li>
                <button
                  onClick={() => {
                    window.location.href = 'https://facebook.com';
                  }}
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </button>
              </li>
              <li>
              <button
                  onClick={() => {
                    window.location.href = 'https://twitter.com';
                  }}
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </button>
              </li>
              <li>
              <button
                  onClick={() => {
                    window.location.href = 'https://instagram.com';
                  }}
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Endbar;
