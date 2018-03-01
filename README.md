[![npm version](https://badge.fury.io/js/wordexpress-schema.svg)](https://badge.fury.io/js/wordexpress-schema)

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

* [Using Definitions and Resolvers with Apollo Server](#using-definitions-and-resolvers-with-apollo-server)

* [Types](#types)

  * [Post](#post)
  
  * [Postmeta](#postmeta)
  
  * [MetaType](#metatype)
  
  * [Category](#category)
  
  * [Menu](#menu)
  
  * [MenuItem](#menuitem)
  
  * [Setting](#setting)

* [Inputs](#inputs)

* [Queries](#queries)



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

## Creating The Schema
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

## Types

### Post
```es6
import Postmeta from './Postmeta'
import User from './User'

const Post = `
  type Post {
    id: Int
    post_title: String
    post_content: String
    post_excerpt: String
    post_status: String
    post_type: String
    post_name: String
    post_parent: Int
    post_date: String
    menu_order: Int
    post_author: Int
    layout: Postmeta
    thumbnail: String
    post_meta(keys: [MetaType], after: String, first: Int, before: String, last: Int): [Postmeta]
    author: User
  }
`

export default () => [Post, Postmeta, User]
```

### Postmeta
``` es6
import Post from './post'

const Postmeta = `
  type Postmeta {
    id: Int
    meta_id: Int
    post_id: Int
    meta_key: String
    meta_value: String
    connecting_post: Post
  }
`

export default () => [Postmeta, Post]
```

### MetaType
```es6
const MetaType = `
  enum MetaType {
    _thumbnail_id
    _wp_attached_file
    react_layout
    amazonS3_info
    order
  }
`

export default MetaType
```

### Category
``` es6
import Post from './post'

const Category = `
  type Category {
    term_id: Int!
    name: String
    slug: String
    posts(post_type: String = "post", limit: Int, skip: Int): [Post]
  }
`

export default () => [Category, Post]
```

### Menu
```es6
import MenuItem from './menuItem'

const Menu = `
  type Menu {
    id: ID!
    name: String
    items: [MenuItem]
  }
`

export default () => [Menu, MenuItem]
```

### MenuItem
```es6
import Post from './post'

const MenuItem = `
  type MenuItem {
    id: ID!
    post_title: String
    linkedId: Int
    object_type: String
    order: Int
    navitem: Post
    children: [MenuItem]
  }
`

export default () => [MenuItem, Post]
```

### Setting
```es6
const Setting = `
  type Setting {
    uploads: String
    amazonS3: Boolean
  }
`

export default Setting
```

## Inputs

### OrderInput
```es6
const OrderInput = `
  input OrderInput {
    orderBy: String,
    direction: String
  }
`

export default OrderInput
```


## Queries
WordExpress provides some out-of-the-box queries to do some basic stuff like getting posts, getting posts by category, getting a post by post_type, etc.

### Posts
```
posts(post_type: String = "post", limit: Int, skip: Int, order: OrderInput): [Post]
```

You can query posts by `post_type`. If you don't provide a post_type, it will default to 'post'. You can also limit the results and skip results (allowing for pagination). Also, you can provide a custom sorting object to sort the results. Here's an example of sorting:

<img width="1035" alt="screen shot 2017-12-13 at 12 31 14 pm" src="https://user-images.githubusercontent.com/2359852/33953187-258e7394-e002-11e7-9792-a4680d087cd7.png">

#### Layouts for Pages and Posts
Posts and pages can be assigned a Component to use as a layout. You can use the [WordExpress Companion Plugin](https://github.com/ramsaylanier/WordExpress-Plugin) for WordPress which will allow you to add the custom field to any page or post. Or you can add your own custom field. It needs to be called `page_layout_component`. Here's an example of the querying with a layout:

<img width="1064" alt="screen shot 2017-12-13 at 12 41 43 pm" src="https://user-images.githubusercontent.com/2359852/33953467-11e93990-e003-11e7-9994-fb967a2acb4a.png">

### Post
```
post(name: String, id: Int): Post
```

Returns a Post by either its ID or its name.

<img width="1431" alt="screen shot 2017-12-13 at 12 57 05 pm" src="https://user-images.githubusercontent.com/2359852/33954058-306b90f0-e005-11e7-83fe-383c6ed490f6.png">

### Menu
```
menus(name: String!): Menu
```

Returns a menu and the menu items associated with it, as well as children items. Uses the slug of the menu that is registered with WordPress.

<img width="1065" alt="screen shot 2017-12-13 at 12 52 01 pm" src="https://user-images.githubusercontent.com/2359852/33953852-8479de64-e004-11e7-84b3-c51d84eb98fd.png">


### Category
```
category(term_id: Int!): Category
```

Gets a category by its ID. Also capable of returning all posts with the category id. Here's an example:


<img width="1373" alt="screen shot 2017-12-13 at 12 59 57 pm" src="https://user-images.githubusercontent.com/2359852/33954203-8f2031e6-e005-11e7-932b-fdc1d4321e53.png">

### Postmeta
```
postmeta(post_id: Int!, keys:[MetaType]): [PostMeta]
```
Gets the postmeta of a post by the post id. 

<img width="1088" alt="screen shot 2017-12-13 at 1 28 34 pm" src="https://user-images.githubusercontent.com/2359852/33955582-02546f98-e00a-11e7-8fcb-c106b9372b65.png">

If `keys` are passed it, it will only return those keys which are part of the `MetaType`. Example:

<img width="995" alt="screen shot 2017-12-13 at 1 32 49 pm" src="https://user-images.githubusercontent.com/2359852/33955614-2603bf98-e00a-11e7-9ce3-100b60190dd6.png">




