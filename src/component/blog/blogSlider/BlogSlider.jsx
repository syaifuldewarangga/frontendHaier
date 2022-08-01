import React, { Component } from "react";
import ListBlog from "../ListBlog/ListBlog";
import './BlogSlider.css'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

class BlogSlider extends Component
{
    state = ({
        articles: []
    })

    async getArticleFromAPI() {
        const token = localStorage.getItem('access_token')
        await axios.get(this.props.base_url + 'article', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        .then((res) => {
            this.setState({
                articles: res.data.content
            })
        })    
    }

    componentDidMount() {
        this.getArticleFromAPI()
    }
    render() {
        const { t } = this.props;
        const settings = {
            autoplay: true,
            autoplaySpeed: 2000,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1.5,
                        slidesToScroll: 1,
                    }
                }
            ]
        };

        return (
            <div className="container-fluid mb-5">
                <div className="col-lg-11 m-auto">
                    <div className="head-blog d-flex justify-content-between align-items-center">
                        <p>{(t('landingPage.new_blog'))}</p>
                        <Link to="/blog/list" className="see-more-blog">{(t('general.see_more'))}</Link>
                    </div>
                    <div className="card-blog">
                        <Slider {...settings}>
                            {
                                this.state.articles.map((article) => (
                                    <ListBlog 
                                        key={article.id}
                                        data={article}
                                    />
                                ))
                            }
                        </Slider>
                        
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL,
    }
}
export default connect(mapStateToProps, null) (withTranslation('common')(BlogSlider))