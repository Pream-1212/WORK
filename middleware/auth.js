exports.ensureauthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

exports.ensureManager = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "manager") {
    return next();
  }
  res.redirect("/");
};

exports.ensureagent = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "attendant") {
    return next();
  }
  res.redirect("/");
};
