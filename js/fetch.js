import XmlHttpRequest from 'xhr2';

export default {
   get: function(uri) {
      return this._ajax('GET', uri);
   },
   // we can add other methods later

   _ajax: function(method, uri) {
      // support for param objects would be handy if we ever need it
      let promise = new Promise( function(resolve, reject) {
         let client = new XmlHttpRequest();
         client.open(method, uri);
         client.send();

         client.onload = function() {
            if (this.status >= 200 && this.status < 300) {
               resolve(this.response);
            } else {
               reject(this.statusText);
            }
         };
         client.onerror = function() { reject(this.statusText); };
         client.onabort = function() { reject('aborted'); };
      });

      return promise;
   },
};
