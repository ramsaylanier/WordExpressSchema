import Sequelize from 'sequelize'
import shapeThumbnail from '../shapeThumbnail'

const Op = Sequelize.Op

export default function (Postmeta, Post, settings) {
  return function(postId) {
    return Postmeta.findOne({
      where: {
        post_id: postId,
        meta_key: '_thumbnail_id'
      }
    }).then(res => {
      if (res) {
        const {amazonS3} = settings.publicSettings
        const metaKeys = amazonS3 ? ['amazonS3_info'] : ['_wp_attached_file']
        metaKeys.push('_wp_attachment_metadata')

        return Post.findOne({
          where: {
            id: Number(res.dataValues.meta_value)
          },
          include: {
            model: Postmeta,
            where: {
              meta_key: {
                [Op.in]: metaKeys
              }
            },
            limit: 2
          }
        }).then( post => {
          return shapeThumbnail(post, settings)
        })
      }
      return null
    })
  }
}