// import Sequelize from 'sequelize'
import knex from 'knex'
import { Model } from 'objection'

// MODELS
import PostModel from './modules/Post/PostModel'
import PostmetaModel from './modules/Postmeta/model'
import UserModel from './modules/User/model'
import TermModel from './modules/Term/TermModel'
import { TermRelationshipModel, TermTaxonomyModel } from './modules/Term/model'

// CONNECTORS
import PostConnectors from './modules/Post/connectors'
import PostmetaConnectors from './modules/Postmeta/connectors'
import TermConnectors from './modules/Term/connectors'
import UserConnectors from './modules/User/connectors'
import MenuConnectors from './modules/Menu/connectors'
import ThumbnailConnectors from './modules/Thumbnail/connectors'

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
    return connection
  }

  getModels() {
    const prefix = this.settings.privateSettings.wp_prefix
    Model.knex(this.connection)

    const Post = PostModel(prefix)
    const Postmeta = PostmetaModel(prefix)
    const Terms = TermModel(prefix)
    const TermRelationships = TermRelationshipModel(prefix)
    const TermTaxonomy = TermTaxonomyModel(prefix)
    const User = UserModel(prefix)

    return {
      Post,
      Postmeta,
      Terms,
      TermRelationships,
      TermTaxonomy,
      User
    }
  }

  getConnectors() {
    const models = this.getModels()
    const { Post, Postmeta, Terms, TermRelationships } = models
    // const { Post } = models

    // Terms.hasMany(TermRelationships,  {foreignKey: 'term_taxonomy_id'})
    // TermRelationships.belongsTo(Terms, {foreignKey: 'term_taxonomy_id'})

    // TermRelationships.hasMany(Postmeta, {foreignKey: 'post_id'})
    // Postmeta.belongsTo(TermRelationships, {foreignKey: 'post_id'})

    // TermRelationships.belongsTo(Post, {foreignKey: 'object_id'})

    // Post.hasMany(Postmeta, {foreignKey: 'post_id'})
    // Postmeta.belongsTo(Post, {foreignKey: 'post_id'})

    return {
      ...PostConnectors(models, this.settings),
      ...PostmetaConnectors(models),
      ...TermConnectors(models),
      ...UserConnectors(models),
      ...MenuConnectors(models),
      ...ThumbnailConnectors(models, this.settings)
    }
  }
}
