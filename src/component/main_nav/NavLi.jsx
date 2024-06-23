import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/nav_li.css';

const NavLi = (props) => {

    const [command,setCommand] = useState("");
    const [text,setText] = useState("");
    const [img_src,setImg_src] = useState("");

    useEffect(() => {
        setCommand(props.command);
        setText(props.text);
        setImg_src(props.img_src);
    },[]);      
   

    return (
        <li>
            <Link to={command} >
                <div className='nav_contents' >
                    <div className='nav_img_wrap'><img src={img_src}/></div>
                    <div className='nav_text_wrap'>{text}</div>
                </div>
            </Link>
        </li>
    )
}

export default NavLi;