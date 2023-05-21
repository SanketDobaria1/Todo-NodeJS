const authenticationMiddleware = (req, res, next) => {
  // Implement your authentication logic here
  // For example, check if the user is logged in

  if (!req.isAuthenticated()) {
    return res.redirect("/users/login");
  }

  next();
};

export default authenticationMiddleware;
