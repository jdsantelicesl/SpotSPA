import { logIn, getToken } from "../logIn.js";
import { useParams } from 'react-router-dom';


export default function Top() {
    let token = sessionStorage.getItem("token");
    let state = sessionStorage.getItem("state")

    let logged = false;
    let params = useParams();

    console.log(token);

    console.log("state: ", state)

    if(params.logged === "logged"){
        logged = true;
    }

    if(token == null || token == "undefined")
    {
        console.log("refresh");

        if (logged === false) {
            logIn();
            console.log("logged in")
            return (<div className="Top">Logging in...</div>)
        }
        
        else if (logged === true) {
            const token = getToken();
            console.log("got token")
            console.log("token: ", token);
            sessionStorage.setItem("token", token);
            console.log("token: ", token)

        }
    }

    return (
        <div className="Top">
            <h1 className="headings">Search</h1>
            <hr />
            <p className="sHeading">Your Top Content:</p>
            <div style={{ textAlign: "center" }}>
                <span style={{ display: "inline-block", textAlign: "left" }}>Select Filters:</span>
                <label htmlFor="range"> Time Range: </label>
                <select id="range">
                    <option value="short_term">Short Term</option>
                    <option value="medium_term">Medium Term</option>
                    <option value="long_term" selected>Long Term</option>
                </select>

                <label htmlFor="type"> Type: </label>
                <select id="type">
                    <option value="tracks" selected>Tracks</option>
                    <option value="artists">Artists</option>
                </select>
                <label htmlFor="numberInp">Enter a Number:</label>
                <input type="number" id="numberInp" placeholder="10" value="10" min="1" max="50" step="1" style={{ width: "2.5vw" }} />
                <button id="submit">Submit</button>
            </div>
            <div style={{ paddingLeft: "5vw", paddingRight: "5vw" }}><hr /></div>
            <p id="content"></p>

        </div>
    );
}
