const EDGE_CONFIG = ["v_origem", "Loc_v_origem_x", "Loc_v_origem_y", "v_destino", "Loc_v_destino_x", "Loc_v_destino_y", "Dist�ncia_km", "Velocidade_km_h"];
const CLIENT_CONFIG = ["loc_cliente_x", "loc_cliente_y", "dest_cliente_x", "dest_cliente_y"];
const CAR_CONFIG = ["loc_carro_x", "loc_carro_y", "aresta_id"];
export function validateHeader(header) {
    switch (header[0]) {
        case "Aresta_n": {
            if (header.length !== 9) {
                return "número de campos inválido";
            }
            const validation = validateFields(header.slice(1), EDGE_CONFIG);
            const validationString = validation.join(", ");
            return !!validationString ? `campos errados: ${validationString}` : ''
        }


        case "Cliente_id": {
            if (header.length !== 5) {
                return "número de campos inválido";
            }
            const validation = validateFields(header.slice(1), CLIENT_CONFIG);
            const validationString = validation.join(", ");
            return !!validationString ? `campos errados: ${validationString}` : ''
        }
        case "Carro_id": {
            if (header.length !== 4) {
                return "número de campos inválido";
            }
            const validation = validateFields(header.slice(1), CAR_CONFIG);
            const validationString = validation.join(", ");
            return !!validationString ? `campos errados: ${validationString}` : ''
        }


        default:
            return `tipo de arquivo ${header[0]} inválido`;
    }

}

function validateFields(header, config) {
    return config.reduce((prev, field) => {
        if (header.includes(field)) {
            return prev;
        }
        return [...prev, field];
    }, []);

}

export function validateId(ids) {
    const duplicated = ids.reduce((prev, id, index, arr) => {
        if (arr.slice(0, index).includes(id)) {
            return [...prev, id];
        }
        return prev;
    }, []).join(", ")
    return !!duplicated ? `os seguintes ids estão repetidos no arquivo: ${duplicated}` : ''
}