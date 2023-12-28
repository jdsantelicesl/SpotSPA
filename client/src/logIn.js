
export function logIn() {

    fetch("http://localhost:8888/userLog")
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

    fetch(`http://localhost:8888/getToken/${state}`)
        .then(response => {
            console.log("token fetched")
            if (!response.ok) {
                throw new Error("Could not fullfill server request");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data.token;
        })
        .catch(error => {
            console.log(error.message);
            return null
        })
}
