const getPost = Post => (postId, name) =>
  Post.query()
    .modify(queryBuilder => {
      postId && queryBuilder.where('ID', postId)
      name && queryBuilder.where('post_name', name)
    })
    .first()

export default getPost
