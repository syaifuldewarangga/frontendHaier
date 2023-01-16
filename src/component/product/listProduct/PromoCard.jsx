import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Barcode from 'react-barcode';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

const PromoCard = () => {
    const [display, setDisplay] = useState('none')
    const reff = useRef()
    const createPDF = async () => {   
        const pdf = new jsPDF("portrait", "pt", [595 , 842], true); 
        const data = await html2canvas(reff.current, {
            useCORS: true,
            quality: 2,
            scale: 5,
            onrendered: function(canvas)
            {
              document.body.appendChild(canvas);
            },
            logging: true
          });
        const img = data.toDataURL("image/png");  
        const imgProperties = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
        // pdf.addImage(img, "PNG", 140, 0, 595, 842 );
        pdf.addImage(img, "PNG", 0, 0, 595 , 842);
        pdf.save("shipping_label.pdf");


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
    useEffect(() => {
        let m = true 
        // if(m) createPDF()
        return () => m = false
    }, [])
    
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
                    <div className='w-100'>
                        <div className="bg-primary" style={{ height: '10vh', display: 'flex', alignItems: 'center' }}>
                            <img style={{ height: '8vh', borderRadius: '6px', marginLeft: '2rem', position: 'absolute' }} src="https://images.tokopedia.net/img/cache/215-square/shops-1/2020/3/19/8061075/8061075_fe845eb0-8faf-47af-ae30-5ff86a035a37.png" alt="" />
                        </div>
                        <div className="container-fluid">
                            <div className="row p-1">
                                <div className="col-12">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <p style={{ textAlign: 'center', textDecoration: 'underline', fontSize: '1rem', marginTop: '5px', fontWeight: 'bold' }}>Extended Warranty Letter</p>
                                        <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '-20px' }}>Surat Perpanjangan Garansi</p>
                                        <div className="">
                                            <Barcode height={60} value='1234123456781234' />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-2">
                                    <p style={{ fontWeight: 'bold', fontSize: '0.7rem' }}>Garansi tambahan meliputi (Extended Warranty Including)</p>
                                    <p style={{ fontSize: '0.6rem' }}> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore saepe aspernatur asperiores deleniti cupiditate ipsam esse consectetur, ducimus blanditiis, aperiam dolores placeat voluptatibus vel exercitationem consequuntur laboriosam possimus recusandae eligendi accd hic quae et dignissimos architecto? </p>
                                </div>
                                <div className="col-12">
                                    <p style={{ fontWeight: 'bold', fontSize: '0.71rem' }}>Untuk Produk Sebagai Berikut (for product as follow)</p> 
                                    <ul style={{ lineHeight: '1px' }}>
                                        <li>
                                            <div className="d-flex">
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem', width: '20%' }}>Product</p> 
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem' }}>AC AQUA</p> 
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem', width: '20%' }}>Model</p> 
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem' }}>AQA-AKNC</p> 
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem', width: '20%' }}>Serial Number</p> 
                                                <p style={{ fontWeight: 'bold', fontSize: '0.6rem' }}>1235454212151251</p> 
                                            </div>
                                        </li>
                                    </ul>
                                        <p style={{ fontWeight: 'bold', fontSize: '0.5rem', fontStyle: 'italic' }}>*Promo ini valid jika promo terdaftar dan bisa diverifikasi secara online diwebsite(The promo is valid if the promo number is registered and can be verified on the website)https://ewarranty.aquajapanid.com:80</p> 
                                </div>
                            </div>
                        </div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromoCard