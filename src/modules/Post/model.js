import { Model } from 'objection'

export default function(prefix) {
  class Post extends Model {
    static tableName = `${prefix}posts`
  }

  // return Conn.define(prefix + 'posts', {
  //   id: { type: Sequelize.INTEGER, primaryKey: true},
  //   post_author: { type: Sequelize.INTEGER },
  //   post_title: { type: Sequelize.STRING },
  //   post_content: { type: Sequelize.STRING },
  //   post_excerpt: { type: Sequelize.STRING },
  //   post_status: { type: Sequelize.STRING },
  //   post_type: { type: Sequelize.STRING },
  //   post_name: { type: Sequelize.STRING},
  //   post_date: { type: Sequelize.STRING},
  //   post_parent: { type: Sequelize.INTEGER},
  //   menu_order: { type: Sequelize.INTEGER}
  // })
  return Post
}
