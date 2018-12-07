import getPost from './getPost'
import getPosts from './getPosts'
import getPostTerms from './getPostTerms'
import getTermPosts from './getTermPosts'
import getPostLayout from './getPostLayout'

const postConnectors = (
  { Post, Postmeta, Terms, TermRelationships },
  settings
) => ({
  getPost: getPost(Post),
  getPosts: getPosts(Post)
  // getPostTerms: getPostTerms(Terms, TermRelationships, settings),
  // getTermPosts: getTermPosts(TermRelationships, Post, settings),
  // getPostLayout: getPostLayout(Postmeta)
})

export default postConnectors
