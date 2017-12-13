import Category from './category'
import Post from './post.js'
import Menu from './menu.js'
import MetaType from './metaType'
import Setting from './setting'
import OrderInput from './inputs/orderInput'

const RootQuery = `
  type Query {
    settings: Setting
    posts(post_type: String = "post", limit: Int, skip: Int, order: OrderInput): [Post]
    menus(name: String): Menu
    post(name: String, id: Int): Post
    category(term_id: Int): Category
    postmeta(post_id: Int, after: String, first: Int, before: String, last: Int): Postmeta
    user(id: Int): User
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