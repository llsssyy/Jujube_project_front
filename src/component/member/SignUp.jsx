import React, { useState } from "react";
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { useNavigate } from "react-router-dom";


import '../../css/member/sign_up_form.css';
import '../../css/common.css'

const SignUp = () => {

    const [mId, setMId] = useState('');
    const [mPw, setMPw] = useState('');
    const [mName, setMName] = useState('');
    const [mMail, setMMail] = useState('');
    const [mPhone, setMPhone] = useState('');
    const [mSelfIntroduction, setMSelfIntroduction] = useState('');
    const [mProfileThumbnail, setMProfileThumbnail] = useState('');
    const [mGender, setGender] = useState('M');

    const navigate = useNavigate();

    const genderChangeHandler = (e) => {
        console.log('genderChangeHandler()');

        setGender(e.target.value);
        
    };

    const getUploadClickHandler = () => {
        //document.getElementById("file").click();
        $('.filebox input[name="m_profile_thumbnail"]').click();
    }       
    //프로필 
    const ProfileThumbnailChagneHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            
            // 파일의 데이터 URL 가져오기
            const previewUrl = event.target.result;
            
            // 이미지를 보여줄 img 요소를 선택하여 소스를 설정
            document.getElementById('preview').src = previewUrl;
        };

        if (file) {
            // 파일이 선택된 경우에만 읽어옴
            reader.readAsDataURL(file);
        } else {
            // 파일이 선택되지 않은 경우에는 기존의 이미지를 유지함
            setMProfileThumbnail(file);
        }
        
        // 파일을 읽어옴
        setMProfileThumbnail(e.target.value);
    }
    

    // 자기소개 입력수 제한
    const handleInputChange = (e) => {
        
        const newText = e.target.value;
        
        if (newText.length <= 50) {
            setMSelfIntroduction(newText);
        } 

        if (newText.length >= 50) {
            alert('최대 50자까지 입력할 수 있습니다.');
        }

    };
    
    const signUpClickHandler = () => {
        console.log('signUpClickHandler()');

        let form = document.sign_up_form;

        if (mId === '') {
            alert('새로운 아이디를 입력하세요');
            form.m_id.focus();
        } else if (mPw === '') {
            alert('새로운 비밀번호를 입력하세요');
            form.m_pw.focus();
        } else if (mName === '') {
            alert('새로운 이름을 입력하세요');
            form.m_name.focus();
        } else if (mMail === '') {
            alert('새로운 메일을 입력하세요');
            form.m_mail.focus();
        } else if (mPhone === '') {
            alert('새로운 핸드폰 번호를 입력하세요');
            form.m_phone.focus();
        } else  {
            ajax_member_sign_up();
        }
    }

    const ajax_member_sign_up = () => {
        console.log('ajax_member_sign_up()');

        let m_profiles = $('input[name="m_profile_thumbnail"]');
        
        let files = m_profiles[0].files;

        let formData = new FormData();
        formData.append("m_id", mId);
        formData.append("m_pw", mPw);
        formData.append("m_name", mName);
        formData.append("m_mail", mMail);
        formData.append("m_phone", mPhone);
        formData.append("m_self_introduction", mSelfIntroduction);
        formData.append("m_profile_thumbnail", files[0]);
        formData.append("m_gender", mGender);

        $.ajax({
            url: `${process.env.REACT_APP_HOST}/member/sign_up_confirm`,
            method: 'post',
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            dataType: 'json',
            xhrFields: { 
                withCredentials: true   
            },
            data: formData,
            success: function(data) {

                console.log('ajax member_join communication success()');
                console.log('data===>', data);
                //data ==> null,1
                if (data > 0 && data !== null) {
                    alert('member join process success!!');
                    navigate('/');
                    
                } else {
                    alert('member join process fail!!');
                    
                }
            }, 
            error: function(data) {
                console.log('ajax member_join communication error()');
                console.log('data', data);
            },
            complete: function(data) {
                console.log('ajax member_join communication copmlete()');

            
               
            }
        });
    }
    
    return (
        <div id="sign_up_container">            
        
            <div className="sign_up_box">
                    <form name="sign_up_form">
                        <h3>회원가입</h3>
                        <img id="preview" src="/imgs/profile_default.png" alt="" onClick={getUploadClickHandler}/>
                        <input type="text" name="m_id" value={mId} placeholder="사용자 아이디" onChange={(e) => setMId(e.target.value)}/><br />
                        <input type="password" name="m_pw" value={mPw} placeholder="비밀번호" onChange={(e)=> setMPw(e.target.value)}/><br />
                        <input type="text" name="m_name" value={mName} placeholder="이름" onChange={(e) => setMName(e.target.value)}/><br />
                        <input type="email" name="m_mail" value={mMail} placeholder="이메일" onChange={(e) => setMMail(e.target.value)}/><br />
                        <input type="text" name="m_phone" value={mPhone} placeholder="전화번호" onChange={(e) => setMPhone(e.target.value)}/><br />
                        <textarea name="m_self_introduction" placeholder="자기소개" value={mSelfIntroduction} onChange={handleInputChange}></textarea>
                        <div className="select_gender">
                            성별선택: &nbsp;
                            <div className="select_m"><input type="radio" name="m_gender" value="M" checked={mGender === 'M'} onChange={genderChangeHandler}/> 남자</div>                    
                            <div className="select_f"><input type="radio" name="m_gender" value="F" checked={mGender === 'F'} onChange={genderChangeHandler}/> 여자</div>  
                        </div>
                        
                        <div className="filebox">
                        <input className="upload-name" placeholder="첨부파일"/>
                        <label htmlFor="file">파일찾기</label>
                        <input type="file" id="file" name="m_profile_thumbnail" value={mProfileThumbnail} onChange={ProfileThumbnailChagneHandler}/>
                        </div>

                        <input type="button" value="회원가입" onClick={signUpClickHandler}/><br />
                        {/* <div className="or_line">또는</div> */}
                        {/* <p><a href="#none">비밀번호 찾기</a></p> */}
                    </form>
                </div>

            <div className="sign_in_box">
                <div className="sign_up_btn">
                    <p><Link to="/">로그인 하기</Link></p>
                </div>    
            </div>

    </div>
    );
}

export default SignUp;