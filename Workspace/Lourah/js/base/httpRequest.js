/*

from:
    http://ccoenraets.github.io/es6-tutorial-data/promisify/


let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};
*/
var Lourah = Lourah || {};
console.log("loading Lourah.httpRequest");
Lourah.httpRequest = obj => {
	try {
    return new Promise((resolve, reject) => {
    	console.log("Lourah.httpRequest::" + JSON.stringify(obj));
        var xhr = new XMLHttpRequest();
        console.log("created xhr::" + xhr + JSON.stringify(xhr.status));
        
        xhr.open(obj.method || "GET", obj.url);
        
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        console.log("xhr::" + JSON.stringify(xhr));
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
            	console.log("xhr::onload::resolve::" + JSON.stringify(xhr.response));
                resolve(xhr.response);
            } else {
            	console.log("reject onload::" + JSON.stringify(xhr.response));
                reject(xhr.response);
            }
        };
        xhr.onerror = () => {
            reject(xhr.statusText);
            console.log("reject onerror::" + JSON.stringify(xhr));
            }
        console.log("xhr.send::"+obj.body);
        xhr.send(obj.body);
    });
    } catch (e) {
    	console.log("Lourah.httpRequest::ERR::" + e);
        throw e;
	}
};