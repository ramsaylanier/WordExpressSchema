import Category from './category'
import Post from './post.js'
import Menu from './menu.js'
import MetaType from './metaType'
import Setting from './setting'
import OrderInput from './inputs/orderInput'

const RootQuery = `
  type Query {
    settings: Setting
    posts(post_type: [String], limit: Int, skip: Int, order: OrderInput, userId: Int): [Post]
    post(name: String, id: Int): Post
    attachments(ids: [Int]): [Thumbnail]
    postmeta(post_id: Int!, keys: [MetaType]): [Postmeta]
    menus(name: String!): Menu
    category(term_id: Int, name: String): Category
    user(name: String, id: Int): User
  }
`

const SchemaDefinition = `
  schema {
    query: Query
  }
`

export default [
  Category,
  Menu,
  MetaType,
  Post,
  Setting,
  OrderInput,
  RootQuery,
  SchemaDefinition
]
