import { Model } from 'objection'

const TermRelationshipModel = prefix =>
  class TermRelationshipModel extends Model {
    static tableName = `${prefix}term_relationships`
  }

const TermTaxonomyModel = prefix =>
  class TermTaxonomyModel extends Model {
    static tableName = `${prefix}term_taxonomy`
  }

export { TermRelationshipModel, TermTaxonomyModel }
