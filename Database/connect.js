const Url = process.env.NODE_DB;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const mongoConnect = (async () => {
  try {
    let mongoConnection = await mongoose.connect(Url);
    console.log(`Connected To Database 👍`);
  } catch (error) {
    console.log(`Can't Connect To The Database 👎`);
  }
})();

let Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    default: 0,
    select: false,
  },
  isExpire: {
    type: Date,
    default: 0,
    select: false,
  },
});

Schema.pre("save", async function () {
  try {
    let hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    this.confirmpassword = undefined;
  } catch (error) {
    console.log(error);
  }
});

Schema.methods.CheckPassword = async (nonencrypted, Encrypted) => {
  try {
    let checkPassword = await bcrypt.compare(nonencrypted, Encrypted);
    if (checkPassword === true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return "error";
  }
};

let model = mongoose.model("user", Schema);

exports.mongoose = mongoConnect;
exports.model = model;
