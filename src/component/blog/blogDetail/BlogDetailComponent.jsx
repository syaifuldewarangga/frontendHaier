import React from 'react';
import './BlogDetailComponent.css';
import { connect } from 'react-redux';

const BlogDetailComponent = (props) => {
  console.log(props.data);
  return (
    <div className="blog-detail">
      <div className="d-flex justify-content-center">
        <div className="col-lg-7 col-11">
          <div>
            <div className="py-lg-5 py-3">
              <h1 className="title">{props.data.title}</h1>
              {/* <p className="sub-title">KAMIS 24 OKTOBERRRR 2021</p> */}
            </div>
            <div className="content mb-5">
              <img src={props.url + props.data.image} width="100%" />
              <div
                className="mt-3"
                dangerouslySetInnerHTML={{ __html: props.data.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    url: state.URL,
  };
};

export default connect(mapStateToProps, null)(BlogDetailComponent);
