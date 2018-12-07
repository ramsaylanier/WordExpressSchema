import Post from './post'

const MenuItem = `
  type MenuItem {
    id: ID!
    linkedId: Int
    order: Int
    navitem: Post
    children: [MenuItem]
  }
`

export default () => [MenuItem, Post]
