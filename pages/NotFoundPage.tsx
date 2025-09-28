
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-9xl font-extrabold text-primary tracking-widest">404</h1>
      <div className="bg-neutral text-white px-2 text-sm rounded rotate-12 absolute" style={{top: '40%', left: '50%', transform: 'translate(-50%, -50%) rotate(12deg)'}}>
        Page Not Found
      </div>
      <p className="text-2xl md:text-3xl font-light text-gray-600 mt-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
