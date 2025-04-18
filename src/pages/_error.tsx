import ErrorBoundary from '../components/ErrorBoundary';
import React from 'react';

function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>
        {statusCode
          ? `An error ${statusCode} occurred`
          : 'An error occurred'}
      </h1>
      <p>
        {statusCode === 404
          ? 'The page you requested was not found'
          : 'Please try again later'}
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;