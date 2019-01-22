import React, { Component } from 'react';
import axios from 'axios';

export default class Create extends Component {

  constructor(props) {
    super(props);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeQuestion = this.onChangeQuestion.bind(this);
    this.onChangeAnswer = this.onChangeAnswer.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        category: '',
        question: '',
        answer:''
    }
  }

  onChangeCategory(event) {
    this.setState({
      category: event.target.value
    });
  }

  onChangeQuestion(event) {
    this.setState({
      question: event.target.value
    })
  }

  onChangeAnswer(event) {
    this.setState({
      answer: event.target.value
    })
  }

  onSubmit(event) {
    event.preventDefault();
    // console.log(`The values are ${this.state.category}, ${this.state.question}, and ${this.state.answer}`)
    const dataObject = {
      category: this.state.category,
      question: this.state.question,
      answer: this.state.answer
    };

    if(dataObject.category && dataObject.question && dataObject.answer){
      axios.post('http://localhost:3001/api/create', dataObject)
          // ES6 syntax
          .then(res => console.log(res))
          // regular syntax
          .catch(function(error) {
              console.log(error)
          });

      this.setState({
        category: '',
        question: '',
        answer: ''
      })
    } else {
      console.log('One or more of the input fields are blank.')
    }

  }

  render() {
      return (
        <div style={{marginTop: 10}}>
            <h3>Add New Question</h3>
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label>Category:  </label>
                    <input type="text" className="form-control" value={this.state.category} onChange={this.onChangeCategory}/>
                </div>
                <div className="form-group">
                    <label>Question: </label>
                    <textarea type="text" className="form-control" value={this.state.question} onChange={this.onChangeQuestion}/>
                </div>
                <div className="form-group">
                    <label>Answer: </label>
                    <textarea type="text" className="form-control" value={this.state.answer} onChange={this.onChangeAnswer}/>
                </div>
                <div className="form-group">
                    <input type="submit" value="Save Question" className="btn btn-primary"/>
                </div>
            </form>
        </div>
      )
  }
}