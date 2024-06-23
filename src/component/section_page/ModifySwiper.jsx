import $ from 'jquery';
import React from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const ModifySwiper = ({ imagePreviews, setImagePreviews, setUpdatePictures, updatePictures, setUploadImgFiles }) => {

    const imgDelBtnClick = (e) => {
        console.log('modify story imgDelBtnClick()')

        let idx = parseInt(e.currentTarget.dataset.idx);

        setImagePreviews((prevPreviews) => {
            const newPreviews = [...prevPreviews];
            newPreviews.splice(idx, 1);
            return newPreviews;
        });

        const delPictureUrl = e.currentTarget.dataset.name;
        const parts = delPictureUrl.split('/');
        const fileName = parts.pop();

        let updatedPictures = updatePictures.filter((picture) => {
            return picture !== `${fileName}`;
        })

        setUpdatePictures(updatedPictures);

        console.log('idx---', idx);
        console.log('updatePictures.length---', updatePictures.length);

        if (idx >= updatePictures.length) {
            setUploadImgFiles((preUploadImgFiles) => {
                const newUploadImgFiles = [...preUploadImgFiles];
                newUploadImgFiles.splice(Number(idx - updatePictures.length), 1);
                return newUploadImgFiles;
            })
        }

    }

    const imgPlusBtnClick = () => {
        console.log('modify story imgPlusBtnClick()')

        $('.input_file_img label').click();

    }

    return (
        <div>
            <Swiper
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView={4}
                navigation={true}
            >
                {
                    imagePreviews.map((image, index) =>
                        <SwiperSlide key={index}>
                            <div className='swiper_img_wrap'>
                                <div className='delete_btn'>    
                                    <span className='pic_num'>{index + 1}번</span>
                                    <span className='pic_del' 
                                        data-name={image}
                                        data-idx={`${index}`}   
                                        onClick={(e) => imgDelBtnClick(e)}
                                    >DEL</span>
                                </div>
                                <div className='swiper_img'>
                                    <img src={image} alt="" />
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                }
                <SwiperSlide>
                    <div className='swiper_img_wrap'>
                        <div className='delete_btn'>    
                            <span></span>
                        </div>
                        <div className='swiper_img_plus' 
                            onClick={imgPlusBtnClick}
                        >
                            <img src='/imgs/modify_add_icon.png' alt="" />
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default ModifySwiper;