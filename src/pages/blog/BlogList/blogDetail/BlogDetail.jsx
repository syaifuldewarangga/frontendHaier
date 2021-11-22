import React from 'react';
import BlogDetailComponent from '../../../../component/blog/blogDetail/BlogDetailComponent';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

function BlogDetail(props) {
  const { slug } = useParams();
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    var token = localStorage.getItem('access_token');
    axios.get(props.base_url + 'article/get', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          slug: slug,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        if (e.response) {
          console.log(e.response);
        } else if (e.request) {
          console.log('request : ' + e.request);
        } else {
          console.log('message : ' + e.message);
        }
      });
  }, []);
  return (
    <div>
      <BlogDetailComponent data={data} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
  };
};

export default connect(mapStateToProps, null)(BlogDetail);
