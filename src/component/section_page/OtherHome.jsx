import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/myHome.css';
import MyProfile from './myprofile';
import { getCookie, removeCookie } from '../../util/cookie';
import { session_check } from '../../util/session_check';

axios.defaults.baseURL = process.env.REACT_APP_HOST;
axios.defaults.withCredentials = true;

const OtherHome = () => {

    const member_info = JSON.parse(sessionStorage.getItem('member_info'));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [storyFlag , setStoryFlag] = useState(false);
    const storymodal = useSelector(store => store.storymodal);
    const modal = useSelector(store => store.modal);
    const storylike = useSelector(store => store.storylike);
    const loginedMember = useSelector(store=> store.loginedMember);

    useEffect(() => {
        
        let session  = session_check();
        if(session !== null){
            console.log('[home] session_check enter!!');
            
            axios_get_other_profile(member_info.M_ID);
            
        }else{

            // console.log('[home] session_check expired!!');
            sessionStorage.removeItem('sessionID');
            dispatch({
                type:'session_out',
            });
        }

    },[storymodal, modal, storylike]);
    
    
    const axios_get_other_profile = () => {
        // console.log('axios_get_other_profile()');
        const member_info = JSON.parse(sessionStorage.getItem('member_info'));
        axios({
            url: `${process.env.REACT_APP_HOST}/story/story/get_my_storys`,
            method: 'get',
            params: {
                'm_id': member_info.M_ID,
            },
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),      
            },
        })
        .then(response => {
            // console.log('AXIOS GET MY STORY COMMUNICATION SUCCESS');
            // console.log(response.data);
            if (response.data === -1) {
                console.log("Home session out!!");
                sessionStorage.removeItem('sessionID');
                removeCookie('accessToken');
                dispatch({
                    type: 'session_out',
                });
                navigate('/');
            } else {
                if (response.data === null) {
                    console.log("undefined member");
                    sessionStorage.removeItem('sessionID');
                    sessionStorage.setItem('sessionID',getCookie('accessToken'));
                    // dispatch({
                    //     type: 'session_out',
                    // });
                    navigate('/');
                } else {
                    sessionStorage.removeItem('sessionID');
                    sessionStorage.setItem('sessionID',getCookie('accessToken'));
                    if(response.data[0].S_NO === undefined){
                        response.data.forEach(item => {
                            delete item.memberInfors;
                        });

                        dispatch({
                            type: 'set_my_stories',
                            storyMemberInfo: response.data.memberInfors,                      
                            story: [],                      
                        });

                    }else{
                        
                        dispatch({
                            type: 'set_my_stories',
                            storyMemberInfo: response.data.memberInfors,  
                            story: response.data,                      
                        });
                    }

                    axios_list_friend(member_info.M_ID);
                    
                }
            }
            
        })
        .catch(error => {
            console.log('AXIOS GET MY STORY COMMUNICATION ERROR', error);
        })
        .finally(() => {
            // console.log('AXIOS GET MY STORY COMMUNICATION COMPLETE');
        
        });
    }

    const axios_list_friend = () => {
        // console.log('axios_get_friend()');
        axios({
            url: `${process.env.REACT_APP_HOST}/member/get_friend_count`,
            method: 'get',
            params: {
                'id': member_info.M_ID
            },
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then(response => {
                // console.log('AXIOS GET MY FRIEND COMMUNICATION SUCCESS');
                // console.log(response.data);
                if (response.data === -1) {
                    console.log("Home session out!!");
                    sessionStorage.removeItem('sessionID');
                    removeCookie('accessToken');
                    dispatch({
                        type: 'session_out',
                    });
                    navigate('/');
                } else {
                    if (response.data === null) {
                        console.log("undefined member");
                        sessionStorage.removeItem('sessionID');//
                        sessionStorage.setItem('sessionID',getCookie('accessToken'));//
                        alert('친구목록을 불러오지 못했습니다. 다시 시도해주세요.');
                    } else {
                        sessionStorage.removeItem('sessionID');//
                        sessionStorage.setItem('sessionID',getCookie('accessToken'));//
                        dispatch({
                            type: 'set_my_friend',
                            friend: response.data,
                        });
                        
                        axios_get_friend(member_info.M_ID);
                    }
                }
            
            })
            .catch(error => {
                console.log('AXIOS GET MY FRIEND COMMUNICATION ERROR', error);
            })
            .finally(() => {
                // console.log('AXIOS GET MY FRIEND COMMUNICATION COMPLETE');
                
            });
        }

    const axios_get_friend = () => {
        // console.log('axios_get_friend()');

        axios({
            url: `${process.env.REACT_APP_HOST}/member/get_friend_status`,
            method: 'post',
            data: {
                f_id: member_info.M_ID
            },
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),      
            }, 
        })
        .then(response => {
                // console.log('AXIOS GET MY friend COMMUNICATION SUCCESS');
                // console.log(response.data);
                if (response.data === -1) {
                    console.log("Home session out!!");
                    sessionStorage.removeItem('sessionID');
                    sessionStorage.setItem('sessionID',getCookie('accessToken'));//
                    dispatch({
                        type: 'session_out',
                    });
                    navigate('/');
                } else {
                    if (response.data === null) {
                        console.log("undefined member");
                        alert('친구상태를 불러오지 못했습니다. 다시 시도해주세요.');
                    } else {
                        dispatch({
                            type:'set_my_button',
                            button: response.data
                        })
                        
                    }
                }
            
            })
            .catch(error => {
                console.log('AXIOS GET MY STORY COMMUNICATION ERROR', error);
            })
            .finally(() => {
                // console.log('AXIOS GET MY STORY COMMUNICATION COMPLETE');
                sessionStorage.removeItem('sessionID');//
                sessionStorage.setItem('sessionID',getCookie('accessToken'));//
                removeCookie('accessToken');//
            });
        }
    
        console.log("loginedMember: ", loginedMember);


    return (
        <div>
            <MyProfile setStoryFlag={setStoryFlag}/>
        </div>
        
    )
}

export default OtherHome;
