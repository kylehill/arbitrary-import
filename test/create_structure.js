const { Client } = require("pg")
const tap = require("tap")
const create_structure = require("../code/create_structure")
const env = require("../env_test")

const specs = {
    test1: [
        { "column name": "first", width: 5, datatype: "TEXT" },
        { "column name": "second", width: 1, datatype: "BOOLEAN" },
        { "column name": "third", width: 5, datatype: "INTEGER" },
    ],
    test2: [
        { "column name": "only", width: 100, datatype: "TEXT" }
    ]
}

const data = [
    { name: "test1_file", format: "test1" },
    { name: "test2_fileA", format: "test2" },
    { name: "test2_fileB", format: "test2" },
]

tap.test("Creates tables and schema", (t) => {
    create_structure(specs, data, env, (err, schemaName) => {
        const client = new Client(env)
        client.connect()

        client.query(`
            SELECT * 
            FROM information_schema.tables 
            WHERE table_schema = '${schemaName}'`, (err, res) => {
                
            t.equal(res.rows.length, 3)
            const tableNames = res.rows.map((row) => {
                return row.table_name
            })
            t.same(tableNames, [
                "test1_file",
                "test2_filea",
                "test2_fileb"
            ])

            client.query(`DROP SCHEMA ${schemaName} CASCADE`, () => {
                client.end()
                t.done()
            })
        })
    })
})

tap.test("Fails gracefully if client connection fails", (t) => {
    const brokenEnv = Object.assign({}, env, { database: "arbitrary_broken" })
    create_structure(specs, data, brokenEnv, (err, schemaName) => {
        t.same(err, { error: "Node-Postgres could not connect to server" })
        t.end()
    })
})