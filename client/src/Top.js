import "./top.css";

import { useState, useEffect } from "react";
import fetchData from "./fetchData.js";

import { logIn, getToken } from "./logIn.js";

export default function Top() {
    const [range, setRange] = useState("long_term");
    const [type, setType] = useState("tracks");

    const [content, setContent] = useState(null);
    const [pending, setPending] = useState(true);
    const [error, setError] = useState(null);

    const unpackToken = sessionStorage.getItem("token") === "null" ? null : sessionStorage.getItem("token");
    const [token, setToken] = useState(unpackToken);

    const unpackExpiry = sessionStorage.getItem("expiry");
    const expiry = unpackExpiry === "null" ? null : parseFloat(unpackExpiry);
    console.log("session token: ", token);


    const unpackState = sessionStorage.getItem("state") === "null" ? null : sessionStorage.getItem("state");
    const [state, setState] = useState(unpackState);

    useEffect(() => {
        console.log("log in update");

        if (!state) {
            sessionStorage.setItem("redirect", "top");
            console.log("redir: ", sessionStorage.getItem("redirect"));
            logIn();
            console.log("logging in");
        }

        else if (state && !token) {
            getToken()
                .then(() => {
                const newToken = sessionStorage.getItem("token");
                setToken(newToken);
                console.log("newToken: ", newToken);
            })
            .catch(() =>{
                console.log("Could not fetch token");
                setError(true);
            });
        }
    }, [state, token]);

    useEffect(() => {
        console.log(expiry);
        const current_time = new Date().getHours() + new Date().getMinutes() / 60;
        console.log(current_time);
        if (expiry) {
            if (current_time - expiry >= 1 || current_time < expiry) {
                console.log("reset fired");
                setState(null);
                setToken(null);
                sessionStorage.setItem("state", null);
                sessionStorage.setItem("token", null);
                sessionStorage.setItem("expiry", null);
                console.log("creds set to null");
            }
        }

        console.log("token: ", token);

        if (token) {
            setPending(true);
            console.log("fetch fired");
            fetchData(`https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=50&offset=0`, updateData);
        }

    }, [range, type, token, state]);

    const updateData = (newData, pend, err) => {
        setContent(newData);
        setPending(pend);
        setError(err);
    }

    return (
        <div className="Top">
            <p className="headings">Your Top Content</p>

            <div id="args">
                <div id="type">
                    <div id="tracks" className={`input ${(type === "tracks") ? "clicked": ""}`} onClick={(e) => setType(e.target.id)}> Tracks </div>
                    <div id="artists" className={`input ${(type === "artists") ? "clicked" : ""}`} onClick={(e) => setType(e.target.id)}> Artists </div>
                </div>

                <div id="range">
                    <div id="short_term" className={`input ${(range === "short_term") ? "clicked" : ""}`} onClick={(e) => setRange(e.target.id)}> 4 weeks </div>
                    <div id="medium_term" className={`input ${(range === "medium_term") ? "clicked" : ""}`} onClick={(e) => setRange(e.target.id)}> 6 months </div>
                    <div id="long_term" className={`input ${(range === "long_term") ? "clicked" : ""}`} onClick={(e) => setRange(e.target.id)}> All time </div>
                </div>

            </div>

            {(content && !pending) && <div id="items">
                {content.items.map((song, index) => (

                    <div className="item">
                        <div class="index">#{index+1}</div>
                        <div className="images"> <img src={
                            (type === "tracks") ? song.album?.images?.[0]?.url : 
                            (type === "artists") ? song.images?.[0]?.url :
                            null
                            } style={{ width: "8vh", height: "8vh" }} /> </div>
                        
                        <div className="song">
                            <div className="title"> {song.name} </div>
                            <div className="spacer"></div>
                            <div className="artist"> {song.artists?.[0].name} </div>
                        </div>
                    </div>

                ))}
            </div>}

            {pending && <p style={{ color: "rgb(30, 215, 96)"}}> Loading... </p>}
            {error && <p style={{ color: "rgb(30, 215, 96)" }}> An error ocurred, please refresh. {error} </p>}

        </div>
    );
}
