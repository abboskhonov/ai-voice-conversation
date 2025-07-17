'use client'
import { useEffect } from 'react';

const DidAgent = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://agent.d-id.com/v2/index.js';
    script.setAttribute('data-mode', 'full');
    script.setAttribute(
      'data-client-key',
      'YmVya2lubzIwOTlAZ21haWwuY29t:1bfnSmnKKZF4r0me_iU3Q'
    );
    script.setAttribute('data-agent-id', 'v2_agt_ExU04XiD');
    script.setAttribute('data-name', 'did-agent');
    script.setAttribute('data-monitor', 'true');
    script.setAttribute('data-target-id', 'd-id-container');

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="d-id-container"
      style={{
        width: '400px',
        height: '600px',
        margin: 'auto',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    />
  );
};

export default DidAgent;
