const tap = require("tap")
const parse_specs = require("../code/parse_specs")

tap.test("Parses specs", (t) => {

    const filesMock = [{
        filename: "mockformat_2018-10-14.txt",
        format: "mockformat",
        content: [
            "\"column name\",width,datatype",
            "name,10,TEXT",
            "valid,1,BOOLEAN",
            "count,3,INTEGER"
        ]
    }]

    parse_specs(filesMock, (err, res) => {
        t.same(res, {
            mockformat: [{
                "column name": "name",
                width: "10",
                datatype: "TEXT"
            },{
                "column name": "valid",
                width: "1",
                datatype: "BOOLEAN"
            },{
                "column name": "count",
                width: "3",
                datatype: "INTEGER"
            }]
        })
        t.end()
    })

})
