import React, { Component } from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';
import { Box, Button, Card, Heading, IconButton, Image, Mask, Text } from 'gestalt';
import { Redirect } from 'react-router-dom';
import { calculatePrice, getCart, setCart } from '../utils';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Brews extends Component {
    
    state = {
        brews: [],
        brands: '',
        cartItems: [],
        redirect: false
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
                brand: response.data.brand.name,
                cartItems: getCart()
            })
        } catch (err) {
            console.error(err);
        }
    }

    addToCart = brew => {
        const alreadyInCart = this.state.cartItems.findIndex(item => item._id === brew._id );
        
        if (alreadyInCart === -1){
            const updatedItems = this.state.cartItems.concat({
                ...brew,
                quantity: 1
            });
            this.setState({
                cartItems: updatedItems
            },
            () => setCart(updatedItems));
        } else {
            const updatedItems = [...this.state.cartItems];
            updatedItems[alreadyInCart].quantity += 1;
            this.setState({
                cartItems: updatedItems
            },
            () => setCart(updatedItems));
        }
    }

    deleteItemFromCart = itemToDeleteId => {
        const filteredItems = this.state.cartItems.filter(item => item._id !== itemToDeleteId);
        this.setState({
            cartItems: filteredItems
        },
        () => setCart(filteredItems));
    }

    pushToCheckout = () => {
        this.setState({
            redirect: true
        })
    }

    render() {
        const { brand, brews, cartItems } = this.state;

        if (this.state.redirect) {
            return <Redirect push to="/checkout" />;
        }

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
                                        onClick={() => this.addToCart(brew)}
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
                                size="sm"
                            >
                                Your Cart
                            </Heading>
                            <Text
                                color="gray"
                                italic
                            >
                                {cartItems.length} items selected
                            </Text>

                            {cartItems.map(item => (
                                <Box 
                                    key={item._id}
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Text>
                                        {item.name} x {item.quantity} - ${(item.quantity * item.price).toFixed(2)}
                                    </Text>
                                    <IconButton 
                                        accessibilityLabel="Delete Item"
                                        icon="cancel"
                                        size="sm"
                                        iconColor="red"
                                        onClick={() => this.deleteItemFromCart(item._id)}
                                    />
                                </Box>
                            ))}

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
                                    Total: {calculatePrice(cartItems)}
                                </Text>
                                <Box
                                    marginTop={2}
                                >

                                    <Button 
                                        color="red"
                                        text="Checkout"
                                        onClick={this.pushToCheckout}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Mask>
                </Box>
            </Box>
        )
    }
}

export default Brews;