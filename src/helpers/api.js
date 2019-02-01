import { API_URL } from './routes'

export const apiCall = async (path, method, errorHandler) => {
    return await fetch(API_URL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            path: path,
            method: method,
        })
    }).then(response => {
        if (!response.ok) {
            throw response.status
        } else if (response.redirected) {
            throw Object.create({
                message: 'Nastąpiła próba przekierowania żądania po stronie serwera.'
            })
        }
        return response;
    })
        .then(response => response.json())
        .then(json => {
            return json
        })
        .catch(error => {
            console.log(error)
            errorHandler(error)
        })
}