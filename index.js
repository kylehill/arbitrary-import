// node core packages
const path = require("path")

// npm installed packages
const async = require("async")

// project code
const code = require("./code")
const env = require("./env") // Postgres location and credentials

const start = Date.now()

async.auto({

    // Reads all files in the /specs directory into memory
    spec_files: (cb) => {
        code.read_directory(path.resolve(__dirname, "specs"), cb)
    },

    // Reads all files in the /data directory into memory
    /* Returns an array of objects with the shape { 
        filename: formatName1_date.txt,
        format: formatName1,
        content: [lines of text] 
    } */
    data_files: (cb) => {
        code.read_directory(path.resolve(__dirname, "data"), cb)
    },

    // Runs all the files in the /specs directory through a CSV parser
    /* Returns an object with the shape { 
        formatName1: [columns], 
        formatName2: [columns], ... 
    } */
    parse_specs: [ "spec_files", (results, cb) => {
        code.parse_specs(results.spec_files, cb)
    }],

    // Runs all the files in the /data directory through the appropriate de-serializer
    /* Returns an array of objects with the shape {
        filename: <same>
        format: <same>
        data: [
            { column1: "X", column2: true, column3: 45 }, ...
        ]
    } */
    parse_data: [ "data_files", "parse_specs", (results, cb) => {
        code.parse_data(results.data_files, results.parse_specs, cb)
    }],

    // Creates a schema and tables in the specified postgres instance
    // Returns the schema's name
    create_structure: [ "parse_data", (results, cb) => {
        code.create_structure(results.parse_specs, results.parse_data, env, cb)
    }],

    // Inserts all rows into their applicable tables
    /* Returns an object with the shape { 
        tables: 13,
        rows: 254
    } */
    insert_rows: [ "create_structure", (results, cb) => {
        code.insert_rows(
            results.parse_specs, 
            results.parse_data, 
            results.create_structure, 
            env, 
            cb
        )
    }]

}, (err, res) => { 
    const time = (Date.now() - start)

    if (err) {
        console.log("Error:", err) // eslint-disable-line
        return
    }

    console.log(`Added ${res.insert_rows.rows} row(s) in ${res.insert_rows.tables} table(s)`) // eslint-disable-line
    console.log(`Schema: ${res.create_structure} | Time: ${time}ms`) // eslint-disable-line
})
