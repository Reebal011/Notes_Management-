const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactFormSchema = new Schema({
  f_name: {
    type: String,
    ref: "user",
  },
  l_name: {
    type: String,
    ref: "user",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  company_name: {
    type: String,
  },
  cpmpany_website: {
    type: String,
  },
  plan: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ContactForm = mongoose.model("contactForm", ContactFormSchema);
module.exports = ContactForm;
