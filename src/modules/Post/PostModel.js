import { Model } from 'objection'
import path from 'path'

const Post = prefix =>
  class Post extends Model {
    static modelPaths = [path.resolve(__dirname, '../Term')]
    static tableName = `${prefix}posts`
    static relationMappings = {
      terms: {
        relation: Model.ManyToManyRelation,
        modelClass: require('../Term/TermModel').default(prefix),
        join: {
          from: `${prefix}posts.ID`,
          through: {
            from: `${prefix}term_relationships.object_id`,
            to: `${prefix}term_relationships.term_taxonomy_id`
          },
          to: `${prefix}terms.term_id`
        }
      }
    }
  }

export default Post
