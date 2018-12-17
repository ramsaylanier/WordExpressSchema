import getMenu from './getMenu'

const menuConnectors = ({ Post, Postmeta, Terms, TermRelationships }) => ({
  getMenu: getMenu({ Post, Postmeta, Terms })
})

export default menuConnectors
