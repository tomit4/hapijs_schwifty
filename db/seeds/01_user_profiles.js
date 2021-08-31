const {
  nanoid
} = require('nanoid')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([{
          id: nanoid(),
          username: 'Gatsby',
          password: 'somekindapassword'
        },
        {
          id: nanoid(),
          username: 'Claire',
          password: 'someotherpassword'
        },
        {
          id: nanoid(),
          username: 'Beth',
          password: 'terriblepassword'
        }
      ]);
    });
};