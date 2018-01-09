export default function (User) {
  return function(userId) {
    return User.findOne({
      where: {
        ID: userId
      }
    })
  }
}