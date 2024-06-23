import axios from 'axios';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../css/home.css';

import '../css/story/story.css';
import { getCookie, removeCookie } from '../util/cookie';
import { session_check } from '../util/session_check';
import StoryReplyUI from './story/StoryReplyUI';
import StoryUi from './story/StoryUi';

const Home = () => {

    const dispatch = useDispatch();
    const sessionID = useSelector(store => store.sessionID);
    const loginedMember = useSelector(store => store.loginedMember);
    const modal = useSelector(store => store.modal);
    const [storyFlag,setStoryFlag] = useState(false);
    const [allStorys,setAllStorys] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        console.log("Home useEffect()");       

        let session = session_check();
        // console.log("session: ",session);
        if(session !== null){
            // console.log('[home] session_check enter!!');
            axios_get_member();
        }else{
            // console.log('[home] session_check expired!!');
            sessionStorage.removeItem('sessionID');
            sessionStorage.removeItem('member_info');
            dispatch({
                type:'session_out',
            });
        }

        const handleWheel = (event) => {
            event.preventDefault();
            const scrollAmount = event.deltaY > 0 ? 50 : -50;
            scrollRef.current.scrollTop += scrollAmount;
        };
    
        const scrollableElement = scrollRef.current;
        scrollableElement.addEventListener('wheel', handleWheel, { passive: false });
        console.log('Event listener added');
    
        return () => {
        scrollableElement.removeEventListener('wheel', handleWheel);
        console.log('Event listener removed');
        };
        
        

    },[modal,storyFlag]);

    useEffect(() => {

        dispatch({
            type: 'story_open_btn',
            storymodal: false,
        });
        dispatch({
            type: 'reply_modal_close',
            modal: false,
        });

    }, []);

    //비동기 통신
    const axios_get_member = () => {
        console.log("axios_get_member()");
        axios.get(`${process.env.REACT_APP_HOST}/member/get_member`, {
            headers: {
                'Authorization': sessionStorage.getItem('sessionID'),
            }
        })
        .then(respones => {
            // console.log('AXIOS GET MEMBER COMMUNICATION SUCCESS');
            // console.log(respones.data);
            if(respones.data === -1){
                console.log("Home server session out!!");
                sessionStorage.removeItem('sessionID');
                removeCookie('accessToken');
                dispatch({
                    type:'session_out',
                });
            }else{

                if(respones.data === null){
                    console.log("undefined member");
                    sessionStorage.removeItem('sessionID');
                    sessionStorage.setItem('sessionID',getCookie('accessToken'));
                    alert("로그인한 멤머 정보가 없습니다. 다시 시도해주세요.")
                }else{
                    // console.log("member_id: " + respones.data.member.M_ID);
                    sessionStorage.removeItem('sessionID');
                    sessionStorage.setItem('sessionID',getCookie('accessToken'));
                    sessionStorage.setItem('member_info', JSON.stringify(respones.data));
                    dispatch({
                        type:'session_enter',
                        loginedMember: respones.data.member,
                    });
                    axios_get_all_storys(respones.data.member.M_ID);

                }

            }
        })
        .catch(error => {
            console.log('AXIOS GET MEMBER COMMUNICATION ERROR',error);
            
        })
        .finally(() => {
            // console.log('AXIOS GET MEMBER COMMUNICATION COMPLETE');
        });
    }
    
    //axios get all storys
    const axios_get_all_storys = (m_id) => {
        // console.log("axios_get_all_storys()");
        // console.log("sessionID: ",sessionStorage.getItem('sessionID'));
        // console.log("cookie: ",getCookie('accessToken'));
        axios({
			url: `${process.env.REACT_APP_HOST}/story/story/get_all_storys`,
			method: 'get',
			params:{
				"m_id" : m_id,
			},
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			// console.log("axios get all storys success!!");
			// console.log("get all storys data: ",response.data);
            setAllStorys(response.data);
            
		})
		.catch(err => {
            console.log("axios get all storys error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            // console.log("axios get all storys finally!!");
            sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
            removeCookie('accessToken');//
		});	
    }

    //hadler
    const replyModalCloseBtnClickHandler = () => {
        // console.log('replyModalCloseBtnClickHandler()');
        dispatch({
            type:'reply_modal_close',
            modal: false,
        });
    }

    return (
        <>  
        <div id='home_wrap' ref={scrollRef} >
            <ul id='story_wrap'>
                {   
                    allStorys === undefined || allStorys.length === 0
                    ?
                    <li
                        style={{
                            textAlign: 'center',
                            marginTop: '200px',
                            fontSize: '1.8em',
                            fontWeight: 'bold'
                        }}
                    >
                        친구도 없고.. 게시물도 없고..
                    </li>
                    :
                    allStorys.map((allStory,idx) => {
                        return (
                            <StoryUi
                                s_no = {allStory.S_NO} 
                                m_id = {allStory.memberInfors[0].M_ID}
                                m_name = {allStory.memberInfors[0].M_NAME}
                                m_profile_thumbnail = {allStory.memberInfors[0].M_PROFILE_THUMBNAIL}
                                pictures = {allStory.pictures}
                                s_txt = {allStory.S_TXT}
                                storyLikeCnt = {allStory.storyLikeCnt}
                                storyIsLike = {allStory.storyIsLike}
                                replysCnt = {allStory.replysCnt}
                                s_mod_date = {allStory.S_MOD_DATE}
                                storyIdx = {idx}
                                memberInfors = {allStory.memberInfors[0]}
                                setStoryFlag = {setStoryFlag}
                                key = {idx}
                            />
                        )
                    })
                }
            </ul>
            
        </div>
        {
            modal === true
            ?
            <div id={modal ? "reply_show_modal" : "reply_hide_modal"} >
                <div className='reply_modal_close_btn' onClick={replyModalCloseBtnClickHandler}>
                    <div></div>
                    <div></div>
                </div>
                <StoryReplyUI/>
            </div>
            :
            null
        }
        </>
    )
}

export default Home;