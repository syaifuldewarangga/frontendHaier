import React, { Component } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Slider.css';
import { connect } from "react-redux";
import axios from "axios";

class ImageSlider extends Component
{
    state = ({
        banners: []
    })

    async getBannerFromAPI() {
        const token = localStorage.getItem('access_token')
        await axios.get(this.props.base_url + 'banner/active', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
        .then((res) => {
            this.setState({
                banners: res.data
            })
        })
    } 
    componentDidMount() {
        this.getBannerFromAPI()
    }
    render () {
        const settings = {
            dots: true,
            autoplay: true,
            autoplaySpeed: 2000,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        return (
            <Slider {...settings}>
                {
                    this.state.banners.map((banner) => (
                        <div key={banner.id}>
                            <img src={this.props.image_url + banner.image} alt={banner.title}/>
                        </div>
                    ))
                }
            </Slider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        base_url: state.BASE_URL,
        image_url: state.URL
    }
}
export default  connect(mapStateToProps, null)(ImageSlider);