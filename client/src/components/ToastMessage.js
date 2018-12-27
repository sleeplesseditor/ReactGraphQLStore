import React from 'react';
import { Box, Toast } from 'gestalt';

const ToastMessage = ({ show, message }) => (
    show && (
        <Box
            dangerouslySetInlineStyle={{
                __style: {
                    top: 425,
                    left: "50%",
                    transform: "translateX(-50%)"
                }
            }}
            position="fixed"
        >
            <Toast 
                color="red"
                text={message}
            />
        </Box>
    )
)

export default ToastMessage;