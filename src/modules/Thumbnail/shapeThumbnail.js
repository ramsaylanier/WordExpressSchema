import PHPUnserialize from 'php-unserialize'
import {map} from 'lodash'

export default function (thumbnail, settings) {
  let file, fileMeta
  const {amazonS3, uploads} = settings.publicSettings
  const {wp_prefix} = settings.privateSettings
  
  thumbnail[`${wp_prefix}postmeta`].forEach(postmeta => {
    switch(postmeta.meta_key) {
    case '_wp_attached_file':
      file = postmeta.meta_value
      break
    case '_wp_attachment_metadata':
      fileMeta = postmeta.meta_value
      break
    }
  })
  
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