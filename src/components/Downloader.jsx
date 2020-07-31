import PropTypes from 'prop-types'; // ES6
import React from "react";

export const Downloader = (props) => {

    const downloadImage = () => {
        const a = document.createElement("a");
        a.href = props.transformedImageUrl;
        a.download = props.transformedImageUrl.substr(props.transformedImageUrl.lastIndexOf('/'));
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <button type={'button'} onClick={downloadImage}
                disabled={!props.transformedImageUrl}>Download
        </button>
    )
}

Downloader.propTypes = {
    transformedImageUrl: PropTypes.string,
};