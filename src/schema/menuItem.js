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