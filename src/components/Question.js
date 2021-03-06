import React, { Fragment, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Question.css';
import '../Animation.css';
import { getOptions } from '../utils';

/**
 * Save old props for useEffect comparison
 */
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function submitAnswer(questionId, answer, setAnsweredQuestions) {
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
        correctAnswer = true;
      } else {
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
  const [loadingNextQuestion, setLoadingQuestion] = useState(false);
  const prevQuestionId = usePrevious(questionId);

  useEffect(() => {
    if (prevQuestionId !== questionId) {
      setLoadingQuestion(false);
      setInputState('');
    }
  }, [prevQuestionId, questionId]);

  return (
    <div className="Question">
      {
        loadingNextQuestion ? 
          <div className="Question-loading">
            <div className="ripple"><div></div><div></div></div>
          </div>
          :
          <Fragment>
            <h2 className="Question-text">{questionText}</h2>
            {choices ?
              <ul className="Question-choices">
                {choices.map((choice, i) => {
                    return (
                      <li key={i} onClick={() => { submitAnswer(questionId, choice, setAnsweredQuestions); setLoadingQuestion(true); }}>{choice}</li>
                    );
                  })}
              </ul>
              :
              <div className="Question-input">
                <input type="text" value={inputState} placeholder="What is your answer?" onChange={(e) => setInputState(e.target.value)} />
                <button onClick={() => { submitAnswer(questionId, inputState, setAnsweredQuestions); setLoadingQuestion(true); }} disabled={inputState.length === 0 ? true : false}>Submit</button>
              </div>
            }
          </Fragment>
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