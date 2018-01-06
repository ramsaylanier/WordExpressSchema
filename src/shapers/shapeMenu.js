import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import sortBy from 'lodash/fp/sortBy'

function shapeMenu(menuName, res){
  if (res) {
    const menu = {
      id: null,
      name: menuName,
      items: null,
    }
    menu.id = res.term_id
    const relationship = res.wp_term_relationships

    const postFuncs = [
      map(x => x.wp_post),
      map(x => x.dataValues),
      sortBy(x => x.menu_order),
      map(x => {
        const postMeta = x.wp_postmeta.map(x => x.dataValues)
  
        const item = {
          id: x.id,
          order: x.menu_order
        }
  
        item.parentMenuId = parseInt(flow(
          filter(x => x.meta_key === '_menu_item_menu_item_parent'),
          map(x => x.meta_value)
        )(postMeta)[0])
  
        item.linkedId = parseInt(flow(
          filter(x => x.meta_key === '_menu_item_object_id'),
          map(x => x.meta_value)
        )(postMeta)[0])
  
        return item
      })
    ]

    const items = flow(postFuncs)(relationship)

    const itemsWithChildren = flow(
      map(item => {
        item.children = items.filter(i => i.parentMenuId === item.id)
        return item
      }),
      filter(item => item.parentMenuId === 0)
    )(items)

    menu.items = itemsWithChildren

    return menu
  }
  return null
}

export default shapeMenu
