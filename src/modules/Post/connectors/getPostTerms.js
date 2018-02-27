export default function (Terms, TermRelationships, settings) {
  const {wp_prefix} = settings.privateSettings

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
        return r.dataValues[`${wp_prefix}term`]
      })
    })
  }
}