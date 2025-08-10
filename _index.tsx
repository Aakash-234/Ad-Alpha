import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const IndexPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <Helmet>
      <title>Instant Ad Creative Generator | Floot</title>
      <meta
        name="description"
        content="Generate instant, on-brand, high-performing ad creatives with our AI-powered platform."
      />
    </Helmet>
  );
};

export default IndexPage;