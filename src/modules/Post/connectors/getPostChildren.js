export default Post => ({ ID }) => Post.query().where('post_parent', ID)
