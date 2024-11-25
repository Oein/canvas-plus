var di = Object.defineProperty;
var yi = (P, i, l) =>
  i in P
    ? di(P, i, { enumerable: !0, configurable: !0, writable: !0, value: l })
    : (P[i] = l);
var E = (P, i, l) => yi(P, typeof i != "symbol" ? i + "" : i, l);
(function () {
  const i = document.createElement("link").relList;
  if (i && i.supports && i.supports("modulepreload")) return;
  for (const u of document.querySelectorAll('link[rel="modulepreload"]')) p(u);
  new MutationObserver((u) => {
    for (const h of u)
      if (h.type === "childList")
        for (const y of h.addedNodes)
          y.tagName === "LINK" && y.rel === "modulepreload" && p(y);
  }).observe(document, { childList: !0, subtree: !0 });
  function l(u) {
    const h = {};
    return (
      u.integrity && (h.integrity = u.integrity),
      u.referrerPolicy && (h.referrerPolicy = u.referrerPolicy),
      u.crossOrigin === "use-credentials"
        ? (h.credentials = "include")
        : u.crossOrigin === "anonymous"
        ? (h.credentials = "omit")
        : (h.credentials = "same-origin"),
      h
    );
  }
  function p(u) {
    if (u.ep) return;
    u.ep = !0;
    const h = l(u);
    fetch(u.href, h);
  }
})();
const Nt = {
  PENCOLOR: "#000000",
  PENSTROKE: 3,
  DASHLINE: [12, 18],
  ISDASH: !1,
  SNAP_RIGHT: !0,
  SHIFT: !1,
  SHIFTTOOL: !1,
  FILLTOOL: !1,
};
function A(P) {
  return Nt[P];
}
function lt(P, i) {
  Nt[P] = i;
}
window.getState = A;
window.setState = lt;
window.state = Nt;
const _ = {
    SCALE: 2,
    SNAP_DEG: 2.5,
    SELECT_RATIO: 0.01 * 0.01,
    MAX_HISTORY: 50,
  },
  At = () => {
    const P = document.createElement("canvas"),
      i = P.getContext("2d");
    return i
      ? ((P.width = window.innerWidth * _.SCALE),
        (P.height = window.innerHeight * _.SCALE),
        [P, i])
      : [null, null];
  };
let mi = 1e4;
function st() {
  return mi++;
}
class kt {
  constructor(i) {
    E(this, "canvas");
    E(this, "context");
    E(this, "app");
    (this.canvas = i.canvas), (this.context = i.context), (this.app = i.app);
  }
  apply() {
    console.log("LineTool Apply");
    let i = 0,
      l = 0,
      p = !1;
    const u = (f) => {
        (p = !0),
          (i = (f.clientX - this.canvas.offsetLeft) * _.SCALE),
          (l = (f.clientY - this.canvas.offsetTop) * _.SCALE);
      },
      h = (f) => {
        if (!p) return;
        let m = (f.clientX - this.canvas.offsetLeft) * _.SCALE,
          C = (f.clientY - this.canvas.offsetTop) * _.SCALE;
        (this.context.strokeStyle = A("PENCOLOR")),
          (this.context.lineWidth = A("PENSTROKE") * _.SCALE),
          A("ISDASH")
            ? this.context.setLineDash(A("DASHLINE"))
            : this.context.setLineDash([]);
        const g = Math.atan2(C - l, m - i) * (180 / Math.PI);
        if (
          (A("SNAP_RIGHT") &&
            (g <= _.SNAP_DEG && g >= -_.SNAP_DEG && (C = l),
            g >= 90 - _.SNAP_DEG && g <= 90 + _.SNAP_DEG && (m = i),
            (g >= 180 - _.SNAP_DEG || g <= -180 + _.SNAP_DEG) && (C = l),
            g >= -90 - _.SNAP_DEG && g <= -90 + _.SNAP_DEG && (m = i)),
          A("SHIFT") || A("SHIFTTOOL"))
        ) {
          const S = Math.abs(m - i),
            D = Math.abs(C - l);
          S > D ? (C = l) : (m = i);
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height),
          this.context.beginPath(),
          this.context.moveTo(i, l),
          this.context.lineTo(m, C),
          this.context.stroke(),
          this.context.setLineDash([]);
      },
      y = (f) => {
        if (!p) return;
        p = !1;
        let m = (f.clientX - this.canvas.offsetLeft) * _.SCALE,
          C = (f.clientY - this.canvas.offsetTop) * _.SCALE,
          g = Math.atan2(C - l, m - i) * (180 / Math.PI);
        if (
          (A("SNAP_RIGHT") &&
            (g <= _.SNAP_DEG && g >= -_.SNAP_DEG && ((C = l), (g = 0)),
            g >= 90 - _.SNAP_DEG && g <= 90 + _.SNAP_DEG && ((m = i), (g = 90)),
            (g >= 180 - _.SNAP_DEG || g <= -180 + _.SNAP_DEG) &&
              ((C = l), (g = 180)),
            g >= -90 - _.SNAP_DEG &&
              g <= -90 + _.SNAP_DEG &&
              ((m = i), (g = -90))),
          A("SHIFT") || A("SHIFTTOOL"))
        ) {
          const D = Math.abs(m - i),
            W = Math.abs(C - l);
          D > W
            ? ((C = l), (g = i < m ? 0 : 180))
            : ((m = i), (g = l < C ? 90 : -90));
        }
        const S = A("PENSTROKE") * _.SCALE;
        nt({
          type: "line",
          from: { x: i, y: l },
          to: { x: m, y: C },
          strokeWidth: S,
          strokeColor: A("PENCOLOR"),
          strokeDashArray: A("ISDASH") ? A("DASHLINE") : [],
          rotate: g,
        }),
          Y().saveAsHistory(),
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height),
          this.context.setLineDash([]);
      };
    return (
      this.canvas.addEventListener("mousemove", h),
      this.canvas.addEventListener("mousedown", u),
      document.addEventListener("mouseup", y),
      () => {
        this.canvas.removeEventListener("mousedown", u),
          this.canvas.removeEventListener("mousemove", h),
          document.removeEventListener("mouseup", y);
      }
    );
  }
}
function vi(P, i, l, p, u) {
  const h = [],
    y = (2 * Math.PI) / u;
  for (let f = 0; f < u; f++) {
    const m = f * y,
      C = P + l * Math.cos(m),
      I = i + p * Math.sin(m);
    h.push({ x: C, y: I });
  }
  return h;
}
function Pi(P, i, l, p) {
  return vi(P, l, i, p, 64);
}
function xi(P) {
  return P && P.__esModule && Object.prototype.hasOwnProperty.call(P, "default")
    ? P.default
    : P;
}
var Wt = { exports: {} };
(function (P) {
  (function () {
    var i = {};
    (i.version = "6.4.2.2"), (i.use_lines = !0), (i.use_xyz = !1);
    var l = !1;
    P.exports
      ? ((P.exports = i), (l = !0))
      : typeof document < "u"
      ? (window.ClipperLib = i)
      : (self.ClipperLib = i);
    var p;
    if (l) {
      var u = "chrome";
      p = "Netscape";
    } else {
      var u = navigator.userAgent.toString().toLowerCase();
      p = navigator.appName;
    }
    var h = {};
    u.indexOf("chrome") != -1 && u.indexOf("chromium") == -1
      ? (h.chrome = 1)
      : (h.chrome = 0),
      u.indexOf("chromium") != -1 ? (h.chromium = 1) : (h.chromium = 0),
      u.indexOf("safari") != -1 &&
      u.indexOf("chrome") == -1 &&
      u.indexOf("chromium") == -1
        ? (h.safari = 1)
        : (h.safari = 0),
      u.indexOf("firefox") != -1 ? (h.firefox = 1) : (h.firefox = 0),
      u.indexOf("firefox/17") != -1 ? (h.firefox17 = 1) : (h.firefox17 = 0),
      u.indexOf("firefox/15") != -1 ? (h.firefox15 = 1) : (h.firefox15 = 0),
      u.indexOf("firefox/3") != -1 ? (h.firefox3 = 1) : (h.firefox3 = 0),
      u.indexOf("opera") != -1 ? (h.opera = 1) : (h.opera = 0),
      u.indexOf("msie 10") != -1 ? (h.msie10 = 1) : (h.msie10 = 0),
      u.indexOf("msie 9") != -1 ? (h.msie9 = 1) : (h.msie9 = 0),
      u.indexOf("msie 8") != -1 ? (h.msie8 = 1) : (h.msie8 = 0),
      u.indexOf("msie 7") != -1 ? (h.msie7 = 1) : (h.msie7 = 0),
      u.indexOf("msie ") != -1 ? (h.msie = 1) : (h.msie = 0),
      (i.biginteger_used = null);
    var y;
    function f(t, e, s) {
      (i.biginteger_used = 1),
        t != null &&
          (typeof t == "number" && typeof e > "u"
            ? this.fromInt(t)
            : typeof t == "number"
            ? this.fromNumber(t, e, s)
            : e == null && typeof t != "string"
            ? this.fromString(t, 256)
            : this.fromString(t, e));
    }
    function m() {
      return new f(null, void 0, void 0);
    }
    function C(t, e, s, n, r, o) {
      for (; --o >= 0; ) {
        var a = e * this[t++] + s[n] + r;
        (r = Math.floor(a / 67108864)), (s[n++] = a & 67108863);
      }
      return r;
    }
    function I(t, e, s, n, r, o) {
      for (var a = e & 32767, c = e >> 15; --o >= 0; ) {
        var d = this[t] & 32767,
          v = this[t++] >> 15,
          L = c * d + v * a;
        (d = a * d + ((L & 32767) << 15) + s[n] + (r & 1073741823)),
          (r = (d >>> 30) + (L >>> 15) + c * v + (r >>> 30)),
          (s[n++] = d & 1073741823);
      }
      return r;
    }
    function g(t, e, s, n, r, o) {
      for (var a = e & 16383, c = e >> 14; --o >= 0; ) {
        var d = this[t] & 16383,
          v = this[t++] >> 14,
          L = c * d + v * a;
        (d = a * d + ((L & 16383) << 14) + s[n] + r),
          (r = (d >> 28) + (L >> 14) + c * v),
          (s[n++] = d & 268435455);
      }
      return r;
    }
    p == "Microsoft Internet Explorer"
      ? ((f.prototype.am = I), (y = 30))
      : p != "Netscape"
      ? ((f.prototype.am = C), (y = 26))
      : ((f.prototype.am = g), (y = 28)),
      (f.prototype.DB = y),
      (f.prototype.DM = (1 << y) - 1),
      (f.prototype.DV = 1 << y);
    var S = 52;
    (f.prototype.FV = Math.pow(2, S)),
      (f.prototype.F1 = S - y),
      (f.prototype.F2 = 2 * y - S);
    var D = "0123456789abcdefghijklmnopqrstuvwxyz",
      W = new Array(),
      $,
      U;
    for ($ = 48, U = 0; U <= 9; ++U) W[$++] = U;
    for ($ = 97, U = 10; U < 36; ++U) W[$++] = U;
    for ($ = 65, U = 10; U < 36; ++U) W[$++] = U;
    function ct(t) {
      return D.charAt(t);
    }
    function dt(t, e) {
      var s = W[t.charCodeAt(e)];
      return s ?? -1;
    }
    function mt(t) {
      for (var e = this.t - 1; e >= 0; --e) t[e] = this[e];
      (t.t = this.t), (t.s = this.s);
    }
    function vt(t) {
      (this.t = 1),
        (this.s = t < 0 ? -1 : 0),
        t > 0 ? (this[0] = t) : t < -1 ? (this[0] = t + this.DV) : (this.t = 0);
    }
    function Q(t) {
      var e = m();
      return e.fromInt(t), e;
    }
    function Pt(t, e) {
      var s;
      if (e == 16) s = 4;
      else if (e == 8) s = 3;
      else if (e == 256) s = 8;
      else if (e == 2) s = 1;
      else if (e == 32) s = 5;
      else if (e == 4) s = 2;
      else {
        this.fromRadix(t, e);
        return;
      }
      (this.t = 0), (this.s = 0);
      for (var n = t.length, r = !1, o = 0; --n >= 0; ) {
        var a = s == 8 ? t[n] & 255 : dt(t, n);
        if (a < 0) {
          t.charAt(n) == "-" && (r = !0);
          continue;
        }
        (r = !1),
          o == 0
            ? (this[this.t++] = a)
            : o + s > this.DB
            ? ((this[this.t - 1] |= (a & ((1 << (this.DB - o)) - 1)) << o),
              (this[this.t++] = a >> (this.DB - o)))
            : (this[this.t - 1] |= a << o),
          (o += s),
          o >= this.DB && (o -= this.DB);
      }
      s == 8 &&
        t[0] & 128 &&
        ((this.s = -1),
        o > 0 && (this[this.t - 1] |= ((1 << (this.DB - o)) - 1) << o)),
        this.clamp(),
        r && f.ZERO.subTo(this, this);
    }
    function xt() {
      for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t; )
        --this.t;
    }
    function Ct(t) {
      if (this.s < 0) return "-" + this.negate().toString(t);
      var e;
      if (t == 16) e = 4;
      else if (t == 8) e = 3;
      else if (t == 2) e = 1;
      else if (t == 32) e = 5;
      else if (t == 4) e = 2;
      else return this.toRadix(t);
      var s = (1 << e) - 1,
        n,
        r = !1,
        o = "",
        a = this.t,
        c = this.DB - ((a * this.DB) % e);
      if (a-- > 0)
        for (
          c < this.DB && (n = this[a] >> c) > 0 && ((r = !0), (o = ct(n)));
          a >= 0;

        )
          c < e
            ? ((n = (this[a] & ((1 << c) - 1)) << (e - c)),
              (n |= this[--a] >> (c += this.DB - e)))
            : ((n = (this[a] >> (c -= e)) & s),
              c <= 0 && ((c += this.DB), --a)),
            n > 0 && (r = !0),
            r && (o += ct(n));
      return r ? o : "0";
    }
    function Lt() {
      var t = m();
      return f.ZERO.subTo(this, t), t;
    }
    function It() {
      return this.s < 0 ? this.negate() : this;
    }
    function T(t) {
      var e = this.s - t.s;
      if (e != 0) return e;
      var s = this.t;
      if (((e = s - t.t), e != 0)) return this.s < 0 ? -e : e;
      for (; --s >= 0; ) if ((e = this[s] - t[s]) != 0) return e;
      return 0;
    }
    function B(t) {
      var e = 1,
        s;
      return (
        (s = t >>> 16) != 0 && ((t = s), (e += 16)),
        (s = t >> 8) != 0 && ((t = s), (e += 8)),
        (s = t >> 4) != 0 && ((t = s), (e += 4)),
        (s = t >> 2) != 0 && ((t = s), (e += 2)),
        (s = t >> 1) != 0 && ((t = s), (e += 1)),
        e
      );
    }
    function k() {
      return this.t <= 0
        ? 0
        : this.DB * (this.t - 1) + B(this[this.t - 1] ^ (this.s & this.DM));
    }
    function R(t, e) {
      var s;
      for (s = this.t - 1; s >= 0; --s) e[s + t] = this[s];
      for (s = t - 1; s >= 0; --s) e[s] = 0;
      (e.t = this.t + t), (e.s = this.s);
    }
    function H(t, e) {
      for (var s = t; s < this.t; ++s) e[s - t] = this[s];
      (e.t = Math.max(this.t - t, 0)), (e.s = this.s);
    }
    function Z(t, e) {
      var s = t % this.DB,
        n = this.DB - s,
        r = (1 << n) - 1,
        o = Math.floor(t / this.DB),
        a = (this.s << s) & this.DM,
        c;
      for (c = this.t - 1; c >= 0; --c)
        (e[c + o + 1] = (this[c] >> n) | a), (a = (this[c] & r) << s);
      for (c = o - 1; c >= 0; --c) e[c] = 0;
      (e[o] = a), (e.t = this.t + o + 1), (e.s = this.s), e.clamp();
    }
    function j(t, e) {
      e.s = this.s;
      var s = Math.floor(t / this.DB);
      if (s >= this.t) {
        e.t = 0;
        return;
      }
      var n = t % this.DB,
        r = this.DB - n,
        o = (1 << n) - 1;
      e[0] = this[s] >> n;
      for (var a = s + 1; a < this.t; ++a)
        (e[a - s - 1] |= (this[a] & o) << r), (e[a - s] = this[a] >> n);
      n > 0 && (e[this.t - s - 1] |= (this.s & o) << r),
        (e.t = this.t - s),
        e.clamp();
    }
    function J(t, e) {
      for (var s = 0, n = 0, r = Math.min(t.t, this.t); s < r; )
        (n += this[s] - t[s]), (e[s++] = n & this.DM), (n >>= this.DB);
      if (t.t < this.t) {
        for (n -= t.s; s < this.t; )
          (n += this[s]), (e[s++] = n & this.DM), (n >>= this.DB);
        n += this.s;
      } else {
        for (n += this.s; s < t.t; )
          (n -= t[s]), (e[s++] = n & this.DM), (n >>= this.DB);
        n -= t.s;
      }
      (e.s = n < 0 ? -1 : 0),
        n < -1 ? (e[s++] = this.DV + n) : n > 0 && (e[s++] = n),
        (e.t = s),
        e.clamp();
    }
    function G(t, e) {
      var s = this.abs(),
        n = t.abs(),
        r = s.t;
      for (e.t = r + n.t; --r >= 0; ) e[r] = 0;
      for (r = 0; r < n.t; ++r) e[r + s.t] = s.am(0, n[r], e, r, 0, s.t);
      (e.s = 0), e.clamp(), this.s != t.s && f.ZERO.subTo(e, e);
    }
    function et(t) {
      for (var e = this.abs(), s = (t.t = 2 * e.t); --s >= 0; ) t[s] = 0;
      for (s = 0; s < e.t - 1; ++s) {
        var n = e.am(s, e[s], t, 2 * s, 0, 1);
        (t[s + e.t] += e.am(s + 1, 2 * e[s], t, 2 * s + 1, n, e.t - s - 1)) >=
          e.DV && ((t[s + e.t] -= e.DV), (t[s + e.t + 1] = 1));
      }
      t.t > 0 && (t[t.t - 1] += e.am(s, e[s], t, 2 * s, 0, 1)),
        (t.s = 0),
        t.clamp();
    }
    function V(t, e, s) {
      var n = t.abs();
      if (!(n.t <= 0)) {
        var r = this.abs();
        if (r.t < n.t) {
          e != null && e.fromInt(0), s != null && this.copyTo(s);
          return;
        }
        s == null && (s = m());
        var o = m(),
          a = this.s,
          c = t.s,
          d = this.DB - B(n[n.t - 1]);
        d > 0
          ? (n.lShiftTo(d, o), r.lShiftTo(d, s))
          : (n.copyTo(o), r.copyTo(s));
        var v = o.t,
          L = o[v - 1];
        if (L != 0) {
          var x = L * (1 << this.F1) + (v > 1 ? o[v - 2] >> this.F2 : 0),
            w = this.FV / x,
            b = (1 << this.F1) / x,
            X = 1 << this.F2,
            N = s.t,
            F = N - v,
            K = e ?? m();
          for (
            o.dlShiftTo(F, K),
              s.compareTo(K) >= 0 && ((s[s.t++] = 1), s.subTo(K, s)),
              f.ONE.dlShiftTo(v, K),
              K.subTo(o, o);
            o.t < v;

          )
            o[o.t++] = 0;
          for (; --F >= 0; ) {
            var tt =
              s[--N] == L ? this.DM : Math.floor(s[N] * w + (s[N - 1] + X) * b);
            if ((s[N] += o.am(0, tt, s, F, 0, v)) < tt)
              for (o.dlShiftTo(F, K), s.subTo(K, s); s[N] < --tt; )
                s.subTo(K, s);
          }
          e != null && (s.drShiftTo(v, e), a != c && f.ZERO.subTo(e, e)),
            (s.t = v),
            s.clamp(),
            d > 0 && s.rShiftTo(d, s),
            a < 0 && f.ZERO.subTo(s, s);
        }
      }
    }
    function it(t) {
      var e = m();
      return (
        this.abs().divRemTo(t, null, e),
        this.s < 0 && e.compareTo(f.ZERO) > 0 && t.subTo(e, e),
        e
      );
    }
    function rt(t) {
      this.m = t;
    }
    function Ut(t) {
      return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t;
    }
    function qt(t) {
      return t;
    }
    function Gt(t) {
      t.divRemTo(this.m, null, t);
    }
    function zt(t, e, s) {
      t.multiplyTo(e, s), this.reduce(s);
    }
    function Jt(t, e) {
      t.squareTo(e), this.reduce(e);
    }
    (rt.prototype.convert = Ut),
      (rt.prototype.revert = qt),
      (rt.prototype.reduce = Gt),
      (rt.prototype.mulTo = zt),
      (rt.prototype.sqrTo = Jt);
    function Vt() {
      if (this.t < 1) return 0;
      var t = this[0];
      if (!(t & 1)) return 0;
      var e = t & 3;
      return (
        (e = (e * (2 - (t & 15) * e)) & 15),
        (e = (e * (2 - (t & 255) * e)) & 255),
        (e = (e * (2 - (((t & 65535) * e) & 65535))) & 65535),
        (e = (e * (2 - ((t * e) % this.DV))) % this.DV),
        e > 0 ? this.DV - e : -e
      );
    }
    function ot(t) {
      (this.m = t),
        (this.mp = t.invDigit()),
        (this.mpl = this.mp & 32767),
        (this.mph = this.mp >> 15),
        (this.um = (1 << (t.DB - 15)) - 1),
        (this.mt2 = 2 * t.t);
    }
    function Kt(t) {
      var e = m();
      return (
        t.abs().dlShiftTo(this.m.t, e),
        e.divRemTo(this.m, null, e),
        t.s < 0 && e.compareTo(f.ZERO) > 0 && this.m.subTo(e, e),
        e
      );
    }
    function $t(t) {
      var e = m();
      return t.copyTo(e), this.reduce(e), e;
    }
    function Qt(t) {
      for (; t.t <= this.mt2; ) t[t.t++] = 0;
      for (var e = 0; e < this.m.t; ++e) {
        var s = t[e] & 32767,
          n =
            (s * this.mpl +
              (((s * this.mph + (t[e] >> 15) * this.mpl) & this.um) << 15)) &
            t.DM;
        for (
          s = e + this.m.t, t[s] += this.m.am(0, n, t, e, 0, this.m.t);
          t[s] >= t.DV;

        )
          (t[s] -= t.DV), t[++s]++;
      }
      t.clamp(),
        t.drShiftTo(this.m.t, t),
        t.compareTo(this.m) >= 0 && t.subTo(this.m, t);
    }
    function jt(t, e) {
      t.squareTo(e), this.reduce(e);
    }
    function te(t, e, s) {
      t.multiplyTo(e, s), this.reduce(s);
    }
    (ot.prototype.convert = Kt),
      (ot.prototype.revert = $t),
      (ot.prototype.reduce = Qt),
      (ot.prototype.mulTo = te),
      (ot.prototype.sqrTo = jt);
    function ee() {
      return (this.t > 0 ? this[0] & 1 : this.s) == 0;
    }
    function ie(t, e) {
      if (t > 4294967295 || t < 1) return f.ONE;
      var s = m(),
        n = m(),
        r = e.convert(this),
        o = B(t) - 1;
      for (r.copyTo(s); --o >= 0; )
        if ((e.sqrTo(s, n), (t & (1 << o)) > 0)) e.mulTo(n, r, s);
        else {
          var a = s;
          (s = n), (n = a);
        }
      return e.revert(s);
    }
    function se(t, e) {
      var s;
      return (
        t < 256 || e.isEven() ? (s = new rt(e)) : (s = new ot(e)),
        this.exp(t, s)
      );
    }
    (f.prototype.copyTo = mt),
      (f.prototype.fromInt = vt),
      (f.prototype.fromString = Pt),
      (f.prototype.clamp = xt),
      (f.prototype.dlShiftTo = R),
      (f.prototype.drShiftTo = H),
      (f.prototype.lShiftTo = Z),
      (f.prototype.rShiftTo = j),
      (f.prototype.subTo = J),
      (f.prototype.multiplyTo = G),
      (f.prototype.squareTo = et),
      (f.prototype.divRemTo = V),
      (f.prototype.invDigit = Vt),
      (f.prototype.isEven = ee),
      (f.prototype.exp = ie),
      (f.prototype.toString = Ct),
      (f.prototype.negate = Lt),
      (f.prototype.abs = It),
      (f.prototype.compareTo = T),
      (f.prototype.bitLength = k),
      (f.prototype.mod = it),
      (f.prototype.modPowInt = se),
      (f.ZERO = Q(0)),
      (f.ONE = Q(1));
    function ne() {
      var t = m();
      return this.copyTo(t), t;
    }
    function re() {
      if (this.s < 0) {
        if (this.t == 1) return this[0] - this.DV;
        if (this.t == 0) return -1;
      } else {
        if (this.t == 1) return this[0];
        if (this.t == 0) return 0;
      }
      return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
    }
    function oe() {
      return this.t == 0 ? this.s : (this[0] << 24) >> 24;
    }
    function le() {
      return this.t == 0 ? this.s : (this[0] << 16) >> 16;
    }
    function ae(t) {
      return Math.floor((Math.LN2 * this.DB) / Math.log(t));
    }
    function he() {
      return this.s < 0
        ? -1
        : this.t <= 0 || (this.t == 1 && this[0] <= 0)
        ? 0
        : 1;
    }
    function ue(t) {
      if ((t == null && (t = 10), this.signum() == 0 || t < 2 || t > 36))
        return "0";
      var e = this.chunkSize(t),
        s = Math.pow(t, e),
        n = Q(s),
        r = m(),
        o = m(),
        a = "";
      for (this.divRemTo(n, r, o); r.signum() > 0; )
        (a = (s + o.intValue()).toString(t).substr(1) + a), r.divRemTo(n, r, o);
      return o.intValue().toString(t) + a;
    }
    function fe(t, e) {
      this.fromInt(0), e == null && (e = 10);
      for (
        var s = this.chunkSize(e),
          n = Math.pow(e, s),
          r = !1,
          o = 0,
          a = 0,
          c = 0;
        c < t.length;
        ++c
      ) {
        var d = dt(t, c);
        if (d < 0) {
          t.charAt(c) == "-" && this.signum() == 0 && (r = !0);
          continue;
        }
        (a = e * a + d),
          ++o >= s &&
            (this.dMultiply(n), this.dAddOffset(a, 0), (o = 0), (a = 0));
      }
      o > 0 && (this.dMultiply(Math.pow(e, o)), this.dAddOffset(a, 0)),
        r && f.ZERO.subTo(this, this);
    }
    function pe(t, e, s) {
      if (typeof e == "number")
        if (t < 2) this.fromInt(1);
        else
          for (
            this.fromNumber(t, s),
              this.testBit(t - 1) ||
                this.bitwiseTo(f.ONE.shiftLeft(t - 1), gt, this),
              this.isEven() && this.dAddOffset(1, 0);
            !this.isProbablePrime(e);

          )
            this.dAddOffset(2, 0),
              this.bitLength() > t && this.subTo(f.ONE.shiftLeft(t - 1), this);
      else {
        var n = new Array(),
          r = t & 7;
        (n.length = (t >> 3) + 1),
          e.nextBytes(n),
          r > 0 ? (n[0] &= (1 << r) - 1) : (n[0] = 0),
          this.fromString(n, 256);
      }
    }
    function ce() {
      var t = this.t,
        e = new Array();
      e[0] = this.s;
      var s = this.DB - ((t * this.DB) % 8),
        n,
        r = 0;
      if (t-- > 0)
        for (
          s < this.DB &&
          (n = this[t] >> s) != (this.s & this.DM) >> s &&
          (e[r++] = n | (this.s << (this.DB - s)));
          t >= 0;

        )
          s < 8
            ? ((n = (this[t] & ((1 << s) - 1)) << (8 - s)),
              (n |= this[--t] >> (s += this.DB - 8)))
            : ((n = (this[t] >> (s -= 8)) & 255),
              s <= 0 && ((s += this.DB), --t)),
            n & 128 && (n |= -256),
            r == 0 && (this.s & 128) != (n & 128) && ++r,
            (r > 0 || n != this.s) && (e[r++] = n);
      return e;
    }
    function de(t) {
      return this.compareTo(t) == 0;
    }
    function ye(t) {
      return this.compareTo(t) < 0 ? this : t;
    }
    function me(t) {
      return this.compareTo(t) > 0 ? this : t;
    }
    function ve(t, e, s) {
      var n,
        r,
        o = Math.min(t.t, this.t);
      for (n = 0; n < o; ++n) s[n] = e(this[n], t[n]);
      if (t.t < this.t) {
        for (r = t.s & this.DM, n = o; n < this.t; ++n) s[n] = e(this[n], r);
        s.t = this.t;
      } else {
        for (r = this.s & this.DM, n = o; n < t.t; ++n) s[n] = e(r, t[n]);
        s.t = t.t;
      }
      (s.s = e(this.s, t.s)), s.clamp();
    }
    function Pe(t, e) {
      return t & e;
    }
    function xe(t) {
      var e = m();
      return this.bitwiseTo(t, Pe, e), e;
    }
    function gt(t, e) {
      return t | e;
    }
    function Ce(t) {
      var e = m();
      return this.bitwiseTo(t, gt, e), e;
    }
    function Yt(t, e) {
      return t ^ e;
    }
    function Le(t) {
      var e = m();
      return this.bitwiseTo(t, Yt, e), e;
    }
    function Bt(t, e) {
      return t & ~e;
    }
    function Ie(t) {
      var e = m();
      return this.bitwiseTo(t, Bt, e), e;
    }
    function _e() {
      for (var t = m(), e = 0; e < this.t; ++e) t[e] = this.DM & ~this[e];
      return (t.t = this.t), (t.s = ~this.s), t;
    }
    function we(t) {
      var e = m();
      return t < 0 ? this.rShiftTo(-t, e) : this.lShiftTo(t, e), e;
    }
    function ge(t) {
      var e = m();
      return t < 0 ? this.lShiftTo(-t, e) : this.rShiftTo(t, e), e;
    }
    function Ee(t) {
      if (t == 0) return -1;
      var e = 0;
      return (
        t & 65535 || ((t >>= 16), (e += 16)),
        t & 255 || ((t >>= 8), (e += 8)),
        t & 15 || ((t >>= 4), (e += 4)),
        t & 3 || ((t >>= 2), (e += 2)),
        t & 1 || ++e,
        e
      );
    }
    function Te() {
      for (var t = 0; t < this.t; ++t)
        if (this[t] != 0) return t * this.DB + Ee(this[t]);
      return this.s < 0 ? this.t * this.DB : -1;
    }
    function Se(t) {
      for (var e = 0; t != 0; ) (t &= t - 1), ++e;
      return e;
    }
    function be() {
      for (var t = 0, e = this.s & this.DM, s = 0; s < this.t; ++s)
        t += Se(this[s] ^ e);
      return t;
    }
    function Ae(t) {
      var e = Math.floor(t / this.DB);
      return e >= this.t ? this.s != 0 : (this[e] & (1 << t % this.DB)) != 0;
    }
    function Oe(t, e) {
      var s = f.ONE.shiftLeft(t);
      return this.bitwiseTo(s, e, s), s;
    }
    function Xe(t) {
      return this.changeBit(t, gt);
    }
    function Ne(t) {
      return this.changeBit(t, Bt);
    }
    function Ye(t) {
      return this.changeBit(t, Yt);
    }
    function Be(t, e) {
      for (var s = 0, n = 0, r = Math.min(t.t, this.t); s < r; )
        (n += this[s] + t[s]), (e[s++] = n & this.DM), (n >>= this.DB);
      if (t.t < this.t) {
        for (n += t.s; s < this.t; )
          (n += this[s]), (e[s++] = n & this.DM), (n >>= this.DB);
        n += this.s;
      } else {
        for (n += this.s; s < t.t; )
          (n += t[s]), (e[s++] = n & this.DM), (n >>= this.DB);
        n += t.s;
      }
      (e.s = n < 0 ? -1 : 0),
        n > 0 ? (e[s++] = n) : n < -1 && (e[s++] = this.DV + n),
        (e.t = s),
        e.clamp();
    }
    function De(t) {
      var e = m();
      return this.addTo(t, e), e;
    }
    function Me(t) {
      var e = m();
      return this.subTo(t, e), e;
    }
    function ke(t) {
      var e = m();
      return this.multiplyTo(t, e), e;
    }
    function Re() {
      var t = m();
      return this.squareTo(t), t;
    }
    function Fe(t) {
      var e = m();
      return this.divRemTo(t, e, null), e;
    }
    function We(t) {
      var e = m();
      return this.divRemTo(t, null, e), e;
    }
    function He(t) {
      var e = m(),
        s = m();
      return this.divRemTo(t, e, s), new Array(e, s);
    }
    function Ze(t) {
      (this[this.t] = this.am(0, t - 1, this, 0, 0, this.t)),
        ++this.t,
        this.clamp();
    }
    function Ue(t, e) {
      if (t != 0) {
        for (; this.t <= e; ) this[this.t++] = 0;
        for (this[e] += t; this[e] >= this.DV; )
          (this[e] -= this.DV),
            ++e >= this.t && (this[this.t++] = 0),
            ++this[e];
      }
    }
    function yt() {}
    function Dt(t) {
      return t;
    }
    function qe(t, e, s) {
      t.multiplyTo(e, s);
    }
    function Ge(t, e) {
      t.squareTo(e);
    }
    (yt.prototype.convert = Dt),
      (yt.prototype.revert = Dt),
      (yt.prototype.mulTo = qe),
      (yt.prototype.sqrTo = Ge);
    function ze(t) {
      return this.exp(t, new yt());
    }
    function Je(t, e, s) {
      var n = Math.min(this.t + t.t, e);
      for (s.s = 0, s.t = n; n > 0; ) s[--n] = 0;
      var r;
      for (r = s.t - this.t; n < r; ++n)
        s[n + this.t] = this.am(0, t[n], s, n, 0, this.t);
      for (r = Math.min(t.t, e); n < r; ++n) this.am(0, t[n], s, n, 0, e - n);
      s.clamp();
    }
    function Ve(t, e, s) {
      --e;
      var n = (s.t = this.t + t.t - e);
      for (s.s = 0; --n >= 0; ) s[n] = 0;
      for (n = Math.max(e - this.t, 0); n < t.t; ++n)
        s[this.t + n - e] = this.am(e - n, t[n], s, 0, 0, this.t + n - e);
      s.clamp(), s.drShiftTo(1, s);
    }
    function at(t) {
      (this.r2 = m()),
        (this.q3 = m()),
        f.ONE.dlShiftTo(2 * t.t, this.r2),
        (this.mu = this.r2.divide(t)),
        (this.m = t);
    }
    function Ke(t) {
      if (t.s < 0 || t.t > 2 * this.m.t) return t.mod(this.m);
      if (t.compareTo(this.m) < 0) return t;
      var e = m();
      return t.copyTo(e), this.reduce(e), e;
    }
    function $e(t) {
      return t;
    }
    function Qe(t) {
      for (
        t.drShiftTo(this.m.t - 1, this.r2),
          t.t > this.m.t + 1 && ((t.t = this.m.t + 1), t.clamp()),
          this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
          this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        t.compareTo(this.r2) < 0;

      )
        t.dAddOffset(1, this.m.t + 1);
      for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0; ) t.subTo(this.m, t);
    }
    function je(t, e) {
      t.squareTo(e), this.reduce(e);
    }
    function ti(t, e, s) {
      t.multiplyTo(e, s), this.reduce(s);
    }
    (at.prototype.convert = Ke),
      (at.prototype.revert = $e),
      (at.prototype.reduce = Qe),
      (at.prototype.mulTo = ti),
      (at.prototype.sqrTo = je);
    function ei(t, e) {
      var s = t.bitLength(),
        n,
        r = Q(1),
        o;
      if (s <= 0) return r;
      s < 18
        ? (n = 1)
        : s < 48
        ? (n = 3)
        : s < 144
        ? (n = 4)
        : s < 768
        ? (n = 5)
        : (n = 6),
        s < 8
          ? (o = new rt(e))
          : e.isEven()
          ? (o = new at(e))
          : (o = new ot(e));
      var a = new Array(),
        c = 3,
        d = n - 1,
        v = (1 << n) - 1;
      if (((a[1] = o.convert(this)), n > 1)) {
        var L = m();
        for (o.sqrTo(a[1], L); c <= v; )
          (a[c] = m()), o.mulTo(L, a[c - 2], a[c]), (c += 2);
      }
      var x = t.t - 1,
        w,
        b = !0,
        X = m(),
        N;
      for (s = B(t[x]) - 1; x >= 0; ) {
        for (
          s >= d
            ? (w = (t[x] >> (s - d)) & v)
            : ((w = (t[x] & ((1 << (s + 1)) - 1)) << (d - s)),
              x > 0 && (w |= t[x - 1] >> (this.DB + s - d))),
            c = n;
          !(w & 1);

        )
          (w >>= 1), --c;
        if (((s -= c) < 0 && ((s += this.DB), --x), b))
          a[w].copyTo(r), (b = !1);
        else {
          for (; c > 1; ) o.sqrTo(r, X), o.sqrTo(X, r), (c -= 2);
          c > 0 ? o.sqrTo(r, X) : ((N = r), (r = X), (X = N)),
            o.mulTo(X, a[w], r);
        }
        for (; x >= 0 && !(t[x] & (1 << s)); )
          o.sqrTo(r, X),
            (N = r),
            (r = X),
            (X = N),
            --s < 0 && ((s = this.DB - 1), --x);
      }
      return o.revert(r);
    }
    function ii(t) {
      var e = this.s < 0 ? this.negate() : this.clone(),
        s = t.s < 0 ? t.negate() : t.clone();
      if (e.compareTo(s) < 0) {
        var n = e;
        (e = s), (s = n);
      }
      var r = e.getLowestSetBit(),
        o = s.getLowestSetBit();
      if (o < 0) return e;
      for (
        r < o && (o = r), o > 0 && (e.rShiftTo(o, e), s.rShiftTo(o, s));
        e.signum() > 0;

      )
        (r = e.getLowestSetBit()) > 0 && e.rShiftTo(r, e),
          (r = s.getLowestSetBit()) > 0 && s.rShiftTo(r, s),
          e.compareTo(s) >= 0
            ? (e.subTo(s, e), e.rShiftTo(1, e))
            : (s.subTo(e, s), s.rShiftTo(1, s));
      return o > 0 && s.lShiftTo(o, s), s;
    }
    function si(t) {
      if (t <= 0) return 0;
      var e = this.DV % t,
        s = this.s < 0 ? t - 1 : 0;
      if (this.t > 0)
        if (e == 0) s = this[0] % t;
        else for (var n = this.t - 1; n >= 0; --n) s = (e * s + this[n]) % t;
      return s;
    }
    function ni(t) {
      var e = t.isEven();
      if ((this.isEven() && e) || t.signum() == 0) return f.ZERO;
      for (
        var s = t.clone(),
          n = this.clone(),
          r = Q(1),
          o = Q(0),
          a = Q(0),
          c = Q(1);
        s.signum() != 0;

      ) {
        for (; s.isEven(); )
          s.rShiftTo(1, s),
            e
              ? ((!r.isEven() || !o.isEven()) &&
                  (r.addTo(this, r), o.subTo(t, o)),
                r.rShiftTo(1, r))
              : o.isEven() || o.subTo(t, o),
            o.rShiftTo(1, o);
        for (; n.isEven(); )
          n.rShiftTo(1, n),
            e
              ? ((!a.isEven() || !c.isEven()) &&
                  (a.addTo(this, a), c.subTo(t, c)),
                a.rShiftTo(1, a))
              : c.isEven() || c.subTo(t, c),
            c.rShiftTo(1, c);
        s.compareTo(n) >= 0
          ? (s.subTo(n, s), e && r.subTo(a, r), o.subTo(c, o))
          : (n.subTo(s, n), e && a.subTo(r, a), c.subTo(o, c));
      }
      if (n.compareTo(f.ONE) != 0) return f.ZERO;
      if (c.compareTo(t) >= 0) return c.subtract(t);
      if (c.signum() < 0) c.addTo(t, c);
      else return c;
      return c.signum() < 0 ? c.add(t) : c;
    }
    var z = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
        71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139,
        149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223,
        227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293,
        307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383,
        389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
        467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569,
        571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647,
        653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743,
        751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839,
        853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941,
        947, 953, 967, 971, 977, 983, 991, 997,
      ],
      ri = (1 << 26) / z[z.length - 1];
    function oi(t) {
      var e,
        s = this.abs();
      if (s.t == 1 && s[0] <= z[z.length - 1]) {
        for (e = 0; e < z.length; ++e) if (s[0] == z[e]) return !0;
        return !1;
      }
      if (s.isEven()) return !1;
      for (e = 1; e < z.length; ) {
        for (var n = z[e], r = e + 1; r < z.length && n < ri; ) n *= z[r++];
        for (n = s.modInt(n); e < r; ) if (n % z[e++] == 0) return !1;
      }
      return s.millerRabin(t);
    }
    function li(t) {
      var e = this.subtract(f.ONE),
        s = e.getLowestSetBit();
      if (s <= 0) return !1;
      var n = e.shiftRight(s);
      (t = (t + 1) >> 1), t > z.length && (t = z.length);
      for (var r = m(), o = 0; o < t; ++o) {
        r.fromInt(z[Math.floor(Math.random() * z.length)]);
        var a = r.modPow(n, this);
        if (a.compareTo(f.ONE) != 0 && a.compareTo(e) != 0) {
          for (var c = 1; c++ < s && a.compareTo(e) != 0; )
            if (((a = a.modPowInt(2, this)), a.compareTo(f.ONE) == 0))
              return !1;
          if (a.compareTo(e) != 0) return !1;
        }
      }
      return !0;
    }
    (f.prototype.chunkSize = ae),
      (f.prototype.toRadix = ue),
      (f.prototype.fromRadix = fe),
      (f.prototype.fromNumber = pe),
      (f.prototype.bitwiseTo = ve),
      (f.prototype.changeBit = Oe),
      (f.prototype.addTo = Be),
      (f.prototype.dMultiply = Ze),
      (f.prototype.dAddOffset = Ue),
      (f.prototype.multiplyLowerTo = Je),
      (f.prototype.multiplyUpperTo = Ve),
      (f.prototype.modInt = si),
      (f.prototype.millerRabin = li),
      (f.prototype.clone = ne),
      (f.prototype.intValue = re),
      (f.prototype.byteValue = oe),
      (f.prototype.shortValue = le),
      (f.prototype.signum = he),
      (f.prototype.toByteArray = ce),
      (f.prototype.equals = de),
      (f.prototype.min = ye),
      (f.prototype.max = me),
      (f.prototype.and = xe),
      (f.prototype.or = Ce),
      (f.prototype.xor = Le),
      (f.prototype.andNot = Ie),
      (f.prototype.not = _e),
      (f.prototype.shiftLeft = we),
      (f.prototype.shiftRight = ge),
      (f.prototype.getLowestSetBit = Te),
      (f.prototype.bitCount = be),
      (f.prototype.testBit = Ae),
      (f.prototype.setBit = Xe),
      (f.prototype.clearBit = Ne),
      (f.prototype.flipBit = Ye),
      (f.prototype.add = De),
      (f.prototype.subtract = Me),
      (f.prototype.multiply = ke),
      (f.prototype.divide = Fe),
      (f.prototype.remainder = We),
      (f.prototype.divideAndRemainder = He),
      (f.prototype.modPow = ei),
      (f.prototype.modInverse = ni),
      (f.prototype.pow = ze),
      (f.prototype.gcd = ii),
      (f.prototype.isProbablePrime = oi),
      (f.prototype.square = Re);
    var O = f;
    (O.prototype.IsNegative = function () {
      return this.compareTo(O.ZERO) == -1;
    }),
      (O.op_Equality = function (t, e) {
        return t.compareTo(e) == 0;
      }),
      (O.op_Inequality = function (t, e) {
        return t.compareTo(e) != 0;
      }),
      (O.op_GreaterThan = function (t, e) {
        return t.compareTo(e) > 0;
      }),
      (O.op_LessThan = function (t, e) {
        return t.compareTo(e) < 0;
      }),
      (O.op_Addition = function (t, e) {
        return new O(t, void 0, void 0).add(new O(e, void 0, void 0));
      }),
      (O.op_Subtraction = function (t, e) {
        return new O(t, void 0, void 0).subtract(new O(e, void 0, void 0));
      }),
      (O.Int128Mul = function (t, e) {
        return new O(t, void 0, void 0).multiply(new O(e, void 0, void 0));
      }),
      (O.op_Division = function (t, e) {
        return t.divide(e);
      }),
      (O.prototype.ToDouble = function () {
        return parseFloat(this.toString());
      });
    var Mt = function (t, e) {
      var s;
      if (typeof Object.getOwnPropertyNames > "u") {
        for (s in e.prototype)
          (typeof t.prototype[s] > "u" ||
            t.prototype[s] === Object.prototype[s]) &&
            (t.prototype[s] = e.prototype[s]);
        for (s in e) typeof t[s] > "u" && (t[s] = e[s]);
        t.$baseCtor = e;
      } else {
        for (
          var n = Object.getOwnPropertyNames(e.prototype), r = 0;
          r < n.length;
          r++
        )
          typeof Object.getOwnPropertyDescriptor(t.prototype, n[r]) > "u" &&
            Object.defineProperty(
              t.prototype,
              n[r],
              Object.getOwnPropertyDescriptor(e.prototype, n[r])
            );
        for (s in e) typeof t[s] > "u" && (t[s] = e[s]);
        t.$baseCtor = e;
      }
    };
    (i.Path = function () {
      return [];
    }),
      (i.Path.prototype.push = Array.prototype.push),
      (i.Paths = function () {
        return [];
      }),
      (i.Paths.prototype.push = Array.prototype.push),
      (i.DoublePoint = function () {
        var t = arguments;
        (this.X = 0),
          (this.Y = 0),
          t.length === 1
            ? ((this.X = t[0].X), (this.Y = t[0].Y))
            : t.length === 2 && ((this.X = t[0]), (this.Y = t[1]));
      }),
      (i.DoublePoint0 = function () {
        (this.X = 0), (this.Y = 0);
      }),
      (i.DoublePoint0.prototype = i.DoublePoint.prototype),
      (i.DoublePoint1 = function (t) {
        (this.X = t.X), (this.Y = t.Y);
      }),
      (i.DoublePoint1.prototype = i.DoublePoint.prototype),
      (i.DoublePoint2 = function (t, e) {
        (this.X = t), (this.Y = e);
      }),
      (i.DoublePoint2.prototype = i.DoublePoint.prototype),
      (i.PolyNode = function () {
        (this.m_Parent = null),
          (this.m_polygon = new i.Path()),
          (this.m_Index = 0),
          (this.m_jointype = 0),
          (this.m_endtype = 0),
          (this.m_Childs = []),
          (this.IsOpen = !1);
      }),
      (i.PolyNode.prototype.IsHoleNode = function () {
        for (var t = !0, e = this.m_Parent; e !== null; )
          (t = !t), (e = e.m_Parent);
        return t;
      }),
      (i.PolyNode.prototype.ChildCount = function () {
        return this.m_Childs.length;
      }),
      (i.PolyNode.prototype.Contour = function () {
        return this.m_polygon;
      }),
      (i.PolyNode.prototype.AddChild = function (t) {
        var e = this.m_Childs.length;
        this.m_Childs.push(t), (t.m_Parent = this), (t.m_Index = e);
      }),
      (i.PolyNode.prototype.GetNext = function () {
        return this.m_Childs.length > 0
          ? this.m_Childs[0]
          : this.GetNextSiblingUp();
      }),
      (i.PolyNode.prototype.GetNextSiblingUp = function () {
        return this.m_Parent === null
          ? null
          : this.m_Index === this.m_Parent.m_Childs.length - 1
          ? this.m_Parent.GetNextSiblingUp()
          : this.m_Parent.m_Childs[this.m_Index + 1];
      }),
      (i.PolyNode.prototype.Childs = function () {
        return this.m_Childs;
      }),
      (i.PolyNode.prototype.Parent = function () {
        return this.m_Parent;
      }),
      (i.PolyNode.prototype.IsHole = function () {
        return this.IsHoleNode();
      }),
      (i.PolyTree = function () {
        (this.m_AllPolys = []), i.PolyNode.call(this);
      }),
      (i.PolyTree.prototype.Clear = function () {
        for (var t = 0, e = this.m_AllPolys.length; t < e; t++)
          this.m_AllPolys[t] = null;
        (this.m_AllPolys.length = 0), (this.m_Childs.length = 0);
      }),
      (i.PolyTree.prototype.GetFirst = function () {
        return this.m_Childs.length > 0 ? this.m_Childs[0] : null;
      }),
      (i.PolyTree.prototype.Total = function () {
        var t = this.m_AllPolys.length;
        return t > 0 && this.m_Childs[0] !== this.m_AllPolys[0] && t--, t;
      }),
      Mt(i.PolyTree, i.PolyNode),
      (i.Math_Abs_Int64 =
        i.Math_Abs_Int32 =
        i.Math_Abs_Double =
          function (t) {
            return Math.abs(t);
          }),
      (i.Math_Max_Int32_Int32 = function (t, e) {
        return Math.max(t, e);
      }),
      h.msie || h.opera || h.safari
        ? (i.Cast_Int32 = function (t) {
            return t | 0;
          })
        : (i.Cast_Int32 = function (t) {
            return ~~t;
          }),
      typeof Number.toInteger > "u" && (Number.toInteger = null),
      h.chrome
        ? (i.Cast_Int64 = function (t) {
            return t < -2147483648 || t > 2147483647
              ? t < 0
                ? Math.ceil(t)
                : Math.floor(t)
              : ~~t;
          })
        : h.firefox && typeof Number.toInteger == "function"
        ? (i.Cast_Int64 = function (t) {
            return Number.toInteger(t);
          })
        : h.msie7 || h.msie8
        ? (i.Cast_Int64 = function (t) {
            return parseInt(t, 10);
          })
        : h.msie
        ? (i.Cast_Int64 = function (t) {
            return t < -2147483648 || t > 2147483647
              ? t < 0
                ? Math.ceil(t)
                : Math.floor(t)
              : t | 0;
          })
        : (i.Cast_Int64 = function (t) {
            return t < 0 ? Math.ceil(t) : Math.floor(t);
          }),
      (i.Clear = function (t) {
        t.length = 0;
      }),
      (i.PI = 3.141592653589793),
      (i.PI2 = 2 * 3.141592653589793),
      (i.IntPoint = function () {
        var t = arguments,
          e = t.length;
        if (((this.X = 0), (this.Y = 0), i.use_xyz))
          if (((this.Z = 0), e === 3))
            (this.X = t[0]), (this.Y = t[1]), (this.Z = t[2]);
          else if (e === 2) (this.X = t[0]), (this.Y = t[1]), (this.Z = 0);
          else if (e === 1)
            if (t[0] instanceof i.DoublePoint) {
              var s = t[0];
              (this.X = i.Clipper.Round(s.X)),
                (this.Y = i.Clipper.Round(s.Y)),
                (this.Z = 0);
            } else {
              var n = t[0];
              typeof n.Z > "u" && (n.Z = 0),
                (this.X = n.X),
                (this.Y = n.Y),
                (this.Z = n.Z);
            }
          else (this.X = 0), (this.Y = 0), (this.Z = 0);
        else if (e === 2) (this.X = t[0]), (this.Y = t[1]);
        else if (e === 1)
          if (t[0] instanceof i.DoublePoint) {
            var s = t[0];
            (this.X = i.Clipper.Round(s.X)), (this.Y = i.Clipper.Round(s.Y));
          } else {
            var n = t[0];
            (this.X = n.X), (this.Y = n.Y);
          }
        else (this.X = 0), (this.Y = 0);
      }),
      (i.IntPoint.op_Equality = function (t, e) {
        return t.X === e.X && t.Y === e.Y;
      }),
      (i.IntPoint.op_Inequality = function (t, e) {
        return t.X !== e.X || t.Y !== e.Y;
      }),
      (i.IntPoint0 = function () {
        (this.X = 0), (this.Y = 0), i.use_xyz && (this.Z = 0);
      }),
      (i.IntPoint0.prototype = i.IntPoint.prototype),
      (i.IntPoint1 = function (t) {
        (this.X = t.X),
          (this.Y = t.Y),
          i.use_xyz && (typeof t.Z > "u" ? (this.Z = 0) : (this.Z = t.Z));
      }),
      (i.IntPoint1.prototype = i.IntPoint.prototype),
      (i.IntPoint1dp = function (t) {
        (this.X = i.Clipper.Round(t.X)),
          (this.Y = i.Clipper.Round(t.Y)),
          i.use_xyz && (this.Z = 0);
      }),
      (i.IntPoint1dp.prototype = i.IntPoint.prototype),
      (i.IntPoint2 = function (t, e, s) {
        (this.X = t),
          (this.Y = e),
          i.use_xyz && (typeof s > "u" ? (this.Z = 0) : (this.Z = s));
      }),
      (i.IntPoint2.prototype = i.IntPoint.prototype),
      (i.IntRect = function () {
        var t = arguments,
          e = t.length;
        if (e === 4)
          (this.left = t[0]),
            (this.top = t[1]),
            (this.right = t[2]),
            (this.bottom = t[3]);
        else if (e === 1) {
          var s = t[0];
          (this.left = s.left),
            (this.top = s.top),
            (this.right = s.right),
            (this.bottom = s.bottom);
        } else
          (this.left = 0), (this.top = 0), (this.right = 0), (this.bottom = 0);
      }),
      (i.IntRect0 = function () {
        (this.left = 0), (this.top = 0), (this.right = 0), (this.bottom = 0);
      }),
      (i.IntRect0.prototype = i.IntRect.prototype),
      (i.IntRect1 = function (t) {
        (this.left = t.left),
          (this.top = t.top),
          (this.right = t.right),
          (this.bottom = t.bottom);
      }),
      (i.IntRect1.prototype = i.IntRect.prototype),
      (i.IntRect4 = function (t, e, s, n) {
        (this.left = t), (this.top = e), (this.right = s), (this.bottom = n);
      }),
      (i.IntRect4.prototype = i.IntRect.prototype),
      (i.ClipType = {
        ctIntersection: 0,
        ctUnion: 1,
        ctDifference: 2,
        ctXor: 3,
      }),
      (i.PolyType = { ptSubject: 0, ptClip: 1 }),
      (i.PolyFillType = {
        pftEvenOdd: 0,
        pftNonZero: 1,
        pftPositive: 2,
        pftNegative: 3,
      }),
      (i.JoinType = { jtSquare: 0, jtRound: 1, jtMiter: 2 }),
      (i.EndType = {
        etOpenSquare: 0,
        etOpenRound: 1,
        etOpenButt: 2,
        etClosedLine: 3,
        etClosedPolygon: 4,
      }),
      (i.EdgeSide = { esLeft: 0, esRight: 1 }),
      (i.Direction = { dRightToLeft: 0, dLeftToRight: 1 }),
      (i.TEdge = function () {
        (this.Bot = new i.IntPoint0()),
          (this.Curr = new i.IntPoint0()),
          (this.Top = new i.IntPoint0()),
          (this.Delta = new i.IntPoint0()),
          (this.Dx = 0),
          (this.PolyTyp = i.PolyType.ptSubject),
          (this.Side = i.EdgeSide.esLeft),
          (this.WindDelta = 0),
          (this.WindCnt = 0),
          (this.WindCnt2 = 0),
          (this.OutIdx = 0),
          (this.Next = null),
          (this.Prev = null),
          (this.NextInLML = null),
          (this.NextInAEL = null),
          (this.PrevInAEL = null),
          (this.NextInSEL = null),
          (this.PrevInSEL = null);
      }),
      (i.IntersectNode = function () {
        (this.Edge1 = null), (this.Edge2 = null), (this.Pt = new i.IntPoint0());
      }),
      (i.MyIntersectNodeSort = function () {}),
      (i.MyIntersectNodeSort.Compare = function (t, e) {
        var s = e.Pt.Y - t.Pt.Y;
        return s > 0 ? 1 : s < 0 ? -1 : 0;
      }),
      (i.LocalMinima = function () {
        (this.Y = 0),
          (this.LeftBound = null),
          (this.RightBound = null),
          (this.Next = null);
      }),
      (i.Scanbeam = function () {
        (this.Y = 0), (this.Next = null);
      }),
      (i.Maxima = function () {
        (this.X = 0), (this.Next = null), (this.Prev = null);
      }),
      (i.OutRec = function () {
        (this.Idx = 0),
          (this.IsHole = !1),
          (this.IsOpen = !1),
          (this.FirstLeft = null),
          (this.Pts = null),
          (this.BottomPt = null),
          (this.PolyNode = null);
      }),
      (i.OutPt = function () {
        (this.Idx = 0),
          (this.Pt = new i.IntPoint0()),
          (this.Next = null),
          (this.Prev = null);
      }),
      (i.Join = function () {
        (this.OutPt1 = null),
          (this.OutPt2 = null),
          (this.OffPt = new i.IntPoint0());
      }),
      (i.ClipperBase = function () {
        (this.m_MinimaList = null),
          (this.m_CurrentLM = null),
          (this.m_edges = new Array()),
          (this.m_UseFullRange = !1),
          (this.m_HasOpenPaths = !1),
          (this.PreserveCollinear = !1),
          (this.m_Scanbeam = null),
          (this.m_PolyOuts = null),
          (this.m_ActiveEdges = null);
      }),
      (i.ClipperBase.horizontal = -9007199254740992),
      (i.ClipperBase.Skip = -2),
      (i.ClipperBase.Unassigned = -1),
      (i.ClipperBase.tolerance = 1e-20),
      (i.ClipperBase.loRange = 47453132),
      (i.ClipperBase.hiRange = 0xfffffffffffff),
      (i.ClipperBase.near_zero = function (t) {
        return t > -i.ClipperBase.tolerance && t < i.ClipperBase.tolerance;
      }),
      (i.ClipperBase.IsHorizontal = function (t) {
        return t.Delta.Y === 0;
      }),
      (i.ClipperBase.prototype.PointIsVertex = function (t, e) {
        var s = e;
        do {
          if (i.IntPoint.op_Equality(s.Pt, t)) return !0;
          s = s.Next;
        } while (s !== e);
        return !1;
      }),
      (i.ClipperBase.prototype.PointOnLineSegment = function (t, e, s, n) {
        return n
          ? (t.X === e.X && t.Y === e.Y) ||
              (t.X === s.X && t.Y === s.Y) ||
              (t.X > e.X == t.X < s.X &&
                t.Y > e.Y == t.Y < s.Y &&
                O.op_Equality(
                  O.Int128Mul(t.X - e.X, s.Y - e.Y),
                  O.Int128Mul(s.X - e.X, t.Y - e.Y)
                ))
          : (t.X === e.X && t.Y === e.Y) ||
              (t.X === s.X && t.Y === s.Y) ||
              (t.X > e.X == t.X < s.X &&
                t.Y > e.Y == t.Y < s.Y &&
                (t.X - e.X) * (s.Y - e.Y) === (s.X - e.X) * (t.Y - e.Y));
      }),
      (i.ClipperBase.prototype.PointOnPolygon = function (t, e, s) {
        for (var n = e; ; ) {
          if (this.PointOnLineSegment(t, n.Pt, n.Next.Pt, s)) return !0;
          if (((n = n.Next), n === e)) break;
        }
        return !1;
      }),
      (i.ClipperBase.prototype.SlopesEqual = i.ClipperBase.SlopesEqual =
        function () {
          var t = arguments,
            e = t.length,
            s,
            n,
            r,
            o,
            a,
            c,
            d;
          return e === 3
            ? ((s = t[0]),
              (n = t[1]),
              (d = t[2]),
              d
                ? O.op_Equality(
                    O.Int128Mul(s.Delta.Y, n.Delta.X),
                    O.Int128Mul(s.Delta.X, n.Delta.Y)
                  )
                : i.Cast_Int64(s.Delta.Y * n.Delta.X) ===
                  i.Cast_Int64(s.Delta.X * n.Delta.Y))
            : e === 4
            ? ((r = t[0]),
              (o = t[1]),
              (a = t[2]),
              (d = t[3]),
              d
                ? O.op_Equality(
                    O.Int128Mul(r.Y - o.Y, o.X - a.X),
                    O.Int128Mul(r.X - o.X, o.Y - a.Y)
                  )
                : i.Cast_Int64((r.Y - o.Y) * (o.X - a.X)) -
                    i.Cast_Int64((r.X - o.X) * (o.Y - a.Y)) ===
                  0)
            : ((r = t[0]),
              (o = t[1]),
              (a = t[2]),
              (c = t[3]),
              (d = t[4]),
              d
                ? O.op_Equality(
                    O.Int128Mul(r.Y - o.Y, a.X - c.X),
                    O.Int128Mul(r.X - o.X, a.Y - c.Y)
                  )
                : i.Cast_Int64((r.Y - o.Y) * (a.X - c.X)) -
                    i.Cast_Int64((r.X - o.X) * (a.Y - c.Y)) ===
                  0);
        }),
      (i.ClipperBase.SlopesEqual3 = function (t, e, s) {
        return s
          ? O.op_Equality(
              O.Int128Mul(t.Delta.Y, e.Delta.X),
              O.Int128Mul(t.Delta.X, e.Delta.Y)
            )
          : i.Cast_Int64(t.Delta.Y * e.Delta.X) ===
              i.Cast_Int64(t.Delta.X * e.Delta.Y);
      }),
      (i.ClipperBase.SlopesEqual4 = function (t, e, s, n) {
        return n
          ? O.op_Equality(
              O.Int128Mul(t.Y - e.Y, e.X - s.X),
              O.Int128Mul(t.X - e.X, e.Y - s.Y)
            )
          : i.Cast_Int64((t.Y - e.Y) * (e.X - s.X)) -
              i.Cast_Int64((t.X - e.X) * (e.Y - s.Y)) ===
              0;
      }),
      (i.ClipperBase.SlopesEqual5 = function (t, e, s, n, r) {
        return r
          ? O.op_Equality(
              O.Int128Mul(t.Y - e.Y, s.X - n.X),
              O.Int128Mul(t.X - e.X, s.Y - n.Y)
            )
          : i.Cast_Int64((t.Y - e.Y) * (s.X - n.X)) -
              i.Cast_Int64((t.X - e.X) * (s.Y - n.Y)) ===
              0;
      }),
      (i.ClipperBase.prototype.Clear = function () {
        this.DisposeLocalMinimaList();
        for (var t = 0, e = this.m_edges.length; t < e; ++t) {
          for (var s = 0, n = this.m_edges[t].length; s < n; ++s)
            this.m_edges[t][s] = null;
          i.Clear(this.m_edges[t]);
        }
        i.Clear(this.m_edges),
          (this.m_UseFullRange = !1),
          (this.m_HasOpenPaths = !1);
      }),
      (i.ClipperBase.prototype.DisposeLocalMinimaList = function () {
        for (; this.m_MinimaList !== null; ) {
          var t = this.m_MinimaList.Next;
          (this.m_MinimaList = null), (this.m_MinimaList = t);
        }
        this.m_CurrentLM = null;
      }),
      (i.ClipperBase.prototype.RangeTest = function (t, e) {
        e.Value
          ? (t.X > i.ClipperBase.hiRange ||
              t.Y > i.ClipperBase.hiRange ||
              -t.X > i.ClipperBase.hiRange ||
              -t.Y > i.ClipperBase.hiRange) &&
            i.Error("Coordinate outside allowed range in RangeTest().")
          : (t.X > i.ClipperBase.loRange ||
              t.Y > i.ClipperBase.loRange ||
              -t.X > i.ClipperBase.loRange ||
              -t.Y > i.ClipperBase.loRange) &&
            ((e.Value = !0), this.RangeTest(t, e));
      }),
      (i.ClipperBase.prototype.InitEdge = function (t, e, s, n) {
        (t.Next = e),
          (t.Prev = s),
          (t.Curr.X = n.X),
          (t.Curr.Y = n.Y),
          i.use_xyz && (t.Curr.Z = n.Z),
          (t.OutIdx = -1);
      }),
      (i.ClipperBase.prototype.InitEdge2 = function (t, e) {
        t.Curr.Y >= t.Next.Curr.Y
          ? ((t.Bot.X = t.Curr.X),
            (t.Bot.Y = t.Curr.Y),
            i.use_xyz && (t.Bot.Z = t.Curr.Z),
            (t.Top.X = t.Next.Curr.X),
            (t.Top.Y = t.Next.Curr.Y),
            i.use_xyz && (t.Top.Z = t.Next.Curr.Z))
          : ((t.Top.X = t.Curr.X),
            (t.Top.Y = t.Curr.Y),
            i.use_xyz && (t.Top.Z = t.Curr.Z),
            (t.Bot.X = t.Next.Curr.X),
            (t.Bot.Y = t.Next.Curr.Y),
            i.use_xyz && (t.Bot.Z = t.Next.Curr.Z)),
          this.SetDx(t),
          (t.PolyTyp = e);
      }),
      (i.ClipperBase.prototype.FindNextLocMin = function (t) {
        for (var e; ; ) {
          for (
            ;
            i.IntPoint.op_Inequality(t.Bot, t.Prev.Bot) ||
            i.IntPoint.op_Equality(t.Curr, t.Top);

          )
            t = t.Next;
          if (
            t.Dx !== i.ClipperBase.horizontal &&
            t.Prev.Dx !== i.ClipperBase.horizontal
          )
            break;
          for (; t.Prev.Dx === i.ClipperBase.horizontal; ) t = t.Prev;
          for (e = t; t.Dx === i.ClipperBase.horizontal; ) t = t.Next;
          if (t.Top.Y !== t.Prev.Bot.Y) {
            e.Prev.Bot.X < t.Bot.X && (t = e);
            break;
          }
        }
        return t;
      }),
      (i.ClipperBase.prototype.ProcessBound = function (t, e) {
        var s,
          n = t,
          r;
        if (n.OutIdx === i.ClipperBase.Skip) {
          if (((t = n), e)) {
            for (; t.Top.Y === t.Next.Bot.Y; ) t = t.Next;
            for (; t !== n && t.Dx === i.ClipperBase.horizontal; ) t = t.Prev;
          } else {
            for (; t.Top.Y === t.Prev.Bot.Y; ) t = t.Prev;
            for (; t !== n && t.Dx === i.ClipperBase.horizontal; ) t = t.Next;
          }
          if (t === n) e ? (n = t.Next) : (n = t.Prev);
          else {
            e ? (t = n.Next) : (t = n.Prev);
            var o = new i.LocalMinima();
            (o.Next = null),
              (o.Y = t.Bot.Y),
              (o.LeftBound = null),
              (o.RightBound = t),
              (t.WindDelta = 0),
              (n = this.ProcessBound(t, e)),
              this.InsertLocalMinima(o);
          }
          return n;
        }
        if (
          (t.Dx === i.ClipperBase.horizontal &&
            (e ? (s = t.Prev) : (s = t.Next),
            s.Dx === i.ClipperBase.horizontal
              ? s.Bot.X !== t.Bot.X &&
                s.Top.X !== t.Bot.X &&
                this.ReverseHorizontal(t)
              : s.Bot.X !== t.Bot.X && this.ReverseHorizontal(t)),
          (s = t),
          e)
        ) {
          for (
            ;
            n.Top.Y === n.Next.Bot.Y && n.Next.OutIdx !== i.ClipperBase.Skip;

          )
            n = n.Next;
          if (
            n.Dx === i.ClipperBase.horizontal &&
            n.Next.OutIdx !== i.ClipperBase.Skip
          ) {
            for (r = n; r.Prev.Dx === i.ClipperBase.horizontal; ) r = r.Prev;
            r.Prev.Top.X > n.Next.Top.X && (n = r.Prev);
          }
          for (; t !== n; )
            (t.NextInLML = t.Next),
              t.Dx === i.ClipperBase.horizontal &&
                t !== s &&
                t.Bot.X !== t.Prev.Top.X &&
                this.ReverseHorizontal(t),
              (t = t.Next);
          t.Dx === i.ClipperBase.horizontal &&
            t !== s &&
            t.Bot.X !== t.Prev.Top.X &&
            this.ReverseHorizontal(t),
            (n = n.Next);
        } else {
          for (
            ;
            n.Top.Y === n.Prev.Bot.Y && n.Prev.OutIdx !== i.ClipperBase.Skip;

          )
            n = n.Prev;
          if (
            n.Dx === i.ClipperBase.horizontal &&
            n.Prev.OutIdx !== i.ClipperBase.Skip
          ) {
            for (r = n; r.Next.Dx === i.ClipperBase.horizontal; ) r = r.Next;
            (r.Next.Top.X === n.Prev.Top.X || r.Next.Top.X > n.Prev.Top.X) &&
              (n = r.Next);
          }
          for (; t !== n; )
            (t.NextInLML = t.Prev),
              t.Dx === i.ClipperBase.horizontal &&
                t !== s &&
                t.Bot.X !== t.Next.Top.X &&
                this.ReverseHorizontal(t),
              (t = t.Prev);
          t.Dx === i.ClipperBase.horizontal &&
            t !== s &&
            t.Bot.X !== t.Next.Top.X &&
            this.ReverseHorizontal(t),
            (n = n.Prev);
        }
        return n;
      }),
      (i.ClipperBase.prototype.AddPath = function (t, e, s) {
        i.use_lines
          ? !s &&
            e === i.PolyType.ptClip &&
            i.Error("AddPath: Open paths must be subject.")
          : s || i.Error("AddPath: Open paths have been disabled.");
        var n = t.length - 1;
        if (s) for (; n > 0 && i.IntPoint.op_Equality(t[n], t[0]); ) --n;
        for (; n > 0 && i.IntPoint.op_Equality(t[n], t[n - 1]); ) --n;
        if ((s && n < 2) || (!s && n < 1)) return !1;
        for (var r = new Array(), o = 0; o <= n; o++) r.push(new i.TEdge());
        var a = !0;
        (r[1].Curr.X = t[1].X),
          (r[1].Curr.Y = t[1].Y),
          i.use_xyz && (r[1].Curr.Z = t[1].Z);
        var c = { Value: this.m_UseFullRange };
        this.RangeTest(t[0], c),
          (this.m_UseFullRange = c.Value),
          (c.Value = this.m_UseFullRange),
          this.RangeTest(t[n], c),
          (this.m_UseFullRange = c.Value),
          this.InitEdge(r[0], r[1], r[n], t[0]),
          this.InitEdge(r[n], r[0], r[n - 1], t[n]);
        for (var o = n - 1; o >= 1; --o)
          (c.Value = this.m_UseFullRange),
            this.RangeTest(t[o], c),
            (this.m_UseFullRange = c.Value),
            this.InitEdge(r[o], r[o + 1], r[o - 1], t[o]);
        for (var d = r[0], v = d, L = d; ; ) {
          if (v.Curr === v.Next.Curr && (s || v.Next !== d)) {
            if (v === v.Next) break;
            v === d && (d = v.Next), (v = this.RemoveEdge(v)), (L = v);
            continue;
          }
          if (v.Prev === v.Next) break;
          if (
            s &&
            i.ClipperBase.SlopesEqual4(
              v.Prev.Curr,
              v.Curr,
              v.Next.Curr,
              this.m_UseFullRange
            ) &&
            (!this.PreserveCollinear ||
              !this.Pt2IsBetweenPt1AndPt3(v.Prev.Curr, v.Curr, v.Next.Curr))
          ) {
            v === d && (d = v.Next),
              (v = this.RemoveEdge(v)),
              (v = v.Prev),
              (L = v);
            continue;
          }
          if (((v = v.Next), v === L || (!s && v.Next === d))) break;
        }
        if ((!s && v === v.Next) || (s && v.Prev === v.Next)) return !1;
        s || ((this.m_HasOpenPaths = !0), (d.Prev.OutIdx = i.ClipperBase.Skip)),
          (v = d);
        do
          this.InitEdge2(v, e),
            (v = v.Next),
            a && v.Curr.Y !== d.Curr.Y && (a = !1);
        while (v !== d);
        if (a) {
          if (s) return !1;
          v.Prev.OutIdx = i.ClipperBase.Skip;
          var x = new i.LocalMinima();
          for (
            x.Next = null,
              x.Y = v.Bot.Y,
              x.LeftBound = null,
              x.RightBound = v,
              x.RightBound.Side = i.EdgeSide.esRight,
              x.RightBound.WindDelta = 0;
            v.Bot.X !== v.Prev.Top.X && this.ReverseHorizontal(v),
              v.Next.OutIdx !== i.ClipperBase.Skip;

          )
            (v.NextInLML = v.Next), (v = v.Next);
          return this.InsertLocalMinima(x), this.m_edges.push(r), !0;
        }
        this.m_edges.push(r);
        var w,
          b = null;
        for (
          i.IntPoint.op_Equality(v.Prev.Bot, v.Prev.Top) && (v = v.Next);
          (v = this.FindNextLocMin(v)), v !== b;

        ) {
          b === null && (b = v);
          var x = new i.LocalMinima();
          (x.Next = null),
            (x.Y = v.Bot.Y),
            v.Dx < v.Prev.Dx
              ? ((x.LeftBound = v.Prev), (x.RightBound = v), (w = !1))
              : ((x.LeftBound = v), (x.RightBound = v.Prev), (w = !0)),
            (x.LeftBound.Side = i.EdgeSide.esLeft),
            (x.RightBound.Side = i.EdgeSide.esRight),
            s
              ? x.LeftBound.Next === x.RightBound
                ? (x.LeftBound.WindDelta = -1)
                : (x.LeftBound.WindDelta = 1)
              : (x.LeftBound.WindDelta = 0),
            (x.RightBound.WindDelta = -x.LeftBound.WindDelta),
            (v = this.ProcessBound(x.LeftBound, w)),
            v.OutIdx === i.ClipperBase.Skip && (v = this.ProcessBound(v, w));
          var X = this.ProcessBound(x.RightBound, !w);
          X.OutIdx === i.ClipperBase.Skip && (X = this.ProcessBound(X, !w)),
            x.LeftBound.OutIdx === i.ClipperBase.Skip
              ? (x.LeftBound = null)
              : x.RightBound.OutIdx === i.ClipperBase.Skip &&
                (x.RightBound = null),
            this.InsertLocalMinima(x),
            w || (v = X);
        }
        return !0;
      }),
      (i.ClipperBase.prototype.AddPaths = function (t, e, s) {
        for (var n = !1, r = 0, o = t.length; r < o; ++r)
          this.AddPath(t[r], e, s) && (n = !0);
        return n;
      }),
      (i.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3 = function (t, e, s) {
        return i.IntPoint.op_Equality(t, s) ||
          i.IntPoint.op_Equality(t, e) ||
          i.IntPoint.op_Equality(s, e)
          ? !1
          : t.X !== s.X
          ? e.X > t.X == e.X < s.X
          : e.Y > t.Y == e.Y < s.Y;
      }),
      (i.ClipperBase.prototype.RemoveEdge = function (t) {
        (t.Prev.Next = t.Next), (t.Next.Prev = t.Prev);
        var e = t.Next;
        return (t.Prev = null), e;
      }),
      (i.ClipperBase.prototype.SetDx = function (t) {
        (t.Delta.X = t.Top.X - t.Bot.X),
          (t.Delta.Y = t.Top.Y - t.Bot.Y),
          t.Delta.Y === 0
            ? (t.Dx = i.ClipperBase.horizontal)
            : (t.Dx = t.Delta.X / t.Delta.Y);
      }),
      (i.ClipperBase.prototype.InsertLocalMinima = function (t) {
        if (this.m_MinimaList === null) this.m_MinimaList = t;
        else if (t.Y >= this.m_MinimaList.Y)
          (t.Next = this.m_MinimaList), (this.m_MinimaList = t);
        else {
          for (var e = this.m_MinimaList; e.Next !== null && t.Y < e.Next.Y; )
            e = e.Next;
          (t.Next = e.Next), (e.Next = t);
        }
      }),
      (i.ClipperBase.prototype.PopLocalMinima = function (t, e) {
        return (
          (e.v = this.m_CurrentLM),
          this.m_CurrentLM !== null && this.m_CurrentLM.Y === t
            ? ((this.m_CurrentLM = this.m_CurrentLM.Next), !0)
            : !1
        );
      }),
      (i.ClipperBase.prototype.ReverseHorizontal = function (t) {
        var e = t.Top.X;
        (t.Top.X = t.Bot.X),
          (t.Bot.X = e),
          i.use_xyz && ((e = t.Top.Z), (t.Top.Z = t.Bot.Z), (t.Bot.Z = e));
      }),
      (i.ClipperBase.prototype.Reset = function () {
        if (
          ((this.m_CurrentLM = this.m_MinimaList), this.m_CurrentLM !== null)
        ) {
          this.m_Scanbeam = null;
          for (var t = this.m_MinimaList; t !== null; ) {
            this.InsertScanbeam(t.Y);
            var e = t.LeftBound;
            e !== null &&
              ((e.Curr.X = e.Bot.X),
              (e.Curr.Y = e.Bot.Y),
              i.use_xyz && (e.Curr.Z = e.Bot.Z),
              (e.OutIdx = i.ClipperBase.Unassigned)),
              (e = t.RightBound),
              e !== null &&
                ((e.Curr.X = e.Bot.X),
                (e.Curr.Y = e.Bot.Y),
                i.use_xyz && (e.Curr.Z = e.Bot.Z),
                (e.OutIdx = i.ClipperBase.Unassigned)),
              (t = t.Next);
          }
          this.m_ActiveEdges = null;
        }
      }),
      (i.ClipperBase.prototype.InsertScanbeam = function (t) {
        if (this.m_Scanbeam === null)
          (this.m_Scanbeam = new i.Scanbeam()),
            (this.m_Scanbeam.Next = null),
            (this.m_Scanbeam.Y = t);
        else if (t > this.m_Scanbeam.Y) {
          var e = new i.Scanbeam();
          (e.Y = t), (e.Next = this.m_Scanbeam), (this.m_Scanbeam = e);
        } else {
          for (var s = this.m_Scanbeam; s.Next !== null && t <= s.Next.Y; )
            s = s.Next;
          if (t === s.Y) return;
          var n = new i.Scanbeam();
          (n.Y = t), (n.Next = s.Next), (s.Next = n);
        }
      }),
      (i.ClipperBase.prototype.PopScanbeam = function (t) {
        return this.m_Scanbeam === null
          ? ((t.v = 0), !1)
          : ((t.v = this.m_Scanbeam.Y),
            (this.m_Scanbeam = this.m_Scanbeam.Next),
            !0);
      }),
      (i.ClipperBase.prototype.LocalMinimaPending = function () {
        return this.m_CurrentLM !== null;
      }),
      (i.ClipperBase.prototype.CreateOutRec = function () {
        var t = new i.OutRec();
        return (
          (t.Idx = i.ClipperBase.Unassigned),
          (t.IsHole = !1),
          (t.IsOpen = !1),
          (t.FirstLeft = null),
          (t.Pts = null),
          (t.BottomPt = null),
          (t.PolyNode = null),
          this.m_PolyOuts.push(t),
          (t.Idx = this.m_PolyOuts.length - 1),
          t
        );
      }),
      (i.ClipperBase.prototype.DisposeOutRec = function (t) {
        var e = this.m_PolyOuts[t];
        (e.Pts = null), (e = null), (this.m_PolyOuts[t] = null);
      }),
      (i.ClipperBase.prototype.UpdateEdgeIntoAEL = function (t) {
        t.NextInLML === null && i.Error("UpdateEdgeIntoAEL: invalid call");
        var e = t.PrevInAEL,
          s = t.NextInAEL;
        return (
          (t.NextInLML.OutIdx = t.OutIdx),
          e !== null
            ? (e.NextInAEL = t.NextInLML)
            : (this.m_ActiveEdges = t.NextInLML),
          s !== null && (s.PrevInAEL = t.NextInLML),
          (t.NextInLML.Side = t.Side),
          (t.NextInLML.WindDelta = t.WindDelta),
          (t.NextInLML.WindCnt = t.WindCnt),
          (t.NextInLML.WindCnt2 = t.WindCnt2),
          (t = t.NextInLML),
          (t.Curr.X = t.Bot.X),
          (t.Curr.Y = t.Bot.Y),
          (t.PrevInAEL = e),
          (t.NextInAEL = s),
          i.ClipperBase.IsHorizontal(t) || this.InsertScanbeam(t.Top.Y),
          t
        );
      }),
      (i.ClipperBase.prototype.SwapPositionsInAEL = function (t, e) {
        if (!(t.NextInAEL === t.PrevInAEL || e.NextInAEL === e.PrevInAEL)) {
          if (t.NextInAEL === e) {
            var s = e.NextInAEL;
            s !== null && (s.PrevInAEL = t);
            var n = t.PrevInAEL;
            n !== null && (n.NextInAEL = e),
              (e.PrevInAEL = n),
              (e.NextInAEL = t),
              (t.PrevInAEL = e),
              (t.NextInAEL = s);
          } else if (e.NextInAEL === t) {
            var r = t.NextInAEL;
            r !== null && (r.PrevInAEL = e);
            var o = e.PrevInAEL;
            o !== null && (o.NextInAEL = t),
              (t.PrevInAEL = o),
              (t.NextInAEL = e),
              (e.PrevInAEL = t),
              (e.NextInAEL = r);
          } else {
            var a = t.NextInAEL,
              c = t.PrevInAEL;
            (t.NextInAEL = e.NextInAEL),
              t.NextInAEL !== null && (t.NextInAEL.PrevInAEL = t),
              (t.PrevInAEL = e.PrevInAEL),
              t.PrevInAEL !== null && (t.PrevInAEL.NextInAEL = t),
              (e.NextInAEL = a),
              e.NextInAEL !== null && (e.NextInAEL.PrevInAEL = e),
              (e.PrevInAEL = c),
              e.PrevInAEL !== null && (e.PrevInAEL.NextInAEL = e);
          }
          t.PrevInAEL === null
            ? (this.m_ActiveEdges = t)
            : e.PrevInAEL === null && (this.m_ActiveEdges = e);
        }
      }),
      (i.ClipperBase.prototype.DeleteFromAEL = function (t) {
        var e = t.PrevInAEL,
          s = t.NextInAEL;
        (e === null && s === null && t !== this.m_ActiveEdges) ||
          (e !== null ? (e.NextInAEL = s) : (this.m_ActiveEdges = s),
          s !== null && (s.PrevInAEL = e),
          (t.NextInAEL = null),
          (t.PrevInAEL = null));
      }),
      (i.Clipper = function (t) {
        typeof t > "u" && (t = 0),
          (this.m_PolyOuts = null),
          (this.m_ClipType = i.ClipType.ctIntersection),
          (this.m_Scanbeam = null),
          (this.m_Maxima = null),
          (this.m_ActiveEdges = null),
          (this.m_SortedEdges = null),
          (this.m_IntersectList = null),
          (this.m_IntersectNodeComparer = null),
          (this.m_ExecuteLocked = !1),
          (this.m_ClipFillType = i.PolyFillType.pftEvenOdd),
          (this.m_SubjFillType = i.PolyFillType.pftEvenOdd),
          (this.m_Joins = null),
          (this.m_GhostJoins = null),
          (this.m_UsingPolyTree = !1),
          (this.ReverseSolution = !1),
          (this.StrictlySimple = !1),
          i.ClipperBase.call(this),
          (this.m_Scanbeam = null),
          (this.m_Maxima = null),
          (this.m_ActiveEdges = null),
          (this.m_SortedEdges = null),
          (this.m_IntersectList = new Array()),
          (this.m_IntersectNodeComparer = i.MyIntersectNodeSort.Compare),
          (this.m_ExecuteLocked = !1),
          (this.m_UsingPolyTree = !1),
          (this.m_PolyOuts = new Array()),
          (this.m_Joins = new Array()),
          (this.m_GhostJoins = new Array()),
          (this.ReverseSolution = (1 & t) !== 0),
          (this.StrictlySimple = (2 & t) !== 0),
          (this.PreserveCollinear = (4 & t) !== 0),
          i.use_xyz && (this.ZFillFunction = null);
      }),
      (i.Clipper.ioReverseSolution = 1),
      (i.Clipper.ioStrictlySimple = 2),
      (i.Clipper.ioPreserveCollinear = 4),
      (i.Clipper.prototype.Clear = function () {
        this.m_edges.length !== 0 &&
          (this.DisposeAllPolyPts(), i.ClipperBase.prototype.Clear.call(this));
      }),
      (i.Clipper.prototype.InsertMaxima = function (t) {
        var e = new i.Maxima();
        if (((e.X = t), this.m_Maxima === null))
          (this.m_Maxima = e),
            (this.m_Maxima.Next = null),
            (this.m_Maxima.Prev = null);
        else if (t < this.m_Maxima.X)
          (e.Next = this.m_Maxima), (e.Prev = null), (this.m_Maxima = e);
        else {
          for (var s = this.m_Maxima; s.Next !== null && t >= s.Next.X; )
            s = s.Next;
          if (t === s.X) return;
          (e.Next = s.Next),
            (e.Prev = s),
            s.Next !== null && (s.Next.Prev = e),
            (s.Next = e);
        }
      }),
      (i.Clipper.prototype.Execute = function () {
        var t = arguments,
          e = t.length,
          s = t[1] instanceof i.PolyTree;
        if (e === 4 && !s) {
          var n = t[0],
            r = t[1],
            o = t[2],
            a = t[3];
          if (this.m_ExecuteLocked) return !1;
          this.m_HasOpenPaths &&
            i.Error("Error: PolyTree struct is needed for open path clipping."),
            (this.m_ExecuteLocked = !0),
            i.Clear(r),
            (this.m_SubjFillType = o),
            (this.m_ClipFillType = a),
            (this.m_ClipType = n),
            (this.m_UsingPolyTree = !1);
          try {
            var c = this.ExecuteInternal();
            c && this.BuildResult(r);
          } finally {
            this.DisposeAllPolyPts(), (this.m_ExecuteLocked = !1);
          }
          return c;
        } else if (e === 4 && s) {
          var n = t[0],
            d = t[1],
            o = t[2],
            a = t[3];
          if (this.m_ExecuteLocked) return !1;
          (this.m_ExecuteLocked = !0),
            (this.m_SubjFillType = o),
            (this.m_ClipFillType = a),
            (this.m_ClipType = n),
            (this.m_UsingPolyTree = !0);
          try {
            var c = this.ExecuteInternal();
            c && this.BuildResult2(d);
          } finally {
            this.DisposeAllPolyPts(), (this.m_ExecuteLocked = !1);
          }
          return c;
        } else if (e === 2 && !s) {
          var n = t[0],
            r = t[1];
          return this.Execute(
            n,
            r,
            i.PolyFillType.pftEvenOdd,
            i.PolyFillType.pftEvenOdd
          );
        } else if (e === 2 && s) {
          var n = t[0],
            d = t[1];
          return this.Execute(
            n,
            d,
            i.PolyFillType.pftEvenOdd,
            i.PolyFillType.pftEvenOdd
          );
        }
      }),
      (i.Clipper.prototype.FixHoleLinkage = function (t) {
        if (
          !(
            t.FirstLeft === null ||
            (t.IsHole !== t.FirstLeft.IsHole && t.FirstLeft.Pts !== null)
          )
        ) {
          for (
            var e = t.FirstLeft;
            e !== null && (e.IsHole === t.IsHole || e.Pts === null);

          )
            e = e.FirstLeft;
          t.FirstLeft = e;
        }
      }),
      (i.Clipper.prototype.ExecuteInternal = function () {
        try {
          this.Reset(), (this.m_SortedEdges = null), (this.m_Maxima = null);
          var t = {},
            e = {};
          if (!this.PopScanbeam(t)) return !1;
          for (
            this.InsertLocalMinimaIntoAEL(t.v);
            this.PopScanbeam(e) || this.LocalMinimaPending();

          ) {
            if (
              (this.ProcessHorizontals(),
              (this.m_GhostJoins.length = 0),
              !this.ProcessIntersections(e.v))
            )
              return !1;
            this.ProcessEdgesAtTopOfScanbeam(e.v),
              (t.v = e.v),
              this.InsertLocalMinimaIntoAEL(t.v);
          }
          var s, n, r;
          for (n = 0, r = this.m_PolyOuts.length; n < r; n++)
            (s = this.m_PolyOuts[n]),
              !(s.Pts === null || s.IsOpen) &&
                (s.IsHole ^ this.ReverseSolution) == this.Area$1(s) > 0 &&
                this.ReversePolyPtLinks(s.Pts);
          for (
            this.JoinCommonEdges(), n = 0, r = this.m_PolyOuts.length;
            n < r;
            n++
          )
            (s = this.m_PolyOuts[n]),
              s.Pts !== null &&
                (s.IsOpen ? this.FixupOutPolyline(s) : this.FixupOutPolygon(s));
          return this.StrictlySimple && this.DoSimplePolygons(), !0;
        } finally {
          (this.m_Joins.length = 0), (this.m_GhostJoins.length = 0);
        }
      }),
      (i.Clipper.prototype.DisposeAllPolyPts = function () {
        for (var t = 0, e = this.m_PolyOuts.length; t < e; ++t)
          this.DisposeOutRec(t);
        i.Clear(this.m_PolyOuts);
      }),
      (i.Clipper.prototype.AddJoin = function (t, e, s) {
        var n = new i.Join();
        (n.OutPt1 = t),
          (n.OutPt2 = e),
          (n.OffPt.X = s.X),
          (n.OffPt.Y = s.Y),
          i.use_xyz && (n.OffPt.Z = s.Z),
          this.m_Joins.push(n);
      }),
      (i.Clipper.prototype.AddGhostJoin = function (t, e) {
        var s = new i.Join();
        (s.OutPt1 = t),
          (s.OffPt.X = e.X),
          (s.OffPt.Y = e.Y),
          i.use_xyz && (s.OffPt.Z = e.Z),
          this.m_GhostJoins.push(s);
      }),
      (i.Clipper.prototype.SetZ = function (t, e, s) {
        if (this.ZFillFunction !== null) {
          if (t.Z !== 0 || this.ZFillFunction === null) return;
          i.IntPoint.op_Equality(t, e.Bot)
            ? (t.Z = e.Bot.Z)
            : i.IntPoint.op_Equality(t, e.Top)
            ? (t.Z = e.Top.Z)
            : i.IntPoint.op_Equality(t, s.Bot)
            ? (t.Z = s.Bot.Z)
            : i.IntPoint.op_Equality(t, s.Top)
            ? (t.Z = s.Top.Z)
            : this.ZFillFunction(e.Bot, e.Top, s.Bot, s.Top, t);
        }
      }),
      (i.Clipper.prototype.InsertLocalMinimaIntoAEL = function (t) {
        for (var e = {}, s, n; this.PopLocalMinima(t, e); ) {
          (s = e.v.LeftBound), (n = e.v.RightBound);
          var r = null;
          if (
            (s === null
              ? (this.InsertEdgeIntoAEL(n, null),
                this.SetWindingCount(n),
                this.IsContributing(n) && (r = this.AddOutPt(n, n.Bot)))
              : n === null
              ? (this.InsertEdgeIntoAEL(s, null),
                this.SetWindingCount(s),
                this.IsContributing(s) && (r = this.AddOutPt(s, s.Bot)),
                this.InsertScanbeam(s.Top.Y))
              : (this.InsertEdgeIntoAEL(s, null),
                this.InsertEdgeIntoAEL(n, s),
                this.SetWindingCount(s),
                (n.WindCnt = s.WindCnt),
                (n.WindCnt2 = s.WindCnt2),
                this.IsContributing(s) &&
                  (r = this.AddLocalMinPoly(s, n, s.Bot)),
                this.InsertScanbeam(s.Top.Y)),
            n !== null &&
              (i.ClipperBase.IsHorizontal(n)
                ? (n.NextInLML !== null &&
                    this.InsertScanbeam(n.NextInLML.Top.Y),
                  this.AddEdgeToSEL(n))
                : this.InsertScanbeam(n.Top.Y)),
            !(s === null || n === null))
          ) {
            if (
              r !== null &&
              i.ClipperBase.IsHorizontal(n) &&
              this.m_GhostJoins.length > 0 &&
              n.WindDelta !== 0
            )
              for (var o = 0, a = this.m_GhostJoins.length; o < a; o++) {
                var c = this.m_GhostJoins[o];
                this.HorzSegmentsOverlap(
                  c.OutPt1.Pt.X,
                  c.OffPt.X,
                  n.Bot.X,
                  n.Top.X
                ) && this.AddJoin(c.OutPt1, r, c.OffPt);
              }
            if (
              s.OutIdx >= 0 &&
              s.PrevInAEL !== null &&
              s.PrevInAEL.Curr.X === s.Bot.X &&
              s.PrevInAEL.OutIdx >= 0 &&
              i.ClipperBase.SlopesEqual5(
                s.PrevInAEL.Curr,
                s.PrevInAEL.Top,
                s.Curr,
                s.Top,
                this.m_UseFullRange
              ) &&
              s.WindDelta !== 0 &&
              s.PrevInAEL.WindDelta !== 0
            ) {
              var d = this.AddOutPt(s.PrevInAEL, s.Bot);
              this.AddJoin(r, d, s.Top);
            }
            if (s.NextInAEL !== n) {
              if (
                n.OutIdx >= 0 &&
                n.PrevInAEL.OutIdx >= 0 &&
                i.ClipperBase.SlopesEqual5(
                  n.PrevInAEL.Curr,
                  n.PrevInAEL.Top,
                  n.Curr,
                  n.Top,
                  this.m_UseFullRange
                ) &&
                n.WindDelta !== 0 &&
                n.PrevInAEL.WindDelta !== 0
              ) {
                var d = this.AddOutPt(n.PrevInAEL, n.Bot);
                this.AddJoin(r, d, n.Top);
              }
              var v = s.NextInAEL;
              if (v !== null)
                for (; v !== n; )
                  this.IntersectEdges(n, v, s.Curr), (v = v.NextInAEL);
            }
          }
        }
      }),
      (i.Clipper.prototype.InsertEdgeIntoAEL = function (t, e) {
        if (this.m_ActiveEdges === null)
          (t.PrevInAEL = null), (t.NextInAEL = null), (this.m_ActiveEdges = t);
        else if (e === null && this.E2InsertsBeforeE1(this.m_ActiveEdges, t))
          (t.PrevInAEL = null),
            (t.NextInAEL = this.m_ActiveEdges),
            (this.m_ActiveEdges.PrevInAEL = t),
            (this.m_ActiveEdges = t);
        else {
          for (
            e === null && (e = this.m_ActiveEdges);
            e.NextInAEL !== null && !this.E2InsertsBeforeE1(e.NextInAEL, t);

          )
            e = e.NextInAEL;
          (t.NextInAEL = e.NextInAEL),
            e.NextInAEL !== null && (e.NextInAEL.PrevInAEL = t),
            (t.PrevInAEL = e),
            (e.NextInAEL = t);
        }
      }),
      (i.Clipper.prototype.E2InsertsBeforeE1 = function (t, e) {
        return e.Curr.X === t.Curr.X
          ? e.Top.Y > t.Top.Y
            ? e.Top.X < i.Clipper.TopX(t, e.Top.Y)
            : t.Top.X > i.Clipper.TopX(e, t.Top.Y)
          : e.Curr.X < t.Curr.X;
      }),
      (i.Clipper.prototype.IsEvenOddFillType = function (t) {
        return t.PolyTyp === i.PolyType.ptSubject
          ? this.m_SubjFillType === i.PolyFillType.pftEvenOdd
          : this.m_ClipFillType === i.PolyFillType.pftEvenOdd;
      }),
      (i.Clipper.prototype.IsEvenOddAltFillType = function (t) {
        return t.PolyTyp === i.PolyType.ptSubject
          ? this.m_ClipFillType === i.PolyFillType.pftEvenOdd
          : this.m_SubjFillType === i.PolyFillType.pftEvenOdd;
      }),
      (i.Clipper.prototype.IsContributing = function (t) {
        var e, s;
        switch (
          (t.PolyTyp === i.PolyType.ptSubject
            ? ((e = this.m_SubjFillType), (s = this.m_ClipFillType))
            : ((e = this.m_ClipFillType), (s = this.m_SubjFillType)),
          e)
        ) {
          case i.PolyFillType.pftEvenOdd:
            if (t.WindDelta === 0 && t.WindCnt !== 1) return !1;
            break;
          case i.PolyFillType.pftNonZero:
            if (Math.abs(t.WindCnt) !== 1) return !1;
            break;
          case i.PolyFillType.pftPositive:
            if (t.WindCnt !== 1) return !1;
            break;
          default:
            if (t.WindCnt !== -1) return !1;
            break;
        }
        switch (this.m_ClipType) {
          case i.ClipType.ctIntersection:
            switch (s) {
              case i.PolyFillType.pftEvenOdd:
              case i.PolyFillType.pftNonZero:
                return t.WindCnt2 !== 0;
              case i.PolyFillType.pftPositive:
                return t.WindCnt2 > 0;
              default:
                return t.WindCnt2 < 0;
            }
          case i.ClipType.ctUnion:
            switch (s) {
              case i.PolyFillType.pftEvenOdd:
              case i.PolyFillType.pftNonZero:
                return t.WindCnt2 === 0;
              case i.PolyFillType.pftPositive:
                return t.WindCnt2 <= 0;
              default:
                return t.WindCnt2 >= 0;
            }
          case i.ClipType.ctDifference:
            if (t.PolyTyp === i.PolyType.ptSubject)
              switch (s) {
                case i.PolyFillType.pftEvenOdd:
                case i.PolyFillType.pftNonZero:
                  return t.WindCnt2 === 0;
                case i.PolyFillType.pftPositive:
                  return t.WindCnt2 <= 0;
                default:
                  return t.WindCnt2 >= 0;
              }
            else
              switch (s) {
                case i.PolyFillType.pftEvenOdd:
                case i.PolyFillType.pftNonZero:
                  return t.WindCnt2 !== 0;
                case i.PolyFillType.pftPositive:
                  return t.WindCnt2 > 0;
                default:
                  return t.WindCnt2 < 0;
              }
          case i.ClipType.ctXor:
            if (t.WindDelta === 0)
              switch (s) {
                case i.PolyFillType.pftEvenOdd:
                case i.PolyFillType.pftNonZero:
                  return t.WindCnt2 === 0;
                case i.PolyFillType.pftPositive:
                  return t.WindCnt2 <= 0;
                default:
                  return t.WindCnt2 >= 0;
              }
            else return !0;
        }
        return !0;
      }),
      (i.Clipper.prototype.SetWindingCount = function (t) {
        for (
          var e = t.PrevInAEL;
          e !== null && (e.PolyTyp !== t.PolyTyp || e.WindDelta === 0);

        )
          e = e.PrevInAEL;
        if (e === null) {
          var s =
            t.PolyTyp === i.PolyType.ptSubject
              ? this.m_SubjFillType
              : this.m_ClipFillType;
          t.WindDelta === 0
            ? (t.WindCnt = s === i.PolyFillType.pftNegative ? -1 : 1)
            : (t.WindCnt = t.WindDelta),
            (t.WindCnt2 = 0),
            (e = this.m_ActiveEdges);
        } else if (t.WindDelta === 0 && this.m_ClipType !== i.ClipType.ctUnion)
          (t.WindCnt = 1), (t.WindCnt2 = e.WindCnt2), (e = e.NextInAEL);
        else if (this.IsEvenOddFillType(t)) {
          if (t.WindDelta === 0) {
            for (var n = !0, r = e.PrevInAEL; r !== null; )
              r.PolyTyp === e.PolyTyp && r.WindDelta !== 0 && (n = !n),
                (r = r.PrevInAEL);
            t.WindCnt = n ? 0 : 1;
          } else t.WindCnt = t.WindDelta;
          (t.WindCnt2 = e.WindCnt2), (e = e.NextInAEL);
        } else
          e.WindCnt * e.WindDelta < 0
            ? Math.abs(e.WindCnt) > 1
              ? e.WindDelta * t.WindDelta < 0
                ? (t.WindCnt = e.WindCnt)
                : (t.WindCnt = e.WindCnt + t.WindDelta)
              : (t.WindCnt = t.WindDelta === 0 ? 1 : t.WindDelta)
            : t.WindDelta === 0
            ? (t.WindCnt = e.WindCnt < 0 ? e.WindCnt - 1 : e.WindCnt + 1)
            : e.WindDelta * t.WindDelta < 0
            ? (t.WindCnt = e.WindCnt)
            : (t.WindCnt = e.WindCnt + t.WindDelta),
            (t.WindCnt2 = e.WindCnt2),
            (e = e.NextInAEL);
        if (this.IsEvenOddAltFillType(t))
          for (; e !== t; )
            e.WindDelta !== 0 && (t.WindCnt2 = t.WindCnt2 === 0 ? 1 : 0),
              (e = e.NextInAEL);
        else for (; e !== t; ) (t.WindCnt2 += e.WindDelta), (e = e.NextInAEL);
      }),
      (i.Clipper.prototype.AddEdgeToSEL = function (t) {
        this.m_SortedEdges === null
          ? ((this.m_SortedEdges = t),
            (t.PrevInSEL = null),
            (t.NextInSEL = null))
          : ((t.NextInSEL = this.m_SortedEdges),
            (t.PrevInSEL = null),
            (this.m_SortedEdges.PrevInSEL = t),
            (this.m_SortedEdges = t));
      }),
      (i.Clipper.prototype.PopEdgeFromSEL = function (t) {
        if (((t.v = this.m_SortedEdges), t.v === null)) return !1;
        var e = t.v;
        return (
          (this.m_SortedEdges = t.v.NextInSEL),
          this.m_SortedEdges !== null && (this.m_SortedEdges.PrevInSEL = null),
          (e.NextInSEL = null),
          (e.PrevInSEL = null),
          !0
        );
      }),
      (i.Clipper.prototype.CopyAELToSEL = function () {
        var t = this.m_ActiveEdges;
        for (this.m_SortedEdges = t; t !== null; )
          (t.PrevInSEL = t.PrevInAEL),
            (t.NextInSEL = t.NextInAEL),
            (t = t.NextInAEL);
      }),
      (i.Clipper.prototype.SwapPositionsInSEL = function (t, e) {
        if (
          !(t.NextInSEL === null && t.PrevInSEL === null) &&
          !(e.NextInSEL === null && e.PrevInSEL === null)
        ) {
          if (t.NextInSEL === e) {
            var s = e.NextInSEL;
            s !== null && (s.PrevInSEL = t);
            var n = t.PrevInSEL;
            n !== null && (n.NextInSEL = e),
              (e.PrevInSEL = n),
              (e.NextInSEL = t),
              (t.PrevInSEL = e),
              (t.NextInSEL = s);
          } else if (e.NextInSEL === t) {
            var s = t.NextInSEL;
            s !== null && (s.PrevInSEL = e);
            var n = e.PrevInSEL;
            n !== null && (n.NextInSEL = t),
              (t.PrevInSEL = n),
              (t.NextInSEL = e),
              (e.PrevInSEL = t),
              (e.NextInSEL = s);
          } else {
            var s = t.NextInSEL,
              n = t.PrevInSEL;
            (t.NextInSEL = e.NextInSEL),
              t.NextInSEL !== null && (t.NextInSEL.PrevInSEL = t),
              (t.PrevInSEL = e.PrevInSEL),
              t.PrevInSEL !== null && (t.PrevInSEL.NextInSEL = t),
              (e.NextInSEL = s),
              e.NextInSEL !== null && (e.NextInSEL.PrevInSEL = e),
              (e.PrevInSEL = n),
              e.PrevInSEL !== null && (e.PrevInSEL.NextInSEL = e);
          }
          t.PrevInSEL === null
            ? (this.m_SortedEdges = t)
            : e.PrevInSEL === null && (this.m_SortedEdges = e);
        }
      }),
      (i.Clipper.prototype.AddLocalMaxPoly = function (t, e, s) {
        this.AddOutPt(t, s),
          e.WindDelta === 0 && this.AddOutPt(e, s),
          t.OutIdx === e.OutIdx
            ? ((t.OutIdx = -1), (e.OutIdx = -1))
            : t.OutIdx < e.OutIdx
            ? this.AppendPolygon(t, e)
            : this.AppendPolygon(e, t);
      }),
      (i.Clipper.prototype.AddLocalMinPoly = function (t, e, s) {
        var n, r, o;
        if (
          (i.ClipperBase.IsHorizontal(e) || t.Dx > e.Dx
            ? ((n = this.AddOutPt(t, s)),
              (e.OutIdx = t.OutIdx),
              (t.Side = i.EdgeSide.esLeft),
              (e.Side = i.EdgeSide.esRight),
              (r = t),
              r.PrevInAEL === e ? (o = e.PrevInAEL) : (o = r.PrevInAEL))
            : ((n = this.AddOutPt(e, s)),
              (t.OutIdx = e.OutIdx),
              (t.Side = i.EdgeSide.esRight),
              (e.Side = i.EdgeSide.esLeft),
              (r = e),
              r.PrevInAEL === t ? (o = t.PrevInAEL) : (o = r.PrevInAEL)),
          o !== null && o.OutIdx >= 0 && o.Top.Y < s.Y && r.Top.Y < s.Y)
        ) {
          var a = i.Clipper.TopX(o, s.Y),
            c = i.Clipper.TopX(r, s.Y);
          if (
            a === c &&
            r.WindDelta !== 0 &&
            o.WindDelta !== 0 &&
            i.ClipperBase.SlopesEqual5(
              new i.IntPoint2(a, s.Y),
              o.Top,
              new i.IntPoint2(c, s.Y),
              r.Top,
              this.m_UseFullRange
            )
          ) {
            var d = this.AddOutPt(o, s);
            this.AddJoin(n, d, r.Top);
          }
        }
        return n;
      }),
      (i.Clipper.prototype.AddOutPt = function (t, e) {
        if (t.OutIdx < 0) {
          var s = this.CreateOutRec();
          s.IsOpen = t.WindDelta === 0;
          var n = new i.OutPt();
          return (
            (s.Pts = n),
            (n.Idx = s.Idx),
            (n.Pt.X = e.X),
            (n.Pt.Y = e.Y),
            i.use_xyz && (n.Pt.Z = e.Z),
            (n.Next = n),
            (n.Prev = n),
            s.IsOpen || this.SetHoleState(t, s),
            (t.OutIdx = s.Idx),
            n
          );
        } else {
          var s = this.m_PolyOuts[t.OutIdx],
            r = s.Pts,
            o = t.Side === i.EdgeSide.esLeft;
          if (o && i.IntPoint.op_Equality(e, r.Pt)) return r;
          if (!o && i.IntPoint.op_Equality(e, r.Prev.Pt)) return r.Prev;
          var n = new i.OutPt();
          return (
            (n.Idx = s.Idx),
            (n.Pt.X = e.X),
            (n.Pt.Y = e.Y),
            i.use_xyz && (n.Pt.Z = e.Z),
            (n.Next = r),
            (n.Prev = r.Prev),
            (n.Prev.Next = n),
            (r.Prev = n),
            o && (s.Pts = n),
            n
          );
        }
      }),
      (i.Clipper.prototype.GetLastOutPt = function (t) {
        var e = this.m_PolyOuts[t.OutIdx];
        return t.Side === i.EdgeSide.esLeft ? e.Pts : e.Pts.Prev;
      }),
      (i.Clipper.prototype.SwapPoints = function (t, e) {
        var s = new i.IntPoint1(t.Value);
        (t.Value.X = e.Value.X),
          (t.Value.Y = e.Value.Y),
          i.use_xyz && (t.Value.Z = e.Value.Z),
          (e.Value.X = s.X),
          (e.Value.Y = s.Y),
          i.use_xyz && (e.Value.Z = s.Z);
      }),
      (i.Clipper.prototype.HorzSegmentsOverlap = function (t, e, s, n) {
        var r;
        return (
          t > e && ((r = t), (t = e), (e = r)),
          s > n && ((r = s), (s = n), (n = r)),
          t < n && s < e
        );
      }),
      (i.Clipper.prototype.SetHoleState = function (t, e) {
        for (var s = t.PrevInAEL, n = null; s !== null; )
          s.OutIdx >= 0 &&
            s.WindDelta !== 0 &&
            (n === null ? (n = s) : n.OutIdx === s.OutIdx && (n = null)),
            (s = s.PrevInAEL);
        n === null
          ? ((e.FirstLeft = null), (e.IsHole = !1))
          : ((e.FirstLeft = this.m_PolyOuts[n.OutIdx]),
            (e.IsHole = !e.FirstLeft.IsHole));
      }),
      (i.Clipper.prototype.GetDx = function (t, e) {
        return t.Y === e.Y
          ? i.ClipperBase.horizontal
          : (e.X - t.X) / (e.Y - t.Y);
      }),
      (i.Clipper.prototype.FirstIsBottomPt = function (t, e) {
        for (var s = t.Prev; i.IntPoint.op_Equality(s.Pt, t.Pt) && s !== t; )
          s = s.Prev;
        var n = Math.abs(this.GetDx(t.Pt, s.Pt));
        for (s = t.Next; i.IntPoint.op_Equality(s.Pt, t.Pt) && s !== t; )
          s = s.Next;
        var r = Math.abs(this.GetDx(t.Pt, s.Pt));
        for (s = e.Prev; i.IntPoint.op_Equality(s.Pt, e.Pt) && s !== e; )
          s = s.Prev;
        var o = Math.abs(this.GetDx(e.Pt, s.Pt));
        for (s = e.Next; i.IntPoint.op_Equality(s.Pt, e.Pt) && s !== e; )
          s = s.Next;
        var a = Math.abs(this.GetDx(e.Pt, s.Pt));
        return Math.max(n, r) === Math.max(o, a) &&
          Math.min(n, r) === Math.min(o, a)
          ? this.Area(t) > 0
          : (n >= o && n >= a) || (r >= o && r >= a);
      }),
      (i.Clipper.prototype.GetBottomPt = function (t) {
        for (var e = null, s = t.Next; s !== t; )
          s.Pt.Y > t.Pt.Y
            ? ((t = s), (e = null))
            : s.Pt.Y === t.Pt.Y &&
              s.Pt.X <= t.Pt.X &&
              (s.Pt.X < t.Pt.X
                ? ((e = null), (t = s))
                : s.Next !== t && s.Prev !== t && (e = s)),
            (s = s.Next);
        if (e !== null)
          for (; e !== s; )
            for (
              this.FirstIsBottomPt(s, e) || (t = e), e = e.Next;
              i.IntPoint.op_Inequality(e.Pt, t.Pt);

            )
              e = e.Next;
        return t;
      }),
      (i.Clipper.prototype.GetLowermostRec = function (t, e) {
        t.BottomPt === null && (t.BottomPt = this.GetBottomPt(t.Pts)),
          e.BottomPt === null && (e.BottomPt = this.GetBottomPt(e.Pts));
        var s = t.BottomPt,
          n = e.BottomPt;
        return s.Pt.Y > n.Pt.Y
          ? t
          : s.Pt.Y < n.Pt.Y
          ? e
          : s.Pt.X < n.Pt.X
          ? t
          : s.Pt.X > n.Pt.X || s.Next === s
          ? e
          : n.Next === n || this.FirstIsBottomPt(s, n)
          ? t
          : e;
      }),
      (i.Clipper.prototype.OutRec1RightOfOutRec2 = function (t, e) {
        do if (((t = t.FirstLeft), t === e)) return !0;
        while (t !== null);
        return !1;
      }),
      (i.Clipper.prototype.GetOutRec = function (t) {
        for (var e = this.m_PolyOuts[t]; e !== this.m_PolyOuts[e.Idx]; )
          e = this.m_PolyOuts[e.Idx];
        return e;
      }),
      (i.Clipper.prototype.AppendPolygon = function (t, e) {
        var s = this.m_PolyOuts[t.OutIdx],
          n = this.m_PolyOuts[e.OutIdx],
          r;
        this.OutRec1RightOfOutRec2(s, n)
          ? (r = n)
          : this.OutRec1RightOfOutRec2(n, s)
          ? (r = s)
          : (r = this.GetLowermostRec(s, n));
        var o = s.Pts,
          a = o.Prev,
          c = n.Pts,
          d = c.Prev;
        t.Side === i.EdgeSide.esLeft
          ? e.Side === i.EdgeSide.esLeft
            ? (this.ReversePolyPtLinks(c),
              (c.Next = o),
              (o.Prev = c),
              (a.Next = d),
              (d.Prev = a),
              (s.Pts = d))
            : ((d.Next = o),
              (o.Prev = d),
              (c.Prev = a),
              (a.Next = c),
              (s.Pts = c))
          : e.Side === i.EdgeSide.esRight
          ? (this.ReversePolyPtLinks(c),
            (a.Next = d),
            (d.Prev = a),
            (c.Next = o),
            (o.Prev = c))
          : ((a.Next = c), (c.Prev = a), (o.Prev = d), (d.Next = o)),
          (s.BottomPt = null),
          r === n &&
            (n.FirstLeft !== s && (s.FirstLeft = n.FirstLeft),
            (s.IsHole = n.IsHole)),
          (n.Pts = null),
          (n.BottomPt = null),
          (n.FirstLeft = s);
        var v = t.OutIdx,
          L = e.OutIdx;
        (t.OutIdx = -1), (e.OutIdx = -1);
        for (var x = this.m_ActiveEdges; x !== null; ) {
          if (x.OutIdx === L) {
            (x.OutIdx = v), (x.Side = t.Side);
            break;
          }
          x = x.NextInAEL;
        }
        n.Idx = s.Idx;
      }),
      (i.Clipper.prototype.ReversePolyPtLinks = function (t) {
        if (t !== null) {
          var e, s;
          e = t;
          do (s = e.Next), (e.Next = e.Prev), (e.Prev = s), (e = s);
          while (e !== t);
        }
      }),
      (i.Clipper.SwapSides = function (t, e) {
        var s = t.Side;
        (t.Side = e.Side), (e.Side = s);
      }),
      (i.Clipper.SwapPolyIndexes = function (t, e) {
        var s = t.OutIdx;
        (t.OutIdx = e.OutIdx), (e.OutIdx = s);
      }),
      (i.Clipper.prototype.IntersectEdges = function (t, e, s) {
        var n = t.OutIdx >= 0,
          r = e.OutIdx >= 0;
        if (
          (i.use_xyz && this.SetZ(s, t, e),
          i.use_lines && (t.WindDelta === 0 || e.WindDelta === 0))
        ) {
          if (t.WindDelta === 0 && e.WindDelta === 0) return;
          t.PolyTyp === e.PolyTyp &&
          t.WindDelta !== e.WindDelta &&
          this.m_ClipType === i.ClipType.ctUnion
            ? t.WindDelta === 0
              ? r && (this.AddOutPt(t, s), n && (t.OutIdx = -1))
              : n && (this.AddOutPt(e, s), r && (e.OutIdx = -1))
            : t.PolyTyp !== e.PolyTyp &&
              (t.WindDelta === 0 &&
              Math.abs(e.WindCnt) === 1 &&
              (this.m_ClipType !== i.ClipType.ctUnion || e.WindCnt2 === 0)
                ? (this.AddOutPt(t, s), n && (t.OutIdx = -1))
                : e.WindDelta === 0 &&
                  Math.abs(t.WindCnt) === 1 &&
                  (this.m_ClipType !== i.ClipType.ctUnion ||
                    t.WindCnt2 === 0) &&
                  (this.AddOutPt(e, s), r && (e.OutIdx = -1)));
          return;
        }
        if (t.PolyTyp === e.PolyTyp)
          if (this.IsEvenOddFillType(t)) {
            var o = t.WindCnt;
            (t.WindCnt = e.WindCnt), (e.WindCnt = o);
          } else
            t.WindCnt + e.WindDelta === 0
              ? (t.WindCnt = -t.WindCnt)
              : (t.WindCnt += e.WindDelta),
              e.WindCnt - t.WindDelta === 0
                ? (e.WindCnt = -e.WindCnt)
                : (e.WindCnt -= t.WindDelta);
        else
          this.IsEvenOddFillType(e)
            ? (t.WindCnt2 = t.WindCnt2 === 0 ? 1 : 0)
            : (t.WindCnt2 += e.WindDelta),
            this.IsEvenOddFillType(t)
              ? (e.WindCnt2 = e.WindCnt2 === 0 ? 1 : 0)
              : (e.WindCnt2 -= t.WindDelta);
        var a, c, d, v;
        t.PolyTyp === i.PolyType.ptSubject
          ? ((a = this.m_SubjFillType), (d = this.m_ClipFillType))
          : ((a = this.m_ClipFillType), (d = this.m_SubjFillType)),
          e.PolyTyp === i.PolyType.ptSubject
            ? ((c = this.m_SubjFillType), (v = this.m_ClipFillType))
            : ((c = this.m_ClipFillType), (v = this.m_SubjFillType));
        var L, x;
        switch (a) {
          case i.PolyFillType.pftPositive:
            L = t.WindCnt;
            break;
          case i.PolyFillType.pftNegative:
            L = -t.WindCnt;
            break;
          default:
            L = Math.abs(t.WindCnt);
            break;
        }
        switch (c) {
          case i.PolyFillType.pftPositive:
            x = e.WindCnt;
            break;
          case i.PolyFillType.pftNegative:
            x = -e.WindCnt;
            break;
          default:
            x = Math.abs(e.WindCnt);
            break;
        }
        if (n && r)
          (L !== 0 && L !== 1) ||
          (x !== 0 && x !== 1) ||
          (t.PolyTyp !== e.PolyTyp && this.m_ClipType !== i.ClipType.ctXor)
            ? this.AddLocalMaxPoly(t, e, s)
            : (this.AddOutPt(t, s),
              this.AddOutPt(e, s),
              i.Clipper.SwapSides(t, e),
              i.Clipper.SwapPolyIndexes(t, e));
        else if (n)
          (x === 0 || x === 1) &&
            (this.AddOutPt(t, s),
            i.Clipper.SwapSides(t, e),
            i.Clipper.SwapPolyIndexes(t, e));
        else if (r)
          (L === 0 || L === 1) &&
            (this.AddOutPt(e, s),
            i.Clipper.SwapSides(t, e),
            i.Clipper.SwapPolyIndexes(t, e));
        else if ((L === 0 || L === 1) && (x === 0 || x === 1)) {
          var w, b;
          switch (d) {
            case i.PolyFillType.pftPositive:
              w = t.WindCnt2;
              break;
            case i.PolyFillType.pftNegative:
              w = -t.WindCnt2;
              break;
            default:
              w = Math.abs(t.WindCnt2);
              break;
          }
          switch (v) {
            case i.PolyFillType.pftPositive:
              b = e.WindCnt2;
              break;
            case i.PolyFillType.pftNegative:
              b = -e.WindCnt2;
              break;
            default:
              b = Math.abs(e.WindCnt2);
              break;
          }
          if (t.PolyTyp !== e.PolyTyp) this.AddLocalMinPoly(t, e, s);
          else if (L === 1 && x === 1)
            switch (this.m_ClipType) {
              case i.ClipType.ctIntersection:
                w > 0 && b > 0 && this.AddLocalMinPoly(t, e, s);
                break;
              case i.ClipType.ctUnion:
                w <= 0 && b <= 0 && this.AddLocalMinPoly(t, e, s);
                break;
              case i.ClipType.ctDifference:
                ((t.PolyTyp === i.PolyType.ptClip && w > 0 && b > 0) ||
                  (t.PolyTyp === i.PolyType.ptSubject && w <= 0 && b <= 0)) &&
                  this.AddLocalMinPoly(t, e, s);
                break;
              case i.ClipType.ctXor:
                this.AddLocalMinPoly(t, e, s);
                break;
            }
          else i.Clipper.SwapSides(t, e);
        }
      }),
      (i.Clipper.prototype.DeleteFromSEL = function (t) {
        var e = t.PrevInSEL,
          s = t.NextInSEL;
        (e === null && s === null && t !== this.m_SortedEdges) ||
          (e !== null ? (e.NextInSEL = s) : (this.m_SortedEdges = s),
          s !== null && (s.PrevInSEL = e),
          (t.NextInSEL = null),
          (t.PrevInSEL = null));
      }),
      (i.Clipper.prototype.ProcessHorizontals = function () {
        for (var t = {}; this.PopEdgeFromSEL(t); ) this.ProcessHorizontal(t.v);
      }),
      (i.Clipper.prototype.GetHorzDirection = function (t, e) {
        t.Bot.X < t.Top.X
          ? ((e.Left = t.Bot.X),
            (e.Right = t.Top.X),
            (e.Dir = i.Direction.dLeftToRight))
          : ((e.Left = t.Top.X),
            (e.Right = t.Bot.X),
            (e.Dir = i.Direction.dRightToLeft));
      }),
      (i.Clipper.prototype.ProcessHorizontal = function (t) {
        var e = { Dir: null, Left: null, Right: null };
        this.GetHorzDirection(t, e);
        for (
          var s = e.Dir,
            n = e.Left,
            r = e.Right,
            o = t.WindDelta === 0,
            a = t,
            c = null;
          a.NextInLML !== null && i.ClipperBase.IsHorizontal(a.NextInLML);

        )
          a = a.NextInLML;
        a.NextInLML === null && (c = this.GetMaximaPair(a));
        var d = this.m_Maxima;
        if (d !== null)
          if (s === i.Direction.dLeftToRight) {
            for (; d !== null && d.X <= t.Bot.X; ) d = d.Next;
            d !== null && d.X >= a.Top.X && (d = null);
          } else {
            for (; d.Next !== null && d.Next.X < t.Bot.X; ) d = d.Next;
            d.X <= a.Top.X && (d = null);
          }
        for (var v = null; ; ) {
          for (var L = t === a, x = this.GetNextInAEL(t, s); x !== null; ) {
            if (d !== null)
              if (s === i.Direction.dLeftToRight)
                for (; d !== null && d.X < x.Curr.X; )
                  t.OutIdx >= 0 &&
                    !o &&
                    this.AddOutPt(t, new i.IntPoint2(d.X, t.Bot.Y)),
                    (d = d.Next);
              else
                for (; d !== null && d.X > x.Curr.X; )
                  t.OutIdx >= 0 &&
                    !o &&
                    this.AddOutPt(t, new i.IntPoint2(d.X, t.Bot.Y)),
                    (d = d.Prev);
            if (
              (s === i.Direction.dLeftToRight && x.Curr.X > r) ||
              (s === i.Direction.dRightToLeft && x.Curr.X < n) ||
              (x.Curr.X === t.Top.X &&
                t.NextInLML !== null &&
                x.Dx < t.NextInLML.Dx)
            )
              break;
            if (t.OutIdx >= 0 && !o) {
              i.use_xyz &&
                (s === i.Direction.dLeftToRight
                  ? this.SetZ(x.Curr, t, x)
                  : this.SetZ(x.Curr, x, t)),
                (v = this.AddOutPt(t, x.Curr));
              for (var w = this.m_SortedEdges; w !== null; ) {
                if (
                  w.OutIdx >= 0 &&
                  this.HorzSegmentsOverlap(t.Bot.X, t.Top.X, w.Bot.X, w.Top.X)
                ) {
                  var b = this.GetLastOutPt(w);
                  this.AddJoin(b, v, w.Top);
                }
                w = w.NextInSEL;
              }
              this.AddGhostJoin(v, t.Bot);
            }
            if (x === c && L) {
              t.OutIdx >= 0 && this.AddLocalMaxPoly(t, c, t.Top),
                this.DeleteFromAEL(t),
                this.DeleteFromAEL(c);
              return;
            }
            if (s === i.Direction.dLeftToRight) {
              var X = new i.IntPoint2(x.Curr.X, t.Curr.Y);
              this.IntersectEdges(t, x, X);
            } else {
              var X = new i.IntPoint2(x.Curr.X, t.Curr.Y);
              this.IntersectEdges(x, t, X);
            }
            var N = this.GetNextInAEL(x, s);
            this.SwapPositionsInAEL(t, x), (x = N);
          }
          if (t.NextInLML === null || !i.ClipperBase.IsHorizontal(t.NextInLML))
            break;
          (t = this.UpdateEdgeIntoAEL(t)),
            t.OutIdx >= 0 && this.AddOutPt(t, t.Bot),
            (e = { Dir: s, Left: n, Right: r }),
            this.GetHorzDirection(t, e),
            (s = e.Dir),
            (n = e.Left),
            (r = e.Right);
        }
        if (t.OutIdx >= 0 && v === null) {
          v = this.GetLastOutPt(t);
          for (var w = this.m_SortedEdges; w !== null; ) {
            if (
              w.OutIdx >= 0 &&
              this.HorzSegmentsOverlap(t.Bot.X, t.Top.X, w.Bot.X, w.Top.X)
            ) {
              var b = this.GetLastOutPt(w);
              this.AddJoin(b, v, w.Top);
            }
            w = w.NextInSEL;
          }
          this.AddGhostJoin(v, t.Top);
        }
        if (t.NextInLML !== null)
          if (t.OutIdx >= 0) {
            if (
              ((v = this.AddOutPt(t, t.Top)),
              (t = this.UpdateEdgeIntoAEL(t)),
              t.WindDelta === 0)
            )
              return;
            var F = t.PrevInAEL,
              N = t.NextInAEL;
            if (
              F !== null &&
              F.Curr.X === t.Bot.X &&
              F.Curr.Y === t.Bot.Y &&
              F.WindDelta === 0 &&
              F.OutIdx >= 0 &&
              F.Curr.Y > F.Top.Y &&
              i.ClipperBase.SlopesEqual3(t, F, this.m_UseFullRange)
            ) {
              var b = this.AddOutPt(F, t.Bot);
              this.AddJoin(v, b, t.Top);
            } else if (
              N !== null &&
              N.Curr.X === t.Bot.X &&
              N.Curr.Y === t.Bot.Y &&
              N.WindDelta !== 0 &&
              N.OutIdx >= 0 &&
              N.Curr.Y > N.Top.Y &&
              i.ClipperBase.SlopesEqual3(t, N, this.m_UseFullRange)
            ) {
              var b = this.AddOutPt(N, t.Bot);
              this.AddJoin(v, b, t.Top);
            }
          } else t = this.UpdateEdgeIntoAEL(t);
        else t.OutIdx >= 0 && this.AddOutPt(t, t.Top), this.DeleteFromAEL(t);
      }),
      (i.Clipper.prototype.GetNextInAEL = function (t, e) {
        return e === i.Direction.dLeftToRight ? t.NextInAEL : t.PrevInAEL;
      }),
      (i.Clipper.prototype.IsMinima = function (t) {
        return t !== null && t.Prev.NextInLML !== t && t.Next.NextInLML !== t;
      }),
      (i.Clipper.prototype.IsMaxima = function (t, e) {
        return t !== null && t.Top.Y === e && t.NextInLML === null;
      }),
      (i.Clipper.prototype.IsIntermediate = function (t, e) {
        return t.Top.Y === e && t.NextInLML !== null;
      }),
      (i.Clipper.prototype.GetMaximaPair = function (t) {
        return i.IntPoint.op_Equality(t.Next.Top, t.Top) &&
          t.Next.NextInLML === null
          ? t.Next
          : i.IntPoint.op_Equality(t.Prev.Top, t.Top) &&
            t.Prev.NextInLML === null
          ? t.Prev
          : null;
      }),
      (i.Clipper.prototype.GetMaximaPairEx = function (t) {
        var e = this.GetMaximaPair(t);
        return e === null ||
          e.OutIdx === i.ClipperBase.Skip ||
          (e.NextInAEL === e.PrevInAEL && !i.ClipperBase.IsHorizontal(e))
          ? null
          : e;
      }),
      (i.Clipper.prototype.ProcessIntersections = function (t) {
        if (this.m_ActiveEdges === null) return !0;
        try {
          if ((this.BuildIntersectList(t), this.m_IntersectList.length === 0))
            return !0;
          if (
            this.m_IntersectList.length === 1 ||
            this.FixupIntersectionOrder()
          )
            this.ProcessIntersectList();
          else return !1;
        } catch {
          (this.m_SortedEdges = null),
            (this.m_IntersectList.length = 0),
            i.Error("ProcessIntersections error");
        }
        return (this.m_SortedEdges = null), !0;
      }),
      (i.Clipper.prototype.BuildIntersectList = function (t) {
        if (this.m_ActiveEdges !== null) {
          var e = this.m_ActiveEdges;
          for (this.m_SortedEdges = e; e !== null; )
            (e.PrevInSEL = e.PrevInAEL),
              (e.NextInSEL = e.NextInAEL),
              (e.Curr.X = i.Clipper.TopX(e, t)),
              (e = e.NextInAEL);
          for (var s = !0; s && this.m_SortedEdges !== null; ) {
            for (s = !1, e = this.m_SortedEdges; e.NextInSEL !== null; ) {
              var n = e.NextInSEL,
                r = new i.IntPoint0();
              if (e.Curr.X > n.Curr.X) {
                this.IntersectPoint(e, n, r),
                  r.Y < t && (r = new i.IntPoint2(i.Clipper.TopX(e, t), t));
                var o = new i.IntersectNode();
                (o.Edge1 = e),
                  (o.Edge2 = n),
                  (o.Pt.X = r.X),
                  (o.Pt.Y = r.Y),
                  i.use_xyz && (o.Pt.Z = r.Z),
                  this.m_IntersectList.push(o),
                  this.SwapPositionsInSEL(e, n),
                  (s = !0);
              } else e = n;
            }
            if (e.PrevInSEL !== null) e.PrevInSEL.NextInSEL = null;
            else break;
          }
          this.m_SortedEdges = null;
        }
      }),
      (i.Clipper.prototype.EdgesAdjacent = function (t) {
        return t.Edge1.NextInSEL === t.Edge2 || t.Edge1.PrevInSEL === t.Edge2;
      }),
      (i.Clipper.IntersectNodeSort = function (t, e) {
        return e.Pt.Y - t.Pt.Y;
      }),
      (i.Clipper.prototype.FixupIntersectionOrder = function () {
        this.m_IntersectList.sort(this.m_IntersectNodeComparer),
          this.CopyAELToSEL();
        for (var t = this.m_IntersectList.length, e = 0; e < t; e++) {
          if (!this.EdgesAdjacent(this.m_IntersectList[e])) {
            for (
              var s = e + 1;
              s < t && !this.EdgesAdjacent(this.m_IntersectList[s]);

            )
              s++;
            if (s === t) return !1;
            var n = this.m_IntersectList[e];
            (this.m_IntersectList[e] = this.m_IntersectList[s]),
              (this.m_IntersectList[s] = n);
          }
          this.SwapPositionsInSEL(
            this.m_IntersectList[e].Edge1,
            this.m_IntersectList[e].Edge2
          );
        }
        return !0;
      }),
      (i.Clipper.prototype.ProcessIntersectList = function () {
        for (var t = 0, e = this.m_IntersectList.length; t < e; t++) {
          var s = this.m_IntersectList[t];
          this.IntersectEdges(s.Edge1, s.Edge2, s.Pt),
            this.SwapPositionsInAEL(s.Edge1, s.Edge2);
        }
        this.m_IntersectList.length = 0;
      });
    var ai = function (t) {
        return t < 0 ? Math.ceil(t - 0.5) : Math.round(t);
      },
      hi = function (t) {
        return t < 0 ? Math.ceil(t - 0.5) : Math.floor(t + 0.5);
      },
      ui = function (t) {
        return t < 0 ? -Math.round(Math.abs(t)) : Math.round(t);
      },
      fi = function (t) {
        return t < 0
          ? ((t -= 0.5), t < -2147483648 ? Math.ceil(t) : t | 0)
          : ((t += 0.5), t > 2147483647 ? Math.floor(t) : t | 0);
      };
    h.msie
      ? (i.Clipper.Round = ai)
      : h.chromium
      ? (i.Clipper.Round = ui)
      : h.safari
      ? (i.Clipper.Round = fi)
      : (i.Clipper.Round = hi),
      (i.Clipper.TopX = function (t, e) {
        return e === t.Top.Y
          ? t.Top.X
          : t.Bot.X + i.Clipper.Round(t.Dx * (e - t.Bot.Y));
      }),
      (i.Clipper.prototype.IntersectPoint = function (t, e, s) {
        (s.X = 0), (s.Y = 0);
        var n, r;
        if (t.Dx === e.Dx) {
          (s.Y = t.Curr.Y), (s.X = i.Clipper.TopX(t, s.Y));
          return;
        }
        if (t.Delta.X === 0)
          (s.X = t.Bot.X),
            i.ClipperBase.IsHorizontal(e)
              ? (s.Y = e.Bot.Y)
              : ((r = e.Bot.Y - e.Bot.X / e.Dx),
                (s.Y = i.Clipper.Round(s.X / e.Dx + r)));
        else if (e.Delta.X === 0)
          (s.X = e.Bot.X),
            i.ClipperBase.IsHorizontal(t)
              ? (s.Y = t.Bot.Y)
              : ((n = t.Bot.Y - t.Bot.X / t.Dx),
                (s.Y = i.Clipper.Round(s.X / t.Dx + n)));
        else {
          (n = t.Bot.X - t.Bot.Y * t.Dx), (r = e.Bot.X - e.Bot.Y * e.Dx);
          var o = (r - n) / (t.Dx - e.Dx);
          (s.Y = i.Clipper.Round(o)),
            Math.abs(t.Dx) < Math.abs(e.Dx)
              ? (s.X = i.Clipper.Round(t.Dx * o + n))
              : (s.X = i.Clipper.Round(e.Dx * o + r));
        }
        if (s.Y < t.Top.Y || s.Y < e.Top.Y) {
          if (t.Top.Y > e.Top.Y)
            return (
              (s.Y = t.Top.Y), (s.X = i.Clipper.TopX(e, t.Top.Y)), s.X < t.Top.X
            );
          (s.Y = e.Top.Y),
            Math.abs(t.Dx) < Math.abs(e.Dx)
              ? (s.X = i.Clipper.TopX(t, s.Y))
              : (s.X = i.Clipper.TopX(e, s.Y));
        }
        s.Y > t.Curr.Y &&
          ((s.Y = t.Curr.Y),
          Math.abs(t.Dx) > Math.abs(e.Dx)
            ? (s.X = i.Clipper.TopX(e, s.Y))
            : (s.X = i.Clipper.TopX(t, s.Y)));
      }),
      (i.Clipper.prototype.ProcessEdgesAtTopOfScanbeam = function (t) {
        for (var e = this.m_ActiveEdges; e !== null; ) {
          var s = this.IsMaxima(e, t);
          if (s) {
            var n = this.GetMaximaPairEx(e);
            s = n === null || !i.ClipperBase.IsHorizontal(n);
          }
          if (s) {
            this.StrictlySimple && this.InsertMaxima(e.Top.X);
            var r = e.PrevInAEL;
            this.DoMaxima(e),
              r === null ? (e = this.m_ActiveEdges) : (e = r.NextInAEL);
          } else {
            if (
              (this.IsIntermediate(e, t) &&
              i.ClipperBase.IsHorizontal(e.NextInLML)
                ? ((e = this.UpdateEdgeIntoAEL(e)),
                  e.OutIdx >= 0 && this.AddOutPt(e, e.Bot),
                  this.AddEdgeToSEL(e))
                : ((e.Curr.X = i.Clipper.TopX(e, t)), (e.Curr.Y = t)),
              i.use_xyz &&
                (e.Top.Y === t
                  ? (e.Curr.Z = e.Top.Z)
                  : e.Bot.Y === t
                  ? (e.Curr.Z = e.Bot.Z)
                  : (e.Curr.Z = 0)),
              this.StrictlySimple)
            ) {
              var r = e.PrevInAEL;
              if (
                e.OutIdx >= 0 &&
                e.WindDelta !== 0 &&
                r !== null &&
                r.OutIdx >= 0 &&
                r.Curr.X === e.Curr.X &&
                r.WindDelta !== 0
              ) {
                var o = new i.IntPoint1(e.Curr);
                i.use_xyz && this.SetZ(o, r, e);
                var a = this.AddOutPt(r, o),
                  c = this.AddOutPt(e, o);
                this.AddJoin(a, c, o);
              }
            }
            e = e.NextInAEL;
          }
        }
        for (
          this.ProcessHorizontals(),
            this.m_Maxima = null,
            e = this.m_ActiveEdges;
          e !== null;

        ) {
          if (this.IsIntermediate(e, t)) {
            var a = null;
            e.OutIdx >= 0 && (a = this.AddOutPt(e, e.Top)),
              (e = this.UpdateEdgeIntoAEL(e));
            var r = e.PrevInAEL,
              d = e.NextInAEL;
            if (
              r !== null &&
              r.Curr.X === e.Bot.X &&
              r.Curr.Y === e.Bot.Y &&
              a !== null &&
              r.OutIdx >= 0 &&
              r.Curr.Y === r.Top.Y &&
              i.ClipperBase.SlopesEqual5(
                e.Curr,
                e.Top,
                r.Curr,
                r.Top,
                this.m_UseFullRange
              ) &&
              e.WindDelta !== 0 &&
              r.WindDelta !== 0
            ) {
              var c = this.AddOutPt(ePrev2, e.Bot);
              this.AddJoin(a, c, e.Top);
            } else if (
              d !== null &&
              d.Curr.X === e.Bot.X &&
              d.Curr.Y === e.Bot.Y &&
              a !== null &&
              d.OutIdx >= 0 &&
              d.Curr.Y === d.Top.Y &&
              i.ClipperBase.SlopesEqual5(
                e.Curr,
                e.Top,
                d.Curr,
                d.Top,
                this.m_UseFullRange
              ) &&
              e.WindDelta !== 0 &&
              d.WindDelta !== 0
            ) {
              var c = this.AddOutPt(d, e.Bot);
              this.AddJoin(a, c, e.Top);
            }
          }
          e = e.NextInAEL;
        }
      }),
      (i.Clipper.prototype.DoMaxima = function (t) {
        var e = this.GetMaximaPairEx(t);
        if (e === null) {
          t.OutIdx >= 0 && this.AddOutPt(t, t.Top), this.DeleteFromAEL(t);
          return;
        }
        for (var s = t.NextInAEL; s !== null && s !== e; )
          this.IntersectEdges(t, s, t.Top),
            this.SwapPositionsInAEL(t, s),
            (s = t.NextInAEL);
        t.OutIdx === -1 && e.OutIdx === -1
          ? (this.DeleteFromAEL(t), this.DeleteFromAEL(e))
          : t.OutIdx >= 0 && e.OutIdx >= 0
          ? (t.OutIdx >= 0 && this.AddLocalMaxPoly(t, e, t.Top),
            this.DeleteFromAEL(t),
            this.DeleteFromAEL(e))
          : i.use_lines && t.WindDelta === 0
          ? (t.OutIdx >= 0 &&
              (this.AddOutPt(t, t.Top), (t.OutIdx = i.ClipperBase.Unassigned)),
            this.DeleteFromAEL(t),
            e.OutIdx >= 0 &&
              (this.AddOutPt(e, t.Top), (e.OutIdx = i.ClipperBase.Unassigned)),
            this.DeleteFromAEL(e))
          : i.Error("DoMaxima error");
      }),
      (i.Clipper.ReversePaths = function (t) {
        for (var e = 0, s = t.length; e < s; e++) t[e].reverse();
      }),
      (i.Clipper.Orientation = function (t) {
        return i.Clipper.Area(t) >= 0;
      }),
      (i.Clipper.prototype.PointCount = function (t) {
        if (t === null) return 0;
        var e = 0,
          s = t;
        do e++, (s = s.Next);
        while (s !== t);
        return e;
      }),
      (i.Clipper.prototype.BuildResult = function (t) {
        i.Clear(t);
        for (var e = 0, s = this.m_PolyOuts.length; e < s; e++) {
          var n = this.m_PolyOuts[e];
          if (n.Pts !== null) {
            var r = n.Pts.Prev,
              o = this.PointCount(r);
            if (!(o < 2)) {
              for (var a = new Array(o), c = 0; c < o; c++)
                (a[c] = r.Pt), (r = r.Prev);
              t.push(a);
            }
          }
        }
      }),
      (i.Clipper.prototype.BuildResult2 = function (t) {
        t.Clear();
        for (var e = 0, s = this.m_PolyOuts.length; e < s; e++) {
          var n = this.m_PolyOuts[e],
            r = this.PointCount(n.Pts);
          if (!((n.IsOpen && r < 2) || (!n.IsOpen && r < 3))) {
            this.FixHoleLinkage(n);
            var o = new i.PolyNode();
            t.m_AllPolys.push(o), (n.PolyNode = o), (o.m_polygon.length = r);
            for (var a = n.Pts.Prev, c = 0; c < r; c++)
              (o.m_polygon[c] = a.Pt), (a = a.Prev);
          }
        }
        for (var e = 0, s = this.m_PolyOuts.length; e < s; e++) {
          var n = this.m_PolyOuts[e];
          n.PolyNode !== null &&
            (n.IsOpen
              ? ((n.PolyNode.IsOpen = !0), t.AddChild(n.PolyNode))
              : n.FirstLeft !== null && n.FirstLeft.PolyNode !== null
              ? n.FirstLeft.PolyNode.AddChild(n.PolyNode)
              : t.AddChild(n.PolyNode));
        }
      }),
      (i.Clipper.prototype.FixupOutPolyline = function (t) {
        for (var e = t.Pts, s = e.Prev; e !== s; )
          if (((e = e.Next), i.IntPoint.op_Equality(e.Pt, e.Prev.Pt))) {
            e === s && (s = e.Prev);
            var n = e.Prev;
            (n.Next = e.Next), (e.Next.Prev = n), (e = n);
          }
        e === e.Prev && (t.Pts = null);
      }),
      (i.Clipper.prototype.FixupOutPolygon = function (t) {
        var e = null;
        t.BottomPt = null;
        for (
          var s = t.Pts, n = this.PreserveCollinear || this.StrictlySimple;
          ;

        ) {
          if (s.Prev === s || s.Prev === s.Next) {
            t.Pts = null;
            return;
          }
          if (
            i.IntPoint.op_Equality(s.Pt, s.Next.Pt) ||
            i.IntPoint.op_Equality(s.Pt, s.Prev.Pt) ||
            (i.ClipperBase.SlopesEqual4(
              s.Prev.Pt,
              s.Pt,
              s.Next.Pt,
              this.m_UseFullRange
            ) &&
              (!n || !this.Pt2IsBetweenPt1AndPt3(s.Prev.Pt, s.Pt, s.Next.Pt)))
          )
            (e = null),
              (s.Prev.Next = s.Next),
              (s.Next.Prev = s.Prev),
              (s = s.Prev);
          else {
            if (s === e) break;
            e === null && (e = s), (s = s.Next);
          }
        }
        t.Pts = s;
      }),
      (i.Clipper.prototype.DupOutPt = function (t, e) {
        var s = new i.OutPt();
        return (
          (s.Pt.X = t.Pt.X),
          (s.Pt.Y = t.Pt.Y),
          i.use_xyz && (s.Pt.Z = t.Pt.Z),
          (s.Idx = t.Idx),
          e
            ? ((s.Next = t.Next), (s.Prev = t), (t.Next.Prev = s), (t.Next = s))
            : ((s.Prev = t.Prev),
              (s.Next = t),
              (t.Prev.Next = s),
              (t.Prev = s)),
          s
        );
      }),
      (i.Clipper.prototype.GetOverlap = function (t, e, s, n, r) {
        return (
          t < e
            ? s < n
              ? ((r.Left = Math.max(t, s)), (r.Right = Math.min(e, n)))
              : ((r.Left = Math.max(t, n)), (r.Right = Math.min(e, s)))
            : s < n
            ? ((r.Left = Math.max(e, s)), (r.Right = Math.min(t, n)))
            : ((r.Left = Math.max(e, n)), (r.Right = Math.min(t, s))),
          r.Left < r.Right
        );
      }),
      (i.Clipper.prototype.JoinHorz = function (t, e, s, n, r, o) {
        var a =
            t.Pt.X > e.Pt.X
              ? i.Direction.dRightToLeft
              : i.Direction.dLeftToRight,
          c =
            s.Pt.X > n.Pt.X
              ? i.Direction.dRightToLeft
              : i.Direction.dLeftToRight;
        if (a === c) return !1;
        if (a === i.Direction.dLeftToRight) {
          for (
            ;
            t.Next.Pt.X <= r.X && t.Next.Pt.X >= t.Pt.X && t.Next.Pt.Y === r.Y;

          )
            t = t.Next;
          o && t.Pt.X !== r.X && (t = t.Next),
            (e = this.DupOutPt(t, !o)),
            i.IntPoint.op_Inequality(e.Pt, r) &&
              ((t = e),
              (t.Pt.X = r.X),
              (t.Pt.Y = r.Y),
              i.use_xyz && (t.Pt.Z = r.Z),
              (e = this.DupOutPt(t, !o)));
        } else {
          for (
            ;
            t.Next.Pt.X >= r.X && t.Next.Pt.X <= t.Pt.X && t.Next.Pt.Y === r.Y;

          )
            t = t.Next;
          !o && t.Pt.X !== r.X && (t = t.Next),
            (e = this.DupOutPt(t, o)),
            i.IntPoint.op_Inequality(e.Pt, r) &&
              ((t = e),
              (t.Pt.X = r.X),
              (t.Pt.Y = r.Y),
              i.use_xyz && (t.Pt.Z = r.Z),
              (e = this.DupOutPt(t, o)));
        }
        if (c === i.Direction.dLeftToRight) {
          for (
            ;
            s.Next.Pt.X <= r.X && s.Next.Pt.X >= s.Pt.X && s.Next.Pt.Y === r.Y;

          )
            s = s.Next;
          o && s.Pt.X !== r.X && (s = s.Next),
            (n = this.DupOutPt(s, !o)),
            i.IntPoint.op_Inequality(n.Pt, r) &&
              ((s = n),
              (s.Pt.X = r.X),
              (s.Pt.Y = r.Y),
              i.use_xyz && (s.Pt.Z = r.Z),
              (n = this.DupOutPt(s, !o)));
        } else {
          for (
            ;
            s.Next.Pt.X >= r.X && s.Next.Pt.X <= s.Pt.X && s.Next.Pt.Y === r.Y;

          )
            s = s.Next;
          !o && s.Pt.X !== r.X && (s = s.Next),
            (n = this.DupOutPt(s, o)),
            i.IntPoint.op_Inequality(n.Pt, r) &&
              ((s = n),
              (s.Pt.X = r.X),
              (s.Pt.Y = r.Y),
              i.use_xyz && (s.Pt.Z = r.Z),
              (n = this.DupOutPt(s, o)));
        }
        return (
          (a === i.Direction.dLeftToRight) === o
            ? ((t.Prev = s), (s.Next = t), (e.Next = n), (n.Prev = e))
            : ((t.Next = s), (s.Prev = t), (e.Prev = n), (n.Next = e)),
          !0
        );
      }),
      (i.Clipper.prototype.JoinPoints = function (t, e, s) {
        var n = t.OutPt1,
          r = new i.OutPt(),
          o = t.OutPt2,
          a = new i.OutPt(),
          c = t.OutPt1.Pt.Y === t.OffPt.Y;
        if (
          c &&
          i.IntPoint.op_Equality(t.OffPt, t.OutPt1.Pt) &&
          i.IntPoint.op_Equality(t.OffPt, t.OutPt2.Pt)
        ) {
          if (e !== s) return !1;
          for (
            r = t.OutPt1.Next;
            r !== n && i.IntPoint.op_Equality(r.Pt, t.OffPt);

          )
            r = r.Next;
          var d = r.Pt.Y > t.OffPt.Y;
          for (
            a = t.OutPt2.Next;
            a !== o && i.IntPoint.op_Equality(a.Pt, t.OffPt);

          )
            a = a.Next;
          var v = a.Pt.Y > t.OffPt.Y;
          return d === v
            ? !1
            : d
            ? ((r = this.DupOutPt(n, !1)),
              (a = this.DupOutPt(o, !0)),
              (n.Prev = o),
              (o.Next = n),
              (r.Next = a),
              (a.Prev = r),
              (t.OutPt1 = n),
              (t.OutPt2 = r),
              !0)
            : ((r = this.DupOutPt(n, !0)),
              (a = this.DupOutPt(o, !1)),
              (n.Next = o),
              (o.Prev = n),
              (r.Prev = a),
              (a.Next = r),
              (t.OutPt1 = n),
              (t.OutPt2 = r),
              !0);
        } else if (c) {
          for (r = n; n.Prev.Pt.Y === n.Pt.Y && n.Prev !== r && n.Prev !== o; )
            n = n.Prev;
          for (; r.Next.Pt.Y === r.Pt.Y && r.Next !== n && r.Next !== o; )
            r = r.Next;
          if (r.Next === n || r.Next === o) return !1;
          for (a = o; o.Prev.Pt.Y === o.Pt.Y && o.Prev !== a && o.Prev !== r; )
            o = o.Prev;
          for (; a.Next.Pt.Y === a.Pt.Y && a.Next !== o && a.Next !== n; )
            a = a.Next;
          if (a.Next === o || a.Next === n) return !1;
          var L = { Left: null, Right: null };
          if (!this.GetOverlap(n.Pt.X, r.Pt.X, o.Pt.X, a.Pt.X, L)) return !1;
          var x = L.Left,
            w = L.Right,
            b = new i.IntPoint0(),
            X;
          return (
            n.Pt.X >= x && n.Pt.X <= w
              ? ((b.X = n.Pt.X),
                (b.Y = n.Pt.Y),
                i.use_xyz && (b.Z = n.Pt.Z),
                (X = n.Pt.X > r.Pt.X))
              : o.Pt.X >= x && o.Pt.X <= w
              ? ((b.X = o.Pt.X),
                (b.Y = o.Pt.Y),
                i.use_xyz && (b.Z = o.Pt.Z),
                (X = o.Pt.X > a.Pt.X))
              : r.Pt.X >= x && r.Pt.X <= w
              ? ((b.X = r.Pt.X),
                (b.Y = r.Pt.Y),
                i.use_xyz && (b.Z = r.Pt.Z),
                (X = r.Pt.X > n.Pt.X))
              : ((b.X = a.Pt.X),
                (b.Y = a.Pt.Y),
                i.use_xyz && (b.Z = a.Pt.Z),
                (X = a.Pt.X > o.Pt.X)),
            (t.OutPt1 = n),
            (t.OutPt2 = o),
            this.JoinHorz(n, r, o, a, b, X)
          );
        } else {
          for (r = n.Next; i.IntPoint.op_Equality(r.Pt, n.Pt) && r !== n; )
            r = r.Next;
          var N =
            r.Pt.Y > n.Pt.Y ||
            !i.ClipperBase.SlopesEqual4(
              n.Pt,
              r.Pt,
              t.OffPt,
              this.m_UseFullRange
            );
          if (N) {
            for (r = n.Prev; i.IntPoint.op_Equality(r.Pt, n.Pt) && r !== n; )
              r = r.Prev;
            if (
              r.Pt.Y > n.Pt.Y ||
              !i.ClipperBase.SlopesEqual4(
                n.Pt,
                r.Pt,
                t.OffPt,
                this.m_UseFullRange
              )
            )
              return !1;
          }
          for (a = o.Next; i.IntPoint.op_Equality(a.Pt, o.Pt) && a !== o; )
            a = a.Next;
          var F =
            a.Pt.Y > o.Pt.Y ||
            !i.ClipperBase.SlopesEqual4(
              o.Pt,
              a.Pt,
              t.OffPt,
              this.m_UseFullRange
            );
          if (F) {
            for (a = o.Prev; i.IntPoint.op_Equality(a.Pt, o.Pt) && a !== o; )
              a = a.Prev;
            if (
              a.Pt.Y > o.Pt.Y ||
              !i.ClipperBase.SlopesEqual4(
                o.Pt,
                a.Pt,
                t.OffPt,
                this.m_UseFullRange
              )
            )
              return !1;
          }
          return r === n || a === o || r === a || (e === s && N === F)
            ? !1
            : N
            ? ((r = this.DupOutPt(n, !1)),
              (a = this.DupOutPt(o, !0)),
              (n.Prev = o),
              (o.Next = n),
              (r.Next = a),
              (a.Prev = r),
              (t.OutPt1 = n),
              (t.OutPt2 = r),
              !0)
            : ((r = this.DupOutPt(n, !0)),
              (a = this.DupOutPt(o, !1)),
              (n.Next = o),
              (o.Prev = n),
              (r.Prev = a),
              (a.Next = r),
              (t.OutPt1 = n),
              (t.OutPt2 = r),
              !0);
        }
      }),
      (i.Clipper.GetBounds = function (t) {
        for (var e = 0, s = t.length; e < s && t[e].length === 0; ) e++;
        if (e === s) return new i.IntRect(0, 0, 0, 0);
        var n = new i.IntRect();
        for (
          n.left = t[e][0].X,
            n.right = n.left,
            n.top = t[e][0].Y,
            n.bottom = n.top;
          e < s;
          e++
        )
          for (var r = 0, o = t[e].length; r < o; r++)
            t[e][r].X < n.left
              ? (n.left = t[e][r].X)
              : t[e][r].X > n.right && (n.right = t[e][r].X),
              t[e][r].Y < n.top
                ? (n.top = t[e][r].Y)
                : t[e][r].Y > n.bottom && (n.bottom = t[e][r].Y);
        return n;
      }),
      (i.Clipper.prototype.GetBounds2 = function (t) {
        var e = t,
          s = new i.IntRect();
        for (
          s.left = t.Pt.X,
            s.right = t.Pt.X,
            s.top = t.Pt.Y,
            s.bottom = t.Pt.Y,
            t = t.Next;
          t !== e;

        )
          t.Pt.X < s.left && (s.left = t.Pt.X),
            t.Pt.X > s.right && (s.right = t.Pt.X),
            t.Pt.Y < s.top && (s.top = t.Pt.Y),
            t.Pt.Y > s.bottom && (s.bottom = t.Pt.Y),
            (t = t.Next);
        return s;
      }),
      (i.Clipper.PointInPolygon = function (t, e) {
        var s = 0,
          n = e.length;
        if (n < 3) return 0;
        for (var r = e[0], o = 1; o <= n; ++o) {
          var a = o === n ? e[0] : e[o];
          if (
            a.Y === t.Y &&
            (a.X === t.X || (r.Y === t.Y && a.X > t.X == r.X < t.X))
          )
            return -1;
          if (r.Y < t.Y != a.Y < t.Y) {
            if (r.X >= t.X)
              if (a.X > t.X) s = 1 - s;
              else {
                var c = (r.X - t.X) * (a.Y - t.Y) - (a.X - t.X) * (r.Y - t.Y);
                if (c === 0) return -1;
                c > 0 == a.Y > r.Y && (s = 1 - s);
              }
            else if (a.X > t.X) {
              var c = (r.X - t.X) * (a.Y - t.Y) - (a.X - t.X) * (r.Y - t.Y);
              if (c === 0) return -1;
              c > 0 == a.Y > r.Y && (s = 1 - s);
            }
          }
          r = a;
        }
        return s;
      }),
      (i.Clipper.prototype.PointInPolygon = function (t, e) {
        var s = 0,
          n = e,
          r = t.X,
          o = t.Y,
          a = e.Pt.X,
          c = e.Pt.Y;
        do {
          e = e.Next;
          var d = e.Pt.X,
            v = e.Pt.Y;
          if (v === o && (d === r || (c === o && d > r == a < r))) return -1;
          if (c < o != v < o) {
            if (a >= r)
              if (d > r) s = 1 - s;
              else {
                var L = (a - r) * (v - o) - (d - r) * (c - o);
                if (L === 0) return -1;
                L > 0 == v > c && (s = 1 - s);
              }
            else if (d > r) {
              var L = (a - r) * (v - o) - (d - r) * (c - o);
              if (L === 0) return -1;
              L > 0 == v > c && (s = 1 - s);
            }
          }
          (a = d), (c = v);
        } while (n !== e);
        return s;
      }),
      (i.Clipper.prototype.Poly2ContainsPoly1 = function (t, e) {
        var s = t;
        do {
          var n = this.PointInPolygon(s.Pt, e);
          if (n >= 0) return n > 0;
          s = s.Next;
        } while (s !== t);
        return !0;
      }),
      (i.Clipper.prototype.FixupFirstLefts1 = function (t, e) {
        for (var s, n, r = 0, o = this.m_PolyOuts.length; r < o; r++)
          (s = this.m_PolyOuts[r]),
            (n = i.Clipper.ParseFirstLeft(s.FirstLeft)),
            s.Pts !== null &&
              n === t &&
              this.Poly2ContainsPoly1(s.Pts, e.Pts) &&
              (s.FirstLeft = e);
      }),
      (i.Clipper.prototype.FixupFirstLefts2 = function (t, e) {
        for (
          var s = e.FirstLeft, n, r, o = 0, a = this.m_PolyOuts.length;
          o < a;
          o++
        )
          (n = this.m_PolyOuts[o]),
            !(n.Pts === null || n === e || n === t) &&
              ((r = i.Clipper.ParseFirstLeft(n.FirstLeft)),
              !(r !== s && r !== t && r !== e) &&
                (this.Poly2ContainsPoly1(n.Pts, t.Pts)
                  ? (n.FirstLeft = t)
                  : this.Poly2ContainsPoly1(n.Pts, e.Pts)
                  ? (n.FirstLeft = e)
                  : (n.FirstLeft === t || n.FirstLeft === e) &&
                    (n.FirstLeft = s)));
      }),
      (i.Clipper.prototype.FixupFirstLefts3 = function (t, e) {
        for (var s, n, r = 0, o = this.m_PolyOuts.length; r < o; r++)
          (s = this.m_PolyOuts[r]),
            (n = i.Clipper.ParseFirstLeft(s.FirstLeft)),
            s.Pts !== null && n === t && (s.FirstLeft = e);
      }),
      (i.Clipper.ParseFirstLeft = function (t) {
        for (; t !== null && t.Pts === null; ) t = t.FirstLeft;
        return t;
      }),
      (i.Clipper.prototype.JoinCommonEdges = function () {
        for (var t = 0, e = this.m_Joins.length; t < e; t++) {
          var s = this.m_Joins[t],
            n = this.GetOutRec(s.OutPt1.Idx),
            r = this.GetOutRec(s.OutPt2.Idx);
          if (!(n.Pts === null || r.Pts === null) && !(n.IsOpen || r.IsOpen)) {
            var o;
            n === r
              ? (o = n)
              : this.OutRec1RightOfOutRec2(n, r)
              ? (o = r)
              : this.OutRec1RightOfOutRec2(r, n)
              ? (o = n)
              : (o = this.GetLowermostRec(n, r)),
              this.JoinPoints(s, n, r) &&
                (n === r
                  ? ((n.Pts = s.OutPt1),
                    (n.BottomPt = null),
                    (r = this.CreateOutRec()),
                    (r.Pts = s.OutPt2),
                    this.UpdateOutPtIdxs(r),
                    this.Poly2ContainsPoly1(r.Pts, n.Pts)
                      ? ((r.IsHole = !n.IsHole),
                        (r.FirstLeft = n),
                        this.m_UsingPolyTree && this.FixupFirstLefts2(r, n),
                        (r.IsHole ^ this.ReverseSolution) ==
                          this.Area$1(r) > 0 && this.ReversePolyPtLinks(r.Pts))
                      : this.Poly2ContainsPoly1(n.Pts, r.Pts)
                      ? ((r.IsHole = n.IsHole),
                        (n.IsHole = !r.IsHole),
                        (r.FirstLeft = n.FirstLeft),
                        (n.FirstLeft = r),
                        this.m_UsingPolyTree && this.FixupFirstLefts2(n, r),
                        (n.IsHole ^ this.ReverseSolution) ==
                          this.Area$1(n) > 0 && this.ReversePolyPtLinks(n.Pts))
                      : ((r.IsHole = n.IsHole),
                        (r.FirstLeft = n.FirstLeft),
                        this.m_UsingPolyTree && this.FixupFirstLefts1(n, r)))
                  : ((r.Pts = null),
                    (r.BottomPt = null),
                    (r.Idx = n.Idx),
                    (n.IsHole = o.IsHole),
                    o === r && (n.FirstLeft = r.FirstLeft),
                    (r.FirstLeft = n),
                    this.m_UsingPolyTree && this.FixupFirstLefts3(r, n)));
          }
        }
      }),
      (i.Clipper.prototype.UpdateOutPtIdxs = function (t) {
        var e = t.Pts;
        do (e.Idx = t.Idx), (e = e.Prev);
        while (e !== t.Pts);
      }),
      (i.Clipper.prototype.DoSimplePolygons = function () {
        for (var t = 0; t < this.m_PolyOuts.length; ) {
          var e = this.m_PolyOuts[t++],
            s = e.Pts;
          if (!(s === null || e.IsOpen))
            do {
              for (var n = s.Next; n !== e.Pts; ) {
                if (
                  i.IntPoint.op_Equality(s.Pt, n.Pt) &&
                  n.Next !== s &&
                  n.Prev !== s
                ) {
                  var r = s.Prev,
                    o = n.Prev;
                  (s.Prev = o),
                    (o.Next = s),
                    (n.Prev = r),
                    (r.Next = n),
                    (e.Pts = s);
                  var a = this.CreateOutRec();
                  (a.Pts = n),
                    this.UpdateOutPtIdxs(a),
                    this.Poly2ContainsPoly1(a.Pts, e.Pts)
                      ? ((a.IsHole = !e.IsHole),
                        (a.FirstLeft = e),
                        this.m_UsingPolyTree && this.FixupFirstLefts2(a, e))
                      : this.Poly2ContainsPoly1(e.Pts, a.Pts)
                      ? ((a.IsHole = e.IsHole),
                        (e.IsHole = !a.IsHole),
                        (a.FirstLeft = e.FirstLeft),
                        (e.FirstLeft = a),
                        this.m_UsingPolyTree && this.FixupFirstLefts2(e, a))
                      : ((a.IsHole = e.IsHole),
                        (a.FirstLeft = e.FirstLeft),
                        this.m_UsingPolyTree && this.FixupFirstLefts1(e, a)),
                    (n = s);
                }
                n = n.Next;
              }
              s = s.Next;
            } while (s !== e.Pts);
        }
      }),
      (i.Clipper.Area = function (t) {
        if (!Array.isArray(t)) return 0;
        var e = t.length;
        if (e < 3) return 0;
        for (var s = 0, n = 0, r = e - 1; n < e; ++n)
          (s += (t[r].X + t[n].X) * (t[r].Y - t[n].Y)), (r = n);
        return -s * 0.5;
      }),
      (i.Clipper.prototype.Area = function (t) {
        var e = t;
        if (t === null) return 0;
        var s = 0;
        do
          (s = s + (t.Prev.Pt.X + t.Pt.X) * (t.Prev.Pt.Y - t.Pt.Y)),
            (t = t.Next);
        while (t !== e);
        return s * 0.5;
      }),
      (i.Clipper.prototype.Area$1 = function (t) {
        return this.Area(t.Pts);
      }),
      (i.Clipper.SimplifyPolygon = function (t, e) {
        var s = new Array(),
          n = new i.Clipper(0);
        return (
          (n.StrictlySimple = !0),
          n.AddPath(t, i.PolyType.ptSubject, !0),
          n.Execute(i.ClipType.ctUnion, s, e, e),
          s
        );
      }),
      (i.Clipper.SimplifyPolygons = function (t, e) {
        typeof e > "u" && (e = i.PolyFillType.pftEvenOdd);
        var s = new Array(),
          n = new i.Clipper(0);
        return (
          (n.StrictlySimple = !0),
          n.AddPaths(t, i.PolyType.ptSubject, !0),
          n.Execute(i.ClipType.ctUnion, s, e, e),
          s
        );
      }),
      (i.Clipper.DistanceSqrd = function (t, e) {
        var s = t.X - e.X,
          n = t.Y - e.Y;
        return s * s + n * n;
      }),
      (i.Clipper.DistanceFromLineSqrd = function (t, e, s) {
        var n = e.Y - s.Y,
          r = s.X - e.X,
          o = n * e.X + r * e.Y;
        return (o = n * t.X + r * t.Y - o), (o * o) / (n * n + r * r);
      }),
      (i.Clipper.SlopesNearCollinear = function (t, e, s, n) {
        return Math.abs(t.X - e.X) > Math.abs(t.Y - e.Y)
          ? t.X > e.X == t.X < s.X
            ? i.Clipper.DistanceFromLineSqrd(t, e, s) < n
            : e.X > t.X == e.X < s.X
            ? i.Clipper.DistanceFromLineSqrd(e, t, s) < n
            : i.Clipper.DistanceFromLineSqrd(s, t, e) < n
          : t.Y > e.Y == t.Y < s.Y
          ? i.Clipper.DistanceFromLineSqrd(t, e, s) < n
          : e.Y > t.Y == e.Y < s.Y
          ? i.Clipper.DistanceFromLineSqrd(e, t, s) < n
          : i.Clipper.DistanceFromLineSqrd(s, t, e) < n;
      }),
      (i.Clipper.PointsAreClose = function (t, e, s) {
        var n = t.X - e.X,
          r = t.Y - e.Y;
        return n * n + r * r <= s;
      }),
      (i.Clipper.ExcludeOp = function (t) {
        var e = t.Prev;
        return (e.Next = t.Next), (t.Next.Prev = e), (e.Idx = 0), e;
      }),
      (i.Clipper.CleanPolygon = function (t, e) {
        typeof e > "u" && (e = 1.415);
        var s = t.length;
        if (s === 0) return new Array();
        for (var n = new Array(s), r = 0; r < s; ++r) n[r] = new i.OutPt();
        for (var r = 0; r < s; ++r)
          (n[r].Pt = t[r]),
            (n[r].Next = n[(r + 1) % s]),
            (n[r].Next.Prev = n[r]),
            (n[r].Idx = 0);
        for (var o = e * e, a = n[0]; a.Idx === 0 && a.Next !== a.Prev; )
          i.Clipper.PointsAreClose(a.Pt, a.Prev.Pt, o)
            ? ((a = i.Clipper.ExcludeOp(a)), s--)
            : i.Clipper.PointsAreClose(a.Prev.Pt, a.Next.Pt, o)
            ? (i.Clipper.ExcludeOp(a.Next),
              (a = i.Clipper.ExcludeOp(a)),
              (s -= 2))
            : i.Clipper.SlopesNearCollinear(a.Prev.Pt, a.Pt, a.Next.Pt, o)
            ? ((a = i.Clipper.ExcludeOp(a)), s--)
            : ((a.Idx = 1), (a = a.Next));
        s < 3 && (s = 0);
        for (var c = new Array(s), r = 0; r < s; ++r)
          (c[r] = new i.IntPoint1(a.Pt)), (a = a.Next);
        return (n = null), c;
      }),
      (i.Clipper.CleanPolygons = function (t, e) {
        for (var s = new Array(t.length), n = 0, r = t.length; n < r; n++)
          s[n] = i.Clipper.CleanPolygon(t[n], e);
        return s;
      }),
      (i.Clipper.Minkowski = function (t, e, s, n) {
        var r = n ? 1 : 0,
          o = t.length,
          a = e.length,
          c = new Array();
        if (s)
          for (var d = 0; d < a; d++) {
            for (
              var v = new Array(o), L = 0, x = t.length, w = t[L];
              L < x;
              L++, w = t[L]
            )
              v[L] = new i.IntPoint2(e[d].X + w.X, e[d].Y + w.Y);
            c.push(v);
          }
        else
          for (var d = 0; d < a; d++) {
            for (
              var v = new Array(o), L = 0, x = t.length, w = t[L];
              L < x;
              L++, w = t[L]
            )
              v[L] = new i.IntPoint2(e[d].X - w.X, e[d].Y - w.Y);
            c.push(v);
          }
        for (var b = new Array(), d = 0; d < a - 1 + r; d++)
          for (var L = 0; L < o; L++) {
            var X = new Array();
            X.push(c[d % a][L % o]),
              X.push(c[(d + 1) % a][L % o]),
              X.push(c[(d + 1) % a][(L + 1) % o]),
              X.push(c[d % a][(L + 1) % o]),
              i.Clipper.Orientation(X) || X.reverse(),
              b.push(X);
          }
        return b;
      }),
      (i.Clipper.MinkowskiSum = function (t, e, s) {
        if (e[0] instanceof Array) {
          for (
            var r = e, a = new i.Paths(), o = new i.Clipper(), c = 0;
            c < r.length;
            ++c
          ) {
            var d = i.Clipper.Minkowski(t, r[c], !0, s);
            if ((o.AddPaths(d, i.PolyType.ptSubject, !0), s)) {
              var n = i.Clipper.TranslatePath(r[c], t[0]);
              o.AddPath(n, i.PolyType.ptClip, !0);
            }
          }
          return (
            o.Execute(
              i.ClipType.ctUnion,
              a,
              i.PolyFillType.pftNonZero,
              i.PolyFillType.pftNonZero
            ),
            a
          );
        } else {
          var n = e,
            r = i.Clipper.Minkowski(t, n, !0, s),
            o = new i.Clipper();
          return (
            o.AddPaths(r, i.PolyType.ptSubject, !0),
            o.Execute(
              i.ClipType.ctUnion,
              r,
              i.PolyFillType.pftNonZero,
              i.PolyFillType.pftNonZero
            ),
            r
          );
        }
      }),
      (i.Clipper.TranslatePath = function (t, e) {
        for (var s = new i.Path(), n = 0; n < t.length; n++)
          s.push(new i.IntPoint2(t[n].X + e.X, t[n].Y + e.Y));
        return s;
      }),
      (i.Clipper.MinkowskiDiff = function (t, e) {
        var s = i.Clipper.Minkowski(t, e, !1, !0),
          n = new i.Clipper();
        return (
          n.AddPaths(s, i.PolyType.ptSubject, !0),
          n.Execute(
            i.ClipType.ctUnion,
            s,
            i.PolyFillType.pftNonZero,
            i.PolyFillType.pftNonZero
          ),
          s
        );
      }),
      (i.Clipper.PolyTreeToPaths = function (t) {
        var e = new Array();
        return i.Clipper.AddPolyNodeToPaths(t, i.Clipper.NodeType.ntAny, e), e;
      }),
      (i.Clipper.AddPolyNodeToPaths = function (t, e, s) {
        var n = !0;
        switch (e) {
          case i.Clipper.NodeType.ntOpen:
            return;
          case i.Clipper.NodeType.ntClosed:
            n = !t.IsOpen;
            break;
        }
        t.m_polygon.length > 0 && n && s.push(t.m_polygon);
        for (
          var r = 0, o = t.Childs(), a = o.length, c = o[r];
          r < a;
          r++, c = o[r]
        )
          i.Clipper.AddPolyNodeToPaths(c, e, s);
      }),
      (i.Clipper.OpenPathsFromPolyTree = function (t) {
        for (var e = new i.Paths(), s = 0, n = t.ChildCount(); s < n; s++)
          t.Childs()[s].IsOpen && e.push(t.Childs()[s].m_polygon);
        return e;
      }),
      (i.Clipper.ClosedPathsFromPolyTree = function (t) {
        var e = new i.Paths();
        return (
          i.Clipper.AddPolyNodeToPaths(t, i.Clipper.NodeType.ntClosed, e), e
        );
      }),
      Mt(i.Clipper, i.ClipperBase),
      (i.Clipper.NodeType = { ntAny: 0, ntOpen: 1, ntClosed: 2 }),
      (i.ClipperOffset = function (t, e) {
        typeof t > "u" && (t = 2),
          typeof e > "u" && (e = i.ClipperOffset.def_arc_tolerance),
          (this.m_destPolys = new i.Paths()),
          (this.m_srcPoly = new i.Path()),
          (this.m_destPoly = new i.Path()),
          (this.m_normals = new Array()),
          (this.m_delta = 0),
          (this.m_sinA = 0),
          (this.m_sin = 0),
          (this.m_cos = 0),
          (this.m_miterLim = 0),
          (this.m_StepsPerRad = 0),
          (this.m_lowest = new i.IntPoint0()),
          (this.m_polyNodes = new i.PolyNode()),
          (this.MiterLimit = t),
          (this.ArcTolerance = e),
          (this.m_lowest.X = -1);
      }),
      (i.ClipperOffset.two_pi = 6.28318530717959),
      (i.ClipperOffset.def_arc_tolerance = 0.25),
      (i.ClipperOffset.prototype.Clear = function () {
        i.Clear(this.m_polyNodes.Childs()), (this.m_lowest.X = -1);
      }),
      (i.ClipperOffset.Round = i.Clipper.Round),
      (i.ClipperOffset.prototype.AddPath = function (t, e, s) {
        var n = t.length - 1;
        if (!(n < 0)) {
          var r = new i.PolyNode();
          if (
            ((r.m_jointype = e),
            (r.m_endtype = s),
            s === i.EndType.etClosedLine || s === i.EndType.etClosedPolygon)
          )
            for (; n > 0 && i.IntPoint.op_Equality(t[0], t[n]); ) n--;
          r.m_polygon.push(t[0]);
          for (var o = 0, a = 0, c = 1; c <= n; c++)
            i.IntPoint.op_Inequality(r.m_polygon[o], t[c]) &&
              (o++,
              r.m_polygon.push(t[c]),
              (t[c].Y > r.m_polygon[a].Y ||
                (t[c].Y === r.m_polygon[a].Y && t[c].X < r.m_polygon[a].X)) &&
                (a = o));
          if (
            !(s === i.EndType.etClosedPolygon && o < 2) &&
            (this.m_polyNodes.AddChild(r), s === i.EndType.etClosedPolygon)
          )
            if (this.m_lowest.X < 0)
              this.m_lowest = new i.IntPoint2(
                this.m_polyNodes.ChildCount() - 1,
                a
              );
            else {
              var d =
                this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[
                  this.m_lowest.Y
                ];
              (r.m_polygon[a].Y > d.Y ||
                (r.m_polygon[a].Y === d.Y && r.m_polygon[a].X < d.X)) &&
                (this.m_lowest = new i.IntPoint2(
                  this.m_polyNodes.ChildCount() - 1,
                  a
                ));
            }
        }
      }),
      (i.ClipperOffset.prototype.AddPaths = function (t, e, s) {
        for (var n = 0, r = t.length; n < r; n++) this.AddPath(t[n], e, s);
      }),
      (i.ClipperOffset.prototype.FixOrientations = function () {
        if (
          this.m_lowest.X >= 0 &&
          !i.Clipper.Orientation(
            this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon
          )
        )
          for (var t = 0; t < this.m_polyNodes.ChildCount(); t++) {
            var e = this.m_polyNodes.Childs()[t];
            (e.m_endtype === i.EndType.etClosedPolygon ||
              (e.m_endtype === i.EndType.etClosedLine &&
                i.Clipper.Orientation(e.m_polygon))) &&
              e.m_polygon.reverse();
          }
        else
          for (var t = 0; t < this.m_polyNodes.ChildCount(); t++) {
            var e = this.m_polyNodes.Childs()[t];
            e.m_endtype === i.EndType.etClosedLine &&
              !i.Clipper.Orientation(e.m_polygon) &&
              e.m_polygon.reverse();
          }
      }),
      (i.ClipperOffset.GetUnitNormal = function (t, e) {
        var s = e.X - t.X,
          n = e.Y - t.Y;
        if (s === 0 && n === 0) return new i.DoublePoint2(0, 0);
        var r = 1 / Math.sqrt(s * s + n * n);
        return (s *= r), (n *= r), new i.DoublePoint2(n, -s);
      }),
      (i.ClipperOffset.prototype.DoOffset = function (t) {
        if (
          ((this.m_destPolys = new Array()),
          (this.m_delta = t),
          i.ClipperBase.near_zero(t))
        ) {
          for (var e = 0; e < this.m_polyNodes.ChildCount(); e++) {
            var s = this.m_polyNodes.Childs()[e];
            s.m_endtype === i.EndType.etClosedPolygon &&
              this.m_destPolys.push(s.m_polygon);
          }
          return;
        }
        this.MiterLimit > 2
          ? (this.m_miterLim = 2 / (this.MiterLimit * this.MiterLimit))
          : (this.m_miterLim = 0.5);
        var n;
        this.ArcTolerance <= 0
          ? (n = i.ClipperOffset.def_arc_tolerance)
          : this.ArcTolerance > Math.abs(t) * i.ClipperOffset.def_arc_tolerance
          ? (n = Math.abs(t) * i.ClipperOffset.def_arc_tolerance)
          : (n = this.ArcTolerance);
        var r = 3.14159265358979 / Math.acos(1 - n / Math.abs(t));
        (this.m_sin = Math.sin(i.ClipperOffset.two_pi / r)),
          (this.m_cos = Math.cos(i.ClipperOffset.two_pi / r)),
          (this.m_StepsPerRad = r / i.ClipperOffset.two_pi),
          t < 0 && (this.m_sin = -this.m_sin);
        for (var e = 0; e < this.m_polyNodes.ChildCount(); e++) {
          var s = this.m_polyNodes.Childs()[e];
          this.m_srcPoly = s.m_polygon;
          var o = this.m_srcPoly.length;
          if (
            !(
              o === 0 ||
              (t <= 0 && (o < 3 || s.m_endtype !== i.EndType.etClosedPolygon))
            )
          ) {
            if (((this.m_destPoly = new Array()), o === 1)) {
              if (s.m_jointype === i.JoinType.jtRound)
                for (var a = 1, c = 0, d = 1; d <= r; d++) {
                  this.m_destPoly.push(
                    new i.IntPoint2(
                      i.ClipperOffset.Round(this.m_srcPoly[0].X + a * t),
                      i.ClipperOffset.Round(this.m_srcPoly[0].Y + c * t)
                    )
                  );
                  var v = a;
                  (a = a * this.m_cos - this.m_sin * c),
                    (c = v * this.m_sin + c * this.m_cos);
                }
              else
                for (var a = -1, c = -1, d = 0; d < 4; ++d)
                  this.m_destPoly.push(
                    new i.IntPoint2(
                      i.ClipperOffset.Round(this.m_srcPoly[0].X + a * t),
                      i.ClipperOffset.Round(this.m_srcPoly[0].Y + c * t)
                    )
                  ),
                    a < 0 ? (a = 1) : c < 0 ? (c = 1) : (a = -1);
              this.m_destPolys.push(this.m_destPoly);
              continue;
            }
            this.m_normals.length = 0;
            for (var d = 0; d < o - 1; d++)
              this.m_normals.push(
                i.ClipperOffset.GetUnitNormal(
                  this.m_srcPoly[d],
                  this.m_srcPoly[d + 1]
                )
              );
            if (
              (s.m_endtype === i.EndType.etClosedLine ||
              s.m_endtype === i.EndType.etClosedPolygon
                ? this.m_normals.push(
                    i.ClipperOffset.GetUnitNormal(
                      this.m_srcPoly[o - 1],
                      this.m_srcPoly[0]
                    )
                  )
                : this.m_normals.push(
                    new i.DoublePoint1(this.m_normals[o - 2])
                  ),
              s.m_endtype === i.EndType.etClosedPolygon)
            ) {
              for (var L = o - 1, d = 0; d < o; d++)
                L = this.OffsetPoint(d, L, s.m_jointype);
              this.m_destPolys.push(this.m_destPoly);
            } else if (s.m_endtype === i.EndType.etClosedLine) {
              for (var L = o - 1, d = 0; d < o; d++)
                L = this.OffsetPoint(d, L, s.m_jointype);
              this.m_destPolys.push(this.m_destPoly),
                (this.m_destPoly = new Array());
              for (var x = this.m_normals[o - 1], d = o - 1; d > 0; d--)
                this.m_normals[d] = new i.DoublePoint2(
                  -this.m_normals[d - 1].X,
                  -this.m_normals[d - 1].Y
                );
              (this.m_normals[0] = new i.DoublePoint2(-x.X, -x.Y)), (L = 0);
              for (var d = o - 1; d >= 0; d--)
                L = this.OffsetPoint(d, L, s.m_jointype);
              this.m_destPolys.push(this.m_destPoly);
            } else {
              for (var L = 0, d = 1; d < o - 1; ++d)
                L = this.OffsetPoint(d, L, s.m_jointype);
              var w;
              if (s.m_endtype === i.EndType.etOpenButt) {
                var d = o - 1;
                (w = new i.IntPoint2(
                  i.ClipperOffset.Round(
                    this.m_srcPoly[d].X + this.m_normals[d].X * t
                  ),
                  i.ClipperOffset.Round(
                    this.m_srcPoly[d].Y + this.m_normals[d].Y * t
                  )
                )),
                  this.m_destPoly.push(w),
                  (w = new i.IntPoint2(
                    i.ClipperOffset.Round(
                      this.m_srcPoly[d].X - this.m_normals[d].X * t
                    ),
                    i.ClipperOffset.Round(
                      this.m_srcPoly[d].Y - this.m_normals[d].Y * t
                    )
                  )),
                  this.m_destPoly.push(w);
              } else {
                var d = o - 1;
                (L = o - 2),
                  (this.m_sinA = 0),
                  (this.m_normals[d] = new i.DoublePoint2(
                    -this.m_normals[d].X,
                    -this.m_normals[d].Y
                  )),
                  s.m_endtype === i.EndType.etOpenSquare
                    ? this.DoSquare(d, L)
                    : this.DoRound(d, L);
              }
              for (var d = o - 1; d > 0; d--)
                this.m_normals[d] = new i.DoublePoint2(
                  -this.m_normals[d - 1].X,
                  -this.m_normals[d - 1].Y
                );
              (this.m_normals[0] = new i.DoublePoint2(
                -this.m_normals[1].X,
                -this.m_normals[1].Y
              )),
                (L = o - 1);
              for (var d = L - 1; d > 0; --d)
                L = this.OffsetPoint(d, L, s.m_jointype);
              s.m_endtype === i.EndType.etOpenButt
                ? ((w = new i.IntPoint2(
                    i.ClipperOffset.Round(
                      this.m_srcPoly[0].X - this.m_normals[0].X * t
                    ),
                    i.ClipperOffset.Round(
                      this.m_srcPoly[0].Y - this.m_normals[0].Y * t
                    )
                  )),
                  this.m_destPoly.push(w),
                  (w = new i.IntPoint2(
                    i.ClipperOffset.Round(
                      this.m_srcPoly[0].X + this.m_normals[0].X * t
                    ),
                    i.ClipperOffset.Round(
                      this.m_srcPoly[0].Y + this.m_normals[0].Y * t
                    )
                  )),
                  this.m_destPoly.push(w))
                : ((L = 1),
                  (this.m_sinA = 0),
                  s.m_endtype === i.EndType.etOpenSquare
                    ? this.DoSquare(0, 1)
                    : this.DoRound(0, 1)),
                this.m_destPolys.push(this.m_destPoly);
            }
          }
        }
      }),
      (i.ClipperOffset.prototype.Execute = function () {
        var t = arguments,
          e = t[0] instanceof i.PolyTree;
        if (e) {
          var s = t[0],
            n = t[1];
          s.Clear(), this.FixOrientations(), this.DoOffset(n);
          var r = new i.Clipper(0);
          if ((r.AddPaths(this.m_destPolys, i.PolyType.ptSubject, !0), n > 0))
            r.Execute(
              i.ClipType.ctUnion,
              s,
              i.PolyFillType.pftPositive,
              i.PolyFillType.pftPositive
            );
          else {
            var o = i.Clipper.GetBounds(this.m_destPolys),
              a = new i.Path();
            if (
              (a.push(new i.IntPoint2(o.left - 10, o.bottom + 10)),
              a.push(new i.IntPoint2(o.right + 10, o.bottom + 10)),
              a.push(new i.IntPoint2(o.right + 10, o.top - 10)),
              a.push(new i.IntPoint2(o.left - 10, o.top - 10)),
              r.AddPath(a, i.PolyType.ptSubject, !0),
              (r.ReverseSolution = !0),
              r.Execute(
                i.ClipType.ctUnion,
                s,
                i.PolyFillType.pftNegative,
                i.PolyFillType.pftNegative
              ),
              s.ChildCount() === 1 && s.Childs()[0].ChildCount() > 0)
            ) {
              var c = s.Childs()[0];
              (s.Childs()[0] = c.Childs()[0]), (s.Childs()[0].m_Parent = s);
              for (var d = 1; d < c.ChildCount(); d++)
                s.AddChild(c.Childs()[d]);
            } else s.Clear();
          }
        } else {
          var s = t[0],
            n = t[1];
          i.Clear(s), this.FixOrientations(), this.DoOffset(n);
          var r = new i.Clipper(0);
          if ((r.AddPaths(this.m_destPolys, i.PolyType.ptSubject, !0), n > 0))
            r.Execute(
              i.ClipType.ctUnion,
              s,
              i.PolyFillType.pftPositive,
              i.PolyFillType.pftPositive
            );
          else {
            var o = i.Clipper.GetBounds(this.m_destPolys),
              a = new i.Path();
            a.push(new i.IntPoint2(o.left - 10, o.bottom + 10)),
              a.push(new i.IntPoint2(o.right + 10, o.bottom + 10)),
              a.push(new i.IntPoint2(o.right + 10, o.top - 10)),
              a.push(new i.IntPoint2(o.left - 10, o.top - 10)),
              r.AddPath(a, i.PolyType.ptSubject, !0),
              (r.ReverseSolution = !0),
              r.Execute(
                i.ClipType.ctUnion,
                s,
                i.PolyFillType.pftNegative,
                i.PolyFillType.pftNegative
              ),
              s.length > 0 && s.splice(0, 1);
          }
        }
      }),
      (i.ClipperOffset.prototype.OffsetPoint = function (t, e, s) {
        if (
          ((this.m_sinA =
            this.m_normals[e].X * this.m_normals[t].Y -
            this.m_normals[t].X * this.m_normals[e].Y),
          Math.abs(this.m_sinA * this.m_delta) < 1)
        ) {
          var n =
            this.m_normals[e].X * this.m_normals[t].X +
            this.m_normals[t].Y * this.m_normals[e].Y;
          if (n > 0)
            return (
              this.m_destPoly.push(
                new i.IntPoint2(
                  i.ClipperOffset.Round(
                    this.m_srcPoly[t].X + this.m_normals[e].X * this.m_delta
                  ),
                  i.ClipperOffset.Round(
                    this.m_srcPoly[t].Y + this.m_normals[e].Y * this.m_delta
                  )
                )
              ),
              e
            );
        } else
          this.m_sinA > 1
            ? (this.m_sinA = 1)
            : this.m_sinA < -1 && (this.m_sinA = -1);
        if (this.m_sinA * this.m_delta < 0)
          this.m_destPoly.push(
            new i.IntPoint2(
              i.ClipperOffset.Round(
                this.m_srcPoly[t].X + this.m_normals[e].X * this.m_delta
              ),
              i.ClipperOffset.Round(
                this.m_srcPoly[t].Y + this.m_normals[e].Y * this.m_delta
              )
            )
          ),
            this.m_destPoly.push(new i.IntPoint1(this.m_srcPoly[t])),
            this.m_destPoly.push(
              new i.IntPoint2(
                i.ClipperOffset.Round(
                  this.m_srcPoly[t].X + this.m_normals[t].X * this.m_delta
                ),
                i.ClipperOffset.Round(
                  this.m_srcPoly[t].Y + this.m_normals[t].Y * this.m_delta
                )
              )
            );
        else
          switch (s) {
            case i.JoinType.jtMiter: {
              var r =
                1 +
                (this.m_normals[t].X * this.m_normals[e].X +
                  this.m_normals[t].Y * this.m_normals[e].Y);
              r >= this.m_miterLim
                ? this.DoMiter(t, e, r)
                : this.DoSquare(t, e);
              break;
            }
            case i.JoinType.jtSquare:
              this.DoSquare(t, e);
              break;
            case i.JoinType.jtRound:
              this.DoRound(t, e);
              break;
          }
        return (e = t), e;
      }),
      (i.ClipperOffset.prototype.DoSquare = function (t, e) {
        var s = Math.tan(
          Math.atan2(
            this.m_sinA,
            this.m_normals[e].X * this.m_normals[t].X +
              this.m_normals[e].Y * this.m_normals[t].Y
          ) / 4
        );
        this.m_destPoly.push(
          new i.IntPoint2(
            i.ClipperOffset.Round(
              this.m_srcPoly[t].X +
                this.m_delta * (this.m_normals[e].X - this.m_normals[e].Y * s)
            ),
            i.ClipperOffset.Round(
              this.m_srcPoly[t].Y +
                this.m_delta * (this.m_normals[e].Y + this.m_normals[e].X * s)
            )
          )
        ),
          this.m_destPoly.push(
            new i.IntPoint2(
              i.ClipperOffset.Round(
                this.m_srcPoly[t].X +
                  this.m_delta * (this.m_normals[t].X + this.m_normals[t].Y * s)
              ),
              i.ClipperOffset.Round(
                this.m_srcPoly[t].Y +
                  this.m_delta * (this.m_normals[t].Y - this.m_normals[t].X * s)
              )
            )
          );
      }),
      (i.ClipperOffset.prototype.DoMiter = function (t, e, s) {
        var n = this.m_delta / s;
        this.m_destPoly.push(
          new i.IntPoint2(
            i.ClipperOffset.Round(
              this.m_srcPoly[t].X +
                (this.m_normals[e].X + this.m_normals[t].X) * n
            ),
            i.ClipperOffset.Round(
              this.m_srcPoly[t].Y +
                (this.m_normals[e].Y + this.m_normals[t].Y) * n
            )
          )
        );
      }),
      (i.ClipperOffset.prototype.DoRound = function (t, e) {
        for (
          var s = Math.atan2(
              this.m_sinA,
              this.m_normals[e].X * this.m_normals[t].X +
                this.m_normals[e].Y * this.m_normals[t].Y
            ),
            n = Math.max(
              i.Cast_Int32(
                i.ClipperOffset.Round(this.m_StepsPerRad * Math.abs(s))
              ),
              1
            ),
            r = this.m_normals[e].X,
            o = this.m_normals[e].Y,
            a,
            c = 0;
          c < n;
          ++c
        )
          this.m_destPoly.push(
            new i.IntPoint2(
              i.ClipperOffset.Round(this.m_srcPoly[t].X + r * this.m_delta),
              i.ClipperOffset.Round(this.m_srcPoly[t].Y + o * this.m_delta)
            )
          ),
            (a = r),
            (r = r * this.m_cos - this.m_sin * o),
            (o = a * this.m_sin + o * this.m_cos);
        this.m_destPoly.push(
          new i.IntPoint2(
            i.ClipperOffset.Round(
              this.m_srcPoly[t].X + this.m_normals[t].X * this.m_delta
            ),
            i.ClipperOffset.Round(
              this.m_srcPoly[t].Y + this.m_normals[t].Y * this.m_delta
            )
          )
        );
      }),
      (i.Error = function (t) {
        try {
          throw new Error(t);
        } catch (e) {
          alert(e.message);
        }
      }),
      (i.JS = {}),
      (i.JS.AreaOfPolygon = function (t, e) {
        return e || (e = 1), i.Clipper.Area(t) / (e * e);
      }),
      (i.JS.AreaOfPolygons = function (t, e) {
        e || (e = 1);
        for (var s = 0, n = 0; n < t.length; n++) s += i.Clipper.Area(t[n]);
        return s / (e * e);
      }),
      (i.JS.BoundsOfPath = function (t, e) {
        return i.JS.BoundsOfPaths([t], e);
      }),
      (i.JS.BoundsOfPaths = function (t, e) {
        e || (e = 1);
        var s = i.Clipper.GetBounds(t);
        return (s.left /= e), (s.bottom /= e), (s.right /= e), (s.top /= e), s;
      }),
      (i.JS.Clean = function (n, e) {
        if (!(n instanceof Array)) return [];
        var s = n[0] instanceof Array,
          n = i.JS.Clone(n);
        if (typeof e != "number" || e === null)
          return i.Error("Delta is not a number in Clean()."), n;
        if (n.length === 0 || (n.length === 1 && n[0].length === 0) || e < 0)
          return n;
        s || (n = [n]);
        for (var r = n.length, o, a, c, d, v, L, x, w = [], b = 0; b < r; b++)
          if (((a = n[b]), (o = a.length), o !== 0)) {
            if (o < 3) {
              (c = a), w.push(c);
              continue;
            }
            for (c = a, d = e * e, v = a[0], L = 1, x = 1; x < o; x++)
              (a[x].X - v.X) * (a[x].X - v.X) +
                (a[x].Y - v.Y) * (a[x].Y - v.Y) <=
                d || ((c[L] = a[x]), (v = a[x]), L++);
            (v = a[L - 1]),
              (a[0].X - v.X) * (a[0].X - v.X) +
                (a[0].Y - v.Y) * (a[0].Y - v.Y) <=
                d && L--,
              L < o && c.splice(L, o - L),
              c.length && w.push(c);
          }
        return (
          !s && w.length
            ? (w = w[0])
            : !s && w.length === 0
            ? (w = [])
            : s && w.length === 0 && (w = [[]]),
          w
        );
      }),
      (i.JS.Clone = function (t) {
        if (!(t instanceof Array)) return [];
        if (t.length === 0) return [];
        if (t.length === 1 && t[0].length === 0) return [[]];
        var e = t[0] instanceof Array;
        e || (t = [t]);
        var s = t.length,
          n,
          r,
          o,
          a,
          c = new Array(s);
        for (r = 0; r < s; r++) {
          for (n = t[r].length, a = new Array(n), o = 0; o < n; o++)
            a[o] = { X: t[r][o].X, Y: t[r][o].Y };
          c[r] = a;
        }
        return e || (c = c[0]), c;
      }),
      (i.JS.Lighten = function (t, e) {
        if (!(t instanceof Array)) return [];
        if (typeof e != "number" || e === null)
          return (
            i.Error("Tolerance is not a number in Lighten()."), i.JS.Clone(t)
          );
        if (t.length === 0 || (t.length === 1 && t[0].length === 0) || e < 0)
          return i.JS.Clone(t);
        var s = t[0] instanceof Array;
        s || (t = [t]);
        var n,
          r,
          o,
          a,
          c,
          d,
          v,
          L,
          x,
          w,
          b,
          X,
          N,
          F,
          K,
          tt,
          ht,
          pi = t.length,
          ci = e * e,
          ut = [];
        for (n = 0; n < pi; n++)
          if (((o = t[n]), (d = o.length), d !== 0)) {
            for (a = 0; a < 1e6; a++) {
              for (
                c = [],
                  d = o.length,
                  o[d - 1].X !== o[0].X || o[d - 1].Y !== o[0].Y
                    ? ((X = 1),
                      o.push({ X: o[0].X, Y: o[0].Y }),
                      (d = o.length))
                    : (X = 0),
                  b = [],
                  r = 0;
                r < d - 2;
                r++
              )
                (v = o[r]),
                  (x = o[r + 1]),
                  (L = o[r + 2]),
                  (tt = v.X),
                  (ht = v.Y),
                  (N = L.X - tt),
                  (F = L.Y - ht),
                  (N !== 0 || F !== 0) &&
                    ((K = ((x.X - tt) * N + (x.Y - ht) * F) / (N * N + F * F)),
                    K > 1
                      ? ((tt = L.X), (ht = L.Y))
                      : K > 0 && ((tt += N * K), (ht += F * K))),
                  (N = x.X - tt),
                  (F = x.Y - ht),
                  (w = N * N + F * F),
                  w <= ci && ((b[r + 1] = 1), r++);
              for (c.push({ X: o[0].X, Y: o[0].Y }), r = 1; r < d - 1; r++)
                b[r] || c.push({ X: o[r].X, Y: o[r].Y });
              if (
                (c.push({ X: o[d - 1].X, Y: o[d - 1].Y }),
                X && o.pop(),
                b.length)
              )
                o = c;
              else break;
            }
            (d = c.length),
              c[d - 1].X === c[0].X && c[d - 1].Y === c[0].Y && c.pop(),
              c.length > 2 && ut.push(c);
          }
        return s || (ut = ut[0]), typeof ut > "u" && (ut = []), ut;
      }),
      (i.JS.PerimeterOfPath = function (t, e, s) {
        if (typeof t > "u") return 0;
        var n = Math.sqrt,
          r = 0,
          o,
          a,
          c = 0,
          d = 0,
          v = 0,
          L = 0,
          x = t.length;
        if (x < 2) return 0;
        for (e && ((t[x] = t[0]), x++); --x; )
          (o = t[x]),
            (c = o.X),
            (d = o.Y),
            (a = t[x - 1]),
            (v = a.X),
            (L = a.Y),
            (r += n((c - v) * (c - v) + (d - L) * (d - L)));
        return e && t.pop(), r / s;
      }),
      (i.JS.PerimeterOfPaths = function (t, e, s) {
        s || (s = 1);
        for (var n = 0, r = 0; r < t.length; r++)
          n += i.JS.PerimeterOfPath(t[r], e, s);
        return n;
      }),
      (i.JS.ScaleDownPath = function (t, e) {
        var s, n;
        for (e || (e = 1), s = t.length; s--; )
          (n = t[s]), (n.X = n.X / e), (n.Y = n.Y / e);
      }),
      (i.JS.ScaleDownPaths = function (t, e) {
        var s, n, r;
        for (e || (e = 1), s = t.length; s--; )
          for (n = t[s].length; n--; )
            (r = t[s][n]), (r.X = r.X / e), (r.Y = r.Y / e);
      }),
      (i.JS.ScaleUpPath = function (t, e) {
        var s,
          n,
          r = Math.round;
        for (e || (e = 1), s = t.length; s--; )
          (n = t[s]), (n.X = r(n.X * e)), (n.Y = r(n.Y * e));
      }),
      (i.JS.ScaleUpPaths = function (t, e) {
        var s,
          n,
          r,
          o = Math.round;
        for (e || (e = 1), s = t.length; s--; )
          for (n = t[s].length; n--; )
            (r = t[s][n]), (r.X = o(r.X * e)), (r.Y = o(r.Y * e));
      }),
      (i.ExPolygons = function () {
        return [];
      }),
      (i.ExPolygon = function () {
        (this.outer = null), (this.holes = null);
      }),
      (i.JS.AddOuterPolyNodeToExPolygons = function (t, e) {
        var s = new i.ExPolygon();
        s.outer = t.Contour();
        var n = t.Childs(),
          r = n.length;
        s.holes = new Array(r);
        var o, a, c, d, v, L;
        for (c = 0; c < r; c++)
          for (
            o = n[c],
              s.holes[c] = o.Contour(),
              d = 0,
              v = o.Childs(),
              L = v.length;
            d < L;
            d++
          )
            (a = v[d]), i.JS.AddOuterPolyNodeToExPolygons(a, e);
        e.push(s);
      }),
      (i.JS.ExPolygonsToPaths = function (t) {
        var e,
          s,
          n,
          r,
          o = new i.Paths();
        for (e = 0, n = t.length; e < n; e++)
          for (o.push(t[e].outer), s = 0, r = t[e].holes.length; s < r; s++)
            o.push(t[e].holes[s]);
        return o;
      }),
      (i.JS.PolyTreeToExPolygons = function (t) {
        var e = new i.ExPolygons(),
          s,
          n,
          r,
          o;
        for (n = 0, r = t.Childs(), o = r.length; n < o; n++)
          (s = r[n]), i.JS.AddOuterPolyNodeToExPolygons(s, e);
        return e;
      });
  })();
})(Wt);
var _t = Wt.exports;
const ft = xi(_t);
function Ci(P, i) {
  const p = P.map((I) => ({
      X: Math.round(I.x * 1e3),
      Y: Math.round(I.y * 1e3),
    })),
    u = 10 * _.SCALE,
    h = 0.25 * 1e3,
    y = new _t.ClipperOffset(u, h);
  y.AddPath(p, _t.JoinType.jtMiter, _t.EndType.etClosedPolygon);
  const f = [],
    m = i * 1e3;
  if ((y.Execute(f, m), f.length === 0))
    throw new Error("Offsetting failed, no paths returned");
  return f[0].map((I) => ({ x: I.X / 1e3, y: I.Y / 1e3 }));
}
function Ht(P, i) {
  return Ci(P, i);
}
function Li(P, i) {
  const l = i / 2;
  if (P.length < 3) return { outer: [], inner: [] };
  const u = Rt(P, l),
    h = Rt(P, -l);
  return { outer: u, inner: h };
}
function Rt(P, i) {
  const l = P.length,
    p = [];
  for (let h = 0; h < l; h++) {
    const y = P[h],
      f = P[(h + 1) % l],
      m = f.x - y.x,
      C = f.y - y.y,
      I = Math.hypot(m, C);
    if (I === 0) continue;
    const g = -C / I,
      S = m / I,
      D = g * i,
      W = S * i,
      $ = { x: y.x + D, y: y.y + W },
      U = { x: f.x + D, y: f.y + W };
    p.push({ p1: $, p2: U });
  }
  const u = [];
  for (let h = 0; h < p.length; h++) {
    const y = p[h],
      f = p[(h + 1) % p.length],
      m = Ii(y.p1, y.p2, f.p1, f.p2);
    m ? u.push(m) : u.push(f.p1);
  }
  return u;
}
function Ii(P, i, l, p) {
  const u = i.y - P.y,
    h = P.x - i.x,
    y = u * P.x + h * P.y,
    f = p.y - l.y,
    m = l.x - p.x,
    C = f * l.x + m * l.y,
    I = u * m - f * h;
  if (Math.abs(I) < 1e-10) return null;
  const g = (m * y - h * C) / I,
    S = (u * C - f * y) / I;
  return { x: g, y: S };
}
function _i(P, i, l) {
  const p = l / 2,
    u = i.x - P.x,
    h = i.y - P.y,
    y = Math.hypot(u, h);
  if (y === 0) return [];
  const f = -h / y,
    m = u / y,
    C = f * p,
    I = m * p,
    g = { x: P.x + C, y: P.y + I },
    S = { x: P.x - C, y: P.y - I },
    D = { x: i.x + C, y: i.y + I },
    W = { x: i.x - C, y: i.y - I };
  return [g, D, W, S];
}
function pt(P, i) {
  if (P.length < 2) return [];
  if (P.length === 2) return _i(P[0], P[1], i);
  const l = Li(P, i);
  return [
    l.outer[l.outer.length - 1],
    ...l.outer,
    ...l.inner.reverse(),
    l.inner[0],
    l.outer[l.outer.length - 1],
  ];
}
class wi {
  constructor(i) {
    E(this, "canvas");
    E(this, "context");
    E(this, "app");
    E(this, "state", { dragging: !1, startX: 0, startY: 0 });
    (this.canvas = i.canvas), (this.context = i.context), (this.app = i.app);
  }
  draw(i, l) {
    const p = (i.clientX - this.canvas.offsetLeft) * _.SCALE,
      u = (i.clientY - this.canvas.offsetTop) * _.SCALE;
    l &&
      (l.clearRect(0, 0, this.canvas.width, this.canvas.height),
      (l.strokeStyle = A("PENCOLOR")),
      (l.lineWidth = A("PENSTROKE") * _.SCALE));
    const h = p - this.state.startX,
      y = u - this.state.startY;
    let f = h / 2,
      m = y / 2;
    if (A("SHIFTTOOL") || A("SHIFT")) {
      let g = Math.min(Math.abs(f), Math.abs(m));
      (f = (f > 0 ? 1 : -1) * g), (m = (m > 0 ? 1 : -1) * g);
    }
    let C = this.state.startX + f,
      I = this.state.startY + m;
    if (
      (f < 0 && ((f = -f), (C = this.state.startX - f)),
      m < 0 && ((m = -m), (I = this.state.startY - m)),
      l)
    )
      l.beginPath(), l.ellipse(C, I, f, m, 0, 0, 2 * Math.PI), l.stroke();
    else {
      const g = {
          fillColor: A("FILLTOOL") ? A("PENCOLOR") : "transparent",
          strokeColor: A("PENCOLOR"),
          strokeWidth: A("PENSTROKE") * _.SCALE,
        },
        S = Pi(C, f, I, m);
      nt({
        fillColor: A("PENCOLOR"),
        points:
          g.fillColor === "transparent"
            ? pt(S, g.strokeWidth)
            : Ht(S, g.strokeWidth / 2),
        strokeColor: "transparent",
        strokeWidth: 0,
        type: "polygon",
      }),
        Y().saveAsHistory();
    }
  }
  apply() {
    console.log("OvalTool Apply");
    const i = (u) => {
        (this.state.dragging = !0),
          (this.state.startX = (u.clientX - this.canvas.offsetLeft) * _.SCALE),
          (this.state.startY = (u.clientY - this.canvas.offsetTop) * _.SCALE);
      },
      l = (u) => {
        this.state.dragging && this.draw(u, this.context);
      },
      p = (u) => {
        this.state.dragging &&
          ((this.state.dragging = !1),
          this.draw(u, null),
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height));
      };
    return (
      this.canvas.addEventListener("mousemove", l),
      this.canvas.addEventListener("mousedown", i),
      document.addEventListener("mouseup", p),
      () => {
        this.canvas.removeEventListener("mousedown", i),
          this.canvas.removeEventListener("mousemove", l),
          document.removeEventListener("mouseup", p);
      }
    );
  }
}
class gi {
  constructor(i) {
    E(this, "canvas");
    E(this, "context");
    E(this, "app");
    E(this, "state", { dragging: !1, startX: 0, startY: 0 });
    (this.canvas = i.canvas), (this.context = i.context), (this.app = i.app);
  }
  draw(i, l) {
    const p = (i.clientX - this.canvas.offsetLeft) * _.SCALE,
      u = (i.clientY - this.canvas.offsetTop) * _.SCALE;
    let h = p - this.state.startX,
      y = u - this.state.startY;
    if (A("SHIFTTOOL") || A("SHIFT")) {
      const f = Math.min(Math.abs(h), Math.abs(y));
      (h = (h > 0 ? 1 : -1) * f), (y = (y > 0 ? 1 : -1) * f);
    }
    if (l)
      l.clearRect(0, 0, this.canvas.width, this.canvas.height),
        (l.strokeStyle = A("PENCOLOR")),
        (l.lineWidth = A("PENSTROKE") * _.SCALE),
        l.strokeRect(this.state.startX, this.state.startY, h, y);
    else {
      let f = this.state.startX,
        m = this.state.startY;
      h < 0 && ((f += h), (h = -h)), y < 0 && ((m += y), (y = -y));
      const C = A("PENSTROKE") * _.SCALE;
      nt({
        type: "rect",
        leftTop: { x: f, y: m },
        width: h,
        height: y,
        fillColor: A("FILLTOOL") ? A("PENCOLOR") : "transparent",
        strokeColor: A("PENCOLOR"),
        rotate: 0,
        strokeWidth: C,
      }),
        Y().saveAsHistory();
    }
  }
  apply() {
    console.log("RectTool Apply");
    const i = (u) => {
        (this.state.dragging = !0),
          (this.state.startX = (u.clientX - this.canvas.offsetLeft) * _.SCALE),
          (this.state.startY = (u.clientY - this.canvas.offsetTop) * _.SCALE);
      },
      l = (u) => {
        this.state.dragging && this.draw(u, this.context);
      },
      p = (u) => {
        this.state.dragging &&
          ((this.state.dragging = !1),
          this.draw(u, null),
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height));
      };
    return (
      this.canvas.addEventListener("mousemove", l),
      this.canvas.addEventListener("mousedown", i),
      document.addEventListener("mouseup", p),
      () => {
        this.canvas.removeEventListener("mousedown", i),
          this.canvas.removeEventListener("mousemove", l),
          document.removeEventListener("mouseup", p);
      }
    );
  }
}
class Ei {
  constructor(i) {
    E(this, "canvas");
    E(this, "context");
    E(this, "app");
    E(this, "state", { dragging: !1, startX: 0, startY: 0 });
    (this.canvas = i.canvas), (this.context = i.context), (this.app = i.app);
  }
  draw(i, l) {
    l &&
      (l.clearRect(0, 0, this.canvas.width, this.canvas.height),
      (l.strokeStyle = A("PENCOLOR")),
      (l.lineWidth = A("PENSTROKE") * _.SCALE));
    const p = (i.clientX - this.canvas.offsetLeft) * _.SCALE,
      u = (i.clientY - this.canvas.offsetTop) * _.SCALE;
    let h = p - this.state.startX,
      y = u - this.state.startY;
    if (A("SHIFTTOOL") || A("SHIFT")) {
      const f = Math.min(Math.abs(h), Math.abs(y));
      (h = (h > 0 ? 1 : -1) * f),
        (y = ((y > 0 ? 1 : -1) * f * Math.sqrt(3)) / 2);
    }
    if (l) {
      let f = this.state.startY;
      y > 0 && ((y = -y), (f -= y)),
        l.beginPath(),
        l.moveTo(this.state.startX, f),
        l.lineTo(this.state.startX + h, f),
        l.lineTo(this.state.startX + h / 2, f + y),
        l.closePath(),
        l.stroke();
    } else {
      let f = this.state.startX,
        m = this.state.startY;
      h < 0 && ((f += h), (h = -h)), y < 0 && ((m += y), (y = -y));
      const C = A("PENSTROKE") * _.SCALE;
      nt({
        type: "triangle",
        fillColor: A("FILLTOOL") ? A("PENCOLOR") : "transparent",
        rotate: 0,
        strokeColor: A("PENCOLOR"),
        strokeWidth: C,
        points: [
          { x: f, y: m + y },
          { x: f + h, y: m + y },
          { x: f + h / 2, y: m },
        ],
      }),
        Y().saveAsHistory();
    }
  }
  apply() {
    console.log("RectTool Apply");
    const i = (u) => {
        (this.state.dragging = !0),
          (this.state.startX = (u.clientX - this.canvas.offsetLeft) * _.SCALE),
          (this.state.startY = (u.clientY - this.canvas.offsetTop) * _.SCALE);
      },
      l = (u) => {
        this.state.dragging && this.draw(u, this.context);
      },
      p = (u) => {
        this.state.dragging &&
          ((this.state.dragging = !1),
          this.draw(u, null),
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height));
      };
    return (
      this.canvas.addEventListener("mousemove", l),
      this.canvas.addEventListener("mousedown", i),
      document.addEventListener("mouseup", p),
      () => {
        this.canvas.removeEventListener("mousedown", i),
          this.canvas.removeEventListener("mousemove", l),
          document.removeEventListener("mouseup", p);
      }
    );
  }
}
function Ti(P, i) {
  let l = !1;
  const { x: p, y: u } = P;
  for (let h = 0, y = i.length - 1; h < i.length; y = h++) {
    const f = i[h].x,
      m = i[h].y,
      C = i[y].x,
      I = i[y].y;
    m > u != I > u && p < ((C - f) * (u - m)) / (I - m) + f && (l = !l);
  }
  return l;
}
class Si {
  constructor(i) {
    E(this, "canvas");
    E(this, "context");
    E(this, "app");
    E(this, "state", "NONE");
    (this.canvas = i.canvas), (this.context = i.context), (this.app = i.app);
  }
  apply() {
    console.log("EraseTool Apply");
    const i = () => {
        this.state = "ERASE";
      },
      l = (u) => {
        if (this.state !== "ERASE") return;
        const h = u.clientX * _.SCALE,
          y = u.clientY * _.SCALE,
          f = Y(),
          m = Object.keys(f.drawnLayers);
        for (let C = m.length - 1; C >= 0; C--) {
          const I = m[C],
            g = f.drawnPolygons[I];
          Ti({ x: h, y }, g) && f.removeLayer(I);
        }
      },
      p = () => {
        this.state === "ERASE" && ((this.state = "NONE"), Y().saveAsHistory());
      };
    return (
      this.canvas.addEventListener("mousemove", l),
      this.canvas.addEventListener("mousedown", i),
      document.addEventListener("mouseup", p),
      () => {
        this.canvas.removeEventListener("mousedown", i),
          this.canvas.removeEventListener("mousemove", l),
          document.removeEventListener("mouseup", p);
      }
    );
  }
}
function bi(P, i) {
  if (P.length < 2)
    throw new Error(
      "At least two points are required to create a stroked polygon."
    );
  const l = i / 2,
    p = [],
    u = [];
  for (let h = 0; h < P.length - 1; h++) {
    const y = P[h],
      f = P[h + 1],
      m = f.x - y.x,
      C = f.y - y.y,
      I = Math.sqrt(m * m + C * C),
      g = -C / I,
      S = m / I;
    p.push({ x: y.x + g * l, y: y.y + S * l }),
      u.push({ x: y.x - g * l, y: y.y - S * l }),
      h === P.length - 2 &&
        (p.push({ x: f.x + g * l, y: f.y + S * l }),
        u.push({ x: f.x - g * l, y: f.y - S * l }));
  }
  return [...p, ...u.reverse()];
}
class Ai {
  constructor(i) {
    E(this, "canvas");
    E(this, "context");
    E(this, "app");
    E(this, "state", "NONE");
    E(this, "startPos", { x: 0, y: 0 });
    E(this, "lastApplied", { x: 0, y: 0 });
    E(this, "points", []);
    (this.canvas = i.canvas), (this.context = i.context), (this.app = i.app);
  }
  apply() {
    console.log("PenTool Apply");
    const i = (u) => {
        (this.state = "DRAW"),
          (this.points = [{ x: u.clientX * _.SCALE, y: u.clientY * _.SCALE }]),
          (this.startPos = { x: u.clientX, y: u.clientY }),
          (this.lastApplied = { x: u.clientX, y: u.clientY }),
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height),
          this.context.moveTo(u.clientX * _.SCALE, u.clientY * _.SCALE),
          this.context.beginPath(),
          (this.context.strokeStyle = A("PENCOLOR") || "black"),
          (this.context.lineWidth = A("PENSTROKE") || 1),
          this.context.stroke();
      },
      l = (u) => {
        if (this.state !== "DRAW") return;
        const h = u.clientX,
          y = u.clientY;
        Math.sqrt(
          (h - this.lastApplied.x) ** 2 + (y - this.lastApplied.y) ** 2
        ) < 3 ||
          (this.points.push({ x: h * _.SCALE, y: y * _.SCALE }),
          (this.lastApplied = { x: h, y }),
          this.context.lineTo(h * _.SCALE, y * _.SCALE),
          this.context.stroke());
      },
      p = () => {
        if (this.state !== "DRAW") return;
        (this.state = "NONE"),
          this.context.closePath(),
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const u = bi(this.points, A("PENSTROKE") || 1);
        nt({
          type: "polygon",
          fillColor: A("PENCOLOR") || "black",
          points: u,
          strokeWidth: 0,
          strokeColor: "transparent",
        }),
          Y().saveAsHistory();
      };
    return (
      this.canvas.addEventListener("mousemove", l),
      this.canvas.addEventListener("mousedown", i),
      document.addEventListener("mouseup", p),
      () => {
        this.canvas.removeEventListener("mousedown", i),
          this.canvas.removeEventListener("mousemove", l),
          document.removeEventListener("mouseup", p);
      }
    );
  }
}
function Et(P) {
  let i = 1 / 0,
    l = 1 / 0,
    p = -1 / 0,
    u = -1 / 0;
  for (const h of P)
    for (const y of h)
      y.x < i && (i = y.x),
        y.x > p && (p = y.x),
        y.y < l && (l = y.y),
        y.y > u && (u = y.y);
  return [
    { x: i, y: l },
    { x: i, y: u },
    { x: p, y: u },
    { x: p, y: l },
  ];
}
function Tt(P, i) {
  return Math.sqrt((P.x - i.x) ** 2 + (P.y - i.y) ** 2);
}
function Oi(P, i) {
  return Xi(P, i);
}
function Xi(P, i) {
  const p = P.map((C) => ({ X: C.x * 1e6, Y: C.y * 1e6 })),
    u = i.map((C) => ({ X: C.x * 1e6, Y: C.y * 1e6 })),
    h = new ft.Clipper(),
    y = [];
  if (
    (h.AddPath(p, ft.PolyType.ptSubject, !0),
    h.AddPath(u, ft.PolyType.ptClip, !0),
    !h.Execute(
      ft.ClipType.ctIntersection,
      y,
      ft.PolyFillType.pftNonZero,
      ft.PolyFillType.pftNonZero
    ))
  )
    throw new Error("다각형 교집합 계산에 실패했습니다.");
  return y.map((C) => C.map((I) => ({ x: I.X / 1e6, y: I.Y / 1e6 })));
}
function wt(P) {
  for (var i = P.length, l = 0, p = 0; p < i; p++)
    l += P[p % i].x * P[(p + 1) % i].y - P[p % i].y * P[(p + 1) % i].x;
  return Math.abs(l / 2);
}
function Ot(P, i, l, p, u) {
  const h = (u * Math.PI) / 180,
    y = l / 2,
    f = p / 2;
  return [
    { x: -y, y: -f },
    { x: y, y: -f },
    { x: y, y: f },
    { x: -y, y: f },
  ].map((I) => {
    const g = I.x * Math.cos(h) - I.y * Math.sin(h),
      S = I.x * Math.sin(h) + I.y * Math.cos(h);
    return { x: g + P, y: S + i };
  });
}
function St(P, i, l, p) {
  const u = (p * Math.PI) / 180,
    h = P.x + P.width / 2,
    y = P.y + P.height / 2,
    f = h - i,
    m = y - l,
    C = i + f * Math.cos(u) - m * Math.sin(u),
    I = l + f * Math.sin(u) + m * Math.cos(u);
  return {
    x: C - P.width / 2,
    y: I - P.height / 2,
    width: P.width,
    height: P.height,
    rotate: (P.rotate + p) % 360,
  };
}
function bt(P, i, l, p) {
  const u = (p * Math.PI) / 180,
    h = Math.cos(u),
    y = Math.sin(u);
  function f(I, g) {
    const S = g.x - I.x,
      D = g.y - I.y,
      W = S * h - D * y,
      $ = S * y + D * h;
    return { x: W + I.x, y: $ + I.y };
  }
  const m = f(P, i),
    C = f(P, l);
  return [m, C];
}
function Ft(P, i, l) {
  const p = (l * Math.PI) / 180,
    u = Math.cos(p),
    h = Math.sin(p);
  return P.map((y) => {
    const f = y.x - i.x,
      m = y.y - i.y,
      C = u * f - h * m + i.x,
      I = h * f + u * m + i.y;
    return { x: C, y: I };
  });
}
class Ni {
  constructor(i) {
    E(this, "modal");
    E(this, "xInput");
    E(this, "yInput");
    E(this, "keypad");
    E(this, "confirmButton");
    E(this, "cancelButton");
    E(this, "keypadVisible", !1);
    E(this, "activeInput");
    (this.onDone = i),
      (this.modal = document.createElement("div")),
      (this.modal.style.position = "fixed"),
      (this.modal.style.top = "0"),
      (this.modal.style.left = "0"),
      (this.modal.style.width = "100%"),
      (this.modal.style.height = "100%"),
      (this.modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)"),
      (this.modal.style.display = "flex"),
      (this.modal.style.justifyContent = "center"),
      (this.modal.style.alignItems = "center"),
      (this.modal.style.zIndex = "1000000000");
    const l = document.createElement("div");
    (l.style.backgroundColor = "#fff"),
      (l.style.padding = "20px"),
      (l.style.borderRadius = "8px"),
      (l.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"),
      (l.style.maxWidth = "400px"),
      (l.style.width = "300px"),
      (l.style.boxSizing = "border-box"),
      (l.style.position = "relative");
    const p = document.createElement("div");
    (p.style.display = "flex"),
      (p.style.alignItems = "center"),
      (p.style.marginBottom = "15px");
    const u = document.createElement("label");
    (u.textContent = "X:"),
      (u.style.marginRight = "10px"),
      (this.xInput = document.createElement("input")),
      (this.xInput.type = "text"),
      (this.xInput.style.flex = "1"),
      (this.xInput.style.padding = "10px"),
      (this.xInput.style.border = "1px solid #ccc"),
      (this.xInput.style.borderRadius = "4px"),
      (this.xInput.style.boxSizing = "border-box");
    const h = document.createElement("button");
    (h.textContent = "⌨️"),
      (h.style.marginLeft = "10px"),
      (h.style.padding = "5px"),
      (h.style.border = "1px solid #ccc"),
      (h.style.borderRadius = "4px"),
      (h.style.cursor = "pointer"),
      (h.style.height = "40px"),
      (h.style.width = "40px"),
      (h.style.textAlign = "center"),
      h.addEventListener("click", () => this.toggleKeypad(this.xInput)),
      p.appendChild(u),
      p.appendChild(this.xInput),
      p.appendChild(h);
    const y = document.createElement("div");
    (y.style.display = "flex"),
      (y.style.alignItems = "center"),
      (y.style.marginBottom = "15px");
    const f = document.createElement("label");
    (f.textContent = "Y:"),
      (f.style.marginRight = "10px"),
      (this.yInput = document.createElement("input")),
      (this.yInput.type = "text"),
      (this.yInput.style.flex = "1"),
      (this.yInput.style.padding = "10px"),
      (this.yInput.style.border = "1px solid #ccc"),
      (this.yInput.style.borderRadius = "4px"),
      (this.yInput.style.boxSizing = "border-box");
    const m = document.createElement("button");
    (m.textContent = "⌨️"),
      (m.style.marginLeft = "10px"),
      (m.style.padding = "5px"),
      (m.style.border = "1px solid #ccc"),
      (m.style.borderRadius = "4px"),
      (m.style.cursor = "pointer"),
      (m.style.height = "40px"),
      (m.style.width = "40px"),
      (m.style.textAlign = "center"),
      m.addEventListener("click", () => this.toggleKeypad(this.yInput)),
      y.appendChild(f),
      y.appendChild(this.yInput),
      y.appendChild(m),
      (this.confirmButton = document.createElement("button")),
      (this.confirmButton.textContent = "Confirm"),
      (this.confirmButton.style.marginRight = "10px"),
      (this.confirmButton.style.padding = "10px 20px"),
      (this.confirmButton.style.border = "none"),
      (this.confirmButton.style.backgroundColor = "#007bff"),
      (this.confirmButton.style.color = "#fff"),
      (this.confirmButton.style.borderRadius = "4px"),
      (this.confirmButton.style.cursor = "pointer"),
      (this.cancelButton = document.createElement("button")),
      (this.cancelButton.textContent = "Cancel"),
      (this.cancelButton.style.padding = "10px 20px"),
      (this.cancelButton.style.border = "none"),
      (this.cancelButton.style.backgroundColor = "#ccc"),
      (this.cancelButton.style.color = "#000"),
      (this.cancelButton.style.borderRadius = "4px"),
      (this.cancelButton.style.cursor = "pointer"),
      (this.keypad = document.createElement("div")),
      (this.keypad.style.position = "absolute"),
      (this.keypad.style.right = "-150px"),
      (this.keypad.style.top = "20px"),
      (this.keypad.style.width = "150px"),
      (this.keypad.style.backgroundColor = "#fff"),
      (this.keypad.style.border = "1px solid #ccc"),
      (this.keypad.style.borderRadius = "8px"),
      (this.keypad.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"),
      (this.keypad.style.display = "none"),
      (this.keypad.style.gridTemplateColumns = "repeat(3, 1fr)"),
      (this.keypad.style.gap = "10px"),
      (this.keypad.style.padding = "10px"),
      (this.keypad.style.boxSizing = "border-box"),
      (this.keypad.style.gridAutoRows = "40px"),
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "0", "←"].forEach(
        (C) => {
          const I = document.createElement("button");
          (I.textContent = C),
            (I.style.padding = "10px"),
            (I.style.border = "1px solid #ccc"),
            (I.style.borderRadius = "4px"),
            (I.style.cursor = "pointer"),
            I.addEventListener("click", () => {
              C === "←"
                ? (this.activeInput.value = this.activeInput.value.slice(0, -1))
                : (this.activeInput.value += C);
            }),
            this.keypad.appendChild(I);
        }
      ),
      l.appendChild(p),
      l.appendChild(y),
      l.appendChild(this.confirmButton),
      l.appendChild(this.cancelButton),
      l.appendChild(this.keypad),
      this.modal.appendChild(l),
      this.confirmButton.addEventListener("click", () => this.onConfirm()),
      this.cancelButton.addEventListener("click", () => this.onCancel());
  }
  toggleKeypad(i) {
    (this.activeInput = i),
      (this.keypadVisible = !this.keypadVisible),
      (this.keypad.style.display = this.keypadVisible ? "grid" : "none");
  }
  onConfirm() {
    const i = parseFloat(this.xInput.value),
      l = parseFloat(this.yInput.value);
    if (isNaN(i) || isNaN(l)) {
      alert("Please enter valid numbers for both coordinates.");
      return;
    }
    this.onDone({ x: i, y: l }), this.close();
  }
  onCancel() {
    this.onDone(null), this.close();
  }
  close() {
    this.modal.parentElement &&
      this.modal.parentElement.removeChild(this.modal);
  }
  open() {
    document.body.appendChild(this.modal), this.xInput.focus();
  }
}
class Yi {
  constructor(i) {
    E(this, "canvas");
    E(this, "context");
    E(this, "app");
    E(this, "wk");
    E(this, "workingState", "NONE");
    E(this, "mouseStart", { x: 0, y: 0 });
    E(this, "lastApplied", { x: 0, y: 0 });
    E(this, "lastScaled", { x: 0, y: 0 });
    E(this, "bbox", []);
    E(this, "bboxRotate", 0);
    E(this, "wk_bindMDN", this.wk_mouseDown.bind(this));
    E(this, "wk_bindMMV", this.wk_mouseMove.bind(this));
    E(this, "wk_bindMUP", this.wk_mouseUp.bind(this));
    E(this, "resize_bindMDN", this.resize_mouseDown.bind(this));
    E(this, "resize_bindMMV", this.resize_mouseMove.bind(this));
    E(this, "resize_bindMUP", this.resize_mouseUp.bind(this));
    E(this, "bboxElement", null);
    E(this, "rotate_bindMDN", this.rotate_mouseDown.bind(this));
    E(this, "rotate_bindMMV", this.rotate_mouseMove.bind(this));
    E(this, "rotate_bindMUP", this.rotate_mouseUp.bind(this));
    E(this, "bbox_bindMDN", this.bbox_mouseDown.bind(this));
    E(this, "bbox_bindMMV", this.bbox_mouseMove.bind(this));
    E(this, "bbox_bindMUP", this.bbox_mouseUp.bind(this));
    E(this, "selectedObjects", []);
    E(this, "canvas_state", {
      dragging: !1,
      polygon: [],
      lastPos: { x: 0, y: 0 },
    });
    (this.canvas = i.canvas),
      (this.context = i.context),
      (this.app = i.app),
      (this.wk = document.getElementById("selectTool"));
  }
  context_drawSelected(i = 0, l = 0) {
    (this.context.strokeStyle = "rgb(15, 15, 200)"),
      (this.context.fillStyle = "rgba(15, 15, 200, 0.3)"),
      (this.context.lineWidth = 3 * _.SCALE),
      this.context.setLineDash([6, 9]),
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let p = 0; p < this.selectedObjects.length; p++) {
      const u = Y().drawnPolygons[this.selectedObjects[p]];
      this.context.beginPath(), this.context.moveTo(u[0].x + i, u[0].y + l);
      for (let h = 1; h < u.length; h++)
        this.context.lineTo(u[h].x + i, u[h].y + l);
      this.context.closePath(), this.context.stroke(), this.context.fill();
    }
    this.context.setLineDash([]);
  }
  isShifted() {
    return A("SHIFT") || A("SHIFTTOOL");
  }
  wk_mouseDown() {}
  wk_mouseMove(i) {
    if (this.workingState === "BBOX_MOVE") return this.bbox_handleMove(i);
    if (this.workingState == "RESIZE") return this.resize_handleMove(i);
    if (this.workingState == "ROTATE") return this.rotate_mouseMove(i);
  }
  wk_mouseUp(i) {
    if (this.workingState === "BBOX_MOVE") return this.bbox_mouseUp(i);
    if (this.workingState === "RESIZE") return this.resize_mouseUp(i);
    if (this.workingState === "ROTATE") return this.rotate_mouseUp();
    if (this.workingState === "SELECTED") return this.disselect();
  }
  disallowDrawing() {
    this.wk.classList.add("active"),
      this.wk.addEventListener("mousedown", this.wk_bindMDN),
      this.wk.addEventListener("mousemove", this.wk_bindMMV),
      this.wk.addEventListener("mouseup", this.wk_bindMUP);
  }
  allowDrawing() {
    this.wk.classList.remove("active"),
      this.wk.removeEventListener("mousedown", this.wk_bindMDN),
      this.wk.removeEventListener("mousemove", this.wk_bindMMV),
      this.wk.removeEventListener("mouseup", this.wk_bindMUP);
  }
  resize_drawImageGhost(i) {
    const l = Y(),
      p = l.drawnLayers[i].t,
      u = l.drawnLayers[i].d;
    p.clearRect(0, 0, p.canvas.width, p.canvas.height);
    const h = St(
        {
          height: u.height * this.lastScaled.y,
          width: u.width * this.lastScaled.x,
          rotate: u.rotate,
          x: this.bbox[0].x + (u.left - this.bbox[0].x) * this.lastScaled.x,
          y: this.bbox[0].y + (u.top - this.bbox[0].y) * this.lastScaled.y,
        },
        this.bbox[0].x + (u.left - this.bbox[0].x) * this.lastScaled.x,
        this.bbox[0].y + (u.top - this.bbox[0].y) * this.lastScaled.y,
        u.rotate
      ),
      y = Ot(
        h.x + h.width / 2,
        h.y + h.height / 2,
        h.width,
        h.height,
        h.rotate
      );
    let f = y[0].x,
      m = y[0].y;
    for (let C = 1; C < y.length; C++) (f += y[C].x), (m += y[C].y);
    (f /= y.length),
      (m /= y.length),
      p.save(),
      p.translate(f, m),
      p.rotate((h.rotate * Math.PI) / 180),
      p.translate(-f, -m),
      p.drawImage(u.image, h.x, h.y, h.width, h.height),
      p.restore();
  }
  resize_drawLineGhost(i) {
    const l = Y(),
      p = l.drawnLayers[i].t,
      u = l.drawnLayers[i].d;
    p.clearRect(0, 0, p.canvas.width, p.canvas.height);
    const h = {
        x: this.bbox[0].x + (u.from.x - this.bbox[0].x) * this.lastScaled.x,
        y: this.bbox[0].y + (u.from.y - this.bbox[0].y) * this.lastScaled.y,
      },
      y = {
        x: this.bbox[0].x + (u.to.x - this.bbox[0].x) * this.lastScaled.x,
        y: this.bbox[0].y + (u.to.y - this.bbox[0].y) * this.lastScaled.y,
      },
      f = pt([h, y], u.strokeWidth);
    (this.context.strokeStyle = "rgb(15, 15, 200)"),
      (this.context.fillStyle = "rgba(15, 15, 200, 0.3)"),
      (this.context.lineWidth = 3 * _.SCALE),
      this.context.setLineDash([6, 9]),
      this.context.beginPath(),
      this.context.moveTo(f[0].x, f[0].y);
    for (let m = 1; m < f.length; m++) this.context.lineTo(f[m].x, f[m].y);
    this.context.stroke(),
      this.context.fill(),
      this.context.setLineDash([]),
      (p.strokeStyle = u.strokeColor),
      (p.lineWidth = u.strokeWidth),
      p.setLineDash(u.strokeDashArray),
      p.beginPath(),
      p.moveTo(h.x, h.y),
      p.lineTo(y.x, y.y),
      p.stroke(),
      p.setLineDash([]);
  }
  resize_drawGhost(i, l, p) {
    const u = Y(),
      h = u.drawnLayers[l].t,
      y = u.drawnLayers[l].d;
    if (((h.canvas.style.zIndex = p.toString()), y.type == "line"))
      return this.resize_drawLineGhost(l);
    if (y.type == "image") return this.resize_drawImageGhost(l);
    h.clearRect(0, 0, h.canvas.width, h.canvas.height),
      (h.strokeStyle = "transparent");
    let f = y.fillColor === "transparent" ? y.strokeColor : y.fillColor;
    (h.fillStyle = f),
      (h.lineWidth = 0),
      console.log("Drawing ghost", i),
      (this.context.strokeStyle = "rgb(15, 15, 200)"),
      (this.context.fillStyle = "rgba(15, 15, 200, 0.3)"),
      (this.context.lineWidth = 3 * _.SCALE),
      this.context.setLineDash([6, 9]),
      h.beginPath(),
      this.context.beginPath(),
      h.moveTo(i[0].x, i[0].y),
      this.context.moveTo(i[0].x, i[0].y);
    for (let m = 1; m < i.length; m++)
      h.lineTo(i[m].x, i[m].y), this.context.lineTo(i[m].x, i[m].y);
    h.closePath(),
      h.fill(),
      this.context.closePath(),
      this.context.stroke(),
      this.context.fill(),
      this.context.setLineDash([]);
  }
  resize_applyPoly() {
    const i = Y();
    for (const l of this.selectedObjects) {
      let p = i.drawnPolygons[l];
      (p = p.map((h) => ({
        x: this.bbox[0].x + (h.x - this.bbox[0].x) * this.lastScaled.x,
        y: this.bbox[0].y + (h.y - this.bbox[0].y) * this.lastScaled.y,
      }))),
        (Y().drawnPolygons[l] = p);
      const u = i.drawnLayers[l].d;
      switch (u.type) {
        case "rect":
          (u.leftTop = p[0]),
            (u.width = p[2].x - p[0].x),
            (u.height = p[2].y - p[0].y);
          break;
        case "triangle":
          u.points = p;
          break;
        case "polygon":
          u.points = p;
          break;
        case "line":
          (u.from = {
            x: this.bbox[0].x + (u.from.x - this.bbox[0].x) * this.lastScaled.x,
            y: this.bbox[0].y + (u.from.y - this.bbox[0].y) * this.lastScaled.y,
          }),
            (u.to = {
              x: this.bbox[0].x + (u.to.x - this.bbox[0].x) * this.lastScaled.x,
              y: this.bbox[0].y + (u.to.y - this.bbox[0].y) * this.lastScaled.y,
            });
          break;
        case "image":
          (u.left =
            this.bbox[0].x + (u.left - this.bbox[0].x) * this.lastScaled.x),
            (u.top =
              this.bbox[0].y + (u.top - this.bbox[0].y) * this.lastScaled.y),
            (u.width *= this.lastScaled.x),
            (u.height *= this.lastScaled.y);
          break;
      }
    }
  }
  resize_mouseDown(i) {
    i.stopPropagation(),
      (this.workingState = "RESIZE"),
      (this.mouseStart = { x: i.clientX, y: i.clientY }),
      (this.lastApplied = { x: i.clientX, y: i.clientY }),
      (this.lastScaled = { x: 1, y: 1 }),
      (this.bbox = Et(this.selectedObjects.map((l) => Y().drawnPolygons[l])));
  }
  resize_handleMove(i) {
    const l = { x: i.clientX, y: i.clientY };
    if (
      !(Tt(this.lastApplied, l) < 5
        ? !1
        : ((this.lastApplied = { x: l.x, y: l.y }), !0))
    )
      return;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const u = (this.bbox[2].x - this.bbox[0].x) / _.SCALE,
      h = (this.bbox[1].y - this.bbox[0].y) / _.SCALE,
      y = l.x - this.mouseStart.x,
      f = l.y - this.mouseStart.y;
    let m = (u + y) / u,
      C = (h + f) / h;
    this.isShifted() && (m = C = Math.min(m, C)),
      (this.lastScaled = { x: m, y: C });
    const I = Y(),
      g = st();
    for (let S = 0; S < this.selectedObjects.length; S++) {
      let D = I.drawnPolygons[this.selectedObjects[S]];
      (D = D.map((W) => ({
        x: this.bbox[0].x + (W.x - this.bbox[0].x) * m,
        y: this.bbox[0].y + (W.y - this.bbox[0].y) * C,
      }))),
        this.resize_drawGhost(D, this.selectedObjects[S], g);
    }
    (this.bboxElement.style.width = `${u * m}px`),
      (this.bboxElement.style.height = `${h * C}px`);
  }
  resize_mouseMove() {}
  resize_mouseUp(i) {
    if (this.workingState === "RESIZE") {
      i.stopPropagation(),
        (this.workingState = "SELECTED"),
        Y().saveAsHistory(),
        this.resize_applyPoly();
      for (let l = 0; l < this.selectedObjects.length; l++)
        if (Y().drawnLayers[this.selectedObjects[l]].d.type === "image") {
          Y().rerender(this.selectedObjects[l]);
          continue;
        }
    }
  }
  setupResize() {
    const i = document.createElement("div");
    return (
      i.classList.add("resize"),
      i.addEventListener("mousedown", this.resize_bindMDN),
      i.addEventListener("mousemove", this.resize_bindMMV),
      i.addEventListener("mouseup", this.resize_bindMUP),
      i
    );
  }
  rotate_drawLineGhost(i, l) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const p = Y(),
      u = p.drawnLayers[l].t,
      h = p.drawnLayers[l].d,
      y = pt(i, h.strokeWidth);
    (this.context.strokeStyle = "rgb(15, 15, 200)"),
      (this.context.fillStyle = "rgba(15, 15, 200, 0.3)"),
      (this.context.lineWidth = 3 * _.SCALE),
      this.context.setLineDash([6, 9]),
      this.context.beginPath(),
      this.context.moveTo(y[0].x, y[0].y);
    for (let f = 1; f < y.length; f++) this.context.lineTo(y[f].x, y[f].y);
    this.context.stroke(),
      this.context.fill(),
      this.context.setLineDash([]),
      u.clearRect(0, 0, u.canvas.width, u.canvas.height),
      (u.strokeStyle = h.strokeColor),
      (u.lineWidth = h.strokeWidth),
      u.setLineDash(h.strokeDashArray),
      u.beginPath(),
      u.moveTo(i[0].x, i[0].y),
      u.lineTo(i[1].x, i[1].y),
      u.stroke(),
      u.setLineDash([]);
  }
  rotate_drawImageGhost(i, l, p, u) {
    const h = Y(),
      y = h.drawnLayers[u].t,
      m = h.drawnLayers[u].d;
    y.clearRect(0, 0, y.canvas.width, y.canvas.height);
    const C = St(
        {
          height: m.height,
          width: m.width,
          rotate: m.rotate,
          x: m.left,
          y: m.top,
        },
        i,
        l,
        p
      ),
      I = Ot(C.x + C.width / 2, C.y + C.height / 2, C.width, C.height, p);
    let g = I[0].x,
      S = I[0].y;
    y.moveTo(I[0].x, I[0].y);
    for (let D = 1; D < I.length; D++) (g += I[D].x), (S += I[D].y);
    (g /= I.length),
      (S /= I.length),
      y.save(),
      y.translate(g, S),
      y.rotate((C.rotate * Math.PI) / 180),
      y.translate(-g, -S),
      y.drawImage(m.image, C.x, C.y, C.width, C.height),
      y.restore();
  }
  rotate_drawGhost(i, l, p) {
    const u = Y(),
      h = u.drawnLayers[l].t,
      y = u.drawnLayers[l].d;
    if (
      ((h.canvas.style.zIndex = p.toString()),
      y.type == "line" || y.type == "image")
    )
      return;
    h.clearRect(0, 0, h.canvas.width, h.canvas.height),
      (h.strokeStyle = "transparent");
    let f = y.fillColor === "transparent" ? y.strokeColor : y.fillColor;
    (h.fillStyle = f),
      (h.lineWidth = 0),
      (this.context.strokeStyle = "rgb(15, 15, 200)"),
      (this.context.fillStyle = "rgba(15, 15, 200, 0.3)"),
      (this.context.lineWidth = 3 * _.SCALE),
      this.context.setLineDash([6, 9]),
      h.beginPath(),
      this.context.beginPath(),
      h.moveTo(i[0].x, i[0].y),
      this.context.moveTo(i[0].x, i[0].y);
    for (let m = 1; m < i.length; m++)
      h.lineTo(i[m].x, i[m].y), this.context.lineTo(i[m].x, i[m].y);
    h.closePath(),
      h.fill(),
      this.context.closePath(),
      this.context.stroke(),
      this.context.fill(),
      this.context.setLineDash([]);
  }
  rotate_mouseDown(i) {
    (this.bbox = Et(this.selectedObjects.map((l) => Y().drawnPolygons[l]))),
      i.stopPropagation(),
      (this.workingState = "ROTATE"),
      (this.mouseStart = {
        x: (this.bbox[0].x + (this.bbox[2].x - this.bbox[0].x) / 2) / _.SCALE,
        y: (this.bbox[0].y + (this.bbox[1].y - this.bbox[0].y) / 2) / _.SCALE,
      }),
      (this.lastApplied = { x: i.clientX, y: i.clientY }),
      (this.bboxRotate = 0);
  }
  rotate_mouseMove(i) {
    if (this.workingState !== "ROTATE") return;
    const l = { x: i.clientX, y: i.clientY };
    if (
      !(Tt(this.lastApplied, l) < 5
        ? !1
        : ((this.lastApplied = { x: l.x, y: l.y }), !0))
    )
      return;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const u = l.x - this.mouseStart.x,
      h = l.y - this.mouseStart.y,
      y = Math.atan2(h, u) * (180 / Math.PI) + 90;
    (this.bboxElement.style.transform = `rotate(${y}deg)`),
      (this.bboxRotate = y);
    const f = st();
    for (let m = 0; m < this.selectedObjects.length; m++) {
      const C = Y().drawnLayers[this.selectedObjects[m]].d.type;
      if (C === "line") {
        const I = Y().drawnLayers[this.selectedObjects[m]].d;
        this.rotate_drawLineGhost(
          bt(
            { x: this.mouseStart.x * _.SCALE, y: this.mouseStart.y * _.SCALE },
            I.from,
            I.to,
            y
          ),
          this.selectedObjects[m]
        );
      }
      if (C === "image") {
        this.rotate_drawImageGhost(
          this.mouseStart.x * _.SCALE,
          this.mouseStart.y * _.SCALE,
          y,
          this.selectedObjects[m]
        );
        continue;
      }
      this.rotate_drawGhost(
        Ft(
          Y().drawnPolygons[this.selectedObjects[m]],
          { x: this.mouseStart.x * _.SCALE, y: this.mouseStart.y * _.SCALE },
          y
        ),
        this.selectedObjects[m],
        f
      );
    }
  }
  rotate_mouseUp() {
    this.workingState === "ROTATE" &&
      ((this.workingState = "SELECTED"),
      this.rotate_applyPoly(),
      Y().saveAsHistory());
  }
  rotate_applyPoly() {
    if (this.bboxRotate === 0) return;
    const i = Y(),
      l = {
        x: (this.bbox[0].x + this.bbox[2].x) / 2,
        y: (this.bbox[0].y + this.bbox[1].y) / 2,
      };
    for (const p of this.selectedObjects) {
      const u = i.drawnPolygons[p];
      i.drawnPolygons[p] = Ft(u, l, this.bboxRotate);
      const h = i.drawnLayers[p].d;
      switch (h.type) {
        case "line":
          const y = h;
          (y.from = bt(l, y.from, y.to, this.bboxRotate)[0]),
            (y.to = bt(l, y.from, y.to, this.bboxRotate)[1]);
          break;
        case "image":
          const f = St(
            {
              height: h.height,
              width: h.width,
              rotate: h.rotate,
              x: h.left,
              y: h.top,
            },
            this.mouseStart.x * _.SCALE,
            this.mouseStart.y * _.SCALE,
            this.bboxRotate
          );
          (h.left = f.x),
            (h.top = f.y),
            (h.width = f.width),
            (h.height = f.height),
            (h.rotate = f.rotate);
          break;
        default:
          i.drawnLayers[p].d = {
            fillColor:
              h.fillColor === "transparent" ? h.strokeColor : h.fillColor,
            points: i.drawnPolygons[p],
            strokeColor: "transparent",
            strokeWidth: 0,
            type: "polygon",
            z: h.z,
          };
          break;
      }
    }
  }
  setupRotate() {
    const i = document.createElement("div");
    return (
      i.classList.add("rotate"),
      i.addEventListener("mousedown", this.rotate_bindMDN),
      i.addEventListener("mousemove", this.rotate_bindMMV),
      i.addEventListener("mouseup", this.rotate_bindMUP),
      i
    );
  }
  bbox_mouseDown(i) {
    i.stopPropagation(),
      (this.mouseStart = { x: i.clientX, y: i.clientY }),
      (this.lastApplied = { x: i.clientX, y: i.clientY }),
      (this.workingState = "BBOX_MOVE"),
      this.bboxElement && (this.bboxElement.style.cursor = "grabbing");
  }
  bbox_mouseMove() {}
  bbox_handleMove(i) {
    const l = { x: i.clientX, y: i.clientY },
      p = l.x - this.lastApplied.x,
      u = l.y - this.lastApplied.y,
      h = Y();
    if (
      !(Tt(this.lastApplied, l) < 5
        ? !1
        : ((this.lastApplied = { x: l.x, y: l.y }), !0))
    )
      return;
    const f = st();
    for (let m = 0; m < this.selectedObjects.length; m++)
      Mi(this.selectedObjects[m], p * _.SCALE, u * _.SCALE, f),
        h.rerender(this.selectedObjects[m]);
    this.bbox_transform(p, u), this.context_drawSelected(p, u);
  }
  bbox_mouseUp(i) {
    this.workingState == "BBOX_MOVE" &&
      (i.stopPropagation(),
      (this.workingState = "SELECTED"),
      Y().saveAsHistory(),
      this.bboxElement && (this.bboxElement.style.cursor = "grab"));
  }
  bbox_transform(i, l) {
    this.bboxElement &&
      ((this.bboxElement.style.left = `${
        parseFloat(this.bboxElement.style.left) + i
      }px`),
      (this.bboxElement.style.top = `${
        parseFloat(this.bboxElement.style.top) + l
      }px`));
  }
  setupRemoveButton() {
    const i = document.createElement("div");
    return (
      (i.style.position = "absolute"),
      (i.style.left = "0"),
      (i.style.bottom = "0"),
      (i.style.width = "20px"),
      (i.style.height = "20px"),
      (i.style.backgroundColor = "white"),
      (i.style.color = "black"),
      (i.style.textAlign = "center"),
      (i.style.lineHeight = "20px"),
      (i.style.cursor = "pointer"),
      (i.style.border = "1px solid black"),
      (i.style.display = "flex"),
      (i.style.justifyContent = "center"),
      (i.style.alignItems = "center"),
      (i.innerHTML =
        '<svg style="width: 20px; height: 20px;"  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>'),
      i.addEventListener("click", () => {
        for (let l = 0; l < this.selectedObjects.length; l++)
          Y().removeLayer(this.selectedObjects[l]);
        this.disselect(), Y().saveAsHistory();
      }),
      i
    );
  }
  setupTransformButton() {
    const i = document.createElement("div");
    return (
      (i.style.position = "absolute"),
      (i.style.left = "0"),
      (i.style.top = "0"),
      (i.style.width = "20px"),
      (i.style.height = "20px"),
      (i.style.backgroundColor = "white"),
      (i.style.color = "black"),
      (i.style.textAlign = "center"),
      (i.style.lineHeight = "20px"),
      (i.style.cursor = "pointer"),
      (i.style.border = "1px solid black"),
      (i.style.display = "flex"),
      (i.style.justifyContent = "center"),
      (i.style.alignItems = "center"),
      (i.innerHTML =
        '<svg style="width: 20px; height: 20px;" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M440-40v-167l-44 43-56-56 140-140 140 140-56 56-44-43v167h-80ZM220-340l-56-56 43-44H40v-80h167l-43-44 56-56 140 140-140 140Zm520 0L600-480l140-140 56 56-43 44h167v80H753l43 44-56 56Zm-260-80q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0-180L340-740l56-56 44 43v-167h80v167l44-43 56 56-140 140Z"/></svg>'),
      i.addEventListener("click", () => {
        new Ni((p) => {
          if (p === null) return;
          const u = Y();
          this.context_drawSelected(p.x, p.y);
          for (let h = 0; h < this.selectedObjects.length; h++)
            u.transform(this.selectedObjects[h], p.x, p.y),
              u.rerender(this.selectedObjects[h]);
          Y().saveAsHistory(),
            this.bbox_transform(p.x / _.SCALE, p.y / _.SCALE);
        }).open();
      }),
      i
    );
  }
  setupBBox(i) {
    this.bboxRotate = 0;
    const l = document.createElement("div");
    l.classList.add("bbox"),
      (l.style.left = `${i[0].x / _.SCALE}px`),
      (l.style.top = `${i[0].y / _.SCALE}px`),
      (l.style.width = `${(i[2].x - i[0].x) / _.SCALE}px`),
      (l.style.height = `${(i[1].y - i[0].y) / _.SCALE}px`);
    const p = document.createElement("div");
    p.classList.add("bbox-tools"),
      p.appendChild(this.setupResize()),
      l.appendChild(this.setupRotate()),
      p.appendChild(this.setupRemoveButton()),
      p.appendChild(this.setupTransformButton()),
      l.appendChild(p),
      this.wk.appendChild(l),
      (this.bboxElement = l),
      this.bboxElement.addEventListener("mousedown", this.bbox_bindMDN),
      this.bboxElement.addEventListener("mousemove", this.bbox_bindMMV),
      this.bboxElement.addEventListener("mouseup", this.bbox_bindMUP);
  }
  destroyBBox() {
    this.bboxElement &&
      (this.wk.removeChild(this.bboxElement), (this.bboxElement = null));
  }
  disselect() {
    (this.selectedObjects = []),
      this.destroyBBox(),
      this.allowDrawing(),
      (this.workingState = "NONE"),
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  handleSelect(i) {
    this.selectedObjects = i;
    const l = Y();
    let p = i.map((h) => l.drawnPolygons[h]),
      u = Et(p);
    this.disallowDrawing(), this.setupBBox(u);
  }
  canvas_initState() {
    (this.canvas_state.dragging = !1),
      (this.canvas_state.polygon = []),
      (this.canvas_state.lastPos = { x: 0, y: 0 });
  }
  canvas_mouseDown(i) {
    (this.workingState = "SELECTING"),
      (this.canvas_state.dragging = !0),
      (this.canvas_state.polygon = []),
      this.canvas_state.polygon.push({
        x: (i.clientX - this.canvas.offsetLeft) * _.SCALE,
        y: (i.clientY - this.canvas.offsetTop) * _.SCALE,
      }),
      (this.canvas_state.lastPos = {
        x: this.canvas_state.polygon[0].x,
        y: this.canvas_state.polygon[0].y,
      });
  }
  canvas_mouseMove(i) {
    if (!this.canvas_state.dragging || this.workingState !== "SELECTING")
      return;
    const l = (i.clientX - this.canvas.offsetLeft) * _.SCALE,
      p = (i.clientY - this.canvas.offsetTop) * _.SCALE,
      u = l - this.canvas_state.lastPos.x,
      h = p - this.canvas_state.lastPos.y;
    if (!(u * u + h * h < 25 ** 2 * _.SCALE)) {
      this.canvas_state.polygon.push({ x: l, y: p }),
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height),
        (this.context.strokeStyle = "rgb(0, 0, 0)"),
        (this.context.fillStyle = "rgba(15, 15, 200, 0.3)"),
        (this.context.lineWidth = 3 * _.SCALE),
        this.context.setLineDash([6, 9]),
        this.context.beginPath(),
        this.context.moveTo(
          this.canvas_state.polygon[0].x,
          this.canvas_state.polygon[0].y
        );
      for (let y = 1; y < this.canvas_state.polygon.length; y++)
        this.context.lineTo(
          this.canvas_state.polygon[y].x,
          this.canvas_state.polygon[y].y
        );
      this.context.closePath(),
        this.context.stroke(),
        this.context.fill(),
        this.context.setLineDash([]),
        (this.canvas_state.lastPos = { x: l, y: p });
    }
  }
  canvas_mouseUp() {
    if (!this.canvas_state.dragging) return;
    console.log("Endup selecting with polygon", this.canvas_state.polygon),
      (this.canvas_state.dragging = !1),
      (this.workingState = "SELECTED"),
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const i = Y(),
      l = Object.keys(i.drawnPolygons),
      p = [];
    for (let u = 0; u < l.length; u++) {
      const h = l[u],
        y = i.drawnPolygons[h],
        f = wt(y),
        m = Oi(this.canvas_state.polygon, y);
      if (
        ((this.context.fillStyle = "rgba(15, 15, 200, 0.3)"),
        (this.context.lineWidth = 2 * _.SCALE),
        m.length === 0)
      )
        continue;
      let C = 0;
      for (let g = 0; g < m.length; g++) C += wt(m[g]);
      C / f < _.SELECT_RATIO || p.push(h);
    }
    p.length !== 0 && (this.handleSelect(p), this.context_drawSelected());
  }
  apply() {
    console.log("SelectTool Apply");
    const i = this.canvas_mouseDown.bind(this),
      l = this.canvas_mouseMove.bind(this),
      p = this.canvas_mouseUp.bind(this);
    return (
      this.canvas_initState(),
      this.canvas.addEventListener("mousedown", i),
      this.canvas.addEventListener("mousemove", l),
      document.addEventListener("mouseup", p),
      () => {
        this.canvas.removeEventListener("mousedown", i),
          this.canvas.removeEventListener("mousemove", l),
          document.removeEventListener("mouseup", p),
          this.allowDrawing(),
          this.destroyBBox(),
          this.disselect();
      }
    );
  }
}
class Xt {
  constructor(i) {
    E(this, "instanceElement");
    E(this, "drawnLayerParent");
    E(this, "drawnLayers", {});
    E(this, "drawnPolygons", {});
    E(this, "history", [{ idraw: {}, ipoly: {} }]);
    (this.instanceElement = document.createElement("div")),
      (this.instanceElement.className = "instance"),
      (this.drawnLayerParent = document.createElement("div")),
      (this.drawnLayerParent.className = "drawn-layer-parent"),
      this.instanceElement.appendChild(this.drawnLayerParent),
      i && this.importInstance(i);
  }
  clonedLayer() {
    let i = {};
    const l = Object.keys(this.drawnLayers);
    for (const p of l)
      i[p] = {
        c: this.drawnLayers[p].c,
        t: this.drawnLayers[p].t,
        d: JSON.stringify(this.drawnLayers[p].d),
      };
    return i;
  }
  saveAsHistory() {
    console.log(
      { ...this.history[this.history.length - 1].idraw },
      this.drawnLayers
    ),
      this.history.push({
        idraw: this.clonedLayer(),
        ipoly: { ...this.drawnPolygons },
      }),
      this.history.length > _.MAX_HISTORY && this.history.shift(),
      console.log("APD HIS");
  }
  drawnHistory2drawnLayer(i) {
    const l = {},
      p = Object.keys(i);
    for (const u of p) l[u] = { c: i[u].c, t: i[u].t, d: JSON.parse(i[u].d) };
    return l;
  }
  undo() {
    if (this.history.length < 2) return;
    this.history.pop();
    let i = this.history[this.history.length - 1];
    if (!i) return;
    console.log("FROM", { ...this.drawnLayers }, "TO", { ...i.idraw });
    const l = Object.keys(this.drawnLayers);
    for (let u = 0; u < l.length; u++) {
      const h = l[u];
      this.removeLayer(h);
    }
    (this.drawnLayers = this.drawnHistory2drawnLayer(i.idraw)),
      (this.drawnPolygons = i.ipoly);
    const p = Object.keys(this.drawnLayers);
    for (let u = 0; u < p.length; u++) {
      const h = p[u],
        y = this.drawnLayers[h];
      this.drawnLayerParent.appendChild(y.c), this.render(y.t, y.d, h, !1);
    }
  }
  drawLine(i, l) {
    return (
      (l.strokeStyle = i.strokeColor),
      (l.lineWidth = i.strokeWidth),
      l.setLineDash(i.strokeDashArray),
      l.beginPath(),
      l.moveTo(i.from.x, i.from.y),
      l.lineTo(i.to.x, i.to.y),
      l.stroke(),
      l.setLineDash([]),
      [i.from, i.to]
    );
  }
  drawRect(i) {
    return [
      i.leftTop,
      { x: i.leftTop.x + i.width, y: i.leftTop.y },
      { x: i.leftTop.x + i.width, y: i.leftTop.y + i.height },
      { x: i.leftTop.x, y: i.leftTop.y + i.height },
    ];
  }
  drawTriangle(i) {
    return i.points;
  }
  drawImage(i, l) {
    l.save();
    const p = Ot(
      i.left + i.width / 2,
      i.top + i.height / 2,
      i.width,
      i.height,
      i.rotate
    );
    let u = 0,
      h = 0;
    for (let y = 0; y < p.length; y++) (u += p[y].x), (h += p[y].y);
    return (
      (u /= p.length),
      (h /= p.length),
      l.translate(u, h),
      l.rotate((i.rotate * Math.PI) / 180),
      l.translate(-u, -h),
      l.drawImage(i.image, i.left, i.top, i.width, i.height),
      l.restore(),
      p
    );
  }
  drawPoly(i) {
    return i.points;
  }
  drawPolyToCanvas(i, l) {
    (l.strokeStyle = i.strokeColor),
      (l.fillStyle = i.fillColor),
      (l.lineWidth = i.strokeWidth),
      l.beginPath(),
      l.moveTo(i.points[0].x, i.points[0].y);
    for (let p = 1; p < i.points.length; p++)
      l.lineTo(i.points[p].x, i.points[p].y);
    l.closePath(), l.stroke(), l.fill();
  }
  rerender(i) {
    const l = this.drawnLayers[i];
    if (!l) return;
    const p = l.t;
    p.clearRect(0, 0, l.c.width, l.c.height);
    let u = l.d,
      h = [];
    switch (u.type) {
      case "line":
        h = pt(this.drawLine(u, p), u.strokeWidth);
        break;
      case "rect":
        h = this.drawRect(u);
        break;
      case "triangle":
        h = this.drawTriangle(u);
        break;
      case "image":
        h = this.drawImage(u, p);
        break;
      case "polygon":
        h = this.drawPoly(u);
        break;
    }
    if (wt(h) < (_.SCALE * 5) ** 2) {
      l.c.remove(), delete this.drawnLayers[i];
      return;
    }
    u.type != "image" &&
      u.type != "line" &&
      ((l.d = {
        fillColor: u.fillColor === "transparent" ? u.strokeColor : u.fillColor,
        points: h,
        strokeColor: "transparent",
        strokeWidth: 0,
        type: "polygon",
        z: u.z,
      }),
      (this.drawnLayers[i].d = l.d),
      this.drawPolyToCanvas(l.d, p)),
      (this.drawnPolygons[i] = h);
  }
  transform(i, l, p, u) {
    typeof u == "number" &&
      ((this.drawnLayers[i].c.style.zIndex = u.toString()),
      (this.drawnLayers[i].d.z = u)),
      (this.drawnPolygons[i] = this.drawnPolygons[i].map((h) => ({
        x: h.x + l,
        y: h.y + p,
      }))),
      this.drawnLayers[i].d.type === "image" &&
        ((this.drawnLayers[i].d.left += l), (this.drawnLayers[i].d.top += p)),
      this.drawnLayers[i].d.type === "rect" &&
        ((this.drawnLayers[i].d.leftTop.x += l),
        (this.drawnLayers[i].d.leftTop.y += p)),
      this.drawnLayers[i].d.type === "triangle" &&
        (this.drawnLayers[i].d.points = this.drawnLayers[i].d.points.map(
          (h) => ({ x: h.x + l, y: h.y + p })
        )),
      this.drawnLayers[i].d.type === "polygon" &&
        (this.drawnLayers[i].d.points = this.drawnLayers[i].d.points.map(
          (h) => ({ x: h.x + l, y: h.y + p })
        )),
      this.drawnLayers[i].d.type === "line" &&
        ((this.drawnLayers[i].d.from.x += l),
        (this.drawnLayers[i].d.from.y += p),
        (this.drawnLayers[i].d.to.x += l),
        (this.drawnLayers[i].d.to.y += p));
  }
  render(i, l, p, u = !0, h = !0) {
    if (
      (typeof i == "string" && (i = this.drawnLayers[i].t),
      typeof i == "string")
    )
      return;
    h && i.clearRect(0, 0, i.canvas.width, i.canvas.height),
      (i.canvas.style.zIndex = (l.z || st()).toString());
    let y = [];
    switch (l.type) {
      case "line":
        y = pt(this.drawLine(l, i), l.strokeWidth);
        break;
      case "rect":
        y = this.drawRect(l);
        break;
      case "triangle":
        y = this.drawTriangle(l);
        break;
      case "image":
        y = this.drawImage(l, i);
        break;
      case "polygon":
        y = this.drawPoly(l);
        break;
    }
    "fillColor" in l &&
      l.type != "polygon" &&
      (l.fillColor === "transparent"
        ? (y = pt(y, l.strokeWidth))
        : (y = Ht(y, l.strokeWidth / 2))),
      !(wt(y) < (_.SCALE * 5) ** 2) &&
        (l.type != "image" &&
          l.type != "line" &&
          ((l = {
            fillColor:
              l.fillColor === "transparent" ? l.strokeColor : l.fillColor,
            points: y,
            strokeColor: "transparent",
            strokeWidth: 0,
            type: "polygon",
            z: l.z,
          }),
          u && (this.drawnLayers[p].d = l),
          this.drawPolyToCanvas(l, i)),
        console.log("Instance render", l, p),
        u && (this.drawnPolygons[p] = y));
  }
  fabricAdd(i) {
    const l = Math.random().toString(36).substr(2, 9);
    i.z = i.z || st();
    const [p, u] = At();
    return (
      (p.width = _.SCALE * window.innerWidth),
      (p.height = _.SCALE * window.innerHeight),
      (p.style.position = "absolute"),
      (p.style.top = "0"),
      (p.style.left = "0"),
      (p.style.width = "100vw"),
      (p.style.height = "100vh"),
      (p.style.zIndex = i.z.toString()),
      p.setAttribute("data-id", l),
      this.drawnLayerParent.appendChild(p),
      (this.drawnLayers[l] = { c: p, t: u, d: i }),
      console.log("Instance fabricAdd", i, l),
      this.render(u, i, l),
      l
    );
  }
  removeLayer(i) {
    const l = this.drawnLayers[i];
    l &&
      (l.c.remove(), delete this.drawnLayers[i], delete this.drawnPolygons[i]);
  }
  async exportInstance() {
    const i = [],
      l = [],
      p = Object.values(this.drawnLayers);
    for (let y = 0; y < p.length; y++) {
      const f = p[y];
      if (f.d.type === "image") {
        const m = document.createElement("canvas");
        (m.width = f.d.image.width), (m.height = f.d.image.height);
        const C = m.getContext("2d");
        if (!C) continue;
        C.drawImage(f.d.image, 0, 0);
        const I = new Promise((g) => {
          m.toBlob((S) => {
            const D = URL.createObjectURL(S);
            console.log("IMGBLOB", D), g(S);
          }, "image/webp");
        });
        l.push(await (await I).arrayBuffer()),
          i.push(JSON.stringify({ idx: l.length - 1, ...f.d }));
        continue;
      }
      i.push(JSON.stringify(f.d));
    }
    const u = [];
    u.push(
      ...new TextEncoder().encode(
        l.length +
          `
`
      )
    ),
      l.forEach((y) => {
        let f = new Uint8Array(y);
        const m = f.byteLength.toString(36).padStart(10, "0");
        for (u.push(...new TextEncoder().encode(m)); f.length > 0; ) {
          const C = f.slice(0, 8192);
          (f = f.slice(1024 * 8)), u.push(...C);
        }
      });
    const h = i.join(";");
    return u.push(...new TextEncoder().encode(h)), new Uint8Array(u).buffer;
  }
  async importInstance(i) {
    let l = "";
    for (let m = 0; m < i.byteLength; m++)
      if (
        String.fromCharCode(new Uint8Array(i.slice(m, m + 1))[0]) ===
        `
`
      ) {
        (l = String.fromCharCode(...new Uint8Array(i.slice(0, m)))),
          (i = i.slice(m + 1));
        break;
      }
    const p = Number(l);
    p > 0 && (i = i.slice(1));
    const u = [];
    for (let m = 0; m < p; m++) {
      const C = String.fromCharCode(...new Uint8Array(i.slice(0, 9))),
        I = parseInt(C, 36),
        g = new ArrayBuffer(I);
      new Uint8Array(g).set(new Uint8Array(i.slice(9, 9 + I))),
        (i = i.slice(9 + I + (m == p - 1 ? 0 : 1)));
      const D = new Blob([g], { type: "image/webp" }),
        W = URL.createObjectURL(D);
      u.push(W);
    }
    const h = new Uint8Array(i),
      f = String.fromCharCode(...h).split(";");
    for (let m = 0; m < f.length; m++) {
      let C = f[m];
      const I = JSON.parse(C);
      if (I.type === "image") {
        const S = new Image();
        (S.src = u[I.idx]),
          await new Promise((D) => {
            S.onload = D;
          }),
          (I.image = S),
          delete I.idx;
      }
      this.fabricAdd(I);
    }
  }
  async exportImage() {
    const [i, l] = At();
    let p = Object.keys(this.drawnLayers).map((u, h) => [u, h]);
    (p = p.sort(
      (u, h) =>
        this.drawnLayers[u[0]].d.z - this.drawnLayers[h[0]].d.z || u[1] - h[1]
    )),
      l.clearRect(0, 0, i.width, i.height),
      (l.fillStyle = "white"),
      l.fillRect(0, 0, i.width, i.height);
    for (let u = 0; u < p.length; u++) {
      const h = p[u][0],
        y = this.drawnLayers[h];
      y && (console.log("RENDER", h, y.d), this.render(l, y.d, h, !1, !1));
    }
    return i.toDataURL("image/png");
  }
}
class Bi {
  constructor(i) {
    E(this, "modal");
    E(this, "textarea");
    E(this, "confirmButton");
    E(this, "cancelButton");
    (this.onDone = i),
      (this.modal = document.createElement("div")),
      (this.modal.style.position = "fixed"),
      (this.modal.style.top = "0"),
      (this.modal.style.left = "0"),
      (this.modal.style.width = "100%"),
      (this.modal.style.height = "100%"),
      (this.modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)"),
      (this.modal.style.display = "flex"),
      (this.modal.style.justifyContent = "center"),
      (this.modal.style.alignItems = "center"),
      (this.modal.style.zIndex = "1000000000");
    const l = document.createElement("div");
    (l.style.backgroundColor = "#fff"),
      (l.style.padding = "20px"),
      (l.style.borderRadius = "8px"),
      (l.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"),
      (l.style.maxWidth = "400px"),
      (l.style.width = "100%"),
      (l.style.boxSizing = "border-box"),
      (this.textarea = document.createElement("textarea")),
      (this.textarea.style.width = "100%"),
      (this.textarea.style.height = "100px"),
      (this.textarea.style.marginBottom = "20px"),
      (this.textarea.style.padding = "10px"),
      (this.textarea.style.border = "1px solid #ccc"),
      (this.textarea.style.borderRadius = "4px"),
      (this.textarea.style.boxSizing = "border-box"),
      (this.confirmButton = document.createElement("button")),
      (this.confirmButton.textContent = "Confirm"),
      (this.confirmButton.style.marginRight = "10px"),
      (this.confirmButton.style.padding = "10px 20px"),
      (this.confirmButton.style.border = "none"),
      (this.confirmButton.style.backgroundColor = "#007bff"),
      (this.confirmButton.style.color = "#fff"),
      (this.confirmButton.style.borderRadius = "4px"),
      (this.confirmButton.style.cursor = "pointer"),
      (this.cancelButton = document.createElement("button")),
      (this.cancelButton.textContent = "Cancel"),
      (this.cancelButton.style.padding = "10px 20px"),
      (this.cancelButton.style.border = "none"),
      (this.cancelButton.style.backgroundColor = "#ccc"),
      (this.cancelButton.style.color = "#000"),
      (this.cancelButton.style.borderRadius = "4px"),
      (this.cancelButton.style.cursor = "pointer"),
      l.appendChild(this.textarea),
      l.appendChild(this.confirmButton),
      l.appendChild(this.cancelButton),
      this.modal.appendChild(l),
      this.confirmButton.addEventListener("click", () => this.onConfirm()),
      this.cancelButton.addEventListener("click", () => this.onCancel());
  }
  onConfirm() {
    const i = this.textarea.value;
    this.onDone(i), this.close();
  }
  onCancel() {
    this.onDone(null), this.close();
  }
  close() {
    this.modal.parentElement &&
      this.modal.parentElement.removeChild(this.modal);
  }
  open() {
    document.body.appendChild(this.modal), this.textarea.focus();
  }
}
function Di(P) {
  const i = document.createElement("canvas"),
    l = i.getContext("2d");
  if (!l) throw new Error("Failed to get canvas context");
  const p = 48,
    u = p * 1.4;
  l.font = `${p}px Arial`;
  const h = P.split(`
`),
    y = Math.max(...h.map((g) => l.measureText(g).width));
  (i.width = Math.ceil(y) + 20),
    (i.height = Math.ceil(h.length * u)),
    (l.font = `${p}px Arial`),
    (l.textBaseline = "top"),
    (l.fillStyle = "#000000"),
    h.forEach((g, S) => {
      const W = S * u;
      l.fillText(g, 10, W);
    });
  const f = h.length * u,
    m = document.createElement("canvas");
  (m.width = i.width), (m.height = Math.ceil(f));
  const C = m.getContext("2d");
  if (!C) throw new Error("Failed to get final canvas context");
  C.drawImage(i, 0, 0, i.width, f);
  const I = new Image();
  return (I.src = m.toDataURL("image/webp")), I;
}
let M = [new Xt()],
  q = 0,
  Y = () => M[q],
  nt = (P) => {
    M[q].fabricAdd(P), console.log("Add object!", q, P);
  },
  Mi = (P, i, l, p) => {
    M[q].transform(P, i, l, p);
  },
  Zt = async () => {
    const P = [],
      i = new Uint8Array(
        new TextEncoder().encode(M.length.toString(36).padStart(10, "0"))
      );
    for (let u = 0; u < M.length; u++) {
      const h = await M[u].exportInstance(),
        y = h.byteLength.toString(36).padStart(10, "0"),
        f = new Uint8Array(new TextEncoder().encode(y));
      P.push(f.buffer), P.push(h);
    }
    const l = new Blob([i, ...P], { type: "application/octet-stream" });
    return URL.createObjectURL(l);
  };
window.exportInstance = Zt;
window.instances = M;
const ki = () => {
  var ct, dt, mt, vt, Q, Pt, xt, Ct, Lt, It;
  const P = document.getElementById("app");
  document.addEventListener("keydown", (T) => {
    T.shiftKey && lt("SHIFT", !0);
  }),
    document.addEventListener("keyup", (T) => {
      T.shiftKey || lt("SHIFT", !1);
    }),
    (ct = document.getElementById("selectTool")) == null ||
      ct.addEventListener("click", (T) => {
        T.preventDefault(), T.stopImmediatePropagation(), T.stopPropagation();
      });
  const [i, l] = At();
  (i.id = "draw-layer"),
    i.addEventListener("mousedown", () => {
      var T;
      (T = document.getElementById("disup")) == null || T.classList.add("hide");
    }),
    i.addEventListener("mouseup", () => {
      var T;
      (T = document.getElementById("disup")) == null ||
        T.classList.remove("hide");
    }),
    (dt = document.getElementById("drawnLayer")) == null || dt.appendChild(i);
  const p = document.getElementById("drawnLayer");
  if (!p) return;
  p.appendChild(M[0].instanceElement);
  const u = (T) => {
    var k;
    const B = (k = T.clipboardData) == null ? void 0 : k.items;
    if (B)
      for (let R = 0; R < B.length; R++) {
        if (B[R].type.indexOf("image") === -1) continue;
        const H = B[R].getAsFile();
        if (!H) continue;
        const Z = new FileReader();
        (Z.onload = (j) => {
          var G;
          const J = new Image();
          (J.src = (G = j.target) == null ? void 0 : G.result),
            (J.onload = () => {
              const [et, V] = [J.width, J.height];
              let it = 1;
              et > window.innerWidth && (it = window.innerWidth / et),
                V * it > window.innerHeight && (it = window.innerHeight / V),
                nt({
                  type: "image",
                  image: J,
                  left: ((window.innerWidth - et * it) / 2) * _.SCALE,
                  top: ((window.innerHeight - V * it) / 2) * _.SCALE,
                  rotate: 0,
                  width: et * it,
                  height: V * it,
                  z: st(),
                });
            });
        }),
          Z.readAsDataURL(H);
      }
  };
  document.addEventListener("paste", u);
  const h = { canvas: i, context: l, app: P };
  let y = [
      new Yi(h),
      new Ai(h),
      new Si(h),
      new kt(h),
      new kt(h),
      new wi(h),
      new Ei(h),
      new gi(h),
    ],
    f = 0,
    m = y[f].apply();
  const C = document.querySelectorAll("button.tool-button");
  C[f].classList.add("active");
  for (let T = 0; T < C.length; T++)
    C[T].addEventListener("click", () => {
      C[f].classList.remove("active"),
        C[T].classList.add("active"),
        m(),
        (f = T),
        (m = y[f].apply());
    });
  const I = document.querySelectorAll("button.toggle-button");
  for (let T = 0; T < I.length; T++) {
    const B = I[T].getAttribute("data-config");
    if (!B) continue;
    A(B) && I[T].classList.add("active"),
      I[T].addEventListener("click", () => {
        const R = !A(B);
        lt(B, R),
          R ? I[T].classList.add("active") : I[T].classList.remove("active");
      });
  }
  let g = 0;
  const S = document.querySelectorAll(".colorwrp");
  S.forEach((T, B) => {
    (T.children[0].style.background = T.children[1].value),
      T.addEventListener("click", () => {
        g == B ? T.children[1].click() : S[g].classList.remove("focus"),
          (g = B),
          T.classList.add("focus"),
          lt("PENCOLOR", T.children[1].value);
      }),
      T.children[1].addEventListener("input", () => {
        (T.children[0].style.background = T.children[1].value),
          lt("PENCOLOR", T.children[1].value);
      });
  });
  const D = document.querySelectorAll("#strokes > .strkel"),
    W = document.getElementById("selstk"),
    $ = [3, 9, 15];
  D.forEach((T, B) => {
    T.addEventListener("click", () => {
      W && (W.style.left = `calc(1.5rem * ${B})`), lt("PENSTROKE", $[B]);
    });
  }),
    console.log("Load instance!"),
    (mt = document.getElementById("export")) == null ||
      mt.addEventListener("click", async () => {
        const T = await Zt(),
          B = document.createElement("a");
        (B.href = T), (B.download = "instance.bin"), B.click();
      }),
    (vt = document.getElementById("import")) == null ||
      vt.addEventListener("click", async () => {
        console.log("IMPORT!");
        const T = document.createElement("input");
        (T.type = "file"),
          (T.accept = ".bin"),
          (T.onchange = async (B) => {
            var j;
            const k = (j = B.target.files) == null ? void 0 : j[0];
            if (!k) return;
            const R = await k.arrayBuffer(),
              H = parseInt(
                new TextDecoder().decode(new Uint8Array(R.slice(0, 10))),
                36
              );
            let Z = 10;
            (M.length = 0), console.log("Instance count", H);
            for (const J of M) J.instanceElement.remove();
            M.length = 0;
            for (let J = 0; J < H; J++) {
              const G = parseInt(
                new TextDecoder().decode(new Uint8Array(R.slice(Z, Z + 10))),
                36
              );
              console.log("Instance size", G),
                (Z += 10),
                M.push(new Xt()),
                (M[M.length - 1].instanceElement.style.display = "none"),
                p.appendChild(M[M.length - 1].instanceElement),
                await M[M.length - 1].importInstance(R.slice(Z, Z + G)),
                (Z += G);
            }
            (q = 0),
              (M[q].instanceElement.style.display = "block"),
              U(),
              C[0].click();
          }),
          T.click();
      });
  const U = () => {
    const T = document.getElementById("pageindi");
    T && ((T.innerHTML = `${q + 1}/${M.length}`), C[f].click());
  };
  (Q = document.getElementById("left")) == null ||
    Q.addEventListener("click", () => {
      (M[q].instanceElement.style.display = "none"),
        (q = Math.max(0, q - 1)),
        (M[q].instanceElement.style.display = "block"),
        U();
    }),
    (Pt = document.getElementById("right")) == null ||
      Pt.addEventListener("click", () => {
        (M[q].instanceElement.style.display = "none"),
          q == M.length - 1 &&
            (M.push(new Xt()), p.appendChild(M[M.length - 1].instanceElement)),
          (q = q + 1),
          (M[q].instanceElement.style.display = "initial"),
          U();
      }),
    (xt = document.getElementById("undo")) == null ||
      xt.addEventListener("click", () => {
        console.log("UNDO!"), M[q].undo();
      }),
    (Ct = document.getElementById("wincap")) == null ||
      Ct.addEventListener("click", () => {
        window.require("electron").ipcRenderer.send("wincap");
      }),
    (Lt = document.getElementById("pdf")) == null ||
      Lt.addEventListener("click", async (T) => {
        T.target.style.background = "black";
        const B = [];
        for (let H = 0; H < M.length; H++) B.push(await M[H].exportImage());
        const k = window.innerWidth,
          R = window.innerHeight;
        window.require("electron").ipcRenderer.send("pdf", [k, R, B]),
          (T.target.style.background = "");
      });
  try {
    let T = { width: 0, height: 0 };
    require("electron").ipcRenderer.on("cap", (B, k) => {
      console.log(k);
      const R = new Image();
      (R.src = "image://png"),
        (R.onload = () => {
          console.log("IMAGE SCALE", R.width / T.width);
          const H = R.width / T.width,
            Z = document.createElement("canvas"),
            j = Z.getContext("2d");
          if (!j) return;
          (Z.width = R.width), (Z.height = R.height), j.drawImage(R, 0, 0);
          const J = j.getImageData(
              k.start.x * H,
              k.start.y * H,
              (k.end.x - k.start.x) * H,
              (k.end.y - k.start.y) * H
            ),
            G = document.createElement("canvas"),
            et = G.getContext("2d");
          if (!et) return;
          (G.width = (k.end.x - k.start.x) * H),
            (G.height = (k.end.y - k.start.y) * H),
            et.putImageData(J, 0, 0);
          const V = new Image();
          (V.src = G.toDataURL()),
            (V.onload = () => {
              console.log(V.width, V.height, k, G.width, G.height),
                nt({
                  type: "image",
                  image: V,
                  left: 0,
                  top: 0,
                  rotate: 0,
                  width: V.width,
                  height: V.height,
                  z: st(),
                });
            });
        });
    }),
      require("electron").ipcRenderer.on("screen", (B, k) => {
        T = k;
      });
  } catch {}
  (It = document.getElementById("textbtn")) == null ||
    It.addEventListener("click", () => {
      new Bi((B) => {
        if (!B) return;
        const k = Di(B);
        k.onload = () => {
          const [R, H] = [k.width, k.height];
          let Z = 1;
          R > window.innerWidth && (Z = window.innerWidth / R),
            H * Z > window.innerHeight && (Z = window.innerHeight / H),
            nt({
              type: "image",
              image: k,
              left: ((window.innerWidth - R * Z) / 2) * _.SCALE,
              top: ((window.innerHeight - H * Z) / 2) * _.SCALE,
              rotate: 0,
              width: R * Z,
              height: H * Z,
              z: st(),
            });
        };
      }).open();
    });
};
ki();
