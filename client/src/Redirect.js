import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export default function Redirect() {
    const navigate = useNavigate();
    const redir = sessionStorage.getItem("redirect");

    useEffect(() => {
        navigate(`/${redir}`);
        console.log(redir);
    }, []);

    return (
        <div className="Redirect">
            <p>Redirecting...</p>
            <hr />
        </div>
    );
}