import PHPUnserialize from 'php-unserialize'
import {map} from 'lodash'

export default function (thumbnail, settings) {
  const {amazonS3, uploads} = settings.publicSettings
  const {wp_prefix} = settings.privateSettings
  const file = thumbnail[`${wp_prefix}postmeta`][0].dataValues.meta_value
  const fileMeta = thumbnail[`${wp_prefix}postmeta`][1].dataValues.meta_value
  
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
      id: thumbnail.id,
      src: thumbnailSrc,
      sizes: sizes
    }
  }

  return null
}