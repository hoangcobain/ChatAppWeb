import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import './SidebarChat.css';
import { DataStore, Auth } from 'aws-amplify';
import { ChatRoomUser, ChatRoom, User, Message } from '/Users/admin/Documents/ChatApp/CNM/webchatapp/src/models';

function SidebarChat({ addNewChat }) {
    const [seed, setSeed] = useState('');
    const [chatRooms, setChatRooms] = useState([ChatRoom]);
    const [user, setUser] = useState(User | null);
    const [lastMessage, setLastMessage] = useState(Message | undefined);

    useEffect(() => {
        const fetchChatRoom = async () => {
            const userData = await Auth.currentAuthenticatedUser();
            const query = await DataStore.query(ChatRoomUser);
            const chatRoom = (await DataStore.query(ChatRoomUser))
                .filter((chatRoom) => chatRoom.user.id === userData.attributes.sub)
                .map((chatRoom) => chatRoom.chatRoom);

            console.log(chatRoom);

            const chatRoomUsers = await (
                await DataStore.query(ChatRoomUser)
            ).filter((chatRoomUser) => chatRoomUser.chatRoom.id === chatRoom.id);
            // .map((chatRoomUser) => chatRoomUser.user);

            // setChatRooms(chatRoom);

            console.log(chatRoomUsers);

            // console.log(chatRooms);
        };
        fetchChatRoom();
    }, []);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //       const chatRoomUsers =  (await DataStore.query(ChatRoomUser))
    //         .filter((chatRoomUser) => chatRoomUser.chatRoom.id === chatRooms.id)
    //         .map((chatRoomUser) => chatRoomUser.user);

    //         console.log(chatRoomUsers);

    //       const authUser = await Auth.currentAuthenticatedUser();
    //       setUser(chatRoomUsers.find((user) => user.id != authUser.attributes.sub));
    //       console.log(user);
    //     };
    //     fetchUsers();
    //   }, []);

    //   useEffect(() => {
    //     if (!chatRooms.chatRoomLastMessageId) {
    //       return;
    //     }
    //     DataStore.query(Message, chatRooms.chatRoomLastMessageId).then(
    //       setLastMessage
    //     );
    //   }, []);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    const createChat = () => {
        const roomName = prompt('Please enter name for chat');
        if (roomName) {
            // do some clever database stuff...
        }
    };

    return !addNewChat ? (
        <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
            <div className="sidebarChat__info">
                <h2>Room name</h2>
                <p>Last message...</p>
            </div>
        </div>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add new Chat</h2>
        </div>
    );
}

export default SidebarChat;
