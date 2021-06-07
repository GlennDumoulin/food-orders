// Imports
import React, { useState, useEffect } from "react";

// Show a thumbnail for the uploaded file
const Thumbnail = ({ thumbnail }) => {
    // Defining states
    const [loading, setLoading] = useState(false);
    const [thumb, setThumb] = useState(undefined);

    // Set thumbnail preview if file is uploaded
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
