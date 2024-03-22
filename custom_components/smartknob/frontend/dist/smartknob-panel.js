(function(){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var mt;const I=globalThis,G=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),et=new WeakMap;let st=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(G&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&et.set(e,t))}return t}toString(){return this.cssText}};const bt=r=>new st(typeof r=="string"?r:r+"",void 0,J),q=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,a)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[a+1],r[0]);return new st(e,r,J)},vt=(r,t)=>{if(G)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=I.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},it=G?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return bt(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:At,defineProperty:St,getOwnPropertyDescriptor:Et,getOwnPropertyNames:wt,getOwnPropertySymbols:xt,getPrototypeOf:Ht}=Object,v=globalThis,rt=v.trustedTypes,Pt=rt?rt.emptyScript:"",F=v.reactiveElementPolyfillSupport,M=(r,t)=>r,B={toAttribute(r,t){switch(t){case Boolean:r=r?Pt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Q=(r,t)=>!At(r,t),nt={attribute:!0,type:String,converter:B,reflect:!1,hasChanged:Q};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),v.litPropertyMetadata??(v.litPropertyMetadata=new WeakMap);class O extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=nt){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&St(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:a}=Et(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return s==null?void 0:s.call(this)},set(n){const l=s==null?void 0:s.call(this);a.call(this,n),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??nt}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;const t=Ht(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){const e=this.properties,i=[...wt(e),...xt(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(it(s))}else t!==void 0&&e.push(it(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vt(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var a;const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const n=(((a=i.converter)==null?void 0:a.toAttribute)!==void 0?i.converter:B).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){var a;const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=i.getPropertyOptions(s),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((a=n.converter)==null?void 0:a.fromAttribute)!==void 0?n.converter:B;this._$Em=s,this[s]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??Q)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[a,n]of this._$Ep)this[a]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[a,n]of s)n.wrapped!==!0||this._$AL.has(a)||this[a]===void 0||this.P(a,this[a],n)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(s=>{var a;return(a=s.hostUpdate)==null?void 0:a.call(s)}),this.update(e)):this._$EU()}catch(s){throw t=!1,this._$EU(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}O.elementStyles=[],O.shadowRootOptions={mode:"open"},O[M("elementProperties")]=new Map,O[M("finalized")]=new Map,F==null||F({ReactiveElement:O}),(v.reactiveElementVersions??(v.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const k=globalThis,z=k.trustedTypes,at=z?z.createPolicy("lit-html",{createHTML:r=>r}):void 0,ot="$lit$",A=`lit$${(Math.random()+"").slice(9)}$`,lt="?"+A,Ct=`<${lt}>`,x=document,V=()=>x.createComment(""),L=r=>r===null||typeof r!="object"&&typeof r!="function",pt=Array.isArray,Ot=r=>pt(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",X=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ht=/-->/g,ct=/>/g,H=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dt=/'/g,ut=/"/g,_t=/^(?:script|style|textarea|title)$/i,Ut=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=Ut(1),U=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),gt=new WeakMap,P=x.createTreeWalker(x,129);function $t(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return at!==void 0?at.createHTML(t):t}const Tt=(r,t)=>{const e=r.length-1,i=[];let s,a=t===2?"<svg>":"",n=R;for(let l=0;l<e;l++){const o=r[l];let h,c,p=-1,b=0;for(;b<o.length&&(n.lastIndex=b,c=n.exec(o),c!==null);)b=n.lastIndex,n===R?c[1]==="!--"?n=ht:c[1]!==void 0?n=ct:c[2]!==void 0?(_t.test(c[2])&&(s=RegExp("</"+c[2],"g")),n=H):c[3]!==void 0&&(n=H):n===H?c[0]===">"?(n=s??R,p=-1):c[1]===void 0?p=-2:(p=n.lastIndex-c[2].length,h=c[1],n=c[3]===void 0?H:c[3]==='"'?ut:dt):n===ut||n===dt?n=H:n===ht||n===ct?n=R:(n=H,s=void 0);const w=n===H&&r[l+1].startsWith("/>")?" ":"";a+=n===R?o+Ct:p>=0?(i.push(h),o.slice(0,p)+ot+o.slice(p)+A+w):o+A+(p===-2?l:w)}return[$t(r,a+(r[e]||"<?>")+(t===2?"</svg>":"")),i]};class D{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,n=0;const l=t.length-1,o=this.parts,[h,c]=Tt(t,e);if(this.el=D.createElement(h,i),P.currentNode=this.el.content,e===2){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=P.nextNode())!==null&&o.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const p of s.getAttributeNames())if(p.endsWith(ot)){const b=c[n++],w=s.getAttribute(p).split(A),Z=/([.?@])?(.*)/.exec(b);o.push({type:1,index:a,name:Z[2],strings:w,ctor:Z[1]==="."?kt:Z[1]==="?"?Vt:Z[1]==="@"?Lt:W}),s.removeAttribute(p)}else p.startsWith(A)&&(o.push({type:6,index:a}),s.removeAttribute(p));if(_t.test(s.tagName)){const p=s.textContent.split(A),b=p.length-1;if(b>0){s.textContent=z?z.emptyScript:"";for(let w=0;w<b;w++)s.append(p[w],V()),P.nextNode(),o.push({type:2,index:++a});s.append(p[b],V())}}}else if(s.nodeType===8)if(s.data===lt)o.push({type:2,index:a});else{let p=-1;for(;(p=s.data.indexOf(A,p+1))!==-1;)o.push({type:7,index:a}),p+=A.length-1}a++}}static createElement(t,e){const i=x.createElement("template");return i.innerHTML=t,i}}function T(r,t,e=r,i){var n,l;if(t===U)return t;let s=i!==void 0?(n=e._$Co)==null?void 0:n[i]:e._$Cl;const a=L(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==a&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),a===void 0?s=void 0:(s=new a(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=s:e._$Cl=s),s!==void 0&&(t=T(r,s._$AS(r,t.values),s,i)),t}class Mt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??x).importNode(e,!0);P.currentNode=s;let a=P.nextNode(),n=0,l=0,o=i[0];for(;o!==void 0;){if(n===o.index){let h;o.type===2?h=new N(a,a.nextSibling,this,t):o.type===1?h=new o.ctor(a,o.name,o.strings,this,t):o.type===6&&(h=new Rt(a,this,t)),this._$AV.push(h),o=i[++l]}n!==(o==null?void 0:o.index)&&(a=P.nextNode(),n++)}return P.currentNode=x,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class N{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),L(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==U&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ot(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==d&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(x.createTextNode(t)),this._$AH=t}$(t){var a;const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=D.createElement($t(i.h,i.h[0]),this.options)),i);if(((a=this._$AH)==null?void 0:a._$AD)===s)this._$AH.p(e);else{const n=new Mt(s,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=gt.get(t.strings);return e===void 0&&gt.set(t.strings,e=new D(t)),e}k(t){pt(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const a of t)s===e.length?e.push(i=new N(this.S(V()),this.S(V()),this,this.options)):i=e[s],i._$AI(a),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class W{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(t,e=this,i,s){const a=this.strings;let n=!1;if(a===void 0)t=T(this,t,e,0),n=!L(t)||t!==this._$AH&&t!==U,n&&(this._$AH=t);else{const l=t;let o,h;for(t=a[0],o=0;o<a.length-1;o++)h=T(this,l[i+o],e,o),h===U&&(h=this._$AH[o]),n||(n=!L(h)||h!==this._$AH[o]),h===d?t=d:t!==d&&(t+=(h??"")+a[o+1]),this._$AH[o]=h}n&&!s&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class kt extends W{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}}class Vt extends W{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}}class Lt extends W{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??d)===U)return;const i=this._$AH,s=t===d&&i!==d||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==d&&(i===d||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}}const Y=k.litHtmlPolyfillSupport;Y==null||Y(D,N),(k.litHtmlVersions??(k.litHtmlVersions=[])).push("3.1.2");const Dt=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const a=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new N(t.insertBefore(V(),a),a,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class S extends O{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Dt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return U}}S._$litElement$=!0,S.finalized=!0,(mt=globalThis.litElementHydrateSupport)==null||mt.call(globalThis,{LitElement:S});const tt=globalThis.litElementPolyfillSupport;tt==null||tt({LitElement:S}),(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const K=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt={attribute:!0,type:String,converter:B,reflect:!1,hasChanged:Q},jt=(r=Nt,t,e)=>{const{kind:i,metadata:s}=e;let a=globalThis.litPropertyMetadata.get(s);if(a===void 0&&globalThis.litPropertyMetadata.set(s,a=new Map),a.set(e.name,r),i==="accessor"){const{name:n}=e;return{set(l){const o=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,o,r)},init(l){return l!==void 0&&this.P(n,void 0,r),l}}}if(i==="setter"){const{name:n}=e;return function(l){const o=this[n];t.call(this,l),this.requestUpdate(n,o,r)}}throw Error("Unsupported decorator location: "+i)};function u(r){return(t,e)=>typeof e=="object"?jt(r,t,e):((i,s,a)=>{const n=s.hasOwnProperty(a);return s.constructor.createProperty(a,n?{...i,wrapped:!0}:i),n?Object.getOwnPropertyDescriptor(s,a):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function E(r){return u({...r,state:!0,attribute:!1})}var It="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",qt="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z",Bt="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",zt="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z";const Wt=async(r,t)=>await r.callApi("POST","smartknob/knob/sync",{mac_address:t}),Kt=async(r,t,e)=>await r.callApi("POST","smartknob/apps",{mac_address:t,apps:[{app_id:e.app_id,app_slug:e.app_slug,entity_id:e.entity_id,friendly_name:e.friendly_name}]}),yt=async(r,t,e)=>{const i=[];for(const s of e)i.push({app_id:s.app_id,app_slug:s.app_slug,entity_id:s.entity_id,friendly_name:s.friendly_name});return await r.callApi("PUT","smartknob/apps",{mac_address:t,apps:i})};//! WTF ?? why does this still return a promise what am i missing?
const Zt=async r=>{const t=await r.callApi("GET","smartknob/app_slugs");return t.success!="success"&&console.log("ERROR: Couldn't get app slugs"),t},Gt=async r=>{const t=await r.callApi("GET","smartknob/knobs");return t.success!=!0&&console.log("ERROR: Couldn't get knobs"),t};var Jt=Object.defineProperty,Ft=Object.getOwnPropertyDescriptor,g=(r,t,e,i)=>{for(var s=i>1?void 0:i?Ft(t,e):t,a=r.length-1,n;a>=0;a--)(n=r[a])&&(s=(i?n(t,e,s):n(s))||s);return i&&s&&Jt(t,e,s),s};let f=class extends S{constructor(){super(...arguments),this.apps=[],this.sortable=!1}render(){const t={select:{custom_value:!1,mode:"dropdown",options:this.appSlugs.map(e=>({value:e.slug,label:e.friendly_name}))}};return y`
      ${this.apps.map((e,i)=>{var a,n;const s=()=>{var l;return((l=e.app_slug)==null?void 0:l.slug)=="stopwatch"};return y`<sk-reorderable-list-item
          .app_id=${e.app.app_id}
          .isDraggable=${this.sortable}
          @drop="${this.drop}"
          @delete="${()=>{this.apps=this.apps.filter(l=>l.app.app_id!==e.app.app_id),yt(this.hass,this.mac_address,this.apps.map(l=>l.app)),this.requestUpdate()}}"
        >
          <div class="list-item">
            <div class="index">${i+1}</div>
            <ha-selector
              .hass=${this.hass}
              .selector=${t}
              .required=${!0}
              .label=${"Select App"}
              .value=${e.app_slug.slug}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector="${{entity:{include_entities:this.entities.map(l=>l.entity_id.startsWith(e.app_slug.domain)?l.entity_id:"")}}}"
              }}
              .required=${((a=e.app_slug)==null?void 0:a.slug)!="stopwatch"}
              .disabled=${s()}
              .value=${(n=e.entity)==null?void 0:n.entity_id}
            ></ha-selector>
          </div>
        </sk-reorderable-list-item> `})}
    `}drop(r){var i;r.target.classList.remove("over");const t=(i=r.dataTransfer)==null?void 0:i.getData("text/plain"),e=r.target.getAttribute("draggable-id");this.apps=this.reorderItems(this.apps,t,e),yt(this.hass,this.mac_address,this.apps.map(s=>s.app)),this.requestUpdate()}reorderItems(r,t,e){const i=r.findIndex(n=>n.app.app_id===t),s=r.findIndex(n=>n.app.app_id===e),[a]=r.splice(i,1);return r.splice((i<s,s),0,a),r}};f.styles=q`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    :host > * {
      padding: 12px;
    }
    :host > :nth-child(odd) {
      background-color: var(--secondary-background-color);
    }
    :host > :nth-child(even) {
      background-color: var(--primary-background-color);
    }

    .list-item {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      gap: 12px;
    }
    .list-item .index {
      width: 32px;
      text-align: center;
    }
  `,g([u({type:Object})],f.prototype,"hass",2),g([u({type:Array})],f.prototype,"appSlugs",2),g([u({type:Array})],f.prototype,"entities",2),g([u({type:Array})],f.prototype,"apps",2),g([u({type:Boolean})],f.prototype,"sortable",2),g([u({type:String})],f.prototype,"mac_address",2),f=g([K("sk-reorderable-list")],f);let j=class extends S{constructor(){super(...arguments),this.isDraggable=!0}connectedCallback(){super.connectedCallback(),this.addEventListener("dragstart",this.dragStart),this.addEventListener("dragenter",this.dragEnter),this.addEventListener("dragover",this.dragOver),this.addEventListener("dragleave",this.dragLeave),this.addEventListener("dragend",this.dragEnd)}render(){return this.isDraggable?this.setAttribute("draggable","true"):this.removeAttribute("draggable"),this.setAttribute("draggable-id",this.app_id),y`
      <slot></slot>
      <div class="actions">
        <ha-svg-icon
          title="delete"
          class="delete"
          .path=${It}
          @click=${()=>{this.dispatchEvent(new CustomEvent("delete",{detail:{id:this.app_id},bubbles:!0,composed:!0}))}}
        ></ha-svg-icon>
        <ha-svg-icon
          title="draggable"
          .path=${qt}
          class="sort"
          style=${this.isDraggable?"":"display: none;"}
        ></ha-svg-icon>
      </div>
    `}dragStart(r){var t;this.style.opacity="0.4",(t=r.dataTransfer)==null||t.setData("text/plain",this.id),r.dataTransfer.effectAllowed="move",this.classList.add("draggable-content"),r.target.classList.add("over")}dragEnter(r){r.preventDefault(),r.target.classList.add("over")}dragOver(r){r.preventDefault(),r.dataTransfer.dropEffect="move"}dragLeave(r){r.preventDefault(),r.target.classList.remove("over")}dragEnd(r){this.style.opacity="1",r.target.classList.remove("over"),this.requestUpdate()}};j.styles=q`
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      user-select: none;
      height: 48px;
    }
    :host(.over) {
      border-bottom: 4px solid var(--primary-color);
    }
    [draggable] {
      opacity: 1;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
    }

    .actions .delete {
      color: var(--error-color);
    }

    .actions .sort {
      cursor: grab;
    }
  `,g([u()],j.prototype,"app_id",2),g([u({type:Boolean})],j.prototype,"isDraggable",2),j=g([K("sk-reorderable-list-item")],j);var Qt=Object.defineProperty,Xt=Object.getOwnPropertyDescriptor,$=(r,t,e,i)=>{for(var s=i>1?void 0:i?Xt(t,e):t,a=r.length-1,n;a>=0;a--)(n=r[a])&&(s=(i?n(t,e,s):n(s))||s);return i&&s&&Qt(t,e,s),s};let _=class extends S{constructor(){super(...arguments),this._selectedSlug=null,this._selectedEntity=null,this._domain="",this._sortable=!1,this.handleSubmit=r=>{r.preventDefault();//! VALIDATE INPUTS
if(!this._selectedSlug)return;const t={app:{app_id:`${this._selectedSlug.slug}-${this._selectedEntity?this._selectedEntity.entity_id:Math.random().toString(16).slice(0,8)}`,app_slug:this._selectedSlug.slug,entity_id:this._selectedEntity?this._selectedEntity.entity_id:"",friendly_name:this._selectedEntity?this._selectedEntity.attributes.friendly_name??"":this._selectedSlug.friendly_name},app_slug:this._selectedSlug,entity:this._selectedEntity};this.apps.find(e=>e.app_slug==t.app_slug&&e.entity==t.entity)||this.apps.push(t),this.apps=[...this.apps],Kt(this.hass,this.mac_address,t.app),this.requestUpdate()}}connectedCallback(){super.connectedCallback(),this._selectedSlug=this.appSlugs[0],this._domain=this._selectedSlug.domain}render(){var a,n,l;const t={select:{custom_value:!1,mode:"dropdown",options:this.appSlugs.map(o=>({value:o.slug,label:o.friendly_name}))}},i={entity:{include_entities:this.entities.map(o=>!o.entity_id.startsWith(this._domain)||this.apps.find(h=>{var c;return((c=this._selectedSlug)==null?void 0:c.slug)==h.app.app_slug&&h.app.entity_id==o.entity_id})?"":o.entity_id).filter(o=>o!="")}},s=()=>{var o;return((o=this._selectedSlug)==null?void 0:o.slug)=="stopwatch"};return y`
      <button
        @click=${()=>{Wt(this.hass,this.mac_address)}}
      >
        Sync to KNOB
      </button>
      <form class="add-app" @submit=${this.handleSubmit}>
        <ha-selector
          .hass=${this.hass}
          .selector=${t}
          .required=${!0}
          .label=${"Select App"}
          .value=${(a=this._selectedSlug)==null?void 0:a.slug}
          @value-changed=${this.appSlugChanged}
        ></ha-selector>
        <ha-selector
          .hass=${this.hass}
          .selector=${i}
          .required=${((n=this._selectedSlug)==null?void 0:n.slug)!="stopwatch"}
          .disabled=${s()}
          .value=${(l=this._selectedEntity)==null?void 0:l.attributes.friendly_name}
          @value-changed=${this.entityChanged}
        ></ha-selector>

        <button type="submit" class="btn">
          <ha-svg-icon title="submit" .path=${Bt}></ha-svg-icon>
        </button>
        <button
          @click=${o=>{o.preventDefault(),this._sortable=!this._sortable}}
          class="btn reorder-btn"
        >
          <ha-svg-icon title="reorder" .path=${zt}></ha-svg-icon>
        </button>
      </form>

      <sk-reorderable-list
        .hass=${this.hass}
        .appSlugs=${this.appSlugs}
        .apps="${this.apps}"
        .sortable=${this._sortable}
        .entities=${this.entities}
        .mac_address=${this.mac_address}
      ></sk-reorderable-list>
    `}listApps(){return y`${this.apps.map(r=>{const t=`${r.app_slug.slug}-${r.entity.entity_id}`;return y`<li .id="${t}">
        ${r.app_slug.friendly_name} - ${r.entity.attributes.friendly_name}
      </li>`})}`}appSlugChanged(r){//!https://github.com/home-assistant/frontend/blob/dev/src/common/dom/fire_event.ts#L60
var t;this._selectedSlug=this.appSlugs.find(e=>e.slug==r.detail.value)??null,this._domain=((t=this._selectedSlug)==null?void 0:t.domain)??"",this._selectedEntity=null,this.requestUpdate()}entityChanged(r){//! https://github.com/home-assistant/frontend/blob/dev/src/common/dom/fire_event.ts#L60
this._selectedEntity=Object.values(this.hass.states).find(t=>t.entity_id==r.detail.value)??null}};_.styles=q`
    :host {
      display: block;
      max-width: 600px;
    }
    ha-selector {
      min-width: 200px;
      width: 100%;
    }

    .add-app {
      width: 100%;
      display: flex;
      gap: 12px;
      padding-bottom: 12px;
      align-items: center;
    }

    .btn {
      height: 100%;
      aspect-ratio: 1/1;
    }
  `,$([u({type:Object})],_.prototype,"hass",2),$([u({type:Array})],_.prototype,"entities",2),$([u({type:Array})],_.prototype,"appSlugs",2),$([u({type:Array})],_.prototype,"apps",2),$([u({type:String})],_.prototype,"mac_address",2),$([E()],_.prototype,"_selectedSlug",2),$([E()],_.prototype,"_selectedEntity",2),$([E()],_.prototype,"_domain",2),$([E()],_.prototype,"_sortable",2),_=$([K("app-form")],_);const Yt=async()=>{if(customElements.get("ha-selector-entity"))return;await customElements.whenDefined("partial-panel-resolver");const r=document.createElement("partial-panel-resolver");r.hass={panels:[{url_path:"tmp",component_name:"config"}]},r._updateRoutes(),await r.routerOptions.routes.tmp.load(),await customElements.whenDefined("ha-panel-config"),await document.createElement("ha-panel-config").routerOptions.routes.automation.load()},te="smartknob",ft=[{tabId:"setup",tabName:"Setup"},{tabId:"configuration",tabName:"Configuration"}];var ee=Object.defineProperty,se=Object.getOwnPropertyDescriptor,C=(r,t,e,i)=>{for(var s=i>1?void 0:i?se(t,e):t,a=r.length-1,n;a>=0;a--)(n=r[a])&&(s=(i?n(t,e,s):n(s))||s);return i&&s&&ee(t,e,s),s};let m=class extends S{constructor(){super(...arguments),this._appSlugs=[],this._appList=[],this._knobs={},this._currentTab=ft[0]}async connectedCallback(){const r=(await Gt(this.hass)).knobs,t=(await Zt(this.hass)).app_slugs,e=[];for(const i in r)for(const s of r[i].apps){const a=t.find(l=>l.slug==s.app_slug)??t[0],n=[...Object.values(this.hass.states)].find(l=>l.entity_id==s.entity_id)??null;e.push({app:{app_id:s.app_id,app_slug:s.app_slug,entity_id:s.entity_id,friendly_name:s.friendly_name},app_slug:a,entity:n})}this._appList=e,this._appSlugs=t,this._knobs=r,super.connectedCallback(),this.requestUpdate()}async firstUpdated(){await Yt(),this.requestUpdate()}render(){if(!customElements.get("ha-panel-config")||!customElements.get("ha-menu-button"))return y` loading... `;const r=[...Object.values(this.hass.states)];return y`<div>
      <div>
        <div class="header">
          <div class="toolbar">
            <ha-menu-button
              .hass=${this.hass}
              .narrow=${this.narrow}
            ></ha-menu-button>
            <h2>SmartKnob</h2>
          </div>
          <ha-tabs
            scrollable
            attr-for-selected="tab-name"
            .selected=${this._currentTab.tabId}
            @iron-activate=${this.handleTabSelect}
          >
            ${ft.map(t=>y`<paper-tab tab-name=${t.tabId}
                  >${t.tabName}</paper-tab
                >`)}
          </ha-tabs>
        </div>
        <div class="content">
          <app-form
            .hass=${this.hass}
            .entities=${r}
            .appSlugs=${this._appSlugs}
            .apps=${this._appList}
            .mac_address=${this._knobs[Object.keys(this._knobs)[0]].mac_address}
          ></app-form>
        </div>
      </div>
    </div>`}handleTabSelect(r){const t=r.detail.item.getAttribute("tab-name"),e=window.location.origin;e.endsWith(t)?this.scrollTo(0,0):(history.replaceState(null,"",`${e}/${te}/${t}`),this.requestUpdate())}};m.styles=q`
    .header {
      /* display: flex;
      align-items: center;
      justify-content: space-between; */
      padding: 0 16px;
      background-color: var(--app-header-background-color);
      color: var(--text-primary-color);
    }

    .header h2 {
      margin: 0;
    }

    .header .toolbar {
      padding: 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header ha-tabs {
      --paper-tabs-selection-bar-color: var(
        --app-header-selection-bar-color,
        var(--app-header-text-color, #fff)
      );
    }

    .content {
      padding: 24px;
    }
  `,C([u({type:Object})],m.prototype,"hass",2),C([u({type:Boolean})],m.prototype,"narrow",2),C([E()],m.prototype,"_appSlugs",2),C([E()],m.prototype,"_appList",2),C([E()],m.prototype,"_knobs",2),C([E()],m.prototype,"_currentTab",2),m=C([K("smartknob-panel")],m)})();
