const tap = require("tap")
const path = require("path")
const parse_data = require("../code/parse_data")

tap.test("Parses data", (t) => {

    const dataMock = [{
        filename: "mockformat1_2018-10-15.txt",
        format: "mockformat1",
        content: [
            "Foo 1  20",
            "Bar 0 -19",
            "Baz 1   2"
        ]
    },{
        filename: "noformat1_2018-10-15.txt",
        format: "noformat1",
        content: [
            "1ABC  1",
            "0DEF  5",
            "0GHI  2"
        ]
    }]

    const specMock = {
        mockformat1: [{
            "column name": "Name",
            width: 4,
            datatype: "TEXT"
        },{
            "column name": "Present",
            width: 1,
            datatype: "BOOLEAN"
        },{
            "column name": "Value",
            width: 4,
            datatype: "INTEGER"
        }]
    }

    parse_data(dataMock, specMock, (err, res) => {
        t.equal(res.length, 1)
        t.same(res[0].data, [{
            Name: "Foo",
            Present: true,
            Value: 20
        },{
            Name: "Bar",
            Present: false,
            Value: -19
        },{
            Name: "Baz",
            Present: true,
            Value: 2
        }])
        t.end()
    })

})
