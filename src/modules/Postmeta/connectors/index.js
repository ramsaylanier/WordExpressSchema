import getPostmeta from './getPostmeta'

export default function({ Postmeta }) {
  return {
    getPostmeta: getPostmeta(Postmeta)
  }
}
