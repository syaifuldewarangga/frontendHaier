import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import ModalSuccess from "./modalSuccess/ModalSuccess";
import './Question.css';
import QuestionComponent from "./QuestionComponent";
import { Modal } from 'bootstrap'
import { withRouter } from "react-router-dom";
import {withTranslation } from "react-i18next";
import AlertModal from "../../alertModal/AlertModal";

 
class Question extends Component {
    state = {
        currentTab: 0,
        questions: [],
        answer: [],
        alert: {
            status: "",
            title: "",
            subTitle: "",
        }
        
    }

    getQuestionFromAPI = async () => {
        const token = localStorage.getItem('access_token')
        await axios.get(this.props.base_url + 'customer-voice-questions', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        .then((res) => {
            let data = res.data
            
            data.map((question) => {
                this.setState({
                    answer: [
                        ...this.state.answer, 
                        {
                            user_id: localStorage.getItem('id'),
                            question: question.question,
                            question_type_id: question.question_type_id,
                            answer: []
                        }
                    ]
                })
            })

            this.setState({
                questions: data
            }, () => {
                this.props.setTotalQuestion(this.state.questions.length)
                this.props.setQuestionTo(1)
            })
            
        })
    }

    prevStep = (n) => {
        this.setState({
            currentTab: this.state.currentTab - 1
        }, () => {
            this.props.setQuestionTo(this.state.currentTab+1)
        })
    }

    nextStep = () => {
        this.setState({
            currentTab: this.state.currentTab + 1
        }, () => {
            this.props.setQuestionTo(this.state.currentTab+1)
        })
    }

    alertModal = () => {
        let alertModal = new Modal(document.getElementById('successModal'));
        alertModal.show();
    }

    afterModalHide = () => {
        var myModalEl = document.getElementById('successModal')
        myModalEl.addEventListener('hidden.bs.modal', function (event) {
            window.location = "/landing-page";
        })
    }

    appendAnswer = (event) => {
        let questionData = event.target.getAttribute('questionData');
        const newData = this.state.answer.map((question) => 
            question.question === questionData 
            ? { 
                ...question,
                answer: [
                    ...question.answer,
                    event.target.value
                ]
            } : question
        )
        return newData
    }

    removeAnswer = (event) => {
        let questionData = event.target.getAttribute('questionData');
        const newData = this.state.answer.map((question) => 
            question.question === questionData 
            ? { 
                ...question,
                answer: question.answer.filter((answer) => answer !== event.target.value)
            } : question
        )
        return newData
    }

    replaceAnswer = (event) => {
        let questionData = event.target.getAttribute('questionData');
        const newData = this.state.answer.map((question) => 
            question.question === questionData 
            ? { 
                ...question,
                answer: [ event.target.value ]
            } : question
        )
        return newData
    }

    inputAnswer = (event) => {
        let questionData = event.target.getAttribute('questionData');
        let indexData = event.target.getAttribute('indexData')
        const newData = this.state.answer.map((question) => 
            question.question === questionData 
            ? question.answer[indexData] === undefined
            ?
            { 
                ...question,
                answer: [
                    ...question.answer,
                    event.target.value
                ]
            } 
            :
            { 
                ...question,
                answer: question.answer.map((answer, x) => x == indexData ? event.target.value : answer)
            } 
            : question
        )
        return newData
    }

    onChangeAnswer = (event) => {
        let newData
        if(event.target.name ==='checkbox') {
            if(event.target.checked) {
                newData = this.appendAnswer(event)
            } else {
                newData = this.removeAnswer(event)
            }
        }

        if(event.target.name === 'choice' || event.target.name === 'linear') {
            newData = this.replaceAnswer(event)
        }

        if(event.target.name === 'input') {
            newData = this.inputAnswer(event)
        }

        this.setState({
            answer: newData
        })


    }

    insertQuestionToAPI = async (data) => {
        // console.log(Object.fromEntries(data))
        const token = localStorage.getItem('access_token')
        await axios.post(this.props.base_url + 'customer-voice-answer', data, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        .then((res) => {
            this.alertModal()
        }).catch((err) => {
            console.log(err.response)
        })
    }

    handleSubmit = () => {
        let question_anwered = 0;
        this.state.answer.map((question) => {
            question_anwered = question.answer.length !== 0 ? question_anwered + 1 : question_anwered;
        })

        if(this.state.questions.length === question_anwered) {
            this.state.answer.map((question) => {
                const formData = new FormData()
                formData.append('user_id', question.user_id)
                formData.append('question', question.question)
                formData.append('question_type_id', question.question_type_id)

                question_anwered = question.answer.length !== 0 ? question_anwered + 1 : question_anwered;
                question.answer.map((answer) => {
                    formData.append('answer', answer)
                })
                this.insertQuestionToAPI(formData)
            })
            console.log(Object)
        } else {
            this.setState({
                alert: {
                    status: "error",
                    title: "Error",
                    subTitle: "Pastikan data sudah terisi semuanya",
                }
            })
            let alertModal = new Modal(document.getElementById('alertModal'));
            alertModal.show();
        }
    }

    componentDidMount() {
        this.getQuestionFromAPI()
        this.afterModalHide()
    }
    render () {
        const { t } = this.props
        return (
            <div className="question my-3 ms-2">
                <div className="mb-5">
                    {
                        this.state.questions.map((question, index) => (
                            <div 
                                className={index === this.state.currentTab ? null : 'd-none'}
                                key={question.id}
                            >
                                <QuestionComponent
                                    data={question}
                                    handleAnswer = {this.onChangeAnswer}
                                />
                            </div>
                        ))
                    }
                    <div className="d-flex col-lg-12">    
                        <button className="btn btn-color-outline-primary me-3" onClick={this.prevStep} disabled={this.state.currentTab === 0 ? true : false}>
                            <span>{t('question.previews')}</span>
                        </button>
                        {(this.state.currentTab === this.state.questions.length - 1) ? 
                            <button 
                                className="btn btn-color-outline-primary ms-3"
                                onClick={this.handleSubmit}
                            >
                                <span>{t('question.submit')}</span>
                            </button> 
                            :
                            <button className="btn btn-color-outline-primary ms-3" onClick={this.nextStep}>
                                <span>{t('question.next')}</span>
                            </button>
                        }
                    </div>
                </div>
                <ModalSuccess />
                <AlertModal 
                    data = {this.state.alert}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL
    }
}
export default withRouter(connect(mapStateToProps, null)(withTranslation('common')(Question)));