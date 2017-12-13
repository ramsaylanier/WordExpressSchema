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