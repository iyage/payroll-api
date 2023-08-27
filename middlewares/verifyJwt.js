const jwtToken = require("jsonwebtoken");
const verifyJwt = async (req, res, next) => {
  /**
   * @type{String} authHeader
   */
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader?.startsWith("Bearer")) {
    return res.status(403).send({
      message: "Forbidden",
      data: null,
    });
  }
  const accessToken = authHeader.split(" ")[1];
  jwtToken.verify(
    accessToken,
    "12345juklinhj3460lkyinbgfrte",
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Invalid or Expired token",
          data: null,
        });
      }
      req.user = decoded.userInfo;
      next();
    }
  );
};
module.exports = verifyJwt;
