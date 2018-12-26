import React, { Component } from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';
import { Box, Button, Card, Heading, Image, Mask, Text } from 'gestalt';
import { Link } from 'react-router-dom';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Brews extends Component {
    
    state = {
        brews: [],
        brands: '',
        cartItems: []
    }

    async componentDidMount(){
        try {
            const response =  await strapi.request('POST', 'graphql', {
                data: {
                    query: `
                        query {
                            brand(id: "${this.props.match.params.brandId}") {
                                _id
                                name
                                brews {
                                    _id
                                    name
                                    description
                                    image {
                                        url
                                    }
                                    price
                                }
                            }
                        }
                    `
                }
            });
            this.setState({
                brews: response.data.brand.brews,
                brand: response.data.brand.name
            })
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const { brand, brews, cartItems } = this.state;

        return (
            <Box
                marginTop={4}
                display="flex"
                justifyContent="center"
                alignItems="start"
                dangerouslySetInlineStyle={{
                    __style:{
                        flexWrap: 'wrap-reverse'
                    }
                }}
            >
                <Box
                    display="flex"
                    direction="column"
                    alignItems="center"
                >
                    <Box margin={2}>
                        <Heading color="orchid">{brand}</Heading>
                    </Box>
                    <Box
                        dangerouslySetInlineStyle={{
                            __style: {
                                backgroundColor: '#bdcdd9'
                            }
                        }}
                        wrap
                        shape="rounded"
                        display="flex"
                        justifyContent="center"
                        padding={4}
                    >
                        {brews.map(brew => (
                            <Box
                                paddingY={4}
                                margin={2}
                                width={210}
                                key={brew._id}
                            >
                            <Card
                                image={
                                    <Box
                                        height={250}
                                        width={200}
                                    >
                                        <Image 
                                            fit="cover"
                                            alt="Brew"
                                            naturalHeight={1}
                                            naturalWidth={1}
                                            src={`${apiUrl}${brew.image.url}`}
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
                            <Box marginBottom={2}>
                                <Text bold size="xl">
                                    {brew.name}
                                </Text>
                            </Box>
                                <Text>{brew.description}</Text>
                                <Box marginTop={2}>
                                    <Text color="orchid">${brew.price}</Text>
                                </Box>
                            <Box marginTop={2}>
                                <Text bold size="xl">
                                    <Button 
                                        color="blue"
                                        text="Add to Cart"
                                    />
                                </Text>
                            </Box>
                            </Box>
                            </Card>
                            </Box> 
                        ))}
                    </Box>
                </Box>
                <Box
                    alignSelf="end"
                    marginTop={2}
                    marginLeft={8}
                >
                    <Mask
                        shape="rounded"
                        wash
                    >
                        <Box
                            display="flex"
                            direction="column"
                            alignItems="center"
                            padding={2}
                        >
                            <Heading
                                align="center"
                                size="md"
                            >
                                Your Cart
                            </Heading>
                            <Text
                                color="gray"
                                italic
                            >
                                {cartItems.length} items selected
                            </Text>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                direction="column"
                            >
                                <Box
                                    margin={2}
                                >
                                    {cartItems.length === 0 && (
                                        <Text
                                            color="red"
                                        >
                                            Please select some items
                                        </Text>
                                    )}
                                </Box>
                                <Text
                                    size="lg"
                                >
                                    Total: $3.99
                                </Text>
                                <Link
                                    to="/checkout"
                                >
                                    Checkout
                                </Link>
                            </Box>
                        </Box>
                    </Mask>
                </Box>
            </Box>
        )
    }
}

export default Brews;