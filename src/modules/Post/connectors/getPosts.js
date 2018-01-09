export default function (Post) {
  return function({ post_type, order, limit = 10, skip = 0 }) {
    const orderBy = order ? [order.orderBy, order.direction] : ['menu_order', 'ASC']
    return Post.findAll({
      where: {
        post_type,
        post_status: 'publish'
      },
      order: [orderBy],
      limit: limit,
      offset: skip
    }).then(r => {
      return r
    })
  }
}