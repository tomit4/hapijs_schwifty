'use strict'

const Hapi = require('@hapi/hapi')
const Schwifty = require('@hapipal/schwifty')
const Joi = require('joi')
require('dotenv').config()

const schwiftyServer = async() => {

    const server = Hapi.server({port: process.env.HAPI_PORT})

    server.route({
        method: 'get',
        path: '/dogs/{id}',
        handler: async(request) => {

            const { Dog } = request.models()

            return await Dog.query().findById(request.params.id)
        }
    })

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
                    database: process.env.DB_NAME 
                }
                
            }
        },
        production: {
            migrateOnStart: false
        }
    })

    // Register a model with schwifty...

    server.registerModel(
        class Dog extends Schwifty.Model {
            static tableName = 'Dog'
            static joiSchema = Joi.object({
                id: Joi.number(),
                name: Joi.string()
            })
        }
    )

    await server.initialize()

    // ... then make a table ...

    const knex = server.knex()

    await knex.schema.createTable('Dog', (table) => {

        table.increments('id').primary()
        table.string('name')
    })

    const { Dog } = server.models()

    await Promise.all([
        Dog.query().insert({ name: 'Guinness' }),
        Dog.query().insert({ name: 'Sally' }),
        Dog.query().insert({ name: 'Ren' })
    ])

    // ... then start the server!

    await server.start()

    console.log(`Now, go find some dogs at ${server.info.uri}`)
}

schwiftyServer()