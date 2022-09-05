import { createCar, createClient, createEdge } from "./db";
import { validateId, validateHeader } from "./validationFunctions";
/**
 * @param {File} file
 * @param {(array) => void}
 *
 *
 */
export default async function edgeFile(file, addEdges) {
  const buffer = await file?.arrayBuffer();
  if (!buffer) {
    return;
  }
  const dec = new TextDecoder("utf-8");
  const fileContent = dec.decode(buffer).trim();
  const [nameLines, ...dataLines] = fileContent.split("\n");
  const trimmedNames = nameLines.trim();
  const splitNames = trimmedNames.split(" ");
  const validateMessage = validateHeader(splitNames);
  if (!!validateMessage) {
    window.alert(validateMessage);
    return;
  }
  const dataNumberLines = dataLines.map((line) => {
    const trimmedLine = line.trim();
    const values = trimmedLine.split(" ");
    const numberValues = values.map((value) => parseFloat(value));
    return numberValues;
  });
  const flatNumberlines = dataNumberLines.flat().filter(number => Number.isNaN(number))
  if (flatNumberlines.length !== 0) {
    window.alert("coloque apenas números nos argumentos")
    return;
  }

  const invalidLines = dataNumberLines.map(
    (line) => {
      return line.length;
    }
  ).filter(line => line !== 9)
  if (invalidLines.length > 0) {
    window.alert("numero de informações não corresponde ao número de campos");
    return;
  }

  const dataIds = dataNumberLines.map((line) => {
    return line[0];
  })

  const verifyIds = validateId(dataIds);
  if (!!verifyIds) {
    window.alert(verifyIds);
    return;
  }



  const edges = dataNumberLines.map(
    (line) => (
      {
        aresta_n: line[0],
        v_origem: line[1],
        loc_v_origem_x: line[2],
        loc_v_origem_y: line[3],
        v_destino: line[4],
        loc_v_destino_x: line[5],
        loc_v_destino_y: line[6],
        distancia: line[7],
        velocidade: line[8],
      }
    )
  );
  addEdges(edges);
  edges.map(edge => createEdge(
    edge.aresta_n,
    edge.v_origem,
    edge.loc_v_origem_x,
    edge.loc_v_origem_y,
    edge.v_destino,
    edge.loc_v_destino_x,
    edge.loc_v_destino_y,
    edge.distancia,
    edge.velocidade,
  ))
}

/**
 * @param {File} file
 * @param {(array) => void}
 *
 *
 */
export async function clientFile(file, addClients) {
  const buffer = await file?.arrayBuffer();
  if (!buffer) {
    return;
  }
  const dec = new TextDecoder("utf-8");
  const fileContent = dec.decode(buffer).trim();
  const [nameLines, ...dataLines] = fileContent.split("\n");
  const trimmedNames = nameLines.trim();
  const splitNames = trimmedNames.split(" ");
  const validateMessage = validateHeader(splitNames);
  if (!!validateMessage) {
    window.alert(validateMessage);
    return;
  }
  const dataNumberLines = dataLines.map((line) => {
    const trimmedLine = line.trim();
    const values = trimmedLine.split(" ");
    const numberValues = values.map((value) => parseFloat(value));
    return numberValues;
  });

  const flatNumberlines = dataNumberLines.flat().filter(number => Number.isNaN(number))
  if (flatNumberlines.length !== 0) {
    window.alert("coloque apenas números nos argumentos")
    return;
  }

  const invalidLines = dataNumberLines.map(
    (line) => {
      return line.length;
    }
  ).filter(line => line !== 5)
  if (invalidLines.length > 0) {
    window.alert("numero de informações não corresponde ao número de campos");
    return;
  }

  const dataIds = dataNumberLines.map((line) => {
    return line[0];
  })

  const verifyIds = validateId(dataIds);
  if (!!verifyIds) {
    window.alert(verifyIds);
    return;
  }

  const clients = dataNumberLines.map(
    (line) => (
      {
        cliente_id: line[0],
        loc_cliente_x: line[1],
        loc_cliente_y: line[2],
        dest_cliente_x: line[3],
        dest_cliente_y: line[4],
      }

    )
  );
  addClients(clients);
  clients.map(client => createClient(
    client.cliente_id,
    client.loc_cliente_x,
    client.loc_cliente_y,
    client.dest_cliente_x,
    client.dest_cliente_y,
  ))
}

/**
 * @param {File} file
 * @param {(array) => void}
 *
 *
 */
export async function carFile(file, addCars) {
  const buffer = await file?.arrayBuffer();
  if (!buffer) {
    return;
  }
  const dec = new TextDecoder("utf-8");
  const fileContent = dec.decode(buffer).trim();
  const [nameLines, ...dataLines] = fileContent.split("\n");
  const trimmedNames = nameLines.trim();
  const splitNames = trimmedNames.split(" ");
  const validateMessage = validateHeader(splitNames);
  if (!!validateMessage) {
    window.alert(validateMessage);
    return;
  }
  const dataNumberLines = dataLines.map((line) => {
    const trimmedLine = line.trim();
    const values = trimmedLine.split(" ");
    // todo handle nan
    const numberValues = values.map((value) => parseFloat(value));
    return numberValues;
  });

  const flatNumberlines = dataNumberLines.flat().filter(number => Number.isNaN(number))
  if (flatNumberlines.length !== 0) {
    window.alert("coloque apenas números nos argumentos")
    return;
  }

  const invalidLines = dataNumberLines.map(
    (line) => {
      return line.length;
    }
  ).filter(line => line !== 4)
  if (invalidLines.length > 0) {
    window.alert("numero de informações não corresponde ao número de campos");
    return;
  }

  const dataIds = dataNumberLines.map((line) => {
    return line[0];
  })

  const verifyIds = validateId(dataIds);
  if (!!verifyIds) {
    window.alert(verifyIds);
    return;
  }


  const cars = dataNumberLines.map(
    (line) => (
      {
        carro_id: line[0],
        loc_carro_x: line[1],
        loc_carro_y: line[2],
        aresta_id: line[3],
      }
    )
  );
  addCars(cars);
  cars.map(car => createCar(
    car.carro_id,
    car.loc_carro_x,
    car.loc_carro_y,
    car.aresta_id,
  ))
}
