import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  const edgesInput = props.edges;

  console.log(edgesInput)
  let edges = edgesInput.map((edge) => {
    return {
      p1: {x: edge.loc_v_origem_x, y: edge.loc_v_origem_y},
      p2: {x: edge.loc_v_destino_x, y: edge.loc_v_destino_y}
    }
  })
  console.log(edges)
  const canvasWidth = 500,
    canvasHeight = 500;

  const canvasRef = useRef(null);

  // drawing functions
  const draw_point = (ctx, pointObject, pointType) => {
    if (pointType < 0 || pointType > 2) return;
    const vtype = ["#000000", "#FD5000", "#3868B8"];
    const pointColor = vtype[pointType];
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = pointColor;
    ctx.beginPath();
    ctx.arc(
      pointObject.x,
      pointObject.y,
      20 * Math.sin(10 * 0.05) ** 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };

  const draw_line = (ctx, pointObject1, pointObject2) => {
    ctx.fillStyle = "#000000";
    ctx.moveTo(pointObject1.x, pointObject1.y);
    ctx.lineTo(pointObject2.x, pointObject2.y);
    ctx.stroke();
  };

  const draw_edge = (ctx, edgeObject) => {
    draw_point(ctx, edgeObject.p1, 0);
    draw_point(ctx, edgeObject.p2, 0);
    draw_line(ctx, edgeObject.p1, edgeObject.p2);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const render = () => {
      let min_x = 1e9,
        max_x = -1e9;
      let min_y = 1e9,
        max_y = -1e9;

      // Adaptar escala de acordo com os limites de x,y (descomentar se quiser
      // que não fique uma escala fixa ex: [0,1000])
      // edges.forEach(e => {
      //     // color x e y na escala correta
      //     min_x=Math.min(min_x, e.p1.x, e.p2.x);
      //     min_y=Math.min(min_y, e.p1.y, e.p2.y);
      //     max_x=Math.max(max_x, e.p1.x, e.p2.x);
      //     max_y=Math.max(max_y, e.p1.y, e.p2.y);
      // })

      // Fixando escala de 0-1000
      min_x = 0;
      min_y = 0;
      max_x = 1000;
      max_y = 1000;

      edges.forEach((e) => {
        if (
          e.p1.x < min_x ||
          e.p2.x < min_x ||
          e.p1.x > max_x ||
          e.p2.x > max_x
        )
          return;
        if (
          e.p1.y < min_y ||
          e.p2.y < min_y ||
          e.p1.y > max_y ||
          e.p2.y > max_y
        )
          return;

        // Coloca x e y na escala correta
        var edge = { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 } };
        const length_x = Math.abs(max_x - min_x);
        const length_y = Math.abs(max_y - min_y);
        edge.p1.x =
          ((Math.abs(e.p1.x - min_x) / Math.abs(length_x)) * canvasWidth + 10) *
          0.9;
        edge.p2.x =
          ((Math.abs(e.p2.x - min_x) / Math.abs(length_x)) * canvasWidth + 10) *
          0.9;
        edge.p1.y =
          ((Math.abs(e.p1.y - min_y) / Math.abs(length_y)) * canvasHeight +
            10) *
          0.9;
        edge.p2.y =
          ((Math.abs(e.p2.y - min_y) / Math.abs(length_y)) * canvasHeight +
            10) *
          0.9;
        draw_edge(context, edge);
      });
    };

    render();
  }, [edges]);

  return (
    <canvas
      width={`${canvasWidth}`}
      height={`${canvasHeight}`}
      ref={canvasRef}
      style={{
        padding: "1rem",
        border: "2px solid #23c6a8",
        "border-radius": "10px",
      }}
    />
  );
};

export default Canvas;
