import React from 'react';
import './ProfileImage.css';
import axios from 'axios';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

function ProfileImage(props) {
  const handleUpload = () => {
    document.getElementById("html_btn").click()
  }
  const { t } = useTranslation('common')
  return (
    <div className="profile-image">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-center py-4">
            <div className="d-block text-center">
              <img
                src={props.user.photo !== '' ? props.image_url +""+ props.user.photo : '/assets/images/user.png'}
                className="img-fluid rounded-circle"
                width="75px"
                height="75px"
              />
              <div>
                <div class="new_Btn" onClick={handleUpload}>{t('profile.update_picture')}</div>
                <input 
                  id="html_btn" 
                  type="file" 
                  onChange={(value) => {
                    var id = localStorage.getItem('id');
                    var token = localStorage.getItem('access_token');
                    console.log(id);
                    const formDataPhoto = new FormData();
                    formDataPhoto.append('file', value.target.files[0]);
                    formDataPhoto.append('userId', id);
                    axios
                      .post(props.base_url + 'user/image', formDataPhoto, {
                        headers: {
                          Authorization: 'Bearer ' + token,
                          'Content-Type': 'application/json',
                        },
                      })
                      .then((res) => {
                        localStorage.setItem('photo', res.data[0].path)
                        alert('berhasil');
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  }}
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
