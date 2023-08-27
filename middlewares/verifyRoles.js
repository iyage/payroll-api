function verifyUserRole(...userRole) {
  return (req, res, next) => {
    if (!req?.user?.roles) {
      return res.status(401).send({
        data: null,
        message: "Unauthorized",
      });
    }
    let userRoles = req?.user?.roles;

    const verifyRoles = [...userRole, ...userRoles];
    const truthTable = verifyRoles.map((role) => {
      if (verifyRoles.indexOf(role) !== verifyRoles.lastIndexOf(role))
        return true;
    });
    if (!truthTable.includes(true)) {
      return res.status(401).send({
        data: null,
        message: "Unauthorized",
      });
    }
    next();
  };
}
module.exports = verifyUserRole;
