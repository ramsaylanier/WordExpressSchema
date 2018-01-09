import Sequelize from 'sequelize'
const Op = Sequelize.Op

export default function (Post){
  return function (postId, name){
    return Post.findOne({
      where: {
        post_status: 'publish',
        [Op.or]: [{id: postId}, {post_name: name}]
      }
    }).then(post => {
      if (post) {
        const { id, post_type } = post.dataValues
        post.dataValues.children = []
        return Post.findAll({
          attributes: ['id'],
          where: {
            [Op.and]: [
              {post_parent: id},
              {post_type: post_type}
            ]
          }
        }).then(childPosts => {
          if (childPosts.length > 0) {
            childPosts.map(childPost => {
              post.dataValues.children.push({ id: Number(childPost.dataValues.id) })
            })
          }
          
          return post
        })
      }
      return null
    })
  }
}