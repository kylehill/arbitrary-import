const { Client } = require("pg")
const tap = require("tap")
const create_structure = require("../code/create_structure")
const insert_rows = require("../code/insert_rows")
const env = require("../env_test")

const mockSpecs = {
    test1: [
        { "column name": "first", width: 5, datatype: "TEXT" },
        { "column name": "second", width: 1, datatype: "BOOLEAN" },
        { "column name": "third", width: 5, datatype: "INTEGER" },
    ],
    test2: [
        { "column name": "only", width: 100, datatype: "TEXT" }
    ]
}

const mockData = [
    { 
        name: "test1_file.txt", 
        format: "test1", 
        data: [{
                first: "Kyle",
                second: true,
                third: -143
            },{
                first: "John",
                second: false,
                third: 87
            },{
                first: "Calum",
                second: false,
                third: 0
            }
        ] 
    },{ 
        name: "test2_fileA.txt", 
        format: "test2", 
        data: [] 
    },{
        name: "test2_fileB.txt",
        format: "test2",
        data: [{
            only: "This is some text"
        },{
            only: "This is also some text"
        },{
            only: "You'd be surprised just how much text there is"
        }]
    }
]

tap.test("Inserts rows", (t) => {
    create_structure(mockSpecs, mockData, env, (err, schemaName) => {
        insert_rows(mockSpecs, mockData, schemaName, env, (err, res) => {
            t.same(res, { tables: 2, rows: 6 })

            const client = new Client(env)
            client.connect()

            client.query(`DROP SCHEMA ${schemaName} CASCADE`, () => {
                client.end()
                t.done()
            })
        })
    })
})
