import Sequelize from 'sequelize'

export default function(Conn, prefix) {
  return Conn.define(prefix + 'users', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    user_nicename: { type: Sequelize.STRING },
    user_email: { type: Sequelize.STRING },
    user_registered: { type: Sequelize.STRING },
    display_name: { type: Sequelize.STRING }
  })
}
