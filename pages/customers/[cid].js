import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { useRouter } from 'next/router'
import {
  Card,
  DataTable,
  Link,
  Page,
  Thumbnail
} from '@shopify/polaris';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
const { map } = require('p-iteration')
import Moment from 'react-moment';

const GET_PRODUCTS_BY_ID = gql`
query getProducts($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
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
`;

const GET_CUSTOMERS_BY_ID = gql`
query getCustomers($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Customer {
      displayName
    }
  }
}
`;

class ProductsTableInner extends React.Component {
  state = {
    rows: [],
  };

  static contextType = Context;

  async componentDidMount() {
    const { products, dates } = this.props;

    let rows = await map(products, async (item, index) => {
      const product_id = item.id.replace('gid://shopify/Product/', '');
      const media = (
        <Thumbnail source={item.images.edges[0].node.originalSrc} />
      );
      const title = (
        <Link onClick={() => this.redirectToProduct(product_id)}>
          {item.title}
        </Link>
      );
      const date = <Moment format="MMMM DD, YYYY \at h:mm a">{dates[index]}</Moment>
      return [
        media,
        title,
        '$' + item.variants.edges[0].node.price,
        date
      ]
    })

    this.setState({ rows })
  }

  redirectToProduct = (id) => {
    const app = this.context;
    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.APP,
      `/products/${id}`,
    );
  };

  render() {
    const { rows } = this.state;
    return (
      <Page>
        <Card>
          <DataTable
            verticalAlign='middle'
            columnContentTypes={[
              'text', 'text', 'numeric', 'numeric'
            ]}
            headings={[
              'Image', 'Product', 'Price', 'Date'
            ]}
            rows={rows}
          />
        </Card>
      </Page>
    )
  }
}

class ProductsTable extends React.Component {
  render() {
    const { votes, customer_id } = this.props;
    let product_ids = votes.map(vote => `gid://shopify/Product/${vote.product_id}`);
    let dates = votes.map(vote => vote.created_at);
    return (
      <Query query={GET_CUSTOMERS_BY_ID} variables={{ ids: ['gid://shopify/Customer/' + customer_id] }}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          // console.log(data);

          let customer_name = data.nodes[0].displayName;
          return (
            <Page title={"Products Voted by " + customer_name }>
              <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: product_ids }}>
                {({ data, loading, error }) => {
                  if (loading) return <div>Loading…</div>;
                  if (error) return <div>{error.message}</div>;
                  // console.log(data);

                  return <ProductsTableInner products={data.nodes} dates={dates} />;
                }}
              </Query>
            </Page>
          )
        }}
      </Query>
    )
  }
}

const Customer = () => {
  const [loading, setLoading] = useState(false)
  const [votes, setVotes] = useState([])
  const router = useRouter()
  const { cid } = router.query

  const getProducts = async () => {
    setLoading(true)

    const res = await fetch("/api/votes?customer_id=" + cid)
    const result = await res.json()
    let votes = result.data;
    
    setVotes(votes)
    setLoading(false)
  }

  useEffect(() => {
    getProducts()
  }, [cid]);

  if (loading) {
    return (
      <Page>
        loading...
      </Page>
    );
  } else {
    return (
      <ProductsTable votes={votes} customer_id={cid} />
    )
  }
}

export default Customer