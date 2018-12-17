import flow from 'lodash/fp/flow'

const flowAsync = (...functions) => input =>
  functions.reduce((chain, func) => chain.then(func), Promise.resolve(input))

export { flowAsync }
