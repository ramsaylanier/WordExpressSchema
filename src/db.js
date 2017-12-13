import Sequelize from 'sequelize'
import _ from 'lodash'
import PHPUnserialize from 'php-unserialize'

const Op = Sequelize.Op

export default class WordExpressDatabase {
  constructor(settings) {
    this.settings = settings
    this.connection = this.connect(settings)
    this.connectors = this.getConnectors()
    this.models = this.getModels()
  }

  connect() {
    const { name, username, password, host, port } = this.settings.privateSettings.database

    const Conn = new Sequelize(
      name,
      username,
      password,
      {
        logging: false,
        dialect: 'mysql',
        host: host,
        port: port || 3306,
        define: {
          timestamps: false,
          freezeTableName: true,
        }
      }
    )

    return Conn
  }

  getModels() {
    const prefix = this.settings.privateSettings.wp_prefix
    const Conn = this.connection

    return {
      Post: Conn.define(prefix + 'posts', {
        id: { type: Sequelize.INTEGER, primaryKey: true},
        post_author: { type: Sequelize.INTEGER },
        post_title: { type: Sequelize.STRING },
        post_content: { type: Sequelize.STRING },
        post_excerpt: { type: Sequelize.STRING },
        post_status: { type: Sequelize.STRING },
        post_type: { type: Sequelize.STRING },
        post_name: { type: Sequelize.STRING},
        post_date: { type: Sequelize.STRING},
        post_parent: { type: Sequelize.INTEGER},
        menu_order: { type: Sequelize.INTEGER}
      }),
      Postmeta: Conn.define(prefix + 'postmeta', {
        meta_id: { type: Sequelize.INTEGER, primaryKey: true, field: 'meta_id' },
        post_id: { type: Sequelize.INTEGER },
        meta_key: { type: Sequelize.STRING },
        meta_value: { type: Sequelize.INTEGER },
      }),
      User: Conn.define(prefix + 'users', {
        id: { type: Sequelize.INTEGER, primaryKey: true },
        user_nicename: { type: Sequelize.STRING },
        user_email: { type: Sequelize.STRING },
        user_registered: { type: Sequelize.STRING },
        display_name: { type: Sequelize.STRING }
      }),
      Terms: Conn.define(prefix + 'terms', {
        term_id: { type: Sequelize.INTEGER, primaryKey: true },
        name: { type: Sequelize.STRING },
        slug: { type: Sequelize.STRING },
        term_group: { type: Sequelize.INTEGER },
      }),
      TermRelationships: Conn.define(prefix + 'term_relationships', {
        object_id: { type: Sequelize.INTEGER, primaryKey: true },
        term_taxonomy_id: { type: Sequelize.INTEGER },
        term_order: { type: Sequelize.INTEGER },
      }),
      TermTaxonomy: Conn.define(prefix + 'term_taxonomy', {
        term_taxonomy_id: { type: Sequelize.INTEGER, primaryKey: true },
        term_id: { type: Sequelize.INTEGER },
        taxonomy: { type: Sequelize.STRING },
        parent: { type: Sequelize.INTEGER },
        count: { type: Sequelize.INTEGER },
      })
    }
  }

  getConnectors() {
    const { amazonS3, uploads } = this.settings.publicSettings
    const { Post, Postmeta, User, Terms, TermRelationships } = this.getModels()

    Terms.hasMany(TermRelationships,  {foreignKey: 'term_taxonomy_id'})
    TermRelationships.belongsTo(Terms, {foreignKey: 'term_taxonomy_id'})

    TermRelationships.hasMany(Postmeta, {foreignKey: 'post_id'})
    Postmeta.belongsTo(TermRelationships, {foreignKey: 'post_id'})

    TermRelationships.belongsTo(Post, {foreignKey: 'object_id'})

    Post.hasMany(Postmeta, {foreignKey: 'post_id'})
    Postmeta.belongsTo(Post, {foreignKey: 'post_id'})

    return {
      getPosts({ post_type, order, limit = 10, skip = 0 }) {
        const orderBy = order ? [order.orderBy, order.direction] : ['menu_order', 'ASC']
        return Post.findAll({
          include: [{
            model: Postmeta,
          }],
          where: {
            post_type,
            post_status: 'publish'
          },
          order: [orderBy],
          limit: limit,
          offset: skip
        }).then(r => {
          return r
        })
      },

      getPostsInCategory(termId, { post_type, limit = 10, skip = 0 }) {
        console.log(post_type)
        return TermRelationships.findAll({
          attributes: [],
          include: [{
            model: Post,
            where: {
              post_type: post_type,
              post_status: 'publish'
            }
          }],
          where: {
            term_taxonomy_id: termId
          },
          limit: limit,
          offset: skip
        }).then(posts => _.map(posts, post => post.wp_post))
      },

      getCategoryById(termId) {
        return Terms.findOne({
          where: {
            term_id: termId
          }
        })
      },

      getPostById(postId) {
        return Post.findOne({
          where: {
            post_status: 'publish',
            id: postId
          }
        }).then(post => {
          if (post) {
            const { id } = post.dataValues
            post.dataValues.children = []
            return Post.findAll({
              attributes: ['id'],
              where: {
                post_parent: id
              }
            }).then(childPosts => {
              if (childPosts.length > 0) {
                _.map(childPosts, childPost => {
                  post.dataValues.children.push({ id: Number(childPost.dataValues.id) })
                })
              }
              return post
            })
          }
          return null
        })
      },

      getPostByName(name) {
        return Post.findOne({
          where: {
            post_status: 'publish',
            post_name: name
          }
        })
      },

      getPostThumbnail(postId) {
        return Postmeta.findOne({
          where: {
            post_id: postId,
            meta_key: '_thumbnail_id'
          }
        }).then(res => {
          if (res) {
            const metaKey = amazonS3 ? 'amazonS3_info' : '_wp_attached_file'

            return Post.findOne({
              where: {
                id: Number(res.dataValues.meta_value)
              },
              include: {
                model: Postmeta,
                where: {
                  meta_key: metaKey
                },
                limit: 1
              }
            }).then( post => {
              if (post.wp_postmeta[0]) {
                const thumbnail = post.wp_postmeta[0].dataValues.meta_value
                const thumbnailSrc = amazonS3 ?
                  uploads + PHPUnserialize.unserialize(thumbnail).key :
                  uploads + thumbnail

                return thumbnailSrc
              }
              return null
            })
          }
          return null
        })
      },

      getUser(userId) {
        return User.findOne({
          where: {
            ID: userId
          }
        })
      },

      getPostLayout(postId) {
        return Postmeta.findOne({
          where: {
            post_id: postId,
            meta_key: 'page_layout_component'
          }
        })
      },

      getPostmetaById(metaId, keys) {
        return Postmeta.findOne({
          where: {
            meta_id: metaId,
            meta_key: {
              [Op.in]: keys.keys
            }
          }
        })
      },

      getPostmeta(postId, keys) {
        return Postmeta.findAll({
          where: {
            post_id: postId,
            meta_key: {
              [Op.in]: keys.keys
            }
          }
        })
      },

      getMenu(name) {
        return Terms.findOne({
          where: {
            slug: name
          },
          include: [{
            model: TermRelationships,
            include: [{
              model: Post,
              include: [Postmeta]
            }]
          }]
        }).then(res => {
          if (res) {
            const menu = {
              id: null,
              name: name,
              items: null,
            }
            menu.id = res.term_id
            const relationship = res.wp_term_relationships
            const posts = _.map(_.map(_.map(relationship, 'wp_post'), 'dataValues'), (post) => {
              const postmeta = _.map(post.wp_postmeta, 'dataValues')
              const parentMenuId = _.map(_.filter(postmeta, meta => {
                return meta.meta_key === '_menu_item_menu_item_parent'
              }), 'meta_value')
              post.post_parent = parseInt(parentMenuId[0])
              return post
            })
            const navItems = []

            const parentIds = _.map(_.filter(posts, post => (
              post.post_parent === 0
            )), 'id')

            _.map(_.sortBy(posts, 'post_parent'), post => {
              const navItem = {}
              const postmeta = _.map(post.wp_postmeta, 'dataValues')
              const isParent = _.includes( parentIds, post.id)
              const objectType = _.map(_.filter(postmeta, meta => {
                return meta.meta_key === '_menu_item_object'
              }), 'meta_value')
              const linkedId = Number(_.map(_.filter(postmeta, meta => {
                return meta.meta_key === '_menu_item_object_id'
              }), 'meta_value'))

              if (isParent) {
                navItem.id = post.id
                navItem.post_title = post.post_title
                navItem.order = post.menu_order
                navItem.linkedId = linkedId
                navItem.object_type = objectType
                navItem.children = []
                navItems.push(navItem)
              } else {
                const parentId = Number(_.map(_.filter(postmeta, meta => {
                  return meta.meta_key === '_menu_item_menu_item_parent'
                }), 'meta_value'))
                const existing = navItems.filter((item) => (
                  item.id === parentId
                ))

                if (existing.length) {
                  existing[0].children.push({id: post.id, linkedId: linkedId })
                }
              }

              menu.items = navItems
            })
            return menu
          }
          return null
        })
      }
    }
  }
}
