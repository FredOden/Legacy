
var Lourah = Lourah || {};
Lourah.base = Lourah.base || {};

console.log("Lourah.base.asyncWrapper::loading");

Lourah.base.asyncWrapper = promise => (
	(typeof promise.then === 'function')?promise
          .then(data =>  ({ ok: true, response: data }))
          .catch(error => ({ ok: false, response: error }))
          :(new Promise((resolve, reject) => {
          	reject("Lourah.base.asyncWrapper::"
                    + JSON.stringify(promise)
                    + "::is not a Promise")}))
                    .catch(error => ({ok: false, response: error}))
          );
	
console.log("Lourah.base.asyncWrapper::loaded");
