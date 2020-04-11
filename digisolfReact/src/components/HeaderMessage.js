import React, {useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Header, Message} from 'semantic-ui-react'
import {useTranslation} from "react-i18next";
import {removeMessage} from "../actions/headerMessage";

const HeaderMessage = () => {
    const positiveMessage = useSelector(state => state.headerMessageReducer.positiveMessage);
    const negativeMessage = useSelector(state => state.headerMessageReducer.negativeMessage);
    const delayedClose = useSelector(state => state.headerMessageReducer.delayedClose);

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const closeMessageTimeout = useRef(0);

    const displayMessage = () => {
        if (positiveMessage !== "") {
            return getMessage( true, false, positiveMessage)
        } else if (negativeMessage !== "") {
            return getMessage( false, true, negativeMessage)
        } else {
            return null;
        }
    };

    const getMessage = (positive, negative, text) => {
        clearTimeout(closeMessageTimeout.current);

        if (delayedClose !== null) {
            closeMessageTimeout.current = setTimeout(dismissMessage, delayedClose);
        }

        return (
            <Message className={"headerMessage"} positive={positive} negative={negative} onDismiss={dismissMessage}>
                <Message.Header>{text}</Message.Header>
            </Message>
        )
    };

    const dismissMessage = () => {
        dispatch(removeMessage());
    };

    return (
        displayMessage()
    );
};

export default HeaderMessage;