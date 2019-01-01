import React, { Component } from 'react';
import { Box, Button, Container, Heading, Modal, Spinner, Text, TextField } from 'gestalt';
import { CardElement, Elements, injectStripe, StripeProvider } from 'react-stripe-elements';
import ToastMessage from './ToastMessage';
import { withRouter } from 'react-router-dom';
import { getCart, calculatePrice, clearCart, calculateAmount } from '../utils';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends Component {

    state = {
        cartItems: [],
        address: '',
        city: '',
        postalCode: '',
        confirmationEmailAddress: '',
        toast: false,
        toastMessage: '',
        orderProcessing: false,
        modal: false
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
        
        this.setState({ modal: true });
    };

    handleSubmitOrder = async () => {
        const { cartItems, city, confirmationEmailAddress, address, postalCode } = this.state;

        const amount = calculateAmount(cartItems);
        this.setState({
            orderProcessing: true
        });
        let token;
        try {
            const response = await this.props.stripe.createToken();
            token = response.token.id;
            await strapi.createEntry('orders', {
                amount,
                brews: cartItems,
                city,
                postalCode,
                address, 
                token
            });
            await strapi.request('POST', '/email', {
                data: {
                    to: confirmationEmailAddress,
                    subject: `Order Confirmation – BrewHaha ${new Date(Date.now())}`,
                    text: `Your order has been processed`,
                    html: `<bold>Expect your order to arrive in 2-3 shipping days</bold>`
                }
            })
            this.setState({
                orderProcessing: false,
                modal: false
            });
            clearCart();
            this.showToast('Your order has been successfully submitted!', true);

        } catch (err) {
            this.setState({
                orderProcessing: false,
                modal: false
            });
            this.showToast(err.message);
        }
    }

    isFormEmpty = ({ address, city, postalCode, confirmationEmailAddress }) => {
        return !address || !city || !postalCode || !confirmationEmailAddress;
    };

    showToast = (toastMessage, redirect = false) => {
        this.setState({
            toast: true,
            toastMessage
        });
        setTimeout(() => this.setState({ 
            toast: false,
            toastMessage: '' 
        }, () => redirect && this.props.history.push('/')
        ), 5000);
    };

    closeModal = () => this.setState({
        modal: false
    });

    render() {
        const { toast, toastMessage, cartItems, modal, orderProcessing } = this.state;

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
                                <TextField 
                                    id="address"
                                    type="text"
                                    name="address"
                                    placeholder="Shipping Address"
                                    onChange={this.handleChange}
                                />
                            
                                <TextField 
                                    id="postalCode"
                                    type="text"
                                    name="postalCode"
                                    placeholder="Postal Code"
                                    onChange={this.handleChange}
                                />
                            
                                <TextField 
                                    id="city"
                                    type="text"
                                    name="City"
                                    placeholder="City of Residence"
                                    onChange={this.handleChange}
                                />
                            
                                <TextField 
                                    id="confirmationEmailAddress"
                                    type="email"
                                    name="confirmationEmailAddress"
                                    placeholder="Confirm Email Address"
                                    onChange={this.handleChange}
                                />
                            
                                <CardElement 
                                    id="stripe__input"
                                    onReady={input => input.focus()}
                                />
                                <button 
                                    id="stripe__button"
                                    type="submit"
                                >
                                    Submit
                                </button>
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
                            <Box
                                marginTop={2}
                            >
                                <Text
                                    align="center"
                                    italic
                                    color="green"
                                >
                                    Add some brews!
                                </Text>
                            </Box>
                        </Box>
                    )}
                </Box>
                {modal && (
                    <ConfirmationModal 
                        orderProcessing={orderProcessing}
                        cartItems={cartItems}
                        closeModal={this.closeModal}
                        handleSubmitOrder={this.handleSubmitOrder}
                    />
                )}
                <ToastMessage 
                    show={toast}
                    message={toastMessage}
                />
            </Container>
        )
    }
};

const ConfirmationModal = ({ orderProcessing, cartItems, closeModal, handleSubmitOrder }) => (
    <Modal
        accessibilityCloseLabel="close"
        accessibilityModalLabel="Confirm Your Order"
        heading="Confirm Your Order"
        onDismiss={closeModal}
        footer={
            <Box
                display="flex"
                marginRight={-1}
                marginLeft={-1}
                justifyContent="center"
            >
                <Box
                    padding={1}
                >
                    <Button 
                        size="lg"
                        color="red"
                        text="Submit"
                        disabled={orderProcessing}
                        onClick={handleSubmitOrder}
                    />
                </Box>
                <Box
                    padding={1}
                >
                    <Button 
                        size="lg"
                        text="Cancel"
                        disabled={orderProcessing}
                        onClick={closeModal}
                    />
                </Box>
            </Box>
        }
        role="alertdialog"
        size="sm"
    >
        {!orderProcessing && (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
                padding={2}
                color="lightWash"
            >
                {cartItems.map(item => (
                    <Box 
                        key={item._id}
                        padding={1}
                    >
                        <Text
                            color="red"
                            size="lg"
                        >
                            {item.name} x {item.quantity} – ${item.quantity * item.price}
                        </Text>
                    </Box>
                ))}
                <Box paddingY={2} >
                    <Text size="lg" bold>
                        Total: {calculatePrice(cartItems)}
                    </Text>
                </Box>
            </Box>
        )}

        <Spinner 
            show={orderProcessing}
            accessibilityLabel="Order Processing Spinner"
        />
        {orderProcessing && <Text 
            align="center"
            italic
        >
            Submitting Order...
        </Text>}
    </Modal>
);

const publishKey = require('../config/keys').publishableKey;

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
    <StripeProvider
        apiKey={publishKey}
    >
        <Elements>
            <CheckoutForm />
        </Elements>
    </StripeProvider>
)

export default Checkout;