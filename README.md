# wordexpress-schema
This package is intended to be used with [Apollo Server](http://docs.apollostack.com/apollo-server/tools.html) to provide an easy way to setup a GraphQL server and connect it to your WordPress database. Note that Apollo Server is not a depenedecy of this package. An example of using this package with Apollo Server and Webpack is provided below.

For a full example, check out the repo for [WordExpress.io](https://github.com/ramsaylanier/WordpressExpress), which was built using this package.

##Installation

First, you must install and activate [WordExpress Companion WordPress Plugin](https://github.com/ramsaylanier/WordExpress-Plugin) in your WordPress build. This will populate some custom fields used for Page Layouts. If you don't want to use React Components for Page Layouts you can skip installing the plugin for now, but some more functionality will be added shortly so it's probably best to install it.

Then, in your node application:

```
npm install --save-dev wordexpress-schema
```

##Usage

WordExpress Schema exports three things: **WordExpressDatabase**, **WordExpressResolvers**, and **WordExpressDefinitions**.


*WordExpressDatabase* provides a connection to your database and returns some models and queries using Sequelize. These queries replace MYSQL queries, and return promises. These queries function as connectors and are used in the WordExpressResolvers resolving functions.

*WordExpressResolvers* are a set of resolving functions used to resolve GraphQL queries.

*WordExpressDefinitions* is a GraphQL Schema based on the queries provided to it from WordExpressDatabase. With the schema, you can do things like Find Posts by post_type, get the Postmeta of a Post by the post_id, and so on.

Below is detailed documentation on using both.

* [Using WordExpress Database](#wordexpressdatabase)

  * [Connection Settings](#connection-settings)
  
  * [The Database Class](#the-database-class)
  
    * [The Models](#the-models)
    
    * [The Queries](#the-queries)
    
    * [Extending Queries](#extending-queries)
    

* [Using WordExpress Resolvers](#wordexpressresolvers)  

* [Using WordExpress Definitions](#wordexpressdefinitions)

   * [Example: Building A Landing Page component](#building-a-landing-page-component)

* [Using Definitions and Resolvers with Apollo Server](#using-definitions-and-resolvers-with-apollo-server)


##WordExpressDatabase
The first part of WordExpress Schema is **WordExpressDatabase**. This class provides an easy connection to your WordPress database using some connection settings, explained below.

Below is the basic implementation:
```es6
import * as settings from '../settings/settings';
import { WordExpressDefinitions, WordExpressDatabase, WordExpressResolvers } from 'wordexpress-schema';

/*
  Example settings object:
  publicSettings: {
    uploads: "http://wordexpress.s3.amazonaws.com/",
    amazonS3: true
  },
  privateSettings: {
    wp_prefix: "wp_",
    database: {
      name: "wpexpress_dev",
      username: "root",
      password: "",
      host: "127.0.0.1"
    }
  }
*/

//returns WordExpressDatabase object that has provides connectors to the database;
const Database = new WordExpressDatabase(settings);
const Connectors = Database.connectors;
```

###Connection Settings

In the above example, **WordExpressDatabase** is passed a settings object that contains some WordPress database settings. Name, username, password, and host are all self-explanatory. 

WordExpress will work with Amazon S3; passing in a truthy value for amazonS3 will alter the query for getting Post Thumbnail images. If you are using S3, you just need the include the base path to your S3 bucket (which means you should exclude the wp-content/uploads/ part of the path). If you are hosting images on your own server, include the full path to the uploads folder.

Lastly, you can modify the wordpress database prefix. Some people don't use the default "wp_" prefix for various reasons. If that's you, I got your back. 


###The Database Class

The Database class above contains the connectionDetails, the actual Sequelize connection, the database queries, and the database models. Really, all you need for GraphQL setup are the queries; however, if you'd like to extend queries with your own, the Database Models are exposed. 

####The Models
Here are the models and their definitions.  As you can see, for the Post model, not every column in the wp_posts table is included. I've included the most relevant columns; however because the Database class exposes the models, you can extend them to your liking.

```es6
Post: Conn.define(prefix + 'posts', {
  id: { type: Sequelize.INTEGER, primaryKey: true},
  post_author: { type: Sequelize.INTEGER },
  post_title: { type: Sequelize.STRING },
  post_content: { type: Sequelize.STRING },
  post_excerpt: { type: Sequelize.STRING },
  post_status:{ type: Sequelize.STRING },
  post_type:{ type: Sequelize.STRING },
  post_name:{ type: Sequelize.STRING},
  post_parent: { type: Sequelize.INTEGER},
  menu_order: { type: Sequelize.INTEGER}
}),
Postmeta: Conn.define(prefix + 'postmeta', {
  meta_id: { type: Sequelize.INTEGER, primaryKey: true, field: 'meta_id' },
  post_id: { type: Sequelize.INTEGER },
  meta_key: { type: Sequelize.STRING },
  meta_value: { type: Sequelize.INTEGER },
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

####The Queries

In the above example, ConnQueries will give you the following:

**getPosts(args)**

args is an object; however, the only acceptable key in args is ```post_type```. This finds all published posts by post type. Returns a promised array.

**getPostById(postId)**

Accepts a post id and returns the corresponding post.

**getPostByName(name)**

Accepts a post name (AKA slug) and returns it. The post must be published.

**getPostThumbnail(postId)**

Accepts a post id and returns the thumbnail image. In the **connectionDetails** object above you'll notice that there is a setting for AmazonS3. Set to true if you want to use WordPress with AmazonS3.

**getPostmeta(postId, keys)**

Returns a posts' Postmeta. Keys is an array of valid meta_key values. See the below example for usage.

**getPostLayout(postId)**

As mentioned about, the WordPress Companion Plugin adds the ability to set React Components as Page Layouts directly from the WordPress admin backend. This query finds the Postmeta associated with the postId where the meta_key is "wordexpress_page_fields_page_layout_component". This field is added for you for each Page when activating the companion plugin.

**getPostMetaById(metaId)**

Returns a single Postmeta by id. Probably not very useful right now. Instead, you'll want to use getPostmeta();

**getMenu(name)**

Returns a menu and all of its menu items where the name argument is the slug of your menu.

####Extending Queries

Extending the above example, it's possible to add your own queries (or even your own models). Here's an example:

```ex6
...
//returns WordExpressDatabase object that has provides connectors to the database;
const Database = new WordExpressDatabase(settings);
const Connectors = Database.connectors;
const Models = Database.models;

const CustomPostsQuery = () => {
  return Models.Post.findAll({
    where: {
      post_type: 'my_custom_post_type',
      post_status: 'publish',
    }
  })
}

Connectors.getCustomPosts = CustomPostsQuery;
...
```

##WordExpressResolvers
Resolvers are functions that tell the server how to find and return the data for each field in a GraphQL query. The resolving functions simply call your Database Connectors by passing in parameters and return the Connectors result (usually a Promise).

After creating your Database and Connectors from WordExpressDatabase, you can call the WordExpressResolvers function by passing in the Connectors and your public application settings (since settings are stored in the application state). Building on the previous examples:

```es6
import * as settings from '../settings/settings';
import { WordExpressDefinitions, WordExpressDatabase, WordExpressResolvers } from 'wordexpress-schema';

//returns WordExpressDatabase object that has provides connectors to the database;
const Database = new WordExpressDatabase(settings);
const Connectors = Database.connectors;

//Reolving functions that use the database connections to resolve GraphQL queries
const Resolvers = WordExpressResolvers(Connectors, settings.publicSettings);
```

Just like your Database models and connectors, you can add aditional Resolvers. In fact, if you do extend the WordExpress schema with your own queries, you'll have to. Refer to the [ApolloStack documentation on adding resolvers](http://docs.apollostack.com/apollo-server/resolvers.html#addResolveFunctionsToSchema).

##WordExpressDefinitions
Instead of defining your own GraphQL schema, you can use *WordExpressDefenitions*. To extend upon the earlier example, this is how it's implemented:

```es6
import * as settings from '../settings/settings';
import { WordExpressDefinitions, WordExpressDatabase, WordExpressResolvers } from 'wordexpress-schema';

//returns WordExpressDatabase object that has provides connectors to the database;
const Database = new WordExpressDatabase(settings);
const Connectors = Database.connectors;

//Reolving functions that use the database connections to resolve GraphQL queries
const Resolvers = WordExpressResolvers(Connectors, settings.publicSettings);

//GraphQL schema definitions
const Definitions = WordExpressDefinitions;

export { Connectors, Resolvers, Definitions }; 
```

The Schema is really just an array of GraphQL schema language string written in GraphQL type language. You can extend the schema by simply pushing new GraphQL strings into the array. 

###Building a Landing Page Component
In this example, I'm using Apollo to query a fragment on User to find a page with the post_name(AKA slug) of "homepage". I'm getting the post_title, the post_content, and the thumbnail.

```es6
import React from 'react';
import Page from '../pages/page.js';
import PostContent from '../posts/PostContent';
import { connect } from 'react-apollo';

class FrontPageLayout extends React.Component{

  render(){
    const { loading } = this.props.page;

    if (loading){
      return (
        <div>Loading...</div>
      )
    } else {
      const { post_title, post_content, thumbnail} = this.props.page.viewer.page;
      let bg = {
	backgroundImage: "url('" + thumbnail + "')"
      }

      let heroClass = thumbnail ? "hero_thumbnail" : "hero"

       return (
         <div>
  	   <div styleName={heroClass} style={bg}>
  	     <div styleName="wrapper tight">
  	       <h1 styleName="title">WordExpress</h1>
  	       <h4 styleName="subtitle">WordPress using Node, Express, and React.</h4>
  	     </div>
  	   </div>

  	   <div styleName="content">
  	     <div styleName="wrapper tight">
  	       <PostContent post_content={post_content}/>
  	     </div>
  	   </div>
         </div>
       )
     }
   }
}


const FrontPageWithData = connect({
  mapQueriesToProps({ ownProps, state}) {
    return {
      page: {
        query: `
          query getPage{
            viewer{
              page(post_name: "homepage"){
                id,
      	        post_title
      	        post_content
      		thumbnail
              }
            }
          }
        `
      }
    }
  }
})(FrontPageLayout);

export default FrontPageWithData;
```

This example comes directly from [WordExpress.io](http://wordexpress.io), an open-source project used to document the usage of this package. I urge you to clone the [WordExpress repo and play around with it yourself](https://github.com/ramsaylanier/WordPressExpress). 

##Using Definitions and Resolvers with Apollo Server
This example is from the [WordExpress repo](https://github.com/ramsaylanier/WordPressExpress/blob/master/dev.js), using Webpack. First, we import the Definitions and Resolvers from our [schema.js file](https://github.com/ramsaylanier/WordPressExpress/blob/master/schema/schema.js). This file should look a lot like the end result of the example in the WordExpressDefinitions section, which exports the Connectors, Resolvers, and Definitions.

After importing the Resolvers and Definitions, we pass them as arguments to ApolloServer. ApolloServer is Express middleware that provides a very easy way to set up a GraphQL server.

```es6
...
import { apolloServer } from 'apollo-server';
import { Definitions, Resolvers } from './schema/schema';
import { privateSettings } from './settings/settings';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

const graphQLServer = express();
let app = express();

graphQLServer.use('/', apolloServer({
  graphiql: true,
  pretty: true,
  schema: Definitions,
  resolvers: Resolvers
}));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

...
```


