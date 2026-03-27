"use strict";
(self.webpackChunkwebapp = self.webpackChunkwebapp || []).push([[719], {
    4719: (e, t, n) => {
        n.d(t, {
            default: () => i
        });
        var o = n(4525)
          , l = n(9506)
          , s = n(3836)
          , f = n(5910);
        const i = function() {
            let e, t, n, i, a, c, r, u, d, m, p, h, g, y, b, F, O, Z = !1, L = l.Z.FONT_DETECT_MODE.GLOBAL_EXTEND, w = [], x = [], C = [], E = {}, N = {};
            function T(l, s, i, a) {
                if (!l || "etc" === s)
                    return null;
                const c = function(e) {
                    let t = null;
                    if (e) {
                        let o = e.replace(/[ ]/g, "");
                        t = n[o]
                    }
                    return t
                }(l)
                  , r = {};
                let u, d, m;
                if (c || a || C.push(l),
                c && (u = "ko" === s ? c[s] : c[t]),
                u) {
                    if (-1 !== f.inArray(t, ["ko", "ja", "zh_cn", "zh_tw"]) && "Apple SD Gothic Neo" !== l && (r.lang = t),
                    !0 === i) {
                        if (["Malgun Gothic", "Happiness Sans Bold", "Happiness Sans Title", "Happiness Sans Regular", "Happiness Sans VF"].includes(l) && (m = l,
                        d = l),
                        l = u,
                        e.msie) {
                            const e = o.Z.fontRenames[l];
                            e && (d = `${l},${e}`)
                        }
                    }
                } else
                    u = l;
                return d || (d = l),
                r.value = m || l,
                r.style = `font-family:'${d}'`,
                r.contents = u,
                r.title = u,
                r.langCode = s,
                "symbol" === s && (r.style = ""),
                F && F[l] && (r.match = F[l]),
                O && -1 !== o.Z.fontSafeNames.indexOf(l) && (r.isSafeFont = !0),
                r
            }
            function S(n) {
                if (!n || s.Z.isEmptyObject(n))
                    return [];
                const a = function(e, t) {
                    const n = [];
                    if (!e || "object" != typeof e)
                        return n;
                    m.appendChild(p);
                    for (let o in e)
                        if (e.hasOwnProperty(o)) {
                            let l = e[o];
                            for (let e of l) {
                                let l = !1;
                                if (!t || -1 !== t.indexOf(e))
                                    for (let t of u)
                                        if (h.style.fontFamily = `'${e}',${t}`,
                                        l = h.offsetWidth !== g[t] || h.offsetHeight !== y[t],
                                        !0 === l)
                                            break;
                                n.push({
                                    font: e,
                                    detected: l,
                                    langCode: o
                                })
                            }
                        }
                    return m.removeChild(p),
                    n
                }(n, F ? Object.keys(F) : null)
                  , c = !(!f.platform.tizen || !e.samsungBrowser)
                  , r = o.Z.fontLicense
                  , d = []
                  , O = o.Z.themeFontNames;
                let L = i[t]
                  , C = i[l.Z.FONT_DETECT_MODE.GLOBAL]
                  , N = L ? L.webFontRender : null
                  , S = C ? C.webFontRender : null;
                for (let e of a) {
                    let t = e.detected
                      , n = !1
                      , o = !(!S || -1 === S.indexOf(e.font));
                    if (o || N && -1 !== N.indexOf(e.font)) {
                        const t = o ? C?.webFontOnlySkin[b] : L?.webFontOnlySkin[b];
                        t && -1 === t.indexOf(e.font) || (n = !0,
                        !1 === Z && (Z = !0))
                    }
                    if (!t && n ? F && !F[e.font] || (t = !0) : !t && c && (t = !0),
                    !0 === t) {
                        const t = T(e.font, e.langCode, n);
                        t && (d.push(t),
                        -1 !== O.indexOf(e.font) && (E[e.font] = t))
                    } else if ("etc" === e.langCode)
                        x.push(e.font);
                    else {
                        r.monotype[e.langCode] && -1 !== w.indexOf(e.font) && x.push(e.font)
                    }
                }
                return d
            }
            return {
                initialize(r, x, C, T, k) {
                    let D;
                    if (D = f("div.hcwo_product_title span:last-child").get(0),
                    D || (D = f(".titlebar span:last-child").get(0)),
                    e = f.browser,
                    x && (L = x),
                    b = C || "default",
                    O = !0 === k || "true" === k,
                    T) {
                        const e = Object.keys(T);
                        F = {};
                        for (let t of e) {
                            const e = T[t];
                            for (let n of e)
                                F[n] = F[n] ? `${F[n]}|${t}` : t
                        }
                    } else
                        F = null;
                    if (null != r && 5 === r.length) {
                        const e = r.substring(0, 2);
                        "zh" !== e && (r = e)
                    }
                    if (function() {
                        u = ["standard", "monospace", "sans-serif", "serif"],
                        d = "72px",
                        m = document.body,
                        p = document.createElement("div"),
                        h = document.createElement("span"),
                        g = {},
                        y = {},
                        p.style.position = "absolute",
                        p.style.top = "-10000px",
                        p.style.left = "-10000px",
                        p.appendChild(h),
                        h.style.fontSize = d,
                        h.innerHTML = d,
                        m.appendChild(p);
                        for (let e of u)
                            h.style.fontFamily = e,
                            g[e] = h.offsetWidth,
                            y[e] = h.offsetHeight;
                        m.removeChild(p)
                    }(),
                    N = s.Z.isEmptyObject(o.Z.customFonts) ? null : o.Z.customFonts,
                    a = S(function(f) {
                        const a = s.Z.getWindowsSystemBit()
                          , c = s.Z.getBrowserDevice()
                          , r = null !== N ? N.fonts : o.Z.fonts
                          , u = o.Z.fontNoneExtendDevice
                          , d = o.Z.fontLicense
                          , m = {}
                          , p = !("32bit" !== a || !e.chrome);
                        let h, g, y, b, F = [];
                        h = c.isTizen && e.samsungBrowser ? u : r,
                        g = h[f],
                        g ? t = f : (t = o.Z.langCode,
                        g = h[t]),
                        n = null !== N ? N.fontGlobalNames : o.Z.fontGlobalNames,
                        i = null !== N ? N.fontInfo : o.Z.fontInfo,
                        m[t] = g.default,
                        b = d.monotype[t],
                        b && (F = F.concat(b.extend),
                        w = w.concat(b.default)),
                        !0 === p ? g.extendLight && g.extendLight.length && (m[t] = m[t].concat(g.extendLight)) : g.extend && g.extend.length && (m[t] = m[t].concat(g.extend));
                        for (let e in h)
                            if (h.hasOwnProperty(e) && (y = h[e],
                            e !== t)) {
                                const t = !0 === p ? y.defaultLight : y.default;
                                t && t.length && (m[e] = t)
                            }
                        if (F.length || (b = d.monotype.en,
                        !0 === p ? F = b.default.concat(b.extend) : (F = F.concat(b.extend),
                        w = w.concat(b.default))),
                        L === l.Z.FONT_DETECT_MODE.GLOBAL_EXTEND) {
                            const e = o.Z.fontCommon;
                            for (let t in e)
                                e.hasOwnProperty(t) && (y = e[t],
                                y && y.length && (m[t] = y));
                            w = w.concat(d.monotype.symbol)
                        } else
                            F = F.concat(d.monotype.symbol);
                        return m.etc = F,
                        m
                    }(r)),
                    c = function() {
                        const e = o.Z.themeFont;
                        let t = [];
                        if (!e)
                            return t;
                        for (let n of e) {
                            const e = n.theme
                              , o = n.title
                              , l = n.body
                              , s = n.val;
                            if (E[o] && E[l]) {
                                let n, f = "";
                                for (let[t,n] of e.entries()) {
                                    const o = window.LangDefine[n];
                                    f += o || "",
                                    o && t !== e.length - 1 && (f += " , ")
                                }
                                n = {
                                    theme: f,
                                    title: E[o],
                                    body: E[l],
                                    value: s
                                },
                                t.push(n)
                            }
                        }
                        return t
                    }(),
                    D && e.msie && !0 === Z) {
                        const e = (null !== N ? N.fontInfo : o.Z.fontInfo)[r];
                        e && e.webFontNames && (D.style.fontFamily = e.webFontNames.join(","))
                    }
                },
                getFontList: () => a,
                resetFontList(e) {
                    a = [].concat(e)
                },
                getThemeFontList: () => c,
                getFontGlobalNames: () => o.Z.fontGlobalNames,
                getSingleFontList: () => C,
                getWebFontInfoByLocale: e => null !== N ? N.fontInfo[e] : o.Z.fontInfo[e],
                getInvalidLicenseFontList: () => x,
                makeFontListFormat: (e, t, n) => T(e, t, n, !0),
                getMatchedFontNameByLocale(e, o, l) {
                    let s, f;
                    if (!e)
                        return "";
                    if (null == r && (r = ( () => {
                        const e = {};
                        for (let t in n) {
                            const o = n[t];
                            for (let n in o) {
                                const l = o[n];
                                l && (e[l.replace(/[ ]/g, "")] = t)
                            }
                        }
                        return e
                    }
                    )()),
                    s = r[e.replace(/[ \"]/g, "")],
                    f = l ? "" : e,
                    s) {
                        const e = n[s];
                        f = e[o || t] || e.default
                    }
                    return f
                },
                isSymbolFont(e) {
                    const t = o.Z.fontCommon;
                    let n = !1;
                    return t.symbol && -1 !== t.symbol.indexOf(e) && (n = !0),
                    n
                }
            }
        }()
    }
}]);
