import MenuItem from './menuItem'

const Menu = `
  type Menu {
    ID: ID!
    name: String
    items: [MenuItem]
  }
`

export default () => [Menu, MenuItem]
