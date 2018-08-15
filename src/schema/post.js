import Postmeta from './postmeta'
import User from './user'
import Thumbnail from './thumbnail'

const Post = `
  type Post {
    id: Int
    post_title: String
    post_content: String
    post_excerpt(excerpt_length: Int): String
    post_status: String
    post_type: String
    post_name: String
    post_parent: Int
    post_date: String
    menu_order: Int
    layout: Postmeta
    thumbnail: Thumbnail
    categories: [Category]
    post_meta(keys: [MetaType], after: String, first: Int, before: String, last: Int): [Postmeta]
    author: User
  }
`

export default () => [Post, Postmeta, User, ...Thumbnail]