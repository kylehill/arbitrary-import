const { Client } = require("pg")
const async = require("async")

const transformColumn = (column) => {
    const transforms = {
        "TEXT": () => `varchar(${column.width})`,
        "INTEGER": () => "int",
        "BOOLEAN": () => "boolean"
    }

    return transforms[column.datatype](column)
}

module.exports = (specs, data, env, callback) => {

    async.auto({
        
        connect_client: (cb) => {
            const client = new Client(env)
            client.connect((err) => {
                if (err) { 
                    return cb({ error: "Node-Postgres could not connect to server" }) 
                }

                cb(null, client)
            })
        },

        create_schema: [ "connect_client", (res, cb) => {
            const client = res.connect_client
            const timestamp = Math.floor(Date.now())
            const schemaName = `import_${timestamp}`

            client.query(`CREATE SCHEMA ${schemaName}`, () => {
                cb(null, schemaName)
            })
        }],

        create_tables: [ "create_schema", (res, cb) => {
            const client = res.connect_client
            const schemaName = res.create_schema

            const createTable = (file, callback) => {
                const tableName = file.name.split(".")[0].split("-").join("_")
                const spec = specs[file.format]
                const columns = spec.map((column) => {
                    return `"${column["column name"]}" ${transformColumn(column)}`
                }).join(", ")

                client.query(
                    `CREATE TABLE ${schemaName}.${tableName} (${columns})`, 
                    (err, res) => {
                        callback(err, res)
                    })
            }

            async.forEach(data, createTable, cb)
        }]

    }, (err, res) => {

        if (res && res.connect_client) {
            res.connect_client.end()
        }
        
        if (err) {
            return callback(err)
        }
        
        callback(null, res.create_schema)
    })
}
