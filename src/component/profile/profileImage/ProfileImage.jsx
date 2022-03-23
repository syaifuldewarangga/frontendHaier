import React, { useState } from 'react';
import './ProfileImage.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal } from 'bootstrap';

function ProfileImage(props) {
  const handleUpload = () => {
    document.getElementById("html_btn").click()
  }
  const { t } = useTranslation('common')

  const alertModalUpload = () => {
    let alertModalUpload = new Modal(document.getElementById('alertModalUpload'));
    alertModalUpload.show();
  };

  const onHideModal = () => {
    var alertModalUpload = document.getElementById('alertModalUpload');
    alertModalUpload.addEventListener('hide.bs.modal', function (event) {
      window.location.reload();
    });
  };

  const [messageAlert, setMessageAlert] = useState({
    status: 'success',
    title: 'Success',
    subTitle: 'your image profile has been updated',
  });

  const handleChangePicture = async (value) => {
    var id = localStorage.getItem('id');
    var token = localStorage.getItem('access_token');
    
    const formDataPhoto = new FormData();
    formDataPhoto.append('file', value.target.files[0]);
    formDataPhoto.append('userId', id);
    axios.post(props.base_url + 'user/image', formDataPhoto, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      localStorage.setItem('photo', res.data[0].path)
      alertModalUpload()
      onHideModal()
    })
    .catch((e) => {
      console.log(e);
    });
  }
  
  return (
    <div className="profile-image">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-center py-4">
            <div className="d-block text-center">
              <img
                src={props.user.photo !== '' ? props.image_url +""+ props.user.photo : '/assets/images/user.png'}
                className="img-responsive rounded-circle"
                width="75px"
                height="75px"
                alt="profile"
              />
              <div>
                <div class="new_Btn" onClick={handleUpload}>{t('profile.update_picture')}</div>
                <input 
                  id="html_btn" 
                  type="file" 
                  onChange={handleChangePicture}
                />
              </div>
            </div>
            <div className="ms-4 left-profile">
              <p>{props.user.fullname}</p>
              <div className="d-flex justify-content-center">
                <span class="material-icons"> phone </span>
                <span className="ms-3">+{props.user.phone_number}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="alertModalUpload" tabindex="-1" aria-labelledby="alertModalUploadLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <div>
                            {
                                messageAlert.status === 'success' ? 
                                <div className="swal2-icon swal2-success swal2-animate-success-icon" style={{ display: "flex" }}>
                                    <div className="swal2-success-circular-line-left" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                    <span className="swal2-success-line-tip"></span>
                                    <span className="swal2-success-line-long"></span>
                                    <div className="swal2-success-ring"></div> 
                                    <div className="swal2-success-fix" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                    <div className="swal2-success-circular-line-right" style={{ backgroundColor: "rgb(255, 255, 255)" }}></div>
                                </div> : 

                                <div class="swal2-icon swal2-error swal2-animate-error-icon" style={{ display: "flex" }}>
                                    <span class="swal2-x-mark">
                                        <span class="swal2-x-mark-line-left"></span>
                                        <span class="swal2-x-mark-line-right"></span>
                                    </span>
                                </div>
                            }


                            <div className="text-center">
                                <span className="modal-question-thanks">{messageAlert.title} </span>
                                <span className="modal-question-message">{messageAlert.subTitle}</span>

                                <div className="modal-question-button my-3">
                                    <button className="btn rounded-pill" data-bs-dismiss="modal" aria-label="Close">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
    image_url: state.URL,
    user: state.USER,
  };
};

export default connect(mapStateToProps, null)(ProfileImage);
