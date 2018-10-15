// node core packages
const path = require("path")

// npm installed packages
const async = require("async")

// project code
const code = require("./code")


async.auto({
  
  spec_files: (cb) => {
    code.read_directory(path.resolve(__dirname, "specs"), cb)
  },
  
  data_files: (cb) => {
    code.read_directory(path.resolve(__dirname, "data"), cb)
  },

  parse_specs: [ "spec_files", (results, cb) => {
    code.parse_specs(results.spec_files, cb)
  }],

  parse_data: [ "data_files", "parse_specs", (results, cb) => {
    code.parse_data(results.data_files, results.parse_specs, cb)
  }]
  
}, (err, res) => { console.log(res.parse_data[0]) })