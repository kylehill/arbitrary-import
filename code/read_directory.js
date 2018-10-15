const fs = require("fs")
const async = require("async")

module.exports = (path, callback) => {

  const fileIterator = (filename, callback) => {
    fs.readFile(`${path}/${filename}`, "utf8", (err, content) => {
      callback(null, {
        name: filename,
        format: filename.split(".")[0].split("_")[0],
        content: content.split("\n")
      })
    })
  }
  
  fs.readdir(path, (err, filenames) => {
    async.map(filenames, fileIterator, callback)
  })

}
