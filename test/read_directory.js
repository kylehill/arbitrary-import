const tap = require("tap")
const path = require("path")
const read_directory = require("../code/read_directory")

tap.test("Reads files in the data directory", (t) => {

    read_directory(path.resolve(__dirname, "../data"), (err, res) => {
        t.equal(res.length, 4)

        t.same(res[0], {
            name: "testformat1_2018-10-15.txt",
            format: "testformat1",
            content: [ 
                "Foonyor   1  1",
                "Barzane   0-12",
                "Quuxitude 1103"
            ]
        })

        t.end()
    })

})

tap.test("Reads files in the specs directory", (t) => {

    read_directory(path.resolve(__dirname, "../specs"), (err, res) => {
        t.equal(res.length, 3)

        t.same(res[0], {
            name: "testformat1.csv",
            format: "testformat1",
            content: [ 
                "\"column name\",width,datatype",
                "name,10,TEXT",
                "valid,1,BOOLEAN",
                "count,3,INTEGER"
            ]
        })

        t.end()
    })

})