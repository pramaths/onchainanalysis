const sseMiddleware = (req, res, next) => {
    res.sseSetup = () => {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
    };
  
    res.sseSend = (data) => {
      console.log("Sending SSE:", data);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
  
    next();
  };
  
  module.exports = sseMiddleware;
  