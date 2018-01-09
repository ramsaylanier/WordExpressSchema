import getMenu from './getMenu'

export default function ({Post, Postmeta, Terms, TermRelationships}) {
  return {
    getMenu: getMenu(Post, Postmeta, Terms, TermRelationships)
  }
}