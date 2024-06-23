import $ from 'jquery';
import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination } from 'swiper/modules';
import '../../css/story/img_swiper.css';

const ImageSwiper = ({ imagePreviews, setUploadImage, setImagePreviews }) => {

    useEffect(() => {
        console.log('imagePreviews---', imagePreviews);
    }, [])

    const picDeleteClickBtn = (e) => {
        console.log('picDeleteClickBtn()');

        let idx = parseInt(e.currentTarget.dataset.idx);

        setImagePreviews((prevPreviews) => {
            const newPreviews = [...prevPreviews];
            newPreviews.splice(idx, 1);
            return newPreviews;
        });

        setUploadImage((prevPreviews) => {
            const newPreviews = [...prevPreviews];
            newPreviews.splice(idx, 1);
            return newPreviews;
        });

    };

    const plusImgBtnClick = () => {
        console.log('plusImgBtnClick()')

        $('#create_story_wrap .input_file_img label').click();

    }

    return (
        <Swiper
            spaceBetween={10}
            slidesPerView={1}
            navigation={true}
            pagination={{
                clickable: true,
            }}
            modules={[Navigation, Pagination]}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log('swiper')}
        >
            {
                imagePreviews.map((image, index) =>
                    <SwiperSlide key={index}>
                        <div className='img_wrap'>
                            <img src={image} alt={`Slide ${index}`} />
                        </div>
                        <div className='pic_num_box' 
                            style={{
                                width: '20px',
                                height: '20px',
                                lineHeight: '20px',
                                position : 'absolute',
                                top : '10px',
                                left : '15px',
                                cursor : 'pointer',
                                zIndex : '1000',
                                backgroundColor: '#2186e4',
                                borderRadius: '20px'
                            }}
                            >
                            <p className='pic_num'
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    color : '#fff',
                                }}
                            >{index + 1}</p>
                        </div>
                        <div className='delete_box' data-idx={`${index}`}
                            style={{
                                width: '20px',
                                height: '20px',
                                lineHeight: '20px',
                                position : 'absolute',
                                top : '10px',
                                right : '15px',
                                cursor : 'pointer',
                                zIndex : '1000',
                                backgroundColor: '#2186e4',
                                borderRadius: '20px'
                            }}
                            onClick={(e) => picDeleteClickBtn(e)}
                        >
                            <p 
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    color : '#fff',
                                }}
                            >X</p>
                        </div>
                    </SwiperSlide>
                )
            }
            <SwiperSlide>
                <div className="img_wrap">
                    <div className='plus_img_wrap'
                        onClick={plusImgBtnClick}
                    >
                        <img src="/imgs/modify_add_icon.png" alt="" />
                    </div>
                    <div className='delete_box'>
                        <span></span>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export default ImageSwiper;