const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
    trim: true,
  },
  confirm: {
    type: String,
    required: true,
    trim: true,
  },
  showPassword: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
});

registrationSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});
module.exports = mongoose.model("UserModel", registrationSchema);
