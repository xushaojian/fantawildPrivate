(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{"+jAw":function(e,t,a){"use strict";a.d(t,"a",function(){return C});a("qVdP");var n=a("jsC+"),r=a("pVnL"),o=a.n(r),l=a("QILm"),s=a.n(l),c=a("lwsE"),i=a.n(c),u=a("W8MJ"),p=a.n(u),m=a("a1gu"),d=a.n(m),g=a("Nsbk"),y=a.n(g),f=a("7W2i"),h=a.n(f),v=a("q1tI"),k=a.n(v),E=a("TSYQ"),N=a.n(E),b=a("QyDn"),w=a.n(b),C=function(e){function t(){return i()(this,t),d()(this,y()(t).apply(this,arguments))}return h()(t,e),p()(t,[{key:"render",value:function(){var e=this.props,t=e.overlayClassName,a=s()(e,["overlayClassName"]);return k.a.createElement(n["a"],o()({overlayClassName:N()(w.a.container,t)},a))}}]),t}(v["PureComponent"])},BOD2:function(e,t,a){e.exports={container:"antd-pro-layouts-user-layout-container",lang:"antd-pro-layouts-user-layout-lang",content:"antd-pro-layouts-user-layout-content",top:"antd-pro-layouts-user-layout-top",header:"antd-pro-layouts-user-layout-header",logo:"antd-pro-layouts-user-layout-logo",title:"antd-pro-layouts-user-layout-title",desc:"antd-pro-layouts-user-layout-desc"}},Kkfi:function(e,t,a){e.exports={menu:"antd-pro-components-select-lang-index-menu",dropDown:"antd-pro-components-select-lang-index-dropDown"}},QyDn:function(e,t,a){e.exports={container:"antd-pro-components-header-dropdown-index-container"}},bfXr:function(e,t,a){"use strict";a.d(t,"a",function(){return w});a("Pwec");var n=a("CtXQ"),r=(a("lUTK"),a("BvKs")),o=a("lwsE"),l=a.n(o),s=a("W8MJ"),c=a.n(s),i=a("a1gu"),u=a.n(i),p=a("Nsbk"),m=a.n(p),d=a("7W2i"),g=a.n(d),y=a("q1tI"),f=a.n(y),h=a("LLXN"),v=a("TSYQ"),k=a.n(v),E=a("+jAw"),N=a("Kkfi"),b=a.n(N),w=function(e){function t(){var e,a;l()(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return a=u()(this,(e=m()(t)).call.apply(e,[this].concat(r))),a.changeLang=function(e){var t=e.key;Object(h["setLocale"])(t)},a}return g()(t,e),c()(t,[{key:"render",value:function(){var e=this.props.className,t=Object(h["getLocale"])(),a=["zh-CN","zh-TW","en-US","pt-BR"],o={"zh-CN":"\u7b80\u4f53\u4e2d\u6587","zh-TW":"\u7e41\u4f53\u4e2d\u6587","en-US":"English","pt-BR":"Portugu\xeas"},l={"zh-CN":"\ud83c\udde8\ud83c\uddf3","zh-TW":"\ud83c\udded\ud83c\uddf0","en-US":"\ud83c\uddec\ud83c\udde7","pt-BR":"\ud83c\udde7\ud83c\uddf7"},s=f.a.createElement(r["a"],{className:b.a.menu,selectedKeys:[t],onClick:this.changeLang},a.map(function(e){return f.a.createElement(r["a"].Item,{key:e},f.a.createElement("span",{role:"img","aria-label":o[e]},l[e])," ",o[e])}));return f.a.createElement(E["a"],{overlay:s,placement:"bottomRight"},f.a.createElement("span",{className:k()(b.a.dropDown,e)},f.a.createElement(n["a"],{type:"global",title:Object(h["formatMessage"])({id:"navBar.lang"})})))}}]),t}(y["PureComponent"])},ggcP:function(e,t,a){"use strict";var n=a("q1tI"),r=a.n(n),o=a("TSYQ"),l=a.n(o),s=a("wNoj"),c=a.n(s),i=function(e){var t=e.className,a=e.links,n=e.copyright,o=l()(c.a.globalFooter,t);return r.a.createElement("footer",{className:o},a&&r.a.createElement("div",{className:c.a.links},a.map(function(e){return r.a.createElement("a",{key:e.key,title:e.key,target:e.blankTarget?"_blank":"_self",href:e.href},e.title)})),n&&r.a.createElement("div",{className:c.a.copyright},n))};t["a"]=i},jH8a:function(e,t,a){"use strict";a.r(t);var n=a("lwsE"),r=a.n(n),o=a("W8MJ"),l=a.n(o),s=a("a1gu"),c=a.n(s),i=a("Nsbk"),u=a.n(i),p=a("7W2i"),m=a.n(p),d=(a("Pwec"),a("CtXQ")),g=a("q1tI"),y=a.n(g),f=a("LLXN"),h=a("mOP9"),v=a("ggcP"),k=a("bfXr"),E=a("BOD2"),N=a.n(E),b=a("mxmt"),w=a.n(b),C=[{key:"help",title:Object(f["formatMessage"])({id:"layout.user.link.help"}),href:""},{key:"privacy",title:Object(f["formatMessage"])({id:"layout.user.link.privacy"}),href:""},{key:"terms",title:Object(f["formatMessage"])({id:"layout.user.link.terms"}),href:""}],x=y.a.createElement(g["Fragment"],null,"Copyright ",y.a.createElement(d["a"],{type:"copyright"})," 2018 \u8682\u8681\u91d1\u670d\u4f53\u9a8c\u6280\u672f\u90e8\u51fa\u54c1"),j=function(e){function t(){return r()(this,t),c()(this,u()(t).apply(this,arguments))}return m()(t,e),l()(t,[{key:"render",value:function(){var e=this.props.children;return y.a.createElement("div",{className:N.a.container},y.a.createElement("div",{className:N.a.lang},y.a.createElement(k["a"],null)),y.a.createElement("div",{className:N.a.content},y.a.createElement("div",{className:N.a.top},y.a.createElement("div",{className:N.a.header},y.a.createElement(h["a"],{to:"/"},y.a.createElement("img",{alt:"logo",className:N.a.logo,src:w.a}),y.a.createElement("span",{className:N.a.title},"Ant Design"))),y.a.createElement("div",{className:N.a.desc},"Ant Design \u662f\u897f\u6e56\u533a\u6700\u5177\u5f71\u54cd\u529b\u7684 Web \u8bbe\u8ba1\u89c4\u8303")),e),y.a.createElement(v["a"],{links:C,copyright:x}))}}]),t}(y.a.PureComponent);t["default"]=j},mxmt:function(e,t,a){e.exports=a.p+"static/logo.9d2331cc.svg"},wNoj:function(e,t,a){e.exports={globalFooter:"antd-pro-components-global-footer-index-globalFooter",links:"antd-pro-components-global-footer-index-links",copyright:"antd-pro-components-global-footer-index-copyright"}}}]);