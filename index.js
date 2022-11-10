const webp = require("webp-converter");
const fs = require("fs");
const { promisify } = require("util");
const { exit } = require("process");
const path = require("path");

fs.readdir = promisify(fs.readdir);
fs.unlink = promisify(fs.unlink);
// regex to extract image files
const SUPPORTED_FILES_REGEX = /\.(png|jpe?g)$/;
// image quality of the output file
const QUALITY = 85;
// directory containing images
const PATH = "";

// returns a list of images
const getAllImages = async () => {
  const filename = path.join(__dirname, PATH);
  const files = await fs.readdir(filename);
  return files.filter((image) => SUPPORTED_FILES_REGEX.test(image));
};

const convert = async (image, output = image.split(".")[0] + ".webp") => {
  return webp.cwebp(image, output, `-q ${QUALITY}`);
};

const convertAll = async (del = false) => {
  try {
    const images = await getAllImages();
    images.forEach(async (image) => {
      await convert(image);
    });
  } catch (error) {
    console.log("Error: ", error.message);
  }
};
if (process.argv[2] === "ALL") {
  convertAll(true);
} else if (process.argv[2] === "ALL") {
  convertAll();
}

if (process.argv[2] === "ONE" && process.argv.length === 5) {
  convert(process.argv[3], process.argv[4]);
}
