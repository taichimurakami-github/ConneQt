const renewMyPosition = () => {

    // success callback
    const success = (position) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/renewUserData');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            console.log(xhr.responseText);
        }
        xhr.send(JSON.stringify({
            mode: "RENEW_POSITION",
            content: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        }));
    }

    // error callback
    const error = () => {
        console.log("fn renewMyPosition callback fail");
        console.log(error);
    }

    // get current position by GPS
    navigator.geolocation.getCurrentPosition( success, error );
}