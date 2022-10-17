const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employee = require('../Database/employee.js')


const userLogin = async (req, role, res) => {
  let { name, password } = req.body;
  // First Check if the username is in the database
  const employees = await Employee.findOne({ name });
  if (!employees) {
    return res.status(404).json({
      message: "Username is not found. Invalid login credentials.",
    });
  }
  // We will check the role
  if (employees.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
    });
  }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, employees.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        role: employees.role,
        name: employees.name,
        email: employees.email
      },
      process.env.APP_SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      name: employees.name,
      role: employees.role,
      email: employees.email,
      token: `Bearer ${token}`,
      expiresIn: 168
    };

    return res.status(200).json({
      ...result,
      message: `welcome back ${role} ${name}`,
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
    });
  }
};

module.exports = {userLogin}