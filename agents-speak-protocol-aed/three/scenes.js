/* Agents Speak Protocol — AED deck, experimental three.js scenes (r128, UMD, vendored).
 *
 * One scene replaces one SVG diagram (build.py --3d emits an aspect-matched mount).
 * Choreography is unchanged: build.py emits invisible .beat-trigger fragments with the
 * same data-fragment-index as the SVG they replace, so slides, notes, timings and the
 * click count are identical to the rehearsed flat deck.
 * Animation is speaker-driven: a slow ambient loop plus one beat per fragment reveal.
 * Escape hatches: deck-3d.html?flat=1 -> index.html; ?print-pdf and
 * prefers-reduced-motion render a static frame (all revealed beats, no loop).
 */
(function () {
  'use strict';
  if (!window.THREE || !window.Reveal) return;

  var STATIC = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || /[?&]print-pdf/.test(location.search)
    || (typeof Reveal.isPrintingPDF === 'function' && Reveal.isPrintingPDF());

  var FALLBACK = { model: '#ffbb71', tool: '#79dfc4', agent: '#c3adff', line: '#3c4d5f', surface: '#16212c', ink: '#f2efe7', dim: '#adb9c6' };

  function css(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  function theme() {
    return {
      model: css('--model', FALLBACK.model),
      tool: css('--tool', FALLBACK.tool),
      agent: css('--agent', FALLBACK.agent),
      line: css('--line', FALLBACK.line),
      surface: css('--surface', FALLBACK.surface),
      ink: css('--ink', FALLBACK.ink),
      dim: css('--dim', FALLBACK.dim)
    };
  }

  // ---------- shared renderer (single WebGL context, canvas reparented per slide) ----------
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  var canvas = renderer.domElement;
  canvas.className = 'scene-canvas';

  function color(hex) { return new THREE.Color(hex); }
  // Exponential approach toward a target; snaps when static rendering is required.
  function step(cur, target, dt, k) {
    if (STATIC) return target;
    var f = 1 - Math.exp(-(k || 6) * dt);
    return cur + (target - cur) * f;
  }

  function labelSprite(text, hex, worldH, opts) {
    opts = opts || {};
    var fs = 44, pad = 14, dpr = 2;
    var font = (opts.mono ? '' : '600 ')
      + fs + 'px ' + (opts.mono ? 'ui-monospace, monospace' : 'system-ui, sans-serif');
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    ctx.font = font;
    c.width = (Math.ceil(ctx.measureText(text).width) + pad * 2) * dpr;
    c.height = (fs + pad * 2) * dpr;
    ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.font = font;
    ctx.fillStyle = hex;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, pad, (fs + pad * 2) / 2);
    var tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: opts.opacity != null ? opts.opacity : 1 });
    var sprite = new THREE.Sprite(mat);
    var h = worldH || 24;
    sprite.scale.set(h * (c.width / dpr) / (c.height / dpr), h, 1);
    return sprite;
  }

  function makeNode(w, h, d, edgeHex, label, labelHex) {
    var group = new THREE.Group();
    var geo = new THREE.BoxGeometry(w, h, d);
    var fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: color(css('--surface', FALLBACK.surface)), transparent: true, opacity: 0.94, depthWrite: false }));
    var edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: color(edgeHex), transparent: true, opacity: 0.95 }));
    group.add(fill);
    group.add(edges);
    if (label) {
      var s = labelSprite(label, labelHex || css('--ink', FALLBACK.ink), 21);
      s.position.set(0, 0, d / 2 + 1);
      group.add(s);
    }
    group.traverse(function (o) { if (o.material) o.userData.baseOpacity = o.material.opacity; });
    group.userData.setOpacity = function (v) {
      group.traverse(function (o) { if (o.material) o.material.opacity = o.userData.baseOpacity * v; });
    };
    return group;
  }

  function makeLine(points, hex, opacity, dashed) {
    var geo = new THREE.BufferGeometry().setFromPoints(points);
    var mat = dashed
      ? new THREE.LineDashedMaterial({ color: color(hex), transparent: true, opacity: opacity == null ? 0.6 : opacity, dashSize: 10, gapSize: 8 })
      : new THREE.LineBasicMaterial({ color: color(hex), transparent: true, opacity: opacity == null ? 0.7 : opacity });
    var line = new THREE.Line(geo, mat);
    if (dashed) line.computeLineDistances();
    line.userData.baseOpacity = mat.opacity;
    return line;
  }

  function makeCurveLine(from, to, sag, hex, opacity) {
    var mid = from.clone().lerp(to, 0.5);
    mid.y -= sag;
    var curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    var line = makeLine(curve.getPoints(60), hex, opacity);
    line.userData.curve = curve;
    return line;
  }

  function makeFlow(curve, hex, count, size, speed) {
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    var points = new THREE.Points(geo, new THREE.PointsMaterial({ color: color(hex), size: size || 4, transparent: true, opacity: 0.9 }));
    var t = Math.random();
    points.userData.tick = function (dt) {
      t = (t + (speed || 0.22) * dt) % 1;
      var arr = geo.attributes.position.array;
      for (var i = 0; i < count; i++) {
        var p = curve.getPoint((t + i / count) % 1);
        arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z;
      }
      geo.attributes.position.needsUpdate = true;
    };
    return points;
  }

  function cameraFor(z, y) {
    var camera = new THREE.PerspectiveCamera(40, 2, 1, 4000);
    camera.position.set(0, y || 0, z);
    return camera;
  }

  // ---------- scenes ----------
  function buildCover() {
    var T = theme();
    var sc = new THREE.Scene();
    var camera = cameraFor(840);
    var g = new THREE.Group();
    sc.add(g);
    var N = 46, nodes = [], pos = new Float32Array(N * 3), i;
    for (i = 0; i < N; i++) {
      var v = new THREE.Vector3((Math.random() * 2 - 1) * 430, (Math.random() * 2 - 1) * 155, (Math.random() * 2 - 1) * 130);
      nodes.push(v);
      pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
    }
    var ngeo = new THREE.BufferGeometry();
    ngeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.add(new THREE.Points(ngeo, new THREE.PointsMaterial({ color: color(T.dim), size: 3.5, transparent: true, opacity: 0.85 })));
    var palette = [T.model, T.tool, T.agent], flows = [];
    for (i = 0; i < 7; i++) {
      var a = nodes[(i * 5) % N], b = nodes[(i * 11 + 7) % N];
      var mid = a.clone().lerp(b, 0.5);
      var dir = b.clone().sub(a).normalize();
      mid.add(new THREE.Vector3(-dir.y, dir.x, 0).multiplyScalar(95));
      var curve = new THREE.CatmullRomCurve3([a, mid, b]);
      g.add(makeLine(curve.getPoints(50), palette[i % 3], 0.16));
      var flow = makeFlow(curve, palette[i % 3], 9, 3.2, 0.13 + 0.015 * i);
      g.add(flow);
      flows.push(flow);
    }
    return {
      three: sc, camera: camera,
      apply: function () {},
      tick: function (t, dt) {
        g.rotation.y = Math.sin(t * 0.07) * 0.1;
        g.rotation.x = Math.sin(t * 0.05) * 0.04;
        flows.forEach(function (f) { f.userData.tick(dt); });
        camera.position.x = Math.sin(t * 0.09) * 14;
        camera.lookAt(0, 0, 0);
      }
    };
  }

  function buildReplace() {
    var T = theme();
    var sc = new THREE.Scene();
    var camera = cameraFor(880, 20);
    var g = new THREE.Group();
    sc.add(g);
    var app = makeNode(200, 150, 90, T.ink, 'Application');
    app.position.set(-330, 0, 0);
    g.add(app);
    var pg = new THREE.PlaneGeometry(16, 190);
    var contract = new THREE.Group();
    contract.add(new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })));
    contract.add(new THREE.LineSegments(new THREE.EdgesGeometry(pg), new THREE.LineBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.9 })));
    var cLabel = labelSprite('Contract', T.tool, 23);
    cLabel.position.set(0, 132, 0);
    contract.add(cLabel);
    g.add(contract);
    var A = makeNode(170, 120, 80, T.model, 'Implementation A');
    A.position.set(210, 0, 0);
    g.add(A);
    var B = makeNode(170, 120, 80, T.tool, 'Implementation B');
    B.position.set(740, 0, -180);
    B.userData.setOpacity(0);
    g.add(B);
    var st = { n: 0, pulse: 0 };
    return {
      three: sc, camera: camera,
      apply: function (n) { st.n = n; if (n >= 1) st.pulse = 1; },
      tick: function (t, dt) {
        var swap = st.n >= 1;
        st.aOp = step(st.aOp == null ? 1 : st.aOp, swap ? 0.12 : 1, dt, 3.4);
        A.userData.setOpacity(st.aOp);
        A.position.x = step(A.position.x, swap ? 580 : 210, dt, 3.2);
        A.position.z = step(A.position.z, swap ? -240 : 0, dt, 3.2);
        st.bOp = step(st.bOp == null ? 0 : st.bOp, swap ? 1 : 0, dt, 3.4);
        B.userData.setOpacity(st.bOp);
        B.position.x = step(B.position.x, swap ? 210 : 740, dt, 3.2);
        B.position.z = step(B.position.z, swap ? 0 : -180, dt, 3.2);
        st.pulse = Math.max(0, st.pulse - dt * 0.55);
        contract.scale.setScalar(1 + st.pulse * 0.07 * (0.5 + 0.5 * Math.cos((1 - st.pulse) * Math.PI * 3)));
        camera.position.x = Math.sin(t * 0.1) * 10;
        camera.lookAt(0, 0, 0);
      }
    };
  }

  function buildMap() {
    var T = theme();
    var sc = new THREE.Scene();
    var camera = cameraFor(900);
    var ringG = new THREE.Group();
    sc.add(ringG);
    var core = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(46, 0)),
      new THREE.LineBasicMaterial({ color: color(T.ink), transparent: true, opacity: 0.9 })
    );
    sc.add(core);
    var ellipse = new THREE.EllipseCurve(0, 0, 440, 215, 0, Math.PI * 2, false, 0);
    ringG.add(makeLine(ellipse.getPoints(90).map(function (p) { return new THREE.Vector3(p.x, p.y, 0); }), T.line, 0.16));
    var defs = [
      { label: 'Models', c: T.model, main: true },
      { label: 'Tools / MCP', c: T.tool, main: true },
      { label: 'Peers / A2A', c: T.agent, main: true },
      { label: 'UI', c: T.dim }, { label: 'Instructions', c: T.dim }, { label: 'Skills', c: T.dim },
      { label: 'Observability', c: T.dim }, { label: 'Client / IDE', c: T.dim }
    ];
    var secondary = [];
    var halos = [];
    defs.forEach(function (d, i) {
      var ang = (-90 + i * 45) * Math.PI / 180;
      var node = makeNode(d.main ? 120 : 92, d.main ? 76 : 60, 40, d.c, d.label, d.main ? d.c : T.dim);
      node.position.set(Math.cos(ang) * 440, Math.sin(ang) * 215, 0);
      node.userData.setOpacity(d.main ? 1 : 0.08);
      ringG.add(node);
      if (!d.main) secondary.push(node);
      else {
        var halo = new THREE.Mesh(
          new THREE.TorusGeometry(78, 2.2, 8, 48),
          new THREE.MeshBasicMaterial({ color: color(d.c), transparent: true, opacity: 0.3 })
        );
        halo.position.copy(node.position);
        ringG.add(halo);
        halos.push(halo);
      }
    });
    var st = { n: 0 };
    return {
      three: sc, camera: camera,
      apply: function (n) { st.n = n; },
      tick: function (t, dt) {
        var target = st.n >= 1 ? 0.75 : 0.08;
        secondary.forEach(function (node) {
          node.userData.op = step(node.userData.op == null ? 0.08 : node.userData.op, target, dt, 4);
          node.userData.setOpacity(node.userData.op);
        });
        ringG.rotation.z = Math.sin(t * 0.06) * 0.05;
        core.rotation.y = t * 0.25;
        halos.forEach(function (halo, i) { halo.scale.setScalar(1 + Math.sin(t * 1.8 + i * 2.1) * 0.06); });
        camera.position.x = Math.sin(t * 0.08) * 12;
        camera.lookAt(0, 0, 0);
      }
    };
  }

  function buildWiring() {
    var T = theme();
    var sc = new THREE.Scene();
    var camera = cameraFor(900);
    var g = new THREE.Group();
    sc.add(g);
    var apps = [-110, 0, 110].map(function (y) {
      var node = makeNode(150, 90, 50, T.ink);
      node.position.set(-400, y, 0);
      g.add(node);
      return node;
    });
    var services = [-165, -55, 55, 165].map(function (y) {
      var node = makeNode(150, 90, 50, T.ink);
      node.position.set(400, y, 0);
      g.add(node);
      return node;
    });
    var twelve = [];
    apps.forEach(function (a, ai) {
      services.forEach(function (s, si) {
        var line = makeCurveLine(
          new THREE.Vector3(-325, a.position.y, 0), new THREE.Vector3(325, s.position.y, 0),
          30 + ((ai + si) % 2) * 35, T.dim, 0.5);
        g.add(line);
        twelve.push(line);
      });
    });
    var hub = new THREE.Group();
    hub.add(new THREE.Mesh(new THREE.TorusGeometry(58, 3, 8, 48), new THREE.MeshBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.85 })));
    hub.add(new THREE.Mesh(new THREE.TorusGeometry(38, 1.6, 8, 40), new THREE.MeshBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.5 })));
    hub.scale.setScalar(0.001);
    g.add(hub);
    var seven = [];
    apps.forEach(function (a) {
      var line = makeCurveLine(new THREE.Vector3(-325, a.position.y, 0), new THREE.Vector3(0, 0, 0), 24, T.tool, 0.85);
      line.geometry.setDrawRange(0, 0);
      g.add(line);
      seven.push(line);
    });
    services.forEach(function (s) {
      var line = makeCurveLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(325, s.position.y, 0), 24, T.tool, 0.85);
      line.geometry.setDrawRange(0, 0);
      g.add(line);
      seven.push(line);
    });
    var st = { n: 0, draw: 0 };
    return {
      three: sc, camera: camera,
      apply: function (n) { st.n = n; },
      tick: function (t, dt) {
        var collapse = st.n >= 1;
        twelve.forEach(function (line, i) {
          line.material.opacity = step(line.material.opacity, collapse ? 0.07 : 0.5, dt, 4);
          if (!collapse) {
            var ph = (t * 0.22 + i * 0.085) % 1;
            var drawn = ph < 0.72 ? ph / 0.72 : 1;
            line.geometry.setDrawRange(0, Math.floor(drawn * 60) + 1);
          }
        });
        hub.scale.setScalar(step(hub.scale.x, collapse ? 1 : 0.001, dt, 5));
        hub.rotation.z = t * 0.4;
        if (collapse) {
          st.draw = Math.min(1, st.draw + dt * 0.5);
          seven.forEach(function (line, i) {
            var local = Math.max(0, Math.min(1, (st.draw - i * 0.1) / 0.7));
            line.geometry.setDrawRange(0, Math.floor(local * 60) + 1);
          });
        } else st.draw = 0;
        camera.position.x = Math.sin(t * 0.09) * 10;
        camera.lookAt(0, 0, 0);
      }
    };
  }

  function buildMcp() {
    var T = theme();
    var sc = new THREE.Scene();
    var camera = cameraFor(880, 10);
    var g = new THREE.Group();
    sc.add(g);
    var host = makeNode(260, 170, 100, T.ink, 'Host');
    host.position.set(-330, 0, 0);
    g.add(host);
    var client = makeNode(90, 70, 60, T.tool);
    client.position.set(-60, 0, 0);
    g.add(client);
    var server = makeNode(170, 110, 80, T.tool, 'MCP server', T.tool);
    server.position.set(200, 0, 0);
    g.add(server);
    var e1 = makeCurveLine(new THREE.Vector3(-200, 0, 0), new THREE.Vector3(-105, 0, 0), 0, T.tool, 0.85);
    var e2 = makeCurveLine(new THREE.Vector3(-15, 0, 0), new THREE.Vector3(115, 0, 0), 0, T.tool, 0.85);
    g.add(e1); g.add(e2);
    var f1 = makeFlow(e1.userData.curve, T.tool, 4, 4, 0.5);
    var f2 = makeFlow(e2.userData.curve, T.tool, 4, 4, 0.5);
    g.add(f1); g.add(f2);
    var api = makeNode(190, 110, 70, T.dim, 'Domain API', T.dim);
    api.position.set(470, 0, -150);
    api.userData.setOpacity(0);
    g.add(api);
    var apiEdge = makeCurveLine(new THREE.Vector3(285, 0, -20), new THREE.Vector3(375, 0, -120), 30, T.dim, 0.5);
    apiEdge.userData.baseOpacity = apiEdge.material.opacity;
    apiEdge.material.opacity = 0;
    g.add(apiEdge);
    var st = { n: 0 };
    return {
      three: sc, camera: camera,
      apply: function (n) { st.n = n; },
      tick: function (t, dt) {
        var show = st.n >= 1;
        api.userData.op = step(api.userData.op == null ? 0 : api.userData.op, show ? 1 : 0, dt, 4);
        api.userData.setOpacity(api.userData.op);
        apiEdge.material.opacity = apiEdge.userData.baseOpacity * api.userData.op;
        f1.userData.tick(dt); f2.userData.tick(dt);
        camera.position.x = Math.sin(t * 0.1) * 10;
        camera.lookAt(0, 0, 0);
      }
    };
  }

  function buildA2a() {
    var T = theme();
    var sc = new THREE.Scene();
    var camera = cameraFor(920);
    var g = new THREE.Group();
    sc.add(g);
    var caller = makeNode(160, 110, 70, T.ink);
    caller.position.set(-380, 0, 0);
    g.add(caller);
    var perimeter = new THREE.Group();
    perimeter.position.set(220, 0, 0);
    perimeter.add(new THREE.Mesh(new THREE.SphereGeometry(210, 20, 14), new THREE.MeshBasicMaterial({ color: color(T.agent), transparent: true, opacity: 0.05, depthWrite: false })));
    perimeter.add(new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(210, 16, 10)), new THREE.LineBasicMaterial({ color: color(T.agent), transparent: true, opacity: 0.14 })));
    var pLabel = labelSprite('remote agent', T.agent, 23);
    pLabel.position.set(0, 258, 0);
    perimeter.add(pLabel);
    g.add(perimeter);
    var card = new THREE.Group();
    card.position.set(-30, 70, 40);
    var cardGeo = new THREE.PlaneGeometry(140, 86);
    card.add(new THREE.Mesh(cardGeo, new THREE.MeshBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false })));
    card.add(new THREE.LineSegments(new THREE.EdgesGeometry(cardGeo), new THREE.LineBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.9 })));
    var cardLabel = labelSprite('Agent Card', T.tool, 20);
    cardLabel.position.set(0, -72, 0);
    card.add(cardLabel);
    card.scale.setScalar(0.001);
    g.add(card);
    var internals = new THREE.Group();
    internals.position.set(220, 0, 0);
    var iNodes = [];
    [[-60, 40], [40, 90], [10, -70]].forEach(function (p) {
      var node = makeNode(80, 56, 40, T.dim);
      node.position.set(p[0], p[1], 0);
      internals.add(node);
      iNodes.push(node);
    });
    internals.add(makeLine([iNodes[0].position.clone(), iNodes[1].position.clone()], T.dim, 0.35));
    internals.add(makeLine([iNodes[1].position.clone(), iNodes[2].position.clone()], T.dim, 0.35));
    var iLabel = labelSprite('internals', T.dim, 20, { mono: true });
    iLabel.position.set(0, -240, 0);
    internals.add(iLabel);
    internals.traverse(function (o) { if (o.material) o.material.opacity = o.userData.baseOpacity = 0; });
    internals.userData.setOpacity = function (v) {
      internals.traverse(function (o) { if (o.material) o.material.opacity = o.userData.baseOpacity * v; });
    };
    g.add(internals);
    var flowCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-300, 30, 0), new THREE.Vector3(-140, 110, 30), new THREE.Vector3(-30, 70, 40));
    var flow = makeFlow(flowCurve, T.tool, 5, 4, 0.3);
    g.add(flow);
    var st = { n: 0 };
    return {
      three: sc, camera: camera,
      apply: function (n) { st.n = n; },
      tick: function (t, dt) {
        var s = st.n;
        var cardT = s >= 1 ? 1 : 0.001;
        card.scale.setScalar(step(card.scale.x, cardT, dt, 5));
        internals.userData.op = step(internals.userData.op == null ? 0 : internals.userData.op, s >= 2 ? 1 : 0, dt, 4);
        internals.userData.setOpacity(internals.userData.op);
        perimeter.scale.setScalar(1 + Math.sin(t * 0.9) * 0.015);
        flow.userData.tick(dt);
        camera.position.x = Math.sin(t * 0.08) * 10;
        camera.lookAt(0, 0, 0);
      }
    };
  }

  function buildTask() {
    var T = theme();
    var sc = new THREE.Scene();
    var camera = cameraFor(820);
    var g = new THREE.Group();
    sc.add(g);
    var submitted = makeNode(170, 80, 50, T.ink, 'submitted');
    submitted.position.set(-410, 0, 0);
    g.add(submitted);
    var working = makeNode(170, 80, 50, T.ink, 'working');
    working.position.set(-150, -40, 0);
    working.userData.setOpacity(0);
    g.add(working);
    var inputReq = makeNode(210, 80, 50, T.ink, 'input-required');
    inputReq.position.set(120, -40, 0);
    inputReq.userData.setOpacity(0);
    g.add(inputReq);
    var corr = labelSprite('“Correlation ID?”', T.agent, 21);
    corr.position.set(120, 60, 0);
    g.add(corr);
    corr.material.opacity = 0;
    var client = makeNode(190, 66, 46, T.dim, 'Client supplies input', T.dim);
    client.position.set(120, -150, 0);
    client.userData.setOpacity(0);
    g.add(client);
    var completed = makeNode(170, 80, 50, T.agent, 'completed');
    completed.position.set(430, 0, 0);
    completed.userData.setOpacity(0);
    g.add(completed);
    var artifact = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.OctahedronGeometry(34, 0)),
      new THREE.LineBasicMaterial({ color: color(T.agent), transparent: true, opacity: 0.95 })
    );
    artifact.position.set(430, 118, 0);
    artifact.scale.setScalar(0.001);
    g.add(artifact);
    var diag = labelSprite('Diagnosis + evidence', T.agent, 20);
    diag.position.set(430, 165, 0);
    diag.material.opacity = 0;
    g.add(diag);
    var art = labelSprite('Artifact', T.agent, 17, { mono: true });
    art.position.set(430, 62, 0);
    art.material.opacity = 0;
    g.add(art);
    var e1 = makeCurveLine(new THREE.Vector3(-325, 0, 0), new THREE.Vector3(-235, -30, 0), 10, T.tool, 0.0);
    var e2 = makeCurveLine(new THREE.Vector3(-65, -40, 0), new THREE.Vector3(15, -40, 0), 0, T.tool, 0.0);
    var e3 = makeCurveLine(new THREE.Vector3(225, -130, 0), new THREE.Vector3(350, 10, 0), 60, T.tool, 0.0);
    g.add(e1); g.add(e2); g.add(e3);
    var st = { n: 0 };
    function edgeTo(line, target) { line.material.opacity = step(line.material.opacity, target, dt2, 4); }
    var dt2 = 0.016;
    return {
      three: sc, camera: camera,
      apply: function (n) { st.n = n; },
      tick: function (t, dt) {
        dt2 = dt;
        var s = st.n;
        [[working, s >= 1 ? 1 : 0], [inputReq, s >= 1 ? 1 : 0], [client, s >= 1 ? 1 : 0], [completed, s >= 2 ? 1 : 0]].forEach(function (pair) {
          pair[0].userData.op = step(pair[0].userData.op == null ? 0 : pair[0].userData.op, pair[1], dt, 4);
          pair[0].userData.setOpacity(pair[0].userData.op);
        });
        corr.material.opacity = step(corr.material.opacity, s >= 1 ? 1 : 0, dt, 4);
        edgeTo(e1, s >= 1 ? 0.8 : 0); edgeTo(e2, s >= 1 ? 0.8 : 0); edgeTo(e3, s >= 2 ? 0.8 : 0);
        artifact.scale.setScalar(step(artifact.scale.x, s >= 2 ? 1 : 0.001, dt, 5));
        artifact.rotation.y = t * 0.7;
        diag.material.opacity = step(diag.material.opacity, s >= 2 ? 1 : 0, dt, 4);
        art.material.opacity = step(art.material.opacity, s >= 2 ? 0.9 : 0, dt, 4);
        camera.position.x = Math.sin(t * 0.1) * 8;
        camera.lookAt(0, 0, 0);
      }
    };
  }

  function buildTogether() {
    var T = theme();
    var sc = new THREE.Scene();
    var camera = cameraFor(980, 10);
    var g = new THREE.Group();
    sc.add(g);
    var center = makeNode(220, 140, 100, T.ink);
    g.add(center);
    var mcpRing = new THREE.Group();
    mcpRing.add(new THREE.Mesh(new THREE.TorusGeometry(240, 2.4, 8, 64), new THREE.MeshBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.75 })));
    var mcpStamp = labelSprite('MCP', T.tool, 24, { mono: true });
    mcpStamp.position.set(0, -282, 0);
    mcpRing.add(mcpStamp);
    mcpRing.scale.setScalar(0.001);
    g.add(mcpRing);
    var servers = [];
    [-90, 90].forEach(function (y) {
      var node = makeNode(110, 66, 44, T.tool);
      node.position.set(-120, y, 0);
      node.userData.setOpacity(0);
      g.add(node);
      servers.push(node);
      var edge = makeLine([center.position.clone().setX(-110), node.position.clone().setX(-66)], T.tool, 0);
      edge.userData.baseOpacity = 0.7;
      g.add(edge);
      servers.push(edge);
    });
    var bubble = new THREE.Group();
    bubble.position.set(430, 0, -60);
    bubble.add(new THREE.Mesh(new THREE.SphereGeometry(150, 18, 12), new THREE.MeshBasicMaterial({ color: color(T.agent), transparent: true, opacity: 0.05, depthWrite: false })));
    bubble.add(new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(150, 14, 9)), new THREE.LineBasicMaterial({ color: color(T.agent), transparent: true, opacity: 0.14 })));
    var bLabel = labelSprite('payments team', T.agent, 23);
    bLabel.position.set(0, 190, 0);
    bubble.add(bLabel);
    bubble.scale.setScalar(0.001);
    g.add(bubble);
    var arc = makeCurveLine(new THREE.Vector3(235, 40, 0), new THREE.Vector3(295, 0, -60), 70, T.agent, 0);
    var a2aStamp = labelSprite('A2A', T.agent, 24, { mono: true });
    a2aStamp.position.set(285, 135, 0);
    a2aStamp.material.opacity = 0;
    g.add(arc); g.add(a2aStamp);
    var inner = new THREE.Group();
    inner.position.set(430, 0, -60);
    inner.add(new THREE.Mesh(new THREE.TorusGeometry(80, 1.8, 8, 48), new THREE.MeshBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.6 })));
    var diag = makeNode(96, 58, 40, T.tool);
    diag.position.set(150, 0, -20);
    inner.add(diag);
    inner.add(makeLine([new THREE.Vector3(80, 0, 0), new THREE.Vector3(102, 0, -20)], T.tool, 0.5));
    inner.scale.setScalar(0.001);
    g.add(inner);
    var st = { n: 0 };
    return {
      three: sc, camera: camera,
      apply: function (n) { st.n = n; },
      tick: function (t, dt) {
        var s = st.n;
        mcpRing.scale.setScalar(step(mcpRing.scale.x, s >= 1 ? 1 : 0.001, dt, 4));
        mcpRing.rotation.z = t * 0.2;
        servers.forEach(function (o, i) {
          if (o.userData.setOpacity) {
            o.userData.op = step(o.userData.op == null ? 0 : o.userData.op, s >= 1 ? 1 : 0, dt, 4);
            o.userData.setOpacity(o.userData.op);
          } else o.material.opacity = step(o.material.opacity, s >= 1 ? o.userData.baseOpacity : 0, dt, 4);
        });
        bubble.scale.setScalar(step(bubble.scale.x, s >= 2 ? 1 : 0.001, dt, 4));
        arc.material.opacity = step(arc.material.opacity, s >= 2 ? 0.8 : 0, dt, 4);
        a2aStamp.material.opacity = step(a2aStamp.material.opacity, s >= 2 ? 1 : 0, dt, 4);
        inner.scale.setScalar(step(inner.scale.x, s >= 3 ? 1 : 0.001, dt, 4));
        inner.rotation.z = -t * 0.25;
        camera.position.x = Math.sin(t * 0.08) * 12;
        camera.lookAt(0, 0, 0);
      }
    };
  }

  function buildAcp() {
    var T = theme();
    var sc = new THREE.Scene();
    var camera = cameraFor(840, 10);
    var g = new THREE.Group();
    sc.add(g);
    var editor = makeNode(180, 130, 90, T.ink, 'editor');
    editor.position.set(-330, 0, 0);
    g.add(editor);
    var pg = new THREE.PlaneGeometry(14, 150);
    var contract = new THREE.Group();
    contract.add(new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })));
    contract.add(new THREE.LineSegments(new THREE.EdgesGeometry(pg), new THREE.LineBasicMaterial({ color: color(T.tool), transparent: true, opacity: 0.9 })));
    g.add(contract);
    var agentA = makeNode(150, 110, 80, T.agent, 'agent A');
    agentA.position.set(260, 0, 0);
    g.add(agentA);
    var agentB = makeNode(150, 110, 80, T.model, 'agent B');
    agentB.position.set(620, 0, -120);
    agentB.userData.setOpacity(0);
    g.add(agentB);
    var seg1 = makeCurveLine(new THREE.Vector3(-240, -20, 0), new THREE.Vector3(0, -30, 0), 45, T.tool, 0.8);
    g.add(seg1);
    var seg2 = makeLine([new THREE.Vector3(0, -30, 0), new THREE.Vector3(185, -20, 0)], T.tool, 0.8);
    g.add(seg2);
    var flow = makeFlow(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-240, -20, 0), new THREE.Vector3(-80, -75, 0),
      new THREE.Vector3(60, -60, 0), new THREE.Vector3(185, -20, 0)]), T.tool, 5, 4, 0.3);
    g.add(flow);
    var st = { n: 0 };
    return {
      three: sc, camera: camera,
      apply: function (n) { st.n = n; },
      tick: function (t, dt) {
        var swap = st.n >= 1;
        agentA.position.x = step(agentA.position.x, swap ? 560 : 260, dt, 3.2);
        agentA.position.z = step(agentA.position.z, swap ? -140 : 0, dt, 3.2);
        agentA.userData.op = step(agentA.userData.op == null ? 1 : agentA.userData.op, swap ? 0.15 : 1, dt, 3.4);
        agentA.userData.setOpacity(agentA.userData.op);
        agentB.position.x = step(agentB.position.x, swap ? 260 : 620, dt, 3.2);
        agentB.position.z = step(agentB.position.z, swap ? 0 : -120, dt, 3.2);
        agentB.userData.op = step(agentB.userData.op == null ? 0 : agentB.userData.op, swap ? 1 : 0, dt, 3.4);
        agentB.userData.setOpacity(agentB.userData.op);
        var endTarget = new THREE.Vector3((swap ? agentB : agentA).position.x - 92, -20, (swap ? agentB : agentA).position.z);
        seg2.geometry.attributes.position.setXYZ(1, endTarget.x, endTarget.y, endTarget.z);
        seg2.geometry.attributes.position.needsUpdate = true;
        flow.userData.tick(dt);
        camera.position.x = Math.sin(t * 0.1) * 10;
        camera.lookAt(0, 0, 0);
      }
    };
  }

  var REGISTRY = {
    cover: buildCover, replace: buildReplace, map: buildMap, wiring: buildWiring,
    mcp: buildMcp, a2a: buildA2a, task: buildTask, together: buildTogether, acp: buildAcp
  };

  // ---------- lifecycle ----------
  var active = null; // { def, built, revealed, t0, section }

  function visibleBeats(section) {
    return section.querySelectorAll('.beat-trigger.visible').length;
  }

  function sizeTo(mount) {
    var w = mount.clientWidth || 800;
    var h = mount.clientHeight || Math.round(w * 0.4);
    renderer.setSize(w, h, false);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    active.built.camera.aspect = w / h;
    active.built.camera.updateProjectionMatrix();
  }

  function enter() {
    var slide = Reveal.getCurrentSlide();
    var mount = slide ? slide.querySelector('.scene3d') : null;
    if (!mount || !REGISTRY[mount.dataset.scene]) { active = null; return; }
    var def = REGISTRY[mount.dataset.scene];
    if (!def.built) def.built = def();
    mount.appendChild(canvas);
    active = { def: def, built: def.built, section: mount.closest('section'), t0: performance.now() };
    active.revealed = visibleBeats(active.section);
    sizeTo(mount);
    active.built.apply(active.revealed);
    active.built.tick(0, 0.016);
    if (STATIC) renderer.render(active.built.three, active.built.camera);
  }

  Reveal.addEventListener('slidechanged', enter);
  if (Reveal.isReady && Reveal.isReady()) enter(); else Reveal.addEventListener('ready', enter);

  Reveal.addEventListener('fragmentshown', function (e) {
    if (!active || !e.fragment || !active.section.contains(e.fragment)) return;
    active.revealed = visibleBeats(active.section);
    active.built.apply(active.revealed);
    if (STATIC) renderer.render(active.built.three, active.built.camera);
  });
  Reveal.addEventListener('fragmenthidden', function (e) {
    if (!active || !e.fragment || !active.section.contains(e.fragment)) return;
    active.revealed = visibleBeats(active.section);
    active.built.apply(active.revealed);
    if (STATIC) renderer.render(active.built.three, active.built.camera);
  });

  window.addEventListener('resize', function () {
    if (!active) return;
    var mount = active.section.querySelector('.scene3d');
    if (mount) sizeTo(mount);
    if (STATIC) renderer.render(active.built.three, active.built.camera);
  });

  var last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (STATIC || !active || document.hidden) return;
    active.built.tick((now - active.t0) / 1000, dt);
    renderer.render(active.built.three, active.built.camera);
  })(last);
})();
