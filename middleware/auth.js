// ensure user is authenticated
exports.ensureauthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
};

// ensure user is a manager
exports.ensureManager = (req, res, next) => {
  if (req.session.user && req.session.user.role === "Manager") {
    return next();
  }
  res.redirect("/");
};
// ensure user is a agent

exports.ensureagent = (req, res, next) => {
  if (req.session.user && req.session.user.role === "Attendant") {
    return next();
  }
  res.redirect("/");
};
//     res.status(403).send('Access denied. Managers only.');
// };
