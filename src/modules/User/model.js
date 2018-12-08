import { Model } from 'objection'

const User = prefix =>
  class User extends Model {
    static tableName = `${prefix}users`
  }

export default User
