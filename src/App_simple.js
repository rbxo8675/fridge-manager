import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div className="app-container">
        <h1 className="app-title">
          냉장고 관리 시스템 v4.0.0 (React)
        </h1>
        <p>테스트 카운터: {count}</p>
        <button className="btn btn-primary" onClick={() => setCount(count + 1)}>
          증가
        </button>
      </div>
    </div>
  );
}

export default App;
