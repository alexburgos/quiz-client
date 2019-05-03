import React, { Component } from 'react';
import './App.css';
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
  }

  componentDidMount() {
    this.getQuestions();
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
    let { questions } = this.state;
    if (questions.length === 0) {
      this.setState({ currentQuestion: null })
      return;
    }

    let randomNum = Math.floor(Math.random() * questions.length);
    this.setState({ 
      currentQuestion: questions[randomNum]
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
      isLoadingQuestions: false
    }, this.randomizeQuestion);
  }

  // handleChosenAnswer = ({ questionId, choice }) => {
  //   fetch(`https://futu-quiz-api.now.sh/answer/${questionId}`, getOptions)
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json();
  //       }
  //       throw new Error(response.status);
  //     })
  //     .then(data => {
  //       let { answer } = data;
  //       let { correctAnswers } = this.state;
  //       let answeredQuestionIds = [];
        
  //       //normalize answer input with answer from the server
  //       if (answer.toLowerCase() === choice.toLowerCase()) {
  //         console.log('Correct!');
  //         answeredQuestionIds.push(questionId);
  //         this.setState({ correctAnswers: correctAnswers + 1 });
  //       }

  //       this.setState({
  //         answeredQuestionIds: answeredQuestionIds
  //       }, this.showNextQuestion);
  //     })
  //     .catch((err) => {
  //       alert('Error fetching questions')
  //       console.error(err);
  //     });
  // }

  setAnsweredQuestions = (questionId, correct) => {
    let { correctAnswers } = this.state;
    let answered = [...this.state.answeredQuestionIds];

    answered.push(questionId);

    console.log(answered);

    this.setState({
      answeredQuestionIds: answered,
      correctAnswers: correct ? correctAnswers + 1 : correctAnswers,
      isLoadingQuestions: true,
    }, this.showNextQuestion);
  }

  render() {
    let {
      questions,
      currentQuestion,
      isLoadingQuestions,
      answeredQuestionIds,
      correctAnswers,
      originalQuestionLength
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Futurice's Totally Random Trivia</h1>
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
            <span>Loading Questions...</span>
            <span className="App-loading-icon">&#9881;</span>
          </div>
        }
        {!isLoadingQuestions && questions.length === 0 && answeredQuestionIds.length >= originalQuestionLength &&
          <div className="App-results">
            <p>Congrats on finishing the quiz! You had {correctAnswers} correct answers.</p>
            <button onClick={() => window.location.reload() }>Want to try again?</button>
          </div>
        }
      </div>
    );
  }
}

App.propTypes = {};

export default App;
