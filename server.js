const cors = require('cors');
const express = require('express');
const bp = require('body-parser')
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

//Connecting our database
mongoose.connect(
  'mongodb+srv://KingAJ:kingaj@rbacdb.wqwubry.mongodb.net/?retryWrites=true&w=majority',
)
.then(() => {
  console.log('MongoDB connected...');
})
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({extended: true}))

const {
  employeeAuth,
  employeeLogin,
  checkRole,
  employeeSignup,
} = require("./Authentication/authFunctions");

// Software engineering Registeration Route
app.post("/register-se", (req, res) => {
   employeeSignup(req.body, "se", res);
});

//Marketer Registration Route
app.post("/register-marketer", async (req, res) => {
  await employeeSignup(req.body, "marketer", res);
});

//Human resource Registration route
app.post("/register-hr", async (req, res) => {
  await employeeSignup(req.body, "hr", res);
});


// Software engineers Login Route
app.post("/Login-se", async (req, res) => {
  await employeeLogin(req.body, "se", res);
});

// Human Resource Login Route
app.post("/Login-hr", async (req, res) => {
  await employeeLogin(req.body, "hr", res);
});

// Marketer Login Route
app.post("/Login-marketer", async (req, res) => {
  await employeeLogin(req.body, "marketer", res);
});

//Software engineers protected route
app.get(
  "/se-protected",
  employeeAuth,
  checkRole(["se"]),
  async (req, res) => {
    return res.json(`welcome ${req.body.name}`);
  }
);


//Marketers protected route
app.get(
  "/marketers-protected",
  employeeAuth,
  checkRole(["marketer"]),
  async (req, res) => {
    return res.json(`welcome ${req.body.name}`);
  }
);


//HR personels protected route
app.get(
  "/hr-protected",
  employeeAuth,
  checkRole(["hr"]),
  async (req, res) => {
    return res.json(`welcome ${req.body.name}`);
  }
);



app.listen(3000, () => console.log(`server is running on port ${PORT}`));
