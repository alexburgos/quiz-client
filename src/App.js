import React, { Component } from 'react';
import './App.css';
import './Animation.css';
import Question from './components/Question';
import { getOptions } from './utils';

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
    };

    this.timer =  null;
  }

  componentDidMount() {
    this.getQuestions();
    this.setCounter();
  }

  setCounter = () => {
    let count = 10;
    this.timer = setInterval(() => {
      count--;
      if (count === 0) {
        this.stopInterval();
      }
    }, 1000);
  }

  stopInterval = () => {
    clearInterval(this.timer);
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
        this.setState({
          questions: data,
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
      answeredQuestionIds
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
    }, this.showNextQuestion);
  }

  render() {
    let {
      currentQuestion,
      isLoadingQuestions,
      answeredQuestionIds,
      correctAnswers,
      originalQuestionLength
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Totally Random Trivia</h1>
        </header>

        {!isLoadingQuestions && currentQuestion &&
          <Question 
            choices={currentQuestion.choices} 
            questionId={currentQuestion.id} 
            questionText={currentQuestion.question}
            setAnsweredQuestions={this.setAnsweredQuestions}
          />
        }
        {isLoadingQuestions &&
          <div className="App-loading">
            <div className="ripple"><div></div><div></div></div>
          </div>
        }

        {!isLoadingQuestions && answeredQuestionIds.length >= originalQuestionLength &&
          <div className="App-results">
            <p>You made it to the end!</p>
            <p>You had {correctAnswers} correct answer{correctAnswers.length > 1 ? 's' : ''}.</p>
            <button onClick={() => window.location.reload() }>Play Again</button>
          </div>
        }
      </div>
    );
  }
}

App.propTypes = {};

export default App;
