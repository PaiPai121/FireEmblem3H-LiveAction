const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "docs", "kakeya_figures");
fs.mkdirSync(outDir, { recursive: true });

function svg(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#334155"/>
    </marker>
    <style>
      .axis{stroke:#64748b;stroke-width:1.2;stroke-dasharray:5 5}
      .thin{stroke:#334155;stroke-width:1.5;fill:none}
      .needle{stroke:#dc2626;stroke-width:5;stroke-linecap:round}
      .ghost{stroke:#2563eb;stroke-width:3;stroke-linecap:round;opacity:.55}
      .region{fill:#e0f2fe;stroke:#0369a1;stroke-width:2}
      .region2{fill:#ecfeff;stroke:#0891b2;stroke-width:2}
      .shade{fill:#fde68a;stroke:#b45309;stroke-width:1.5;opacity:.78}
      .overlapA{fill:#38bdf8;stroke:#0369a1;stroke-width:1.4;opacity:.62}
      .overlapB{fill:#f59e0b;stroke:#92400e;stroke-width:1.4;opacity:.62}
      .green{fill:#dcfce7;stroke:#15803d;stroke-width:1.5}
      .tube{fill:#bfdbfe;stroke:#1d4ed8;stroke-width:1.1;opacity:.35}
      .label{font:14px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;fill:#0f172a}
      .small{font:12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;fill:#475569}
      .formula{font:13px Georgia,"Times New Roman",serif;fill:#0f172a}
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#ffffff"/>
${body}
</svg>
`;
}

function line(x1, y1, x2, y2, cls, extra = "") {
  return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" class="${cls}" ${extra}/>`;
}

function poly(points, cls, extra = "") {
  return `<polygon points="${points.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ")}" class="${cls}" ${extra}/>`;
}

function pathFrom(points, cls, extra = "") {
  const d = points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
  return `<path d="${d}" class="${cls}" ${extra}/>`;
}

function text(x, y, s, cls = "label", anchor = "middle") {
  return `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`;
}

function needle(cx, cy, len, angle, cls = "needle") {
  const dx = (len / 2) * Math.cos(angle);
  const dy = (len / 2) * Math.sin(angle);
  return line(cx - dx, cy - dy, cx + dx, cy + dy, cls);
}

function deltoidPoint(a, t, cx, cy, scale = 1) {
  return [
    cx + scale * (2 * a * Math.cos(t) + a * Math.cos(2 * t)),
    cy - scale * (2 * a * Math.sin(t) - a * Math.sin(2 * t)),
  ];
}

function deltoidDerivative(a, t, scale = 1) {
  return [
    scale * (-2 * a * Math.sin(t) - 2 * a * Math.sin(2 * t)),
    -scale * (2 * a * Math.cos(t) - 2 * a * Math.cos(2 * t)),
  ];
}

function tangentChordForDeltoid(a, t0, cx, cy, scale) {
  const p0 = deltoidPoint(a, t0, cx, cy, scale);
  const d = deltoidDerivative(a, t0, scale);
  const cross = (u, v) => u[0] * v[1] - u[1] * v[0];
  const f = (t) => {
    const p = deltoidPoint(a, t, cx, cy, scale);
    return cross([p[0] - p0[0], p[1] - p0[1]], d);
  };
  const roots = [];
  const n = 2400;
  let prevT = 0;
  let prev = f(prevT);
  for (let i = 1; i <= n; i += 1) {
    const t = (2 * Math.PI * i) / n;
    const val = f(t);
    if (Math.sign(prev) !== Math.sign(val)) {
      let lo = prevT;
      let hi = t;
      for (let j = 0; j < 36; j += 1) {
        const mid = (lo + hi) / 2;
        if (Math.sign(f(lo)) === Math.sign(f(mid))) lo = mid;
        else hi = mid;
      }
      const root = (lo + hi) / 2;
      if (!roots.some((r) => Math.abs(r - root) < 0.01)) roots.push(root);
    }
    prevT = t;
    prev = val;
  }
  const pts = roots
    .filter((r) => Math.abs(Math.atan2(Math.sin(r - t0), Math.cos(r - t0))) > 0.05)
    .map((r) => deltoidPoint(a, r, cx, cy, scale));
  return pts.slice(0, 2);
}

function write(name, content) {
  fs.writeFileSync(path.join(outDir, name), content);
}

function figProblem() {
  const body = `
  <path class="region" d="M90,255 C60,165 112,78 218,82 C284,34 398,64 430,148 C477,215 423,299 318,305 C226,340 122,324 90,255 Z"/>
  <circle cx="250" cy="198" r="92" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="5 5"/>
  ${[0, 0.52, 1.05, 1.57, 2.09, 2.62].map((a, i) => needle(250 + 14 * Math.cos(a + .5), 198 + 10 * Math.sin(a), 130, a, i === 2 ? "needle" : "ghost")).join("\n")}
  <path d="M157,192 A92,92 0 0 1 315,118" class="thin" marker-end="url(#arrow)"/>
  ${text(250, 42, "原始针问题：单位线段连续转过 360°", "label")}
  ${text(250, 365, "每个时刻：整根针都在区域内；运动路径必须连续", "small")}
  ${text(344, 124, "角度连续变化", "small", "start")}
  ${text(190, 204, "长度 1", "small", "end")}
  `;
  write("fig1_original_needle.svg", svg(520, 390, body));
}

function figDeltoid() {
  const cx = 260;
  const cy = 204;
  const a = 1;
  const scale = 70;
  const pts = [];
  for (let i = 0; i <= 720; i += 1) pts.push(deltoidPoint(a, (2 * Math.PI * i) / 720, cx, cy, scale));
  const t0 = 0.95;
  const chord = tangentChordForDeltoid(a, t0, cx, cy, scale);
  const body = `
  <circle cx="${cx}" cy="${cy}" r="${3 * scale}" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="6 6"/>
  <circle cx="${cx + 2 * scale * Math.cos(t0)}" cy="${cy - 2 * scale * Math.sin(t0)}" r="${scale}" fill="none" stroke="#94a3b8" stroke-width="1.2"/>
  ${pathFrom(pts, "region2", 'fill="#ecfeff"')}
  ${chord.length === 2 ? line(chord[0][0], chord[0][1], chord[1][0], chord[1][1], "needle") : needle(cx, cy, 4 * scale, -0.4)}
  <circle cx="${deltoidPoint(a, t0, cx, cy, scale)[0]}" cy="${deltoidPoint(a, t0, cx, cy, scale)[1]}" r="4" fill="#dc2626"/>
  ${text(260, 34, "三尖内摆线候选：切线截得等长针", "label")}
  ${text(34, 76, "参数：R=3a, r=a", "formula", "start")}
  ${text(34, 98, "切线弦长 = 4a", "formula", "start")}
  ${text(34, 120, "面积 = 2πa²", "formula", "start")}
  ${text(34, 142, "单位针：a=1/4 → 面积 π/8", "formula", "start")}
  ${text(350, 94, "滚动小圆", "small", "start")}
  `;
  write("fig2_deltoid.svg", svg(560, 430, body));
}

function figConvex() {
  const top = [260, 72], left = [108, 336], right = [412, 336];
  const body = `
  ${poly([top, right, left], "green")}
  ${line(108,336,412,336,"thin")}
  ${line(260,72,260,336,"axis")}
  ${line(108,336,260,72,"thin")}
  ${line(412,336,260,72,"thin")}
  ${needle(260, 247, 156, 0, "ghost")}
  ${needle(260, 247, 156, Math.PI / 3, "ghost")}
  ${needle(260, 247, 156, -Math.PI / 3, "needle")}
  <path d="M92,336 L92,72 L108,336" fill="none" stroke="#64748b" stroke-width="1.1"/>
  ${text(80,205,"高 1","small","end")}
  ${text(260,38,"凸区域极值：高为 1 的等边三角形", "label")}
  ${text(260,365,"边长 2/√3，面积 1/√3；三组支撑方向共同卡住极值", "formula")}
  ${text(424,258,"任意方向都可找到一条长 1 的弦","small","start")}
  `;
  write("fig3_convex_triangle.svg", svg(540, 390, body));
}

function figPalJoin() {
  const left = [115, 250], right = [455, 250];
  const body = `
  ${needle(left[0], left[1], 135, -0.72, "needle")}
  ${needle(right[0], right[1], 135, 0.72, "needle")}
  <path d="M116,250 C194,104 360,396 454,250" fill="none" stroke="#334155" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M138,204 C209,108 346,344 430,204" fill="none" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="5 5"/>
  <path d="M174,171 C230,122 319,293 394,171" fill="none" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="5 5"/>
  <polygon points="180,169 233,123 288,219 235,262" class="shade"/>
  <polygon points="292,219 346,316 399,171 347,123" class="shade"/>
  ${text(285,39,"Pál 连接：用很窄的区域交换两根平行针", "label")}
  ${text(285,360,"把“方向集合”拼成连续运动，新增面积可做得任意小", "small")}
  ${text(253,154,"窄连接块", "small")}
  ${text(118,326,"起始针", "small")}
  ${text(456,326,"目标针", "small")}
  `;
  write("fig4_pal_join.svg", svg(570, 390, body));
}

function figPerronStep() {
  const tri1 = [[72,306],[172,86],[272,306]];
  const tri2a = [[355,306],[405,86],[455,306]];
  const tri2b = [[405,306],[455,86],[505,306]];
  const tri3a = [[91,660],[191,440],[291,660]].map(([x,y]) => [x,y-300]);
  const tri3b = [[137,660],[237,440],[337,660]].map(([x,y]) => [x,y-300]);
  const body = `
  ${poly(tri1, "overlapA")}
  ${line(172,86,172,306,"axis")}
  <path d="M290,196 L328,196" class="thin" marker-end="url(#arrow)"/>
  ${poly(tri2a, "overlapA")}
  ${poly(tri2b, "overlapB")}
  <path d="M515,196 L552,196" class="thin" marker-end="url(#arrow)"/>
  <g transform="translate(440,0)">
    ${poly(tri3a, "overlapA")}
    ${poly(tri3b, "overlapB")}
  </g>
  ${text(172,48,"1. 原三角形", "label")}
  ${text(430,48,"2. 切分", "label")}
  ${text(745,48,"3. 平移重叠", "label")}
  ${text(452,340,"方向范围保留，面积因重叠而减少", "small")}
  `;
  write("fig5_perron_one_step.svg", svg(900, 370, body));
}

function figPerronTree() {
  let body = `${text(300,34,"Perron 树：多次切分、平移、重叠后的“方向簇”", "label")}`;
  const baseY = 330;
  for (let i = 0; i < 18; i += 1) {
    const x = 74 + i * 26;
    const h = 170 + 45 * Math.sin(i * 1.7);
    const skew = -55 + i * 6.3;
    const pts = [[x, baseY], [x + skew, baseY - h], [x + 20, baseY]];
    body += poly(pts, i % 2 ? "overlapB" : "overlapA");
  }
  body += `
  <rect x="56" y="312" width="480" height="36" fill="#fff7ed" stroke="#fb923c" stroke-width="1.3" opacity=".55"/>
  ${text(300,368,"许多方向的单位线段仍被保留；碎片大面积复用同一片空间", "small")}
  ${text(300,392,"极限思想：面积可以趋近 0，但方向覆盖不丢失", "small")}
  `;
  write("fig6_perron_tree.svg", svg(600, 420, body));
}

function figDavies() {
  let body = `${text(310,35,"二维现代挂谷猜想：δ-管相交估计", "label")}`;
  const cx = 300, cy = 215, len = 360, thick = 13;
  for (let i = 0; i < 13; i += 1) {
    const a = -0.82 + i * 0.14;
    const dx = (len / 2) * Math.cos(a);
    const dy = (len / 2) * Math.sin(a);
    const nx = (thick / 2) * -Math.sin(a);
    const ny = (thick / 2) * Math.cos(a);
    const pts = [
      [cx - dx + nx, cy - dy + ny],
      [cx + dx + nx, cy + dy + ny],
      [cx + dx - nx, cy + dy - ny],
      [cx - dx - nx, cy - dy - ny],
    ];
    body += poly(pts, "tube");
  }
  body += `
  <circle cx="300" cy="215" r="12" fill="#ef4444" opacity=".75"/>
  ${text(89,90,"角度分离：约 δ", "small", "start")}
  ${line(102,112,198,168,"thin", 'marker-end="url(#arrow)"')}
  ${text(438,341,"交叠面积 ≲ δ² / angle", "formula")}
  ${text(310,390,"许多方向不能全挤进低维集合；由管并集下界推出 Hausdorff 维数为 2", "small")}
  `;
  write("fig7_davies_tubes.svg", svg(620, 420, body));
}

figProblem();
figDeltoid();
figConvex();
figPalJoin();
figPerronStep();
figPerronTree();
figDavies();

console.log(`Generated figures in ${outDir}`);
