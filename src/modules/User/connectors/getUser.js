export default function (User) {
  return function({userId, name}) {

    let where = {}

    if (userId){
      where.ID = userId
    }

    if (name){
      where.user_nicename = name
    }

    return User.findOne({
      where: where
    })
  }
}