export default function WordExpressResolvers(Connectors, publicSettings) {
  const Resolvers = {
    Query: {
      settings() {
        return publicSettings
      },
      category(_, { term_id, name }) {
        return Connectors.getTerm(term_id, name)
      },
      posts(_, args) {
        return Connectors.getPosts(args)
      },
      post(_, { name, id }) {
        return Connectors.getPost(id, name)
      },
      postmeta(_, { post_id, keys }) {
        return Connectors.getPostmeta(post_id, keys)
      },
      menus(_, { name }) {
        return Connectors.getMenu(name)
      },
      user(_, { id, name }) {
        return Connectors.getUser({ id, name })
      },
      attachments(_, { ids }) {
        return Connectors.getThumbnails(ids)
      }
    },
    Category: {
      posts(category, args) {
        return Connectors.getTermPosts(category.term_id, args)
      }
    },
    Post: {
      layout(post) {
        return Connectors.getPostLayout(post.ID)
      },
      post_meta(post, keys) {
        return Connectors.getPostmeta(post.ID, keys)
      },
      thumbnail(post) {
        return Connectors.getPostThumbnail(post.ID)
      },
      author(post) {
        return Connectors.getUser({ userId: post.post_author })
      },
      categories(post) {
        return Connectors.getPostTerms(post.ID)
      },
      children(post) {
        return Connectors.getPostChildren(post)
      }
    },
    Postmeta: {
      connecting_post(postmeta) {
        return Connectors.getPost(postmeta.meta_value)
      }
    },
    Menu: {
      items(menu) {
        return menu.items
      }
    },
    MenuItem: {
      navitem(menuItem) {
        return Connectors.getPost(menuItem.linkedId)
      },
      children(menuItem) {
        return menuItem.children
      }
    },
    User: {
      posts(user, args) {
        const a = {
          ...args,
          userId: user.id
        }
        return Connectors.getPosts(a)
      }
    }
  }

  return Resolvers
}
