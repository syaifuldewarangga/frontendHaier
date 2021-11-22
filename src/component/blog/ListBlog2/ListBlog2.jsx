import React from 'react';
import { Link } from 'react-router-dom';
import './ListBlog2.css';
import { connect } from 'react-redux';

const ListBlog2 = (props) => {
  return (
    <div className="blog-list-2 mb-lg-5 mb-4">
      <Link to={'/blog/detail/' + props.data.slug}>
        <div className="image">
          <img src={props.url + props.data.image} />
        </div>
        <div>
          <p className="title">{props.data.title}</p>
          <p className="category">{props.data.category}</p>
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: props.data.content }}
          />
          <p className="read-more">Read More</p>
        </div>
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    url: state.URL,
  };
};

export default connect(mapStateToProps, null)(ListBlog2);
