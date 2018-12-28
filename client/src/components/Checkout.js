import React, { Component } from 'react';
import { Box, Container, Heading, Text, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import { getCart, calculatePrice } from '../utils';

class Checkout extends Component {

    state = {
        cartItems: [],
        address: '',
        city: '',
        postalCode: '',
        confirmationEmailAddress: '',
        toast: false,
        toastMessage: '',
    };

    componentDidMount(){
        this.setState({
            cartItems: getCart()
        })
    }

    handleChange = ({ event, value }) => {
        event.persist();
        this.setState({
            [event.target.name]: value
        });
    }

    handleConfirmOrder = async event => {
        event.preventDefault();

        if(this.isFormEmpty(this.state)){
            this.showToast('Please fill in all fields to sign up');
            return;
        } 
        
    };

    isFormEmpty = ({ address, city, postalCode, confirmationEmailAddress }) => {
        return !address || !city || !postalCode || !confirmationEmailAddress;
    };

    showToast = toastMessage => {
        this.setState({
            toast: true,
            toastMessage
        });
        setTimeout(() => this.setState({ 
            toast: false,
            toastMessage: '' 
        }), 5000);
    }

    render() {
        const { toast, toastMessage, cartItems } = this.state;

        return (
            <Container>
                <Box
                    color="darkWash"
                    margin={4}
                    padding={4}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                >
                    <Heading
                        color="midnight"
                    >
                        Checkout
                    </Heading>
                    {cartItems.length > 0 ? <React.Fragment>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        marginTop={2}
                        marginBottom={6}
                    >
                        <Text
                            color="darkGray"
                            italic
                        >
                            {cartItems.length} Items for Checkout
                        </Text>
                        <Box
                            padding={2}
                        >
                            {cartItems.map(item => (
                                <Box key={item._id} padding={1}>
                                    <Text color="midnight">
                                        {item.name} x {item.quantity} – ${item.quantity * item.price}
                                    </Text>
                                </Box>
                            ))}
                        </Box>
                        <Text bold>Total: {calculatePrice(cartItems)}</Text>
                    </Box>
                    <form 
                        style={{
                            display: 'inlineBlock',
                            textAlign: 'center',
                            maxWidth: 450
                        }}
                        onSubmit={this.handleConfirmOrder}
                    >
                            <Box
                                marginTop={2}
                            >
                                <TextField 
                                    id="address"
                                    type="text"
                                    name="address"
                                    placeholder="Shipping Address"
                                    onChange={this.handleChange}
                                />
                            </Box>
                            <Box
                                marginTop={2}
                            >
                                <TextField 
                                    id="postalCode"
                                    type="number"
                                    name="postalCode"
                                    placeholder="Postal Code"
                                    onChange={this.handleChange}
                                />
                            </Box>
                            <Box
                                marginTop={2}
                            >
                                <TextField 
                                    id="city"
                                    type="text"
                                    name="City"
                                    placeholder="City of Residence"
                                    onChange={this.handleChange}
                                />
                            </Box>
                            <Box
                                marginTop={2}
                            >
                                <TextField 
                                    id="confirmationEmailAddress"
                                    type="email"
                                    name="confirmationEmailAddress"
                                    placeholder="Confirm Email Address"
                                    onChange={this.handleChange}
                                />
                            </Box>
                            <Box
                                marginTop={2}
                            >
                                <button 
                                    id="stripe__button"
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </Box>
                    </form>
                    </React.Fragment> : (
                        <Box
                            color="darkWash"
                            shape="rounded"
                            padding={4}
                        >
                            <Heading
                                color="watermelon"
                                align="center"
                                size="xs"
                            >
                                Your Cart is Empty
                            </Heading>
                            <Text
                                align="center"
                                italic
                                color="green"
                            >
                                Add some brews!
                            </Text>
                        </Box>
                    )}
                </Box>
                <ToastMessage 
                    show={toast}
                    message={toastMessage}
                />
            </Container>
        )
    }
}

export default Checkout;