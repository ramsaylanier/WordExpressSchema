export default function WordExpressResolvers(Connectors, publicSettings) {
  const Resolvers = {
    Query: {
      settings() {
        return publicSettings
      },
      category(_, { term_id }) {
        return Connectors.getCategoryById(term_id)
      },
      posts(_, args) {
        return Connectors.getPosts(args)
      },
      menus(_, {name}) {
        return Connectors.getMenu(name)
      },
      post(_, {name, id}) {
        if (name) {
          return Connectors.getPostByName(name, id)
        }
        return Connectors.getPostById(id)
      },
      postmeta(_, {post_id, keys}) {
        return Connectors.getPostmeta(post_id, keys)
      },
      user(_, {userId}) {
        return Connectors.getUser(userId)
      },
    },
    Category: {
      posts(category, args) {
        return Connectors.getPostsInCategory(category.term_id, args)
      }
    },
    Post: {
      layout(post) {
        return Connectors.getPostLayout(post.id)
      },
      post_meta(post, keys) {
        return Connectors.getPostmeta(post.id, keys)
      },
      thumbnail(post) {
        return Connectors.getPostThumbnail(post.id)
      },
      author(post) {
        return Connectors.getUser(post.post_author)
      },
      categories(post) {
        return Connectors.getPostCategories(post.id)
      }
    },
    Postmeta: {
      connecting_post(postmeta) {
        return Connectors.getPostById(postmeta.meta_value)
      }
    },
    Menu: {
      items(menu) {
        return menu.items
      }
    },
    MenuItem: {
      navitem(menuItem) {
        return Connectors.getPostById(menuItem.linkedId)
      },
      children(menuItem) {
        return menuItem.children
      }
    }
  }

  return Resolvers
}
