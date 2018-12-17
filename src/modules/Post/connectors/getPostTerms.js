export default Post => async postId => {
  const post = await Post.query()
    .where('ID', postId)
    .first()
  const categories = await post.$relatedQuery('terms')
  return categories
}
