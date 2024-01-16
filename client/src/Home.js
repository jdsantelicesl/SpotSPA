import "./home.css";

import React, { useState } from "react";

export default function Home() {
    return (
        <div className="Home">
            <div id="intro">
                <div id="introText">
                    <div className="headings"> Your Spotify statistics <br/> at the tip of your fingers</div>
                    <div className="text"> Access your top artists and tracks. <br/>    See your most listened to content on different time frames.</div>

                    <div id="getStarted">
                        Log in to get started
                        <div id="logIn">
                            Log in
                        </div>
                    </div>
                </div>

                <div className="fade-container">
                    <img className="fade-image" src="/musicCollage.jpg" />
                    <div className="fade-mask"></div>
                </div>
            </div>
            
        </div>
    );
}
