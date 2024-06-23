import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/story/story.css';
import StoryReplyUI from '../story/StoryReplyUI';
import StoryUi from '../story/StoryUi';

import { useNavigate } from 'react-router-dom';
import { removeCookie } from '../../util/cookie';

const MyProfile = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const story = useSelector(store => store.story);
    const button = useSelector(store => store.button);
    const friend = useSelector(store => store.friend);
    const modal = useSelector(store => store.modal);
    const storymodal = useSelector(store => store.storymodal);
    const storyMemberInfo = useSelector(store => store.storyMemberInfo);
    const storylike = useSelector(store => store.storylike);
    const loginedMember = jwtDecode(sessionStorage.getItem('sessionID')).m_id;


    const [storyFlag, setStoryFlag] = useState(false);
    const [mId, setMId] = useState('');
    const [mSelfIntroduction, setMSelfIntroduction] = useState('');
    const [mProfileThumbnail, setMProfileThumbnail] = useState('');
    const [storys, setStorys] = useState([]);

    const [mystory, setMystory] = useState([]); // 내 스토리 보관
    const [storyModal, setStoryModal] = useState([]);

    const member_info = JSON.parse(sessionStorage.getItem('member_info'));

    useEffect(() => {

        setMId(member_info.M_ID);
            setMSelfIntroduction(member_info.M_SELF_INTRODUCTION);
            setMProfileThumbnail(member_info.M_PROFILE_THUMBNAIL);

            setStorys(story);

    }, [member_info, story, props.setStoryFlag]);

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

    const FriendButton = () => {
        return (
            <div>
                {button.is_friend === true ? (
                    <input type="button" value="친구 삭제" onClick={deleteFriendClickHandler} />
                ) : (
                    button.is_friend_request === true ? (
                        <input type="button" value="친구 요청 취소" onClick={cancelFriendRequestHandler} />
                    ) : (
                        button.is_friend === false && button.is_friend_request === false
                            ?
                            <input type="button" value="친구 추가" onClick={() => followFriendBtnClickHandler()} />
                            :
                            null
                    )
                )}
            </div>
        );
    };

    const openStoryClickHandler = (idx) => {
        // console.log('openStoryClickHandler()', idx);

        let storyWrap = document.getElementById('story_wrap');
        let storyScrollTop = document.querySelector(`#story_wrap > ul > li:nth-child(${(idx+1)})`).offsetTop;
        storyWrap.scrollTop = storyScrollTop - 15;     
       
        dispatch({
            type: 'story_open_btn',
            storymodal: true,
        });
    };

    

    const ModalCloseBtnClickHandler = () => {
        // console.log('closeStoryClickHandler()');

        dispatch({
            type: 'story_open_btn',
            storymodal: false,
        });
    };

    const replyModalCloseBtnClickHandler = () => {
        // console.log('replyModalCloseBtnClickHandler()');

        dispatch({
            type: 'reply_modal_close',
            modal: false,
        });
    };

    const followFriendBtnClickHandler = () => {
        dispatch({
            type:'follow_btn_click',
            m_id : member_info.M_ID,
            m_profile_thumbnail: member_info.M_PROFILE_THUMBNAIL,
        });
        navigate('/member/follow_form');
    }

    const deleteFriendClickHandler = () => {
        const isConfirmed = window.confirm("정말로 절교하시겠습니까?");

        if (isConfirmed) {
            // console.log("delete()");
            axios_delete_member();
        }
    };

    const cancelFriendRequestHandler = () => {
        // console.log('deleteFriendClickHandler()');

        const isConfirmed = window.confirm("정말로 일촌 요청을 취소하시겠습니까?");

        if (isConfirmed) {
            // console.log("delete()");
            axios_request_cancel();
        }
    };

    const axios_request_cancel = () => {
        // console.log('axios_request_cancel()');

        axios({
            url: `${process.env.REACT_APP_HOST}/member/friend_request_cancel`,
            method: 'post',
            data: {
                f_id: member_info.M_ID
            },
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            }
        })
            .then(response => {
                // console.log('AXIOS GET MY FRIEND COMMUNICATION SUCCESS');
                console.log('sdafsdagasdg', response.data);
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

                        alert('일촌요청 취소를 실패했습니다. 다시 시도해주세요.');
                    } else {

                        alert('일촌요청을 취소했습니다.');

                        dispatch({
                            type: 'set_my_button',
                            friend: response.data,
                        });
                        dispatch({
                            type: 'set_my_button',
                            button: {is_friend: false, is_friend_request: false} 
                        });

                    }
                }

            })
            .catch(error => {
                console.log('AXIOS GET MY STORY COMMUNICATION ERROR', error);
            })
            .finally(() => {
                // console.log('AXIOS GET MY STORY COMMUNICATION COMPLETE');
            });
    };

    const axios_delete_member = () => {
        // console.log('axios_delete_member()');

        axios({
            url: `${process.env.REACT_APP_HOST}/member/friend_delete_confirm`,
            method: 'post',
            data: {
                f_id: member_info.M_ID,
            },
            headers: {
                'authorization': sessionStorage.getItem('sessionID'),
            },
        })
            .then(response => {
                // console.log('AXIOS DELETE FRIEND COMMUNICATION SUCCESS');
                console.log(response.data);
                if (response.data === -1) {
                    console.log("Home session out!!");
                    sessionStorage.removeItem('sessionID');
                    dispatch({
                        type: 'session_out',
                    });
                    navigate('/');
                } else {
                    if (response.data === null) {
                        console.log("undefined member");
                        alert('일촌 삭제에 실패했습니다. 다시 시도해주세요.');
                    } else {
                        alert("일촌 삭제가 완료되었습니다.");
                        dispatch({
                            type: 'set_my_button',
                            button: {is_friend: false, is_friend_request: false} 
                        });
                        dispatch({
                            type: 'set_my_friend',
                            friend: response.data,
                        });
                    }
                }

            })
            .catch(error => {
                console.log('AXIOS GET FRIEND DELETE COMMUNICATION ERROR', error);
            })
            .finally(() => {
                // console.log('AXIOS GET FRIEND DELETE COMMUNICATION COMPLETE');
            });
    };

    const myprofileFollowInfoHandler = () => {

        navigate('/member/follow_list');
    }
    return (
        <div id='my_profile_wrap'>
            <div className='profile_header'>
                {mProfileThumbnail !== null
                    ?
                    <img src={`${process.env.REACT_APP_HOST}/${mId}/${mProfileThumbnail}`} />
                    :
                    <img src="/imgs/profile_default.png" />
                }

                <div className='post'>
                    <div>{story.length > 0 ? story.length : 0}</div>
                    <div>post</div>
                </div>
                <div className='friend' onClick={() => myprofileFollowInfoHandler()}>
                    <div>{friend.friend_count > 0 ? friend.friend_count : 0}</div>
                    <div>friend</div>
                </div>
            </div>
            <div className='profile_member_name'>
                <p>{member_info.M_ID}</p>
            </div>
            <div className='profile_self_intro'>
                <p>{mSelfIntroduction ? mSelfIntroduction : '자기소개가 없습니다.'}</p>
            </div>
            <div className='profile_follow_btn'>
                {FriendButton()}
            </div>

            <div className='profile_img_name'>게시물</div>

            <div id='profile_img'>
                {storys === null || storys.length === 0
                    ? <div className='profile_img_text'>내용이 없습니다.</div>
                    : <div className='profile_item'>
                        {storys.map((story, idx) => {
                            return (

                                <div key={idx} onClick={() => openStoryClickHandler(idx)}>
                                    {story.length === 1
                                        ? <img src="#" alt="" />
                                        : <img src={`${process.env.REACT_APP_HOST}/${mId}/${story.pictures[0].SP_SAVE_DIR}/${story.pictures[0].SP_PICTURE_NAME}`} alt="" />
                                    }
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
            <div>
                <div id={storymodal ? "open_story_wrap" : "hide_story_wrap"}>
                    <div className='modal_close_btn' onClick={ModalCloseBtnClickHandler}>
                        <img src="/imgs/pngwing.com.png" alt="" />
                    </div>
                    <div id='story_wrap'>
                        <ul>
                            {storys.map((storys, idx) => (
                                <StoryUi
                                    key={idx}
                                    s_no={storys.S_NO}
                                    m_id={storys.memberInfors[0].M_ID}
                                    m_name={storys.memberInfors[0].M_NAME}
                                    m_profile_thumbnail={storys.memberInfors[0].M_PROFILE_THUMBNAIL}
                                    pictures={storys.pictures}
                                    s_txt={storys.S_TXT}
                                    storyLikeCnt={storys.storyLikeCnt}
                                    storyIsLike={storys.storyIsLike}
                                    replysCnt={storys.replysCnt}
                                    s_mod_date={storys.S_MOD_DATE}
                                    memberInfors={storys.memberInfors[0]}
                                    storyIdx={idx}
                                    setStoryFlag={setStoryFlag}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {modal === true
                ? <div id={modal ? "reply_show_modal" : "reply_hide_modal"}>
                    <div className='reply_modal_close_btn' onClick={replyModalCloseBtnClickHandler}>
                        <div></div>
                        <div></div>
                    </div>
                    <StoryReplyUI />
                </div>
                : null
            }
        </div>
    );
};

export default MyProfile;
