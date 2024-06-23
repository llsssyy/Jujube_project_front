import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/common.css';
import '../../css/member/sign_in_form.css';
import { getCookie } from '../../util/cookie';

axios.defaults.withCredentials = true;

const SignIn = () => {
    
    const navigate = useNavigate();

    //dipatch
    const dispatch = useDispatch();
    
    //hook
    const [mId, setMId] = useState('');
    const [mPw, setMPw] = useState('');

    const signInClickHandler = () => {

        console.log("signInClickHandler()");

        let form = document.sign_in_form;

        if (mId === '') {
            alert('아이디를 입력해주세요');
            form.m_id.focus();
        
        } else if (mPw === '') {
            alert('비밀번호를 입력해주세요');
            form.m_pw.focus();

        } else {

            axios_member_login();
        }
    }

    //google 로그인 시작
    const handleGoogleLoginSuccess = (credentialResponse) => {
        // 토큰 jwt로 decoded
        const token = credentialResponse?.credential; // 로그인 성공 시 받은 토큰
        const decoded = jwtDecode(token); // 받은 토큰을 디코딩하여 사용자 정보 추출
        console.log(decoded); // 디코딩된 정보 콘솔에 출력
        
        // ajax_google_sign_in(token);
        axios_google_sign_in(decoded);
        
    };

    const handleGoogleLoginError = () => {
        console.log('Login Failed');
    };


    const axios_google_sign_in = (decoded) => {
        console.log('axios_google_sign_in()');

        axios({
            url: `${process.env.REACT_APP_HOST}/member/google_sign_in_confirm`,
            method: 'post',
            data: JSON.stringify({ decoded }),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        })
        .then(response => {
            console.log('axios_google_sign_in communication success', response.data);
            // eslint-disable-next-line default-case
            switch(response.data.result) {
                case null:
                    alert('서버 통신에 문제가 있습니다. 다시 시도해주세요.');
                    break;
                case -3:
                    alert('계정이 정지되었습니다.');
                    break;
                case -4:
                    alert('비밀번호가 틀렸습니다.');
                    break;
                case -5:
                    alert('탈퇴한 계정입니다. 관리자에게 문의하세요.');
                    break;
                case 'success': 
                    alert('로그인 성공');
                    sessionStorage.setItem('sessionID', getCookie('accessToken'));
                    
                    dispatch({
                        type: 'sign_in_success',
                    });
            }
        })
        .catch(error => {
            console.log('axios_google_sign_in communication error', error);
            
        })
    }

    const axios_member_login = () => {
        console.log('axios_member_login()');
        
        let formData = new FormData();
        formData.append("m_id", mId);
        formData.append("m_pw", mPw);
        
        axios({
            url: `${process.env.REACT_APP_HOST}/member/sign_in_confirm`, 
            method: 'post',
            data: formData,
            headers: {
                'Content-Type':'application/json;charset=UTF-8',
            }
        })
        
        .then(response => {
            console.log('AXIOS MEMBER_LOGIN COMMUNICATION SUCCESS');
            console.log('data ---> ', response.data);
            
            // eslint-disable-next-line default-case
            switch(response.data.result) {
                case null:
                    alert('서버 통신에 문제가 있습니다. 다시 시도해주세요.');
                    break;
                case -2:
                    alert('존재하지 않는 아이디입니다.');
                    break;
                case -3:
                    alert('계정이 정지되었습니다.');
                    break;
                case -4:
                    alert('비밀번호가 틀렸습니다.');
                    break;
                case "success": 
                    alert('로그인 성공');
                    sessionStorage.setItem('sessionID', getCookie('accessToken'));
                    
                    dispatch({
                        type: 'sign_in_success',
                    });
                    break;
            }
        
        })
        .catch(error => {
            console.log('AXIOS MEMBER_LOGIN COMMUNICATION ERROR');
            console.log('data===>', error.data);
        })
        .finally(() => {
            console.log('AXIOS MEMBER_LOGIN COMMUNICATION COMPLETE');
            sessionStorage.setItem('sessionID', getCookie('accessToken'));////
        });
    
    }
    
    return (
        <div id="sign_in_container">
            <div id="sign_in_symbol_wrap">
                <img src="/imgs/symbol_1.png" alt="" />
            </div>
            <div id='sign_in_logo_wrap'>
                <h1 id="sign_in_logo">
                    <img src="/imgs/logo1.png" alt="" />
                </h1>
            </div>
            <div className="sign_in_box">
                <h3>로그인</h3>
                <form name='sign_in_form'>
                    <input type="text" name="m_id" value={mId} placeholder="아이디" onChange={(e) => setMId(e.target.value)}/><br />
                    <input type="password" name="m_pw" value={mPw} placeholder="비밀번호" onChange={(e) => setMPw(e.target.value)}/><br />
                    <input type="button" value="로그인" onClick={signInClickHandler}/><br />
                    {
                        process.env.REACT_APP_HOST === 'http://localhost:3001'
                        ?
                        <>
                        <div className="or_line">또는</div>
                            
                            <GoogleLogin
                            width={350}
                            onSuccess={handleGoogleLoginSuccess}
                            onError={handleGoogleLoginError}
                            />
                        </>
                        :
                        null
                    }
                        
                    {/* <p><a href="#none">비밀번호 찾기</a></p> */}
                </form>
            </div>
            <div className="sign_up_box">
                <div className="sign_up_btn">
                    <p><Link to="/member/sign_up_form">가입하기</Link></p>
                </div>
            </div>
        </div>
        
    );
}

export default SignIn;