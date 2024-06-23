import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/member/follow_form.css';
import { getCookie, removeCookie } from '../../util/cookie';
import { session_check } from '../../util/session_check';

const FollowForm = () => {

    const [followID,setFollowID] = useState('');
    const [followNickName,setFollowNickName] = useState('');
    const m_id = useSelector(store => store.m_id);
    // const loginedMemberID = useSelector(store => store.loginedMember.M_ID);
    const loginedMemberID = jwtDecode(sessionStorage.getItem('sessionID')).m_id;
    const m_profile_thumbnail = useSelector(store => store.m_profile_thumbnail);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // console.log("FollowForm useEffect()");

        let session = session_check();
        if(session !== null){
            // console.log('[FollowForm] session_check enter!!');
            setFollowID(m_id);
        }else{
            // console.log('[FollowForm] session_check expired!!');
            sessionStorage.removeItem('sessionID');
            dispatch({
                type:'session_out',
            });
        }

    },[]);

    const followFormSubmitBtnClickHandler = () => {
        // console.log("followFormSubmitBtnClickHandler()");
        axios_friend_request(followID,followNickName);
    }

    const followFormCancelBtnClickHandler = () => {
        // console.log("followFormCancelBtnClickHandler()");
        navigate('/');
    }

    const axios_friend_request = (followID,followNickName) => {
		// console.log("axios_friend_request()");

		let requestData = {
            fr_res_id : followID,
            fr_ilchon_name: followNickName,
        }

		axios({
			url: `${process.env.REACT_APP_HOST}/member/friend_request`,
			method: 'post',
			data: requestData,
            headers: {
                'Content-Type': 'application/json',
                'authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			// console.log("axios friend request success!!");
			// console.log("response: ",response.data.result);
            if(response.data.result === 3){
                alert("이미 일촌입니다.");
            }else if(response.data.result === null){
                alert("server error response is null");
            }else if(response.data.result === 0){
                alert("일촌 신청에 실패하였습니다.");
            }else{
                alert("상대방이 동의하시면 일촌이 맺어집니다.");
                navigate('/');
            }
		})
		.catch(err => {
            // console.log("axios friend request error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            // console.log("axios friend request finally!!");
            setFollowNickName('');
            sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
            removeCookie('accessToken');//
		});

	}

    return (
        <>
            <div id='follow_form_wrap'>
                <div className='follow_form_section_wrap'>
                    <div className="follow_form_section1_header">
                    </div>
                    <div className='follow_form_section2_contents'>
                        <div className='follow_form_section2_profile_wrap'>
                            <div className='follow_form_section2_profile_img_wrap'>
                                <img src={`${process.env.REACT_APP_HOST}/${followID}/${m_profile_thumbnail}`} alt="" />
                            </div>
                        </div>
                        <div className='follow_form_section2_text'>
                            <p className='section2_follow_my_id'>{followID}님께</p>
                            <p>일촌을 신청합니다.</p>
                        </div>
                    </div>
                    <div className="follow_form_section3_input">                        
                        <span className='section3_follow_my_id'>{followID}</span>
                        님을 &nbsp; 
                        <span className='section3_follow_to_id'>{loginedMemberID}</span>
                        님의 &nbsp;
                        <input type="text" name = 'f_ilchon_name' value={followNickName} onChange={(e) => setFollowNickName(e.target.value)} placeholder='내 일촌명 입력' />로
                    </div>
                    <div className='follow_form_section4_subTxt'>상대방이 동의하시면 일촌이 맺어집니다.</div>
                    <div className='follow_form_section5_btn'>
                        <input type="button" value="보내기" onClick={followFormSubmitBtnClickHandler}/>
                        <input type="button" value="취소" onClick={followFormCancelBtnClickHandler} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default FollowForm;