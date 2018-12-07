import Sequelize from 'sequelize'
const Op = Sequelize.Op

export default function(Post) {
  return function({ post_type, order, limit = 10, skip = 0, userId }) {
    const orderBy = order
      ? [order.orderBy, order.direction]
      : ['menu_order', 'ASC']
    const where = {
      post_status: 'publish',
      post_type: {
        [Op.in]: ['post']
      }
    }

    if (post_type) {
      where.post_type = {
        [Op.in]: post_type
      }
    }

    if (userId) {
      where.post_author = userId
    }

    return Post.findAll({
      where: where,
      order: [orderBy],
      limit: limit,
      offset: skip
    }).then(r => {
      return r
    })
  }
}
