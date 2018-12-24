import React, { Component } from 'react';
import { Box, Card, Container, Heading, Image, Text } from 'gestalt';
import { Link } from 'react-router-dom';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {

  state = {
    brands: []
  };
  
  async componentDidMount() {
    try {
      const { data } = await strapi.request('POST', '/graphql', {
        data: {
          query: `
            query {
              brands {
                _id
                name 
                description
                image {
                  url
                }
              }
            }`
        }
      });
      this.setState({
        brands: data.brands
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { brands } = this.state;
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          marginBottom={2}
        >
          <Heading
            color="midnight"
            size="md"
          >
            Brew Brands
          </Heading>
        </Box>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#d6c8ec'
            }
          }}
          shape="rounded"
          wrap
          display="flex"
          justifyContent="around"
        >
          {brands.map(brand => (
            <Box
              paddingY={4}
              margin={2}
              width={200}
              key={brand._id}
            >
              <Card
                image={
                  <Box
                    height={200}
                    width={200}
                  >
                    <Image 
                      fit="cover"
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brand.image.url}`}
                    />
                  </Box>
                }
              >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
              >
                <Text bold size="xl">{brand.name}</Text>
                <Text>{brand.description}</Text>
                <Text bold size="xl">
                  <Link to={`/${brand._id}`}>
                    See Brews
                  </Link>
                </Text>
              </Box>
              </Card>
            </Box> 
          ))}
        </Box>
      </Container>
    );
  }
}

export default App;
