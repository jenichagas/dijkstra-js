// ============================================================
//  Algoritmo de Dijkstra — Caminhos de Custo Mínimo
//  Simulação: Mapa de Cidades Brasileiras
// ============================================================

// ─── GRAFO (Lista de Adjacência) ────────────────────────────
const grafo = {
  vertices: [
    "São Paulo", "Rio de Janeiro", "Belo Horizonte",
    "Curitiba", "Porto Alegre", "Brasília", "Salvador"
  ],
  arestas: {
    "São Paulo":       [["Rio de Janeiro", 430], ["Curitiba", 408], ["Belo Horizonte", 586], ["Brasília", 1015]],
    "Rio de Janeiro":  [["São Paulo", 430], ["Belo Horizonte", 434], ["Brasília", 1148], ["Salvador", 1650]],
    "Belo Horizonte":  [["São Paulo", 586], ["Rio de Janeiro", 434], ["Brasília", 716], ["Salvador", 1373]],
    "Curitiba":        [["São Paulo", 408], ["Porto Alegre", 710]],
    "Porto Alegre":    [["Curitiba", 710]],
    "Brasília":        [["São Paulo", 1015], ["Rio de Janeiro", 1148], ["Belo Horizonte", 716], ["Salvador", 1441]],
    "Salvador":        [["Rio de Janeiro", 1650], ["Belo Horizonte", 1373], ["Brasília", 1441]],
  }
};

// ─── MIN-HEAP (Fila de Prioridade) ──────────────────────────
class FilaPrioridade {
  constructor() { this.heap = []; }

  inserir(vertice, distancia) {
    this.heap.push({ vertice, distancia });
    this._subir(this.heap.length - 1);
  }

  extrairMinimo() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const ult = this.heap.pop();
    if (this.heap.length > 0) { this.heap[0] = ult; this._descer(0); }
    return min;
  }

  estaVazia() { return this.heap.length === 0; }

  _subir(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[p].distancia <= this.heap[i].distancia) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }

  _descer(i) {
    const n = this.heap.length;
    while (true) {
      let m = i, e = 2*i+1, d = 2*i+2;
      if (e < n && this.heap[e].distancia < this.heap[m].distancia) m = e;
      if (d < n && this.heap[d].distancia < this.heap[m].distancia) m = d;
      if (m === i) break;
      [this.heap[m], this.heap[i]] = [this.heap[i], this.heap[m]];
      i = m;
    }
  }
}

// ─── DIJKSTRA ────────────────────────────────────────────────
function dijkstra(grafo, origem) {
  const dist = {}, ant = {}, vis = new Set(), fila = new FilaPrioridade();
  for (const v of grafo.vertices) { dist[v] = Infinity; ant[v] = null; }
  dist[origem] = 0;
  fila.inserir(origem, 0);
  while (!fila.estaVazia()) {
    const { vertice: u } = fila.extrairMinimo();
    if (vis.has(u)) continue;
    vis.add(u);
    for (const [viz, peso] of (grafo.arestas[u] || [])) {
      if (vis.has(viz)) continue;
      const nova = dist[u] + peso;
      if (nova < dist[viz]) { dist[viz] = nova; ant[viz] = u; fila.inserir(viz, nova); }
    }
  }
  return { dist, ant };
}

function caminho(ant, origem, destino) {
  const c = []; let a = destino;
  while (a !== null) { c.unshift(a); a = ant[a]; }
  return c[0] === origem ? c : null;
}

// ─── EXIBIÇÃO ────────────────────────────────────────────────
function exibir(origem, destino) {
  const { dist, ant } = dijkstra(grafo, origem);
  console.log("\n" + "=".repeat(62));
  console.log("  RESULTADO — Algoritmo de Dijkstra");
  console.log("=".repeat(62));
  console.log(`\n  📍 Origem : ${origem}`);
  console.log(`  🏁 Destino: ${destino}\n`);
  console.log("  " + "-".repeat(58));
  console.log("  Todas as distâncias mínimas a partir da origem:");
  console.log("  " + "-".repeat(58));
  for (const v of grafo.vertices) {
    if (v === origem) continue;
    const d  = dist[v] === Infinity ? "Inacessível" : `${dist[v]} km`;
    const c  = caminho(ant, origem, v);
    const r  = c ? c.join(" → ") : "N/A";
    const mk = v === destino ? " ◀" : "";
    console.log(`  ${v.padEnd(22)} ${d.padEnd(14)} ${r}${mk}`);
  }
  const c = caminho(ant, origem, destino);
  console.log("\n  " + "-".repeat(58));
  if (!c) {
    console.log(`  ⚠️  "${destino}" é inacessível a partir de "${origem}".`);
  } else {
    console.log(`  Rota  : ${c.join(" → ")}`);
    console.log(`  Custo : ${dist[destino]} km`);
  }
  console.log("=".repeat(62));
}

// ─── INTERFACE INTERATIVA ────────────────────────────────────
const linhas = [];
let esperando = null;

process.stdout.write(
  "=".repeat(62) + "\n" +
  "   ALGORITMO DE DIJKSTRA — Mapa de Cidades Brasileiras\n" +
  "   Caminhos de Custo Mínimo em Grafo Ponderado\n" +
  "=".repeat(62) + "\n"
);

function listar() {
  console.log("\n  Cidades disponíveis:");
  grafo.vertices.forEach((c, i) => console.log(`  [${i + 1}] ${c}`));
}

let estado = "origem";
let cidadeOrigem = null;

function processarLinha(linha) {
  linha = linha.trim();

  if (estado === "origem") {
    const idx = parseInt(linha) - 1;
    if (isNaN(idx) || idx < 0 || idx >= grafo.vertices.length) {
      console.log("  ⚠️  Opção inválida. Tente novamente.");
      listar();
      process.stdout.write("\n  Escolha a cidade de ORIGEM (número): ");
      return;
    }
    cidadeOrigem = grafo.vertices[idx];
    estado = "destino";
    listar();
    process.stdout.write("\n  Escolha a cidade de DESTINO (número): ");
    return;
  }

  if (estado === "destino") {
    const idx = parseInt(linha) - 1;
    if (isNaN(idx) || idx < 0 || idx >= grafo.vertices.length) {
      console.log("  ⚠️  Opção inválida. Tente novamente.");
      listar();
      process.stdout.write("\n  Escolha a cidade de DESTINO (número): ");
      return;
    }
    const destino = grafo.vertices[idx];
    if (cidadeOrigem === destino) {
      console.log("  ⚠️  Origem e destino são a mesma cidade!");
      estado = "origem";
      listar();
      process.stdout.write("\n  Escolha a cidade de ORIGEM (número): ");
      return;
    }
    exibir(cidadeOrigem, destino);
    estado = "continuar";
    process.stdout.write("\n  Calcular outro caminho? (s/n): ");
    return;
  }

  if (estado === "continuar") {
    if (linha.toLowerCase() === "s") {
      estado = "origem";
      listar();
      process.stdout.write("\n  Escolha a cidade de ORIGEM (número): ");
    } else {
      console.log("\n  Encerrando. Obrigado!\n");
      process.exit(0);
    }
    return;
  }
}

// Inicia
listar();
process.stdout.write("\n  Escolha a cidade de ORIGEM (número): ");

process.stdin.setEncoding("utf8");
let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const partes = buffer.split("\n");
  buffer = partes.pop();
  for (const linha of partes) processarLinha(linha);
});
process.stdin.on("end", () => {
  if (buffer.trim()) processarLinha(buffer);
  process.exit(0);
});
