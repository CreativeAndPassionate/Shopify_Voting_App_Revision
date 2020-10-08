import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { useRouter } from 'next/router'
import {
  Avatar,
  Card,
  DataTable,
  Link,
  Page,
} from '@shopify/polaris';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';
import Moment from 'react-moment';

const GET_CUSTOMERS_BY_ID = gql`
  query getCustomers($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Customer {
        id
        displayName
        email
        updatedAt
      }
    }
  }
`;

const GET_PRODUCTS_BY_ID = gql`
query getProducts($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      title
    }
  }
}
`;

class CustomersTable extends React.Component {

  static contextType = Context;

  redirectToProduct = (id) => {
    const app = this.context;
    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.APP,
      `/customers/${id}`,
    );
  };

  render() {
    const { votes, product_id } = this.props;
    let customer_ids = votes.map(vote => `gid://shopify/Customer/${vote.customer_id}`);
    let dates = votes.map(vote => vote.created_at);
    return (
      <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: ['gid://shopify/Product/' + product_id] }}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading…</div>;
          if (error) return <div>{error.message}</div>;
          // console.log(data);

          let product_title = data.nodes[0].title;
          return (
            <Page title={"Customers Voted on " + product_title}>
              <Query query={GET_CUSTOMERS_BY_ID} variables={{ ids: customer_ids }}>
                {({ data, loading, error }) => {
                  if (loading) return <div>Loading…</div>;
                  if (error) return <div>{error.message}</div>;
                  // console.log(data);
        
                  let customers = data.nodes.map((item, index) => {
                    let  id = item.id.replace('gid://shopify/Customer/', '');
                    const name = (
                      <Link onClick={() => this.redirectToProduct(id)}>
                        {item.displayName}
                      </Link>
                    );
                    const date = <Moment format="MMMM DD, YYYY \at h:mm a">{dates[index]}</Moment>
                    return [
                      name,
                      item.email,
                      date
                    ]
                  });
                  return (
                    <Card>
                      <DataTable
                        verticalAlign='middle'
                        columnContentTypes={[
                          'text', 'text', 'text'
                        ]}
                        headings={[
                          'Name', 'Email', 'Date',
                        ]}
                        rows={customers}
                      />
                    </Card>
                  );
                }}
              </Query>
            </Page>
          );
        }}
      </Query>
    )
  }
}

const Product = () => {
  const [loading, setLoading] = useState(false)
  const [votes, setVotes] = useState([])
  const router = useRouter()
  const { pid } = router.query

  const getProduct = async () => {
    setLoading(true)

    const res = await fetch("/api/votes?product_id=" + pid)
    const result = await res.json()
    let votes = result.data;
    
    setVotes(votes)
    setLoading(false)
  }

  useEffect(() => {
    getProduct()
  }, [pid]);

  if (loading) {
    return (
      <Page>
        loading...
      </Page>
    );
  } else {
    return (
      <CustomersTable votes={votes} product_id={pid} />
    )
  }
}

export default Product