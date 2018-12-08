import getTerm from './getTerm'

const termConnectors = ({ Terms }) => ({
  getTerm: getTerm(Terms)
})

export default termConnectors
