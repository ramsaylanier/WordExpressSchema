import PHPUnserialize from 'php-unserialize'
import Sequelize from 'sequelize'
import {map} from 'lodash'

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
        const {amazonS3, uploads} = settings.publicSettings
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
          const file = post.wp_postmeta[0].dataValues.meta_value
          const fileMeta = post.wp_postmeta[1].dataValues.meta_value
          
          if (file) {

            const thumbnailSrc = amazonS3 ?
              uploads + PHPUnserialize.unserialize(file).key :
              uploads + file

            const thumbMeta = PHPUnserialize.unserialize(fileMeta)
            const sizes = map(thumbMeta.sizes, (size, key) => {
              return {
                size: key,
                file: size.file
              }
            })

            return {
              src: thumbnailSrc,
              sizes: sizes
            }
          }
          return null
        })
      }
      return null
    })
  }
}