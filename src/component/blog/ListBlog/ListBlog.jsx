import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import './ListBlog.css'

class ListBlog extends Component 
{
    render() {
        return(
            <div className="col-lg-12" style={{ padding: "0 12px" }}>
                <Link to={`/blog/detail/${this.props.data.slug}`}>
                    <div className="image-blog">
                        <img src={this.props.image_url + this.props.data.image} className="img-fluid" />
                    </div>
                    <div>
                        <p className="blog-title">{this.props.data.title}</p>
                        <p className="blog-category">{this.props.data.category}</p>
                        <div 
                            className="blog-desc" 
                            dangerouslySetInnerHTML={{ __html: this.props.data.content }}
                        >
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        image_url: state.URL,
    }
}

export default connect(mapStateToProps, null) (ListBlog);
