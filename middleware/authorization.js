const authorizationMiddleware = (req, res, next) => {
  // Implement your authorization logic here
  // For example, check if the user has the necessary permissions

  // Assuming you have a property on the user object to check the role or permission
  if (req.user.role !== "admin") {
    return res.status(403).render("error", { message: "Access Denied" });
  }

  next();
};

export default authorizationMiddleware;
