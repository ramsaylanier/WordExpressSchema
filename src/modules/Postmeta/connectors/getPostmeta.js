const getPostmeta = Postmeta => (postId, keys) => {
  return Postmeta.query()
    .where('post_id', postId)
    .modify(queryBuilder => {
      keys && keys.length > 0 && queryBuilder.whereIn('meta_key', keys)
    })
}

export default getPostmeta
