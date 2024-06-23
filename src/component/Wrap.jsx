import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useSelector } from 'react-redux';
import '../css/section.css';
import Header from '../include/Header';
import Nav from '../include/Nav';
import Error from './Error';
import Home from './Home';
import FollowForm from './member/FollowForm';
import FollowList from './member/FollowList';
import FollowRequestList from './member/FollowRequestList';
import Modify from './member/Modify';
import SearchMember from './member/SearchMember';
import SignIn from './member/SignIn';
import SignUp from './member/SignUp';
import CreateStory from './section_page/CreateStory';
import ModifyStory from './section_page/ModifyStory';
import MyHome from './section_page/MyHome';
import OtherHome from './section_page/OtherHome';

const Wrap = () => {
    const session = useSelector(store => store.sessionID);

    useEffect(() => {
        console.log("Wrap useEffect()");
    },[session]);

    return (
        <>
            {   
                session !== undefined && session !== null 
                ?
                <>                    
                <nav>
                    <Nav/>
                </nav>                    
                <section>
                    <Header/>                 
                    <Routes>{/* views */}
                        <Route path='/' element={<Home/>}></Route>
                        <Route path='/member/modify_form' element={<Modify/>}></Route>
                        <Route path='/member/search_member_form' element={<SearchMember/>}></Route>
                        {/* <Route path='/member/message' element={<Message/>}></Route> */}
                        <Route path='/story/create_story' element={<CreateStory/>}></Route>
                        <Route path='/story/modify_story' element={<ModifyStory/>}></Route>
                        <Route path='/member/my_home' element={<MyHome/>}></Route>
                        <Route path='/member/other_home' element={<OtherHome/>}></Route>
                        <Route path='/member/follow_form' element={<FollowForm/>}></Route>
                        <Route path='/member/follow_list' element={<FollowList/>}></Route>
                        <Route path='/member/follow_request_list' element={<FollowRequestList/>}></Route>
                        <Route path='/*' element={<Error/>}></Route>
                    </Routes>
                </section>            
                </>
                :                    
                <Routes>{/* views */}
                    <Route path='/*' element={<SignIn/>}></Route>                       
                    <Route path='/member/sign_up_form' element={<SignUp/>}></Route>
                </Routes>
                }
        </>
    )
}

export default Wrap;