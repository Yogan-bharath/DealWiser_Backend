const adminMiddleware = (req, res, next) => {
    console.log(req.user);
    console.log(req.user.role);
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

export default adminMiddleware