(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[4],{19:function(e,n,t){"use strict";t.d(n,"b",(function(){return r})),t.d(n,"a",(function(){return a})),t.d(n,"c",(function(){return o})),t.d(n,"d",(function(){return i}));var c="chat-funy",r=function(){return null!==localStorage.getItem(c)},a=function(){return localStorage.getItem(c)},o=function(e){localStorage.setItem(c,e)},i=function(){localStorage.removeItem(c)}},36:function(e,n,t){},37:function(e,n,t){"use strict";t.r(n);var c=t(2),r=t(0),a=t.n(r),o=t(11),i=t.n(o),l=t(13),u=t(25),s=t(3),j=t(20),b=t(19),d=Object(r.lazy)((function(){return Promise.all([t.e(0),t.e(1),t.e(2),t.e(3),t.e(7)]).then(t.bind(null,169))})),O=Object(r.lazy)((function(){return Promise.all([t.e(0),t.e(2),t.e(10)]).then(t.bind(null,166))})),f=Object(r.lazy)((function(){return Promise.all([t.e(0),t.e(1),t.e(2),t.e(11)]).then(t.bind(null,167))})),h=Object(r.lazy)((function(){return Promise.all([t.e(0),t.e(1),t.e(3),t.e(8)]).then(t.bind(null,171))})),p=Object(r.lazy)((function(){return Promise.all([t.e(0),t.e(1),t.e(2),t.e(9)]).then(t.bind(null,170))})),m=function(e){var n=e.component,t=Object(u.a)(e,["component"]);return Object(c.jsx)(s.b,Object(l.a)(Object(l.a)({},t),{},{render:function(e){return Object(b.b)()?Object(c.jsx)(n,Object(l.a)({},e)):Object(c.jsx)(s.a,{to:{pathname:"/login",state:{from:e.location}}})}}))},x=function(){return Object(c.jsx)(j.a,{children:Object(c.jsx)(r.Suspense,{fallback:Object(c.jsx)("div",{children:"Loading..."}),children:Object(c.jsxs)(s.d,{children:[Object(c.jsx)(s.b,{exact:!0,path:"/login",component:O}),Object(c.jsx)(s.b,{exact:!0,path:"/register",component:f}),Object(c.jsx)(m,{exact:!0,path:"/",component:d}),Object(c.jsx)(m,{exact:!0,path:"/chat/:friend",component:h}),Object(c.jsx)(m,{exact:!0,path:"/config",component:p})]})})})},g=t(22),v=t(9),y={};var P=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:y,n=arguments.length>1?arguments[1]:void 0;return"user_datas"===n.type?Object.assign(e,n.payload):e},S="Online";var k=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:S,n=arguments.length>1?arguments[1]:void 0;if("HomeNavbar"===n.type)switch(n.payload){case"Online":return"Online";case"Pending":return"Pending";case"All":return"All";case"Blocked":return"Blocked";case"Add Friend":return"Add Friend"}return e},z=Object(v.b)({userReducer:P,HomeNavbarReducer:k}),A=Object(v.c)(z);var I=function(){return Object(c.jsx)("div",{className:"App",children:Object(c.jsx)(g.a,{store:A,children:Object(c.jsx)(x,{})})})};t(36);i.a.render(Object(c.jsx)(a.a.StrictMode,{children:Object(c.jsx)(I,{})}),document.getElementById("root"))}},[[37,5,6]]]);
//# sourceMappingURL=main.11179ebc.chunk.js.map