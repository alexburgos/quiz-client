import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Question.css';
import { getOptions } from '../utils';

function submitAnswer( questionId, answer , setAnsweredQuestions) {
  console.log(questionId, answer);
  fetch(`https://futu-quiz-api.now.sh/answer/${questionId}`, getOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.status);
    })
    .then(data => {
      let correctAnswer;

      //normalize answer input with answer from the server
      if (data.answer.toLowerCase() === answer.toLowerCase()) {
        console.log('Correct!');
        correctAnswer = true;
      } else {
        console.log('Womp Womp!');
        correctAnswer = false;
      }
      setAnsweredQuestions(questionId, correctAnswer)
    })
    .catch((err) => {
      alert('Error fetching questions')
      console.error(err);
    });
}

const Question = props => {
  let {
    questionId,
    questionText,
    choices,
    setAnsweredQuestions
  } = props;

  const [inputState, setInputState] = useState('');

  return (
    <div className="Question">
      <h2 className="Question-text">{questionText}</h2>
      {choices ?
        <ul className="Question-choices">
          {choices.map((choice, i) => <li key={i} onClick={() => submitAnswer(questionId, choice, setAnsweredQuestions) }>{choice}</li>)}
        </ul>
        :
        <div className="Question-input">
          <input type="text" value={inputState} placeholder="What is your answer?" onChange={(e) => setInputState(e.target.value)} />
          <button onClick={inputState.length > 0 ? () => submitAnswer(questionId, inputState, setAnsweredQuestions) : null } disabled={inputState.length === 0 ? true : false}>Submit Answer</button>
        </div>
      }
    </div>
  );
};

Question.propTypes = {
  questionId: PropTypes.number,
  questionText: PropTypes.string,
  choices: PropTypes.array,
  setAnsweredQuestions: PropTypes.func
};

export default Question;