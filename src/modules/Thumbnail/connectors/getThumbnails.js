import Sequelize from 'sequelize'
import shapeThumbnail from '../shapeThumbnail'

const Op = Sequelize.Op

export default function (Postmeta, Post, settings) {
  return function(ids) {
    const where = {
      post_type: 'attachment',
      id: {
        [Op.in]: ids
      }
    }

    const {amazonS3} = settings.publicSettings
    const metaKeys = amazonS3 ? ['amazonS3_info'] : ['_wp_attached_file']
    metaKeys.push('_wp_attachment_metadata')

    return Post.findAll({
      where: where,
      include: {
        model: Postmeta
      }
    }).then(thumbnails => {
      if (thumbnails) {
        return thumbnails.map(thumbnail => {
          return shapeThumbnail(thumbnail, settings)
        })
      }
      return null
    })
  }
}