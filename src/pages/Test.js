import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ConfirmUserCredentials from '../helpers/ConfirmUserCredentials.js';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  Button,
  Grid,
  Paper,
  Hidden,
  CircularProgress,
  Link,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import HelpOutline from '@material-ui/icons/HelpOutline';

export default class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parentQuestionDataReceived: false,
      parentQuestionAsked: [],
      subQuestionsAsked: [],
      subQuestionAskingNow: [],
      subQuestionsToAsk: [],
      subQuestionsNumber: '',
      categoriesReceived: false,
      // adminCategories: [],
      categories: [],
      // userCategoriesDataReceived: false,
      // userCategories: [],
      testCategoryId: '',
      testCategoryName: '',
      auth0_id: '',
      subAnswerDisplayed: false,
      showAnswerButtonDisplayed: true,
    };
  }

  componentDidMount = () => {
    const { auth } = this.props;
    // this.getCategories();
    ConfirmUserCredentials(auth, this.setAuth0Id, this.getCategories);
  };

  setAuth0Id = (id) => {
    this.setState({ auth0_id: id });
  };

  getCategories = (auth0Id) => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/categories?`, { params: { auth0Id: auth0Id } })
      .then((res) => {
        console.log('res data', res.data);
        if (res.data.length > 0) {
          this.setState({
            categories: res.data,
            categoriesReceived: true,
          });
        } else {
          this.setState({
            categoriesReceived: true,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  getQuestion = () => {
    const { testCategoryId } = this.state;
    axios
      .get(`${process.env.REACT_APP_API_URI}/question/test/${testCategoryId}`)
      .then((res) => {
        if (res.data.length === 0) {
          this.setState({
            parentQuestionDataReceived: true,
            parentQuestionAsked: [],
          });
        } else {
          const parentQuestion = res.data._id;
          const firstSubQuestion = res.data.questions[0];
          const subsequentSubQuestions = res.data.questions.slice(1);
          const subQuestionsNumber = res.data.questions.length;
          this.setState({
            parentQuestionDataReceived: true,
            parentQuestionAsked: [parentQuestion],
            subQuestionAskingNow: [firstSubQuestion],
            subQuestionsToAsk: subsequentSubQuestions,
            subQuestionsAsked: [],
            subQuestionsNumber: subQuestionsNumber,
            subAnswerDisplayed: false,
            showAnswerButtonDisplayed: true,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  setCategory = (event) => {
    this.setState(
      {
        testCategoryId: event.target.getAttribute('categoryid'),
        testCategoryName: event.target.getAttribute('categoryname'),
      },
      () => {
        this.getQuestion();
      }
    );
  };

  resetCategory = () => {
    this.setState({
      testCategoryId: '',
      testCategoryName: '',
      subQuestionsToAsk: [],
      subQuestionsAsked: [],
      subQuestionAskingNow: [],
      parentQuestionDataReceived: false,
      parentQuestionAsked: [],
    });
  };

  renderHeader = () => {
    const { testCategoryId, testCategoryName, categoriesReceived, categories } = this.state;
    console.log('categoriesReceived', categoriesReceived);
    console.log('categories', categories);

    if (testCategoryId === undefined || testCategoryId === '') {
      return (
        <>
          <h1 className='center-align'>Choose a category to test</h1>

          {!categoriesReceived && (
            <div className='test-spinner'>
              <CircularProgress />
            </div>
          )}

          {categoriesReceived && categories.length < 1 && (
            <div className='center-align'>
              <p>You haven't created any categories yet.</p>
              <p>Click on Add Questions to create a new category and add a question.</p>
              <p>Alternatively, logout to use the system generated questions.</p>
            </div>
          )}

          {categories.length > 0 && (
            <Grid container direction='row' alignItems='flex-start' justify='center' spacing={40}>
              {categories.map((category) => (
                <Grid item lg={3} md={3} sm={6} xs={12} key={category._id}>
                  <Paper
                    className='test-category-paper'
                    onClick={this.setCategory}
                    categoryid={category._id}
                    categoryname={category.name}
                  >
                    <h6
                      className='test-paper-headings test-move-under'
                      categoryid={category._id}
                      categoryname={category.name}
                    >
                      {category.name}
                    </h6>
                    <img
                      className='test-move-under'
                      src={process.env.PUBLIC_URL + `/images/${category.image}.png`}
                      width='80'
                      height='80'
                      alt={category.image_alt}
                      categoryid={category._id}
                      categoryname={category.name}
                    />
                    <p
                      className='test-paper-paragraph'
                      categoryid={category._id}
                      categoryname={category.name}
                    >
                      System Generated
                    </p>
                    <Tooltip
                      classes={{
                        tooltip: 'test-tooltip',
                        popper: 'test-tooltip-popper',
                      }}
                      title={
                        <>
                          <p className='test-tooltip-p'>
                            System generated categories are created by the software provider.{' '}
                          </p>
                          <p className='test-tooltip-p'>
                            The category name and it's associated questions cannot be edited.
                          </p>
                        </>
                      }
                      aria-label='Add'
                    >
                      <HelpOutline className='test-helpOutlineIcon' />
                    </Tooltip>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      );
    } else {
      return (
        <div className='test-header'>
          <Grid container direction='row' alignItems='flex-start' justify='center' spacing={40}>
            <Grid item lg={6} className='test-in-progress-text-container'>
              <Hidden xsDown>
                <h1 className='center-align test-in-progress-heading'>Test in progress...</h1>
              </Hidden>
              <h6 className='test-sub-heading center-align'>
                Category being tested: <span className='word-highlight'>{testCategoryName}</span>
              </h6>
              <button onClick={this.resetCategory} className='test-change-categories-button'>
                Change Category
              </button>
            </Grid>
          </Grid>
        </div>
      );
    }
  };

  flipCard = () => {
    setTimeout(() => {
      document.querySelector('#question-card').classList.toggle('flip');
    }, 100);
  };

  revealAnswer = () => {
    this.setState({
      subAnswerDisplayed: true,
      showAnswerButtonDisplayed: false,
    });
  };

  renderNewQuestion = () => {
    const { subQuestionsToAsk, subQuestionsAsked } = this.state;

    if (subQuestionsToAsk === undefined || subQuestionsToAsk.length === 0) {
      this.setState(
        {
          parentQuestionDataReceived: false,
          subQuestionAskingNow: [],
        },
        this.getQuestion()
      );
    } else {
      const nextSubQuestion = [subQuestionsToAsk[0]];
      const updateSubQuestionsAsked = subQuestionsAsked.concat(this.state.subQuestionAskingNow);
      const updateSubQuestionsToAsk = subQuestionsToAsk.splice(1);

      this.setState({
        subQuestionAskingNow: nextSubQuestion,
        subQuestionsAsked: updateSubQuestionsAsked,
        subQuestionsToAsk: updateSubQuestionsToAsk,
        subAnswerDisplayed: false,
        showAnswerButtonDisplayed: true,
      });

      const subQuestionContainer = document.querySelector('#back-of-card');
      const coordinates = subQuestionContainer.getBoundingClientRect();
      console.log(coordinates, subQuestionContainer);

      // Timeout required because otherwise scrollTo does work - element is not present in DOM until a short delay due to React rendering
      setTimeout(function () {
        window.scrollTo({
          top: coordinates.height,
          left: 0,
          behavior: 'smooth',
        });
      }, 300);
    }
  };

  // This code is required if you want to change the skip action to skipping all sub questions at once
  // skipQuestion = () => {
  //   this.setState({
  //     parentQuestionDataReceived: false,
  //     parentQuestionAsked: [],
  //     subQuestionsAsked: [],
  //     subQuestionAskingNow: [],
  //     subQuestionsToAsk: [],
  //     subQuestionsNumber: '',
  //     subAnswerDisplayed: false,
  //     showAnswerButtonDisplayed: true,
  //   },this.getQuestion());
  // }

  renderSpinner = () => {
    const { parentQuestionDataReceived, parentQuestionAsked, testCategoryId } = this.state;

    if (testCategoryId === '') {
      return null;
    } else if (parentQuestionDataReceived === false) {
      return (
        <div className='test-spinner'>
          <CircularProgress />
        </div>
      );
    } else if (parentQuestionDataReceived === true && parentQuestionAsked.length === 0) {
      return (
        <p className='test-no-questions'>
          You haven't added any questions for this category yet.{' '}
          <Link component={RouterLink} to='/question/create' className='link'>
            Add some now
          </Link>
        </p>
      );
    }
  };

  renderQuestionAsked = () => {
    const {
      parentQuestionAsked,
      subQuestionAskingNow,
      subQuestionsAsked,
      subQuestionsToAsk,
      subQuestionsNumber,
      showAnswerButtonDisplayed,
      subAnswerDisplayed,
      auth0_id,
    } = this.state;

    if (subQuestionAskingNow.length === 0 || subQuestionAskingNow === undefined) {
      return null;
    } else {
      return (
        <>
          {/* Container and transition for parent question */}
          <TransitionGroup>
            <CSSTransition
              key={parentQuestionAsked[0]}
              in={true}
              appear={true}
              onEntered={this.flipCard}
              timeout={900}
              classNames='flip-container'
            >
              <Grid container direction='row' alignItems='flex-start' justify='center' spacing={40}>
                <Grid item lg={6}>
                  <div id='question-card' className='flip-container'>
                    <div className='flipper'>
                      {/* Front of card */}
                      <div className='front' id='front-of-card'>
                        <h1>Question</h1>
                        <h1 className='front-question-mark'>?</h1>
                      </div>
                      {/* Back of card containing sub questions */}
                      <div className='back' id='back-of-card'>
                        {/* Display summary and transition for sub questions already asked */}
                        {subQuestionsAsked !== [] || subQuestionsAsked !== null
                          ? subQuestionsAsked.map((subQuestion) => (
                              <TransitionGroup key={subQuestionsAsked[0]}>
                                <CSSTransition
                                  key={subQuestionsAsked[0]}
                                  in={true}
                                  appear={true}
                                  timeout={300}
                                  classNames='sub-questions'
                                >
                                  <div
                                    id='sub-question-being-asked-container'
                                    className='sub-questions-asked-container'
                                  >
                                    <span className='test-question-numbering'>{`${subQuestion.id} of ${subQuestionsNumber}`}</span>
                                    <p className='test-question-paragraph'>
                                      {subQuestion.sub_question}
                                    </p>
                                    <div className='test-line-separator'></div>
                                    <div className='sub-question-asked-answer-wrapper'>
                                      <p className='sub-question-asked-answer'>
                                        {subQuestion.sub_answer}
                                      </p>
                                    </div>
                                  </div>
                                </CSSTransition>
                              </TransitionGroup>
                            ))
                          : null}
                        {/* Display sub question currently being asked */}
                        <div className='sub-question-being-asked-container'>
                          {auth0_id !== '' ? (
                            <Link
                              component={RouterLink}
                              to={`/question/${parentQuestionAsked[0]}`}
                              className='test-question-edit'
                            >
                              <IconButton>
                                <EditIcon />
                              </IconButton>
                            </Link>
                          ) : null}
                          <span className='test-question-numbering'>{`${subQuestionAskingNow[0].id} of ${subQuestionsNumber}`}</span>
                          <p className='test-question-paragraph'>
                            {subQuestionAskingNow[0].sub_question}
                          </p>
                          {showAnswerButtonDisplayed === true ? (
                            <>
                              <Button
                                onClick={this.revealAnswer}
                                variant='contained'
                                color='secondary'
                                className='test-show-answer-button'
                              >
                                Show Answer
                              </Button>
                              <Button
                                onClick={this.renderNewQuestion}
                                variant='contained'
                                className='skip-button'
                              >
                                Skip
                              </Button>
                            </>
                          ) : (
                            <div className='test-line-separator'></div>
                          )}
                          {/* Display sub answer currently being asked */}
                          {subAnswerDisplayed === true ? (
                            <div className='back-card-answer'>
                              <p>{subQuestionAskingNow[0].sub_answer}</p>
                            </div>
                          ) : null}
                          {/* Display button to trigger new question */}
                          {subAnswerDisplayed === true ? (
                            <Button
                              onClick={this.renderNewQuestion}
                              variant='contained'
                              color='secondary'
                              className='test-new-question-button'
                            >
                              {subQuestionsToAsk.length >= 1 ? 'Next' : 'New Question'}
                            </Button>
                          ) : null}
                        </div>{' '}
                        {/* Finish sub-question-being-asked-container */}
                      </div>{' '}
                      {/* Finish back-of-card */}
                    </div>{' '}
                    {/* Finish flipper */}
                  </div>{' '}
                  {/* Finish flip-container */}
                </Grid>
              </Grid>
            </CSSTransition>
          </TransitionGroup>
        </>
      );
    }
  };

  render() {
    return (
      <div className='wrapper'>
        {this.renderHeader()}
        {this.renderSpinner()}
        {this.renderQuestionAsked()}
      </div>
    );
  }
}
