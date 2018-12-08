import getPostmeta from './getPostmeta'

const postmetaConnectors = ({ Postmeta }) => ({
  getPostmeta: getPostmeta(Postmeta)
})

export default postmetaConnectors
