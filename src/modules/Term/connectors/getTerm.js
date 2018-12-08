export default Terms => (termId, name) =>
  Terms.query()
    .where('term_id', termId)
    .orWhere('name', name)
