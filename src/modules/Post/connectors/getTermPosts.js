import { map } from 'lodash'
import { QueryBuilder } from 'objection'

const getTermPosts = (Terms, Post, settings) => async (
  categoryId,
  { post_type, limit = 10, skip = 0, order, userId }
) => {
  const { wp_prefix } = settings.privateSettings
  const orderBy = order
    ? [order.orderBy, order.direction]
    : ['post_date', 'DESC']

  const term = await Terms.query()
    .where('term_id', categoryId)
    .first()

  return term
    .$relatedQuery('posts')
    .modify(QueryBuilder => {
      post_type && QueryBuilder.where('post_type', post_type)
    })
    .limit(limit)
    .offset(skip)
    .orderBy(...orderBy)
}

export default getTermPosts
