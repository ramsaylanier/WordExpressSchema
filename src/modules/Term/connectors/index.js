import getTerm from './getTerm'

export default function ({Terms}) {
  return {
    getTerm: getTerm(Terms)
  }
}