import { useState, useEffect } from "react";
import fetchData from "../fetchData.js";

import { logIn, getToken } from "../logIn.js";

export default function Library() {
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
            sessionStorage.setItem("redirect", "library");
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
                .catch(() => {
                    console.log("Could not fetch token");
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
            console.log("fetch fired");
            fetchData(`https://api.spotify.com/v1/me/playlists?offset=0&limit=50`, updateData);
        }

    }, [token, state]);

    const updateData = (newData, pend, err) => {
        setContent(newData);
        setPending(pend);
        setError(err);
    }

    return (
        <div className="Library">
            <h1 className="headings">Library</h1>
            <hr style={{ marginBottom: "5vh" }} />

            {content && <div id="lib">
                {content.items.map((playlist) => (

                    <div className="list">
                        <div className="images"> <img src={playlist.images[0].url} style={{ width: "8vh", height: "8vh" }} /> </div> {playlist.name}
                        <br />
                        <br />
                        <br />
                    </div>

                ))}
            </div>}

            {pending && <p> Loading... </p>}
            {error && <p> An error ocurred, please refresh. {error} </p>}

        </div>
    );
}
