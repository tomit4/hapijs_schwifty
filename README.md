<h4>This is a basic following of a the documentation behind the @hapi/schwifty plugin.  This plugin interfaces with our Hapi server and creates a connection point through which one can quickly set up a KnexJS/ObjectionJS ORM which can interact with a SQL database (in this case, MariaDB)</h4>

This tutorial requires a few dependencies, here's what you'll need

`npm install @hapi/hapi`
`npm install @hapipal/schwifty`
`npm install knex`
`npm install objection`
`npm install joi`
`npm install dotenv`

<p>The documentation for @hapi/schwifty can be found <a href="https://hapipal.com/docs/schwifty">here</a></p>

_Note that this simple tutorial ONLY sets up the database ONCE, and has no implementation out of the box to DROP the "Dogs" table once it has been run, you will have to drop the table manually if you wish to run the server more than once... I'll be investigating KnexJS and its more basic interface before returning to Schwifty with hopefully a better understanding of how it interfaces together._
