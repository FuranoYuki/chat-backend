(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[8],{158:function(s,e,t){},159:function(s,e,t){},160:function(s,e,t){},171:function(s,e,t){"use strict";t.r(e);var c=t(44),i=t(2),a=t(0),n=t.n(a),A=t(42),o=t(43),l=(t(158),t(159),function(s){var e=Object(a.useState)({}),t=Object(c.a)(e,2),n=t[0],l=t[1];Object(a.useEffect)((function(){l(s.friend)}),[s.friend]);return Object(i.jsx)("div",{className:"chatNavbar",children:void 0!==n&&Object(i.jsxs)(i.Fragment,{children:[Object(i.jsxs)("div",{className:"chatNavbar-info",children:[Object(i.jsx)("div",{className:"chatNavbar-info--aroba",children:"@"}),Object(i.jsx)("div",{className:"chatNavbar-info--name",children:n.name}),Object(i.jsxs)("div",{className:"chatNavbar-info--status",children:[Object(i.jsx)("div",{className:"chatNavbar-info--status--layer1",children:Object(i.jsx)("div",{className:"chatNavbar-info--status--layer2 ".concat(n.status)})}),Object(i.jsx)("div",{className:"chatNavbar-info--status-legend",children:n.status})]})]}),Object(i.jsxs)("div",{className:"chatNavbar-setting",children:[Object(i.jsxs)("div",{className:"chatNavbar-setting-icons",children:[Object(i.jsx)("div",{className:"chatNavbar-setting-icon",children:Object(i.jsx)(A.a,{icon:o.m})}),Object(i.jsx)("div",{className:"chatNavbar-setting-icon",children:Object(i.jsx)(A.a,{icon:o.w})}),Object(i.jsx)("div",{className:"chatNavbar-setting-icon",children:Object(i.jsx)(A.a,{icon:o.l})}),Object(i.jsx)("div",{className:"chatNavbar-setting-icon",children:Object(i.jsx)(A.a,{icon:o.u})})]}),Object(i.jsxs)("div",{className:"chatNavbar-setting-search",children:[Object(i.jsx)("input",{placeholder:"Search",className:"chatNavbar-setting-search-input",onFocus:function(s){s.target.style.width="200px"},onBlur:function(s){s.target.style.width="120px"}}),Object(i.jsx)(A.a,{icon:o.q})]}),Object(i.jsxs)("div",{className:"chatNavbar-setting-help",children:[Object(i.jsx)("div",{className:"chatNavbar-setting-icon",children:Object(i.jsx)(A.a,{icon:o.j})}),Object(i.jsx)("div",{className:"chatNavbar-setting-icon",children:Object(i.jsx)(A.a,{icon:o.p})})]})]})]})})}),r=t(70),d=t(62),j=(t(160),function(s){var e=s.friend;return Object(i.jsx)("div",{className:"ChatWelcome",children:void 0!==e&&Object(i.jsxs)(i.Fragment,{children:[void 0===e.imagePerfil?Object(i.jsx)("img",{className:"chatWelcome-img",src:"/imagePerfil/".concat(e.imagePerfilDefault),alt:"perfil"}):Object(i.jsx)("img",{className:"chatWelcome-img",src:"/imagePerfil/".concat(e.imagePerfil),alt:"perfil"}),Object(i.jsx)("div",{className:"chatWelcome-user",children:e.name}),Object(i.jsxs)("div",{className:"chatWelcome-text",children:["This is the beginning of your direct message history with @",e.name]})]})})}),h=Object(a.memo)(j),u=t(3),b=t(38),O=t(49),f=n.a.lazy((function(){return t.e(12).then(t.bind(null,168))}));e.default=function(){var s=Object(a.useState)({}),e=Object(c.a)(s,2),t=e[0],n=e[1],j=Object(a.useState)(""),m=Object(c.a)(j,2),x=m[0],g=m[1],v=Object(a.useState)(!1),N=Object(c.a)(v,2),p=N[0],y=N[1],W=Object(u.h)().friend;Object(a.useEffect)((function(){document.addEventListener("keyup",(function(s){"Enter"===s.code&&""!==document.querySelector(".chat-body-input-text").value&&y(!0)}))}),[]),Object(a.useEffect)((function(){D()}),[W]),Object(a.useEffect)((function(){O.a.on("newMessage",(function(){D()}))}),[]),Object(a.useEffect)((function(){void 0!==t.messages&&0<t.messages.length&&setTimeout((function(){_()}),50)}),[t.messages]),Object(a.useEffect)((function(){p&&b.a.post("/chat/sendMessage",{chat_id:t._id,text:x,user:t.friend._id,friend:t.user._id}).then((function(){document.querySelector(".chat-body-input-text").value="",y(!1),D(),O.a.emit("sendMessage",t.friend._id)})).catch((function(s){console.log(s)}))}),[p]);var D=function(){b.a.post("/chat/getChat",{friend_id:W}).then((function(s){n(s.data)})).catch((function(s){"chat doesn't exist"===s.response.data&&Q()}))},Q=function(){b.a.post("/chat/createChat",{friend_id:W}).then((function(s){n(s.data)})).catch((function(s){console.log(s)}))},_=function(){var s=document.querySelector(".chat-body-main");s.scrollTop=s.scrollHeight};return Object(i.jsxs)("div",{className:"Chat",children:[Object(i.jsx)(r.a,{}),Object(i.jsx)(d.a,{}),t.friend&&Object(i.jsxs)("div",{className:"chat-body",children:[Object(i.jsx)(l,{friend:t.friend}),Object(i.jsxs)("div",{className:"chat-body-main",children:[Object(i.jsx)(h,{friend:t.friend}),Object(i.jsx)(a.Suspense,{fallback:Object(i.jsx)("div",{children:"loading..."}),children:Object(i.jsx)(f,{chat:t})})]}),Object(i.jsx)("div",{className:"chat-body-input",children:Object(i.jsxs)("div",{className:"chat-body-input-margin",children:[Object(i.jsxs)("div",{className:"chat-body-input-icon",children:[Object(i.jsx)(A.a,{icon:o.o}),Object(i.jsx)("input",{className:"chat-body-input-text",name:"text",placeholder:"Message @".concat(t.friend.name),onChange:function(s){g(s.target.value)}})]}),Object(i.jsxs)("div",{className:"chat-body-input-info",children:[Object(i.jsx)("span",{className:"chat-body-input-info-icon",children:Object(i.jsx)(A.a,{icon:o.g})}),Object(i.jsx)("span",{className:"chat-body-input-info-icon",children:Object(i.jsx)(A.a,{icon:o.r})})]})]})})]})]})}},38:function(s,e,t){"use strict";var c=t(40),i=t.n(c),a=t(41),n=t(55),A=t.n(n),o=t(19),l=A.a.create({baseURL:"http://localhost:3001"});l.interceptors.request.use(function(){var s=Object(a.a)(i.a.mark((function s(e){var t;return i.a.wrap((function(s){for(;;)switch(s.prev=s.next){case 0:return(t=Object(o.a)())&&(e.headers.Authorization="Bearer ".concat(t)),s.abrupt("return",e);case 3:case"end":return s.stop()}}),s)})));return function(e){return s.apply(this,arguments)}}()),e.a=l},49:function(s,e,t){"use strict";var c=t(81),i=t.n(c),a=t(19),n=i()("http://localhost:3001",{transports:["websocket"],query:{auth:"Bearer ".concat(Object(a.a)())}});e.a=n},50:function(s,e,t){"use strict";e.a="data:image/png;base64,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"},62:function(s,e,t){"use strict";var c=t(40),i=t.n(c),a=t(41),n=t(44),A=t(2),o=t(0),l=t(20),r=t(42),d=t(43),j=(t(63),t(38)),h=t(19),u=t(3),b=t(49),O=function(){var s=Object(o.useState)({}),e=Object(n.a)(s,2),t=e[0],c=e[1],O=Object(o.useState)({}),f=Object(n.a)(O,2),m=f[0],x=f[1],g=Object(o.useState)(""),v=Object(n.a)(g,2),N=v[0],p=v[1],y=Object(u.g)();Object(o.useEffect)((function(){C(),_()}),[]),Object(o.useEffect)((function(){b.a.on("friendChangeStatus",(function(){console.log("friend change status"),C()}))}),[]),Object(o.useEffect)((function(){void 0!==t._id&&b.a.emit("userRoom",t.friends,t._id)}),[t]);var W=function(s){s.currentTarget.lastElementChild.style.display="flex",s.currentTarget.firstElementChild.lastElementChild.style.color="white"},D=function(s){s.currentTarget.lastElementChild.style.display="none",s.currentTarget.firstElementChild.lastElementChild.style.color="rgb(174, 166, 166)"},Q=function(){var s=Object(a.a)(i.a.mark((function s(e){return i.a.wrap((function(s){for(;;)switch(s.prev=s.next){case 0:if(t.status===e.currentTarget.id){s.next=5;break}return s.next=3,j.a.post("/user/changeStatus",{status:e.currentTarget.id});case 3:_(),b.a.emit("changeStatus",t.friends);case 5:case"end":return s.stop()}}),s)})));return function(e){return s.apply(this,arguments)}}(),_=function(){j.a.post("/user/getUser").then((function(s){c(s.data)})).catch((function(s){void 0===s.response.tokenExpired&&(Object(h.d)(),y.push("/login"))}))},C=function(){j.a.post("/user/getUserChats").then((function(s){x(s.data)})).catch((function(s){console.log(s)}))};return Object(A.jsxs)("div",{className:"Social",children:[Object(A.jsx)("form",{className:"social__search",children:Object(A.jsx)("input",{className:"social__search--input",placeholder:"Encontre ou comece uma conversa",onChange:function(s){p(s.target.value)}})}),Object(A.jsxs)("div",{className:"social__body",children:[Object(A.jsxs)("ul",{className:"social__body--to_do",children:[Object(A.jsx)("li",{className:"social__body--to_do-li",children:Object(A.jsxs)(l.b,{className:"social__body--to_do-link",to:"/",children:[Object(A.jsx)(r.a,{icon:d.t}),Object(A.jsx)("span",{children:"Amigos"})]})}),Object(A.jsx)("li",{className:"social__body--to_do-li",children:Object(A.jsxs)(l.b,{className:"social__body--to_do-link",to:"#",children:[Object(A.jsx)(r.a,{icon:d.n}),Object(A.jsx)("span",{children:"Create Group"})]})})]}),Object(A.jsx)("ul",{className:"social__body--friends",children:void 0!==m.chats&&m.chats.map((function(s){return s.friend})).filter((function(s){return""===N||s.name.toLowerCase().includes(N.toLowerCase())?s:void 0})).map((function(s){return Object(A.jsxs)("li",{onMouseOver:W,className:"social__body--friends-li",onMouseOut:D,children:[Object(A.jsxs)(l.b,{to:"/chat/".concat(s._id),className:"social__body--friends-link",children:[Object(A.jsxs)("div",{className:"social__body-friends-icon",children:[void 0===s.imagePerfil?Object(A.jsx)("img",{className:"social__body-friends-icon-img",src:"/imagePerfil/".concat(s.imagePerfilDefault),alt:"perfil"}):Object(A.jsx)("img",{className:"social__body-friends-icon-img",src:"/imagePerfil/".concat(s.imagePerfil.key),alt:"perfil"}),Object(A.jsx)("div",{className:"social__body-friends-icon-layer1",children:Object(A.jsx)("div",{className:"social__body-friends-icon-layer2 ".concat(s.status),children:Object(A.jsx)("div",{className:"social__body-friends-icon-layer3 ".concat(s.status)})})})]}),Object(A.jsx)("span",{children:s.name})]}),Object(A.jsx)("div",{className:"social__delete-friend",children:Object(A.jsx)(r.a,{icon:d.s})})]},s._id)}))})]}),Object(A.jsxs)("div",{className:"social__settings",children:[Object(A.jsxs)("div",{className:"social__settings--info",children:[Object(A.jsxs)("div",{className:"social__settings--info--status",onClick:function(){var s=document.querySelector(".social__settings--info--status-list");"flex"===s.style.display?s.style.display="none":s.style.display="flex"},children:[void 0===t.imagePerfil?Object(A.jsx)("img",{src:"/imagePerfil/".concat(t.imagePerfilDefault),alt:"perfil",className:"social__settings--info--status-img"}):Object(A.jsx)("img",{src:"/imagePerfil/".concat(t.imagePerfil.key),alt:"perfil",className:"social__settings--info--status-img"}),Object(A.jsx)("div",{className:"social__settings--info--status-layer1",children:Object(A.jsx)("div",{className:"social__settings--info--status-layer2 ".concat(t.status),children:Object(A.jsx)("div",{className:"social__settings--info--status-layer2 ".concat(t.status)})})}),Object(A.jsxs)("div",{className:"social__settings--info--status-list",children:[Object(A.jsxs)("div",{className:"social__settings-info--status-list-li online",onClick:Q,id:"Online",children:[Object(A.jsx)("div",{className:"social__settings-info-li-icon",children:Object(A.jsx)("div",{className:"social__settings-info-li-icon-2 Online"})}),Object(A.jsx)("div",{className:"social__settings-info-li-text",children:"Online"})]}),Object(A.jsxs)("div",{className:"social__settings-info--status-list-li",onClick:Q,id:"Idle",children:[Object(A.jsx)("div",{className:"social__settings-info-li-icon",children:Object(A.jsx)("div",{className:"social__settings-info-li-icon-2 Idle"})}),Object(A.jsx)("div",{className:"social__settings-info-li-text",children:"Idle"})]}),Object(A.jsxs)("div",{className:"social__settings-info--status-list-li",onClick:Q,id:"DND",children:[Object(A.jsx)("div",{className:"social__settings-info-li-icon",children:Object(A.jsx)("div",{className:"social__settings-info-li-icon-2 DND"})}),Object(A.jsxs)("div",{className:"social__settings-info-li-text",children:[Object(A.jsx)("div",{className:"social__settings-info-li-text-header",children:"Do Not Disturb"}),Object(A.jsx)("div",{className:"social__settings-info-li-text-body",children:"You will not appear online, but will have full access to all of Discord."})]})]}),Object(A.jsxs)("div",{className:"social__settings-info--status-list-li",onClick:Q,id:"Offline",children:[Object(A.jsx)("div",{className:"social__settings-info-li-icon",children:Object(A.jsx)("div",{className:"social__settings-info-li-icon-2 Invisible"})}),Object(A.jsxs)("div",{className:"social__settings-info-li-text",children:[Object(A.jsx)("div",{className:"social__settings-info-li-text-header",children:"Invisible"}),Object(A.jsx)("div",{className:"social__settings-info-li-text-body",children:"You will not appear online, but will have full access to all of Discord."})]})]}),Object(A.jsxs)("div",{className:"social__settings-info--status-list-li custom",children:[Object(A.jsx)("div",{className:"social__settings-info-li-icon"}),Object(A.jsx)("div",{className:"social__settings-info-li-text",children:"Set a custom status"})]})]})]}),Object(A.jsxs)("div",{className:"social__settings--info--user",children:[Object(A.jsx)("span",{className:"social__settings--info--user-name",children:t.name}),Object(A.jsx)("span",{className:"social__settings--info--user-code",children:t.code})]})]}),Object(A.jsxs)("ul",{className:"social__settings--actions",children:[Object(A.jsx)("li",{className:"social__settings--actions-li social-microphone",children:Object(A.jsx)(r.a,{icon:d.k})}),Object(A.jsx)("li",{className:"social__settings--actions-li social-headphones",children:Object(A.jsx)(r.a,{icon:d.h})}),Object(A.jsx)("li",{className:"social__settings--actions-li social-cog",children:Object(A.jsx)(l.b,{to:"/config",children:Object(A.jsx)(r.a,{icon:d.b})})})]})]})]})};e.a=Object(o.memo)(O)},63:function(s,e,t){},70:function(s,e,t){"use strict";var c=t(2),i=t(0),a=t(20),n=(t(71),t(50),function(){var s=function(s){var e=s.currentTarget.firstElementChild;e.style.display="flex",e.style.height="20px"},e=function(s){s.currentTarget.firstElementChild.style.display="none"};return Object(c.jsxs)("div",{className:"Group",children:[Object(c.jsxs)(a.b,{to:"/",className:"group__discord",onMouseOver:s,onMouseOut:e,children:[Object(c.jsx)("div",{className:"group__discord--sign"}),Object(c.jsx)("div",{className:"group__discord--img",children:Object(c.jsx)("img",{src:"https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"})}),Object(c.jsx)("div",{className:"group__discord--legend",children:"Home"})]}),Object(c.jsx)("ul",{className:"group__groups",children:Object(c.jsxs)("li",{className:"group__groups--li",onMouseOver:s,onMouseOut:e,children:[Object(c.jsx)("div",{className:"group__groups--sign"}),Object(c.jsxs)("div",{className:"group__groups--perfil",children:[Object(c.jsx)("div",{className:"group__groups--img"}),Object(c.jsx)("div",{className:"group__groups--layer-1",children:Object(c.jsx)("div",{className:"group__groups--layer-2",children:Object(c.jsx)("div",{className:"group__groups--layer-3",children:"1"})})})]})]})})]})});e.a=Object(i.memo)(n)},71:function(s,e,t){}}]);
//# sourceMappingURL=8.ff6ab15a.chunk.js.map