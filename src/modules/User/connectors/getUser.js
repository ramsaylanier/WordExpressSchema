const getUser = User => ({ id, name }) =>
  User.query().modify(queryBuilder => {
    id && queryBuilder.where('ID', id)
    name && queryBuilder.where('user_nicename', name).first()
  })

export default getUser
