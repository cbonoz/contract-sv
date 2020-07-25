import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import quorum from '../assets/quorum.png'

const Footer = createReactClass({
    render() {
        return (
            <div>
                <p className="centered footer footer-text">Powered by
                    <span className="neo-green">
                        <img src={quorum} className="quorum-logo"/>
                    </span>
                    </p>
            </div>
        );
    }
});

export default Footer;

