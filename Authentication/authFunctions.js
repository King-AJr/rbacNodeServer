const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require ('dotenv').config()
const Employee = require("../Database/employee");

/**
 * @DESC To register the user (ENGINEER, MARKETER, HR-PERSONNEL)
 */
const employeeSignup = async (req, role, res) => {
  try {
    // Validate the name
    let nameNotTaken = await validateEmployeename(req.name);
    if (!nameNotTaken) {
      return res.status(400).json({
        message: `Employee is already registered.`
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(req.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`
      });
    }

    // Get the hashed password
    const password = await bcrypt.hash(req.password, 12);
    // create a new user
    const newEmployee  = new Employee ({
      ...req,
      password,
      role
    });

    await newEmployee .save();
    return res.status(201).json({
      message: "Hurry! now you are successfully registred. Please nor login."
    });
  } catch (err) {
    // Implement logger function if any
    return res.status(500).json({
      message: `${err.message}`
    });
  }
};

/**
 * @DESC To Login the user (ENGINEER, MARKETER, HR-PERSONNEL)
 */
const employeeLogin = async (req, role, res) => {
  let { name, password } = req;
  // First Check if the name is in the database
  const employee = await Employee.findOne({ name });
  if (!employee) {
    return res.status(404).json({
      message: "Employee name is not found. Invalid login credentials.",
    });
  }
  // We will check the role
  if (employee.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
    });
  }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, employee.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        role: employee.role,
        name: employee.name,
        email: employee.email
      },
      process.env.APP_SECRET,
      { expiresIn: "3 days" }
    );

    let result = {
      name: employee.name,
      role: employee.role,
      email: employee.email,
      token: `Bearer ${token}`,
      expiresIn: 168
    };

    return res.status(200).json({
      ...result,
      message: "You are now logged in."
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password."
    });
  }
};

const validateEmployeename = async name => {
  let employee = await Employee.findOne({ name });
  return employee ? false : true;
};

/**
 * @DESC Verify JWT
 */
//const employeeAuth = passport.authenticate("jwt", { session: false });

const employeeAuth =   (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(process.env.APP_SECRET);
  if (!authHeader) return res.sendStatus(403);
  console.log(authHeader); // Bearer token
  const token = authHeader.split(' ')[1];
  jwt.verify(
      token,
      process.env.APP_SECRET,
      (err, decoded) => {
          console.log('verifying');
          if (err) return res.sendStatus(403); //invalid token     
          console.log(decoded);
          next();
    },
      
  );
}

/**
 * @DESC Check Role Middleware
 */
const checkRole = roles => async (req, res, next) => {
  let { name } = req.body;
  const employee = await Employee.findOne({ name });
  console.log('in checkrole');
  !roles.includes(employee.role)
    ? res.status(401).json("Sorry you do not have access to this route")
    : next();
}
const validateEmail = async email => {
  let employee = await Employee.findOne({ email });
  return employee ? false : true;
};


module.exports = {
  employeeAuth,
  checkRole,
  employeeLogin,
   employeeSignup
};
