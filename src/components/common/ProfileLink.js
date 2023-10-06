import React from 'react';

function ProfileLink({ name, username }) {
    return (
        <div className="w-1/2 flex flex-col justify-center items-left pl-2">
            <h3 className="text-[12px]">{name}</h3>
            <a
                href={`https://twitter.com/${username}`}
                className="text-[8px] text-gray-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
            >
                @{username}
            </a>
        </div>
    );
}

export default ProfileLink;
