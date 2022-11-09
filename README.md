## Webp converter script

This repository contains the script I created to convert images to webp format. To use this script you have to install **webp-converter** package from npm.

This is the overview of the script:

```js
const webp = require("webp-converter");
const fs = require("fs");
const { promisify } = require("util");
const { exit } = require("process");

fs.readdir = promisify(fs.readdir);
fs.unlink = promisify(fs.unlink);
// regex to extract image files
const SUPPORTED_FILES_REGEX = /\.(png|jpe?g)$/;
// image quality of the output file
const QUALITY = 85;
// directory containing images
const PATH = "./";

// returns a list of images
const getAllImages = async () => {
  const files = await await fs.readdir(PATH);
  return files.filter((image) => SUPPORTED_FILES_REGEX.test(image));
};
const convert = async (image, output = image.split(".")[0] + ".webp") => {
  return webp.cwebp(image, output, `-q ${QUALITY}`);
};
const deleteFile = async (file) => await fs.unlink(file);
const convertAll = async (del = false) => {
  try {
    const images = await getAllImages();
    images.forEach(async (image) => {
      await convert(image);
    });
    if (del) {
      images.forEach((image) => {
        deleteFile(image);
      });
    }
  } catch (error) {
    console.log("Error: ", error.message);
  }
};
if (process.argv[2] === "ALL" && process.argv[3] === "--delete") {
  convertAll(true);
} else if (process.argv[2] === "ALL") {
  convertAll();
}

if (process.argv[2] === "ONE" && process.argv.length === 5) {
  convert(process.argv[3], process.argv[4]);
}
```

### USAGE:

```
ubuntu@ubuntu:~/Documents$ node convert.js OPTION [ARGUMENTS]
```

### OPTION:

| OPTION | Description                                                                                                                                                                                  |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ALL    | Converts all images in the specified directory. <br>If you pass **--delete** after the command the original<br> images will be deleted.<br> **Example**: `$ node convert.js ALL --delete`    |
| ONE    | Converts one single image. You have to pass in <br>the input file name and the output file name in <br> the specified directory <br> **Example**: `$ node convert.js ONE input.png out.webp` |

### CUSTOMIZATION

You can customize this script by editing the global variables

- **SUPPORTED_FILES_REGEX** : use it to expand the number of images to convert.
- **QUALITY** : use this to customize the quality of the output image. QUALITY should be a number between 0 and 100.
- **PATH**: use this to customize the path containing images.
