import filter from 'lodash/fp/filter'
import find from 'lodash/fp/find'
import { flowAsync } from '../../../util'

const getMenuItemsFromTerm = term => {
  console.log(term)
  return term.$relatedQuery('posts')
}

const getValueFromKey = key => meta =>
  find(i => i.meta_key === key, meta).meta_value

const getRootParents = items => filter(item => item.parent === 0, items)

const shapeItems = Postmeta => Post => items =>
  Promise.all(
    items.map(async item => {
      const postmeta = await Postmeta.query().where('post_id', item.ID)
      const parent = parseInt(
        getValueFromKey('_menu_item_menu_item_parent')(postmeta)
      )
      const linkedId = getValueFromKey('_menu_item_object_id')(postmeta)
      const navitem = await Post.query().findById(linkedId)
      return {
        ID: item.ID,
        linkedId,
        parent,
        navitem,
        order: item.menu_order,
        children: []
      }
    }, items)
  )

const attachChildToParent = child => items => {
  const parent = items.find(item => item.ID === child.parent)
  parent.children.push(child)
}

const attachChildrenToParents = items =>
  items.map(item => {
    item.parent !== 0 && attachChildToParent(item)(items)
    return item
  })

const getMenu = ({ Post, Postmeta, Terms }) => async name => {
  const term = await Terms.query()
    .where('name', name)
    .first()

  const items = await flowAsync(
    getMenuItemsFromTerm,
    shapeItems(Postmeta)(Post),
    attachChildrenToParents,
    getRootParents
  )(name)

  return {
    ID: term.term_id,
    name: term.name,
    items
  }
}

export default getMenu
