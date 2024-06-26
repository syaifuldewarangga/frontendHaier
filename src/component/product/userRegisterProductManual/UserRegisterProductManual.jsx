import axios from 'axios';
import { Modal } from 'bootstrap';
import { format } from 'date-fns';
import moment from 'moment/moment';
import React, { useEffect, useMemo, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useTranslation } from 'react-i18next';
import Resizer from "react-image-file-resizer";
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import { client_id, client_secret, grant_type } from '../../../variable';
import { DataURIToBlob } from '../../../variable/DataUriToBlob';
import AlertModal from '../../alertModal/AlertModal';
import './SelectSearch.css';
import './UserRegisterProductManual.css';
var X2JS = require('x2js');

function UserRegisterProductManual(props) {
  const xtojson = new X2JS();
  const { barcode } = props
  const [data, setData] = useState('');
  const [storeValue, setStoreValue] = useState('');
  const [storeStreet, setStoreStreet] = useState('');
  const [dataStore, setDataStore] = useState([]);
  const [showFile1, setShowFile1] = useState('');
  const [showFile2, setShowFile2] = useState('');
  const [showFile3, setShowFile3] = useState('');
  const [dataUser, setDataUser] = useState({});
  const [isPromo, setIsPromo] = useState(false);
  const [dataPromo, setDataPromo] = useState({});
  const [userData, setUserData] = useState({
    date: '',
    file1: '',
    file2: '',
    file3: '',
    agreements: ''
  });
  const [errorDate, setErrorDate] = useState('');
  const [errorFile1, setErrorFile1] = useState('');
  const [errorFile2, setErrorFile2] = useState('');
  const [errorFile3, setErrorFile3] = useState('');
  const [errorStore, setErrorStore] = useState('');
  const [errorGSIS, setErrorGSIS] = useState('');
  const [messageModal, setMessageModal] = useState({
    status: 'success',
    title: 'Thanks You',
    subTitle: 'Your product has been successfully registered'
  })
  const [maxPurchaseDate, setMaxPurchaseDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isLoading, setIsLoadiing] = useState(false)
  const [type, setType] = useState('GTM')
  var email = localStorage.getItem('email');
  var token = localStorage.getItem('access_token');
  const history = useHistory()

  const resizeFile = (file) => new Promise((resolve) => {
    Resizer.imageFileResizer( file, 600, 600, "JPEG", 100, 0,
      (uri) => {
        resolve(uri);
      }, "base64" );
  });

  async function fetchDataStore(gtmToken) {
    try{
      const res = await axios.post(props.gtm_url + 'pmtcommondata/GetStoreListByCondition',
          {
            StoreID: '',
            StoreName: '',
            StoreCode: '',
          },
          {
            headers: {
              Authorization: "Bearer " + gtmToken,
            },
          }
      )
      setDataStore(res.data.data);
      return res
    }catch(e){
        if (e.response) {
          // console.log(e.response);
        } else if (e.request) {
          // console.log('request : ' + e.request);
        } else {
          // console.log('message : ' + e.message);
        }
    }
  }

  const getTokenGTM = async () => {
    const { data: { access_token } } = await axios.post(props.gtm_token_url, {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: grant_type,
    })
    const temp =  await fetchDataStore(access_token)
    // console.log(temp)
    return temp
  }

  let newDataStore = useMemo(() => {
    return dataStore.map(({ StoreName }) => ({
      value: StoreName,
      name: StoreName,
    }))
  }, [dataStore]);

  const onChangeStore = (storeValue) => {
    if(dataStore.length === 0 ) return;
    let isi = dataStore.filter((word) => word.StoreName === storeValue);
    if(isi.length > 0){
      setStoreStreet(isi[0].Street);
      setStoreValue(storeValue)
    }
  }
  // useEffect(() => {
  //   let isi = dataStore.filter((word) => word.StoreName === storeValue);
  //   if (storeValue !== '') {
  //     setStoreStreet(isi[0].Street);
  //   }
  // }, [storeValue]);

  const onChangeFile = async (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    const image = e.target.files[0] && await resizeFile(file);
    if(name === 'warranty_card' && image) {
      setShowFile1(image)
      setUserData({
        ...userData,
        ['file1']: DataURIToBlob(image),
      });
    } else if(name === 'invoice_card' && image) {
      setShowFile2(image)
      setUserData({
        ...userData,
        ['file2']: DataURIToBlob(image ),
      });
    } else if(name === 'serial_number' && image) {
      setShowFile3(image)
      setUserData({
        ...userData,
        ['file3']: DataURIToBlob(image),
      });
    }
  }

  const [errorBrand, setErrorBrand] = useState('');
  const [errorProductModel, setErrorProductModel] = useState('');
  const [errorCategory, setErrorCategory] = useState('');
  const [form, setForm] = useState({
    brand: 'AQUA',
    product_model: '',
    category: '',
  })
  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const alertModal = () => {
    let alertModal = new Modal(document.getElementById('alertModal'));
    alertModal.show();
  }

  const [dealerInput, setDealerInput] = useState('')
  const [dealer, setDealer] = useState([])
  const [selectedDealer, setSelectedDealer] = useState([])
  async function getDealer() {
    await axios.get(props.base_url + 'v2/dealers', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((res) => {
      setDealer(res.data);
    })
    .catch((e) => {
      if (e.response) {
        // console.log(e.response);
      } else if (e.request) {
        // console.log('request : ' + e.request);
      } else {
        // console.log('message : ' + e.message);
      }
    });
  }

  const [address, setAddress] = useState({
    prov: '',
    city: '',
    district: '',
    street: ''
  })
  const [prov, setProv] = useState([])
  const [selectedProv, setSelectedProv] = useState([])
  async function getProvinceFromAPI() {
    await axios.get(props.base_url + 'v2/location/gcc/province?country_code=ID', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((res) => {
      setProv(res.data);
    })
    .catch((e) => {
      if (e.response) {
        // console.log(e.response);
      } else if (e.request) {
        // console.log('request : ' + e.request);
      } else {
        // console.log('message : ' + e.message);
      }
    });
  }

  const [city, setCity] = useState([])
  const [selectedCity, setSelectedCity] = useState([])
  const getCityFromAPI = async (province) => {
    var token = localStorage.getItem('access_token');
    await axios
      .get(props.base_url + 'v2/location/gcc/city', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        params: {
          province_code: province,
        },
      })
      .then((res) => {
        setCity(res.data);
      });
  };

  const [district, setDistrict] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState([])
  const getDisrictFromAPI = async (city) => {
    await axios.get(props.base_url + 'v2/location/gcc/district', {
      params: {
        city_code: city,
      }
    })
    .then((res) => {
      setDistrict(res.data);
    })
    .catch((err) => {
      // console.log(err);
    });
  };

  const [street, setStreet] = useState([])
  const [selectedStreet, setSelectedStreet] = useState([])
  const getSubDisrictFromAPI = async (district) => {
    await axios
      .get(props.base_url + 'v2/location/gcc/street', {
        params: {
          district_code: district,
        }
      })
      .then((res) => {
        setStreet(res.data);
      });
  };

  useEffect(() => {
    let m = true;
    if(m){
      if(selectedProv.length > 0){
        getCityFromAPI(selectedProv[0].province_code)
      }else{
        setCity([])
        setSelectedCity([])
      }
    }
    return () => m = false
  }, [selectedProv])

  useEffect(() => {
    let m = true;
    if(m){
      if(selectedCity.length > 0){
        getDisrictFromAPI(selectedCity[0].cityCode)
      }else{
        setDistrict([])
        setSelectedDistrict([])
      }
    }
    return () => m = false
  }, [selectedCity])

  useEffect(() => {
    let m = true;
    if(m){
      if(selectedDistrict.length > 0){
        getSubDisrictFromAPI(selectedDistrict[0].districtCode)
      }else{
        setStreet([])
        setSelectedStreet([])
      }
    }
    return () => m = false
  }, [selectedDistrict])

  useEffect(() => {
    let isi = dataStore.filter((word) => word.StoreName === storeValue);
    if (storeValue !== '') {
      setStoreStreet(isi[0].Street);
    }
  }, [storeValue]);

  const [selected, setSelected] = useState([])
  const [options, setOptions] = useState([])
  const getOptions = async () => {
    // const url = `${props.base_url}extended-warranty-promo/wms?product_model=`
    const url = `${props.base_url}product-model-all`
    const res = await axios.get(url, {
      headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    })
    const { data } = res;
    // console.log(data.product_model_list)
    // if(data.product_model_list !== null) setOptions([...data.product_model_list])
    setOptions(data.product_model_list)
  }

  const [brand, setBrand] = useState([])
  const [selectedBrand, setSelectedBrand] = useState([])
  const [brandInput, setBrandInput] = useState('')
  const getBrandFromAPI = async () => {
    await axios
      .get(props.base_url + 'v2/product/gcc/brands', {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      })
      .then((res) => {
        setBrand(res.data.data);
      });
  };

  const [category, setCategory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState([])
  const [categoryInput, setCategoryInput] = useState('')
  const getCategoryFromAPI = async (brand_value) => {
    await axios
      .get(props.base_url + 'v2/product/gcc/categories', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
        params: {
          brand_value,
        }
      })
      .then((res) => {
        setCategory(res.data.data);
      });
  };

  useEffect(() => {
    let m = true;
    if(m){
      if(selectedBrand.length > 0){
        getCategoryFromAPI(selectedBrand[0].brandValue)
      }else{
        setCategory([])
        setSelectedCategory([])
      }
    }
    return () => m = false
  }, [selectedBrand])
  // useEffect(() => {
  //   let m = true
  //   if(m) getOptions()
  //   return () => m = false
  // }, [])
  const product_model = useMemo(() => {
    return selected.length === 0 ? form.product_model : selected[0]
  }, [selected, form.product_model]) 
  
  const isValid = useMemo(() => {
    if(product_model == '') return ''
    return options.includes(product_model) ? 'is-valid' : 'is-invalid'

  }, [product_model])

  const PostToGCC = async (id) => {
    try {
      const params = {
        RegisterProductId: id,
        Status: 'APPROVED',
      }
      const res = await axios.patch(props.base_url + 'v2/register-service/product/status', {}, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
          params
      })
      console.log(res.data)
      return res.data
      // hideModal()
      // fetchData()
 
    } catch (err) {
      console.log(err.response)
    } finally {
    }
  }

  const [errorPost, setErrorPost] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoadiing(true)
    var id = localStorage.getItem('id');
    var phone = localStorage.getItem('phone');
    const formdata = new FormData();

    if ( 
      userData.date !== '' && 
      showFile1 !== '' && 
      showFile2 !== '' && 
      showFile3 !== '' && 
      storeValue !== ''  &&
      product_model !== '' &&
      selectedProv.length !== 0 &&
      selectedStreet.length !== 0 &&
      selectedDistrict.length !== 0 &&
      selectedCategory.length !== 0 &&
      selectedBrand.length !== 0 &&
      detailAddress !== ''
    ) {
      var dateChange = userData.date.replaceAll('-', '/');
      const newPurcaseDate = format(new Date(dateChange), 'MM/dd/yyyy');
      // const newBirthDateDate = format(new Date('1981//09/27'), 'MM/dd/yyyy');
      // const newGender = dataUser.gender === 'Pria' ? 'Mr' : 'Ms';
      // console.log(product_model)

      formdata.append('customer_id', id);
      formdata.append('serial_number', barcode);
      formdata.append('barcode', barcode);
      formdata.append('product_name', product_model);
      formdata.append('date', newPurcaseDate);
      formdata.append('store_location', storeStreet);
      formdata.append('store_name', storeValue);
      if(email !== 'null') formdata.append('email', email)
      formdata.append('phone', phone);
      formdata.append('product_model', product_model);
      if(userData.file1 !== ''){
        formdata.append( 'warranty_card', userData.file1);
      }
      if(userData.file2 !== ''){
        formdata.append('invoice', userData.file2);
      }
      if(userData.file3 !== ''){
        formdata.append('serial', userData.file3);
      }
      formdata.append('brand', selectedBrand[0].brandName);
      formdata.append('status', 1);
      formdata.append('agreements', userData.agreements === 'Y' ? 'Y' : 'N');
      formdata.append('category', selectedCategory[0].categoryName);
      formdata.append('location_pin_code', selectedStreet[0].zipCode);
      formdata.append('location_state_code', selectedProv[0].province_code);
      formdata.append('location_state_name', selectedProv[0].province);
      formdata.append('location_city_code', selectedCity[0].cityCode);
      formdata.append('location_city_name', selectedCity[0].city);
      formdata.append('location_locality_code', selectedDistrict[0].districtCode);
      formdata.append('location_locality_name', selectedDistrict[0].district);
      formdata.append('brand_code', selectedBrand[0].brandValue);
      formdata.append('product_code', selectedCategory[0].categoryValue);
      // formdata.append('dealer_name', selectedDealer[0].name);
      formdata.append('dealer_name', 'blank');
      formdata.append('location_street_name', selectedStreet[0].street);
      formdata.append('location_address', detailAddress);
      // setIsLoadiing(false)
      
      // console.table(Object.fromEntries(formdata))
      // setTimeout(() => {
      //   setIsLoadiing(false)
      //   setMessageModal({
      //     status: 'success',
      //     title: 'Thank you, ',
      //     subTitle: 'produk anda berhasil didaftarkan dan menunggu tahap verifikasi',
      //     back: true
      //   })
      //   alertModal()
      // }, 1000);
      if(props.title == 'edit'){
        // setTimeout(() => {
        //   console.table(Object.fromEntries(formdata))
        //   setIsLoadiing(false)
        //   // setMessageModal({
        //   //   status: 'success',
        //   //   title: 'Thank you, ',
        //   //   subTitle: 'produk anda berhasil didaftarkan ulang dan menunggu tahap verifikasi',
        //   //   back: true
        //   // })
        //   // alertModal()
        // }, 1000);
        
        formdata.append('id', props.idProduct);
        // console.log(Object.fromEntries(formdata));
        axios.put(props.base_url + 'register-product/plain', formdata, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }).then(res => {
          if(!!!props.data.category && !!props.detailProductBySerialNumber){
            PostToGCC(props.idProduct)
              .then(v => {
                setIsLoadiing(false)
                setMessageModal({
                  status: 'success',
                  title: 'Thank you, ',
                  subTitle: 'produk anda berhasil didaftarkan ulang dan menunggu tahap verifikasi',
                  back: true
                })
                alertModal()
              })
              .catch(err => {
                console.log(err.response)
              })
          }else{
            setIsLoadiing(false)
            setMessageModal({
              status: 'success',
              title: 'Thank you, ',
              subTitle: 'produk anda berhasil didaftarkan ulang dan menunggu tahap verifikasi',
              back: true
            })
            alertModal()
          }
        }).catch(err => {
          console.log(err.response)
          setIsLoadiing(false)
          if(err.response){
            if(err.response.data.errors.location === 'barcode'){
              setErrorPost('Barcode Sudah Terdaftar')
            }
          }
        })

      }else{
        axios.post(props.base_url + 'register-product/plain', formdata, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
        }).then(res => {
          setIsLoadiing(false)
          setMessageModal({
            status: 'success',
            title: 'Thank you, ',
            subTitle: 'produk anda berhasil didaftarkan dan menunggu tahap verifikasi',
            back: true
          })
          alertModal()
        }).catch(err => {
          // console.log(err.response)
          setIsLoadiing(false)
          if(err.response){
            if(err.response.data.errors.location === 'barcode'){
              setErrorPost('Barcode Sudah Terdaftar')
            }
          }
        })
      }
    } else {
      userData.date === '' ? setErrorDate('Date Must be Required') : setErrorDate('')
      storeValue === '' ? setErrorStore('Store Must be Required') : setErrorStore('')
      form.brand == '' ? setErrorBrand('Brand Must be Required') : setErrorBrand('')
      product_model == '' ? setErrorProductModel('Product Model Must be Required') : setErrorProductModel('')
      form.category == '' ? setErrorCategory('Category Must be Required') : setErrorCategory('')
      showFile1 === '' ? setErrorFile1('Warranty Card Must be Required') : setErrorFile1('');
      showFile2 === '' ? setErrorFile2('Invoice Must be Required') : setErrorFile2('');
      showFile3 === '' ? setErrorFile2('Serial Number Must be Required') : setErrorFile2('');
      setIsLoadiing(false)
    }
  }

  const { t } = useTranslation('common')

  const [loadData, setLoadData] = useState(true)
  useEffect(() => {
    let m = true
    if(m){
      Promise.all([
          getOptions(), 
          getTokenGTM(), 
          getProvinceFromAPI(), 
          getDealer(),
          getBrandFromAPI()
      ]).then((res)  => {
        if(!!props.data){ 
          const { data, detailProductBySerialNumber } = props
          const { data: { data: allStore } } = res[1]
          if(!!!data.category){
            if(!!detailProductBySerialNumber){
              setSelectedCategory([{
                categoryName: detailProductBySerialNumber.ProductCategoryName,
                categoryValue: detailProductBySerialNumber.CategoryValue
              }])
              setSelectedBrand([{
                brandName: detailProductBySerialNumber.Brand,
                brandValue: detailProductBySerialNumber.BrandValue
              }])
              setForm({
                ...form,
                brand: detailProductBySerialNumber.Brand,
                category: detailProductBySerialNumber.ProductCategoryName,
                product_model: detailProductBySerialNumber.ProductName,
              })
              setSelected([detailProductBySerialNumber.ProductName])
              setShowFile2(props.image_url + data.invoice)
              setLoadData(false)
            }else{
              setShowFile2(props.image_url + data.invoice)
              setLoadData(false)
            }
          }else{
            setSelected([data.product_model])
            setForm({
              ...form,
              brand: data.brand,
              category: data.category,
              product_model: data.product_model,
            })
            setStoreValue(data.store_name)
            setStoreStreet(allStore.find(v => v.StoreName == data.store_name)?.Street)
            setUserData({
              ...userData,
              agreements: data.agreements,
              date: moment(data.date).format('yyyy-MM-DD'),
            })
            setShowFile1(props.image_url + data.warranty_card)
            setShowFile2(props.image_url + data.invoice)
            setShowFile3(props.image_url + data.serial)
            setSelectedProv([{
              province: data.product_pending_information.locationStateName,
              province_code: data.product_pending_information.locationStateCode,
            }])
            setSelectedCity([{
              city: data.product_pending_information.locationCityName,
              cityCode: data.product_pending_information.locationCityCode
            }])
            setSelectedDistrict([{
              district: data.product_pending_information.locationLocalityName,
              districtCode: data.product_pending_information.locationLocalityCode
            }])
            setSelectedStreet([{
              street: data.product_pending_information.locationStreetName,
              zipCode: data.product_pending_information.locationPinCode,
              province: data.product_pending_information.locationStateName,
              province_code: data.product_pending_information.locationStateCode,
              city: data.product_pending_information.locationCityName,
              cityCode: data.product_pending_information.locationCityCode,
              district: data.product_pending_information.locationLocalityName,
              districtCode: data.product_pending_information.locationLocalityCode
            }])
            // setSelectedDealer([{
            //   name: data.product_pending_information.dealerName
            // }])
            setSelectedCategory([{
              categoryName: data.category,
              categoryValue: data.product_pending_information.productCode
            }])
            setSelectedBrand([{
              brandName: data.brand,
              brandValue: data.product_pending_information.brandCode
            }])
            setDetailAddress(
              data.product_pending_information.locationAddress !== null ? 
                data.product_pending_information.locationAddress 
                : 
                data.customer.address !== null ? 
                    data.customer.address
                    :
                    ''
            )
            setLoadData(false)
          }
        }else{
          setLoadData(false)
        } 
      })
    }
    return () => m = false
  }, [props])
 
  

  return (
    <div className="user-register-product mb-5">
      <div className="container-fluid">
        <div className="col-lg-11 m-auto pt-lg-0 pt-1">
          <div className="head-product">
            <p>Product Register</p>
          </div>
        </div>

        <div className="col-lg-8 m-auto mt-3">
          <div className="title">
            <p>Data Product</p>
          </div>
          {!loadData ?
          <>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="barcode" className="form-label">
                      Barcode
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="barcode"
                      value={barcode}
                      disabled="disabled"
                    />
                  </div>
                </div>

                {/* Brand */}
                <div className="col-lg-6">
                  {/* <div className="mb-lg-5 mb-4">
                    <label htmlFor="brand" className="form-label">
                      Brand
                    </label>
                    <select name='brand' disabled onChange={onChange} value={form.brand} className="form-select" aria-label="Default select example" placeholder='choose brand'>
                      <option value='' disabled>Choose One Brand</option>
                      <option value="AQUA">AQUA</option>
                    </select>
                    <div className="text-danger">{errorBrand}</div>
                  </div> */}
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="product-model" className="form-label">
                      Brand
                    </label>
                    <Typeahead
                      onInputChange={(v) => {
                        setBrandInput(v)
                      }}
                      id="basic-typeahead-single"
                      labelKey="brandName"
                      onChange={setSelectedBrand}
                      options={brand}
                      placeholder="Choose brand..."
                      selected={selectedBrand}
                    />
                  </div>
                </div>

                {/* <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="product-model" className="form-label">
                      Product Model
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="product-model"
                      value={form.product_model}
                      onChange={onChange}
                      name='product_model'
                    />
                    <div className="text-danger">{errorProductModel}</div>
                  </div>
                </div> */}
                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="product-model" className="form-label">
                      Product Model
                    </label>
                    <Typeahead
                      onInputChange={(v) => {
                        setForm({
                          ...form,
                          product_model: v
                        })
                      }}
                      id="basic-typeahead-single"
                      labelKey="name"
                      emptyLabel={t('product_register.product_model.not_found')}
                      onChange={setSelected}
                      options={options.filter(v => v)}
                      placeholder="Choose a product model..."
                      selected={selected}
                    />
                    <div className='bg-primary text-light px-2 pb-1' style={{ borderRadius: '0px 0px 5px 5px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', fontStyle: 'italic' }}>Note : </span>
                      <p style={{ fontSize: '0.8rem', fontStyle: 'italic', marginTop: '10px' }}>
                        {t('product_register.product_model.description')}
                      </p>
                    </div>
                    <div className="text-danger">{errorProductModel}</div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="serial-number" className="form-label">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="serial-number"
                      value={barcode}
                      disabled="disabled"
                    />
                  </div>
                </div>

                {/* Adress */}
                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="product-model" className="form-label">
                      Province
                    </label>
                    <Typeahead
                      onInputChange={(v) => {
                        setAddress({
                          ...address,
                          prov: v
                        })
                      }}
                      id="basic-typeahead-single"
                      labelKey="province"
                      onChange={setSelectedProv}
                      options={prov}
                      placeholder="Choose province..."
                      selected={selectedProv}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="product-model" className="form-label">
                      City
                    </label>
                    <Typeahead
                      disabled={!selectedProv.length > 0}
                      onInputChange={(v) => {
                        setAddress({
                          ...address,
                          city: v
                        })
                      }}
                      id="basic-typeahead-single"
                      labelKey="city"
                      onChange={setSelectedCity}
                      options={city}
                      placeholder="Choose city..."
                      selected={selectedCity}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="product-model" className="form-label">
                      District
                    </label>
                    <Typeahead
                      disabled={!selectedCity.length > 0}
                      onInputChange={(v) => {
                        setAddress({
                          ...address,
                          district: v
                        })
                      }}
                      id="basic-typeahead-single"
                      labelKey="district"
                      onChange={setSelectedDistrict}
                      options={district}
                      placeholder="Choose district..."
                      selected={selectedDistrict}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="product-model" className="form-label">
                      Street
                    </label>
                    <Typeahead
                      disabled={!selectedDistrict.length > 0}
                      onInputChange={(v) => {
                        setAddress({
                          ...address,
                          street: v
                        })
                      }}
                      id="basic-typeahead-single"
                      labelKey="street"
                      onChange={setSelectedStreet}
                      options={street}
                      placeholder="Choose street..."
                      selected={selectedStreet}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="mb-lg-5 mb-4">
                    <label className="form-label">Detail Address</label>
                    <textarea required value={detailAddress} className='form-control' name='detailAddress' 
                      onChange={(e) => {
                          if(e.target.value.length > 100){
                            setDetailAddress(e.target.value.substring(0, 100))
                          }else{
                            setDetailAddress(e.target.value)
                          }
                      }} 
                    >
                    </textarea>
                    <small>{`${detailAddress.length}/100`}</small>
                </div>      
                </div>
                {/* Dealer */}
                {/* <div className="col-lg-12">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="product-model" className="form-label">
                      Dealer
                    </label>
                    <Typeahead
                      onInputChange={(v) => {
                        setDealerInput(v)
                      }}
                      id="basic-typeahead-single"
                      labelKey="name"
                      onChange={setSelectedDealer}
                      options={dealer}
                      placeholder="Choose dealer..."
                      selected={selectedDealer}
                    />
                  </div>
                </div> */}

                {/* Category */}
                <div className="col-lg-6">
                  {/* <div className="mb-lg-5 mb-4">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <select name='category' onChange={onChange} value={form.category} className="form-select" aria-label="Default select example" placeholder='choose brand'>
                      <option value='' disabled>Choose One Category</option>
                      <option value="Refrigerator">Kulkas</option>
                      <option value="Freezer">Freezer</option>
                      <option value="Showcase">Showcase</option>
                      <option value="Mesin Cuci Twin Tube">Mesin Cuci Twin Tube</option>
                      <option value="Mesin Cuci Top Load">Mesin Cuci Top Load</option>
                      <option value="Drum Washing Machine">Mesin Cuci Front Load</option>
                      <option value="TV">LED TV</option>
                      <option value="Home Air Conditioner">Air Conditioner</option>
                      <option value="Blender and Juicer">Blender and Juicer</option>
                      <option value="Electric Kettle">Electric Kettle</option>
                      <option value="Microwave">Microwave</option>
                      <option value="Rice Cooker">Rice Cooker</option>
                      <option value="Vacuum Cleaner">Vacuum Cleaner</option>
                      <option value="Travel Cooker">Travel Cooker</option>
                      <option value="Electric Fan">Electric Fan</option>
                      <option value="Commercial Air Conditioner">Commercial Air Conditioner</option>
                      <option value="Water Heater">Water Heater</option>
                      <option value="Cooker Hood">Cooker Hood</option>
                      <option value="Kompor">Kompor</option>
                    </select>                  
                    <div className="text-danger">{errorCategory}</div>
                  </div> */}
                  <div className="col-lg-12">
                    <div className="mb-lg-5 mb-4">
                      <label htmlFor="product-model" className="form-label">
                        Category
                      </label>
                      <Typeahead
                        onInputChange={(v) => {
                          setDealerInput(v)
                        }}
                        id="basic-typeahead-single"
                        labelKey="categoryName"
                        onChange={setSelectedCategory}
                        options={category}
                        placeholder="Choose category..."
                        selected={selectedCategory}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="date-purchase" className="form-label">
                      Date of Purchase
                    </label>
                    <input
                      type="date"
                      max={maxPurchaseDate}
                      className={`form-control ${
                        errorDate !== '' ? 'is-invalid' : null
                      }`}
                      value={userData.date}
                      // value={data !== '' && data.DataOfPurchase.slice(0, 10)}
                      id="date-purchase"
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          ['date']: e.target.value,
                        })
                      }
                    />
                    <div className="invalid-feedback">{errorDate}</div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="store-location" className="form-label">
                      Store Name
                    </label>
                    <SelectSearch
                      options={newDataStore}
                      value={storeValue}
                      onChange={onChangeStore}
                      search
                      filterOptions={fuzzySearch}
                      placeholder="Search something"
                    />
                    <div className="text-danger" style={{ fontSize: 14 }}>
                      {errorStore}
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-lg-5 mb-4">
                    <label htmlFor="store-location" className="form-label">
                      Store Location
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="store-location"
                      value={storeStreet}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-lg-4">
                  {showFile1 !== '' ? (
                    <div className="col-lg-12 d-flex justify-content-center mb-3">
                      <img src={showFile1} alt="file" className="img-fluid" />
                    </div>
                  ) : null}
                  <div className="btn-upload-custom mb-4">
                    <div className="dropzone-wrapper">
                      <div className="dropzone-desc">
                        <span className="material-icons"> cloud_upload </span>
                        {
                          showFile1 !== '' ? 
                          <p style={{ fontSize: '0.8rem' }}>Re-upload Warranty Card</p> :
                          <p style={{ fontSize: '0.8rem' }}>Attach Your Warranty Card Here</p>
                        }
                      </div>
                      <input
                        type="file"
                        name="warranty_card"
                        aria-label="file"
                        className="dropzone"
                        onChange={onChangeFile}
                      />
                      {/* { errorData.file } */}
                    </div>
                    <div className="text-danger">{errorFile1}</div>
                  </div>
                </div>

                <div className="col-lg-4">
                  {showFile2 !== '' ? (
                    <div className="col-lg-12 d-flex justify-content-center mb-3">
                      <img src={showFile2} alt="file" className="img-fluid" />
                    </div>
                  ) : null}
                  <div className="btn-upload-custom mb-4">
                    <div className="dropzone-wrapper">
                      <div className="dropzone-desc">
                        <span className="material-icons"> cloud_upload </span>
                        {
                          showFile2 !== '' ? 
                          <p style={{ fontSize: '0.8rem' }}>Re-upload Invoice</p> :
                          <p style={{ fontSize: '0.8rem' }}>Attach Your Invoice Here</p>
                        }
                      </div>
                      <input
                        type="file"
                        name="invoice_card"
                        className="dropzone"
                        aria-label="file"
                        onChange={onChangeFile}
                      />
                      {/* { errorData.file } */}
                    </div>
                    <div className="text-danger">{errorFile2}</div>
                  </div>
                </div>

                <div className="col-lg-4">
                  {showFile3 !== '' ? (
                    <div className="col-lg-12 d-flex justify-content-center mb-3">
                      <img src={showFile3} alt="file" className="img-fluid" />
                    </div>
                  ) : null}
                  <div className="btn-upload-custom mb-4">
                    <div className="dropzone-wrapper">
                      <div className="dropzone-desc">
                        <span className="material-icons"> cloud_upload </span>
                        {
                          showFile3 !== '' ? 
                          <p style={{ fontSize: '0.8rem' }}>Re-upload Serial Number</p> :
                          <p style={{ fontSize: '0.8rem' }}>Attach Your Serial Number</p>
                        }
                      </div>
                      <input
                        type="file"
                        name="serial_number"
                        className="dropzone"
                        aria-label="file"
                        onChange={onChangeFile}
                      />
                      {/* { errorData.file } */}
                    </div>
                    <div className="text-danger">{errorFile2}</div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="Y"
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            ['agreements']: e.target.value,
                          })
                        }
                        checked={userData.agreements == 'Y'}
                      />
                      <label className="form-check-label">
                        {t('form_product_register.wa_flag')}
                      </label>
                    </div>
                  </div>
                </div>
                
                {
                  errorGSIS !== '' ?
                  <div className="text-danger">
                    {errorGSIS}
                  </div> : null
                }
                {
                  errorPost !== '' ?
                  <div className="text-danger">
                    {errorPost}
                  </div> : null
                }
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-color-primary py-lg-3 btn-submit"
                  disabled={isLoading ? 'disabled' : null}
                >
                  <div className="d-flex justify-content-center align-items-center">
                    {
                      isLoading ?
                      <div className="spinner-border text-primary me-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div> : null
                    }
                    <div>
                      Product Registration
                    </div>
                  </div>
                </button>
              </div>
            </form>
          </>
          : 'Loading..'
          }
        </div>
      </div> 
      <AlertModal data={messageModal}/>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    gtm_url: state.GTM_URL,
    token: state.GTM_TOKEN,
    base_url: state.BASE_URL,
    gsis_url: state.GSIS_URL,
    image_url: state.URL,
    gtm_token_url: state.GTM_TOKEN_URL,
    oapi_url: state.OAPI_URL
  };
};

export default connect(mapStateToProps, null)(UserRegisterProductManual);
