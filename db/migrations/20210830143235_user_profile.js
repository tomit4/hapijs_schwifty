exports.up = function (knex, Promise) {
  return knex.schema.createTable("users", (table) => {
    // using nanoid for now, I'll need to figure out how to use knex's uuid as it requires providing an initial value
    // unlike raw SQL INSERT statements that will auto increment a uuid without any input into it's id field...
    table.uuid("id");
    table.string("username").notNullable();
    table.string("password").notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("users");
};
