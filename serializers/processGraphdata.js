const { CHAIN_UNITS } = require('../constants');

const processGraphData = (data, threshold = null, centralNodeAddress, chain) => {
  // const formatAddress = (address) =>
  //   `${address.slice(0, 5)}...${address.slice(-5)}`;
      // return address
  
  
  const processedNodesMap = new Map();
  const processedEdges = [];
  const unitFactor = CHAIN_UNITS[chain.toLowerCase()];

  data.forEach((item) => {
    const valueInChain = item.value / unitFactor;
    if (threshold && valueInChain < threshold) return;

    const fromAddress = item.from_address;
    const toAddress = item.to_address;

    // Define unique node IDs
    const fromNodeID = fromAddress;
    const toNodeID = toAddress;

    // Create or update the fromNode
    if (!processedNodesMap.has(fromNodeID)) {
      processedNodesMap.set(fromNodeID, {
        id: fromNodeID,
        name: fromAddress,
        data: {
          label: formatAddress(fromAddress),
          sourceHandles: [{ id: `${fromNodeID}-s` }],
          targetHandles: [{ id: `${fromNodeID}-t` }],
        },
        position: { x: fromAddress === centralNodeAddress ? 0 : -200, y: 0 },
        type: "elk",
        style: {
          minWidth: 100,
          textDecoration: fromAddress === centralNodeAddress ? "underline" : "none",
          textUnderlineOffset: fromAddress === centralNodeAddress ? "2px" : "0",
          backgroundColor: fromAddress === centralNodeAddress ? "#fca5a5" : "white",
        },
      });
    }

    // Create or update the toNode
    if (!processedNodesMap.has(toNodeID)) {
      processedNodesMap.set(toNodeID, {
        id: toNodeID,
        name: toAddress,
        data: {
          label: (toAddress),
          sourceHandles: [{ id: `${toNodeID}-s` }],
          targetHandles: [{ id: `${toNodeID}-t` }],
        },
        position: { x: toAddress === centralNodeAddress ? 0 : 200, y: 0 },
        type: "elk",
        style: {
          minWidth: 100,
          textDecoration: toAddress === centralNodeAddress ? "underline" : "none",
        },
      });
    }

    // Add edge
    const edgeId = `${fromNodeID}-${toNodeID}`;
    if (!processedEdges.some((edge) => edge.id === edgeId)) {
      const edgeColor = fromAddress === centralNodeAddress ? "red" :
                        toAddress === centralNodeAddress ? "green" : "gray";
      const edgeWidth = 1;

      processedEdges.push({
        id: edgeId,
        source: fromNodeID,
        sourceHandle: `${fromNodeID}-s`,
        target: toNodeID,
        targetHandle: `${toNodeID}-t`,
        label: `${valueInChain.toFixed(4)} ${chain.toLowerCase()}`,
        // animated: true,
        style: { stroke: edgeColor, strokeWidth: edgeWidth },
      });
    }
  });

  return { nodes: Array.from(processedNodesMap.values()), edges: processedEdges };
};

module.exports = { processGraphData };
