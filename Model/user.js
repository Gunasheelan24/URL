let { model } = require("../Database/connect");
const idGenerate = require("short-unique-id");
const { postUrl } = require("../Model/Url");
const { mail } = require("../Database/Nodemailer");
const jwt = require("jsonwebtoken");

let signup = async (req, res, next) => {
  try {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body.confirmpassword;
    let save = await model.create({
      name: name,
      email: email,
      password: password,
      confirmpassword: confirmPassword,
    });
    res.status(200).json({
      status: "Success",
      message: "user Created",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

let signin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let findEmail = await model.findOne({ email: email });
    if (!findEmail) {
      res.status(404).json({
        status: "failed",
        message: "Please Check Your Email",
      });
    } else {
      let checkPassword = await findEmail.CheckPassword(
        password,
        findEmail.password
      );
      if (checkPassword === true) {
        let jwtToken = jwt.sign({ id: findEmail._id }, "guna", {
          expiresIn: "1h",
        });
        res.cookie("jwt", jwtToken, { httpOnly: false });
        res.cookie("username", findEmail.name);
        res.status(200).json({
          status: "success",
          message: findEmail.firstname,
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "Please Check You Password",
        });
      }
    }
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

let forgetPassword = async (req, res) => {
  try {
    let findEmail = await model.findOne({ email: req.body.email });
    if (!findEmail) {
      res.status(404).json({
        staus: "failure",
        message: "Please Provide a Valid Email Address",
      });
    } else {
      let generateIds = new idGenerate({ length: 15 });
      let uniqueIds = generateIds.rnd();
      let MainSend = mail(findEmail.email);
      findEmail.otp = MainSend;
      // findEmail.isExpire = Date.now()
      findEmail.save({ validateBeforeSave: false });
      if (MainSend) {
        res.status(200).json({
          status: "success",
          message: "Mail Send Successfully",
        });
      } else {
        res.status(404).json({
          status: "failure",
        });
      }
    }
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

let CreateUrl = async (req, res) => {
  try {
    let getUrl = req.body.url;
    let generateId = new idGenerate({ length: 5 });
    let uniqueId = generateId.rnd();
    let Create = await postUrl.create({ url: getUrl, sUrl: uniqueId });
    if (Create) {
      res.status(200).json({
        status: "success",
        message: "Url Saved",
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "Enter a Valid Url",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error,
    });
  }
};

let getFullUrl = async (req, res) => {
  let id = req.params.id;
  try {
    let findId = await postUrl.findOne({ sUrl: id });
    if (!findId) {
      res.status(404).json({
        status: "failure",
        message: "url Not Found",
      });
    } else {
      let url = findId.url;
      res.status(301).redirect(url);
    }
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error,
    });
  }
};

let getUrl = async (req, res) => {
  try {
    let getAllData = await postUrl.find();
    if (getAllData.length > 0) {
      res.status(200).json({
        status: "Success",
        result: getAllData.length,
        data: getAllData,
      });
    } else {
      res.status(200).json({
        status: "oops!!",
        result: "☹️ There is No Url To Show",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error,
    });
  }
};

let getOne = async (req, res) => {
  try {
    let id = req.params.id;
    let deleteUrl = await postUrl.findByIdAndDelete(id);
    if (deleteUrl) {
      res.status(200).json({
        status: "Success",
        message: "Deleted",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error,
    });
  }
};

let emailReset = async (req, res, next) => {
  try {
    let getOtp = await model.findOne({ otp: req.body.value.otp });
    let password = req.body.value.password;
    let confirmpassword = req.body.value.confirmpassword;
    if (getOtp) {
      let checkOld = await getOtp.CheckPassword(password, getOtp.password);
      if (checkOld === true) {
        getOtp.otp = 0;
        getOtp.save();
        res.status(404).json({
          status: "failure",
          message: "Current Password And New Password Are Same",
        });
      } else {
        getOtp.password = password;
        getOtp.confirmpassword = confirmpassword;
        getOtp.otp = 0;
        getOtp.save();
        res.status(200).json({
          status: "Success",
          message: "Password Changed",
        });
      }
    } else {
      res.status(404).json({
        status: "failure",
        message: "Incorect otp",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error,
    });
  }
};

let logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.clearCookie("username");
    res.status(200).json({
      status: "Success",
      message: "Logout Success",
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error,
    });
  }
};

exports.routes = {
  signin,
  signup,
  forgetPassword,
  CreateUrl,
  getFullUrl,
  getUrl,
  getOne,
  emailReset,
  logout,
};
