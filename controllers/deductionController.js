const Deduction = require("../model/Deduction");
const User = require("../model/User");

const addNewDeduction = async (req, res) => {
  const reqBody = req.body;
  if (!reqBody) {
    return res.status(400).send("Valid payload is required");
  }
  if (!reqBody.percentage) {
    return res.status(400).send("Valid percentages  is required");
  }
  if (!reqBody.employeeId) {
    return res.status(400).send("Valid employeeId  is required");
  }
  if (!reqBody.deduction) {
    return res.status(400).send("Valid deduction  is required");
  }
  try {
    const user = await User.findById(reqBody.employeeId).exec();
    if (!user) {
      return res.status(400).send({
        message: `Employee with  ${reqBody?.employeeId} does not exist`,
        data: null,
      });
    }
    const duplicate = await Deduction.findOne({
      employee: reqBody.employeeId,
      deduction: reqBody.deduction,
    });
    if (duplicate) {
      return res.status(400).send({
        message: `${reqBody.deduction} set for employee already`,
        data: null,
      });
    }
    const deduction = await Deduction.create({
      percentage: reqBody.percentage,
      employee: reqBody.employeeId,
      deduction: reqBody.deduction,
    });

    return res.status(200).send({
      message: "New deduction created for user",
      data: deduction,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
      data: null,
    });
  }
};
module.exports = addNewDeduction;
