// Imports
import React, { useState, useEffect } from "react";

import "./Thumbnail.scss";

/**
 * Show a thumbnail for the uploaded file
 * @param {Object} thumbnail
 * @returns ImgHTMLElement
 */
const Thumbnail = ({ thumbnail }) => {
    const [loading, setLoading] = useState(false);
    const [thumb, setThumb] = useState(undefined);

    useEffect(() => {
        if (!thumbnail) return;

        setLoading(true);

        let reader = new FileReader();
        reader.onloadend = () => {
            setLoading(false);
            setThumb(reader.result);
        };
        reader.readAsDataURL(thumbnail);
    }, [thumbnail]);

    if (!thumbnail) return null;

    if (loading) return <p>loading...</p>;

    return (
        <img
            src={thumb}
            alt={thumbnail.name}
            className="upload-thumbnail"
            height={200}
            width={200}
        />
    );
};

export default Thumbnail;
