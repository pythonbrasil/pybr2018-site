!function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e){e.preventDefault();var t=e.currentTarget.getAttribute("href");t=t.slice(1,t.length);var n=document.querySelector(t);if(n){var o=n.getBoundingClientRect().top,i=o+window.scrollY;c()(document.body,i,233,function(){n.focus()})}}function r(){var e=document.querySelectorAll(".scroll"),t=!0,n=!1,o=void 0;try{for(var r,l=e[Symbol.iterator]();!(t=(r=l.next()).done);t=!0){r.value.addEventListener("click",i)}}catch(e){n=!0,o=e}finally{try{!t&&l.return&&l.return()}finally{if(n)throw o}}}Object.defineProperty(t,"__esModule",{value:!0});var l=n(1),a=(n.n(l),n(2)),c=n.n(a),s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=function(){function e(){o(this,e),this.mobileNav=document.querySelector("#mobile-nav"),this.mobileNavTrigger=document.querySelector("#mobile-nav-trigger"),this.mobileNavCloseTrigger=document.querySelector("#mobile-nav-close-trigger"),this.preventScrolling=this.preventScrolling.bind(this),this.onMobileNavTrigger=this.onMobileNavTrigger.bind(this),this.onTouchMoveEnd=this.onTouchMoveEnd.bind(this),this.setupMobileNavigation()}return s(e,[{key:"setupMobileNavigation",value:function(){var e=this;this.mobileNavTrigger.addEventListener("click",this.onMobileNavTrigger),this.mobileNavCloseTrigger.addEventListener("click",this.onMobileNavTrigger),this.mobileNav.addEventListener("click",this.onMobileNavTrigger),this.mobileNav.addEventListener("touchmove",this.preventScrolling),this.mobileNav.addEventListener("scroll",this.preventScrolling);var t=this.mobileNav.querySelectorAll(".nav__anchor");Array.prototype.forEach.call(t,function(t){t.style.cursor="pointer",t.addEventListener("touchend",e.onMobileNavTrigger),t.addEventListener("click",e.onMobileNavTrigger)})}},{key:"preventScrolling",value:function(e){e.stopPropagation(),this.mobileNav.addEventListener("touchend",this.onTouchMoveEnd,!0)}},{key:"onTouchMoveEnd",value:function(e){e.stopPropagation(),this.mobileNav.removeEventListener("touchend",this.onTouchMoveEnd,!0)}},{key:"handleFocus",value:function(){this.isOpened?this.mobileNavCloseTrigger.focus():this.mobileNavTrigger.focus()}},{key:"onMobileNavTrigger",value:function(e){e.currentTarget===this.mobileNav&&e.target!==this.mobileNav||(this.mobileNav.classList.toggle("opened"),this.handleFocus(),e.currentTarget.classList.contains("scroll")&&e.preventDefault())}},{key:"isOpened",get:function(){return this.mobileNav.classList.contains("opened")}}]),e}();document.addEventListener("DOMContentLoaded",function(){new u,"/"===window.location.pathname&&r()})},function(e,t){},function(e,t){!function(t){var n=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||function(e){t.setTimeout(e,1e3/60)}}(),o=function(e,t,n,o){return(e/=o/2)<1?n/2*e*e+t:(e--,-n/2*(e*(e-2)-1)+t)},i=function(e,t,i,r){var l=e.scrollTop,a=t-l,c=+new Date,s=!0,u=null;n(function v(){if(s){n(v);var d=+new Date,h=Math.floor(o(d-c,l,a,i));u?u===e.scrollTop?(u=h,e.scrollTop=h):s=!1:(u=h,e.scrollTop=h),d>c+i&&(e.scrollTop=t,s=!1,r&&r())}})};void 0!==e&&void 0!==e.exports?e.exports=i:t.animatedScrollTo=i}(window)}]);
//# sourceMappingURL=bundle.js.map