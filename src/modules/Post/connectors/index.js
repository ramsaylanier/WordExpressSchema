import getPost from './getPost'
import getPosts from './getPosts'
import getPostTerms from './getPostTerms'
import getTermPosts from './getTermPosts'
import getPostThumbnail from './getPostThumbnail'
import getPostLayout from './getPostLayout'

export default function ({Post, Postmeta, Terms, TermRelationships}, settings) {
  return {
    getPost: getPost(Post),
    getPosts: getPosts(Post),
    getPostTerms: getPostTerms(Terms, TermRelationships),
    getTermPosts: getTermPosts(TermRelationships, Post),
    getPostThumbnail: getPostThumbnail(Postmeta, Post, settings),
    getPostLayout: getPostLayout(Postmeta)
  }
}