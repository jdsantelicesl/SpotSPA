import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

import "./styles.css";

import Home from "./Home";
import About from "./About";
import Top from "./Top";
import Redirect from "./Redirect"

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
                        <Link className="hSelec Link" to="/top">
                            Your Stats
                        </Link>
                    </div>
                </div>

                <div id="content">
                    <Routes>
                        <Route path="/about" element={<About />} />
                        <Route path="/top" element={<Top />} />
                        <Route path="/redirect" element={<Redirect />} />
                        <Route path="/" element={<Home /> } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
