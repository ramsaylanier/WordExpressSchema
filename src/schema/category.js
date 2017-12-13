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