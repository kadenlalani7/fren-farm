// ProfileImage.js

import React from 'react';

function ProfileImage({ src }) {
    return (
        <img
            src={src}
            alt="Twitter Profile"
            className="max-h-20 w-auto"
        />
    );
}

export default ProfileImage;
