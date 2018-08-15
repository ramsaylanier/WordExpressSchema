export default function (TermRelationships, Post, TermTaxonomy, settings){
  const {wp_prefix} = settings.privateSettings

  return function(termId, { post_type, order, limit = 10, skip = 0 }) {
    const orderBy = order ? [Post, order.orderBy, order.direction] : [Post, 'post_date', 'DESC']

    let termIds = [termId]

    function getTermIds(parentTermIds) {
      if (!parentTermIds.length) return termIds

      return TermTaxonomy.findAll({
        attributes: ['term_taxonomy_id'],
        include: [],
        where: {
          parent: parentTermIds
        },
        limit: limit,
        offset: skip
      })
      .then(function (posts) {
        const p = posts.map(post => post.term_taxonomy_id)
        termIds.push(...p)
        return p
      })
      .then(getTermIds)
    }

    return getTermIds([termId])
      .then((termIds) => {
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
            term_taxonomy_id: termIds
          },
          order: [orderBy],
          limit: limit,
          offset: skip
        })
      })
      .then(posts => {
        const p = posts.map(post => post[`${wp_prefix}post`])
        return p
      })
  }
}