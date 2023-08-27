const { Schema, default: mongoose } = require("mongoose");
const User = require("../model/User");
const Payslip = require("../model/payslip");

const generatePaySlip = async (req, res) => {
  const reqBody = req.body;
  if (!reqBody) {
    return res.status(400).send("Valid payload is required");
  }
  if (!reqBody.employeeId) {
    return res.status(400).send("Valid employeeId  is required");
  }
  try {
    let employee = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(reqBody.employeeId),
        },
      },
      {
        $lookup: {
          from: "deductions",
          localField: "_id",
          foreignField: "employee",
          as: "deductions",
          pipeline: [
            {
              $project: {
                _id: 0,
                deduction: 1,
                percentage: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "salaries",
          localField: "_id",
          foreignField: "employee",
          as: "salaries",
          pipeline: [
            {
              $project: { salary: 1, _id: 0 },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          salaries: 1,
          deductions: 1,
        },
      },
    ]);
    employee = employee[0];
    if (!employee) {
      return res.status(400).send({
        message: `Employee with  ${reqBody?.employeeId} does not exist`,
        data: null,
      });
    }
    console.log(employee);
    if (!employee.deductions) {
      return res.status(400).send({
        message: `Please set employee deductions`,
        data: null,
      });
    }
    if (!employee.salaries) {
      return res.status(400).send({
        message: `Please set employee salary`,
        data: null,
      });
    }
    const salary = employee.salaries[0].salary;

    console.log(salary);
    const deductions = employee.deductions.map((deduction) => {
      deduction.value = salary * (deduction.percentage / 100);
      return deduction;
    });
    let net = salary;
    deductions.forEach((deduction) => {
      net -= deduction.value;
    });
    const payslip = await Payslip.create({
      gross: salary,
      employee: reqBody.employeeId,
      deductions: deductions,
      net: net,
    });

    return res.status(200).send({
      message: "Payslip generated succesfully",
      data: payslip,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
      data: null,
    });
  }
};
module.exports = generatePaySlip;
