import React, { Fragment, useEffect, useState } from "react";
import './QuestionComponent.css'

const QuestionComponent = (props) => {
    const [subTitle, setSubTitle] = useState()
    useEffect(() => {
        let subTitleMessage
        if(props.data.question_type_id === 1) {
            subTitleMessage = 'You can choose more than one answer'
        } else if (props.data.question_type_id === 2) {
            subTitleMessage = 'you can only choose one answer'
        } else if(props.data.question_type_id === 3) {
            subTitleMessage = 'You can file more than one answer'
        } else if(props.data.question_type_id === 4) {
            subTitleMessage = 'You file more than one answer'
        }
        setSubTitle(subTitleMessage)
    }, [])

    // input type 
    const choiceAnswer = (data, question_id) => {
        return (
            <div class="form-check mb-3" key = {data.id}>
                <input 
                    class="form-check-input me-3" 
                    name="choice" 
                    type="radio" 
                    value={data.answer}
                    questionData = {props.data.question}
                    onChange={(event) => props.handleAnswer(event)}
                />
                <label class="form-check-label">
                    { data.answer }
                </label>
            </div>
        )
    }

    const checkboxAnswer = (data) => {
        return(
            <div className="mt-3" key={data.id}>
                <div class="form-check mb-3">
                    <input 
                        className="form-check-input me-3" 
                        type="checkbox" 
                        name="checkbox"
                        value={data.answer}
                        questionData = {props.data.question}
                        onChange={(event) => props.handleAnswer(event)}
                    />
                    <label className="form-check-label"> {data.answer} </label>
                </div>
            </div>
        )
    }
    
    const linearAnswer = (data, index, length, question_id) => {
        return (
            <Fragment key={data.id}>
                {
                    index !== 0 ? null :
                    <label className={ `form-check-label ${index === 0 ? "me-lg-3 me-2" : null}`}>
                        { data.answer }
                    </label>
                }
                
                <input 
                    className="form-check-input me-lg-3 me-2" 
                    name="linear"
                    type="radio"
                    value = {index+1}
                    questionData = {props.data.question}
                    onChange={(event) => props.handleAnswer(event)}
                />
                
                {
                    index === length - 1 ? 
                    <label class="form-check-label">
                        { data.answer }
                    </label> : null
                }
            </Fragment>
        )
    }

    const inputAnswer = (data, index) => {
        return (
            <div class="mb-3 col-lg-6 col-12" key={data.id}>
                <input 
                    type="text" 
                    class="form-control" 
                    placeholder="your answere"
                    name="input"
                    indexData={index}
                    questionData = {props.data.question}
                    onChange={(event) => props.handleAnswer(event)}
                />
            </div>
        )
    }
    // end input type
    
    const handleAnswer = () => {
        return (
            props.data.answers.map((answer, index) => {
                if(props.data.question_type_id === 1) {
                    return (
                        checkboxAnswer(answer)
                    )
                } else if(props.data.question_type_id === 2) {
                    return (
                        choiceAnswer(answer, props.data.id)
                    )
                } else if(props.data.question_type_id === 3) {
                    return (
                        linearAnswer(answer, index, props.data.answers.length, props.data.id)
                    )
                } else if(props.data.question_type_id === 4) {
                    return (
                        inputAnswer(answer, index)
                    )
                }
            })
        )
    }
    return (
        <div className="question-component">
            <div className="mb-4">
                <p className="title" >{props.data.question}</p>
                <div className="sub-title">
                    <p>({subTitle})</p>
                </div>
                <div className="progress mt-4">
                    <div className="progress-bar" role="progressbar" style={{ width: "25%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            <div className="mb-5">
                {handleAnswer()}
            </div>
        </div>
    );
}

export default QuestionComponent;