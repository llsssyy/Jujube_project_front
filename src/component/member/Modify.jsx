import axios from 'axios';
import $ from 'jquery';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/member/modify_form.css';

axios.defaults.withCredentials = true

const Modify = () => {
    
    const navigate = useNavigate();
    const sessionID = useSelector(store => store.sessionID);
    const dispatch = useDispatch();
    
    
    const [mId, setMId] = useState('');
    const [mName, setMName] = useState('');
    const [mMail, setMMail] = useState('');
    const [mPhone, setMPhone] = useState('');
    const [mSelfIntroduction, setMSelfIntroduction] = useState('');
    const [mProfileThumbnail, setMProfileThumbnail] = useState('');
    const [mModifyProfileThumbnail, setModifyMProfileThumbnail] = useState('');
    const [mGender, setGender] = useState('M');
    
    useEffect(() => {
        console.log('modify useEffect()');

            modify_get_member();

            let token = sessionStorage.getItem('sessionID');
            console.log('token----', jwtDecode(token)) ;

    }, []);

    

    const getUploadClickHandler = () => {
        $('.filebox input[name="m_profile_thumbnail"]').click();
    }

    const ProfileThumbnailChagneHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {

            // 파일의 데이터 URL 가져오기
            const previewUrl = event.target.result;

            // 이미지를 보여줄 img 요소를 선택하여 소스를 설정
            document.getElementById('preview').src = previewUrl;
        };

        setModifyMProfileThumbnail(e.target.value);

        if (file) {
            // 파일이 선택된 경우에만 읽어옴
            reader.readAsDataURL(file);
        } else {
            // 파일이 선택되지 않은 경우에는 기존의 이미지를 유지함
            setMProfileThumbnail(file);
        }
    }

    const modifyClickHandler = () => {
        console.log('modifyClickHandler()');

        let form = document.modify_form;

        if (mName === '') {
            alert('새로운 이름을 입력하세요');
            form.m_name.focus();

        } else if (mMail === '') {
            alert('새로운 메일을 입력하세요');
            form.m_mail.focus();

        } else if (mPhone === '') {
            alert('새로운 핸드폰 번호를 입력하세요');
            form.m_phone.focus();

        } else  {
            axios_member_modify();

        }
    }   

    const deleteBtnClickHandler = () => {
        console.log("deleteClickHandler()");
       
        const isConfirmed = window.confirm("정말로 계정을 삭제하시겠습니까?");

        if (isConfirmed) {
            console.log("delete()");
            axios_delete_member();
            sessionStorage.removeItem('sessionID');
            dispatch({
                type:'session_out',
                sessionID: null,
                loginedMember: '',
            });
            navigate('/');
        }

    }

    const modify_get_member = () => {
        console.log('modify_get_member()')

        axios({
            url: `${process.env.REACT_APP_HOST}/member/get_member`, 
            method: 'get',
            headers: {
                'Authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then(response => {
            console.log('AXIOS GET MEMBER COMMUNICATION SUCCESS', response.data);

            if(response.data === -1){
                console.log('modify session out');
                sessionStorage.removeItem('sessionID');
                dispatch({
                    type: 'session_out',
                    sessionID: null,
                    loginedMember: '',
                });
                navigate('/');
            }else{
                
                if (response.data === null) {
                    alert("정보를 가져오는데 실패했습니다.");
                    
                }else{
                    const memberData = response.data.member;

                    setMId(memberData.M_ID);
                    setMMail(memberData.M_MAIL);
                    setMName(memberData.M_NAME);
                    setMPhone(memberData.M_PHONE);
                    setGender(memberData.M_GENDER);
                    setMSelfIntroduction(memberData.M_SELF_INTRODUCTION);
                    setMProfileThumbnail(memberData.M_PROFILE_THUMBNAIL);
                }

            }
            
        })
        .catch(error => {
            console.log('ajax_get_member communication error', error);

        })
        .finally(data => {
            console.log('ajax_get_member communication complete');
        });
        
    }

    const axios_member_modify = () => {
        console.log('axios_member_modify');
    
        let m_profiles = $('input[name="m_profile_thumbnail"]');
        
        let files = m_profiles[0].files;

        let formData = new FormData();

        formData.append("m_id", mId);
        formData.append("m_name", mName);
        formData.append("m_mail", mMail);
        formData.append("m_phone", mPhone);
        formData.append("m_self_introduction", mSelfIntroduction);
        formData.append("m_profile_thumbnail", files[0]);
        formData.append("m_gender", mGender);

        console.log('formData=======>', ...formData);

        axios({
            url: `${process.env.REACT_APP_HOST}/member/modify_confirm`, 
            method: 'post',
            data: formData,
            headers: {
                'Authorization': `${sessionStorage.getItem('sessionID')}`,
            }

        })
        .then(response => {
            console.log('axios_member_modify communication success', response.data);
    
            if (response.data === -1) {
                console.log('modfiy session out');
                sessionStorage.removeItem('sessionID');
                dispatch({
                    type: 'session_out',
                    sessionID: null,
                    loginedMember: '',
                });
                navigate('/');
            } else {

                if (response.data === null) {
                    alert('modify member modify process error');
                    
                } else {
                    alert('modify member modify process success');
                    navigate('/');
                }
            }
        })
        .catch(error => {
            console.log('axios_member_modify communication error', error);
            alert('modify member modify process fail');
        })
        .finally((data) => {
            console.log('axios_member_modify communication complete');
            
        });
    }

    const axios_delete_member = () => {
        console.log('axios_delete_member()');
    
        axios({
            url: `${process.env.REACT_APP_HOST}/member/delete_confirm`, 
            method: 'get',
            params: {
                'm_id': mId
            }
        })
        .then(response => {
            console.log('axios_member_delete communication success', response.data);

            if(response.data === -1) {
                console.log('Session timed out');
                sessionStorage.removeItem('sessionID');
                dispatch({
                    type: 'session_out',
                    sessionID: null,
                    loginedMember: '',
                });
                navigate('/');

            } else {
            
            if (response.data.result === null) {
                alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
                
                } else {
                    alert('회원탈퇴가 완료되었습니다.');
                    sessionStorage.removeItem('sessionID');
                    dispatch({
                        type: 'session_out',
                        sessionID: null,
                        loginedMember: '',
                    });
                    navigate('/');
                }
            }
        })
        .catch(error => {
            console.error('axios_member_delete communication error', error);
            
        })
        .finally(() => {
            console.log('axios_member_delete communication complete');
            
        });
    }
    
    
    const image = mProfileThumbnail && mProfileThumbnail.trim() !== ''
    ? `${process.env.REACT_APP_HOST}/${mId}/${mProfileThumbnail}`
    : mModifyProfileThumbnail && mModifyProfileThumbnail.trim() !== ''
    ? `${process.env.REACT_APP_HOST}/${mId}/${mModifyProfileThumbnail}`
    : "/imgs/profile_default.png";

    return (
        <div id='modify_container'>
            <div className='modify_box'>
                <form name='modify_form'>
                    <h3>정보수정</h3>
                    <img id="preview" src={image}
                    alt="" onClick={getUploadClickHandler}/>
                    
                    <input type="text" name="m_id" value={mId} placeholder="사용자 아이디" readOnly disabled/><br />
                    {/* <input type="password" name="m_pw" value={mPw} placeholder="비밀번호" readOnly disabled/><br /> */}
                    <input type="text" name="m_name" value={mName} placeholder="이름" onChange={(e) => setMName(e.target.value)}/><br />
                    <input type="email" name="m_mail" value={mMail} placeholder="이메일" onChange={(e) => setMMail(e.target.value)}/><br />
                    <input type="text" name="m_phone" value={mPhone} placeholder="전화번호" onChange={(e) => setMPhone(e.target.value)}/><br />
                    <textarea name="m_self_introduction" placeholder="자기소개" value={mSelfIntroduction} onChange={(e) => setMSelfIntroduction(e.target.value)}></textarea>
                    
                    <div className="select_gender">
                        성별선택: &nbsp;
                        <div className="select_m"><input type="radio" name="m_gender" value="M" checked={mGender === 'M'} onChange={(e) =>setGender(e.target.value)}/> 남자</div>                    
                        <div className="select_f"><input type="radio" name="m_gender" value="F" checked={mGender === 'F'} onChange={(e) =>setGender(e.target.value)}/> 여자</div>  
                    </div>
                    
                    <div className="filebox">
                        <input className="upload-name" placeholder="첨부파일"/>
                        <label htmlFor="file">파일찾기</label>
                        <input type="file" id="file" name="m_profile_thumbnail" value={mModifyProfileThumbnail} onChange={ProfileThumbnailChagneHandler}/>
                    </div>
                    <input type="button" value="수정하기" onClick={modifyClickHandler}/><br />
                    <p onClick={deleteBtnClickHandler}><a href="">탈퇴하기</a></p>
                </form>
            </div>
        </div>
    );
}

export default Modify;