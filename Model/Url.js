let mongoose = require("mongoose");

let SchemaForUrl = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Enter The Full Url"],
  },
  sUrl: {
    type: String,
    required: [true, "Enter Your Short Url"],
  },
});

let url = mongoose.model("URL", SchemaForUrl);

exports.postUrl = url;
