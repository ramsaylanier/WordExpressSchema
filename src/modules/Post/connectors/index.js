import getPost from './getPost'
import getPosts from './getPosts'
import getPostChildren from './getPostChildren'
import getPostTerms from './getPostTerms'
import getTermPosts from './getTermPosts'
import getPostLayout from './getPostLayout'

const postConnectors = (
  { Post, Postmeta, Terms, TermRelationships },
  settings
) => ({
  getPost: getPost(Post),
  getPosts: getPosts(Post),
  getPostChildren: getPostChildren(Post),
  getPostLayout: getPostLayout(Postmeta),
  getPostTerms: getPostTerms(Post, Terms, TermRelationships, settings),
  getTermPosts: getTermPosts(Terms, Post, settings)
})

export default postConnectors
