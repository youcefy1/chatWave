import React, { useState, useEffect } from "react";
import "../ScrollRevealElement.css";

function ScrollRevealElement() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".reveal-element");
      const windowHeight = window.innerHeight;

      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight) {
          element.classList.add("visible");
        } else {
          element.classList.remove("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <React.Fragment>
      <div
        className={`reveal-element ${isVisible ? "visible" : ""}`}
        id="reveal-element"
      >
        <div className="container-fluid text-center">
          <h1 id="intro2">Why Communication Matters?</h1>
          
          <h1 id="info">
            Effective communication is the bedrock of personal and professional
            relationships. It's the key to understanding, collaboration, and
            growth. In today's fast-paced world, we need a reliable chat app to
            facilitate this essential human connection.
          </h1>
          
        </div>
      </div>
      <div
        className={`reveal-element ${isVisible ? "visible" : ""}`}
        id="reveal-element"
      >
        <div className="container-fluid text-center">
          <h1 id="intro3">Simplify Conversations, Elevate Connections</h1>
          <h1 id="info">
            Real-Time Messaging: Enjoy instant conversations that keep up with
            your pace.
          </h1>
          <br />
          <h1 id="info">
            Multimedia Sharing: Share photos, videos, and documents
            effortlessly.
          </h1>
          <br />
          <h1 id="info">
            Privacy & Security: Your data is our top priority; we've got you
            covered.
          </h1>
        </div>
      </div>
      <div
        className={`reveal-element ${isVisible ? "visible" : ""}`}
        id="reveal-element"
      >
        <div className="container-fluid text-center">
          <h1 id="intro3">Your Privacy Matters</h1>
          <h1 id="info" className="info3">
            Your privacy is paramount to us. We employ the latest security
            measures to safeguard your data, providing you with peace of mind as
            you connect with others.
          </h1>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ScrollRevealElement;
