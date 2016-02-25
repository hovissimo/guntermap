'use strict';
const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;
//import keys from 'reflect.ownkeys';

// This file contains useful extensions to pre-existing objects.  We try hard to make sure that our extensions will be future compatible with changes in the language, so that we can simply remove the polyfill later.
(function() {
   if (!Object.hasOwnProperty('entries')) {
      Object.defineProperty(Object.prototype, 'entries', {
         configurable: true,
         enumerable: false,
         writable: false,
         value: function() {
            // ES7 proposal currently in stage-3 and implemented natively in Firefox Nightly ~Hovis:2016-02-24
            // polyfill sourced from https://github.com/tc39/proposal-object-values-entries/blob/master/polyfill.js
            return reduce(keys(this), (e, k) => concat(e, typeof k === 'string' && isEnumerable(this, k) ? [[k, this[k]]] : []), []);
         },
      });
   } // Object.prototype.entries
})();
