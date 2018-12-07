// import Sequelize from 'sequelize'
import knex from 'knex'

// MODELS
import PostModel from './modules/Post/model'
// import PostmetaModel from './modules/Postmeta/model'
// import UserModel from './modules/User/model'
// import {TermModel, TermRelationshipModel, TermTaxonomyModel} from './modules/Term/model'

// CONNECTORS
import PostConnectors from './modules/Post/connectors'
// import PostmetaConnectors from './modules/Postmeta/connectors'
// import TermConnectors from './modules/Term/connectors'
// import UserConnectors from './modules/User/connectors'
// import MenuConnectors from './modules/Menu/connectors'
// import ThumbnailConnectors from './modules/Thumbnail/connectors'

export default class WordExpressDatabase {
  constructor(settings) {
    this.settings = settings
    this.connection = this.connect(settings)
    this.connectors = this.getConnectors()
    this.models = this.getModels()
  }

  connect() {
    const {
      name,
      username,
      password,
      host,
      port
    } = this.settings.privateSettings.database

    const connection = knex({
      client: 'mysql',
      connection: {
        host,
        port,
        password,
        database: name,
        user: username
      }
    })

    // const Conn = new Sequelize(
    //   name,
    //   username,
    //   password,
    //   {
    //     logging: false,
    //     dialect: 'mysql',
    //     host: host,
    //     port: port || 3306,
    //     define: {
    //       timestamps: false,
    //       freezeTableName: true,
    //     }
    //   }
    // )

    return connection
  }

  getModels() {
    const prefix = this.settings.privateSettings.wp_prefix
    const Conn = this.connection

    return {
      Post: PostModel(Conn, prefix)
      // Postmeta: PostmetaModel(Conn, prefix),
      // User: UserModel(Conn, prefix),
      // Terms: TermModel(Conn, prefix),
      // TermRelationships: TermRelationshipModel(Conn, prefix),
      // TermTaxonomy: TermTaxonomyModel(Conn, prefix)
    }
  }

  getConnectors() {
    const models = this.getModels()
    // const { Post, Postmeta, Terms, TermRelationships } = models
    // const {Post} = models

    // Terms.hasMany(TermRelationships,  {foreignKey: 'term_taxonomy_id'})
    // TermRelationships.belongsTo(Terms, {foreignKey: 'term_taxonomy_id'})

    // TermRelationships.hasMany(Postmeta, {foreignKey: 'post_id'})
    // Postmeta.belongsTo(TermRelationships, {foreignKey: 'post_id'})

    // TermRelationships.belongsTo(Post, {foreignKey: 'object_id'})

    // Post.hasMany(Postmeta, {foreignKey: 'post_id'})
    // Postmeta.belongsTo(Post, {foreignKey: 'post_id'})

    return {
      ...PostConnectors(models, this.settings)
      // ...PostmetaConnectors(models),
      // ...TermConnectors(models),
      // ...UserConnectors(models),
      // ...MenuConnectors(models),
      // ...ThumbnailConnectors(models, this.settings)
    }
  }
}
