// middleware/socketMiddleware.js
export const socketMiddleware = (io) => {
    return (req, res, next) => {
      req.io = io;
      next();
    };
  };