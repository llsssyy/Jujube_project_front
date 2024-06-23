import axios from 'axios';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getCookie, removeCookie } from '../../util/cookie';
import { jwtDecode } from 'jwt-decode';

axios.defaults.withCredentials = true

const StoryUi = (props) => {
	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [pictures,setPictures] = useState([]);
	const [onClick,setOnClick] = useState([]);
	const modal = useSelector(store => store.modal);
	const loginedMember = jwtDecode(sessionStorage.getItem('sessionID')).m_id;
	

	useEffect(() => {
        console.log("StoryUi useEffect()");
		// console.log("pictures: ",props.pictures);
        setPictures(props.pictures);
    },[modal, props.pictures]);



	const storyTextBtnClickHandler = (e) => {
        // console.log("storyTextBtnClickHandler()");
		let story_text_btn = e.target;
        $(story_text_btn).parent('p').css({'width': '100%','white-space': 'initial', 'cursor':'inherit', 'word-break': 'break-all'});
        $(story_text_btn).css({'cursor':'inherit'});
    }

	const storyReplyBtnClickHandler = (e) => {
		// console.log("storyReplyBtnClickHandler()");
		dispatch({
			type:'story_btn_click',
			modal: true,
			s_no: props.s_no,
		});
	}

	const storyModifyBtnClickHandler = () => {
		// console.log("storyModifyBtnClickHandler()");
		// console.log(`${props.s_no}.no story Modify confirm!!`);

		dispatch({
			type:'story_modify_btn_click',
			s_no: props.s_no,
		});

	}

	const storyDeleteBtnClickHandler = () => {
		// console.log("storyDeleteBtnClickHandler()");
		
		if(window.confirm("게시물을 삭제하시겠습니까?")){
			// console.log(`${props.s_no}.no story Delete confirm!!`);
			axios_story_delete_confirm();
		}
	}

	const storyLikeBtnClickHandler = () => {
		// console.log("storyLikeBtnClickHandler()");
		// console.log("s_no: " + props.s_no);
		// console.log("m_id: " + loginedMember.M_ID);
		// console.log("sl_is_like: " + props.storyIsLike);
		// const newLikeState = props.storyIsLike;
		
		axios_story_like_update();
		// dispatch({
		// 	type:'story_like_btn',
		// 	s_no: props.s_no,
		// 	storylike: newLikeState,
		// });
	}

	const axios_story_delete_confirm = () => {
		// console.log("axios_story_delete_confirm()");

		let requestData = {
			's_no': props.s_no
		};

		axios({
			url: `${process.env.REACT_APP_HOST}/story/story/delete_confirm`,
			method: 'delete',
			data: requestData,
            headers: {
                'Content-Type': 'application/json',
				'authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			// console.log("axios story delete confirm success!!");
			// console.log("response: ",response.data);
			if(response.data === null){
				console.log("database error!!");
			}else if(response.data > 0){
				dispatch({
					type:'story_open_btn',
					storymodal: false,
				});
				props.setStoryFlag(pv => !pv);
			}else{
				console.log("database delete fail!!");
			}

		})
		.catch(err => {
            console.log("axios story delete confirm error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            // console.log("axios story delete confirm finally!!");
			sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
			removeCookie('accessToken');//
		});

	}

	const axios_story_like_update = () => {
		// console.log("axios_story_like_update()");

		let requestData = {
			s_no: props.s_no,
			m_id: loginedMember,
			sl_is_like: props.storyIsLike,
		};

		axios({
			url: `${process.env.REACT_APP_HOST}/story/story/story_like_update`,
			method: 'post',
			data: requestData,
            headers: {
                'Content-Type': 'application/json',
				'authorization': sessionStorage.getItem('sessionID'),
            },
		})
		.then(response => {	
			console.log("axios story like update success!!");
			console.log("response: ",response.data);
			if(response.data === null){
				console.log("database error!!");
			}else if(response.data > 0){
				props.setStoryFlag(pv => !pv);
				dispatch({ type: 'story_like_btn'});
			}else{
				console.log("database delete fail!!");
			}

		})
		.catch(err => {
            console.log("axios story like update error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            console.log("axios story like update finally!!");
			sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
			removeCookie('accessToken');//
		});

	}
	
	const HomeMemberInfoHandler = (member) => {

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
		<li className={`story_li_${props.s_no}`}>
			<div className='story_header'>
				<div className='story_header_info_btn_wrap' onClick={() => HomeMemberInfoHandler(props.memberInfors)}>
					<div className='story_header_img' >
				
						{
							props.memberInfors.M_PROFILE_THUMBNAIL !== null
							?
							<img src={`${process.env.REACT_APP_HOST}/${props.memberInfors.M_ID}/${props.memberInfors.M_PROFILE_THUMBNAIL}`} alt=''/>
							:
							<img src="/imgs/profile_default.png" alt="" />
						}
						
					</div>
					<div className='story_header_member_info_wrap'>
						<h4>{props.m_id}</h4>
						<p>{props.m_name}</p>
					</div>
				</div>
				<div className='story_header_menu_btn'>
					<a href="#none" >&#183; &#183; &#183;</a>
					<div className="story_header_menu_modal">
						{
							props.m_id === loginedMember
							?
							<ul>
								<li onClick={(e) => storyModifyBtnClickHandler(e)}><Link to="/story/modify_story">게시물수정</Link></li>
								<li onClick={(e) => storyDeleteBtnClickHandler(e)}>게시물삭제</li>
							</ul>
							:
							<ul>
								<li>신고하기</li>
								<li>절교하기</li>
							</ul>
						}
					</div>
				</div>
				
			</div>
			<div className='story_pictures_wrap'>
				
				<Swiper
					modules={[Navigation, Pagination]}
					spaceBetween={0}
					slidesPerView={1}
					speed={100}
					// navigation
					pagination={{ clickable: true }}
					scrollbar={{ draggable: false }}
					style={{
						"--swiper-pagination-color": "#e8e8e8",
						"--swiper-navigation-color": "#e8e8e8",
					  }}
					>
					{
						pictures.map((picture,idx) => {
							let randomNum = Math.floor((Math.random() * 10)+3);
                            return (
                                // <SwiperSlide key={idx}><div id='swiper_img'><img src={`${picture.SP_PICTURE_NAME}/${randomNum}00/${randomNum}00`} alt="" /></div></SwiperSlide>
                                <SwiperSlide key={idx}>
									<div id={`swiper_img`} className={`${picture.SP_PICTURE_NAME}`}>
									<img src={`${process.env.REACT_APP_HOST}/${props.m_id}/${picture.SP_SAVE_DIR}/${picture.SP_PICTURE_NAME}`} alt="" />
									</div>
								</SwiperSlide>
                            )
                        })
					}
				</Swiper>
			</div>
			<div className='story_contents_Wrap'>
				<div className='story_content_icon_wrap'>
					<a href="#none" onClick={storyLikeBtnClickHandler}>
						{
							props.storyIsLike > 0
							?
							<img src="/imgs/story_like_r_icon.png" alt="like button" />
							:
							<img src="/imgs/story_like_w_icon.png" alt="like button" />
						}
						
					</a>
					<a href="#none" onClick={(e) => storyReplyBtnClickHandler(e)}>
						<img src="/imgs/story_reply_icon.png" alt="reply button" />
					</a>
					<a href="#none">
						<img src="/imgs/story_messege_icon.png" alt="message button" />
					</a>
				</div>
				<div className="like_count_wrap">
					<p>좋아요<span>{props.storyLikeCnt.toLocaleString("ko-KR")}</span>개</p>
				</div>
				<div className='story_contents_text_wrap'>
					<p className='story_text_btn' >
						<span className='s_id'>{props.m_id}</span>
						<span className='s_text' onClick={(e)=>storyTextBtnClickHandler(e)}>{props.s_txt}</span>
					</p>
					<div className='story_reply_wrap'>
						{
							props.replysCnt === 0
							?
							null
							:
							<p onClick={(e) => storyReplyBtnClickHandler(e)}>댓글 <span>{props.replysCnt.toLocaleString("ko-KR")}</span>개 모두 보기 </p>
						}
					</div>
					<div className='story_date'>
						<p>{props.s_mod_date}</p>
					</div>
				</div>
			</div>                    
		</li>
	)
}

export default StoryUi;