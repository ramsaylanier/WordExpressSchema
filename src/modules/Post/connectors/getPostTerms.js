export default function (Terms, TermRelationships) {
  return function(postId) {
    return TermRelationships.findAll({
      where: {
        object_id: postId,
      },
      include: [{
        model: Terms
      }]
    }).then(relationships => {
      return relationships.map(r => {
        return r.dataValues.wp_term
      })
    })
  }
}