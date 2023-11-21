export default function requireJson(req, res, next) {
    if (req.is('application/json')) {
      return next();
    }
  
    const error = new Error('This resource only has an application/json representation');
    error.status = 415; // 415 Unsupported Media Type
    next(error);
  }