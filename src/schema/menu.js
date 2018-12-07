import MenuItem from './menuItem'

const Menu = `
  type Menu {
    id: ID!
    name: String
    items: [MenuItem]
  }
`

export default () => [Menu, MenuItem]
