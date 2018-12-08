import { Model } from 'objection'

const TermModel = prefix => {
  console.log([__dirname])
  return class TermModel extends Model {
    static modelPaths = [__dirname]
    static tableName = `${prefix}terms`
    static relationMappings = {
      posts: {
        relation: Model.ManyToManyRelation,
        modelClass: 'Post',
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
