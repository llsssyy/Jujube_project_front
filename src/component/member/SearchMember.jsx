import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../../css/member/search_member.css';
import $ from 'jquery';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCookie, removeCookie } from '../../util/cookie';
import { session_check } from '../../util/session_check';
import { jwtDecode } from "jwt-decode";

axios.defaults.withCredentials = true;

const SearchMember = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchId, setSearchId] = useState('');
    const [memberList, setMemberList] = useState([]);
    // const loginedMemberID = useSelector(store => store.loginedMember.M_ID);
    const loginedMemberID = jwtDecode(sessionStorage.getItem('sessionID')).m_id;

    useEffect(() => {
        console.log("searchMember useEffect()");

        let session = session_check();
        if(session !== null){
            // console.log('[SearchMember] session_check enter!!');
            $('#search_member_wrap input[name="search_member"]').focus();
            setSearchId('');            
        }else{
            // console.log('[SearchMember] session_check expired!!');
            sessionStorage.removeItem('sessionID');
            dispatch({
                type:'session_out',
            });
        }

    },[]);

    const searchBtnClickHandler = () => {
        // console.log("searchBtnClickHandler()");
        if(searchId !== ''){
            $('#search_member_wrap div.search_result_wrap').show();
            axios_get_search_member();
            setSearchId('');
        }else{
            alert('Please input search member id');
            $('#search_member_wrap div.search_result_wrap').hide();
        }        
    }

    const handleKeyDown = (e = React.KeyboardEvent) => {
        // 키가 눌렸을 때 수행될 작업
        console.log('Key down:', e.key);
        if (e.key === 'Enter') {
            searchBtnClickHandler();
        }
    };
    
    const searchMemberFollowBtnClickHandler = (e) => {
        // console.log("searchMemberFollowBtnClickHandler()");
        let memberinfo = e.target;
        dispatch({
            type:'follow_btn_click',
            m_id : memberinfo.dataset.m_id,
            m_profile_thumbnail: memberinfo.dataset.m_profile_thumbnail,
        });
        navigate('/member/follow_form');
    }

    //비동기 통신
    const axios_get_search_member = () => {
        console.log('axios_get_search_member()');
        
        axios({
            url: `${process.env.REACT_APP_HOST}/member/get_search_member`, 
            method: 'GET',
            params: {
                search_member : searchId,
            },
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),      
            },
        })
        .then(response => {
            // console.log('AXIOS GET SEARCH MEMBER COMMUNICATION SUCCESS');
            // console.log('data ---> ', response.data);
            
            if(response.data === -1){
                alert('session out!!');
                removeCookie('accessToken');
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
            // console.log('AXIOS GET SEARCH MEMBER COMMUNICATION COMPLETE');
            sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
        });
    
    }
    
    
    const searchMemberInfoHandler = (member) => {
        console.log('searchMemberInfoHandler()');
                          
        if(member.M_ID === loginedMemberID) {
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
        <div id='search_member_wrap'>
            <h3>회원찾기</h3>
            <div className="logined_view_input_text_wrap">
                <input type="text" name='search_member' value={searchId} onKeyDown={handleKeyDown} onChange={(e)=>{ console.log("change"); setSearchId(e.target.value) }} placeholder='회원아이디를 입력하세요'/>
                <span tabIndex={0} className='search_btn' onClick={searchBtnClickHandler} >
                    <img src="/imgs/search_icon.png" />
                </span>
            </div>
            <div className='search_result_wrap'>
                <ul className='search_result'>
                    {   memberList.length === 0
                        ?
                        "검색 정보가 없습니다."
                        :
                        memberList.map((member, index) => {
                            return (
                                <li key={index}>
                                    <div className='search_member_info_btn_wrap' onClick={() => searchMemberInfoHandler(member)}>
                                        <div className='search_result_frofile_thum_wrap'>
                                            {
                                                member.M_PROFILE_THUMBNAIL !== null
                                                ?
                                                <img src={`${process.env.REACT_APP_HOST}/${member.M_ID}/${member.M_PROFILE_THUMBNAIL}`} />
                                                :
                                                <img src="/imgs/profile_default.png" />
                                            }
                                        </div>
                                        <div className='search_result_frofile_info_wrap'>
                                            <p>{member.M_ID}</p>
                                            <p>{member.M_NAME}</p>
                                        </div>
                                    </div>
                                    <div className="search_result_btn_area">
                                        {
                                            member.M_ID === loginedMemberID
                                            ?
                                            '나'
                                            :
                                            member.result === 0
                                            ?
                                            <div className="follow_btn">
                                                <img data-m_id={member.M_ID} 
                                                    data-m_profile_thumbnail={member.M_PROFILE_THUMBNAIL} 
                                                    onClick={(e) => searchMemberFollowBtnClickHandler(e)} 
                                                    src='/imgs/follow_btn_icon_b.png'/>
                                            </div>
                                            :
                                            <div className="un_follow_btn">
                                                <img src='/imgs/follow_btn_icon_r.png'/>
                                            </div>
                                        }
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default SearchMember;