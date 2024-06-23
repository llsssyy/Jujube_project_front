import React, { useEffect, useState} from 'react';
import '../../css/message.css';
import $ from 'jquery';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const Message = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchId, setSearchId] = useState('');
    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        console.log("member useEffect()");
        axios_get_member();
        $('#message_member_wrap input[name="search_member"]').focus();
        setSearchId('');
    },[]);

    const searchBtnClickHandler = () => {
        console.log("msg_searchBtnClickHandler()");
        if(searchId !== ''){
            $('#message_member_wrap div.search_result_wrap').show();
            axios_get_search_member();
            setSearchId('');
        }else{
            alert('Please input search member id');
            $('#message_member_wrap div.search_result_wrap').hide();
        }        
    }

    const handleKeyDown = (e = React.KeyboardEvent) => {
        // 키가 눌렸을 때 수행될 작업
        console.log('Key down:', e.key);
        if (e.key === 'Enter') {
            searchBtnClickHandler();
        }
    };

    //비동기 통신
    const axios_get_search_member = () => {
        console.log('axios_get_search_member()');
        
        axios({
            url: `${process.env.REACT_APP_HOST}/member/get_search_member`, 
            method: 'GET',
            params: {
                search_member : searchId,
            }
        })
        .then(response => {
            console.log('AXIOS GET SEARCH MEMBER COMMUNICATION SUCCESS');
            console.log('data ---> ', response.data);
            
            if(response.data === -1){
                alert('session out!!');
                dispatch({
                    type:'session_out',
                });
                navigate('/');
            }else{
                if (response.data !== null) {
                    console.log("회원 정보 조회 성공!!");
                    
                    setMemberList(response.data);
                } else {
                    alert('회원 정보 조회 실패!!');
                }
            }
            
        })
        .catch(error => {
            console.log('AXIOS GET SEARCH MEMBER COMMUNICATION ERROR');
            
        })
        .finally(() => {
            console.log('AXIOS GET SEARCH MEMBER COMMUNICATION COMPLETE');

        });
    
    }

    //세션체크
    const axios_get_member = () => {
        console.log("axios_get_member()");
        axios.get(`${process.env.REACT_APP_HOST}/member/get_member`, {
            
        })
       .then(respones => {
            console.log('AXIOS GET MEMBER COMMUNICATION SUCCESS');
            console.log(respones.data);
            if(respones.data === -1){
                console.log("Home session out!!");
                sessionStorage.removeItem('sessionID');
                dispatch({
                    type:'session_out',
                });
                navigate('/');
            }else{
    
                if(respones.data === null){
                    console.log("undefined member");
                    console.log("Home session out!!");
                    sessionStorage.removeItem('sessionID');
                    dispatch({
                        type:'session_out',
                    });
                    navigate('/');
                }else{
                    console.log("member_id: " + respones.data.member.M_ID);
                    dispatch({
                        type:'session_enter',
                        loginedMember: respones.data.member.M_ID,
                    });
                }
    
            }
       })
       .catch(error => {
            console.log('AXIOS GET MEMBER COMMUNICATION ERROR');
        
        })
        .finally(() => {
            console.log('AXIOS GET MEMBER COMMUNICATION COMPLETE');
             
        });
    }
    
    return (
        <div id='message_member_wrap'>
            <div className='member_wrap'>
            <h3>친구목록</h3>
            <div className="logined_view_input_text_wrap">
                <input type="text" name='search_member' value={searchId} onKeyDown={handleKeyDown} onChange={(e)=>{ console.log("change"); setSearchId(e.target.value) }} placeholder='회원아이디를 입력하세요'/>
                <span tabIndex={0} className='search_btn' onClick={searchBtnClickHandler} >
                    <img src="/imgs/search_icon.png" />
                </span>
            </div>
                <div className='search_result_wrap'>
                    <ul className='search_result'>
                        {   
                            memberList.map((member, index) => {
                                return (
                                    <li key={index}>
                                        <div className='search_result_frofile_thum_wrap'>
                                            {
                                                member.M_PROFILE_THUMBNAIL !== null
                                                ?
                                                <img src={`${process.env.REACT_APP_HOST}/${member.M_ID}/${member.M_PROFILE_THUMBNAIL}`} />
                                                :
                                                <img src="/imgs/profile_default.png" alt=''/>
                                            }
                                        </div>
                                        <div className='search_result_frofile_info_wrap'>
                                            <p>{member.M_ID}</p>
                                            <p>{member.M_NAME}</p>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className='message_wrap'>
                <div className='messge_header'>
                    <div className='header_img'>
                        <img src="/imgs/profile_default.png"/>
                    </div>
                    <div className='header_id'>
                        <div>
                            gildong
                        </div>   
                        <div>
                            koffer
                        </div>                     
                    </div>
                </div>
                <div className='chat_wrap'>
                    <textarea name="msg_" id=""></textarea>
                </div>
            </div>
        </div>
    )
}

export default Message;