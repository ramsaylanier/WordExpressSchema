import Sequelize from 'sequelize'
import { QueryDocumentKeys } from 'graphql/language/visitor'
const Op = Sequelize.Op

export default Post => {
  return function({ post_type, order, limit = 10, skip = 0, userId }) {
    const postTypes = post_type || ['post']
    const postAuthor = userId || null
    const orderBy = order ? order.orderBy : 'menu_order'

    return Post.query()
      .where('post_status', 'publish')
      .whereIn('post_type', postTypes)
      .modify(queryBuilder => {
        postAuthor && queryBuilder.where('post_author', postAuthor)
      })
      .orderBy(orderBy)
      .limit(limit)
      .offset(skip)
  }
}
