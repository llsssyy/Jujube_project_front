import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/member/follow_list.css';
import { getCookie, removeCookie } from '../../util/cookie';
import { session_check } from '../../util/session_check';


const FollowList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [followMembers,setFollowMembers] = useState([]);
    const [followListFlag,setFollowListFlag] = useState(false);
    const loginedMember = jwtDecode(sessionStorage.getItem('sessionID')).m_id;


    useEffect(() => {
        // console.log("[FollowList] useEffect()");

        let session = session_check();
        if(session !== null){
            // console.log('[FollowList] session_check enter!!');
            axios_get_friend_list();
        }else{
            // console.log('[FollowList] session_check expired!!');
            sessionStorage.removeItem('sessionID');
            dispatch({
                type:'session_out',
            });
        }

    },[followListFlag]);

    const axios_get_friend_list = () => {
        console.log("[FollowList] axios_get_friend_list()");

		axios({
			url: `${process.env.REACT_APP_HOST}/member/get_friend_list`,
			method: 'get',
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			console.log("axios get friend list success!!");
			// console.log("response: ",response.data);
            if(response.data !== null){
                setFollowMembers(response.data.friend_list);
            }else{
                console.log("axios get friend list response data is null!");
            }
		})
		.catch(err => {
            console.log("axios get friend list error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            console.log("axios get friend list finally!!");
            sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
            removeCookie('accessToken');//
		});

    }

    const axios_friend_delete_confirm = (followMember) => {
        console.log("[FollowList] axios_friend_delete_confirm()");
        
        let reauestData = {
            "f_id" : followMember.F_ID
        }

        axios({
			url: `${process.env.REACT_APP_HOST}/member/friend_delete_confirm`,
			method: 'post',
            data: reauestData,
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			console.log("axios friend delete confirm success!!");

            if(response.data !== null){
                console.log("response: ",response.data.result); 
                setFollowListFlag(pv => !pv);               
            }else{
                console.log("axios friend delete confirm response data is null!");
            }
		})
		.catch(err => {
            console.log("axios friend delete confirm error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            console.log("axios friend delete confirm finally!!");
            sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
            removeCookie('accessToken');//
		});
    }

    const FollowListUnFollowBtnClickHandler = (e,followMember) => {
        console.log("FollowListUnFollowBtnClickHandler()");
        
        if(window.confirm("정말 절교하시겠습니까?")){
            axios_friend_delete_confirm(followMember);
        }
    }

    const followListMemberInfoHandler = (member) => {
		if(member.M_ID === loginedMember) {
			sessionStorage.setItem('member_info', JSON.stringify(member));
			navigate('/member/my_home');
			
			dispatch({
				type: 'story_open_btn',
				storymodal: false,
			});
			dispatch({
				type: 'reply_modal_close',
				modal: false,
			});
            
		} else {

			sessionStorage.setItem('member_info', JSON.stringify(member));
            navigate('/member/other_home');

			dispatch({
				type: 'story_open_btn',
				storymodal: false,
			});
			dispatch({
				type: 'reply_modal_close',
				modal: false,
			});
		}
    }
    return (
        <>
            <div id='follow_list_wrap'>
                <div className="follow_header">
                    ILCHON LIST
                </div>
                <div className='follow_list_section_wrap'>
                    <Link to="/member/follow_request_list">
                        <div className='follow_request_list_btn'>
                            요청보기
                        </div>
                    </Link>
                    <ul id="Follow_list">
                        {   
                            followMembers.length === 0
                            ?
                            <div style={{"textAlign":"center"}}>"당신은 일촌이 없습니다. ㅉㅉ.."</div>
                            :
                            followMembers.map((followMember,idx) => {
                                return(
                                    <li key={idx}>
                                        <div className='Follow_list_info_btn_wrap'>
                                            <div className='follow_list_info_btn_wrap' onClick={() => followListMemberInfoHandler(followMember)}>
                                                <div className='Follow_list_result_frofile_thum_wrap'>
                                                    {
                                                        followMember.M_PROFILE_THUMBNAIL !== null
                                                        ?                                                    
                                                        <img src={`${process.env.REACT_APP_HOST}/${followMember.F_ID}/${followMember.M_PROFILE_THUMBNAIL}`} />
                                                        :                         
                                                        <img src="/imgs/profile_default.png" />
                                                    }
                                                </div>
                                                <div className='Follow_list_result_frofile_info_wrap'>
                                                    <p>{followMember.F_ID}</p>
                                                    <p>{followMember.F_ILCHON_NAME}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Follow_list_result_btn_area">                                        
                                            <div className="un_follow_btn" onClick={(e) => {FollowListUnFollowBtnClickHandler(e,followMember)}}>
                                                <img src='/imgs/follow_btn_icon_r.png'/>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}

export default FollowList;