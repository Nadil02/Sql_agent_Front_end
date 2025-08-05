import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/chatbot', {
        query: question.trim()
      });

      setAnswer(response.data.answer || response.data.response || 'No answer received');
    } catch (err) {
      console.error('Error:', err);
      if (err.code === 'ERR_NETWORK') {
        setAnswer('error: not connect to backend');
      } else if (err.response) {
        setAnswer(`Error: Server responded with status ${err.response.status}: ${err.response.data?.detail || err.response.statusText}`);
      } else {
        setAnswer(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question here..."
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
        
        <div className="form-group">
          <label htmlFor="answer">Answer:</label>
          <textarea
            id="answer"
            value={answer}
            readOnly
            placeholder="Answer will appear here..."
          />
        </div>
      </form>
    </div>
  );
}

export default App;
