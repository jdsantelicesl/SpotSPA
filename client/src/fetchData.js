
export default function fetchData(url, updateData) {
    let data;
    let isPending;
    let error;

    const token = sessionStorage.getItem("token");

    const head = {
        "Authorization": "Bearer " + token
    }
    fetch(url, {
        headers: head
    })
    .then(res => {
        console.log("got response: ", res);
        if (!res.ok) { // error coming back from server
            // throws error that will be caught by catch instead of executing .then
            console.log("res error");
            throw Error('could not fetch the data for that resource');
        }
        return res.json();
    })
    .then(responseData => {
        console.log("got res json: ", responseData);
        // only executes if data ok
        isPending = false;
        data = responseData;
        error = null;
        updateData(data, isPending, error);
        
    })
    .catch(err => {
        // auto catches network / connection error
        isPending = false;
        error = err.message;
        updateData(data, isPending, error);
    });
}