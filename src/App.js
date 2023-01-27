import React, { useState } from 'react';
import { Configuration, OpenAIApi } from "openai";
import { CSSTransition } from 'react-transition-group';
import './App.css';
import './fonts/Jura.ttf';




const AnimatedTitle = () => {
  const [text, setText] = useState("");
  const [showDash, setShowDash] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const [selectedBusiness, setSelectedBusiness] = useState('web3');

  const handleSelectionChange = (event) => {
    setSelectedBusiness(event.target.value);
  }
  
  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const configuration = new Configuration({
        apiKey: 'OPENAI_API_KEY', //replace with your API key or use a .env file for that
      });
      const openai = new OpenAIApi(configuration);
  
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give a concrete and specific business idea on the field of ${selectedBusiness}. Never speak as if it was your idea. Start with the title of the idea but don't explain it is the title. Also, separate the title from the description with a period.`,
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const newText = response.data.choices[0].text;
      let i = 0;
      const interval = setInterval(() => {
        setText(newText.substring(0, i));
        i++;
        if (i > newText.length) {
          clearInterval(interval);
        }
      }, 50);
      setShowDash(true);
      setTimeout(() => {
        setShowDash(false);
      }, 500);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }

  return (
    <main>
        <h1 className="title">
            AI Business Ideas Generator
          </h1>
          
      <div className='text-container'>
      {!isLoading && !error &&
          <CSSTransition
            in={showDash}
            timeout={500}
            classNames="dash"
          >
            <div className="dash">-</div>
          </CSSTransition>
        }
        {!isLoading && !error &&
          <h2 className="title">
            {text}
          </h2>
        }
        <select className='selector' onChange={handleSelectionChange}>
          <option value="Web3">Web3</option>
          <option value="AI">AI</option>
          <option value="Finance">Finance</option>
          <option value="DeFi">DeFi</option>
        </select>
        <button className='button' onClick={fetchData}>Generate Business Idea</button>
        {isLoading && <h2>Loading...</h2>}
        {error && <h2>{error}</h2>}
      </div>
      

    </main>
    
  );
};

export default AnimatedTitle;
