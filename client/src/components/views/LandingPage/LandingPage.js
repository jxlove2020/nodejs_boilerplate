import React, { useEffect } from 'react';
import axios from 'axios';

function LandingPage() {
  useEffect(() => {
    // 서버가 사이트 및 포트가 달라 CORS 에러 발생
    axios.get('/api/hello').then(response => {
      console.log(response.data);
    });
  }, []);
  return <div>LandingPage</div>;
}

export default LandingPage;
