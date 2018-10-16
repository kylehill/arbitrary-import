const { Client } = require("pg")
const async = require("async")

const transformColumn = (value, type) => {
    const transforms = {
        "TEXT": (text) => {
            const escapedText = text.split("'").join("''")
            return `'${escapedText}'`
        },
        "INTEGER": (a) => a,
        "BOOLEAN": (a) => a ? "TRUE" : "FALSE"
    }

    return transforms[type](value)
}

module.exports = (specs, data, schemaName, env, callback) => {
    
    const client = new Client(env)
    client.connect()

    const fillTable = (file, cb) => {
        if (file.data.length === 0) {
            return cb(null)
        }

        const tableName = file.name.split(".")[0].split("-").join("_")
        const spec = specs[file.format]
        
        const rowStatement = file.data.map((row) => {
            const rowValues = spec.map((column) => {
                return transformColumn(row[column["column name"]], column.datatype)
            }).join(", ")

            return `(${rowValues})`
        }).join(", ")

        const fullQuery = `
            INSERT INTO ${schemaName}.${tableName}
            VALUES ${rowStatement}`

        client.query(fullQuery, (err, res) => {
            cb(err, res)
        })
    }

    async.map(data, fillTable, (err, res) => {
        client.end()
        
        const summary = res.reduce((mem, table) => {
            if (table) {
                mem.tables += 1
                mem.rows += table.rowCount
            }
            return mem
        }, { tables: 0, rows: 0 })

        callback(err, summary)
    })
}
