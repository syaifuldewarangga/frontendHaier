import React, { Component } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ProductSlider.css'

class ProductSlider extends Component {
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
            <div className="container-fluid">
                <div className="product-slider px-lg-5">
                    <Slider {...settings}>
                        <div><img src="/assets/images/slider/slider1.png"/></div>
                        <div><img src="/assets/images/slider/slider2.png"/></div>
                        <div><img src="/assets/images/slider/slider3.png"/></div>
                    </Slider>
                </div>
            </div>
        );
    }
}

export default ProductSlider;