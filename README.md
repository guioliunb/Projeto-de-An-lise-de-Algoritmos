# Projeto de PAA 🏎

## Estrutura do projeto 📄

<img align='right' src="https://media.giphy.com/media/E8GfFH47PKeyI/giphy.gif" width="200">

```markdown
📁 src
  📁 data (Será nossa "persistência de dados" em json ou txt)
  📁 functions (Será o local onde fica as funções para mexer no data ou funcões que usaremos para os grafos ex: bfs, dfs, Dijkstra)
  📄 App.js - Aplicação
  📄 Styles.js - Estilo para App.js
  📄 globalStyles.js - Estilo global da aplicação (Criado para estabelecer uns padrões apenas)
  📄 index.js - Renderização da App na DOM
```

## Ideia do projeto 💡

- Visualização do Grafo

- Seção de Adicionar um objeto (Carro, Pessoa ou Aresta do Grafo - Vai ser tipo um forms onde a pessoa insere os dados e consegue adicionar as informações no grafo)

- Edição de elementos (Não tenho certeza se é necessário)

- Listagem de objetos (Ferramenta para selecionar entre Carro, Pessoa ou Grafo - assim que selecionado é mostrado em tela todos os elementos daquele tipo)

- Consultas sobre o grafo

Nessa parte vamos precisar ter mecanismos para realizar as atividades que ele pediu no documento do projeto.

** Aqui precisaremos usar de fato os algoritmos de grafo - Acho que em geral a gente vai utilizar algoritmos de percorrer grafos (BFS ou DFS) para extrair informações ou utilizar Dijkstra para calcular distância. Com excessão do tópico 3 que pelo que pensei ou a gente usa -> https://en.wikipedia.org/wiki/K_shortest_path_routing ou usamos algo como força bruta + Floyd Warshall (?).

1) Dado um cliente específico, listar todos os carros que "chegam" até ele ordenado por distância e também por tempo

2) Para cada cliente e os carros que estão disponíveis para ele -> Calcular trajeto + rápido do (carro - cliente), (cliente - destino), (distância total)

3) Escolher 5 rotas mais rápidas dado um cliente e um carro específico

4) Infos - Calcular tempo médio de espera dos clientes e tempo de viagem de cada um (isso daqui podemos ver como ficar a melhor dinâmica para fazer)

OBS: Para mim a gente pode fazer a persistência de dados usando TXT mesmo, acho mais simples para não ter que fazer um servidor, mas se tiverem outra ideia é tranquilo também

## Issues do projeto 😮‍💨

1. Construção dos algoritmos de grafos a serem utilizadas 📄 ~src/functions/graph.js

2. Pegar dados do .txt do professor e organizar em variáveis 📄 ~src/functions/db.js

3. Estruturação do JSON do projeto 📄 ~src/functions/db.js
-> Construção de função que recebe um dado e joga isso certinho para o JSON

4. Construção do CRUD do projeto 📄 ~src/pages/index.js
   - Criar forms para Adicionar elementos (Cliente carro ou aresta)
   - Criar forms para visualizar elementos (Cliente carro ou aresta)
   - Criar forms para editar um elemento
   - Criar forms para deletar um elemento


5. Construção de forms e botões para contemplar os mecanismos: (os botões vão invocar as funções de grafos) 📄 ~src/pages/index.js

• Dado um cliente específico, listar todos os carros que "chegam" até ele ordenado por distância e também por tempo

•Para cada cliente e os carros que estão disponíveis para ele -> Calcular trajeto + rápido do (carro - cliente), (cliente - destino), (distância total)

•Escolher 5 rotas mais rápidas dado um cliente e um carro específico

•Infos - Calcular tempo médio de espera dos clientes e tempo de viagem de cada um (isso daqui podemos ver como ficar a melhor dinâmica para fazer)
