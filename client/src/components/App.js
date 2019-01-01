import React, { Component } from 'react';
import { Box, Card, Container, Heading, Icon, Image, SearchField, Text } from 'gestalt';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {

  state = {
    brands: [],
    searchTerm: '',
    loadingBrands: true
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
        brands: data.brands,
        loadingBrands: false
      });
    } catch (err) {
      console.error(err);
      this.setState({
        loadingBrands: false
      });
    }
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value }, () => this.searchBrands());
  }

  // filteredBrands = ({ brands, searchTerm }) => {
  //   return brands.filter(brand => {
  //     return brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  //     brand.description.toLowerCase().includes(searchTerm.toLowerCase());
  //   });
  // };

  searchBrands = async () => {
    const response = await strapi.request('POST', '/graphql', {
      data: {
        query: `query {
          brands(where: {
            name_contains: "${this.state.searchTerm}"
          }) {
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
    console.log(this.state.searchTerm, response.data.brands);
    this.setState({
      brands: response.data.brands,
      loadingBrands: false
    });
  }

  render() {
    const { searchTerm, loadingBrands, brands } = this.state;
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          marginTop={4}

        >
          <SearchField 
            id="searchField"
            accessibilityLabel="Brand Search Field"
            placeholder="Search Brands"
            value={searchTerm}
            onChange={this.handleChange}
          />
          <Box
            margin={3}
          >
            <Icon 
              icon="filter"
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>

        </Box>
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
              backgroundColor: '#e8eaed'
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
                <Text
                  margin={20} 
                >
                  {brand.description}
                </Text>
                <Box marginTop={2}>
                  <Text bold size="xl">
                    <Link to={`/${brand._id}`}>
                      See Brews
                    </Link>
                  </Text>
                </Box>
              </Box>
              </Card>
            </Box> 
          ))}
        </Box>
        <Loader show={loadingBrands}/>
      </Container>
    );
  }
}

export default App;
