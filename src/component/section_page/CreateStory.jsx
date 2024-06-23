import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useRef, useState } from 'react';
import Resizer from 'react-image-file-resizer';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/story/create_story.css';
import { getCookie } from '../../util/cookie';
import { session_check } from './../../util/session_check';
import ImageSwiper from './ImageSwiper';

axios.defaults.withCredentials = true;

const CreateStory = () => {

    const dispatch = useDispatch();
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadImage, setUploadImage] = useState([]);
    const loginedMember = useSelector(store => store.loginedMember);
    const [isPublic, setIsPublic] = useState('0');
    const [sTxt, setSTxt] = useState('')

    const fileInputRef = useRef(null);
    const maxFiles = 10;        // 최대 업로드 파일 개수
    
    useEffect(() => {
        console.log('CreateStory useEffect()');

        let session  = session_check();
        if(session !== null){
            console.log('[home] session_check enter!!');
            axios_get_access_token();
        }else{
            console.log('[home] session_check expired!!');
            sessionStorage.removeItem('sessionID');
            dispatch({
                type:'session_out',
            });
        }

    }, [])

    const navigate = useNavigate();

    /* 
    const onImageHandler = (e) => {

        const imageFiles = e.target.files;

        if ((imagePreviews.length + imageFiles.length) > maxFiles) {
            alert(`최대 ${maxFiles}개의 파일만 선택할 수 있습니다.`);
        
            // FileList 객체는 읽기 전용이므로 새로운 DataTransfer 객체를 생성하여 수정
            const dataTransfer = new DataTransfer();
        
            for (let i = 0; i < (maxFiles - imagePreviews.length); i++) {
                // 파일인지 아닌지 유효성 검사.
                if (imageFiles[i] instanceof File) {
                    dataTransfer.items.add(imageFiles[i]);
                }
            }

            // input 태그의 파일 목록을 업데이트
            fileInputRef.current.files = dataTransfer.files;
        }

        const files = e.target.files;

        setUploadImage((preUploadImgFiles) => {
            const newUploadImgFiles = [...preUploadImgFiles];
            for (let i = 0; i < files.length; i++) {
                newUploadImgFiles.push(files[i]);
            }
            return newUploadImgFiles;
        });

        setImagePreviews((preImgUrls)=> {
            const newImgUrls = [...preImgUrls];
            for(let i = 0; i < files.length; i++) {
                const imgUrl = URL.createObjectURL(files[i]);
                newImgUrls.push(imgUrl);
            }
            return newImgUrls;
        });

    }
    */

    const writeStoryClickBtn = () => {
        console.log('writeStoryClickBtn()')

        if (uploadImage.length <= 0) {
            alert('스토리에 업로드 할 이미지가 없습니다. 이미지를 선택하세요.')
        } else if (sTxt === '') {
            alert('스토리에 업로드 할 내용을 작성해주세요..')
            $('#s_txt').focus();
        } else {
            let result = window.confirm('스토리를 작성하시겠습니까?');
            if (result) {
                axios_write_story();
            }
        }
    }

    const picResetClickBtn = () => {
        console.log('picResetClickBtn()');

        setImagePreviews([]);
        setUploadImage([]);

    }

    const inputLabelBtnClick = () => {
        console.log('inputLabelBtnClick()')

        $('#create_story_wrap .input_file_img label').click();

    }

    const axios_write_story = () => {
        console.log('axios_write_story()');

        let formData = new FormData();
        formData.append("s_txt", sTxt);
        formData.append("s_is_public", isPublic);
        formData.append("m_id", loginedMember);
        for(let i = 0; i < uploadImage.length; i++) {
            formData.append("files", uploadImage[i]);
        }

        axios({
            url: `${process.env.REACT_APP_HOST}/story/story/write_confirm`,
            method: 'post',
            data: formData,
            headers: {
                'Authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then((response) => {
            console.log('axios_write_story communication success', response.data);

            if (response.data === -1) {
                sessionStorage.removeItem('ssesionID');
                dispatch({
                    type:'session_out',
                });
            }

            if(response.data === null) {
                return alert('서버 통신 중 오류가 발생했습니다. 다시 시도해주세요.')
            }

            if (response.data > 0) {
                alert('스토리 작성이 완료되었습니다.');

                navigate('/');

            }

        })
        .catch((error) => {
            console.log('axios_write_story communication error', error);

        })
        .finally(() => {
            sessionStorage.removeItem('ssesionID');
            sessionStorage.setItem('sessionID', getCookie('accessToken'));
        })

    }

    const axios_get_access_token = () => {
        console.log('modifyStory axios_get_access_token()')

        axios({
            url: `${process.env.REACT_APP_HOST}/auth/get_access_token`,
            method: 'get',
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then(response => {
            console.log('AXIOS GET ACCESS TOKEN COMMUNICATION SUCCESS', response.data);

            if(response.data === -1) {
                console.log('modifyStory session out');
                sessionStorage.removeItem('sessionID');
                dispatch({
                    type:'session_out',
                });
            } else {
                sessionStorage.removeItem('sessionID');
                sessionStorage.setItem('sessionID', getCookie('accessToken'));
                dispatch({
                    type:'session_enter',
                    loginedMember: response.data.loginedMember
                })
            }

        })
        .catch(error => {
            console.log('AXIOS GET ACCESS TOKEN COMMUNICATION ERROR', error);


        })

    }

    /*
    // 1개 파일 resizing
    const onImageHandler = async (e) => {
        console.log('onImageHandler()', e.target.files[0]);

        const file = await e.target.files[0];
        console.log("imgae incoding before : ", file);

        // 허용한 이미지 형식 정의
        const supepertedFormats = ["image/jpeg", "image/png", "image/svg+xml"];

        if (!e.target.files[0]) {
            return;
        }

        if (!supepertedFormats.includes(file.type)) {
            alert("지원되지 않는 이미지 형식입니다. JPEG, PNG형식의 이미지를 업로드해주세요.");
            return;
        }

        try {

            const compressedFile = await resizeFile(e.target.files[0]);
            console.log('image incoding after : ', compressedFile);

            // setImagePreview(String(compressedFile));
            // setUploadImage(String(compressedFile));


        } catch (error) {
            console.log('file resizing failed. ', error);
        }

    }

    const resizeFile = (file) => 
        new Promise((resolve) => {      //비동기 작업을 위해서 "Promise"를 통한 비동기 작업 정의 
            Resizer.imageFileResizer(   //Resizer의 "imageFileResize"메서드를 통해서 이미지 리사이징 및 인코딩 옵션 정의
                file,
                400,    // 이미지 너비
                400,    // 이미지 높이
                "SVG",  // 파일 형식
                100,    // 이미지 퀄리티
                0,
                (uri) => {
                    resolve(uri);
                },
                "blob",   // output format. base64 or blob
            )
        })
    */

    
    // multiple resizing
    const onImageHandler = async (e) => {
        console.log('onImageHandler()')

        const files = e.target.files;

        if ((imagePreviews.length + files.length) > maxFiles) {
            alert(`최대 ${maxFiles}개의 파일을 업로드 할 수 있습니다.`);
            return;
        }

        for (let i = 0; i < (maxFiles - files.length); i++) {
            let file = files[i];

            try {

                const compressedFile = await resizeFile(file);
                const imgUrl = URL.createObjectURL(file);

                setImagePreviews((preImgUrls) => {
                    const newImgUrls = [...preImgUrls];
                    newImgUrls.push(imgUrl);
                    console.log('newImgUrls---', newImgUrls);
                    return newImgUrls;
                });
                
                setUploadImage((preCompressedFiles) => {
                    const newCompressedFiles = [...preCompressedFiles];
                    newCompressedFiles.push(compressedFile);
                    console.log('newCompressedFiles---', newCompressedFiles);
                    return newCompressedFiles;
                });

            } catch (error) {
                console.log("file resizing failed:", error);
            }
        }

    }

    const resizeFile = (file) =>
        new Promise((resolve) => {          //비동기 작업을 위해서 "Promise"를 통한 비동기 작업 정의 
            Resizer.imageFileResizer(       //Resizer의 "imageFileResize"메서드를 통해서 이미지 리사이징 및 인코딩
                file,
                file.width,    // 이미지 너비
                file.height,    // 이미지 높이
                "jpeg",  // 파일 형식
                80,    // 이미지 퀄리티
                0,
                (uri) => {
                resolve(uri); 
                },
                "blob"        // output format. base64 or blob
            );
        }
    );
    

    return (
        <div id='create_story_wrap'>
            
            <div className='story_img_wrap'>
                <div className='preview_img_wrap'>

                    {
                        imagePreviews.length > 0
                        ?
                        <ImageSwiper imagePreviews={imagePreviews} setImagePreviews={setImagePreviews} setUploadImage={setUploadImage} />
                        :
                        <div className='label_img'
                            onClick={inputLabelBtnClick}
                        >
                            <label>사진첨부</label> 
                        </div>
                    }

                </div>
            </div>
            
            <div className="select_is_public">
                <div className='public_p'>
                    <span>공개여부 &nbsp; </span>
                </div>
                <div className="select_public">
                    <label>
                        <input type="radio" name="s_is_public" value="0" checked={isPublic === '0'} onChange={(e) =>setIsPublic(e.target.value)}/> 
                        <span> 전체공개 </span>
                    </label>
                </div>
                <div className="select_friend_public">
                    <label>
                        <input type="radio" name="s_is_public" value="1" checked={isPublic === '1'} onChange={(e) =>setIsPublic(e.target.value)}/> 
                        <span> 일촌공개 </span>
                    </label>
                </div>
                <div className="select_private">
                    <label>
                        <input type="radio" name="s_is_public" value="-1" checked={isPublic === '-1'} onChange={(e) =>setIsPublic(e.target.value)}/> 
                        <span> 비공개 </span>
                    </label>
                </div>
            </div>

            <div className='write_s_txt'>
                <div className='input_s_txt'>
                    <textarea name="s_txt" value={sTxt} id="s_txt" cols="50" rows="8" onChange={(e) => setSTxt(e.target.value)} placeholder='스토리 내용 작성' />
                </div>
            </div>

            <div className='story_btns'>
                <button onClick={writeStoryClickBtn} >등록</button>
                <button onClick={picResetClickBtn} >사진초기화</button>
            </div>

            <div className='input_file_img'>
                <label htmlFor="file">사진첨부</label> 
                <input 
                    type="file"
                    id="file"
                    className="input_image"
                    accept="image/*"    // 이미지 파일만 업로드 가능.
                    ref={fileInputRef}
                    multiple
                    onChange={e => onImageHandler(e)}
                />
            </div>

        </div>
    )
}

export default CreateStory;