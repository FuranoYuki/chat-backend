(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[12],{165:function(e,s,a){},168:function(e,s,a){"use strict";a.r(s);var i=a(2),c=a(0),t=(a(165),function(e){var s=e.chat;return Object(i.jsx)(i.Fragment,{children:void 0!==s.messages&&s.messages.map((function(e){return Object(i.jsxs)("div",{className:"ChatMessage",children:[Object(i.jsx)("div",{className:"chatMessage-perfil",children:(a=e.user,a===s.user._id?void 0===s.user.imagePerfil?Object(i.jsx)("img",{className:"chatMessage-perfil-img",alt:"perfil",src:"/imagePerfil/".concat(s.user.imagePerfilDefault)}):Object(i.jsx)("img",{className:"chatMessage-perfil-img",alt:"perfil",src:"/imagePerfil/".concat(s.user.imagePerfil.key)}):void 0===s.friend.imagePerfil?Object(i.jsx)("img",{className:"chatMessage-perfil-img",alt:"perfil",src:"/imagePerfil/".concat(s.friend.imagePerfilDefault)}):Object(i.jsx)("img",{className:"chatMessage-perfil-img",alt:"perfil",src:"/imagePerfil/".concat(s.friend.imagePerfil)}))}),Object(i.jsxs)("div",{className:"chatMessage-msg",children:[Object(i.jsxs)("div",{className:"chatMessage-msg-info",children:[Object(i.jsx)("div",{className:"chatMessage-msg-info-name",children:e.user===s.user._id?s.user.name:s.friend.name}),Object(i.jsx)("div",{className:"chatMessage-msg-info-data",children:new Date(e.createdAt).toUTCString().replace("GMT","")})]}),Object(i.jsx)("div",{className:"chatMessage-msg-text",children:e.text})]})]},e._id);var a}))})});s.default=Object(c.memo)(t)}}]);
//# sourceMappingURL=12.3081413d.chunk.js.map