const User = `
  type User {
    id: Int
    user_nicename: String
    user_email: String
    user_registered: String
    display_name: String,
    posts(post_type: String): [Post]
  }
`

export default User
