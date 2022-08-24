const express = require("express");
const router = express.Router();
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "HELLO_REEBAL";
const jwt = require("jsonwebtoken");

//Route 1: Create a User using POST: "/api/auth,createuser". no login requried
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password atleast 5 char").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //if there is error, return Bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      //Check whether user exist already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry email alraady exist" });
      }
      //Password hashing
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //Create a new User
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: { id: user.id },
      };

      const jwtData = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, jwtData });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some Error");
    }
  }
);

//Route 2: Authentication User using POST: "/api/auth/login".
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    //if there is error, return Bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with valid email or password" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with valid email or password",
        });
      }

      const data = {
        user: { id: user.id },
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, jwtData });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some Error");
    }
  }
);

//Route 3: Get loggedin user Details using POST: "/api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error");
  }
});

module.exports = router;
