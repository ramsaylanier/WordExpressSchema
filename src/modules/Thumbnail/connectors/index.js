
import getPostThumbnail from './getPostThumbnail'
import getThumbnails from './getThumbnails'

export default function ({Post, Postmeta, Terms, TermRelationships}, settings) {
  return {
    getPostThumbnail: getPostThumbnail(Postmeta, Post, settings),
    getThumbnails: getThumbnails(Postmeta, Post, settings)
  }
}