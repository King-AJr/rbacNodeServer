const router = require('express').Router();
const {
    employeeAuth,
    employeeLogin,
    checkRole,
    employeeSignup,
    jwtauth
  } = require("../Controller/authFunctions");

// Software engineering Registeration Route
router.post("/register-se", (req, res) => {
    employeeSignup(req.body, "se", res);
 });
 
 //Marketer Registration Route
 router.post("/register-marketer", async (req, res) => {
   await employeeSignup(req.body, "marketer", res);
 });
 
 //Human resource Registration route
 router.post("/register-hr", async (req, res) => {
   await employeeSignup(req.body, "hr", res);
 });
 
 
 // Software engineers Login Route
 router.post("/Login-se", async (req, res) => {
   await employeeLogin(req.body, "se", res);
 });
 
 // Human Resource Login Route
 router.post("/Login-hr", async (req, res) => {
   await employeeLogin(req.body, "hr", res);
 });
 
 // Marketer Login Route
 router.post("/Login-marketer", async (req, res) => {
   await employeeLogin(req.body, "marketer", res);
 });
 
 //Software engineers protected route
 router.get(
   "/se-protected",
   employeeAuth,
   checkRole(["se"]),
   async (req, res) => {
     return res.json(`welcome ${req.body.name}`);
   }
 );
 
 
 //Marketers protected route
 router.get(
   "/marketers-protected",
   employeeAuth,
   checkRole(["marketer"]),
   async (req, res) => {
     return res.json(`welcome ${req.body.name}`);
   }
 );
 
 
 //HR personels protected route
 router.get(
   "/hr-protected",
   employeeAuth,
   checkRole(["hr"]),
   async (req, res) => {
     return res.json(`welcome ${req.body.name}`);
   }
 );
 
 router.post("/protected", jwtauth, (req, res) => {
   res.status(200).send("Here's the info you requested ");
 });

 module.exports = router;