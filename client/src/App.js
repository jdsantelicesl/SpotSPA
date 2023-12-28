import React, { useState } from "react";
import "./styles.css";

import Home from "./home/Home";
import About from "./about/About";
import Search from "./search/Search";
import Top from "./top/Top";
import Library from "./library/Library";

export default function App() {
    const [page, setPage] = useState("Home");
    let logged = false;
    let state;

    const logIn = () => {
        fetch("http://localhost:8888/userLog")
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not fullfill server request");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            //window.location.href = data.url;
            logged = true;
            return data;
        })
        .catch(error => {
            console.log(error.messsage);
        })
    };

    const getToken = async () => {
        let result;
        try {
            const response = await fetch(`http://localhost:8888/getToken/${state}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Auth response not ok");
            }

            result = await response.json();
        } catch (error) {
            return ("Auth response not ok");
        } finally {
            let token;
            if (result !== undefined) {
                token = result.token;
            }
            else {
                token = "";
            }
            return token;
        }

    };

    const pageSelect = (changePage) => {
        console.log("page changed");
        setPage(changePage);
    };

    return (
        <div className="App">
            <div className="hotbar">
                <p id="head" className="hSelec" onClick={() => pageSelect("home")}>
                    SpotMix
                </p>
                <div id="selec">
                    <span className="hSelec" onClick={() => pageSelect("about")}>
                        About
                    </span>
                    <span className="hSelec" onClick={() => pageSelect("search")}>
                        Search
                    </span>
                    <span className="hSelec" onClick={() => pageSelect("top")}>
                        Top
                    </span>
                    <span className="hSelec" onClick={() => pageSelect("library")}>
                        Library
                    </span>
                </div>
            </div>

            <div id="content">
                {page === "home" && <Home />}
                {page === "about" && <About />}
                {page === "search" && <Search />}
                {page === "top" && <Top logIn={logIn} logged={logged} state={state} getToken={getToken} />}
                {page === "library" && <Library logIn={logIn} logged={logged} state={state} getToken={getToken} />}
            </div>
        </div>
    );
}
