 // import fetch from "node-fetch";
async function HTTPGet(url) {
    let res;
    await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "client": "emure"
        }
    })
        .then(response => response.json())
        .then(data => {
            res = data;
        })

    return res;
}

async function Get(url) {
    let res;
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            res = data;
        })

    return res;
}

async function HTTPGetWithToken(url, token) {
    let res;
    await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "version": "1.100.90"
        }
    })
        .then(response => response.json())
        .then(data => {
            res = data;
        })

    return res;
}

async function HTTPPostNoToken(url, body) {
    let res;
    await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "version": "1.100.90"
        },
        body: JSON.stringify(body),
        method: "POST"
    })
        .then(response => response.json())
        .then(data => {
            res = data;
        })

    return res;
}

async function HTTPPatchNoToken(url, body) {
    let res;
    await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "version": "1.100.90"
        },
        body: JSON.stringify(body),
        method: "PATCH"
    })
        .then(response => response.json())
        .then(data => {
            res = data;
        })

    return res;
}

async function HTTPPatchWithToken(url, body, token) {
    let res;
    await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "version": "1.100.90",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        method: "PATCH"
    })
        .then(response => response.json())
        .then(data => {
            res = data;
        })

    return res;
}

async function HTTPPostWithToken(url, body, token) {
    let res;
    await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "version": "1.100.90"
        },
        body: JSON.stringify(body),
        method: "POST"
    })
        .then(response => response.json())
        .then(data => {
            res = data;
        })

    return res;
}
async function HTTPDeleteWithToken(url, body, token) {
    let res;
    await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "version": "1.100.90"
        },
        body: JSON.stringify(body),
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            res = data;
        })

    return res;
}

export { HTTPPostNoToken, HTTPGetWithToken, HTTPGet, HTTPPatchNoToken, HTTPPostWithToken, Get, HTTPDeleteWithToken, HTTPPatchWithToken }