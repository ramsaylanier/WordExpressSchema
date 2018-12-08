import { Model } from 'objection'

const PostMeta = prefix => {
  return class PostMeta extends Model {
    static tableName = `${prefix}postmeta`
  }
}

export default PostMeta
// export default function(Conn, prefix) {
//   return Conn.define(prefix + 'postmeta', {
//     meta_id: { type: Sequelize.INTEGER, primaryKey: true, field: 'meta_id' },
//     post_id: { type: Sequelize.INTEGER },
//     meta_key: { type: Sequelize.STRING },
//     meta_value: { type: Sequelize.INTEGER }
//   })
// }
