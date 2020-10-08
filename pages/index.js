import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  Page,
  DataTable,
  Thumbnail,
  Link
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

const { map } = require('p-iteration')

const GET_PRODUCTS = gql`
{
  products(first: 100) {
    edges {
      cursor
      node {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
}
`;

class ProductsTable extends React.Component {
  state = {
    rows: [],
  };

  static contextType = Context;

  redirectToProduct = (id) => {
    const app = this.context;
    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.APP,
      `/products/${id}`,
    );
  };

  async componentDidMount() {
    const { products } = this.props;

    let rows = await map(products, async (item) => {
      const product_id = item.id.replace('gid://shopify/Product/', '');
      const media = (
        <Thumbnail source={item.images.edges[0].node.originalSrc} />
      );
      const title = (
        <Link onClick={() => this.redirectToProduct(product_id)}>
          {item.title}
        </Link>
      );
      const votes = await this.getVotes(product_id);
      return [
        media,
        title,
        '$' + item.variants.edges[0].node.price,
        votes
      ]
    })

    this.setState({ rows })
  }

  getVotes = async (id) => {
    const res = await fetch("/api/votes?product_id=" + id)
    const result = await res.json();
    return result.data.length || 0;
  }

  render() {
    const { rows } = this.state;

    return (
      <Page>
        <Card>
          <DataTable
            verticalAlign='middle'
            columnContentTypes={[
              'text',
              'text',
              'numeric',
              'numeric'
            ]}
            headings={[
              'Image',
              'Product',
              'Price',
              'Votes'
            ]}
            rows={rows}
          />
        </Card>
      </Page>
    );
  }
}

class Index extends React.Component {
  render() {
    return (
      <Page title="Votes Summary">
        <Query query={GET_PRODUCTS} variables={{ ids: store.get('ids') }}>
          {({ data, loading, error }) => {
            if (loading) return <div>Loading…</div>;
            if (error) return <div>{error.message}</div>;
            console.log(data);
            let products = data.products.edges.map(product => product.node);

            return <ProductsTable products={products} />;
          }}
        </Query>
      </Page>
    );
  }
}

export default Index;