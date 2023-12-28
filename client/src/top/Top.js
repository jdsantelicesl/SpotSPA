import React, { useState } from "react";

export default function Top({ logIn, logged, state, getToken }) {
    console.log("logged: ", logged);

    if (logged === false) {
        let result = logIn();
        console.log("prop: ", result);
        console.log("logged: ", logged);
        return (<div className="Top">Logging in</div>)
    }
    
    else if (logged === true) {
        const token = getToken();
        console.log("token: ", token)

    }

    return (
        <div className="Top">
            <h1 className="headings">Search</h1>
            <hr />
            <p className="sHeading">Your Top Content:</p>
            <div style={{ textAlign: "center" }}>
                <span style={{ display: "inline-block", textAlign: "left" }}>Select Filters:</span>
                <label for="range"> Time Range: </label>
                <select id="range">
                    <option value="short_term">Short Term</option>
                    <option value="medium_term">Medium Term</option>
                    <option value="long_term" selected>Long Term</option>
                </select>

                <label for="type"> Type: </label>
                <select id="type">
                    <option value="tracks" selected>Tracks</option>
                    <option value="artists">Artists</option>
                </select>
                <label for="numberInp">Enter a Number:</label>
                <input type="number" id="numberInp" placeholder="10" value="10" min="1" max="50" step="1" style={{ width: "2.5vw" }} />
                <button id="submit">Submit</button>
            </div>
            <div style={{ paddingLeft: "5vw", paddingRight: "5vw" }}><hr /></div>
            <p id="content"></p>

        </div>
    );
}
