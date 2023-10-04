import React, { useEffect } from "react";
import cytoscape from "cytoscape";
import cytoscapePopper from "cytoscape-popper";

export { RelationsMap };

cytoscape.use(cytoscapePopper); // Use the cytoscape-popper extension

const RelationsMap = (props) => {
  useEffect(() => {
    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: [
        { data: { id: "central", label: "Central Node" } },
        { data: { id: "node1", label: "Node 1" } },
        { data: { id: "node2", label: "Node 2" } },
        { data: { id: "node3", label: "Node 3" } },
        { data: { id: "node4", label: "Node 4" } },
        { data: { id: "node5", label: "Node 5" } },
        { data: { id: "node6", label: "Node 6" } },
        { data: { id: "node7", label: "Node 7" } },
        { data: { id: "node8", label: "Node 8" } },
        { data: { id: "edge1", source: "central", target: "node1" } },
        { data: { id: "edge2", source: "central", target: "node2" } },
        { data: { id: "edge3", source: "central", target: "node3" } },
        { data: { id: "edge4", source: "central", target: "node4" } },
        { data: { id: "edge5", source: "central", target: "node5" } },
        { data: { id: "edge6", source: "central", target: "node6" } },
        { data: { id: "edge7", source: "central", target: "node7" } },
        { data: { id: "edge8", source: "central", target: "node8" } },
      ],
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
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            label: "relation",
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

    return () => {
      cy.destroy();
    };
  }, []);

  return <div id="cy" style={{ width: "100%", height: "400px" }}></div>;
};
