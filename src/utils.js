import gql from 'graphql-tag';
import WordExpressClient from './client';

export function setLayout(nextState, replaceState, cb){
  const { page } = nextState.params;
  const { Layouts } = nextState.routes[0];

  return WordExpressClient.query({
    query: gql`
      query getPage($pageName: String!){
        page(name: $pageName){
          post_name,
          layout{
            id,
            meta_value
          }
        }
      }
    `,
    variables:{
      pageName: page || 'homepage'
    }
  }).then((graphQLResult) => {
    const { errors, data } = graphQLResult;
    let Layout;

    if (data.page) {
      if (data.page.layout){
        Layout = Layouts[data.page.layout.meta_value] || Layouts['Default'];
      } else {
        Layout = Layouts['Default'];
      }
    } else {
      Layout = Layouts['NotFound'];
    }

    this.layout = Layout;
    this.component = Layout.Component;
    cb();

    if (errors) {
      console.log('got some GraphQL execution errors', errors);
    }
  }).catch((error) => {
    console.log('there was an error sending the query', error);
  });
}
