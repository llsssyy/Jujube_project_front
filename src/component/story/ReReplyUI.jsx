import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCookie } from '../../util/cookie';

axios.defaults.withCredentials = true;

const ReReplyUI = (props) => {

    const loginedMember = useSelector(store => store.loginedMember);

    useEffect(() => {
        console.log('ReReplyUI useEffect()');
    },[]);

    const axios_reply_delete_confirm = () => {
		// console.log("axios_reply_delete_confirm()");

		let requestData = {
            'r_no' : props.reReply.R_NO,
            'r_class' : props.reReply.R_CLASS,
        }

		axios({
			url: `${process.env.REACT_APP_HOST}/story/reply/delete_confirm`,
			method: 'delete',
			data: requestData,
            headers: {
                'Content-Type': 'application/json',
                'authorization': sessionStorage.getItem('sessionID'),
            }
		})
		.then(response => {	
			// console.log("axios reply delete confirm success!!");
			// console.log("response: ",response.data);
			if(response.data === null){
				console.log("database error!!");
			}else if(response.data > 0){
				props.setReplyFlag(pv => !pv);               
			}else{
				console.log("database delete fail!!");                
			}

		})
		.catch(err => {
            console.log("axios reply delete confirm error!!");
            console.log("err: ",err);
		})
		.finally(data => {
            // console.log("axios reply delete confirm finally!!");
            sessionStorage.removeItem('sessionID');//
            sessionStorage.setItem('sessionID',getCookie('accessToken'));//
		});

	}

    const reReplyDeleteBtnClickHAndler = () => {
        console.log("reReplyDeleteBtnClickHAndler()");
        if(window.confirm("댓글을 삭제하시겠습니까?")){
            // console.log(`${props.s_no}번 게시물 ${props.reReply.R_NO}번 댓글 삭제 요청`);
            axios_reply_delete_confirm();
        }
    }

    return (
        
        <div id='re_reply_list_wrap'>
            <div>            
                <div className="re_reply_writer_profile">
                    {
                        props.reReply.M_PROFILE_THUMBNAIL !== undefined && props.reReply.M_PROFILE_THUMBNAIL !== null
                        ?
                        <img src={`${process.env.REACT_APP_HOST}/${props.reReply.R_M_ID}/${props.reReply.M_PROFILE_THUMBNAIL}`} alt="" />
                        :
                        <img src="/imgs/profile_default.png" alt="" />
                    }
                </div>
            </div>
            <div className="re_reply_writer_info">
                <div className='re_reply_writer_id'>
                    {`${props.reReply.R_M_ID}`}
                    {
                        props.reReply.R_M_ID === loginedMember.M_ID
                        ?
                        <span id='re_reply_delete_btn' onClick={reReplyDeleteBtnClickHAndler}>
                            댓글삭제
                        </span>
                        :
                        null
                    }
                    
                </div>
                <div className='re_reply_writer_txt'>{props.reReply.R_TXT}</div>
            </div>
            									
        </div>
    )
}

export default ReReplyUI;