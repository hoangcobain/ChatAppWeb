import React, { useState, useEffect } from 'react';
import './Message.css';
import moment from 'moment';
import { DataStore, Auth } from 'aws-amplify';
import { User, Message } from '../../models';

function MessageProp({ message }) {
    const [user, setUser] = useState(User | undefined);
    const [isMe, setIsMe] = useState(false);

    useEffect(() => {
        DataStore.query(User, message.userID).then(setUser);
    }, []);

    useEffect(() => {
        const checkIfMe = async () => {
            if (!user) {
                return;
            }
            const authUser = await Auth.currentAuthenticatedUser();
            setIsMe(user.id === authUser.attributes.sub);
        };
        checkIfMe();
    }, [user]);

    return (
        <li>
            <p
                className="chat__message"
                style={{
                    backgroundColor: isMe ? '#c9e4fc' : 'white',
                    marginLeft: isMe ? 470 : 0,
                    marginRight: isMe ? 0 : 470,
                }}
            >
                {!isMe && <span className="chat__name">{user?.name}</span>}
                {message.content}
                <span className="chat__timestamp">{moment(message.createdAt).fromNow()}</span>
            </p>
        </li>
    );
}

export default MessageProp;
