import { Model } from 'objection'
import path from 'path'

const TermModel = prefix =>
  class TermModel extends Model {
    static modelPaths = [path.resolve(__dirname, '../')]
    static tableName = `${prefix}terms`
    static relationMappings = () => {
      const Post = require('../Post/PostModel').default(prefix)
      return {
        posts: {
          relation: Model.ManyToManyRelation,
          modelClass: Post,
          join: {
            from: `${prefix}terms.term_id`,
            through: {
              from: `${prefix}term_relationships.term_taxonomy_id`,
              to: `${prefix}term_relationships.object_id`
            },
            to: `${prefix}posts.ID`
          }
        }
      }
    }
  }

export default TermModel
