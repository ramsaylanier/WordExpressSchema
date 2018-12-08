export default Postmeta => postId =>
  Postmeta.query()
    .where('post_id', postId)
    .andWhere('meta_key', 'page_layout_component')
    .first()
