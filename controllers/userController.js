const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwtToken = require("jsonwebtoken");
const Salary = require("../model/Salary");
const { default: mongoose } = require("mongoose");
const addNewUser = async (req, res) => {
  const reqBody = req.body;
  console.log(reqBody);
  if (!reqBody) {
    return res.status(400).send("Valid payload is required");
  }
  if (!reqBody.firstName) {
    return res.status(400).send("Valid First Name  is required");
  }
  if (!reqBody.lastName) {
    return res.status(400).send("Valid Last Name  is required");
  }
  if (!reqBody.email) {
    return res.status(400).send("Valid email  is required");
  }
  if (!reqBody.password) {
    return res.status(400).send("Valid password  is required");
  }
  try {
    const duplicate = await User.findOne({ email: reqBody.email }).exec();
    if (duplicate) {
      return res.status(400).send({
        message: `User with email ${reqBody?.email} already exist`,
        data: null,
      });
    }
    const hashPassword = await bcrypt.hash(reqBody.password, 10);
    const newUser = await User.create({
      firstName: reqBody?.firstName,
      lastName: reqBody?.lastName,
      password: hashPassword,
      email: reqBody?.email,
      jobTile: reqBody?.jobTitle || null,
      position: reqBody?.position || null,
      reportTo: reqBody?.reportTo || null,
      startDate: reqBody?.startDate || null,
      endDate: reqBody?.endDate || null,
    });
    return res.status(201).send({
      message: "User Successfully Registered",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
      data: null,
    });
  }
};

const userLogin = async (req, res) => {
  const reqBody = req.body;
  if (!reqBody) {
    return res.status(400).send("Valid payload is required");
  }

  if (!reqBody.email) {
    return res.status(400).send("Valid email  is required");
  }
  if (!reqBody.password) {
    return res.status(400).send("Valid password  is required");
  }
  try {
    const user = await User.findOne({ email: reqBody.email }).exec();
    if (!user) {
      return res.status(400).send({
        message: "User does not exist",
        data: null,
      });
    }
    const match = await bcrypt.compare(reqBody.password, user.password);
    if (!match) {
      return res.status(400).send({
        message: "invalid password",
        data: null,
      });
    }

    const accessToken = jwtToken.sign(
      {
        userInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          id: user._id,
        },
      },
      "12345juklinhj3460lkyinbgfrte",
      {
        expiresIn: "1d",
      }
    );

    res.status(200).send({
      message: "user Login successfully",
      data: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
      data: null,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const employeList = await User.aggregate([
      {
        $lookup: {
          from: "payslips",
          localField: "_id",
          foreignField: "employee",
          as: "payslips",
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    res.status(200).send({
      message: "Users successfully fetched",
      data: employeList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
      data: null,
    });
  }
};

const addSalary = async (req, res) => {
  const reqBody = req.body;
  if (!reqBody) {
    return res.status(400).send("Valid payload is required");
  }
  if (!reqBody.salary) {
    return res.status(400).send("Valid  salary  is required");
  }
  if (!reqBody.employeeId) {
    return res.status(400).send("Valid employeeId  is required");
  }

  try {
    await Salary.init();
    const employee = await User.findById(reqBody.employeeId);
    if (!employee) {
      return res.status(400).send({
        message: `Employee with  ${reqBody?.employeeId} does not exist`,
        data: null,
      });
    }

    const salary = await Salary.create({
      salary: reqBody.salary,
      employee: reqBody.employeeId,
    });

    res.status(200).send({
      message: "Salary added for user",
      data: salary,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      data: null,
    });
  }
};

const getUserById = async (req, res) => {
  const reqBody = req.body;
  if (!reqBody) {
    return res.status(400).send("Valid payload is required");
  }

  if (!reqBody.employeeId) {
    return res.status(400).send("Valid password  is required");
  }
  try {
    const employee = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(reqBody.employeeId),
        },
      },
      {
        $lookup: {
          from: "payslips",
          localField: "_id",
          foreignField: "employee",
          as: "payslips",
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);
    if (!employee) {
      return res.status(400).send({
        message: `Employee with  employeeId ${reqBody?.employeeId} does not exist`,
        data: null,
      });
    }

    return res.status(200).send({
      message: "User Successfully fetched",
      data: employee[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
      data: null,
    });
  }
};

module.exports = { addNewUser, userLogin, getAllUsers, addSalary, getUserById };
