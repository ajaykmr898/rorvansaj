import React, { useEffect } from "react";
import cytoscape from "cytoscape";
import cytoscapePopper from "cytoscape-popper";

export { RelationsCytoscape };

cytoscape.use(cytoscapePopper); // Use the cytoscape-popper extension

const RelationsCytoscape = (props) => {
  const elements = props.elements;
  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#7ac5b7",
            label: "data(label)",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "curve-style": "bezier",
            "line-color": "#ccc",
            "target-arrow-color": "#7ac5b7",
            "target-arrow-shape": "triangle",
            label: "data(label)",
          },
        },
      ],
      layout: {
        name: "circle",
      },
      userZoomingEnabled: false,
    });

    cy.nodes().forEach((node) => {
      node.popper({
        content: () => {
          const tooltip = document.createElement("div");
          tooltip.innerHTML = "Tooltip Content: " + node.data("label");
          return tooltip;
        },
      });
    });
    cy.on("click", "node", function (event) {
      const node = event.target;
      // Remove the clicked node
      if (node.id() !== "central") {
        //console.log(node.data("rel"));
        let id = node.data("rel");
        props?.remove(id);
        cy.remove(node);
      }
    });
    return () => {
      cy.destroy();
    };
  }, []);

  return <div id="cy" style={{ width: "100%", height: "400px" }}></div>;
};
