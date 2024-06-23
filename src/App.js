import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { legacy_createStore as createStore } from 'redux';
import './App.css';
import Wrap from './component/Wrap';
import './css/common.css';

//reducer setting
const initial_state = {
    sessionID: sessionStorage.getItem('sessionID'),
    modal: false,
    s_replys: [],

    info: "",
    button: [],
    story: [],
    friend: 0,
    storylike: 0,
}

const reducer = (currentState = initial_state , action) => {
    // console.log("App reducer()");

    switch(action.type){
        //follow 관련
        case 'follow_btn_click':
            return {...currentState,
                m_id: action.m_id,
                m_profile_thumbnail:action.m_profile_thumbnail,
            };

        //story 관련
        case'story_btn_click': //reply_modal_open
            return {...currentState, 
                modal: action.modal , //modal: true
                s_no: action.s_no, //스토리 번호
            }; 

        case 'reply_modal_close': //reply_modal_close
            return {...currentState, 
                modal: action.modal, //modal: false
            }; 
        
        case 'story_modify_btn_click':  // story modify
            return {...currentState, 
                s_no: action.s_no, //스토리 번호
            };

        //session 관련
        case 'session_out': //서버 세션토큰 만료
            sessionStorage.removeItem('sessionID');
            return {...currentState, 
                sessionID: null, //session 토큰 체크
                loginedMember: '',
            };

        case 'session_enter': //서버 세션토큰 유지
            return {...currentState, 
                sessionID: sessionStorage.getItem('sessionID'), //session 토큰 체크
                loginedMember: action.loginedMember, //loginedMember 로그인한 멤버 ID
            };

        case 'sign_in_success':
            // removeCookie('accessToken');
            return {...currentState, 
                sessionID: sessionStorage.getItem('sessionID'), //session 토큰 체크
                // loginedMember: action.loginedMember //loginedMember 로그인한 멤버 ID
            };  

        // 프로필 관련    
        case 'get_other_id': //다른 사람 정보 가져오기
            // console.log('get_other_id: ', action.member);
            return {...currentState, member:action.member};    

        case 'set_other_info':// 다른 사람 정보 부려주기
            // console.log("set_other_info: ");
            return {...currentState, info:action.info};

        case 'set_my_stories'://내 스토리 가져오기
            // console.log("set_my_stories: ", action.story);
            return {...currentState, story:action.story, storyMemberInfo:action.storyMemberInfo};

        case 'set_my_friend':// 내 친구 수
            // console.log('set_my_friend', action.friend);
            return {...currentState, friend:action.friend}; 

        case 'set_my_button':// 친구 상태
            // console.log('set_my_button', action.button);
            return {...currentState, button:action.button}; 

        case 'story_open_btn':
            return {...currentState, storymodal:action.storymodal};   

        case 'story_like_btn':
            return {...currentState, storylike:currentState.storylike === 0 ? 1 : 0,};   
        default:
            return currentState; 
    }
}

function App() {

	//store
    const store = createStore(reducer);  
    
	return (
		<div className="App">
            <Provider store={store}>                
                <BrowserRouter>
                    <Wrap/>  
                </BrowserRouter>
            </Provider>			
		</div>
	);
}

export default App;

