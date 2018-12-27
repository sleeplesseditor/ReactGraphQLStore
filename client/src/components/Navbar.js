import React, { Component } from 'react';
import { Box, Button, Heading, Image } from 'gestalt';
import { clearCart, clearToken, getToken } from '../utils';
import { NavLink, withRouter } from 'react-router-dom';

class Navbar extends Component {
    handleSignOut = () => {
        clearCart();
        clearToken();
        this.props.history.push('/');
    }

    render() {
        return getToken() !== null ? <AuthNav handleSignOut={this.handleSignOut} /> : <UnAuthNav />;
    }
}

const AuthNav = ({ handleSignOut }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="around"
            height={70}
            color="midnight"
            padding={1}
            shape="roundedBottom"
        >
            <NavLink 
                activeClassName="active"
                className="navbar_link"
                to="/checkout"
            >
                    Checkout
            </NavLink>

            <NavLink 
                exact
                to="/"
            >
                <Box
                    display="flex"
                    alignItems="center"
                    margin={2}
                >
                    <Box
                        height={50}
                        width={50}
                    >
                        <Image 
                            alt="Brewhaha Logo"
                            naturalHeight={1}
                            naturalWidth={1}
                            src="./icons/logo.svg"
                        />
                    </Box>
                    <Heading
                        size="xs"
                        color="orange"
                    >
                        BrewHaha
                    </Heading>
                </Box>
            </NavLink>
            <Button 
                onClick={handleSignOut}
                color="red"
                text="Sign Out"
                inline
                size="md"

            />
        </Box>
    )
}

const UnAuthNav = () => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="around"
            height={70}
            color="midnight"
            padding={1}
            shape="roundedBottom"
        >
            <NavLink 
                activeClassName="active"
                className="navbar_link"
                to="/signin"
            >
                    Sign In
            </NavLink>

            <NavLink 
                exact
                to="/"
            >
                <Box
                    display="flex"
                    alignItems="center"
                    margin={2}
                >
                    <Box
                        height={50}
                        width={50}
                    >
                        <Image 
                            alt="Brewhaha Logo"
                            naturalHeight={1}
                            naturalWidth={1}
                            src="./icons/logo.svg"
                        />
                    </Box>
                    <Heading
                        size="xs"
                        color="orange"
                    >
                        BrewHaha
                    </Heading>
                </Box>
            </NavLink>

            <NavLink 
                activeClassName="active"
                className="navbar_link"
                to="/signup"
            >
                    Sign Up
            </NavLink>
        </Box>
    )
}

export default withRouter(Navbar);
