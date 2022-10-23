import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import './SidebarChat.css';
import { DataStore, Auth } from 'aws-amplify';
import { ChatRoomUser, ChatRoom, User, Message } from '/Users/admin/Documents/ChatApp/CNM/webchatapp/src/models';
import { Link } from 'react-router-dom';

function SidebarChat({ addNewChat, chatRoom }) {
    const [seed, setSeed] = useState('');
    const [user, setUser] = useState(User | null);
    const [lastMessage, setLastMessage] = useState(Message | undefined);
    useEffect(() => {
        const fetchUsers = async () => {
            const chatRoomUsers = await (await DataStore.query(ChatRoomUser))
                .filter((chatRoomUser) => chatRoomUser.chatRoom.id === chatRoom.id)
                .map((chatRoomUser) => chatRoomUser.user);
            // console.log(chatRoomUsers);
            const authUser = await Auth.currentAuthenticatedUser();
            setUser(chatRoomUsers.find((user) => user.id != authUser.attributes.sub));
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    useEffect(() => {
        if (!chatRoom.chatRoomLastMessageId) {
            return;
        }
        DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(setLastMessage);
    }, []);

    const createChat = () => {
        const roomName = prompt('Please enter name for chat');
        if (roomName) {
            // do some clever database stuff...
        }
    };

    if (!user) {
        return;
    }

    return !addNewChat ? (
        <Link to={`/rooms/${chatRoom.id}`}>
            <li>
                <div className="sidebarChat">
                    <Avatar src={user.imageUri} />
                    <div className="sidebarChat__info">
                        <h2>{user.name}</h2>
                        {!chatRoom.lastMessage && <p>{lastMessage?.content}</p>}
                    </div>
                </div>
            </li>
        </Link>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add new Chat</h2>
        </div>
    );
}

export default SidebarChat;
