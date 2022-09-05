import { readAllEdges, readClient, readAllCars } from "../functions/db.js";

export const dijkstra = (graph, start) => {
  var distances = [];
  for (var i = 0; i < Object.keys(graph).length; i++)
    distances[i] = Number.MAX_VALUE;
  distances[start] = 0;

  var visited = [];

  while (true) {
    var shortestDistance = Number.MAX_VALUE;
    var shortestIndex = -1;
    console.log("graph: ", graph);
    
    const toNumbers = arr => arr.map(Number);
    console.log("keys: ", Math.max(...toNumbers(Object.keys(graph))));

    for (var i = 0; i <= Math.max(...toNumbers(Object.keys(graph))); i++) {
      if (distances[i] < shortestDistance && !visited[i]) {
        shortestDistance = distances[i];
        shortestIndex = i;
      }
    }

    console.log("idx selecionado: ", shortestIndex);

    if (shortestIndex === -1) {
      return distances;
    }

    for (i in graph[shortestIndex]) {
      if (
        graph[shortestIndex][i] !== 0 &&
        distances[i] > distances[shortestIndex] + graph[shortestIndex][i]
      ) {
        distances[i] = distances[shortestIndex] + graph[shortestIndex][i];
        console.log("distances", distances[i]);
      }
    }
    visited[shortestIndex] = true;
  }
};

export const dfs = () => {};
export const bfs = () => {};

export const getDistance = (xA, yA, xB, yB) => {
  var xDiff = xA - xB;
  var yDiff = yA - yB;

  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

export const findCars = async (cliente_id, orderByDistance) => {
  //sortType - 0 (tempo) / 1 (dist)

  // criar no back
  const edges = await readAllEdges();
  const { loc_cliente_x, loc_cliente_y } = await readClient(cliente_id);
  const cars = await readAllCars();

  //    console.log("teste-edges", edges);
  //    console.log("teste-cars", cars);

  let clientEdge = 0;
  let minDist = Infinity;
  let g = {};
  for (let k in edges) {
    const e = edges[k];
    // console.log("edge object:", e);
    // Achando aresta mais proxima
    const {
      aresta_n,
      v_origem,
      loc_v_origem_x,
      loc_v_origem_y,
      v_destino,
      loc_v_destino_x,
      loc_v_destino_y,
      distancia,
      velocidade,
    } = e;
    console.log("e: ", e);
    const tempo_min = parseInt((distancia / velocidade) * 60);
    
    console.log("distancia e: ", distancia);

    // v = d/t -> t = d/v (h)

    let midPoint = [
      (loc_v_origem_x + loc_v_destino_x) / 2,
      (loc_v_origem_y + loc_v_destino_y) / 2,
    ];
    // Dist client - edge mid point
    // console.log("dados: ", midPoint[0], midPoint[1], loc_cliente_x, loc_cliente_y);

    let dist = getDistance(
      midPoint[0],
      midPoint[1],
      loc_cliente_x,
      loc_cliente_y
    );

    console.log("dist", dist);
    if (dist < minDist) {
      minDist = dist;
      clientEdge = aresta_n;
    }

    // Montar grafo invertido
    // distancia
    if (v_destino in g) {
      g[v_destino] = {
        ...g[v_destino],
        [v_origem]: orderByDistance ? parseFloat(distancia) : parseFloat(tempo_min),
      };
    } else {
      g[v_destino] = {
        [v_origem]: orderByDistance ? parseFloat(distancia) : parseFloat(tempo_min),
      };
    }
  }

//   console.log("clientEdge", clientEdge);
//   console.log("g: ", g);

  const {
    v_origem,
    loc_v_origem_x,
    loc_v_origem_y,
    loc_v_destino_x,
    loc_v_destino_y,
  } = edges[clientEdge];

  let midPoint = [
    (loc_v_origem_x + loc_v_destino_x) / 2,
    (loc_v_origem_y + loc_v_destino_y) / 2,
  ];
  //    const clientOffset = getDistance(loc_v_origem_x, loc_v_origem_y, midPoint[0], midPoint[1]);

  // console.log("ORIGEM", v_origem);
  const distances = dijkstra(g, v_origem);

  console.log("distances", distances);

  let verticeCars = {};

  for (let idx in cars) {
    const c = cars[idx];
    // console.log("c:", c);

    const edgeCar = c.aresta_id;
    // console.log("edgeCar:", edgeCar);

    const v_dest = edges[edgeCar].v_destino;
    // console.log("v_dest", v_dest);

    if (v_dest in verticeCars) {
      verticeCars[v_dest].push(c.carro_id);
    } else {
      verticeCars[v_dest] = [c.carro_id];
    }
  }

  //    console.log("verticeCars", verticeCars);

  let orderedCars = [];

  for (let idx = 0; idx < distances.length; idx++) {
    const d = distances[idx];
    if (d === Infinity || !(idx in verticeCars)) continue;
    //    console.log("idx", idx, verticeCars);
    for (let j in verticeCars[idx]) {
      orderedCars.push({
        carro_id: verticeCars[idx][j],
        [orderByDistance ? "distancia" : "tempo"]: d /*+clientOffset*/,
      });
    }
  }

  orderedCars.sort((a, b) => {
    return a.distancia < b.distancia;
  });
//   console.log("cars: ", orderedCars);

  return orderedCars;
};

