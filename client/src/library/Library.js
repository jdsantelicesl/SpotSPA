import { useState, useEffect } from "react";
import fetchData from "../fetchData.js";

import { logIn, getToken } from "../logIn.js";

export default function Library() {
    const [content, setContent] = useState(null);
    const [pending, setPending] = useState(true);
    const [error, setError] = useState(null);

    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const expiry = sessionStorage.getItem("expiry");
    console.log("session token: ", token);

    const [state, setState] = useState(sessionStorage.getItem("state"));

    useEffect(() => {
        console.log("log in update");
        if (!state) {
            logIn();
            console.log("logging in");
        }

        else if (state && !token) {
            getToken();
        }
    }, [state, token]);

    useEffect(() => {
        console.log(expiry);
        const current_time = new Date().getHours() + new Date().getMinutes() / 60;
        console.log(current_time);
        if (current_time - expiry >= 1 || current_time < expiry) {
            console.log("reset fired");
            setState(null);
            setToken(null);
        }

        if (token) {
            console.log("fetch fired");
            fetchData(`https://api.spotify.com/v1/me/playlists?offset=0&limit=50`, updateData);
            console.log("content: ", content);
        }

    }, []);

    const updateData = (newData, pend, err) => {
        setContent(newData);
        setPending(pend);
        setError(err);
    }

    return (
        <div className="Library">
            <h1 className="headings">Library</h1>
            <hr />

            {content && <div id="lib">
                {content.items.map((playlist) => (

                    <div className="list">
                        {playlist.name}
                    </div>

                ))}
                </div>}

            {pending && <p> Loading... </p>}
            {error && <p> An error ocurred, please refresh. {error} </p>}

        </div>
    );
}
