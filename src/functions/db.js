// Functions to handle with TXT or JSON file
import data from "../data/data.json";
import axios from "axios";
import React from "react";
class Car {
  constructor(id, x, y, aresta_id) {
    this.carro_id = id;
    this.loc_carro_x = x;
    this.loc_carro_y = y;
    this.aresta_id = aresta_id;
  }
}
class Client {
  constructor(id, x1, y1, x2, y2) {
    this.cliente_id = id;
    this.loc_cliente_x = x1;
    this.loc_cliente_y = y1;
    this.dest_cliente_x = x2;
    this.dest_cliente_y = y2;
  }
}
class Edge {
  constructor(id, v1, v2, x1, y1, x2, y2, d, ve) {
    this.aresta_n = id;
    this.v_origem = v1;
    this.loc_v_origem_x = x1;
    this.loc_v_origem_y = y1;
    this.v_destino = v2;
    this.loc_v_destino_x = x2;
    this.loc_v_destino_y = y2;
    this.distancia_km = d;
    this.velocidade_km_h = ve;
  }
}

class Graph {
  // Data Structure

  // g = {v_origem: [v_dest1, v_dest2, ...], ...}
  // edges = {aresta_id: Edge, ...}
  // clients = {cliente_id: Client, ...}
  // cars = {car_id: Car, ...}

  add_edge(x) {
    // recebe um grafo
    // considerando que é um edge válido
    // mapa dos edges
    this.edges[x.aresta_n] = x;
    // lista de adjacencia do vertices
    this.g[x.v_origem].push(x.v_destino);
  }

  add_client(x) {
    // mapa dos clientes
    this.clients[x.cliente_id] = x;
  }

  add_car(x) {
    // mapa dos carros
    this.cars[x.id] = x;
  }
}

export const showFile = () => {
  return data.message;
};

export async function createCar(id, x, y, aresta_id) {
  // await axios
  //   .post("localhost:3001/createcar", {
  //     id: id,
  //     x: x,
  //     y: y,
  //     aresta_id: aresta_id,
  //   })
  //   .then(function (response) {
  //     console.log(response);
  //   });
  
  let payload = {
    id: id,
    x: x,
    y: y,
    aresta_id: aresta_id,
  };
  console.log(payload)

  let res = await axios.post("http://127.0.0.1:3001/createcar", payload);

  //let data = res.data;
}

export async function readCar(id) {
  let payload = {
    id: id,
  };
  let res = await axios.post("http://127.0.0.1:3001/readcar", payload);

  let data = res.data;
  console.log(data);
}

export async function readAllCars() {
  let res = await axios.post("http://127.0.0.1:3001/readallcars");

  let data = res.data;
//   console.log(data);
  return data;
}

export async function updateCar(id, x, y, aresta_id) {
  let payload = {
    id: id,
    x: x,
    y: y,
    aresta_id: aresta_id,
  };

  let res = await axios.post("http://127.0.0.1:3001/updatecar", payload);

  //let data = res.data;
  console.log(res);
}

export async function deleteCar(id) {
  let payload = {
    id: id,
  };
  let res = await axios.post("http://127.0.0.1:3001/deletecar", payload);

  let data = res.data;
  console.log(data);
}

export async function createClient(id, x1, y1, x2, y2) {
  let payload = {
    id: id,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
  };

  let res = await axios.post("http://127.0.0.1:3001/createclient", payload);

  //let data = res.data;
  console.log(res);
}

export async function readClient(id) {
  let payload = {
    id: id,
  };
  let res = await axios.post("http://127.0.0.1:3001/readclient", payload);

  let data = res.data;
//   console.log(data);
  return data;
}

export async function readAllClients() {
  let res = await axios.post("http://127.0.0.1:3001/readallclients");

  let data = res.data;
  return data;
}

export async function updateClient(id, x1, y1, x2, y2) {
  let payload = {
    id: id,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
  };

  let res = await axios.post("http://127.0.0.1:3001/updateclient", payload);

  //let data = res.data;
  console.log(res);
}

export async function deleteClient(id) {
  let payload = {
    id: id,
  };
  let res = await axios.post("http://127.0.0.1:3001/deleteclient", payload);

  let data = res.data;
  console.log(data);
}

export async function createEdge(id, v1, x1, y1, v2, x2, y2, d, ve) {
  let payload = {
    id: id,
    v1: v1,
    v2: v2,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    d: d,
    ve: ve,
  };

  let res = await axios.post("http://127.0.0.1:3001/createedge", payload);

  //let data = res.data;
}

export async function readEdge(id) {
  let payload = {
    id: id,
  };
  let res = await axios.post("http://127.0.0.1:3001/readedge", payload);

  let data = res.data;
  console.log(data);
}

export async function readAllEdges() {
  let res = await axios.post("http://127.0.0.1:3001/readalledges");

  let data = res.data;
//   console.log("data", data);
  return data;
}

export async function updateEdge(id, v1, v2, x1, y1, x2, y2, d, ve) {
  let payload = {
    id: id,
    v1: v1,
    v2: v2,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    d: d,
    ve: ve,
  };

  let res = await axios.post("http://127.0.0.1:3001/updateedge", payload);

  //let data = res.data;
  console.log(res);
}

export async function deleteEdge(id) {
  let payload = {
    id: id,
  };
  let res = await axios.post("http://127.0.0.1:3001/deleteedge", payload);

  let data = res.data;
  console.log(data);
}
