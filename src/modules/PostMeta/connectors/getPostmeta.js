import Sequelize from 'sequelize'

const Op = Sequelize.Op

export default function (Postmeta) {
  return function(postId, {keys}) {
    const condition = {
      post_id: postId
    }


    if (keys && keys.length > 0){
      condition.meta_key = {
        [Op.in]: keys
      }
    }

    return Postmeta.findAll({
      where: condition
    })
  }
}