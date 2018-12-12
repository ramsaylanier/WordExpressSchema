const getPost = Post => async (postId, name) => {
  const post = await Post.query()
    .modify(queryBuilder => {
      postId && queryBuilder.where('ID', postId)
      name && queryBuilder.where('post_name', name)
    })
    .first()

  return post
}

export default getPost
