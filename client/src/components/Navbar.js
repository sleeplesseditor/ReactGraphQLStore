import React from 'react';
import { Box, Heading, Image } from 'gestalt';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
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

export default Navbar;
