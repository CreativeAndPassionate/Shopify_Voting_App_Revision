import {
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';

class ResourceItemCover extends React.Component {
  state = { votes: 0};

  componentDidMount() {
    let item;
    if (this.props.item.node) {
      item = this.props.item.node;
    } else {
      item = this.props.item;
    }
    let product_id = item.id.replace('gid://shopify/Product/', '');
    fetch("/api/votes?product_id=" + product_id)
    .then(res => res.json())
    .then(
      (result) => {
        let votes = result.data.length;
        this.setState({ votes })
      },
      (error) => {
        console.log(error);
      }
    )
  }
  
  render() {
    const item = this.props.item.node;
    const media = (
      <Thumbnail
        source={
          item.images.edges[0]
            ? item.images.edges[0].node.originalSrc
            : ''
        }
        alt={
          item.images.edges[0]
            ? item.images.edges[0].node.altText
            : ''
        }
      />
    );
    const price = item.variants.edges[0].node.price;

    return (
      <ResourceList.Item
        verticalAlignment="center"
        id={item.id}
        media={media}
        accessibilityLabel={`View details for ${item.title}`}
        onClick={() => {
          // store.set('item', item);
          this.props.redirectToProduct();
        }}
      >
        <Stack>
          <Stack.Item fill>
            <h3>
              <TextStyle variation="strong">
                {item.title}
              </TextStyle>
            </h3>
          </Stack.Item>
          <Stack.Item>
            <p>${price}</p>
          </Stack.Item>
          <Stack.Item>
            {/* <p>Expires on {twoWeeksFromNow} </p> */}
            <p>Votes: {this.state.votes}</p>
          </Stack.Item>
        </Stack>
      </ResourceList.Item>
    );
  }
}

export default ResourceItemCover;