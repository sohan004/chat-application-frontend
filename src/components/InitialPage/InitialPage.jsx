import React from 'react';
import { AiOutlineMessage } from 'react-icons/ai';

const InitialPage = () => {
    return (
        <div className="h-screen flex justify-center text-center items-center">
            <div>
                <AiOutlineMessage className="text-6xl text-blue-500 mx-auto"></AiOutlineMessage>
                <h1 className="text-3xl font-bold my-2">Messages</h1>
                
               <p className='opacity-90'> Messages is a feature that helps you converse with applicants and landlords. Let’s send your first message.</p>
            </div>
        </div>
    );
};

export default InitialPage;