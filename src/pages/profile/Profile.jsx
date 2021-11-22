import React from 'react';
import ProfileForm from '../../component/profile/profileForm/ProfileForm';
import ProfileImage from '../../component/profile/profileImage/ProfileImage';
import './Profile.css';
import axios from 'axios';
import { connect } from 'react-redux';

function Profile(props) {
  const [data, setData] = React.useState('');
  

  React.useEffect(() => {
    async function fetchData() {
      var token = localStorage.getItem('access_token');
      var email = localStorage.getItem('email');
      await axios
        .get(props.base_url + 'user/get', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
          params: {
            identifier: email,
          },
        })
        .then((res) => {
          setData(res.data);
          let newPhone = res.data.phone.toString();
          setData({
            ...data,
            phone: newPhone.slice(2)
          })
        })
        .catch((e) => {
          console.log(e.response)
        });
    }

    fetchData();
  }, [props.base_url]);
  
  return (
    <div className="profile">
      <div className="container-fluid">
        <div className="px-lg-5 row">
          <div className="col-lg-3 mb-3">
            <ProfileImage />
          </div>
          <div className="col-lg-9">
            <ProfileForm data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
  };
};

export default connect(mapStateToProps, null)(Profile);
