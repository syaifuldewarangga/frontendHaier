import React, { Component, useState } from "react";
import LeftNavigation from "../../component/customerVoice/leftNavigation/LeftNavigation";
import Question from "../../component/customerVoice/question/Question";

const CustomerVoice = () => {
    const [totalQuestion, setTotalQuestion] = useState()
    const [questionTo, setQuestionTo] =  useState()

    const handleTotalQuestion = (total_question) => {
        setTotalQuestion(total_question)
    }

    const handleQuestionTo = (data) => {
        setQuestionTo(data)
    }

    return (
        <div>
            <div className="row">
                <div className="col-lg-3 d-none d-lg-block">
                    <LeftNavigation 
                        totalQuestion = {totalQuestion}
                        questionTo = {questionTo}
                    />
                </div>
                <div className="col-lg-9 px-4 mb-5">
                    <Question 
                        setTotalQuestion = {handleTotalQuestion}
                        setQuestionTo = {handleQuestionTo}
                    />
                </div>
            </div>
        </div>
    );
}

export default CustomerVoice;