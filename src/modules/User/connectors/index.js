import getUser from './getUser'

export default function({ User }) {
  return {
    getUser: getUser(User)
  }
}
