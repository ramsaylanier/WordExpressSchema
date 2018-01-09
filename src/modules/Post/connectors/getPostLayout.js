export default function (Postmeta) {
  return function (postId) {
    return Postmeta.findOne({
      where: {
        post_id: postId,
        meta_key: 'page_layout_component'
      }
    })
  }
}