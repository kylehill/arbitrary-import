// node core packages
const path = require("path")

// npm installed packages
const async = require("async")

// project code
const code = require("./code")
const env = require("./env")

const start = Date.now()

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
  }],

  create_structure: [ "parse_data", (results, cb) => {
    code.create_structure(results.parse_specs, results.parse_data, env, cb)
  }],

  insert_rows: [ "create_structure", (results, cb) => {
    code.insert_rows(
      results.parse_specs, 
      results.parse_data, 
      results.create_structure, 
      env, 
      cb)
  }]

}, (err, res) => { 
  const time = (Date.now() - start)
  
  if (err) {
    console.log("Error:", err)
    return
  }

  console.log(`Added ${res.insert_rows.rows} row(s) in ${res.insert_rows.tables} table(s)`)
  console.log(`Schema: ${res.create_structure} | Time: ${time}ms`)
})
