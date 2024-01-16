!function (t) {
  "use strict";

  function e(t, e, s, i) {
    var n,
      r = arguments.length,
      o = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, s) : i;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(t, e, s, i);else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (o = (r < 3 ? n(o) : r > 3 ? n(e, s, o) : n(e, s)) || o);
    return r > 3 && o && Object.defineProperty(e, s, o), o;
  }
  "function" == typeof SuppressedError && SuppressedError;
  /**
       * @license
       * Copyright 2019 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const s = window,
    i = s.ShadowRoot && (void 0 === s.ShadyCSS || s.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
    n = Symbol(),
    r = new WeakMap();
  class o {
    constructor(t, e, s) {
      if (this._$cssResult$ = !0, s !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t, this.t = e;
    }
    get styleSheet() {
      let t = this.o;
      const e = this.t;
      if (i && void 0 === t) {
        const s = void 0 !== e && 1 === e.length;
        s && (t = r.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && r.set(e, t));
      }
      return t;
    }
    toString() {
      return this.cssText;
    }
  }
  const a = (t, ...e) => {
      const s = 1 === t.length ? t[0] : e.reduce((e, s, i) => e + (t => {
        if (!0 === t._$cssResult$) return t.cssText;
        if ("number" == typeof t) return t;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(s) + t[i + 1], t[0]);
      return new o(s, t, n);
    },
    l = (t, e) => {
      i ? t.adoptedStyleSheets = e.map(t => t instanceof CSSStyleSheet ? t : t.styleSheet) : e.forEach(e => {
        const i = document.createElement("style"),
          n = s.litNonce;
        void 0 !== n && i.setAttribute("nonce", n), i.textContent = e.cssText, t.appendChild(i);
      });
    },
    d = i ? t => t : t => t instanceof CSSStyleSheet ? (t => {
      let e = "";
      for (const s of t.cssRules) e += s.cssText;
      return (t => new o("string" == typeof t ? t : t + "", void 0, n))(e);
    })(t) : t
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */;
  var p;
  const h = window,
    c = h.trustedTypes,
    u = c ? c.emptyScript : "",
    v = h.reactiveElementPolyfillSupport,
    _ = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? u : null;
            break;
          case Object:
          case Array:
            t = null == t ? t : JSON.stringify(t);
        }
        return t;
      },
      fromAttribute(t, e) {
        let s = t;
        switch (e) {
          case Boolean:
            s = null !== t;
            break;
          case Number:
            s = null === t ? null : Number(t);
            break;
          case Object:
          case Array:
            try {
              s = JSON.parse(t);
            } catch (t) {
              s = null;
            }
        }
        return s;
      }
    },
    g = (t, e) => e !== t && (e == e || t == t),
    y = {
      attribute: !0,
      type: String,
      converter: _,
      reflect: !1,
      hasChanged: g
    },
    $ = "finalized";
  class m extends HTMLElement {
    constructor() {
      super(), this._$Ei = new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this._$Eu();
    }
    static addInitializer(t) {
      var e;
      this.finalize(), (null !== (e = this.h) && void 0 !== e ? e : this.h = []).push(t);
    }
    static get observedAttributes() {
      this.finalize();
      const t = [];
      return this.elementProperties.forEach((e, s) => {
        const i = this._$Ep(s, e);
        void 0 !== i && (this._$Ev.set(i, s), t.push(i));
      }), t;
    }
    static createProperty(t, e = y) {
      if (e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t)) {
        const s = "symbol" == typeof t ? Symbol() : "__" + t,
          i = this.getPropertyDescriptor(t, s, e);
        void 0 !== i && Object.defineProperty(this.prototype, t, i);
      }
    }
    static getPropertyDescriptor(t, e, s) {
      return {
        get() {
          return this[e];
        },
        set(i) {
          const n = this[t];
          this[e] = i, this.requestUpdate(t, n, s);
        },
        configurable: !0,
        enumerable: !0
      };
    }
    static getPropertyOptions(t) {
      return this.elementProperties.get(t) || y;
    }
    static finalize() {
      if (this.hasOwnProperty($)) return !1;
      this[$] = !0;
      const t = Object.getPrototypeOf(this);
      if (t.finalize(), void 0 !== t.h && (this.h = [...t.h]), this.elementProperties = new Map(t.elementProperties), this._$Ev = new Map(), this.hasOwnProperty("properties")) {
        const t = this.properties,
          e = [...Object.getOwnPropertyNames(t), ...Object.getOwnPropertySymbols(t)];
        for (const s of e) this.createProperty(s, t[s]);
      }
      return this.elementStyles = this.finalizeStyles(this.styles), !0;
    }
    static finalizeStyles(t) {
      const e = [];
      if (Array.isArray(t)) {
        const s = new Set(t.flat(1 / 0).reverse());
        for (const t of s) e.unshift(d(t));
      } else void 0 !== t && e.push(d(t));
      return e;
    }
    static _$Ep(t, e) {
      const s = e.attribute;
      return !1 === s ? void 0 : "string" == typeof s ? s : "string" == typeof t ? t.toLowerCase() : void 0;
    }
    _$Eu() {
      var t;
      this._$E_ = new Promise(t => this.enableUpdating = t), this._$AL = new Map(), this._$Eg(), this.requestUpdate(), null === (t = this.constructor.h) || void 0 === t || t.forEach(t => t(this));
    }
    addController(t) {
      var e, s;
      (null !== (e = this._$ES) && void 0 !== e ? e : this._$ES = []).push(t), void 0 !== this.renderRoot && this.isConnected && (null === (s = t.hostConnected) || void 0 === s || s.call(t));
    }
    removeController(t) {
      var e;
      null === (e = this._$ES) || void 0 === e || e.splice(this._$ES.indexOf(t) >>> 0, 1);
    }
    _$Eg() {
      this.constructor.elementProperties.forEach((t, e) => {
        this.hasOwnProperty(e) && (this._$Ei.set(e, this[e]), delete this[e]);
      });
    }
    createRenderRoot() {
      var t;
      const e = null !== (t = this.shadowRoot) && void 0 !== t ? t : this.attachShadow(this.constructor.shadowRootOptions);
      return l(e, this.constructor.elementStyles), e;
    }
    connectedCallback() {
      var t;
      void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), null === (t = this._$ES) || void 0 === t || t.forEach(t => {
        var e;
        return null === (e = t.hostConnected) || void 0 === e ? void 0 : e.call(t);
      });
    }
    enableUpdating(t) {}
    disconnectedCallback() {
      var t;
      null === (t = this._$ES) || void 0 === t || t.forEach(t => {
        var e;
        return null === (e = t.hostDisconnected) || void 0 === e ? void 0 : e.call(t);
      });
    }
    attributeChangedCallback(t, e, s) {
      this._$AK(t, s);
    }
    _$EO(t, e, s = y) {
      var i;
      const n = this.constructor._$Ep(t, s);
      if (void 0 !== n && !0 === s.reflect) {
        const r = (void 0 !== (null === (i = s.converter) || void 0 === i ? void 0 : i.toAttribute) ? s.converter : _).toAttribute(e, s.type);
        this._$El = t, null == r ? this.removeAttribute(n) : this.setAttribute(n, r), this._$El = null;
      }
    }
    _$AK(t, e) {
      var s;
      const i = this.constructor,
        n = i._$Ev.get(t);
      if (void 0 !== n && this._$El !== n) {
        const t = i.getPropertyOptions(n),
          r = "function" == typeof t.converter ? {
            fromAttribute: t.converter
          } : void 0 !== (null === (s = t.converter) || void 0 === s ? void 0 : s.fromAttribute) ? t.converter : _;
        this._$El = n, this[n] = r.fromAttribute(e, t.type), this._$El = null;
      }
    }
    requestUpdate(t, e, s) {
      let i = !0;
      void 0 !== t && (((s = s || this.constructor.getPropertyOptions(t)).hasChanged || g)(this[t], e) ? (this._$AL.has(t) || this._$AL.set(t, e), !0 === s.reflect && this._$El !== t && (void 0 === this._$EC && (this._$EC = new Map()), this._$EC.set(t, s))) : i = !1), !this.isUpdatePending && i && (this._$E_ = this._$Ej());
    }
    async _$Ej() {
      this.isUpdatePending = !0;
      try {
        await this._$E_;
      } catch (t) {
        Promise.reject(t);
      }
      const t = this.scheduleUpdate();
      return null != t && (await t), !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var t;
      if (!this.isUpdatePending) return;
      this.hasUpdated, this._$Ei && (this._$Ei.forEach((t, e) => this[e] = t), this._$Ei = void 0);
      let e = !1;
      const s = this._$AL;
      try {
        e = this.shouldUpdate(s), e ? (this.willUpdate(s), null === (t = this._$ES) || void 0 === t || t.forEach(t => {
          var e;
          return null === (e = t.hostUpdate) || void 0 === e ? void 0 : e.call(t);
        }), this.update(s)) : this._$Ek();
      } catch (t) {
        throw e = !1, this._$Ek(), t;
      }
      e && this._$AE(s);
    }
    willUpdate(t) {}
    _$AE(t) {
      var e;
      null === (e = this._$ES) || void 0 === e || e.forEach(t => {
        var e;
        return null === (e = t.hostUpdated) || void 0 === e ? void 0 : e.call(t);
      }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
    }
    _$Ek() {
      this._$AL = new Map(), this.isUpdatePending = !1;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$E_;
    }
    shouldUpdate(t) {
      return !0;
    }
    update(t) {
      void 0 !== this._$EC && (this._$EC.forEach((t, e) => this._$EO(e, this[e], t)), this._$EC = void 0), this._$Ek();
    }
    updated(t) {}
    firstUpdated(t) {}
  }
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  var f;
  m[$] = !0, m.elementProperties = new Map(), m.elementStyles = [], m.shadowRootOptions = {
    mode: "open"
  }, null == v || v({
    ReactiveElement: m
  }), (null !== (p = h.reactiveElementVersions) && void 0 !== p ? p : h.reactiveElementVersions = []).push("1.6.3");
  const b = window,
    A = b.trustedTypes,
    S = A ? A.createPolicy("lit-html", {
      createHTML: t => t
    }) : void 0,
    E = `lit$${(Math.random() + "").slice(9)}$`,
    w = "?" + E,
    H = `<${w}>`,
    k = document,
    x = () => k.createComment(""),
    C = t => null === t || "object" != typeof t && "function" != typeof t,
    P = Array.isArray,
    V = "[ \t\n\f\r]",
    O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    U = /-->/g,
    M = />/g,
    T = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
    L = /'/g,
    R = /"/g,
    N = /^(?:script|style|textarea|title)$/i,
    j = (t => (e, ...s) => ({
      _$litType$: t,
      strings: e,
      values: s
    }))(1),
    D = Symbol.for("lit-noChange"),
    I = Symbol.for("lit-nothing"),
    B = new WeakMap(),
    q = k.createTreeWalker(k, 129, null, !1);
  function z(t, e) {
    if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== S ? S.createHTML(e) : e;
  }
  const W = (t, e) => {
    const s = t.length - 1,
      i = [];
    let n,
      r = 2 === e ? "<svg>" : "",
      o = O;
    for (let e = 0; e < s; e++) {
      const s = t[e];
      let a,
        l,
        d = -1,
        p = 0;
      for (; p < s.length && (o.lastIndex = p, l = o.exec(s), null !== l);) p = o.lastIndex, o === O ? "!--" === l[1] ? o = U : void 0 !== l[1] ? o = M : void 0 !== l[2] ? (N.test(l[2]) && (n = RegExp("</" + l[2], "g")), o = T) : void 0 !== l[3] && (o = T) : o === T ? ">" === l[0] ? (o = null != n ? n : O, d = -1) : void 0 === l[1] ? d = -2 : (d = o.lastIndex - l[2].length, a = l[1], o = void 0 === l[3] ? T : '"' === l[3] ? R : L) : o === R || o === L ? o = T : o === U || o === M ? o = O : (o = T, n = void 0);
      const h = o === T && t[e + 1].startsWith("/>") ? " " : "";
      r += o === O ? s + H : d >= 0 ? (i.push(a), s.slice(0, d) + "$lit$" + s.slice(d) + E + h) : s + E + (-2 === d ? (i.push(void 0), e) : h);
    }
    return [z(t, r + (t[s] || "<?>") + (2 === e ? "</svg>" : "")), i];
  };
  class Z {
    constructor({
      strings: t,
      _$litType$: e
    }, s) {
      let i;
      this.parts = [];
      let n = 0,
        r = 0;
      const o = t.length - 1,
        a = this.parts,
        [l, d] = W(t, e);
      if (this.el = Z.createElement(l, s), q.currentNode = this.el.content, 2 === e) {
        const t = this.el.content,
          e = t.firstChild;
        e.remove(), t.append(...e.childNodes);
      }
      for (; null !== (i = q.nextNode()) && a.length < o;) {
        if (1 === i.nodeType) {
          if (i.hasAttributes()) {
            const t = [];
            for (const e of i.getAttributeNames()) if (e.endsWith("$lit$") || e.startsWith(E)) {
              const s = d[r++];
              if (t.push(e), void 0 !== s) {
                const t = i.getAttribute(s.toLowerCase() + "$lit$").split(E),
                  e = /([.?@])?(.*)/.exec(s);
                a.push({
                  type: 1,
                  index: n,
                  name: e[2],
                  strings: t,
                  ctor: "." === e[1] ? Q : "?" === e[1] ? Y : "@" === e[1] ? tt : F
                });
              } else a.push({
                type: 6,
                index: n
              });
            }
            for (const e of t) i.removeAttribute(e);
          }
          if (N.test(i.tagName)) {
            const t = i.textContent.split(E),
              e = t.length - 1;
            if (e > 0) {
              i.textContent = A ? A.emptyScript : "";
              for (let s = 0; s < e; s++) i.append(t[s], x()), q.nextNode(), a.push({
                type: 2,
                index: ++n
              });
              i.append(t[e], x());
            }
          }
        } else if (8 === i.nodeType) if (i.data === w) a.push({
          type: 2,
          index: n
        });else {
          let t = -1;
          for (; -1 !== (t = i.data.indexOf(E, t + 1));) a.push({
            type: 7,
            index: n
          }), t += E.length - 1;
        }
        n++;
      }
    }
    static createElement(t, e) {
      const s = k.createElement("template");
      return s.innerHTML = t, s;
    }
  }
  function K(t, e, s = t, i) {
    var n, r, o, a;
    if (e === D) return e;
    let l = void 0 !== i ? null === (n = s._$Co) || void 0 === n ? void 0 : n[i] : s._$Cl;
    const d = C(e) ? void 0 : e._$litDirective$;
    return (null == l ? void 0 : l.constructor) !== d && (null === (r = null == l ? void 0 : l._$AO) || void 0 === r || r.call(l, !1), void 0 === d ? l = void 0 : (l = new d(t), l._$AT(t, s, i)), void 0 !== i ? (null !== (o = (a = s)._$Co) && void 0 !== o ? o : a._$Co = [])[i] = l : s._$Cl = l), void 0 !== l && (e = K(t, l._$AS(t, e.values), l, i)), e;
  }
  class G {
    constructor(t, e) {
      this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t) {
      var e;
      const {
          el: {
            content: s
          },
          parts: i
        } = this._$AD,
        n = (null !== (e = null == t ? void 0 : t.creationScope) && void 0 !== e ? e : k).importNode(s, !0);
      q.currentNode = n;
      let r = q.nextNode(),
        o = 0,
        a = 0,
        l = i[0];
      for (; void 0 !== l;) {
        if (o === l.index) {
          let e;
          2 === l.type ? e = new J(r, r.nextSibling, this, t) : 1 === l.type ? e = new l.ctor(r, l.name, l.strings, this, t) : 6 === l.type && (e = new et(r, this, t)), this._$AV.push(e), l = i[++a];
        }
        o !== (null == l ? void 0 : l.index) && (r = q.nextNode(), o++);
      }
      return q.currentNode = k, n;
    }
    v(t) {
      let e = 0;
      for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
    }
  }
  class J {
    constructor(t, e, s, i) {
      var n;
      this.type = 2, this._$AH = I, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cp = null === (n = null == i ? void 0 : i.isConnected) || void 0 === n || n;
    }
    get _$AU() {
      var t, e;
      return null !== (e = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) && void 0 !== e ? e : this._$Cp;
    }
    get parentNode() {
      let t = this._$AA.parentNode;
      const e = this._$AM;
      return void 0 !== e && 11 === (null == t ? void 0 : t.nodeType) && (t = e.parentNode), t;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t, e = this) {
      t = K(this, t, e), C(t) ? t === I || null == t || "" === t ? (this._$AH !== I && this._$AR(), this._$AH = I) : t !== this._$AH && t !== D && this._(t) : void 0 !== t._$litType$ ? this.g(t) : void 0 !== t.nodeType ? this.$(t) : (t => P(t) || "function" == typeof (null == t ? void 0 : t[Symbol.iterator]))(t) ? this.T(t) : this._(t);
    }
    k(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    $(t) {
      this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
    }
    _(t) {
      this._$AH !== I && C(this._$AH) ? this._$AA.nextSibling.data = t : this.$(k.createTextNode(t)), this._$AH = t;
    }
    g(t) {
      var e;
      const {
          values: s,
          _$litType$: i
        } = t,
        n = "number" == typeof i ? this._$AC(t) : (void 0 === i.el && (i.el = Z.createElement(z(i.h, i.h[0]), this.options)), i);
      if ((null === (e = this._$AH) || void 0 === e ? void 0 : e._$AD) === n) this._$AH.v(s);else {
        const t = new G(n, this),
          e = t.u(this.options);
        t.v(s), this.$(e), this._$AH = t;
      }
    }
    _$AC(t) {
      let e = B.get(t.strings);
      return void 0 === e && B.set(t.strings, e = new Z(t)), e;
    }
    T(t) {
      P(this._$AH) || (this._$AH = [], this._$AR());
      const e = this._$AH;
      let s,
        i = 0;
      for (const n of t) i === e.length ? e.push(s = new J(this.k(x()), this.k(x()), this, this.options)) : s = e[i], s._$AI(n), i++;
      i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
    }
    _$AR(t = this._$AA.nextSibling, e) {
      var s;
      for (null === (s = this._$AP) || void 0 === s || s.call(this, !1, !0, e); t && t !== this._$AB;) {
        const e = t.nextSibling;
        t.remove(), t = e;
      }
    }
    setConnected(t) {
      var e;
      void 0 === this._$AM && (this._$Cp = t, null === (e = this._$AP) || void 0 === e || e.call(this, t));
    }
  }
  class F {
    constructor(t, e, s, i, n) {
      this.type = 1, this._$AH = I, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = I;
    }
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t, e = this, s, i) {
      const n = this.strings;
      let r = !1;
      if (void 0 === n) t = K(this, t, e, 0), r = !C(t) || t !== this._$AH && t !== D, r && (this._$AH = t);else {
        const i = t;
        let o, a;
        for (t = n[0], o = 0; o < n.length - 1; o++) a = K(this, i[s + o], e, o), a === D && (a = this._$AH[o]), r || (r = !C(a) || a !== this._$AH[o]), a === I ? t = I : t !== I && (t += (null != a ? a : "") + n[o + 1]), this._$AH[o] = a;
      }
      r && !i && this.j(t);
    }
    j(t) {
      t === I ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t ? t : "");
    }
  }
  class Q extends F {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t) {
      this.element[this.name] = t === I ? void 0 : t;
    }
  }
  const X = A ? A.emptyScript : "";
  class Y extends F {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t) {
      t && t !== I ? this.element.setAttribute(this.name, X) : this.element.removeAttribute(this.name);
    }
  }
  class tt extends F {
    constructor(t, e, s, i, n) {
      super(t, e, s, i, n), this.type = 5;
    }
    _$AI(t, e = this) {
      var s;
      if ((t = null !== (s = K(this, t, e, 0)) && void 0 !== s ? s : I) === D) return;
      const i = this._$AH,
        n = t === I && i !== I || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive,
        r = t !== I && (i === I || n);
      n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
      var e, s;
      "function" == typeof this._$AH ? this._$AH.call(null !== (s = null === (e = this.options) || void 0 === e ? void 0 : e.host) && void 0 !== s ? s : this.element, t) : this._$AH.handleEvent(t);
    }
  }
  class et {
    constructor(t, e, s) {
      this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      K(this, t);
    }
  }
  const st = b.litHtmlPolyfillSupport;
  null == st || st(Z, J), (null !== (f = b.litHtmlVersions) && void 0 !== f ? f : b.litHtmlVersions = []).push("2.8.0");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  var it, nt;
  class rt extends m {
    constructor() {
      super(...arguments), this.renderOptions = {
        host: this
      }, this._$Do = void 0;
    }
    createRenderRoot() {
      var t, e;
      const s = super.createRenderRoot();
      return null !== (t = (e = this.renderOptions).renderBefore) && void 0 !== t || (e.renderBefore = s.firstChild), s;
    }
    update(t) {
      const e = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ((t, e, s) => {
        var i, n;
        const r = null !== (i = null == s ? void 0 : s.renderBefore) && void 0 !== i ? i : e;
        let o = r._$litPart$;
        if (void 0 === o) {
          const t = null !== (n = null == s ? void 0 : s.renderBefore) && void 0 !== n ? n : null;
          r._$litPart$ = o = new J(e.insertBefore(x(), t), t, void 0, null != s ? s : {});
        }
        return o._$AI(t), o;
      })(e, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var t;
      super.connectedCallback(), null === (t = this._$Do) || void 0 === t || t.setConnected(!0);
    }
    disconnectedCallback() {
      var t;
      super.disconnectedCallback(), null === (t = this._$Do) || void 0 === t || t.setConnected(!1);
    }
    render() {
      return D;
    }
  }
  rt.finalized = !0, rt._$litElement$ = !0, null === (it = globalThis.litElementHydrateSupport) || void 0 === it || it.call(globalThis, {
    LitElement: rt
  });
  const ot = globalThis.litElementPolyfillSupport;
  null == ot || ot({
    LitElement: rt
  }), (null !== (nt = globalThis.litElementVersions) && void 0 !== nt ? nt : globalThis.litElementVersions = []).push("3.3.3");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const at = t => e => "function" == typeof e ? ((t, e) => (customElements.define(t, e), e))(t, e) : ((t, e) => {
      const {
        kind: s,
        elements: i
      } = e;
      return {
        kind: s,
        elements: i,
        finisher(e) {
          customElements.define(t, e);
        }
      };
    })(t, e)
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    lt = (t, e) => "method" === e.kind && e.descriptor && !("value" in e.descriptor) ? {
      ...e,
      finisher(s) {
        s.createProperty(e.key, t);
      }
    } : {
      kind: "field",
      key: Symbol(),
      placement: "own",
      descriptor: {},
      originalKey: e.key,
      initializer() {
        "function" == typeof e.initializer && (this[e.key] = e.initializer.call(this));
      },
      finisher(s) {
        s.createProperty(e.key, t);
      }
    };
  function dt(t) {
    return (e, s) => void 0 !== s ? ((t, e, s) => {
      e.constructor.createProperty(s, t);
    })(t, e, s) : lt(t, e);
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */
  }
  function pt(t) {
    return dt({
      ...t,
      state: !0
    });
  }
  /**
       * @license
       * Copyright 2021 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  var ht;
  null === (ht = window.HTMLSlotElement) || void 0 === ht || ht.prototype.assignedElements;
  const ct = (t, e) => {
    const s = [];
    for (const t of e) s.push({
      app_id: t.app_id,
      app_slug: t.app_slug,
      entity_id: t.entity_id,
      friendly_name: t.friendly_name
    });
    return t.callApi("POST", "smartknob/apps", {
      apps: s
    });
  };
  let ut = class extends rt {
    constructor() {
      super(...arguments), this.apps = [], this.sortable = !1;
    }
    render() {
      const t = {
        select: {
          custom_value: !1,
          mode: "dropdown",
          options: this.appSlugs.map(t => ({
            value: t.slug_id,
            label: t.friendly_name
          }))
        }
      };
      return j`
      ${this.apps.map((e, s) => {
        var i;
        return j`<sk-reorderable-list-item
            .app_id=${e.app.app_id}
            .isDraggable=${this.sortable}
            @drop="${this.drop}"
            @delete="${() => {
          this.apps = this.apps.filter(t => t.app.app_id !== e.app.app_id), ct(this.hass, this.apps.map(t => t.app)), this.requestUpdate();
        }}"
          >
            <div class="list-item">
              <div class="index">${s + 1}</div>
              <ha-selector
                .hass=${this.hass}
                .selector=${t}
                .required=${!0}
                .label=${"Select App"}
                .value=${e.app_slug.slug_id}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector="${{
          entity: {
            include_entities: this.entities.map(t => t.entity_id.startsWith(e.app_slug.domain) ? t.entity_id : "")
          }
        }}"
                }}
                .required=${!0}
                .value=${null === (i = e.entity) || void 0 === i ? void 0 : i.entity_id}
              ></ha-selector>
            </div>
          </sk-reorderable-list-item> `;
      })}
    `;
    }
    drop(t) {
      var e;
      t.target.classList.remove("over");
      const s = null === (e = t.dataTransfer) || void 0 === e ? void 0 : e.getData("text/plain"),
        i = t.target.getAttribute("draggable-id");
      this.apps = this.reorderItems(this.apps, s, i), ct(this.hass, this.apps.map(t => t.app)), this.requestUpdate();
    }
    reorderItems(t, e, s) {
      const i = t.findIndex(t => t.app.app_id === e),
        n = t.findIndex(t => t.app.app_id === s),
        [r] = t.splice(i, 1);
      return t.splice(n, 0, r), t;
    }
  };
  ut.styles = a`
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
  `, e([dt({
    type: Object
  })], ut.prototype, "hass", void 0), e([dt({
    type: Array
  })], ut.prototype, "appSlugs", void 0), e([dt({
    type: Array
  })], ut.prototype, "entities", void 0), e([dt({
    type: Array
  })], ut.prototype, "apps", void 0), e([dt({
    type: Boolean
  })], ut.prototype, "sortable", void 0), ut = e([at("sk-reorderable-list")], ut);
  let vt = class extends rt {
    constructor() {
      super(...arguments), this.isDraggable = !0;
    }
    connectedCallback() {
      super.connectedCallback(), this.addEventListener("dragstart", this.dragStart), this.addEventListener("dragenter", this.dragEnter), this.addEventListener("dragover", this.dragOver), this.addEventListener("dragleave", this.dragLeave), this.addEventListener("dragend", this.dragEnd);
    }
    render() {
      return this.isDraggable ? this.setAttribute("draggable", "true") : this.removeAttribute("draggable"), this.setAttribute("draggable-id", this.app_id), j`
      <slot></slot>
      <div class="actions">
        <ha-svg-icon
          title="delete"
          class="delete"
          .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
          @click=${() => {
        this.dispatchEvent(new CustomEvent("delete", {
          detail: {
            id: this.app_id
          },
          bubbles: !0,
          composed: !0
        }));
      }}
        ></ha-svg-icon>
        <ha-svg-icon
          title="draggable"
          .path=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}
          class="sort"
          style=${this.isDraggable ? "" : "display: none;"}
        ></ha-svg-icon>
      </div>
    `;
    }
    dragStart(t) {
      var e;
      this.style.opacity = "0.4", null === (e = t.dataTransfer) || void 0 === e || e.setData("text/plain", this.id), t.dataTransfer.effectAllowed = "move", this.classList.add("draggable-content"), t.target.classList.add("over");
    }
    dragEnter(t) {
      t.preventDefault(), t.target.classList.add("over");
    }
    dragOver(t) {
      t.preventDefault(), t.dataTransfer.dropEffect = "move";
    }
    dragLeave(t) {
      t.preventDefault(), t.target.classList.remove("over");
    }
    dragEnd(t) {
      this.style.opacity = "1", t.target.classList.remove("over"), this.requestUpdate();
    }
  };
  vt.styles = a`
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
  `, e([dt()], vt.prototype, "app_id", void 0), e([dt({
    type: Boolean
  })], vt.prototype, "isDraggable", void 0), vt = e([at("sk-reorderable-list-item")], vt);
  let _t = class extends rt {
    constructor() {
      super(...arguments), this._selectedSlug = null, this._selectedEntity = null, this._domain = "", this._sortable = !1, this.handleSubmit = t => {
        var e;
        //! VALIDATE INPUTS
        if (t.preventDefault(), !this._selectedSlug || !this._selectedEntity) return;
        const s = {
          app: {
            app_id: `${this._selectedSlug.slug}-${this._selectedEntity.entity_id}`,
            app_slug: this._selectedSlug.slug,
            entity_id: this._selectedEntity.entity_id,
            friendly_name: null !== (e = this._selectedEntity.attributes.friendly_name) && void 0 !== e ? e : ""
          },
          app_slug: this._selectedSlug,
          entity: this._selectedEntity
        };
        this.apps.find(t => t.app_slug == s.app_slug && t.entity == s.entity) || this.apps.push(s), this.apps = [...this.apps], console.log(this._selectedSlug), (async (t, e, s) => {
          console.log("HMMMM"), console.log(s), await t.callApi("POST", "smartknob/apps", {
            mac_address: e,
            apps: [{
              app_id: s.app_id,
              app_slug: s.app_slug,
              entity_id: s.entity_id,
              friendly_name: s.friendly_name
            }]
          });
        })(this.hass, this.mac_address, s.app), this.requestUpdate();
      };
    }
    connectedCallback() {
      super.connectedCallback(), this._selectedSlug = this.appSlugs[0], this._domain = this._selectedSlug.domain;
    }
    render() {
      var t, e;
      const s = {
        select: {
          custom_value: !1,
          mode: "dropdown",
          options: this.appSlugs.map(t => ({
            value: t.slug,
            label: t.friendly_name
          }))
        }
      };
      return j`
      <button
        @click=${() => {
        (async (t, e) => {
          await t.callApi("POST", "smartknob/knob/sync", {
            mac_address: e
          });
        })(this.hass, this.mac_address);
      }}
      >
        Sync to KNOB
      </button>
      <form class="add-app" @submit=${this.handleSubmit}>
        <ha-selector
          .hass=${this.hass}
          .selector=${s}
          .required=${!0}
          .label=${"Select App"}
          .value=${null === (t = this._selectedSlug) || void 0 === t ? void 0 : t.slug}
          @value-changed=${this.appSlugChanged}
        ></ha-selector>
        <ha-selector
          .hass=${this.hass}
          .selector=${{
        entity: {
          include_entities: this.entities.map(t => !t.entity_id.startsWith(this._domain) || this.apps.find(e => {
            var s;
            return (null === (s = this._selectedSlug) || void 0 === s ? void 0 : s.slug) == e.app.app_slug && e.app.entity_id == t.entity_id;
          }) ? "" : t.entity_id)
        }
      }}
          .required=${!0}
          .value=${null === (e = this._selectedEntity) || void 0 === e ? void 0 : e.attributes.friendly_name}
          @value-changed=${this.entityChanged}
        ></ha-selector>

        <button type="submit" class="btn">
          <ha-svg-icon title="submit" .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}></ha-svg-icon>
        </button>
        <button
          @click=${t => {
        t.preventDefault(), this._sortable = !this._sortable;
      }}
          class="btn reorder-btn"
        >
          <ha-svg-icon title="reorder" .path=${"M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z"}></ha-svg-icon>
        </button>
      </form>

      <sk-reorderable-list
        .hass=${this.hass}
        .appSlugs=${this.appSlugs}
        .apps="${this.apps}"
        .sortable=${this._sortable}
        .entities=${this.entities}
      ></sk-reorderable-list>
    `;
    }
    listApps() {
      return j`${this.apps.map(t => {
        const e = `${t.app_slug.slug}-${t.entity.entity_id}`;
        return j`<li .id="${e}">
        ${t.app_slug.friendly_name} - ${t.entity.attributes.friendly_name}
      </li>`;
      })}`;
    }
    appSlugChanged(t) {
      var e, s, i;
      //!https://github.com/home-assistant/frontend/blob/dev/src/common/dom/fire_event.ts#L60
      this._selectedSlug = null !== (e = this.appSlugs.find(e => e.slug == t.detail.value)) && void 0 !== e ? e : null, this._domain = null !== (i = null === (s = this._selectedSlug) || void 0 === s ? void 0 : s.domain) && void 0 !== i ? i : "", this._selectedEntity = null, this.requestUpdate();
    }
    entityChanged(t) {
      var e;
      //! https://github.com/home-assistant/frontend/blob/dev/src/common/dom/fire_event.ts#L60
      this._selectedEntity = null !== (e = Object.values(this.hass.states).find(e => e.entity_id == t.detail.value)) && void 0 !== e ? e : null;
    }
  };
  _t.styles = a`
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
  `, e([dt({
    type: Object
  })], _t.prototype, "hass", void 0), e([dt({
    type: Array
  })], _t.prototype, "entities", void 0), e([dt({
    type: Array
  })], _t.prototype, "appSlugs", void 0), e([dt({
    type: Array
  })], _t.prototype, "apps", void 0), e([dt({
    type: String
  })], _t.prototype, "mac_address", void 0), e([pt()], _t.prototype, "_selectedSlug", void 0), e([pt()], _t.prototype, "_selectedEntity", void 0), e([pt()], _t.prototype, "_domain", void 0), e([pt()], _t.prototype, "_sortable", void 0), _t = e([at("app-form")], _t);
  const gt = [{
    tabId: "setup",
    tabName: "Setup"
  }, {
    tabId: "configuration",
    tabName: "Configuration"
  }];
  t.SmartknobPanel = class extends rt {
    constructor() {
      super(...arguments), this._appSlugs = [], this._appList = [], this._knobs = {}, this._currentTab = gt[0];
    }
    async connectedCallback() {
      var t, e;
      const s = (await (async t => {
          const e = await t.callApi("GET", "smartknob/knobs");
          return 1 != e.success && console.log("ERROR: Couldn't get knobs"), e;
        })(this.hass)).knobs,
        i = (await (async t => {
          const e = await t.callApi("GET", "smartknob/app_slugs");
          return "success" != e.success && console.log("ERROR: Couldn't get app slugs"), e;
        })(this.hass)).app_slugs,
        n = [];
      for (const r in s) for (const o of s[r].apps) {
        const s = null !== (t = i.find(t => t.slug == o.app_slug)) && void 0 !== t ? t : i[0],
          r = null !== (e = [...Object.values(this.hass.states)].find(t => t.entity_id == o.entity_id)) && void 0 !== e ? e : null;
        n.push({
          app: {
            app_id: o.app_id,
            app_slug: o.app_slug,
            entity_id: o.entity_id,
            friendly_name: o.friendly_name
          },
          app_slug: s,
          entity: r
        });
      }
      this._appList = n, this._appSlugs = i, this._knobs = s, super.connectedCallback(), this.requestUpdate();
    }
    async firstUpdated() {
      await (async () => {
        if (customElements.get("ha-selector-entity")) return;
        await customElements.whenDefined("partial-panel-resolver");
        const t = document.createElement("partial-panel-resolver");
        t.hass = {
          panels: [{
            url_path: "tmp",
            component_name: "config"
          }]
        }, t._updateRoutes(), await t.routerOptions.routes.tmp.load(), await customElements.whenDefined("ha-panel-config");
        const e = document.createElement("ha-panel-config");
        await e.routerOptions.routes.automation.load();
      })(), this.requestUpdate();
    }
    render() {
      if (!customElements.get("ha-panel-config") || !customElements.get("ha-menu-button")) return j` loading... `;
      const t = [...Object.values(this.hass.states)];
      return j`<div>
      <div>
        <div class="header">
          <div class="toolbar">
            <ha-menu-button
              .hass=${this.hass}
              .narrow=${this.narrow}
            ></ha-menu-button>
            <h2>Smartknob</h2>
          </div>
          <ha-tabs
            scrollable
            attr-for-selected="tab-name"
            .selected=${this._currentTab.tabId}
            @iron-activate=${this.handleTabSelect}
          >
            ${gt.map(t => j`<paper-tab tab-name=${t.tabId}
                  >${t.tabName}</paper-tab
                >`)}
          </ha-tabs>
        </div>
        <div class="content">
          <app-form
            .hass=${this.hass}
            .entities=${t}
            .appSlugs=${this._appSlugs}
            .apps=${this._appList}
            .mac_address=${this._knobs[Object.keys(this._knobs)[0]].mac_address}
          ></app-form>
        </div>
      </div>
    </div>`;
    }
    handleTabSelect(t) {
      const e = t.detail.item.getAttribute("tab-name"),
        s = window.location.origin;
      s.endsWith(e) ? this.scrollTo(0, 0) : (history.replaceState(null, "", `${s}/smartknob/${e}`), this.requestUpdate());
    }
  }, t.SmartknobPanel.styles = a`
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
  `, e([dt({
    type: Object
  })], t.SmartknobPanel.prototype, "hass", void 0), e([dt({
    type: Boolean
  })], t.SmartknobPanel.prototype, "narrow", void 0), e([pt()], t.SmartknobPanel.prototype, "_appSlugs", void 0), e([pt()], t.SmartknobPanel.prototype, "_appList", void 0), e([pt()], t.SmartknobPanel.prototype, "_knobs", void 0), e([pt()], t.SmartknobPanel.prototype, "_currentTab", void 0), t.SmartknobPanel = e([at("smartknob-panel")], t.SmartknobPanel);
}({});
