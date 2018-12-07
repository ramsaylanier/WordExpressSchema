import Post from './post'

const Postmeta = `
  type Postmeta {
    meta_id: Int
    post_id: Int
    meta_key: String
    meta_value: String
    connecting_post: Post
  }
`

export default () => [Postmeta, Post]
