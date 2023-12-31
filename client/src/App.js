import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

import "./styles.css";

import Home from "./home/Home";
import About from "./about/About";
import Search from "./search/Search";
import Top from "./top/Top";
import Library from "./library/Library";

export default function App() {

    return (
        <Router>
            <div className="App">
                <div className="hotbar">
                    <Link className="Link" to="/">
                        <p id="head" className="hSelec">
                            SpotMix
                        </p>
                    </Link>
                    <div id="selec">
                        <Link className="hSelec Link" to="/about">
                            About
                        </Link>
                        <Link className="hSelec Link" to="/search">
                            Search
                        </Link>
                        <Link className="hSelec Link" to="/top">
                            Top
                        </Link>
                        <Link className="hSelec Link" to="/library">
                            Library
                        </Link>
                    </div>
                </div>

                <div id="content">
                    <Routes>
                        <Route path="/about" element={<About />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/top" element={<Top />} />
                        <Route path="/library" element={<Library /> } />
                        <Route path="/" element={<Home /> } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
