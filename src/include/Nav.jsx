import axios from 'axios';
import $ from 'jquery';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import NavLi from '../component/main_nav/NavLi';
import '../css/nav.css';
import { removeCookie } from '../util/cookie';


const Nav = () => {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //hook

    //handler
    const navModalMouseEnterHandler = () => {      
        $('#nav_wrap div.nav_detail_menu div.nav_detail_modal_wrap').show();      
    }
    const navModalMouseLeaveHandler = () => {      
        $('#nav_wrap div.nav_detail_menu div.nav_detail_modal_wrap').hide();      
    }

    const signOutBtnClickHandler = () => {
        // console.log("signOutBtnClickHandler()");
        axios_sign_out_confirm();
        sessionStorage.removeItem('sessionID');
        sessionStorage.removeItem('member_info');
        dispatch({
            type:'session_out',
            sessionID: null,
            loginedMember: '',
        });
        navigate('/');
    }

    const axios_sign_out_confirm = () => {
        // console.log('axios_sign_out_confirm()');
        
        axios({
            url: `${process.env.REACT_APP_HOST}/member/sign_out_confirm`, 
            method: 'GET',
        })
        .then(response => {
            console.log('AXIOS SIGN OUT COMMUNICATION SUCCESS');
            removeCookie('accessToken');
            
        })
        .catch(error => {
            console.log('AXIOS SIGN OUT COMMUNICATION ERROR');
            
        })
        .finally(() => {
            console.log('AXIOS SIGN OUT COMMUNICATION COMPLETE');

        });
    }
    
    return (
        <div id='nav_wrap'>
            <div id="nav_symbol_wrap">
                <img src="/imgs/symbol_1.png" alt="" />
            </div>
            <ul className='nav_menu'>
                <NavLi command="/" img_src="/imgs/nav_home_icon.png" text="HOME"/>
                <NavLi command="/member/search_member_form" img_src="/imgs/nav_search_icon.png" text="SEARCH"/>
                <NavLi command="/member/follow_list" img_src="/imgs/nav_messege_icon.png" text="ILCHON"/>
                <NavLi command="/story/create_story" img_src="/imgs/nav_create_icon.png" text="CREATE"/>
                <NavLi command="/member/my_home" img_src="/imgs/nav_my_icon.png" text="MY"/>
            </ul>
            <div className="nav_detail_menu" onMouseEnter={navModalMouseEnterHandler} onMouseLeave={navModalMouseLeaveHandler}>
                <div className="nav_detail_img_wrap">
                    <img src="/imgs/nav_detail_icon.png" alt="" />
                </div>
                <div className='nav_detail_text_wrap' >
                    더 보기
                </div>
                <div className='nav_detail_modal_wrap'>
                    <div className='nav_detail_list_wrap'>
                        <ul className='nav_detail_list'>
                            <li><Link to="/member/modify_form">정보수정</Link></li>
                            <li onClick={signOutBtnClickHandler}><a href="">로그아웃</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nav;