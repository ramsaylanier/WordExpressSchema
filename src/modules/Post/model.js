import { Model } from 'objection'

export default function(connection, prefix) {
  Model.knex(connection)

  class Person extends Model {
    static tableName = `${prefix}posts`
  }

  const string = 'string'

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
}
