const {CHAIN_UNITS}= require('../constants');

const processGraphData = (data, threshold=null, centralNodeAddress, chain) => {
    console.log("data", data);
    const formatAddress = (address) =>
      `${address.slice(0, 5)}...${address.slice(-5)}`;
    const processedNodes = [];
    const processedEdges = [];
    const nodeTracker = new Set(); // To track unique node positions
  const unitFactor = CHAIN_UNITS[chain.toLowerCase()];

    data.forEach((item) => {
      const valueInEth = item.value /unitFactor;
      if ( threshold && valueInEth < threshold) return;

  
      const fromAddress = item.from_address;
      const toAddress = item.to_address;
      // Differentiate node IDs for duplicates
      const fromNodeID =
        fromAddress === centralNodeAddress ? fromAddress : `${fromAddress}-from`;
      const toNodeID =
        toAddress === centralNodeAddress ? toAddress : `${toAddress}-to`;
  
      // Determine the node positions
      const fromPositionX = fromAddress === centralNodeAddress ? 0 : -200;
      const toPositionX = toAddress === centralNodeAddress ? 0 : 200;
  
      // Create the fromNode if not already created for the current context
      if (!nodeTracker.has(fromNodeID)) {
        const fromNode = {
          id: fromNodeID,
          name: fromAddress,
          data: {
            label: formatAddress(fromAddress),
            sourceHandles: [{ id: `${fromNodeID}-s` }],
            targetHandles: [{ id: `${fromNodeID}-t` }],
          },
          position: { x: fromPositionX, y: 0 }, // Position will be updated by layout
          type: "elk",
          style: {
            minWidth: 100,
            textDecoration:
              fromAddress === centralNodeAddress ? "underline" : "none",
            textUnderlineOffset: fromAddress === centralNodeAddress ? "2px" : "0",
            backgroundColor:
              fromAddress === centralNodeAddress ? "#fca5a5" : "white",
          },
        };
        processedNodes.push(fromNode);
        nodeTracker.add(fromNodeID);
      }
  
      // Create the toNode if not already created for the current context
      if (!nodeTracker.has(toNodeID)) {
        const toNode = {
          id: toNodeID,
          name: toAddress,
          data: {
            label: formatAddress(toAddress),
            sourceHandles: [{ id: `${toNodeID}-s` }],
            targetHandles: [{ id: `${toNodeID}-t` }],
          },
          position: { x: toPositionX, y: 0 }, // Position will be updated by layout
          type: "elk",
          style: {
            minWidth: 100,
            textDecoration:
              toAddress === centralNodeAddress ? "underline" : "none",
          },
        };
        processedNodes.push(toNode);
        nodeTracker.add(toNodeID);
      }
  
      let edgeColor = "gray";
      if (fromAddress === centralNodeAddress) edgeColor = "red";
      else if (toAddress === centralNodeAddress) edgeColor = "green";
  
      const edgeWidth = Math.min(Math.max(valueInEth * 5, 1), 5);
      const edgeId = `${fromNodeID}-${toNodeID}`;
  
      if (!processedEdges.some((edge) => edge.id === edgeId)) {
        const edge = {
          id: edgeId,
          source: fromNodeID,
          sourceHandle: `${fromNodeID}-s`,
          target: toNodeID,
          targetHandle: `${toNodeID}-t`,
          label: `${valueInEth.toFixed(4)} ${chain.toLowerCase()}`,
          animated: true,
          style: { stroke: edgeColor, strokeWidth: edgeWidth, color: "grey" },
        };
        processedEdges.push(edge);
      }
    });
  
    return { nodes: processedNodes, edges: processedEdges };
  };


module.exports = {processGraphData};