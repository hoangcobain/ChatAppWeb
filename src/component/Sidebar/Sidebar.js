import React, { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import { Auth, DataStore } from 'aws-amplify';
import { ChatRoomUser, ChatRoom, User } from '../../models';

import './Sidebar.css';
import SidebarChat from '../SidebarChat/SidebarChat';
import ContactsScreen from '../ContactsScreen/ContactsScreen';

function Sidebar() {
    const [chatRooms, setChatRooms] = useState([ChatRoom]);
    const [user, setUser] = useState(User | null);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        const fetchChatRoom = async () => {
            const userData = await Auth.currentAuthenticatedUser();
            const chatRoom = (await DataStore.query(ChatRoomUser))
                .filter((chatRoom) => chatRoom.user.id === userData.attributes.sub)
                .map((chatRoom) => chatRoom.chatRoom);

            // console.log(chatRoom);
            setChatRooms(chatRoom);
        };
        fetchChatRoom();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await Auth.currentAuthenticatedUser();
            const user = await (await DataStore.query(User)).find((user) => user.id === userData.attributes.sub);
            // console.log(user);
            setUser(user);
        };
        fetchUser();
    }, []);
    const logOut = async () => {
        await Auth.signOut();
        // DataStore.clear();
    };

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user.imageUri} />
                <p className="text">{user.name}</p>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon onClick={() => setModalShow(true)} />
                        <ContactsScreen show={modalShow} onHide={() => setModalShow(false)} />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>

            <div className="sidebar__chats">
                <ul className="user_list">
                    {chatRooms.map((item) => {
                        return <SidebarChat key={item.id} chatRoom={item} />;
                    })}
                </ul>
                <button onClick={logOut}>Logout</button>
            </div>
        </div>
    );
}

export default Sidebar;
