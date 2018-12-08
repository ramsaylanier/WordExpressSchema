export default (Post, Terms, TermRelationships, settings) => async postId => {
  const { wp_prefix } = settings.privateSettings
  const post = await Post.query()
    .where('ID', postId)
    .first()
  const categories = await post.$relatedQuery('terms')
  console.log(categories)
  return categories
}

//   return function(postId) {
//     return TermRelationships.findAll({
//       where: {
//         object_id: postId
//       },
//       include: [
//         {
//           model: Terms
//         }
//       ]
//     }).then(relationships => {
//       return relationships.map(r => {
//         return r.dataValues[`${wp_prefix}term`]
//       })
//     })
//   }
// }
