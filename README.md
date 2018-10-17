# Arbitrary Importer Homework

Hi! Hopefully you know what this is for; since I'm putting this on (publicly searchable) GitHub I don't want to mention it specifically!

#### Requirements

* An instance of postgres, running somewhere
* node.js (this was developed on v10.12; older versions *probably* work but YMMV)

#### Installation

1. `npm install`
2. Configure `./env.json` and `./env-test.json` to point at databases running on a postgres instance
3. Create/replace files in the `data/` and `specs/` directories

#### Commands

* `npm run import` -- executes the import code, using the credentials specified in `./env.json`
* `npm run test` -- runs unit tests and code coverage
* `npm run lint` -- runs ESLint on code

When the import code is run,

1. A new schema will be created, `import_${epoch}`
2. A table will be created for each valid data file. The table name will be everything before the extension (with hyphens converted to underscores b/c postgres gets angry otherwise)
3. Rows will be added to the appropriate tables -- per a strict reading of the project's specification, there are no autoincrement/primary keys
4. Some summary text will print to stdout