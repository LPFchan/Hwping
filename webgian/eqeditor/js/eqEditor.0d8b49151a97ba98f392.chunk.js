"use strict";
(self.webpackChunkwebapp = self.webpackChunkwebapp || []).push([[291], {
    1471: (t, e, n) => {
        n.r(e),
        n.d(e, {
            default: () => it
        });
        var s = n(9506)
          , r = n(8894)
          , o = n(9958)
          , c = n(7453)
          , i = n(2794)
          , u = n(3836)
          , a = n(9981)
          , l = n(5910);
        const d = function() {
            function t(t) {
                l.publish("/ui/action", t)
            }
            function e(e, s, o) {
                let c = r.makeEventAction(e, o)
                  , i = !1;
                return c && (c = function(t) {
                    let e, s, r, o = t.target;
                    return n.isCheckboxWidget(o) && (s = n.getValueKey(o),
                    e = t.value,
                    d.isObject(e) && s ? (r = e[s],
                    e[s] = "true" === r ? "false" : "true") : t.value = "true" === e ? "false" : "true"),
                    t
                }(c),
                c.type === p.EVENT_ACTION_TYPE.UI ? (n.updateUi(c),
                s && t(c)) : (n.closeLayerMenu(e),
                t(c)),
                i = !0),
                i
            }
            const n = o.Z
              , r = i.Z
              , d = u.Z
              , p = s.Z
              , f = c.Z
              , h = a.Z;
            let m = d.keyCodeMap
              , x = parseInt(m.backspace, 10)
              , v = parseInt(m.delete, 10)
              , w = parseInt(m.tab, 10)
              , _ = parseInt(m.enter, 10)
              , E = parseInt(m.esc, 10)
              , O = parseInt(m.space, 10)
              , g = null
              , I = !1
              , A = null
              , N = f.uiKeyEvent
              , S = f.uiMouseEvent;
            return {
                initialize: function(e) {
                    l.subscribe("/ui/update", l.proxy(this.t, this)),
                    l.subscribe("/ui/custom", l.proxy(this.o, this)),
                    S.initialize(t)
                },
                doMouseDownEvent: function(t) {
                    const e = t.target
                      , s = n.findContainerInfoToParent(e)
                      , r = s.container
                      , o = n.findCommandElementToParent(e, r)
                      , c = r && r.id
                      , i = c === p.DOCUMENT_MENU_ID && !o;
                    let u, a;
                    I && (I = !1),
                    g = c === p.CONTEXT_MENU_ID ? r : s.layerNode,
                    a = S.doMouseDownEvent(t, s),
                    i || (u = !0,
                    n.uiUtil.isDisabled(o) || (!n.isInputWrapWidget(o) || n.isTextInputWidget(o) && !n.isInput(e)) && !n.isTextareaWidget(o) ? o && (d.hasClass(o.parentNode, p.SPINNER_WRAP_CLASS) || o.getAttribute(p.DATA_UI_COMMAND) === p.UI_COMMAND_NAME.MENU_H_SCROLL) && (A = {
                        type: "mouse",
                        target: e,
                        commandEl: o
                    },
                    A.evtID = window.setTimeout(this.i.bind(this, t), p.SPINNER_HOLD_DELAY_TIME)) : (u = !1,
                    u || !n.isCheckboxWidget(o) && !n.isRadioWidget(o) || (u = !0))),
                    (u || a) && t.preventDefault(),
                    N.blurFocusWidgetIfDiffTarget(e, s, o)
                },
                u: function(t) {
                    let e = t.target
                      , s = e ? e.nodeName : ""
                      , r = n.findContainerNodeToParent(e)
                      , o = !1;
                    r && r.id === p.DOCUMENT_MENU_ID && (o = !0),
                    o || "INPUT" === s || "TEXTAREA" === s || t.preventDefault()
                },
                doMouseMoveEvent: function(t) {
                    S.doMouseMoveEvent(t)
                },
                doMouseUpEvent: function(t) {
                    const e = t.target;
                    let s;
                    I && (e && "INPUT" === e.nodeName && (s = n.uiUtil.getBrowserInfo(),
                    s.isSafari ? t.preventDefault() : e.select()),
                    I = !1),
                    A && this.l(),
                    S.doMouseUpEvent(t)
                },
                p: function(t) {
                    const s = t.target
                      , r = n.findContainerInfoToParent(s)
                      , o = r.container
                      , c = (r.topNode,
                    r.layerNode)
                      , i = n.findCommandElementToParent(s, o, !0);
                    let u, a = !1, l = !1;
                    return n.checkCloseColorPickerLayerByExecuteWidget(i),
                    n.checkCloseLayer(s, r),
                    n.isInputWrapWidget(i) || n.isTextareaWidget(i) ? (u = function() {
                        e(i, !0)
                    }
                    ,
                    (n.isCheckboxWidget(i) || n.isRadioWidget(i)) && i !== s ? (window.setTimeout(u.bind(this), 0),
                    l = !1) : l = !0) : (a = e(i, !0),
                    a || g || o && (o.id === p.CONTEXT_MENU_ID || c) || n.closeLayerMenu()),
                    l || !a && o && o.id === p.DOCUMENT_MENU_ID || n.isOnLinkButton(s) ? a = !0 : (a = !1,
                    t.preventDefault()),
                    a
                },
                h: function(t) {
                    return !1
                },
                m: function(t) {
                    let e = t.target;
                    A && "mouse" === A.type && (e !== A.target ? A.evtID && this.l(!0) : A.evtID || this.i({
                        target: A.target
                    }))
                },
                i: function(t) {
                    if (!(t && t.target && A))
                        return;
                    let e = A.commandEl;
                    !e || n.isDisabled(e) || n.isHidden(e) ? this.l() : (this.v(t),
                    A.evtID = window.setTimeout(this.i.bind(this, t), p.SPINNER_HOLD_TIMER))
                },
                v: function(t) {
                    let e = {
                        type: "click",
                        target: t.target,
                        preventDefault: function() {
                            return !0
                        }
                    };
                    A && (this.l(!0),
                    t && t.type && -1 !== t.type.indexOf("keydown") ? (e.type = "keypress",
                    e.target = A.target,
                    this._(e)) : this.p(e))
                },
                l: function(t) {
                    A && (A.evtID && (window.clearTimeout(A.evtID),
                    A.evtID = null),
                    t || (A = null))
                },
                _: function(t) {
                    if (!t || "keypress" !== t.type)
                        return;
                    let s = t.target;
                    s && A && s === A.target && n.uiUtil.getSpinnerType(s) && e(s, !0)
                },
                O: function(s) {
                    let o, c, i = s.keyCode, u = !1;
                    if (i === E)
                        if (n.isEscCloseableDialogShowing())
                            c = N.doEscKeyDown(s),
                            o = c.executeWidget,
                            u = !!c.closedType;
                        else {
                            t(r.makeEventActionObj(p.UPDATE_CMD, p.EVENT_ACTION_TYPE.UI, p.UI_COMMAND_NAME.HIDE, p.EDIT_FORMULA_DIALOG_NAME)),
                            u = !0
                        }
                    else
                        d.keyMap(this, s).isMovementKeys() ? (c = N.doArrowKeyDown(s),
                        o = c.executeWidget,
                        u = c.isStopEvent,
                        o && "" !== n.uiUtil.getSpinnerType(o) && (A ? o = null : (A = {
                            type: "key",
                            target: o,
                            commandEl: n.findCommandElementToParent(o)
                        },
                        A.evtID = window.setTimeout(this.i.bind(this, s), p.SPINNER_HOLD_DELAY_TIME)))) : i === w ? u = !!N.doTabKeyDown(s) : i === _ ? (o = N.doEnterKeyDown(s),
                        u = !n.isTextareaWidget(s.target)) : i === O ? (o = N.doSpaceKeyDown(s),
                        u = !!o) : u = N.checkStopShortcutKeyDown(s);
                    o && e(o, !0),
                    u && s.preventDefault()
                },
                I: function(s) {
                    let o, c = s.type, i = s.target, u = n.findContainerInfoToParent(i).container, a = n.findCommandElementToParent(i, u), l = !1;
                    "change" === c && -1 === ["checkbox", "radio"].indexOf(i.type) ? n.isInput(i) && !d.hasClass(a, p.PREVIEW_COLOR_TEXT_CLASS) && (l = !0,
                    e(a, l)) : "input" === c ? n.uiUtil.checkUpdateSpectrumColor(i, s, !0) || (N.doInputEvent(s),
                    t(r.makeInputEventAction(i))) : "compositionend" === c ? n.uiUtil.checkUpdateSpectrumColor(i, s, !0) || t(r.makeInputEventAction(i)) : "keyup" === c && (o = s.keyCode,
                    o === x || o === v ? t(r.makeInputEventAction(i)) : o === _ && e(a, !0),
                    A && this.l())
                },
                N: function(t) {
                    let e, s, r = t.target, o = r ? r.nodeName : "", c = ["text", "number"];
                    "INPUT" !== o && "TEXTAREA" !== o || (s = n.getFocusWidgetInfo().isTabFocus,
                    n.setFocusWidgetInfo(r),
                    "INPUT" !== o || -1 === c.indexOf(r.getAttribute("type")) || !s && n.uiUtil.isDialogContainer(r) || (r.select(),
                    e = n.uiUtil.getBrowserInfo(),
                    (e.isSafari || e.isMSIE || e.isEdge) && (I = !0)))
                },
                S: function(t) {
                    n.removeFocusWidgetInfo()
                },
                R: function() {
                    n.setDialogTopPos(),
                    n.setTooltipPos(),
                    n.setDropdownPosition(),
                    n.setCollaboToolPos(),
                    n.updateToolBarScroll(),
                    h.setPosIframeToSidebar(!0),
                    window.parent.HwpApp.ResizeView()
                },
                o: function(e) {
                    if (e)
                        switch (e.type) {
                        case p.CUSTOM_EVENT_TYPE.PLUGIN_CHAT:
                            e.name === p.PLUGIN_EVENT_NAME.CHAT_SHARE_POS && t(e);
                        case p.CUSTOM_EVENT_TYPE.UI_RESIZE:
                        case p.CUSTOM_EVENT_TYPE.UI_CLOSE_DIALOG:
                        case p.CUSTOM_EVENT_TYPE.CLOSE_APP:
                        }
                },
                t: function(t, e) {
                    n.updateUi(t),
                    t.target && !e && n.closeDialog()
                }
            }
        }();
        var p = n(3696)
          , f = n(5910);
        const h = function() {
            function t(t, e, s, o) {
                let i, u, l = "";
                if (i = c.checkValidationNumber(e, 1, 4096, 0),
                o) {
                    switch (i) {
                    case a.UNDER_MIN:
                    case a.OVER_MAX:
                        l = r.substitute(window.LangDefine.FontSizeError, {
                            scope: h
                        });
                        break;
                    case a.NOT_NUMBER:
                    case a.HAS_MINUS_NUMBER:
                        u = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"),
                        n.setValueToInput(s, u)
                    }
                    l ? n.showTooltip(s, l) : n.hideTooltip()
                }
                return {
                    k: null,
                    result: i
                }
            }
            const e = s.Z
              , n = o.Z
              , r = u.Z
              , c = (i.Z,
            n.uiUtil)
              , a = e.VALIDATION_CHECK_RESULT
              , l = e.EVENT_ACTION_NAMES
              , d = e.EVENT_ACTION_TYPE
              , p = (l.FONT_NAME,
            l.FONT_SIZE)
              , h = "1 ~ 4096";
            Math.pow(16, 6);
            return {
                G(e) {
                    if (!e || e.type !== d.INPUT)
                        return;
                    const n = e.value
                      , s = n && r.isObject(n) ? Object.keys(n) : null
                      , o = s && s.length ? s[0] : null
                      , c = o ? n[o] : n;
                    let i;
                    if (e.name === p)
                        i = t(0, c, e.target, !0).k;
                    i && f.publish("/ui/update", i, !0)
                }
            }
        }()
          , m = function() {
            let t, e, n, s, r, o;
            return {
                M: 0,
                T: 1,
                F: 2,
                P: 4,
                q: 8,
                init(c) {
                    t = document.createElement("textarea"),
                    t.setAttribute("id", "eq_textarea"),
                    t.setAttribute("class", "textarea_box"),
                    t.setAttribute("spellcheck", !1),
                    t.setAttribute("style", "height: 100%; background-color: white;");
                    const i = document.getElementsByClassName("edit_area")[0];
                    i.setAttribute("style", "overflow: hidden; "),
                    i.appendChild(t),
                    e = document.createElement("img");
                    const u = document.getElementsByClassName("preview_area")[0]
                      , a = document.createElement("div");
                    var l;
                    a.style.padding = "5px",
                    a.appendChild(e),
                    u.appendChild(a),
                    t.focus(),
                    n = (l = c).line_mode,
                    s = l.font_name,
                    r = l.font_size,
                    o = l.font_color,
                    t.value = l.script
                },
                C(e) {
                    let n = t.value
                      , s = t.selectionStart
                      , r = t.selectionEnd
                      , o = Math.abs(s - r);
                    t.value = n.slice(0, s) + e + n.slice(s + o);
                    let c = e.indexOf("{");
                    c = -1 === c ? e.length : Math.min(c + 2, e.length),
                    t.selectionEnd = r + c,
                    t.focus()
                },
                U(e) {
                    t.value = e,
                    t.focus()
                },
                render(e, n) {
                    n & this.T && 0 !== t.value.length && "\n" !== t.value.charAt(t.selectionStart - 1) && (e = " " + e),
                    n & this.F && (e += " "),
                    n & this.P && (e += "\n"),
                    n & this.q && (t.selectionStart = t.value.length),
                    this.C(e)
                },
                D(t) {
                    e.src = t
                },
                J: () => t.value,
                H: () => n,
                B(t) {
                    n = t
                },
                K: () => s,
                L(t) {
                    s = t
                },
                X: () => r,
                j(t) {
                    r = t
                },
                V: () => o,
                W(t) {
                    o = t
                },
                Y() {
                    return {
                        line_mode: n,
                        font_name: s,
                        font_size: r,
                        font_color: o,
                        script: this.J()
                    }
                }
            }
        }()
          , x = function() {
            const t = {
                tt: 54784
            };
            return t.et = t.tt + 0,
            t.nt = t.tt + 1,
            t.st = t.tt + 2,
            t.rt = t.tt + 3,
            t.ot = t.tt + 4,
            t.ct = t.tt + 5,
            t.it = t.tt + 6,
            t.ut = t.tt + 7,
            t.lt = t.tt + 8,
            t.dt = t.tt + 9,
            t.ft = t.tt + 10,
            t.ht = t.tt + 11,
            t.xt = t.tt + 12,
            t.vt = t.tt + 13,
            t.wt = t.tt + 14,
            t._t = t.tt + 15,
            t.Et = t.tt + 16,
            t.Ot = t.tt + 17,
            t.gt = t.tt + 18,
            t.It = t.tt + 19,
            t.At = t.tt + 20,
            t.Nt = t.tt + 21,
            t.St = t.tt + 22,
            t.Rt = t.tt + 23,
            t.kt = t.tt + 24,
            t.yt = t.tt + 25,
            t.bt = t.tt + 26,
            t.Gt = t.tt + 27,
            t.Mt = t.tt + 28,
            t.Tt = t.tt + 29,
            t.Ft = t.tt + 30,
            t.zt = t.tt + 31,
            t.Pt = t.tt + 32,
            t.qt = t.tt + 33,
            t.Ct = t.tt + 34,
            t.Ut = t.tt + 40,
            t.Dt = t.tt + 41,
            t.Jt = t.tt + 48,
            t.Ht = t.tt + 49,
            t.Bt = t.tt + 50,
            t.Kt = t.tt + 51,
            t.Lt = t.tt + 64,
            t.Qt = t.tt + 66,
            t.Xt = t.tt + 67,
            t.jt = t.tt + 68,
            t.$t = t.tt + 69,
            t.Vt = t.tt + 70,
            t.Wt = t.tt + 128,
            t.Yt = t.tt + 129,
            t.Zt = t.tt + 130,
            t.te = t.tt + 131,
            t.ee = t.tt + 132,
            t.ne = t.tt + 133,
            t.se = t.tt + 134,
            t.re = t.tt + 135,
            t.oe = t.tt + 136,
            t.ce = t.tt + 137,
            t.ie = t.tt + 138,
            t.ue = t.tt + 139,
            t.ae = t.tt + 140,
            t.le = t.tt + 262,
            t.de = t.tt + 263,
            t.pe = t.tt + 264,
            t.fe = t.tt + 265,
            t.he = t.tt + 266,
            t.me = t.tt + 267,
            t.xe = t.tt + 268,
            t.ve = t.tt + 269,
            t.we = t.tt + 270,
            t._e = t.tt + 271,
            t.Ee = t.tt + 272,
            t.Oe = t.tt + 273,
            t.ge = t.tt + 274,
            t.Ie = t.tt + 275,
            t.Ae = t.tt + 276,
            t.Ne = t.tt + 283,
            t.Se = t.tt + 284,
            t.Re = t.tt + 285,
            t.ke = t.tt + 286,
            t.ye = t.tt + 287,
            t.be = t.tt + 288,
            t.Ge = t.tt + 289,
            t.Me = t.tt + 290,
            t.Te = t.tt + 291,
            t.Fe = t.tt + 292,
            t.ze = t.tt + 293,
            t.Pe = t.tt + 294,
            t.qe = t.tt + 295,
            t.Ce = t.tt + 296,
            t.Ue = t.tt + 297,
            t.De = t.tt + 298,
            t.Je = t.tt + 299,
            t.He = t.tt + 300,
            t.Be = t.tt + 301,
            t.Ke = t.tt + 302,
            t.Le = t.tt + 303,
            t.Qe = t.tt + 304,
            t.Xe = t.tt + 305,
            t.je = t.tt + 306,
            t.$e = t.tt + 307,
            t.Ve = t.tt + 308,
            t.We = t.tt + 309,
            t.Ye = t.tt + 310,
            t.Ze = t.tt + 311,
            t.tn = t.tt + 312,
            t.en = t.tt + 313,
            t.nn = t.tt + 314,
            t.sn = t.tt + 315,
            t.rn = t.tt + 316,
            t.cn = t.tt + 317,
            t.un = t.tt + 318,
            t.an = t.tt + 319,
            t.ln = t.tt + 320,
            t.dn = t.tt + 321,
            t.pn = t.tt + 322,
            t.fn = t.tt + 323,
            t.hn = t.tt + 324,
            t.mn = t.tt + 325,
            t.xn = t.tt + 326,
            t.vn = t.tt + 327,
            t.wn = t.tt + 328,
            t._n = t.tt + 329,
            t.En = t.tt + 330,
            t.On = t.tt + 331,
            t.gn = t.tt + 332,
            t.In = t.tt + 333,
            t.An = t.tt + 334,
            t.Nn = t.tt + 335,
            t.Sn = t.tt + 336,
            t.Rn = t.tt + 337,
            t.kn = t.tt + 338,
            t.yn = t.tt + 339,
            t.bn = t.tt + 340,
            t.Gn = t.tt + 341,
            t.Mn = t.tt + 342,
            t.Tn = t.tt + 343,
            t.Fn = t.tt + 344,
            t.zn = t.tt + 345,
            t.Pn = t.tt + 346,
            t.qn = t.tt + 347,
            t.Cn = t.tt + 348,
            t.Un = t.tt + 349,
            t.Dn = t.tt + 350,
            t.Jn = t.tt + 351,
            t.Hn = t.tt + 352,
            t.Bn = t.tt + 353,
            t.Kn = t.tt + 354,
            t.Ln = t.tt + 355,
            t.Qn = t.tt + 356,
            t.Xn = t.tt + 357,
            t.jn = t.tt + 358,
            t.$n = t.tt + 359,
            t.Vn = t.tt + 360,
            t.Wn = t.tt + 361,
            t.Yn = t.tt + 362,
            t.Zn = t.tt + 363,
            t.ts = t.tt + 364,
            t.es = t.tt + 365,
            t.ns = t.tt + 366,
            t.ss = t.tt + 367,
            t.rs = t.tt + 368,
            t.cs = t.tt + 369,
            t.us = t.tt + 370,
            t.ls = t.tt + 371,
            t.ds = t.tt + 372,
            t.ps = t.tt + 373,
            t.fs = t.tt + 374,
            t.hs = t.tt + 375,
            t.xs = t.tt + 376,
            t.vs = t.tt + 377,
            t.ws = t.tt + 378,
            t._s = t.tt + 379,
            t.Es = t.tt + 380,
            t.Os = t.tt + 381,
            t.gs = t.tt + 382,
            t.Is = t.tt + 383,
            t.As = t.tt + 384,
            t.Ns = t.tt + 385,
            t.Ss = t.tt + 386,
            t.Rs = t.tt + 387,
            t.ks = t.tt + 388,
            t.ys = t.tt + 389,
            t.bs = t.tt + 390,
            t.Gs = t.tt + 391,
            t.Ms = t.tt + 392,
            t.Ts = t.tt + 393,
            t.Fs = t.tt + 394,
            t.zs = t.tt + 395,
            t.Ps = t.tt + 396,
            t.qs = t.tt + 397,
            t.Cs = t.tt + 398,
            t.Us = t.tt + 399,
            t.Ds = t.tt + 400,
            t.Js = t.tt + 401,
            t.Hs = t.tt + 402,
            t.Bs = t.tt + 403,
            t.Ks = t.tt + 404,
            t.Ls = t.tt + 405,
            t.Qs = t.tt + 406,
            t.Xs = t.tt + 407,
            t.js = t.tt + 408,
            t.$s = t.tt + 409,
            t.Vs = t.tt + 410,
            t.Ws = t.tt + 411,
            t.Ys = t.tt + 412,
            t.Zs = t.tt + 413,
            t.tr = t.tt + 414,
            t.er = t.tt + 415,
            t.nr = t.tt + 416,
            t.sr = t.tt + 417,
            t.rr = t.tt + 418,
            t.cr = t.tt + 419,
            t.ir = t.tt + 420,
            t.ur = t.tt + 421,
            t.ar = t.tt + 422,
            t.lr = t.tt + 423,
            t.dr = t.tt + 424,
            t.pr = t.tt + 425,
            t.hr = t.tt + 426,
            t.mr = t.tt + 427,
            t.vr = t.tt + 428,
            t.wr = t.tt + 429,
            t._r = t.tt + 430,
            t.Er = t.tt + 431,
            t.Or = t.tt + 432,
            t.gr = t.tt + 433,
            t.Ir = t.tt + 434,
            t.Ar = t.tt + 435,
            t.Nr = t.tt + 436,
            t.Sr = t.tt + 437,
            t.Rr = t.tt + 438,
            t.kr = t.tt + 439,
            t.yr = t.tt + 440,
            t.br = t.tt + 441,
            t.Gr = t.tt + 442,
            t.Mr = t.tt + 443,
            t.Tr = t.tt + 444,
            t.Fr = t.tt + 445,
            t.zr = t.tt + 446,
            t.Pr = t.tt + 447,
            t.qr = t.tt + 448,
            t.Cr = t.tt + 449,
            t.Ur = t.tt + 450,
            t.Dr = t.tt + 451,
            t.Jr = t.tt + 452,
            t.Hr = t.tt + 453,
            t.Br = t.tt + 454,
            t.Kr = t.tt + 455,
            t.Lr = t.tt + 456,
            t.Qr = t.tt + 457,
            t.Xr = t.tt + 458,
            t.jr = t.tt + 459,
            t.$r = t.tt + 460,
            t.Vr = t.tt + 461,
            t.Wr = t.tt + 462,
            t.Yr = t.tt + 463,
            t.Zr = t.tt + 464,
            t.eo = t.tt + 465,
            t.no = t.tt + 466,
            t.so = t.tt + 467,
            t.ro = t.tt + 468,
            t.oo = t.tt + 469,
            t.co = t.tt + 470,
            t.io = t.tt + 471,
            t.uo = t.tt + 472,
            t.ao = t.tt + 473,
            t.lo = t.tt + 474,
            t.do = t.tt + 475,
            t.po = t.tt + 476,
            t.fo = t.tt + 477,
            t.ho = t.tt + 478,
            t.mo = t.tt + 479,
            t.xo = t.tt + 480,
            t.vo = t.tt + 481,
            t.wo = t.tt + 482,
            t._o = t.tt + 483,
            t.Eo = t.tt + 484,
            t.Oo = t.tt + 485,
            t.Io = t.tt + 486,
            t.Ao = t.tt + 487,
            t.No = t.tt + 488,
            t.So = t.tt + 489,
            t.Ro = t.tt + 490,
            t.ko = t.tt + 491,
            t.yo = t.tt + 492,
            t.bo = t.tt + 493,
            t.Go = t.tt + 494,
            t.Mo = t.tt + 495,
            t.To = t.tt + 496,
            t.Fo = t.tt + 497,
            t.zo = t.tt + 498,
            t.Po = t.tt + 499,
            t.qo = t.tt + 500,
            t.Co = t.tt + 501,
            t.Uo = t.tt + 502,
            t.Do = t.tt + 503,
            t.Jo = t.tt + 504,
            t.Ho = t.tt + 505,
            t.Bo = t.tt + 506,
            t.Ko = t.tt + 507,
            t.Lo = t.tt + 508,
            t.Qo = t.tt + 509,
            t.Xo = t.tt + 510,
            t.jo = t.tt + 511,
            t.$o = t.tt + 512,
            t.Vo = t.tt + 513,
            t.Wo = t.tt + 514,
            t.Yo = t.tt + 515,
            t.Zo = t.tt + 516,
            t.tc = t.tt + 517,
            t.ec = t.tt + 518,
            t.nc = t.tt + 519,
            t.sc = t.tt + 520,
            t.rc = t.tt + 521,
            t.oc = t.tt + 522,
            t.cc = t.tt + 523,
            t.uc = t.tt + 524,
            t.ac = t.tt + 525,
            t.lc = t.tt + 526,
            t.dc = t.tt + 527,
            t.fc = 33784,
            t.hc = 33785,
            t.mc = 33786,
            t.xc = 33787,
            t.vc = 33788,
            t.wc = 33789,
            t._c = 33790,
            t.Ec = 55312,
            t.Oc = 55313,
            t.gc = 55314,
            t.Ic = 55315,
            t.Ac = 55316,
            t.Nc = 55317,
            t.Sc = 55318,
            t.Rc = 55319,
            t.kc = 55320,
            t
        }();
        var v = n(5910);
        const w = function() {
            function t(t) {
                window.parent.postMessage(JSON.stringify(t), window.location.origin)
            }
            function e(t, e) {
                return {
                    type: t,
                    message: e
                }
            }
            window.addEventListener("message", function(t) {
                if (t.origin == window.location.origin) {
                    let e = JSON.parse(t.data);
                    n[e.type](e.message)
                }
            });
            const n = {
                evtAction: function(t) {
                    v.publish("/ui/action", t)
                }
            };
            return {
                yc(t, e) {
                    n[t] = e
                },
                bc(n, s) {
                    t(e("eqScript", {
                        aid: n,
                        cmd: s
                    }))
                },
                Gc(n) {
                    t(e("preview", n))
                },
                Mc(n) {
                    t(e("evtAction", n))
                }
            }
        }();
        class _ {
            constructor(t) {
                this.Tc = t,
                w.yc("eqScript", this.render.bind(this))
            }
            Fc() {
                return this.Tc
            }
            zc(t) {
                this.Tc = t
            }
            getRenderOption() {
                return m.T
            }
            render(t) {
                m.render(t, this.getRenderOption())
            }
            OnRun() {
                return w.bc(this.Tc, null),
                this.Tc
            }
        }
        class E extends _ {
            OnGetActionId(t) {
                return -1 == t ? -1 : this.Tc
            }
            OnRun(t) {
                if (t <= 0)
                    return -1;
                const e = t - 1
                  , n = this.OnGetActionId(e);
                return w.bc(n, null),
                n
            }
        }
        class O extends E {
            constructor() {
                super(x.tt)
            }
            OnGetActionId(t) {
                return x.Qt + t
            }
        }
        class g extends E {
            constructor() {
                super(x.et)
            }
            OnGetActionId(t) {
                return x.Wt + t
            }
        }
        class I extends E {
            constructor() {
                super(x.rt)
            }
            OnGetActionId(t) {
                return x.le + t
            }
        }
        class A extends E {
            constructor() {
                super(x.ot)
            }
            OnGetActionId(t) {
                return x.Ne + t
            }
        }
        class N extends E {
            constructor() {
                super(x.ct)
            }
            OnGetActionId(t) {
                return x.Ge + t
            }
        }
        class S extends E {
            constructor() {
                super(x.it)
            }
            OnGetActionId(t) {
                return x.Ue + t
            }
        }
        class R extends E {
            constructor() {
                super(x.ut)
            }
            OnGetActionId(t) {
                return x.Ze + t
            }
        }
        class k extends E {
            constructor() {
                super(x.ft)
            }
            OnGetActionId(t) {
                return x.dn + t
            }
        }
        class y extends E {
            constructor() {
                super(x.Gt)
            }
            OnGetActionId(t) {
                return x.In + t
            }
        }
        class b extends E {
            constructor() {
                super(x.Mt)
            }
            OnGetActionId(t) {
                return x.Xn + t
            }
        }
        class G extends E {
            constructor() {
                super(x.Tt)
            }
            OnGetActionId(t) {
                return x.Os + t
            }
        }
        class M extends E {
            constructor() {
                super(x.Ft)
            }
            OnGetActionId(t) {
                return x.Ps + t
            }
        }
        class T extends E {
            constructor() {
                super(x.zt)
            }
            OnGetActionId(t) {
                return x._r + t
            }
        }
        class F extends E {
            constructor() {
                super(x.Pt)
            }
            OnGetActionId(t) {
                return x.ro + t
            }
        }
        class z extends E {
            constructor() {
                super(x.qt)
            }
            OnGetActionId(t) {
                return x.So + t
            }
        }
        class P extends _ {
            constructor() {
                super(x.nt)
            }
        }
        class q extends _ {
            constructor() {
                super(x.st)
            }
        }
        class C extends _ {
            constructor() {
                super(x.Ht)
            }
        }
        class U extends _ {
            constructor() {
                super(x.Bt)
            }
        }
        class D extends _ {
            constructor() {
                super(x.Kt)
            }
        }
        class J extends _ {
            constructor() {
                super(x.lt)
            }
        }
        class H extends _ {
            constructor() {
                super(x.dt)
            }
        }
        class B extends _ {
            constructor() {
                super(x.ht)
            }
        }
        class K extends _ {
            constructor() {
                super(x.xt)
            }
            getRenderOption() {
                return m.T | m.P
            }
        }
        class L extends _ {
            constructor() {
                super(x.At)
            }
        }
        class Q extends _ {
            constructor() {
                super(x.Nt)
            }
        }
        class X extends _ {
            constructor() {
                super(x.kt)
            }
        }
        class j extends _ {
            constructor() {
                super(x.tc)
            }
            getRenderOption() {
                return m.T | m.F | m.q
            }
            OnRun(t) {
                return w.bc(this.Tc, t),
                t
            }
        }
        class $ extends _ {
            Fc(t) {
                return "char" === t ? x.Ut : x.Dt
            }
            OnRun(t) {
                this.Tc = "char" === t ? x.Ut : x.Dt,
                m.B(t)
            }
        }
        class V {
            OnRun(t) {
                return m.L(t),
                t
            }
        }
        class W {
            OnRun(t) {
                return m.j(t),
                t
            }
        }
        class Y {
            OnRun(t) {
                return m.W(t),
                t
            }
        }
        class Z {
            #t;
            #e = !1;
            constructor() {
                w.yc("previewSuccess", this.#n.bind(this)),
                w.yc("previewError", this.#s.bind(this))
            }
            OnRun() {
                const t = m.Y();
                t.script ? (this.#e || JSON.stringify(t) !== JSON.stringify(this.#t)) && w.Gc(t) : m.D(""),
                this.#t = t
            }
            #n(t) {
                const e = t.blobUrl
                  , n = t.script;
                m.D(e),
                void 0 !== n && m.U(n),
                this.#e = !1
            }
            #s() {
                window.Pc.showMsgBar(),
                this.#e = !0
            }
        }
        const tt = function() {
            const t = new Map
              , e = {
                sup_sub_script: O,
                decorator: g,
                over: P,
                sqrt: q,
                sum: I,
                integral: A,
                lim: N,
                long_div: C,
                ladder: U,
                s_ladder: D,
                rel: S,
                paren: R,
                cases: J,
                piles: H,
                matrix: k,
                amp: B,
                enter: K,
                go_left: L,
                go_right: Q,
                exit: X,
                greek_1: y,
                greek_2: b,
                greek_3: G,
                set_symbol: M,
                arith_symbol: T,
                arrow_symbol: F,
                etc_symbol: z,
                insert_command: j,
                line_mode: $,
                font_name: V,
                font_size: W,
                font_color: Y,
                preview: Z
            };
            return {
                qc(n) {
                    let s = t.get(n);
                    return s || (s = new e[n],
                    t.set(n, s)),
                    s
                },
                Cc(t, e) {
                    const n = this.qc(t);
                    if (n) {
                        return n.OnRun(e)
                    }
                }
            }
        }()
          , et = function() {
            let t;
            return {
                init(e) {
                    t = e,
                    m.init(e),
                    e.script && tt.Cc("preview")
                },
                Uc(t) {
                    const {name: e, value: n} = t;
                    let s = null;
                    switch (e) {
                    case "font_size":
                        {
                            const e = Number(t.value);
                            if (isNaN(e) || 1 > e || e > 4096)
                                return s = m.X(),
                                s;
                            break
                        }
                    case "insert_command":
                        s = "";
                        break;
                    case "line_mode":
                    case "font_name":
                    case "font_color":
                        break;
                    case "exit":
                        return s = m.Y(),
                        s;
                    case "e_dialog_message_box":
                        return "exit" == n.execute && (s = m.Y()),
                        s;
                    default:
                        s = "off"
                    }
                    return tt.Cc(e, n),
                    s
                },
                Dc() {
                    const e = m.Y();
                    return JSON.stringify(e) !== JSON.stringify(t)
                }
            }
        }();
        var nt = n(5910);
        const st = function() {
            function t() {
                const t = c.makeEventActionObj(u, a, e.UI_COMMAND_NAME.HIDE, e.EDIT_FORMULA_DIALOG_NAME);
                w.Mc(t)
            }
            const e = s.Z
              , n = p.Z
              , r = o.Z
              , c = i.Z
              , u = e.UPDATE_CMD
              , a = e.EVENT_ACTION_TYPE.UI
              , l = e.EVENT_ACTION_TYPE.INPUT
              , d = e.EVENT_ACTION_TYPE.EDIT
              , f = e.EVENT_ACTION_NAMES.E_FORMULA;
            return {
                initialize: function() {
                    nt.subscribe("/ui/action", nt.proxy(this.Jc, this)),
                    this.Hc()
                },
                Hc() {
                    const t = JSON.parse(n.getWebStorage("eqEditor"));
                    n.removeWebStorage("eqEditor");
                    let e = t ? t.line_mode : 0
                      , s = t ? t.font_name : "HancomEQN"
                      , r = t ? t.font_size : "10"
                      , o = t ? t.font_color : "#000000"
                      , i = t ? t.eq_script : "";
                    e = 0 == e ? "char" : "line",
                    r = Number(r).toFixed(0);
                    let l = c.makeEventActionObj(u, a, "line_mode", e);
                    l = c.addEventAction(l, c.makeEventActionObj(u, a, "font_name", s)),
                    l = c.addEventAction(l, c.makeEventActionObj(u, a, "font_size", r)),
                    l = c.addEventAction(l, c.makeEventActionObj(u, a, "font_color", o)),
                    nt.publish("/ui/update", l);
                    const d = {
                        line_mode: e,
                        font_name: s,
                        font_size: r,
                        font_color: o,
                        script: i
                    };
                    et.init(d)
                },
                Jc: function(n) {
                    if (!n)
                        return;
                    let s, {type: o, name: i, value: p} = n;
                    if (o === l)
                        h.G(n);
                    else if (o === a) {
                        if ("hide" == i) {
                            if (et.Dc()) {
                                const t = c.makeEventActionObj("update", a, e.UI_COMMAND_NAME.SHOW, e.DIALOG_MESSAGE_BOX_NAME);
                                nt.publish("/ui/update", t)
                            } else
                                t();
                            return
                        }
                    } else if (o === d) {
                        if ("e_dialog_message_box" === i)
                            if ("exit" === p.execute) {
                                let t = et.Uc(n);
                                s = c.makeEventActionObj(u, d, f, t),
                                w.Mc(s)
                            } else
                                "close" === p.execute ? t() : r.closeDialog()
                    } else {
                        let e = et.Uc(n);
                        "exit" === i ? et.Dc() ? (s = c.makeEventActionObj(u, d, f, e),
                        w.Mc(s)) : t() : null !== e && (s = c.makeUpdateEventAction(i, e)),
                        nt.publish("/ui/update", s || n, false)
                    }
                }
            }
        }();
        var rt = n(5910);
        const ot = function() {
            const t = s.Z
              , e = c.Z;
            return {
                Bc(n=window, s) {
                    rt(n);
                    const r = rt(n.document)
                      , o = rt(e.getInputEventContainerList(s));
                    d.initialize(),
                    st.initialize(),
                    r.on("mousedown", rt.proxy(d.doMouseDownEvent, d)),
                    r.on("selectstart", rt.proxy(d.u, d)),
                    r.on("mouseup", rt.proxy(d.doMouseUpEvent, d)),
                    r.on("mousemove", rt.proxy(d.doMouseMoveEvent, d)),
                    r.on("click", rt.proxy(d.p, d)),
                    r.on("contextmenu", rt.proxy(d.h, d)),
                    r.on("mouseover", rt.proxy(d.m, d)),
                    r.on("keydown", rt.proxy(d.O, d)),
                    o.on("keyup", "input, textarea", rt.proxy(d.I, d)),
                    o.on("input", "input, textarea", rt.proxy(d.I, d)),
                    o.on("compositionend", "input, textarea", rt.proxy(d.I, d)),
                    o.on("change", "input, textarea", rt.proxy(d.I, d)),
                    o.on("blur", "input, textarea", rt.proxy(d.S, d)),
                    r.on("focus", "." + t.INPUT_BOX_WRAP_CLASS + " > input,." + t.LOCAL_FILE_WRAP_CLASS + " input,textarea." + t.TEXTAREA_BOX_CLASS, rt.proxy(d.N, d))
                }
            }
        }()
          , ct = function() {
            const t = o.Z;
            return {
                showMsgBar() {
                    t.showMsgBar(window.parent.HwpApp.hwpResource.PreviewEqFailTitle, "", !1, !1, !1, !1, "", 3)
                }
            }
        }()
          , it = function() {
            s.Z,
            r.Z;
            const t = o.Z;
            return {
                init(e, n, s, r) {
                    const o = window;
                    t.bindCallbackAfterConverting(function(t) {
                        ot.Bc(o, t.refTree),
                        o.focus()
                    }),
                    t.convertXmlToDom(e, o, r),
                    o.Pc = ct
                }
            }
        }()
    }
}]);
