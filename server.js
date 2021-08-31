"use strict";

const Hapi = require("@hapi/hapi");
const Schwifty = require("@hapipal/schwifty");
const Joi = require("joi");
const { nanoid } = require("nanoid");
require("dotenv").config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.HAPI_PORT,
  });

  server.route({
    method: "get",
    path: "/users/{username}",
    handler: async (request) => {
      // Uses ObjectionJS syntax, findOne() accepts knex where statements
      const { Users } = request.models();

      return await Users.query().findOne("username", request.params.username);
    },
  });

  await server.register({
    plugin: Schwifty,
    options: {
      migrateOnStart: true,
      knex: {
        client: process.env.DB_TYPE,
        useNullAsDefault: true,
        connection: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
        },
      },
    },
  });

  // Register a model with schwifty...

  // an extension of ObjectionJS Model API, here it just uses Joi to validate what is passed to it,
  // but it can do a lot more than this, see the Objection Model docs
  server.registerModel(
    class Users extends Schwifty.Model {
      static tableName = "users";
      static joiSchema = Joi.object({
        id: Joi.string(),
        username: Joi.string(),
        password: Joi.string(),
      });
    }
  );

  await server.initialize();

  // ... then make a table ...

  const knex = server.knex();

  // Similar to knex migrations...
  // Took a bit to figure this one out, similar to exports.down in knex migration files
  // This is definitely a bit hacky... investigate knex's NotExists clause to see if there's a better way to do this...
  try {
    // if the users table exists, then drop the table
    await knex.raw("select * from users").then(async (res) => {
      await knex.schema.dropTable("users");
    });
  } catch (err) {
    // otherwise just catch the error and do nothing with it...
    err;
  }
  // either way, create the table users...
  await knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.string("username").notNullable();
    table.string("password").notNullable();
  });

  const { Users } = server.models();

  // Similar to knex seeding, uses Objection .query() method ...
  // We can also use knex syntax here as well

  await Promise.all([
    Users.query().insert({
      // using nanoid for now, I'll need to figure out how to use knex's uuid.
      // I am having trouble as of right now, since knex requires providing an initial value for something that I wish to auto increment...
      // unlike raw SQL INSERT statements that will auto increment a uuid without any input into it's id field...
      id: nanoid(),
      username: "Claire",
      password: "someotherpassword",
    }),
    Users.query().insert({
      id: nanoid(),
      username: "Gatsby",
      password: "somekindapassword",
    }),
    Users.query().insert({
      id: nanoid(),
      username: "Beth",
      password: "terriblepassword",
    }),
  ]);

  // ... then start the server!

  await server.start();
  console.log(
    `Server started at ${server.info.protocol}://${process.env.HAPI_HOST}:${server.info.port}`
  );
  //   console.log(`Now, go find some users at ${server.info.uri}`);
};

init();
