const express = require("express");
const {
  addNewUser,
  userLogin,
  getAllUsers,
  addSalary,
} = require("../controllers/userController");
const router = express.Router();
const bodyParser = require("body-parser");
const verifyJwt = require("../middlewares/verifyJwt");
const generatePaySlip = require("../controllers/payslipController");
const verifyUserRole = require("../middlewares/verifyRoles");
const { roles } = require("../utils/roles");
const addNewDeduction = require("../controllers/deductionController");
const jsonParser = bodyParser.json();
const app = express();

router.post("/registration", jsonParser, addNewUser);
router.post("/login", jsonParser, userLogin);
router.get("/get_all_users", verifyJwt, getAllUsers);
router.post(
  "/generate_payslips",
  jsonParser,
  verifyJwt,
  verifyUserRole(roles.adminRole),
  generatePaySlip
);
router.post(
  "/create_new_deduction",
  jsonParser,
  verifyJwt,
  verifyUserRole(roles.adminRole),

  addNewDeduction
);
router.post(
  "/add_salary",
  jsonParser,
  verifyJwt,
  verifyUserRole(roles.adminRole),

  addSalary
);
module.exports = router;
