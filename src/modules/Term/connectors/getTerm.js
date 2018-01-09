import Sequelize from 'sequelize'
const Op = Sequelize.Op

export default function (Terms) {
  return function (termId, name) {
    return Terms.findOne({
      where: {
        [Op.or]: [{term_id: termId}, {name: name}]
      }
    })
  }
}
