# dijkstra-js

Implementação interativa do algoritmo de Dijkstra em JavaScript, aplicada a um mapa de cidades brasileiras.

## Sobre

O programa calcula os **caminhos de custo mínimo** a partir de uma cidade de origem até todas as demais, usando o algoritmo de Dijkstra com fila de prioridade mínima (Min-Heap) implementada do zero.

O grafo representa 7 cidades brasileiras onde:
- **Vértices** = cidades
- **Arestas** = estradas
- **Pesos** = distâncias em km

## Como executar

Necessário ter [Node.js](https://nodejs.org) instalado.

```bash
node dijkstra.js
```

O programa é interativo — basta escolher a cidade de origem e destino pelo número:

```
  [1] São Paulo        [2] Rio de Janeiro   [3] Belo Horizonte
  [4] Curitiba         [5] Porto Alegre     [6] Brasília
  [7] Salvador

  Escolha a cidade de ORIGEM (número): 1
  Escolha a cidade de DESTINO (número): 7

  Rota  : São Paulo → Belo Horizonte → Salvador
  Custo : 1959 km
```

## Estrutura de dados

| Estrutura | Uso |
|-----------|-----|
| Lista de adjacência | Representação do grafo — O(V + E) de memória |
| Min-Heap (Fila de Prioridade) | Extração eficiente do vértice de menor custo |
| Dicionário de predecessores | Reconstrução do caminho mínimo |

## Complexidade

**O((V + E) log V)** — onde V = vértices e E = arestas.

## Por que é guloso?

A cada iteração, o algoritmo escolhe o vértice de **menor distância acumulada** sem reconsiderar decisões anteriores. Com pesos não negativos, essa escolha local garante o ótimo global.

## Autora

Jeniffer Chagas — Análise e Desenvolvimento de Sistemas · Unisales
