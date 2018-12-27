import React, { Component } from 'react';
import { Box, Container, Heading, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';

class Checkout extends Component {

    state = {
        address: '',
        city: '',
        postalCode: '',
        confirmationEmailAddress: '',
        toast: false,
        toastMessage: '',
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
        const { toast, toastMessage } = this.state;

        return (
            <Container>
                <Box
                    color="darkWash"
                    margin={4}
                    padding={4}
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                >
                    <form 
                        style={{
                            display: 'inlineBlock',
                            textAlign: 'center',
                            maxWidth: 450
                        }}
                        onSubmit={this.handleConfirmOrder}
                    >
                            <Heading
                                color="midnight"
                            >
                                Checkout
                            </Heading>
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