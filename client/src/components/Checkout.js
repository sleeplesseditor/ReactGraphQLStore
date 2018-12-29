import React, { Component } from 'react';
import { Box, Button, Container, Heading, Modal, Spinner, Text, TextField } from 'gestalt';
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
)

export default Checkout;