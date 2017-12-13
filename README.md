# wordexpress-schema

WordExpress Schema provides the following:

- **WordExpress Database**: provides a connection to your WordPress database and returns some models and queries using Sequelize. These queries replace MYSQL queries, and return promises. These queries function as connectors and are used in the WordExpressResolvers resolving functions.

- **WordExpress Resolvers**: resolving functions that work with the WordExpress Database connectors to resolver GraphQL Queries

- **WordExpress Definitions**: a module GraphQL Schema based on the queries provided to it from WordExpressDatabase. With the schema, you can do things like Find Posts by post_type, get the Postmeta of a Post by the post_id, and so on.

This package is intended to be used with [Apollo Server](https://www.apollographql.com/docs/apollo-server/) to provide an easy way to setup a GraphQL server and connect it to your WordPress database. Note that Apollo Server is not a depenedecy of this package. An example of using this package with Apollo Server and Webpack is provided below.

## Installation

```
npm install --save-dev wordexpress-schema
```

## Usage

* [Using WordExpress Database](#wordexpressdatabase)

  * [Connection Settings](#connection-settings)

  * [The Database Class](#the-database-class)

    * [The Models](#the-models)


* [Making an Executable Schema](#creating-the-schema)  

* [Using WordExpress Definitions](#wordexpressdefinitions)

   * [Example: Building A Landing Page component](#building-a-landing-page-component)

* [Using Definitions and Resolvers with Apollo Server](#using-definitions-and-resolvers-with-apollo-server)


## WordExpressDatabase
The first part of WordExpress Schema is **WordExpressDatabase**. This class provides an easy connection to your WordPress database using some connection settings. Typically, you'll want to put the database in its own file in case you want to extend the Models.

Below is the basic implementation:
```es6

//db.js
import Config from 'config'
import {WordExpressDatabase} from 'wordexpress-schema'

/*
  Example settings object:
  public: {
    uploads: "http://wordexpress.s3.amazonaws.com/",
    amazonS3: true
  },
  private: {
    wp_prefix: "wp_",
    database: {
      name: "wpexpress_dev",
      username: "root",
      password: "",
      host: "127.0.0.1"
    }
  }
*/


const publicSettings = Config.get('public')
const privateSettings = Config.get('private')

const Database = new WordExpressDatabase({publicSettings, privateSettings})
const {connectors, models} = Database

export default Database
export {connectors, models}
```

### Connection Settings

In the above example, **WordExpressDatabase** is passed a settings object that contains some WordPress database settings. Name, username, password, and host are all self-explanatory.

WordExpress will work with Amazon S3; passing in a truthy value for amazonS3 will alter the query for getting Post Thumbnail images. If you are using S3, you just need the include the base path to your S3 bucket (which means you should exclude the wp-content/uploads/ part of the path). If you are hosting images on your own server, include the full path to the uploads folder.

Lastly, you can modify the wordpress database prefix. Some people don't use the default "wp_" prefix for various reasons. If that's you, I got your back.

### The Database Class

The Database class above contains the connectionDetails, the actual Sequelize connection, the database queries, and the database models. Really, all you need for GraphQL setup are the queries; however, if you'd like to extend queries with your own, the Database Models are exposed.

#### The Models
Here are the models and their definitions.  As you can see, for the Post model, not every column in the wp_posts table is included. I've included the most relevant columns; however because the Database class exposes the models, you can extend them to your liking.

```es6
Post: Conn.define(prefix + 'posts', {
  id: { type: Sequelize.INTEGER, primaryKey: true},
  post_author: { type: Sequelize.INTEGER },
  post_title: { type: Sequelize.STRING },
  post_content: { type: Sequelize.STRING },
  post_excerpt: { type: Sequelize.STRING },
  post_status: { type: Sequelize.STRING },
  post_type: { type: Sequelize.STRING },
  post_name: { type: Sequelize.STRING},
  post_date: { type: Sequelize.STRING},
  post_parent: { type: Sequelize.INTEGER},
  menu_order: { type: Sequelize.INTEGER}
}),
Postmeta: Conn.define(prefix + 'postmeta', {
  meta_id: { type: Sequelize.INTEGER, primaryKey: true, field: 'meta_id' },
  post_id: { type: Sequelize.INTEGER },
  meta_key: { type: Sequelize.STRING },
  meta_value: { type: Sequelize.INTEGER },
}),
User: Conn.define(prefix + 'users', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  user_nicename: { type: Sequelize.STRING },
  user_email: { type: Sequelize.STRING },
  user_registered: { type: Sequelize.STRING },
  display_name: { type: Sequelize.STRING }
}),
Terms: Conn.define(prefix + 'terms', {
  term_id: { type: Sequelize.INTEGER, primaryKey: true },
  name: { type: Sequelize.STRING },
  slug: { type: Sequelize.STRING },
  term_group: { type: Sequelize.INTEGER },
}),
TermRelationships: Conn.define(prefix + 'term_relationships', {
  object_id: { type: Sequelize.INTEGER, primaryKey: true },
  term_taxonomy_id: { type: Sequelize.INTEGER },
  term_order: { type: Sequelize.INTEGER },
}),
TermTaxonomy: Conn.define(prefix + 'term_taxonomy', {
  term_taxonomy_id: { type: Sequelize.INTEGER, primaryKey: true },
  term_id: { type: Sequelize.INTEGER },
  taxonomy: { type: Sequelize.STRING },
  parent: { type: Sequelize.INTEGER },
  count: { type: Sequelize.INTEGER },
})
```

## Making The Schema
WordExpress uses [GraphQL Tools](https://github.com/apollographql/graphql-tools)'s [makeExecutableSchema](https://www.apollographql.com/docs/graphql-tools/generate-schema.html#makeExecutableSchema) to generate an executable schema. `makeExecutableSchema` requires type definitions and resolvers. WordExpress gives you both of those! Here's the basic implementation of the schema:

```es6
import {makeExecutableSchema} from 'graphql-tools'
import {WordExpressDefinitions, WordExpressResolvers} from 'wordexpress-schema'
import {connectors} from './db'
import Config from 'config'

const RootResolvers = WordExpressResolvers(connectors, Config.get('public'))

const schema = makeExecutableSchema({
  typeDefs: [WordExpressDefinitions]
  resolvers: RootResolvers
})

export default schema
```

`WordExpressResolvers` requires some database connectors that the `WordExpressDatabase` provides. These connectors provide the root sequelize queries. `WordExpressResolvers` is simply a (resolving map)[https://www.apollographql.com/docs/graphql-tools/resolvers.html#Resolver-map] that tell the GraphQl queries how to fetch the data from the WordPress database. 

`WordExpressDefinitions` is a modular GraphQL schema written in the [GraphQL Schema language](https://www.apollographql.com/docs/graphql-tools/generate-schema.html#schema-language). 


## Using Definitions and Resolvers with Apollo Server
This example is from the [WordExpress Server](https://github.com/ramsaylanier/WordExpress-Server). 
After creating an executable schema, all we need to do is provide the schema to [apollo-server-express](https://www.apollographql.com/docs/apollo-server/servers/express.html).

```es6
import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'
import graphqlSchema from './schema'

const PORT = 4000
const app = express()

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => {
    return({
      schema: graphqlSchema
    })
  })
)
 
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  })
)

app.listen(PORT, () => {
  console.log(`wordexpress server is now running on port ${PORT}`)
})
```
