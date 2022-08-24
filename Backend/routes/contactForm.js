const express = require("express");
const router = express.Router();
// const fetchuser = require("../moddleware/fetchuser");
const ContactForm = require("../models/ContactForm");
const { body, validationResult } = require("express-validator");

//Route 2: Adding contactform /api/contactform
router.post(
  "/contactform",
  [
    body("f_name", "Enter a valid name").isLength({ min: 3 }),
    body("l_name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone").isNumeric(),
    body("country", "Invalid").isString(),
    body("city", "Invalid").isString(),
    body("company_name", "Enter a valid name"),
    body("company_website", "Enter a valid site"),
    body("Plan", "Enter a valid description atleast 5 char"),
  ],
  async (req, res) => {
    const {
      f_name,
      l_name,
      email,
      phone,
      country,
      city,
      company_name,
      company_website,
      plan,
    } = req.body;

    // if there is error, return Bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check whether user exist already
      let user = await ContactForm.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry email alraady exist" });
      }
      const userfeedback = new ContactForm({
        f_name,
        l_name,
        email,
        phone,
        country,
        city,
        company_name,
        company_website,
        plan,
      });
      const saveNote = await userfeedback.save();
      res.json(userfeedback);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
  //     try {
  //       const note = new Note({
  //         title,
  //         description,
  //         tag,
  //         user: req.user.id,
  //       });
  //       const saveNote = await note.save();
  //       res.json(note);
  //     }
  //   }
);

module.exports = router;
