import React from 'react';
import {Link} from 'react-router-dom'

import '../styles/header.css'

import {Icon} from './icons';

const basePath = process.env.PUBLIC_URL;

const Header = () => (
    <header>
        <nav>
            <ul className={"inline-nav"}>
                <li><Link to={`${basePath}/home`}><Icon iconId="home" />Home</Link></li>
                <li><Link to={`${basePath}/about`}>About</Link></li>
                <li><Link to={`${basePath}/posts`}>Posts</Link></li>
            </ul>
        </nav>
    </header>
);

export default Header;
