import React, { useEffect, useRef, useState } from "react";
import { Graph } from "react-d3-graph";
import ClientSvg from "../assets/account.svg";
import CarSvg from "../assets/car.svg";
import TargetSvg from "../assets/target.svg";

import {
  Container,
  Section,
  Form,
  Row,
  Menu,
  MenuItem,
  Button,
  Table,
  SubmitButton,
} from "./styles";

import { findCars, getDistance } from "../functions/graph.js";

import Canvas from "../components/canvas";
import {
  createCar,
  createClient,
  createEdge,
  showFile,
  readAllEdges,
  readAllClients,
  readAllCars,
  deleteCar,
  deleteClient,
  deleteEdge,
} from "../functions/db";
import edgeFile, { carFile, clientFile } from "../functions/txtReader";
import Divider from "@material-ui/core/Divider";

const Home = () => {
  // point : {x: "valor", y: "valor"}
  // edge : {p1: point, p2: point}

  const [edges, setEdges] = useState([]);
  const [clients, setClients] = useState([]);
  const [cars, setCars] = useState([]);
  const [graphData, setGraphData] = useState({
    nodes: [],
    links: []
  });

  const [newEdge, setNewEdge] = useState({
    aresta_n: null,
    v_origem: null,
    loc_v_origem_x: null,
    loc_v_origem_y: null,
    v_destino: null,
    loc_v_destino_x: null,
    loc_v_destino_y: null,
    distancia: null,
    velocidade: null,
  });
  const [newClient, setNewClient] = useState({
    cliente_id: null,
    loc_cliente_x: null,
    loc_cliente_y: null,
    dest_cliente_x: null,
    dest_cliente_y: null,
  });
  const [newCar, setNewCar] = useState({
    carro_id: null,
    loc_carro_x: null,
    loc_carro_y: null,
    aresta_id: null,
  });
  const [menuItem, setMenuItem] = useState(0);
  
  const [openForm, setOpenForm] = useState(false);

  // graph functions states
  // item 1, array de objetos nesse formato:
  // {
  // carro_id,
  // distancia,
  // tempo
  // }
  const [clientCarList, setClientCarList] = useState({});
  // client_id:
  const [clientCarListInput, setClientCarListInput] = useState(null);
  const [clientCarListOption, setClientCarListOption] = useState(0);

  // item 2
  const [fastestCar, setFastestCar] = useState({
    tempo_carro_cliente: null,
    tempo_cliente_destino: null,
    duracao_total: null,
  });
  // client_id:
  const [fastestCarInput, setFastestCarInput] = useState(null);

  // item 3, array de objetos nesse formato:
  // {
  // distancia,
  // tempo
  // }
  const [routes, setRoutes] = useState([]);
  // client_id e carro_id:
  const [routesInput, setRoutesInput] = useState({
    cliente_id: null,
    carro_id: null,
  });

  // item 4
  // {
  // cliente_id,
  // tempo
  // }
  const [travelTimes, setTravelTimes] = useState([]);
  const [averageTime, setAverageTime] = useState(null);

  const [reload, setReload] = useState(false)
  function timeState(){
    setReload((reload) => !reload);
    const timer = setTimeout(() => {
          setReload((reload) => !reload);
    }, 20);
    return () => clearTimeout(timer);
  }
    

  function formatData(edges, car, clients){

    let formattedClients = clients.map((client) => {
      let clientEdge = 0;
      let minDist = Infinity;

      const { loc_cliente_x, loc_cliente_y } = client

      for (let k in edges) {
        const e = edges[k];
        // console.log("edge object:", e);
        // Achando aresta mais proxima
        const {
          aresta_n,
          loc_v_origem_x,
          loc_v_origem_y,
          loc_v_destino_x,
          loc_v_destino_y,
        } = e;

        let midPoint = [
          (loc_v_origem_x + loc_v_destino_x) / 2,
          (loc_v_origem_y + loc_v_destino_y) / 2,
        ];

        let dist = getDistance(
          midPoint[0],
          midPoint[1],
          loc_cliente_x,
          loc_cliente_y
        );

        if (dist < minDist) {
          minDist = dist;
          clientEdge = aresta_n;
        }

      }
      
      
      const {
        loc_v_origem_x,
        loc_v_origem_y
      } = edges[clientEdge];
      
      return {...client, loc_cliente_x: loc_v_origem_x, loc_cliente_y: loc_v_origem_y}
    })
    
    let verticeCars = {};

    for (let idx in cars) {
      const c = cars[idx];

      const edgeCar = c.aresta_id;

      const v_dest = edges[edgeCar].v_destino;

      if (v_dest in verticeCars) {
        verticeCars[v_dest].push(c.carro_id);
      } else {
        verticeCars[v_dest] = [c.carro_id];
      }
    }

    return [verticeCars, formattedClients]
  }

  function formatGraph(e){
    e.preventDefault()
    let adjustedCars, adjustedClients
    let edgesList
    readAllEdges().then((res) => {
      edgesList = res
    }).finally(() => {
      [adjustedCars, adjustedClients] = formatData(edgesList, cars, clients)
      setClients([...adjustedClients])
    })
    timeState()
  }

  function createGraphData(){
    function createNodes(){
      let nodes = []
      edges.map((e) => {
        nodes.push(
          {
            id: "v"+e.v_origem,
            real_id: e.v_origem,
            x: parseInt(e.loc_v_origem_x * 100),
            y: parseInt(e.loc_v_origem_y * 100),
            size: 50,
            fontColor: "black",
          },
        )
          nodes.push(
            {
              id: "v"+e.v_destino,
              real_id: e.v_destino,
              x: parseInt(e.loc_v_destino_x * 100),
              y: parseInt(e.loc_v_destino_y * 100),
              size: 50,
              fontColor: "black",
              // renderLabel: false,
            }
          )
      })
      clients.map((client) => {
        nodes.push({
          id: "cl"+client.cliente_id,
          real_id: client.cliente_id,
          x: parseInt(client.loc_cliente_x * 100),
          y: parseInt(client.loc_cliente_y * 100),
          size: 300,
          fontColor: "green",
          svg: ClientSvg,
        })
        nodes.push({
          id: "d"+client.cliente_id,
          x: parseInt(client.dest_cliente_x * 100),
          y: parseInt(client.dest_cliente_y * 100),
          size: 300,
          fontColor: "red",
          svg: TargetSvg,
        })
      })
      cars.map((car) => {
        nodes.push({
          id: "c"+car.carro_id,
          x: parseInt(car.loc_carro_x * 100),
          y: parseInt(car.loc_carro_y * 100),
          size: 300,
          fontColor: "blue",
          svg: CarSvg,
        })
      })
      
      return nodes
    }
    function createLinks(){
      let links = []
      edges.map((e) => {
        links.push(
          {
            source: "v"+e.v_origem,
            target: "v"+e.v_destino
          }
        )
      })
      return links
    }
    return {nodes: createNodes(), links: createLinks()}
  }

  const myConfig = {
    directed: true,
    staticGraph: true,
    nodeHighlightBehavior: true,
    node: {
      color: "grey",
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      color: "grey",
      strokeWidth: 2,
      highlightColor: "lightblue",
    },
  };

  const onClickNode = function (nodeId) {
    let result, key, size = 1
    console.log(nodeId)
    if(nodeId[0] === 'v'){
      result = edges
      key = 'v_origem'
    }
    else if(nodeId[0] === 'c' && nodeId[1] === 'l'){
      result = clients
      key = 'cliente_id'
      size = 2
    }
    else if(nodeId[0] === 'c'){
      result = cars
      key = 'carro_id'
    }
    else if(nodeId[0] === 'd'){
      result = clients
      key = 'cliente_id'
    }
    result.filter((obj) => {
      if(obj[key] === Number(nodeId.toString().substring(size))){
        console.log("ENTREI")
        window.alert(`${JSON.stringify(obj).replace(/,/g , '\n')}`);
      }
    })
  };

  const onClickLink = function (source, target) {
    let distancia, velocidade, aresta;
    edges.filter((e) => {
      if (e.aresta_n == source.toString().substring(1)) {
        aresta = e.aresta_n
        distancia = e.distancia;
        velocidade = e.velocidade;
      }
    });
    window.alert(
      `Aresta: ${aresta}\nDistancia: ${distancia} km \nVelocidade: ${velocidade} km/h`
    );
  };

  useEffect(async () => {
    await readAllEdges().then((res) => {
      setEdges(
        Object.keys(res).map((key) => {
          return res[key];
        })
      );
    });
    await readAllCars().then((res) => {
      setCars(
        Object.keys(res).map((key) => {
          return res[key];
        })
      );
    });
    await readAllClients().then((res) => {
      setClients(
        Object.keys(res).map((key) => {
          return res[key];
        })
      );
    });
  }, []);

  useEffect(() => {
    let { nodes, links } = createGraphData();
    setGraphData({nodes: [...nodes], links: [...links] })
  }, [edges, cars, clients])

  async function handleClientCarList(event) {
    // item 1 das funções do grafo
    // Dado um cliente específico, listar todos os carros que "chegam" até ele ordenado por distância e também por tempo.
    // input está no estado clientCarListInput

    event.preventDefault();

    try {
      console.log("look", clientCarListOption);
      let cars = await findCars(
        clientCarListInput,
        parseInt(clientCarListOption) ? true : false
      );
      setClientCarList(cars);
    } catch (e) {
      console.log("error getting car list", e);
    }
  }

  function handleFastestCar(event) {
    // item 2 das funções do grafo
    // Para cada cliente e os carros que estão disponíveis para ele - Calcular trajeto + rápido do (carro - cliente), (cliente - destino), (distância total).
    // input está no estado fastestCarInput
    setFastestCar({
      tempo_carro_cliente: 2,
      tempo_cliente_destino: 4,
      duracao_total: 6,
    });
    event.preventDefault();
  }

  function handleRoutes(event) {
    // item 2 das funções do grafo
    // Escolher 5 rotas mais rápidas dado um cliente e um carro específico.
    // input está no estado routesInput que tem um objeto com carro_id e cliente_id
    setRoutes([
      {
        distancia: 2,
        tempo: 3,
      },
    ]);
    event.preventDefault();
  }

  function handleTravelTimes(event) {
    // Infos - Calcular tempo médio de espera dos clientes e tempo de viagem de
    // cada um (isso daqui podemos ver como ficar a melhor dinâmica para
    //  fazer).
    setAverageTime(5);
    setTravelTimes([
      {
        cliente_id: 2,
        tempo: 3,
      },
    ]);
    event.preventDefault();
  }

  const handleSubmit = (event) => {
    switch (menuItem) {
      case 0:
        setEdges([...edges, newEdge]);
        createEdge(
          newEdge.aresta_n,
          newEdge.v_origem,
          newEdge.loc_v_origem_x,
          newEdge.loc_v_origem_y,
          newEdge.v_destino,
          newEdge.loc_v_destino_x,
          newEdge.loc_v_destino_y,
          newEdge.distancia,
          newEdge.velocidade
        );
        break;
      case 1:
        setClients([...clients, newClient]);
        createClient(
          newClient.cliente_id,
          newClient.loc_cliente_x,
          newClient.loc_cliente_y,
          newClient.dest_cliente_x,
          newClient.dest_cliente_y
        );
        break;
      case 2:
        setCars([...cars, newCar]);
        createCar(
          newCar.carro_id,
          newCar.loc_carro_x,
          newCar.loc_carro_y,
          newCar.aresta_id
        );
        break;
    }

    event.preventDefault();
  };

  const handleDelete = (id, event) => {
    switch (menuItem) {
      case 0:
        setEdges(
          edges.filter((edge) => {
            return edge.aresta_n != id;
          })
        );
        deleteEdge(id);
        break;
      case 1:
        setClients(
          clients.filter((client) => {
            return client.cliente_id != id;
          })
        );
        deleteClient(id);
        break;
      case 2:
        setCars(
          cars.filter((car) => {
            return car.carro_id != id;
          })
        );
        deleteCar(id);
        break;
    }
    event.preventDefault();
  };
  const fileInputRef = useRef([null, null, null]);

  function showItem() {
    switch (menuItem) {
      case 0: {
        return (
          <>
            <Row style={{ gap: "10%" }}>
              <Button
                active={openForm}
                onClick={() => setOpenForm((state) => !state)}
              >
                Adicionar nova aresta
              </Button>
              <div>
                <input
                  type="file"
                  accept=".txt"
                  id="myFile1"
                  name="filename1"
                  style={{ display: "none" }}
                  ref={(ref) => (fileInputRef.current[0] = ref)}
                  onChange={(e) => {
                    edgeFile(e.target.files[0], (newEdges) => {
                      window.location.reload()
                    });
                    e.target.value = null;
                  }}
                />
                <Button
                  onClick={() => {
                    fileInputRef.current[0]?.click();
                  }}
                >
                  Enviar arquivo .txt
                </Button>
              </div>
            </Row>
            {openForm && (
              <Form onSubmit={handleSubmit}>
                <label>
                  Número da Aresta
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    name="aresta_n"
                    required
                    onChange={(e) =>
                      setNewEdge({
                        ...newEdge,
                        aresta_n: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Vértice de origem
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    name="v_origem"
                    required
                    onChange={(e) =>
                      setNewEdge({
                        ...newEdge,
                        v_origem: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Coordenada X do Vértice de Origem
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="name"
                    required
                    onChange={(e) =>
                      setNewEdge({
                        ...newEdge,
                        loc_v_origem_x: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Coordenada Y do Vértice de Origem
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="loc_v_origem_y"
                    required
                    onChange={(e) =>
                      setNewEdge({
                        ...newEdge,
                        loc_v_origem_y: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Vértice de Destino
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    name="v_destino"
                    required
                    onChange={(e) =>
                      setNewEdge({
                        ...newEdge,
                        v_destino: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Coordenada X do Vértice de Destino
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="loc_v_destino_x"
                    required
                    onChange={(e) =>
                      setNewEdge({
                        ...newEdge,
                        loc_v_destino_x: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Coordenada Y do Vértice de Destino
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="loc_v_destino_y"
                    required
                    onChange={(e) =>
                      setNewEdge({
                        ...newEdge,
                        loc_v_destino_y: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Distância
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    name="distancia"
                    step=".01"
                    required
                    onChange={(e) =>
                      setNewEdge({
                        ...newEdge,
                        distancia: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Velocidade (km/h)
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    name="velocidade"
                    step=".01"
                    required
                    onChange={(e) =>
                      setNewEdge({
                        ...newEdge,
                        velocidade: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <SubmitButton type="submit">Enviar</SubmitButton>
              </Form>
            )}

            <Table>
              <tr>
                <th>Número da Aresta</th>
                <th>Vértice de Origem</th>
                <th>Origem X</th>
                <th>Origem Y</th>
                <th>Vértice de destino</th>
                <th>Destino X</th>
                <th>Destino Y</th>
                <th>Distância</th>
                <th>Velocidade</th>
                <th>Ações</th>
              </tr>
              {edges &&
                edges.map((edge, idx) => (
                  <tr key={idx}>
                    <td>{edge.aresta_n}</td>
                    <td>{edge.v_origem}</td>
                    <td>{edge.loc_v_origem_x}</td>
                    <td>{edge.loc_v_origem_y}</td>
                    <td>{edge.v_destino}</td>
                    <td>{edge.loc_v_destino_x}</td>
                    <td>{edge.loc_v_destino_y}</td>
                    <td>{edge.distancia}</td>
                    <td>{edge.velocidade}</td>
                    <td style={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        style={{ backgroundColor: "red" }}
                        onClick={() => handleDelete(edge.aresta_n)}
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
            </Table>
          </>
        );
      }
      case 1: {
        return (
          <>
            <Row style={{ gap: "10%" }}>
              <Button
                active={openForm}
                onClick={() => setOpenForm((state) => !state)}
              >
                Adicionar novo cliente
              </Button>
              <div>
                <input
                  type="file"
                  accept=".txt"
                  id="myFile2"
                  name="filename2"
                  style={{ display: "none" }}
                  ref={(ref) => (fileInputRef.current[1] = ref)}
                  onChange={(e) => {
                    clientFile(e.target.files[0], (newClients) => {
                      window.location.reload()
                    });
                    e.target.value = null;
                  }}
                />
                <Button
                  onClick={() => {
                    fileInputRef.current[1]?.click();
                  }}
                >
                  Enviar arquivo .txt
                </Button>
              </div>
            </Row>
            {openForm && (
              <Form onSubmit={handleSubmit}>
                <label>
                  Identificador
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    name="cliente_id"
                    required
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        cliente_id: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Coordenada X do Cliente
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="loc_cliente_x"
                    required
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        loc_cliente_x: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Coordenada Y do Cliente
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="loc_cliente_y"
                    required
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        loc_cliente_y: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Destino X do Cliente
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="dest_cliente_x"
                    required
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        dest_cliente_x: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Destino Y do Cliente
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="dest_cliente_y"
                    required
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        dest_cliente_y: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <SubmitButton type="submit">Enviar</SubmitButton>
              </Form>
            )}
            <Table>
              <tr>
                <th>Identificador</th>
                <th>Coordenada X do Cliente</th>
                <th>Coordenada Y do Cliente</th>
                <th>Destino X do Cliente</th>
                <th>Destino Y do Cliente</th>
                <th>Ações</th>
              </tr>
              {clients &&
                clients.map((client, idx) => (
                  <tr key={idx}>
                    <td>{client.cliente_id}</td>
                    <td>{client.loc_cliente_x}</td>
                    <td>{client.loc_cliente_y}</td>
                    <td>{client.dest_cliente_x}</td>
                    <td>{client.dest_cliente_y}</td>
                    <td>
                      <Button
                        color={"red"}
                        onClick={(e) => handleDelete(client.cliente_id, e)}
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
            </Table>
          </>
        );
      }
      case 2: {
        return (
          <>
            <Row style={{ gap: "10%" }}>
              <Button
                active={openForm}
                onClick={() => setOpenForm((state) => !state)}
              >
                Adicionar novo carro
              </Button>
              <div>
                <input
                  type="file"
                  accept=".txt"
                  id="myFile3"
                  name="filename3"
                  style={{ display: "none" }}
                  ref={(ref) => (fileInputRef.current[2] = ref)}
                  onChange={(e) => {
                    carFile(e.target.files[0], async (newCars) => {
                      window.location.reload()
                    });
                    e.target.value = null;
                  }}
                />
                <Button
                  onClick={() => {
                    fileInputRef.current[2]?.click();
                  }}
                >
                  Enviar arquivo .txt
                </Button>
              </div>
            </Row>
            {openForm && (
              <Form onSubmit={handleSubmit}>
                <label>
                  Identificador
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    name="carro_id"
                    value={newCar.carro_id}
                    required
                    onChange={(e) =>
                      setNewCar({
                        ...newCar,
                        carro_id: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Coordenada X do Carro
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="loc_carro_x"
                    required
                    onChange={(e) =>
                      setNewCar({
                        ...newCar,
                        loc_carro_x: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Coordenada Y do Carro
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    step=".01"
                    name="loc_carro_y"
                    required
                    onChange={(e) =>
                      setNewCar({
                        ...newCar,
                        loc_carro_y: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Aresta
                  <input
                    style={{ width: "50px" }}
                    type="number"
                    name="aresta_id"
                    required
                    onChange={(e) =>
                      setNewCar({
                        ...newCar,
                        aresta_id: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <SubmitButton type="submit">Enviar</SubmitButton>
              </Form>
            )}

            <Table>
              <tr>
                <th>Identificador</th>
                <th>Coordenada X do Carro</th>
                <th>Coordenada Y do Carro</th>
                <th>Aresta</th>
                <th>Ações</th>
              </tr>
              {cars &&
                cars.map((car, idx) => (
                  <tr key={idx}>
                    <td>{car.carro_id}</td>
                    <td>{car.loc_carro_x}</td>
                    <td>{car.loc_carro_y}</td>
                    <td>{car.aresta_id}</td>
                    <td>
                      <Button
                        color={"red"}
                        onClick={(e) => handleDelete(car.carro_id, e)}
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
            </Table>
          </>
        );
      }
    }
  }

  return (
    <Container>
      <Section>
        <h2>{showFile()}</h2>
      </Section>
      <Row>
        <Section>
          {/* <Canvas
            edges={edges}
          /> */}
          {!reload && <Graph
            id="graph-id" // id is mandatory
            data={graphData}
            config={myConfig}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
          />}
          <Button onClick={(e) => formatGraph(e)}>Ajustar grafo</Button>
        </Section>

        <Section width={"100%"}>
          <Menu>
            <MenuItem
              active={menuItem === 0}
              onClick={() => {
                setMenuItem(0);
                setOpenForm(false);
              }}
            >
              Aresta
            </MenuItem>
            <MenuItem
              active={menuItem === 1}
              onClick={() => {
                setMenuItem(1);
                setOpenForm(false);
              }}
            >
              Cliente
            </MenuItem>
            <MenuItem
              active={menuItem === 2}
              onClick={() => {
                setMenuItem(2);
                setOpenForm(false);
              }}
            >
              Carro
            </MenuItem>
          </Menu>
          {showItem()}
        </Section>
      </Row>
      <Section>
        {/* item 1 */}
        <h4>
          Dado um cliente específico, listar todos os carros que "chegam" até
          ele ordenado por distância e também por tempo.
        </h4>
        <br />
        <form>
          <input
            onChange={(e) => setClientCarListInput(e.target.value)}
            value={clientCarListInput}
            placeholder="Cliente_id"
          ></input>
          <select
            onChange={(e) => setClientCarListOption(e.target.value)}
            style={{ marginLeft: 5, height: 25 }}
          >
            <option value="0">Tempo</option>
            <option value="1">Distância</option>
          </select>
          <Button onClick={async (e) => handleClientCarList(e)}>
            Calcular
          </Button>
        </form>
        <Table>
          <tr>
            <th>Carro_id</th>
            <th>Distância</th>
            <th>Tempo</th>
          </tr>
          {clientCarList &&
            Object.keys(clientCarList).map((key, idx) => (
              <tr>
                <td>{key}</td>
                <td>{clientCarList[key].distancia}</td>
                <td>{clientCarList[key].tempo}</td>
              </tr>
            ))}
        </Table>
        <br />
        <br />
        <Divider />
        <br />
        <br />
        {/* item 2 */}
        <h4>
          Para cada cliente e os carros que estão disponíveis para ele -
          Calcular trajeto + rápido do (carro - cliente), (cliente - destino),
          (distância total).
        </h4>
        <br />
        <form>
          <input
            onChange={(e) => setFastestCarInput(e.target.value)}
            value={fastestCarInput}
            placeholder="Cliente_id"
          ></input>
          <Button onClick={(e) => handleFastestCar(e)}>Calcular</Button>
        </form>
        O trajeto mais rápido terá as seguintes durações:
        <br />
        Tempo para o carro chegar no cliente:{" "}
        <span style={{ color: "green" }}>
          {fastestCar.tempo_carro_cliente} min
        </span>
        <br />
        Tempo para o cliente chegar no destino:{" "}
        <span style={{ color: "green" }}>
          {fastestCar.tempo_cliente_destino} min
        </span>
        <br />
        Duração total:{" "}
        <span style={{ color: "green" }}>{fastestCar.duracao_total} min</span>
        <br />
        <br />
        <br />
        <Divider />
        <br />
        <br />
        <h4>
          Escolher 5 rotas mais rápidas dado um cliente e um carro específico.
        </h4>
        <br />
        <form>
          <input
            onChange={(e) =>
              setRoutesInput({ ...routesInput, cliente_id: e.target.value })
            }
            value={routesInput.cliente_id}
            placeholder="Cliente_id"
          ></input>
          <input
            style={{ marginLeft: 5 }}
            onChange={(e) =>
              setRoutesInput({ ...routesInput, carro_id: e.target.value })
            }
            value={routesInput.carro_id}
            placeholder="Carro_id"
          ></input>
          <Button onClick={(e) => handleRoutes(e)}>Calcular</Button>
        </form>
        <Table>
          <tr>
            <th>Distância</th>
            <th>Tempo</th>
          </tr>
          {routes &&
            routes.map((item) => (
              <tr>
                <td>{item.distancia}</td>
                <td>{item.tempo}</td>
              </tr>
            ))}
        </Table>
        <br />
        <br />
        <Divider />
        <br />
        <br />
        <h4>
          Infos - Calcular tempo médio de espera dos clientes e tempo de viagem
          de cada um (isso daqui podemos ver como ficar a melhor dinâmica para
          fazer).
        </h4>
        <br />
        <Button onClick={(e) => handleTravelTimes(e)}>Calcular</Button>
        Tempo médio de espera:{" "}
        <span style={{ color: "green" }}>{averageTime} min</span>
        <br />
        <br />
        <Table>
          <tr>
            <th>Cliente_id</th>
            <th>Tempo até o destino (min)</th>
          </tr>
          {travelTimes &&
            travelTimes.map((item) => (
              <tr>
                <td>{item.cliente_id}</td>
                <td>{item.tempo}</td>
              </tr>
            ))}
        </Table>
      </Section>
    </Container>
  );
};

export default Home;
