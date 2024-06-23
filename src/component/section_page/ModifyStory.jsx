import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../../css/story/modify_story.css';
import { getCookie } from '../../util/cookie';
import { session_check } from '../../util/session_check';
import ModifySwiper from './ModifySwiper';

axios.defaults.withCredentials = true;

const ModifyStory = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [currentPictures, setCurrentPictures] = useState([]);
    const [updatePictures, setUpdatePictures] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadImgFiles, setUploadImgFiles] = useState([])

    const [sTxt, setSTxt] = useState('');
    const [sIsPublic, setSIsPublic] = useState('0');
    const [spSaveDir, setSpSaveDir] = useState('')

	const s_no = useSelector(store => store.s_no);

    const fileInputRef = useRef(null);
    const maxFiles = 10;

    useEffect(() => {
    console.log('ModifyStory useEffect() called');

        let session = session_check();
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

        axios_get_story();

    }, [])

    const onImageHandler = (e) => {
        console.log('modify soty onImageHandler()')

        const imageFiles  = e.target.files;

        if ((imagePreviews.length + imageFiles.length) > maxFiles) {
            alert(`최대 ${maxFiles}개의 파일만 업로드 할 수 있습니다.`)

            const dataTransfer = new DataTransfer();
            for (let i = 0; i < (maxFiles - imagePreviews.length); i++) {
                if (imageFiles[i] instanceof File) {
                    dataTransfer.items.add(imageFiles[i]);
                }
            }
            fileInputRef.current.files = dataTransfer.files;
        }

        const files = e.target.files;
        setUploadImgFiles((preUploadImgFiles) => {
            const newUploadImgFiles = [...preUploadImgFiles];
            for(let i = 0; i < files.length; i++) {
                newUploadImgFiles.push(files[i]);
            }
            return newUploadImgFiles;
        });

        setImagePreviews((prePreviews) => {
            const newPreviews = [...prePreviews];
            for(let i = 0; i < files.length; i++) {
                const curImgURL = URL.createObjectURL(files[i]);
                newPreviews.push(curImgURL);
            }
            return newPreviews;
        })

    }

    const modifyStoryBtnClick = () => {
        console.log('modify story modifyStoryBtnClick()')

        if (updatePictures.length <= 0 && uploadImgFiles.length <= 0) {
            alert('스토리에 업로드 할 이미지가 없습니다. 이미지를 선택하세요.')

        } else if (sTxt === '') {
            alert('스토리에 업로드 할 내용을 작성해주세요..')
            $('#s_txt').focus();

        } else {
            let result = window.confirm('스토리를 수정하시겠습니까?');
            if (result) {
                axios_modify_story();
            }
        }

    }

    const picResetBtnClick = () => {
        console.log('modify story picResetBtnClick()')

    }

    const axios_modify_story = () => {
        console.log('modify story axios_modify_story()')

        let formData = new FormData();
        formData.append('s_no', s_no);
        formData.append('s_txt', sTxt);
        formData.append('s_is_public', sIsPublic);
        formData.append('curImg', currentPictures);
        formData.append('keepImg', updatePictures);
        formData.append('sp_save_dir', spSaveDir);
        for (let i = 0; i < uploadImgFiles.length; i++) {
            formData.append('files', uploadImgFiles[i]);
        }

        axios({
            url:`${process.env.REACT_APP_HOST}/story/story/modify_confirm`,
            method: 'post',
            data: formData,
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then((response) => {
            console.log('AXIOS MODIFY STORY COMMUNICATION SUCCESS', response.data);

            if (response.data === null || response.data.length === 0) {
                alert('스토리 수정에 실패하였습니다. 다시 시도해 주세요.');
                return;
            }

            if (response.data > 0) {
                alert('스토리 수정이 완료되었습니다.');
                return navigate('/');
            } 

        })
        .catch(error => {
            console.log('AXIOS MODIFY STORY COMMUNICATION ERROR', error);
        })

    }

    const axios_get_story = () => {
        console.log('ModifyStory axios_get_story() called');

        axios({
            url:`${process.env.REACT_APP_HOST}/story/story/get_story`,
            method: 'get',
            params: {
                s_no: s_no,
            },
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then(response => {
            console.log('AXIOS GET STORY COMMUNICATION SUCCESS', response.data);

            setSIsPublic(String(response.data[0].S_IS_PUBLIC));
            setSTxt(response.data[0].S_TXT);

            let pictures = [];
            let previews = [];
            for(let i = 0; i < response.data[0].pictures.length; i++) {
                pictures.push(response.data[0].pictures[i].SP_PICTURE_NAME);
                previews.push(`${process.env.REACT_APP_HOST}/${response.data[0].memberInfors[0].M_ID}/${response.data[0].pictures[i].SP_SAVE_DIR}/${response.data[0].pictures[i].SP_PICTURE_NAME}`);
            }

            setImagePreviews(previews);
            setCurrentPictures(pictures);
            setUpdatePictures(pictures);
            setSpSaveDir(response.data[0].pictures[0].SP_SAVE_DIR)

        })
        .catch(error => {
            console.log('AXIOS GET STORY COMMUNICATION ERROR', error);

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
                })
            }

        })
        .catch(error => {
            console.log('AXIOS GET ACCESS TOKEN COMMUNICATION ERROR', error);


        })

    }

    return (
        <div id='modify_story_wrap'>

            <div className='modify_img_wrap'>

                <ModifySwiper imagePreviews={imagePreviews} setImagePreviews={setImagePreviews} setUpdatePictures={setUpdatePictures} updatePictures={updatePictures} setUploadImgFiles={setUploadImgFiles} /> 

            </div>

            <div className='input_file_img'>
                <label htmlFor="file">사진추가</label> 
                <input 
                    type="file"
                    id="file"
                    className="input_image"
                    accept="image/*"    // 이미지 파일만 업로드 가능.
                    multiple
                    ref={fileInputRef}
                    onChange={e => onImageHandler(e)}
                />
            </div>

            <div className="select_is_public">
                <div className='public_p'>
                    <span>공개여부 &nbsp; </span>
                </div>
                <div className="select_public">
                    <label>
                        <input type="radio" name="s_is_public" value="0" checked={sIsPublic === "0"} onChange={(e) =>setSIsPublic(e.target.value)}/> 
                        <span> 전체공개 </span>
                    </label>
                </div>
                <div className="select_friend_public">
                    <label>
                        <input type="radio" name="s_is_public" value="1" checked={sIsPublic === "1"} onChange={(e) =>setSIsPublic(e.target.value)}/> 
                        <span> 일촌공개 </span>
                    </label>
                </div>
                <div className="select_private">
                    <label>
                        <input type="radio" name="s_is_public" value="-1" checked={sIsPublic === "-1"} onChange={(e) =>setSIsPublic(e.target.value)}/> 
                        <span> 비공개 </span>
                    </label>
                </div>
            </div> 

            <div className='modify_s_txt_wrap'>
                <div className='modify_s_txt'>
                    <textarea name="s_txt" value={sTxt} id="s_txt" cols="50" rows="8" onChange={(e) => setSTxt(e.target.value)} placeholder='스토리 내용 작성' />
                </div>
            </div>

            <div className="modify_story_btns">
                <button onClick={modifyStoryBtnClick} >등록</button>
                <button onClick={picResetBtnClick} >사진초기화</button>
            </div>

        </div>
    );
};

export default ModifyStory;