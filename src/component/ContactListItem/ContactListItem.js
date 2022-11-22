import { Avatar } from '@material-ui/core';
import './ContactListItem.css';
import React from 'react';
import CallIcon from '@material-ui/icons/Call';
import DuoIcon from '@material-ui/icons/Duo';
import moment from 'moment';

function ContactListItem({ user }) {
    return (
        <li className="user__contact">
            <Avatar src={user.imageUri} />
            <div className="user__info">
                <p>{user.name}</p>
                {user.lastOnlineAt && <span>{moment(user.lastOnlineAt).fromNow()}</span>}
            </div>
            <div className="user__task">
                <CallIcon className="user__icon" />
                <DuoIcon className="user__icon" />
            </div>
        </li>
    );
}

export default ContactListItem;
