
export function logIn() {

    fetch("https://spot-mix-bd5608e94c9e.herokuapp.com/userLog")
        .then(response => {
            console.log("url fetched");
            if (!response.ok) {
                throw new Error("Could not fullfill server request");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            let newState = data.state
            sessionStorage.setItem('state', newState);
            console.log("redirected to spotify");
            window.location.href = data.url;
            return data;
        })
        .catch(error => {
            console.log(error.messsage);
        })
}

export function getToken() {
    const state = sessionStorage.getItem('state');

    return fetch(`https://spot-mix-bd5608e94c9e.herokuapp.com/${state}`)
        .then(response => {
            console.log("token fetched")
            if (!response.ok) {
                throw new Error("Could not fullfill server request");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const expiry = new Date().getHours() + new Date().getMinutes()/60;
            console.log("Token set at: ", expiry.toFixed(2));
            sessionStorage.setItem("expiry", expiry)
            sessionStorage.setItem("token", data.token);
        })
        .catch(error => {
            console.log(error.message);
            return null
        })
}
