import PropTypes from 'prop-types'; // ES6
import React from "react";

export const Preview = (props) => {
    return (
        <div className={'preview'}>
            <div>
                <p>Original:</p>
                {props.original ?
                    <img className={'real'} src={props.original}/> : null}
            </div>
            <div>
                <p>Transformed:</p>
                {props.transformed ?
                    <img className={'transformed'} src={props.transformed}/> : null}
            </div>
        </div>
    )
}

Preview.propTypes = {
    original: PropTypes.string,
    transformed: PropTypes.string,
};