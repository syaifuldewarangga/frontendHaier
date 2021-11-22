import React, { Component, Fragment } from "react";
import './Chat.css';

class Chat extends Component 
{
    render () {
        return (
            <Fragment>
                <a href="https://wa.me/6285810003003" target="_blank">
                    <div className="chat-button d-flex align-items-center">
                            <img src="/assets/images/chat-icon.png" alt="aqua japan chat icon" />
                            {/* <p className="material-icons md-36 me-2"> wechat </p>
                            <p className="chat fw-bold">Chat</p> */}
                    </div>
                    <div className="logo-quina">
                        <img src="/logo-quina.png" alt="logo-quina" className="img-responsive"/>
                    </div>
                </a>
            </Fragment>
        )
    }
}

export default Chat