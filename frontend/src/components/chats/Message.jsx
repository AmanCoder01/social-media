import React from "react";

const Message = ({ ownMessage, message }) => {
    return (
        <div className={`mb-2 ${ownMessage ? "text-right" : "text-left"}`}>
            <span
                className={`inline-block p-2 rounded-lg ${ownMessage ? "bg-green-500" : "bg-gray-300 text-black"
                    }`}
            >
                {message}
            </span>
        </div>
    );
};

export default Message;