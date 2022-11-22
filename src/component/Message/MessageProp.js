import React, { useState, useEffect } from 'react';
import './Message.css';
import moment from 'moment';
import { DataStore, Auth } from 'aws-amplify';
import { User, Message } from '../../models';
import { AmplifyS3Image } from '@aws-amplify/ui-react/legacy';

function MessageProp({ message }) {
    const [user, setUser] = useState(User | undefined);
    const [isMe, setIsMe] = useState(false);
    const [messages, setMessages] = useState(message);
    // console.log(messages.image);

    useEffect(() => {
        DataStore.query(User, messages.userID).then(setUser);
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

    useEffect(() => {
        const subscription = DataStore.observe(Message, messages.id).subscribe((data) => {
            // console.log(data.model, data.opType, data.element);
            if (data.model === Message) {
                if (data.opType === 'UPDATE') {
                    setMessages((message) => ({ ...message, ...data.element }));
                }
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <li>
            <p
                className="chat__message"
                style={{
                    backgroundColor: isMe ? '#c9e4fc' : 'white',
                    marginLeft: isMe ? 750 : 0,
                    marginRight: isMe ? 0 : 470,
                }}
            >
                {!isMe && <span className="chat__name">{user?.name}</span>}
                {messages.image && (
                    <div className="chat__image">
                        <AmplifyS3Image imgKey={messages.image} className="chat__image_view" />
                    </div>
                )}
                {messages.content}
                <span className="chat__timestamp">{moment(messages.createdAt).fromNow()}</span>
            </p>
        </li>
    );
}

export default MessageProp;
