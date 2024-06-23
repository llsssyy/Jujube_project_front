import React, { useEffect, useState } from 'react';
import '../../css/story/storyReply.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import ReplyUI from './ReplyUI';
import {session_check} from'../../util/session_check';
import { getCookie, removeCookie } from '../../util/cookie';

axios.defaults.withCredentials = true

const StoryReplyUI = () => {

	const [replys,setResplys] = useState([]);
	const [replyFlag,setReplyFlag] = useState(false);
	const [r_txt,setR_txt] = useState('');

	const dispatch = useDispatch();
	const loginedMember = useSelector(store => store.loginedMember);
	const s_no = useSelector(store => store.s_no);
	const modal = useSelector(store => store.modal);
	

	useEffect(() => {
		console.log("StoryReplyUI useEffect()");
		axios_get_story_reply_list(s_no);
		setR_txt('');
  	},[s_no, replyFlag]);

	const axios_get_story_reply_list = (s_no) => {
		// console.log("axios_get_story_reply_list()");
		// console.log("get story reply S_NO: ",s_no);
		// console.log("get story reply sessionID: ",sessionStorage.getItem('sessionID'));
		axios({
			url: `${process.env.REACT_APP_HOST}/story/reply/get_replys`,
			method: 'get',
			params:{
				"s_no" : s_no,
			},
			headers: {
                'Authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			// console.log("axios get story reply list success!!");
            setResplys(response.data);	
		})
		.catch(err => {
            console.log("axios get story reply list error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            // console.log("axios get story reply list finally!!");
			sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
			removeCookie('accessToken');
		});

	}

	const axios_reply_write_confirm = (s_no,r_txt) => {
		// console.log("axios_reply_write_confirm()");

		let requestData = {
			"m_id": loginedMember.M_ID,
            "s_no": s_no,
            "r_txt": r_txt,
		};

		axios({
			url: `${process.env.REACT_APP_HOST}/story/reply/reply_write_confirm`,
			method: 'post',
			data: requestData,
            headers: {
                'Content-Type': 'application/json',
				'authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			// console.log("axios reply write confirm success!!");
			// console.log("response: ",response.data);
			if(response.data === null){
				console.log("database error!!");
			}else if(response.data === 0){
				console.log("database insert fail!!")
			}else if(response.data === 1){
				alert("댓글 등록 성공!!");
				setReplyFlag(pv => !pv);
			}

		})
		.catch(err => {
            console.log("axios reply write confirm error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            // console.log("axios reply write confirm finally!!");
			sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
			removeCookie('accessToken');//
		});

	}

  	const handleKeyDown = (e = React.KeyboardEvent) => {
		// 키가 눌렸을 때 수행될 작업
		if (e.key === 'Enter') {
			storyReplySendBtnClickHandler();
		}
	}

	const storyReplySendBtnClickHandler = () => {
		console.log("storyReplySendBtnClickHandler()");		
		if(r_txt !== '') {
			axios_reply_write_confirm(s_no,r_txt);
			
		}
		setR_txt('');
	}

	

  return (
        <>
          	<div id='story_replys_wrap'>
				<h1 className='story_replys_header'>
					댓글
				</h1>
				<div id="story_replys_overflow">
				{	
					replys.length === 0
					?
					<div className='story_reply_empty'>
                        댓글이 없습니다.
                    </div>
					:
					replys.map((reply,idx) => {				
						return (
							<ReplyUI reply={reply} s_no={s_no} setReplyFlag={setReplyFlag} idx={idx}/>
						)
					})
				}
				</div>
				<div className='story_reply_input'>
					<div className='story_reply_input_profile_thum'>	
					{
						loginedMember !== undefined && loginedMember !== null && loginedMember !== ''
						?
						<img src={`${process.env.REACT_APP_HOST}/${loginedMember.M_ID}/${loginedMember.M_PROFILE_THUMBNAIL}`} alt="" />
						:
						<img src="/imgs/profile_default.png" alt="" />
					}						
					</div>
					<div className='story_reply_input_txt'>
						<input type="text" name='r_txt' value={r_txt} onKeyDown={handleKeyDown} onChange={(e) => setR_txt(e.target.value)}/>
						{
							r_txt !== ''
                            ?
							<button className='send_btn_activ' onClick={storyReplySendBtnClickHandler}><img src="/imgs/send_arrow.png" alt="버튼활성화" /></button>
                            :
                            <button className='send_btn_disabled'><img src="/imgs/send_arrow.png" alt="버튼비활성화" /></button>
						}
					</div>
				</div>
            </div>
        </>
  )
}

export default StoryReplyUI;