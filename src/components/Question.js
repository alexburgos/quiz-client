import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import './Question.css';
import { getOptions } from '../utils';

const Question = props => {
  let {
    questionId,
    questionText,
    choices,
    setAnsweredQuestions
  } = props;

  const [answer, saveAnswer] = useState({ questionId: questionId, text: '' });
  const [inputState, setInputState] = useState('');

  // useEffect(() => {
  //   console.log(`You chose `, answer);
  //   if (answer.questionId && answer.choice.length > 0) {
  //     console.log(`You chose `, answer);
  //     sendAnswer(answer);
  //   }
  // });

  useEffect(() =>    
    async () => {
      console.log(answer);
      if (answer.text && answer.text.length > 0) {
        const res = await fetch(`https://futu-quiz-api.now.sh/answer/${questionId}`, getOptions);
        const json = await res.json();
        let answeredQuestionIds = [];
        let correctAnswer;

        //normalize answer input with answer from the server
        if (json.answer.toLowerCase() === answer.text.toLowerCase()) {
          console.log('Correct!');
          correctAnswer = true;
        } else {
          console.log('Womp Womp!');
          correctAnswer = false;
        }

        answeredQuestionIds.push(questionId);
        setAnsweredQuestions(questionId, correctAnswer);
      }

    }, [answer, questionId, setAnsweredQuestions]
  );

  console.log(inputState);

  return (
    <div className="Question">
      <h2 className="Question-text">{questionText}</h2>
      {choices &&
        <Fragment>
          <ul className="Question-choices">
            {choices.map((choice, i) => <li key={i} onClick={() => saveAnswer({ questionId, text: choice })}>{choice}</li>)}
          </ul>
          {/* {answer && <span>You chose: {answer}</span> } */}
        </Fragment>
      }
      {!choices &&
        <div className="Question-input">
          <input type="text" value={inputState} placeholder="What is your answer?" onChange={(e) => setInputState(e.target.value)} />
          <button onClick={() => saveAnswer({ questionId, text: inputState })}>Submit Answer</button>
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