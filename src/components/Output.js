import React from 'react';

const Output = ({ data, loading, error }) => {
  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>오류가 발생했습니다: {error}</p>;
  }

  return (
    <div>
      <h2>결과</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Output;
