import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import AlertModal from "../../alertModal/AlertModal";
import { Modal } from 'bootstrap'

import './ContactMessage.css';

class ContactMessage extends Component {
    state = ({
        formMessage: {
            name: '',
            email: '',
            subject: '',
            message: ''
        },
        title: {
            status: '',
            title: '',
            subTitle: ''
        }
    })

    handleFormMessage = (event) => {
        let formMessageNew = {...this.state.formMessage}
        formMessageNew[event.target.name] = event.target.value

        this.setState({
            formMessage: formMessageNew
        })
    }

    alertModal = () => {
        let alertModal = new Modal(document.getElementById('alertModal'));
        alertModal.show();
    }

    postMessage = () => {
        const token = localStorage.getItem('access_token');
        let data = JSON.stringify(this.state.formMessage)
        axios.post(this.props.base_url + 'message', data, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            this.setState({
                title: {
                    status: 'success',
                    title: 'Thank You !',
                    subTitle: 'your message has been send'
                }
            })
            this.setState({
                formMessage: {
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                }
             })
            console.log(this.state.formMessage)
            this.alertModal()
        }).catch((e) => {
            this.setState({
                title: {
                    status: 'error',
                    title: 'Failed',
                    subTitle: 'your message was not sent'
                }
            })
            this.alertModal()
            if (e.response) {
              console.log(e.response);
            } else if (e.request) {
              console.log('request : ' + e.request);
            } else {
              console.log('message : ' + e.message);
            }
          });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.postMessage()
    }

    render() {
        return(
            <div className="tab-pane fade" id="pills-message" role="tabpanel" aria-labelledby="pills-contact-tab">
                <div className="card contact-message mb-5">
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="name"
                                    value={this.state.formMessage.name}
                                    onChange={this.handleFormMessage}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control"
                                    name="email"
                                    value={this.state.formMessage.email}
                                    onChange={this.handleFormMessage}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Subject</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    name="subject"
                                    value={this.state.formMessage.subject}
                                    onChange={this.handleFormMessage}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Message</label>
                                <textarea 
                                    className="form-control" 
                                    rows="6"
                                    name="message"
                                    value={this.state.formMessage.message}
                                    onChange={this.handleFormMessage}
                                    required
                                ></textarea>
                            </div>

                            <div className="text-center">
                                <button className="btn btn-color-primary rounded-pill submit" >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* <button
                    onClick={this.alertModal}
                >
                    cek modal
                </button> */}
                <AlertModal data={this.state.title}/>
            </div> 
        );
    }
}

const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL
    }
}

export default connect(mapStateToProps)(ContactMessage);