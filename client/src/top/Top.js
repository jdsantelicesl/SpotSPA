    import { useState, useEffect } from "react";
    import fetchData from "../fetchData.js";
    import useFetch from "../useFetch.js";

    import { logIn, getToken } from "../logIn.js";

    export default function Top() {
        const [range, setRange] = useState("long_term");
        const [type, setType] = useState("tracks");

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
            const current_time = new Date().getHours() + new Date().getMinutes()/60;
            console.log(current_time);  
            if(current_time - expiry >= 1 || current_time < expiry){
                console.log("reset fired");
                setState(null);
                setToken(null);
            }
            
            if(token){
                console.log("fetch fired");
                fetchData(`https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=50&offset=0`, updateData);
                console.log("content: ", content);
            }
            
        }, [range, type]);

        const updateData = (newData, pend, err) => {
            setContent(newData);
            setPending(pend);
            setError(err);
        }

        return (
            <div className="Top">
                <h1 className="headings">Search</h1>
                <hr />
                <p className="sHeading">Your Top Content:</p>
                
                <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-block", textAlign: "left" }}>Select Filters:</span>
                    <label htmlFor="range"> Time Range: </label>
                    <select id="range" value={range} onChange={(e) => setRange(e.target.value)}>
                        <option value="short_term">Short Term</option>
                        <option value="medium_term">Medium Term</option>
                        <option value="long_term" selected>Long Term</option>
                    </select>

                    <label htmlFor="type"> Type: </label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="tracks" selected>Tracks</option>
                        <option value="artists">Artists</option>
                    </select>
                    <button id="submit">Submit</button>
                </div>

                <div style={{ paddingLeft: "5vw", paddingRight: "5vw" }}><hr /></div>

            { content && <div id="top">
                    {content.items.map((song) => (

                        <div className="list">
                            {song.name}
                        </div>
                    
                    ))}
                    </div> }
                
            { pending && <p> Loading... </p>}
            { error && <p> An error ocurred, please refresh. {error} </p>}

            </div>
        );
    }
