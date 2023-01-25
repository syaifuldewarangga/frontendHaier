import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Barcode from 'react-barcode';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';


function ImageConverter({imageUrl}) {
    const [base64, setBase64] = useState('');
  
    useEffect(() => {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
  
      img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
  
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
  
        var dataURL = canvas.toDataURL('image/png');
        setBase64(dataURL);
      };
    }, [imageUrl]);
  
    return base64
}

const PromoCard = (props) => {
    const [data, setData] = useState({})
    const [imageHeader, setImageHeader] = useState('')
    const [imageFooter, setImageFooter] = useState('')
    const [loading, setLoading] = useState(false)
    const reff = useRef()
    // const imageTemp = ImageConverter('https://images.tokopedia.net/img/cache/215-square/shops-1/2020/3/19/8061075/8061075_fe845eb0-8faf-47af-ae30-5ff86a035a37.png') 
    const imageHeaderRef = useRef()
    const imageFooterRef = useRef()
    // const toDataUri = async (url, type) => {
    //     // const imageUrl = 'https://res.cloudinary.com/bdonglot/image/upload/v1629976525/xdxe6mktp3lurdpawh5y.jpg';
    //     const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzuY0GyRoqleLRsfRTur4mf6VcREuMGDvwpw&usqp=CAU';
    //     // const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF7lpPszVwxRZwTZP1gEh1bbJsUffnssueqA&usqp=CAU'
    //     // const imageUrl = 'https://testimages.aquajapanid.com:8180/article/%20Cara%20Menjaga%20Kebersihan%20Udara%20di%20Rumah.jpg'
    //     // const imageUrl = 'https://testimages.aquajapanid.com:8180/article/%20Cara%20Menjaga%20Kebersihan%20Udara%20di%20Rumah.jpg'
    //     // const imageUrl = ''
    //     console.log(imageUrl)
    //     var img = new Image();
    //     img.crossOrigin = "anonymous";
    //     img.src = imageUrl;
    //     img.style.height = '15vh'
    //     img.style.objectFit = 'cover'
    //     img.style.objectPosition = 'center'
    //     img.onload = function() {
    //         var canvas = document.createElement('canvas');
    //         canvas.width = img.width;
    //         canvas.style.height = '15vh';
    //         canvas.style.objectFit = 'cover'
    //         canvas.style.objectPosition = 'center'

    //         var ctx = canvas.getContext('2d');
    //         ctx.drawImage(img, 0, 0);

    //         var dataURL = canvas.toDataURL('image/png');
    //         console.log(dataURL)
    //         if(type == 'footer'){
    //             setImageFooter(dataURL)
    //         }else{
    //             setImageHeader(dataURL)
    //         }
    //     };

    //     // fetch(imageUrl, {
    //     //     method: 'GET',
    //     //     mode: 'cors',
    //     //     headers: {
    //     //       'Content-Type': 'application/json'
    //     //     }
    //     //   })
    //     //   .then(response => response.blob())
    //     //   .then(blob => {
    //     //     var reader = new FileReader();
    //     //     reader.onloadend = () => {
    //     //       setImageHeader(reader.result);
    //     //       console.log(reader)
    //     //     }
    //     //     reader.readAsDataURL(blob);
    //     //   })
    //     //   .catch(error => {
    //     //     console.log(error);
    //     //   });

    //     // const xhr = new XMLHttpRequest();
    //     // xhr.open('GET', imageUrl, true);
    //     // xhr.responseType = 'arraybuffer';
    //     // xhr.onload = function(e) {
    //     //     var uInt8Array = new Uint8Array(this.response);
    //     //     console.log(uInt8Array)
    //     //     var i = uInt8Array.length;
    //     //     var binaryString = new Array(i);
    //     //     while (i--)
    //     //         binaryString[i] = String.fromCharCode(uInt8Array[i]);
    //     //     var data = binaryString.join('');
    //     //     var base64 = window.btoa(data);
    //     //     console.log(base64)
    //     //     setImageHeader(base64);
    //     // };
    //     // xhr.send();
    // }
    const createPDF = async () => {   
        const pdf = new jsPDF("portrait", "pt", [595 , 842], true);
        const data = await html2canvas(reff.current, {
            useCORS: true,
            quality: 2,
            scale: 5,
            proxy: props.image_url,
            allowTaint: false,
            logging: true,
        });
        const img = data.toDataURL("image/jpeg", 1);  
        // html - to - img
        // const img = await toJpeg(reff.current, { quality: 1 })
        // const img = await toJpeg(reff.current, { quality: 1 })
        // if (window.saveAs) {
        //     window.saveAs(img, 'my-node.png');
        // } else {

        // }
        // const imgProperties = pdf.getImageProperties(img);
        // const pdfWidth = pdf.internal.pageSize.getWidth();
        // const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        // pdf.addImage(img, "PNG", 140, 0, 595, 842 );
        pdf.addImage(img, "JPEG", 0, 0, 595 , 842);
        pdf.save("promo_card.pdf");
        // download("data:image/png;"+base64image, "qr-code-event" + eventName+".png")

        // var link = document.createElement('a');
        // link.download = 'my-image-name.jpeg';
        // link.href = img;
        // link.click();

        // const pdf = new jsPDF("portrait", "pt", "a4");
        // const data = document.querySelector("#pdf");
        // pdf.html(data).then(() => {
        //   pdf.save("shipping_label.pdf");
        // });



        // const pdf = new jsPDF("portrait", "pt", "a4");
        // pdf.setFontSize(16).text('Extended Warranty Letter', 0.5, 1.0);

        // // create a line under heading 
        // pdf.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
        // // Using autoTable plugin
        // // pdf.autoTable({
        // //   columns,
        // //   body: this.items,
        // //   margin: { left: 0.5, top: 1.25 }
        // // });
        // // Using array of sentences
        // pdf
        //   .setFont("helvetica")
        //   .setFontSize(12)
        //   .text('Extended Warranty Letter', 0.5, 3.5, { align: "left", maxWidth: "7.5" });
        
        // // Creating footer and saving file
        // pdf
        //   .setTextColor(0, 0, 255)
        //   .text(
        //     "This is a simple footer located .5 inches from page bottom",
        //     0.5,
        //     pdf.internal.pageSize.height - 0.5
        //   )
        //   .save(`testing.pdf`);
    };
    const getImage = async (promo_id) => {
        const res = await axios.get(props.oapi_url + 'extended-warranty-promo/card/images', {
            params: {
                promo_id,
            }
        })
        // console.log(res.data)
        if(res.data.card_header !== null) setImageHeader('data:image/png;base64,' + res.data.card_header)
        if(res.data.card_footer !== null) setImageFooter('data:image/png;base64,' + res.data.card_footer)
    }
    useEffect(() => {
        let m = true 
        if(m) {
            setData(props.data)
            setLoading(true)
        }
        return () => m = false
    }, [])
    // useEffect(() => {
    //     let m = true 
    //     if(m && loading) {
    //         setLoading(false)
    //         if(props.data.promo !== null){
    //             if(props.data.promo.card.card_header !== null){
    //                 toDataUri(props.image_url + props.data.promo.card.card_header, 'header')
    //             }
    //             if(props.data.promo.card.card_footer !== null){
    //                 toDataUri(props.image_url + props.data.promo.card.card_footer, 'footer')
    //             }
    //         }
    //     }
    //     return () => m = false
    // }, [loading])
    useEffect(() => {
        if(props.data.promo !== null){
            getImage(props.data.promo.promo_id)
        }
    }, [props.data.promo])
    
    return (
        <div>
            <div>
                <div className="d-flex mb-2">
                    <button onClick={createPDF} className='btn btn-secondary w-100 d-flex align-items-center justify-content-center'>
                        <span className="material-icons">print</span>
                        Print
                    </button>
                </div>
                <div ref={reff} id="pdf">
                    {/* modal full screen */}
                    {/* <div className='w-100'>
                        <div className="bg-primary" style={{ height: '20vh', display: 'flex', alignItems: 'center' }}>
                            <img style={{ height: '15vh', marginLeft: '2rem', position: 'absolute' }} src="https://images.tokopedia.net/img/cache/215-square/shops-1/2020/3/19/8061075/8061075_fe845eb0-8faf-47af-ae30-5ff86a035a37.png" alt="" />
                        </div>
                        <div className="container-fluid">
                            <div className="row p-5">
                                <div className="col-12">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <p style={{ textAlign: 'center', textDecoration: 'underline', fontSize: '3rem', marginTop: '15px', fontWeight: 'bold' }}>Extended Warranty Letter</p>
                                        <p style={{ textAlign: 'center', fontSize: '2.1rem', marginTop: '-30px' }}>Surat Perpanjangan Garansi</p>
                                        <div className="p-5">
                                            <Barcode value='1234123456781234' />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-5">
                                    <p style={{ fontWeight: 'bold', fontSize: '2.1rem' }}>Garansi tambahan meliputi (Extended Warranty Including)</p>
                                    <p style={{ fontSize: '1.9rem' }}> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore saepe aspernatur asperiores deleniti cupiditate ipsam esse consectetur, ducimus blanditiis, aperiam dolores placeat voluptatibus vel exercitationem consequuntur laboriosam possimus recusandae eligendi accusamus. Expedita laudantium assumenda, obcaecati magnam facere laborum? Eveniet ab molestiae quos doloremque possimus cumque nostrum in enim rem reprehenderit sint, nisi eligendi, quod molestias blanditiis natus. Sint tenetur laudantium cumque deleniti aliquam omnis repellendus fuga et incidunt nulla qui, ipsam sed eum culpa ex fugit itaque necessitatibus vero maiores provident recusandae. In dicta dolorum eveniet accusamus eaque vel quia voluptate exercitationem obcaecati amet. Id hic quae et dignissimos architecto? </p>
                                </div>
                                <div className="col-12">
                                    <p style={{ fontWeight: 'bold', fontSize: '2.1rem' }}>Untuk Produk Sebagai Berikut (for product as follow)</p> 
                                    <ul>
                                        <li>
                                            <div className="d-flex">
                                                <p style={{ fontWeight: 'bold', fontSize: '1.9rem', width: '20%' }}>Product</p> 
                                                <p style={{ fontWeight: 'bold', fontSize: '1.9rem' }}>AC AQUA</p> 
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <p style={{ fontWeight: 'bold', fontSize: '1.9rem', width: '20%' }}>Model</p> 
                                                <p style={{ fontWeight: 'bold', fontSize: '1.9rem' }}>AQA-AKNC</p> 
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <p style={{ fontWeight: 'bold', fontSize: '1.9rem', width: '20%' }}>Serial Number</p> 
                                                <p style={{ fontWeight: 'bold', fontSize: '1.9rem' }}>1235454212151251</p> 
                                            </div>
                                        </li>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.9rem', fontStyle: 'italic', marginTop: '50px' }}>*Promo ini valid jika promo terdaftar dan bisa diverifikasi secara online diwebsite(The promo is valid if the promo number is registered and can be verified on the website)https://ewarranty.aquajapanid.com:80</p> 

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <footer style={{ backgroundColor: '#013661', color: 'white', height: '600px' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center' }}>AQUA JAPAN PRODUCT SERVICE & SUPPORT</p>
                            <p style={{ fontSize: '1.5rem', textAlign: 'center' }}>Kami dapat membantu menjawab pertanyaan seputar produk, perawatan, penggunaan, perbaikan, dan pemelihataan produk AQUA JAPAN Anda.</p>
                            <div className="d-flex justify-content-evenly">
                                <div className="d-flex flex-column p-5">
                                    <p style={{ fontSize: '1.5rem', }}>LIVE CHAT</p>
                                    <p style={{ fontSize: '1.1rem', }}>Senin - Jumat</p>
                                    <p style={{ fontSize: '1.1rem', }}>07:00 - 19:00 WIB</p>
                                    <p style={{ fontSize: '1.1rem', }}>Sabtu, Minggu & Hari libur</p>
                                    <p style={{ fontSize: '1.1rem', }}>08:00 - 12:00 WIB</p>
                                </div>

                                <div className="d-flex flex-column p-5">
                                    <p style={{ fontSize: '1.5rem', }}>CALL CENTER</p>
                                    <p style={{ fontSize: '1.5rem', color: 'orange', marginTop: '-20px' }}>BEBAS PULSA</p>
                                    <p style={{ fontSize: '1.5rem', color: 'orange', marginTop: '-20px' }}>0800 1 003 003</p>
                                    <p style={{ fontSize: '1.1rem', }}>Senin - Jumat</p>
                                    <p style={{ fontSize: '1.1rem', }}>07:00 - 19:00 WIB</p>
                                    <p style={{ fontSize: '1.1rem', }}>Sabtu, Minggu & Hari libur</p>
                                    <p style={{ fontSize: '1.1rem', }}>08:00 - 12:00 WIB</p>
                                </div>

                                <div className="d-flex flex-column p-5">
                                    <p style={{ fontSize: '1.5rem', }}>SMS & Whatsapp</p>
                                    <p style={{ fontSize: '1.1rem', }}>0858-1000-3003</p>
                                </div>

                                <div className="d-flex flex-column p-5">
                                    <p style={{ fontSize: '1.5rem', }}>EMAIL</p>
                                    <p style={{ fontSize: '1.1rem', }}>custcare@haier.co.id</p>
                                </div>
                            </div>
                        </footer>
                    </div> */}

                    {/* modal normal */}
                    <div className='w-100' style={{ backgroundColor: 'white', color: 'black' }}>
                        {props.data.promo !== null && props.data.promo.card.card_header !== null ?
                            <div style={{ height: '10vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {/* <div className='w-100' style={{ height: '8vh', backgroundImage: "url(" + 'https://images.tokopedia.net/img/cache/215-square/shops-1/2020/3/19/8061075/8061075_fe845eb0-8faf-47af-ae30-5ff86a035a37.png'+ ")", objectFit: 'cover', objectPosition: 'center', borderRadius: '6px' }} alt="alt" /> */}
                                <div className='w-100' style={{ height: '10vh', width: '100%', backgroundImage: "url(" + imageHeader + ")", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} alt="alt" />
                                {/* <img ref={imageHeaderRef} className='w-100' style={{ height: '10vh' }} src={imageHeader} alt="header" /> */}
                                {/* <img className='w-100' style={{ height: '8vh', objectFit: 'cover', objectPosition: 'center', borderRadius: '6px' }} src={'https://images.tokopedia.net/img/cache/215-square/shops-1/2020/3/19/8061075/8061075_fe845eb0-8faf-47af-ae30-5ff86a035a37.png'} alt="alt" /> */}
                            </div>
                        :
                        <div className="bg-primary" style={{ height: '10vh', display: 'flex', alignItems: 'center' }}>
                            <img style={{ height: '8vh', borderRadius: '6px', marginLeft: '2rem', position: 'absolute' }} src="https://images.tokopedia.net/img/cache/215-square/shops-1/2020/3/19/8061075/8061075_fe845eb0-8faf-47af-ae30-5ff86a035a37.png" alt="" />
                        </div>
                        }
                        <div className="container-fluid" style={{ backgroundColor: 'white', color: 'black' }}>
                            <div className="row p-1">
                                <div className="col-12">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        {props.data.promo !== null && props.data.promo.card.title_primary !== null ?
                                        <p style={{ textAlign: 'center', textDecoration: 'underline', fontSize: '1rem', marginTop: '5px', fontWeight: 'bold' }}>{props.data.promo.card.title_primary}</p>
                                        :
                                        <p style={{ textAlign: 'center', textDecoration: 'underline', fontSize: '1rem', marginTop: '5px', fontWeight: 'bold' }}>Extended Warranty Letter</p>
                                        }
                                        {props.data.promo !== null && props.data.promo.card.title_secondary !== null ?
                                        <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '-20px' }}>{props.data.promo.card.title_secondary}</p>
                                        :
                                        <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '-20px' }}>Surat Perpanjangan Garansi</p>
                                        }
                                        <div className="">
                                            {props.data.promo !== null && 
                                                <Barcode format='CODE128' width={1.6} height={60} value={props.data.promo.card.user_promo_code} />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-2" style={{ minHeight: '10vh' }}>
                                    {props.data.promo !== null && props.data.promo.card.content_primary !== null ?
                                    <p style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>{props.data.promo.card.content_primary}</p>
                                    :
                                    <p style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>Garansi Tambahan Meliputi (Extended Warranty Including)</p>
                                    }
                                    {props.data.promo !== null && props.data.promo.card.content_secondary !== null ?
                                    <p style={{ fontSize: '0.6rem' }}>{props.data.promo.card.content_secondary}</p>
                                    :
                                    <p style={{ fontSize: '0.6rem' }}> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore saepe aspernatur asperiores deleniti cupiditate ipsam esse consectetur, ducimus blanditiis, aperiam dolores placeat voluptatibus vel exercitationem consequuntur laboriosam possimus recusandae eligendi accd hic quae et dignissimos architecto? </p>
                                    }
                                </div>
                                <div className="col-12">
                                    <p style={{ fontWeight: 'bold', fontSize: '0.71rem' }}>Untuk Produk Sebagai Berikut (for product as follow)</p> 
                                    <ul style={{ lineHeight: '1px' }}>
                                        <li>
                                            <div className="d-flex">
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem', width: '30%' }}>Product</p> 
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem' }}>{props.data.product_name}</p> 
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem', width: '30%' }}>Model</p> 
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem' }}>{props.data.product_model}</p> 
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem', width: '30%' }}>Serial Number</p> 
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem' }}>{props.data.serial_number}</p> 
                                            </div>
                                        </li>
                                    </ul>
                                        <p style={{ fontWeight: 'bold', fontSize: '0.5rem', fontStyle: 'italic' }}>*Promo ini valid jika promo terdaftar dan bisa diverifikasi secara online diwebsite(The promo is valid if the promo number is registered and can be verified on the website)https://ewarranty.aquajapanid.com:80</p> 
                                </div>
                            </div>
                        </div>
                        {props.data.promo !== null && props.data.promo.card.card_footer !== null ?
                        <div style={{ height: '15vh', width: '100%', display: 'flex', alignItems: 'center' }}>
                            {/* <div className='w-100' style={{ height: '8vh', backgroundImage: "url(" + 'https://images.tokopedia.net/img/cache/215-square/shops-1/2020/3/19/8061075/8061075_fe845eb0-8faf-47af-ae30-5ff86a035a37.png'+ ")", objectFit: 'cover', objectPosition: 'center', borderRadius: '6px' }} alt="alt" /> */}
                            <div className='w-100' style={{ height: '15vh', width: '100%', backgroundImage: "url(" + imageFooter + ")", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} alt="alt" />
                            {/* <img className='w-100' style={{ height: '15vh', objectFit: 'cover', objectPosition: 'center', borderRadius: '6px' }} src={props.image_url + props.data.promo.card.card_footer} alt="alt" /> */}
                            {/* <img ref={imageFooterRef} className='w-100' style={{ height: '15vh', objectFit: 'cover', objectPosition: 'center' }} src={imageFooter} alt="footer" /> */}
                        </div>
                        :
                        <footer style={{ backgroundColor: '#013661', color: 'white' }}>
                            <p style={{ paddingTop: '10px', fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>AQUA JAPAN PRODUCT SERVICE & SUPPORT</p>
                            <p style={{ fontSize: '0.5rem', textAlign: 'center' }}>Kami dapat membantu menjawab pertanyaan seputar produk, perawatan, penggunaan, perbaikan, dan pemelihataan produk AQUA JAPAN Anda.</p>
                            <div className="d-flex justify-content-evenly">
                                <div className="d-flex flex-column">
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px' }}>LIVE CHAT</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px' }}>Senin - Jumat</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px' }}>07:00 - 19:00 WIB</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px' }}>Sabtu, Minggu & Hari libur</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px' }}>08:00 - 12:00 WIB</p>
                                </div>

                                <div className="d-flex flex-column">
                                    <p style={{ fontSize: '0.5rem',  }}>CALL CENTER</p>
                                    <p style={{ fontSize: '0.5rem', color: 'orange', marginTop: '-20px' }}>BEBAS PULSA</p>
                                    <p style={{ fontSize: '0.5rem', color: 'orange', marginTop: '-20px' }}>0800 1 003 003</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px' }}>Senin - Jumat</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px'}}>07:00 - 19:00 WIB</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px' }}>Sabtu, Minggu & Hari libur</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px'}}>08:00 - 12:00 WIB</p>
                                </div>

                                <div className="d-flex flex-column">
                                    <p style={{ fontSize: '0.5rem',  }}>SMS & Whatsapp</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px' }}>0858-1000-3003</p>
                                </div>

                                <div className="d-flex flex-column">
                                    <p style={{ fontSize: '0.5rem', }}>EMAIL</p>
                                    <p style={{ fontSize: '0.5rem', marginTop: '-10px' }}>custcare@haier.co.id</p>
                                </div>
                            </div>
                        </footer>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromoCard