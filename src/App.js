import React, { Component, Fragment } from 'react';
import './App.css';
import './Animation.css';
import Question from './components/Question';
import { getOptions, shuffleArray } from './utils';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      currentQuestion: null,
      isLoadingQuestions: true,
      correctAnswers: 0,
      originalQuestionLength: 0,
      answeredQuestionIds: [],
      showIfCorrect: { show: false, correct: false },
    };
  }

  componentDidMount() {
    this.getQuestions();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentQuestion && this.state.currentQuestion) {
      if(prevState.currentQuestion.id !== this.state.currentQuestion.id) {
        setTimeout(() => this.setState({ showIfCorrect: { ...this.state.showIfCorrect, show: false } }), 1500);
      }
    }
  }
  
  getQuestions = () => {
    fetch(`https://futu-quiz-api.now.sh/questions`, getOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.status);
      })
      .then(data => {
        // Randomize choices in questions if present
        let randomQuestions = data.map( (question) => {
          if (question.choices) {
            shuffleArray(question.choices);
          }
          return question;
        })
        this.setState({
          questions: randomQuestions,
          isLoadingQuestions: false,
          originalQuestionLength: data.length
        }, this.randomizeQuestion);
      })
      .catch((err) => {
        alert('Error fetching questions')
        console.error(err);
      });
  };

  randomizeQuestion = () => {
    let { 
      questions
    } = this.state;

    if (questions.length === 0) {
      this.setState({ 
        currentQuestion: null,
      })
      return;
    }

    const randomNum = Math.floor(Math.random() * questions.length);
    this.setState({ 
      currentQuestion: questions[randomNum],
    });
  }

  showNextQuestion = () => {
    let {
      questions,
      answeredQuestionIds,
    } = this.state;

    let unansweredQuestions = questions.filter( question => !answeredQuestionIds.includes(question.id))
    this.setState({
      questions: unansweredQuestions,
    }, this.randomizeQuestion);
  }

  setAnsweredQuestions = (questionId, correct) => {
    let { correctAnswers } = this.state;
    let answered = [...this.state.answeredQuestionIds];

    answered.push(questionId);

    this.setState({
      answeredQuestionIds: answered,
      correctAnswers: correct ? correctAnswers + 1 : correctAnswers,
      showIfCorrect: { ...this.state.showIfCorrect, show: true, correct: correct }
    }, this.showNextQuestion);
  }


  render() {
    const {
      currentQuestion,
      isLoadingQuestions,
      answeredQuestionIds,
      correctAnswers,
      originalQuestionLength,
      showIfCorrect,
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Totally Random Trivia</h1>
        </header>

        {!isLoadingQuestions && currentQuestion && answeredQuestionIds.length < originalQuestionLength &&
          <Fragment>
            <Question
              choices={currentQuestion.choices}
              questionId={currentQuestion.id}
              questionText={currentQuestion.question}
              setAnsweredQuestions={this.setAnsweredQuestions}
            />
          </Fragment>
        }
        {isLoadingQuestions &&
          <div className="App-loading">
            <div className="ripple"><div></div><div></div></div>
          </div>
        }

        {!isLoadingQuestions && answeredQuestionIds.length >= originalQuestionLength &&
          <div className="App-results">
            <p>You made it to the end!</p>
            <p>Correct answers: {correctAnswers}.</p>
            <button onClick={() => window.location.reload() }>Play Again</button>
          </div>
        }

        {answeredQuestionIds.length < originalQuestionLength &&
          <p className={`App-answer ${showIfCorrect.show ? "show" : ""} ${showIfCorrect.correct ? "correct" : "incorrect"}`}>Your answer was {showIfCorrect.correct ? 'Correct' : 'Incorrect'}.</p>
        }
      </div>
    );
  }
}

App.propTypes = {};

export default App;
