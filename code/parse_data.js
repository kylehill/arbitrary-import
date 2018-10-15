const transformColumn = (value, type) => {
    const transforms = {
        "TEXT": (a) => a.trimEnd(),
        "INTEGER": (a) => Number(a),
        "BOOLEAN": (a) => (a === "1")
    }

    return transforms[type](value)
}

module.exports = (data, specs, callback) => {

    data = data.map((file) => {
        const format = specs[file.format]

        file.data = file.content.map((line) => {
            return format.reduce((mem, column) => {
                const raw = mem.line.substring(0, column.width)
                const value = transformColumn(raw, column.datatype)
                
                mem.object[column["column name"]] = value
                mem.line = mem.line.substring(column.width)
                
                return mem
            }, { 
                line, 
                object: {} 
            }).object
        })

        return file
    })

    callback(null, data)
}
