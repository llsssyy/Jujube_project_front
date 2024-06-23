import React, { useEffect, useState } from 'react'
import '../../css/member/follow_request_list.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getCookie, removeCookie } from '../../util/cookie';
import { session_check } from '../../util/session_check';

import FollowRequestListSection2 from './FollowRequestListSection2';

const FollowRequestList = () => {

    const dispatch = useDispatch();

    const [friendRequestList, setFriendRequestList] = useState([]);
    const [friendResponseList, setFriendResponseList] = useState([]);
    const [followRequestListFlag,setFollowRequestListFlag] = useState(false);
    

    useEffect(() => {
        console.log("[FollowRequestList] useEffect()");

        let session = session_check();
        if(session !== null){
            // console.log('[FollowList] session_check enter!!');
            axios_get_friend_request_list();
        }else{
            // console.log('[FollowList] session_check expired!!');
            sessionStorage.removeItem('sessionID');
            dispatch({
                type:'session_out',
            });
        }

    },[followRequestListFlag]);

    const axios_get_friend_request_list = () => {
        console.log("[FollowRequestList] axios_get_friend_request()");

        axios({
			url: `${process.env.REACT_APP_HOST}/member/get_friend_request_list`,
			method: 'get',
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			console.log("axios get friend request list success!!");
			console.log("response: ",response.data);
            if(response.data !== null){
                setFriendRequestList(response.data.friend_request_list);
                setFriendResponseList(response.data.friend_response_list);
                //friend_request_list 보낸요청
                //friend_response_list 받은요청
            }else{
                console.log("axios get friend request list response data is null!");
            }
		})
		.catch(err => {
            console.log("axios get friend request list error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            console.log("axios get friend request list finally!!");
            sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
            removeCookie('accessToken');//
		});

    }

    const axios_friend_request_cancel = (friendReq) => {
        console.log("[FollowRequestList] axios_friend_request_cancel()");

        let requestData = {
            "f_id":friendReq.FR_RES_ID
        }

        axios({
			url: `${process.env.REACT_APP_HOST}/member/friend_request_cancel`,
			method: 'post',
            data:requestData,
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			console.log("axios friend request cancel success!!");
            setFollowRequestListFlag(pv => !pv);
            if(response.data !== null){
                console.log("response: ",response.data);
            }else{
                console.log("axios get friend request list response data is null!");
            }
		})
		.catch(err => {
            console.log("axios friend request cancel error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            console.log("axios friend request cancel finally!!");
            sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
            removeCookie('accessToken');//
		});

    }

    //handler
    const followRequestCancelBtnClickHandler = (e,friendReq) => {
        console.log('followRequestCancelBtnClickHandler()');
        if(window.confirm("일촌 신청을 취소하시겠습니까?")){
            axios_friend_request_cancel(friendReq);
        }
    }

    return (
        <>
            <div id='follow_request_list_wrap'>
                <div className="follow_request_header">
                    ILCHON REQUEST LIST
                </div>
                <div className='follow_request_list_section_wrap'>
                    <div className='follow_request_list_section1'>
                        <div className="follow_request_list_section1_header">
                            보낸요청
                        </div>
                        <div id="follow_request_list_section1_article">
                            <ul>
                                {   
                                    friendRequestList.length === 0
                                    ?
                                    <li style={{'display':'block'}}>보낸 요청이 없습니다.</li>
                                    :
                                    friendRequestList.map((friendReq,idx) => {
                                        return (                                            
                                            <li key={idx}>
                                                <div className="follow_request_list_section1_article_item">
                                                    <div className="follow_request_list_section1_article_item_profile">
                                                        <img src={`${process.env.REACT_APP_HOST}/${friendReq.FR_RES_ID}/${friendReq.M_PROFILE_THUMBNAIL}`} alt="" />
                                                    </div>
                                                    <div className='follow_request_list_section1_article_item_info'>
                                                        <p>{friendReq.FR_RES_ID}</p>
                                                        <p>{friendReq.FR_ILCHON_NAME}</p>
                                                    </div>                           
                                                </div>
                                                <div className="follow_request_list_section1_btn_area">                                                                                                   
                                                    <div className="un_follow_btn" onClick={(e) => followRequestCancelBtnClickHandler(e,friendReq)}>
                                                        취소
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>                     
                    </div>
                    <div className='follow_request_list_section_line'></div>
                    <div className='follow_request_list_section2'>
                        <div className="follow_request_list_section2_header">
                            받은요청
                        </div>
                        <div id="follow_request_list_section2_article">
                            <ul>
                                {
                                    friendResponseList.length === 0
                                    ?
                                    <li>받은 요청이 없습니다.</li>
                                    :   
                                    friendResponseList.map((friendRes,idx) => {
                                        return (
                                            <FollowRequestListSection2
                                                friendRes={friendRes}
                                                key={idx}
                                                setFollowRequestListFlag={setFollowRequestListFlag}
                                            />                                                     
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FollowRequestList;