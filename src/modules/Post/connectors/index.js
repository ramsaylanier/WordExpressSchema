import getPost from './getPost'
import getPosts from './getPosts'
import getPostTerms from './getPostTerms'
import getTermPosts from './getTermPosts'
import getPostLayout from './getPostLayout'

export default function ({Post, Postmeta, Terms, TermRelationships}) {
  return {
    getPost: getPost(Post),
    getPosts: getPosts(Post),
    getPostTerms: getPostTerms(Terms, TermRelationships),
    getTermPosts: getTermPosts(TermRelationships, Post),
    getPostLayout: getPostLayout(Postmeta),
  }
}