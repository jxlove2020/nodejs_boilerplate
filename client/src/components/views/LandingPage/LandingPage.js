import React, { useEffect } from 'react';
import axios from 'axios';

function LandingPage(props) {
  useEffect(() => {
    // 서버가 사이트 및 포트가 달라 CORS 에러 발생
    axios.get('/api/hello').then(response => {
      console.log(response.data);
    });
  }, []);

  const onClickHandler = () => {
    axios.get('/api/users/logout').then(response => {
      if (response.data.success) {
        props.history.push('/login');
      } else {
        alert('로그아웃하는데 실패했습니다.');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <h2>시작페이지</h2>
      <br />
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;
