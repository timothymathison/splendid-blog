import React from 'react';
import {Link} from 'react-router-dom'

import '../styles/header.css'

import {Icon} from './icons';

const Header = () => (
    <header>
        <nav>
            <ul className={"inline-nav"}>
                <li><Link to={'/home'}><Icon iconId="home" />Home</Link></li>
                <li><Link to={'/about'}>About</Link></li>
                <li><Link to={'/posts'}>Posts</Link></li>
            </ul>
        </nav>
    </header>
);

export default Header;
