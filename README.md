# wordexpress-schema
This package provides a connection to a WordPress MYSQL database using Sequelize and provides a standard set of queries to use with GraphQL.

For a full example, check out the repo for [WordExpress.io](https://github.com/ramsaylanier/WordpressExpress), which was built using this package.

##Installation
```
npm install --save-dev wordexpress-schema
```

##Usage

Below is the basic implementation:
```
import { WordExpressDatabase } from 'wordexpress-schema';
import { publicSettings, privateSettings } from '../settings/settings';

const connectionDetails = {
  name: privateSettings.database.name,
  username: privateSettings.database.username,
  password: privateSettings.database.password,
  host: privateSettings.database.host,
  amazonS3: publicSettings.amazonS3,
  uploadDirectory: publicSettings.uploads
}

const ConnQueries = new WordExpressDatabase(connectionDetails).getQueries();
export default ConnQueries;
```

##The Queries

In the above example, ConnQueries will give you the following:

###getViewer()

Necessary because GraphQL doesn't currently allow for nodes on the root query. It simply returns a User object with id:1 and name:Anonymous

###getPosts(args)

args is an object; however, the only acceptable key in args is ```post_type```. This finds all published posts by post type. Returns a promised array.

###getPostById(postId)

Accepts a post id and returns the corresponding post.

###getPostByName(name)

Accepts a post name (AKA slug) and returns it. The post must be published.

###getPostThumbnail(postId)

Accepts a post id and returns the thumbnail image. In the **connectionDetails** object above you'll notice that there is a setting for AmazonS3. Set to true if you want to use WordPress with AmazonS3.

###getPostmeta(postId, keys)

Returns a posts' Postmeta. Keys is an array of valid meta_key values. See the below example for usage.

###getPostMetaById(metaId)

Returns a single Postmeta by id. Probably not very useful right now. Instead, you'll want to use getPostmeta();

###getMenu(name)

Returns a menu and all of its menu items where the name argument is the slug of your menu.

##Example Usage With GraphQL

This example requires working knowledge of GraphQL. If you aren't familiar, [start by reading the GraphQL documentation](http://graphql.org/docs/getting-started/).

If you'd like a full example, check out the repo for [WordExpress.io](https://github.com/ramsaylanier/WordpressExpress), which is built using this package.

```
const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {type: new GraphQLNonNull(GraphQLID)} ,
    settings: {
      type: GraphQLSetting,
      resolve: ()=>{
        return publicSettings
      }
    },
    posts: {
      type: PostsConnection,
      args: {
        post_type: {
          type: GraphQLString,
          defaultValue: 'post'
        },
        ...connectionArgs
      },
      resolve(root, args) {
        return connectionFromPromisedArray( ConnQueries.getPosts(args), args );
      }
    },
    page: {
      type: GraphQLPost,
      args:{
        post_name:{ type: GraphQLString },
      },
      resolve(root, args){
        return ConnQueries.getPostByName(args.post_name);
      }
    },
    menus: {
      type: GraphQLMenu,
      args: {
        name: { type: GraphQLString }
      },
      resolve(root, args) {
        return ConnQueries.getMenu(args.name);
      }
    },
    postmeta: {
      type: PostmetaConnection,
      args: {
        post_id: {
          type: GraphQLInt
        },
        ...connectionArgs
      },
      resolve(root, args){
        return ConnQueries.getPostmeta(args.post_id)
      }
    }
  }
})

const GraphQLRoot = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => {
        return ConnQueries.getViewer();
      }
    }
  }
});

const WordExpressSchema = new GraphQLSchema({
  query: GraphQLRoot
});
export default WordExpressSchema;

```

