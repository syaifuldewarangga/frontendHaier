import React, { useState, useEffect } from 'react';
import Banner from '../../../component/banner/Banner';
import ListBlog2 from '../../../component/blog/ListBlog2/ListBlog2';
import './BlogList.css';
import axios from 'axios';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

const BlogList = (props) => {
  const [lastPage, setLastPage] = useState(false);
  const [data, setData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [category, setCategory] = useState([]);
  const [stateCategory, setStateCategory] = useState('all category');

  const { categoryNews } = useParams();
  console.log(stateCategory)
  var token = localStorage.getItem('access_token');
  const getArticleFromAPI = () => {
    axios
      .get(props.base_url + 'article', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          page: currentPage,
          itemPerPage: 10,
        },
      })
      .then((res) => {
        if (res.data.last === true) {
          setLastPage(true);
        }
        setData(data.concat(res.data.content));
      });
  };

  const getArticleCategoryFromAPI = () => {
    axios
      .get(props.base_url + 'article/find', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          category: stateCategory,
        },
      })
      .then((res) => {
        setDataSearch(res.data);
        setIsSearch(true);
      });
  };

  const getCategoryFromAPI = () => {
    axios
      .get(props.base_url + 'category', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        setCategory(res.data);
      });
  };

  useEffect(() => {
    getCategoryFromAPI();
    if(categoryNews !== undefined) {
      setStateCategory(categoryNews)
    }
  }, []);

  useEffect(() => {
    getArticleFromAPI();
  }, [currentPage]);

  useEffect(() => {
    if (stateCategory === 'all category') {
      setIsSearch(false);
    } else {
      getArticleCategoryFromAPI();
    }
  }, [stateCategory]);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const settings = {
    autoplay: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const { t } = useTranslation('common')
  const BlogBanner = () => {
    return (
      <div className="blog-list">
        <Banner />
        <div className="blog-content">
          <div className="category text-center my-lg-5 my-3">
            <p className="title mb-lg-5 mb-3">{t('category.category')}</p>
            <div className="row justify-content-center mx-lg-3 mx-0">
              <Slider {...settings}>
                <div>
                  <div
                    className={`category-list py-lg-3 mx-2 py-2 mb-2 me-2 ${
                      stateCategory.toLowerCase() === 'all category' ? 'active' : null
                    }`}
                    onClick={() => setStateCategory('all category')}
                  >
                    <span>{t('category.all_category')}</span>
                  </div>
                </div>
                {category.map((category, index) => (
                  <div key={index}>
                    <div
                      className={`category-list py-lg-3 mx-2 py-2 mb-2 me-2 ${
                        stateCategory.toLowerCase() === category.name.toLowerCase() ? 'active' : null
                      }`}
                      onClick={() => setStateCategory(category.name)}
                    >
                      <span>{category.name}</span>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          <div className="container-fluid">
            <div className="px-lg-5">
              <div className="row">
                {isSearch === true
                  ? dataSearch.map(function (item, i) {
                      return (
                        <div className="col-xxl-3 col-xl-4 col-sm-6" key={i}>
                          <ListBlog2 data={item} />
                        </div>
                      );
                    })
                  : data.map(function (item, i) {
                      return (
                        <div className="col-xxl-3 col-xl-4 col-sm-6" key={i}>
                          <ListBlog2 data={item} />
                        </div>
                      );
                    })}
              </div>
            </div>

            {lastPage ? null : (
              <div className="mb-90">
                <div href="#" className="text-center mb-5">
                  <button
                    className="btn btn-danger btn-load-more"
                    onClick={handleLoadMore}
                  >
                    LOAD MORE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <BlogBanner />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    base_url: state.BASE_URL,
  };
};

export default connect(mapStateToProps, null)(BlogList);
