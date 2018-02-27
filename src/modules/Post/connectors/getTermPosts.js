import {map} from 'lodash'

export default function (TermRelationships, Post, settings){
  const {wp_prefix} = settings.privateSettings

  return function(termId, { post_type, order, limit = 10, skip = 0 }) {
    const orderBy = order ? [Post, order.orderBy, order.direction] : [Post, 'post_date', 'DESC']
    return TermRelationships.findAll({
      attributes: [],
      include: [{
        model: Post,
        where: {
          post_type: post_type,
          post_status: 'publish'
        }
      }],
      where: {
        term_taxonomy_id: termId
      },
      order: [orderBy],
      limit: limit,
      offset: skip
    }).then(posts => {
      const p = map(posts, post => post[`${wp_prefix}post`])
      return p
    })
  }
}