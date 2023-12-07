const delay = (timeOut = 8 * 1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('network timeout'))
        }, timeOut);
    })
}


const fetchPromise = (method, url, headers, formData) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: method,
            headers: headers,
            body: formData
        }).then((response) => {
            // console.log(response);
            if (response.ok) {
                if(response.status === 204){

                    return Promise.all([JSON.stringify(response),response.status]);
                     

                }else{

                    return Promise.all([response.json(),response.status]);
                }   
            } else {
                if(response.status === 404 || response.status === 400){
                    return Promise.all([response.json(),response.status]);
                

                }else{
                    reject(new Error('Server exception'));
                }
                
            }
        }).then((responseJson) => {
            resolve(responseJson);
        }).catch((err) => {
            reject(new Error(err))

        })
    })
}

const _fetch = (fetchPromise, timeout) => {
    return Promise.race([fetchPromise, delay(timeout)]);
}

const HttpPost = (url, headers, formData, timeout) => {
    return _fetch(fetchPromise('POST', url, headers, formData), timeout);
};

const HttpPatch = (url, headers, formData, timeout) => {
    return _fetch(fetchPromise('PATCH', url, headers, formData), timeout);
};

const HttpGet = (url, headers, timeout) => {
    return _fetch(fetchPromise('Get', url, headers), timeout);
};

export { HttpPost, HttpGet, HttpPatch }