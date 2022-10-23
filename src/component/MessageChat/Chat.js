import React, { useEffect, useState } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import AttachFile from '@material-ui/icons/AttachFile';
import MoreVert from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useParams } from 'react-router-dom';
import { ChatRoom, Message } from '../../models';
import { DataStore, SortDirection } from 'aws-amplify';
import MessageProp from '../Message/MessageProp';

function Chat() {
    const [input, setInput] = useState('');
    const [seed, setSeed] = useState('');
    const { roomId } = useParams();
    const [chatRoom, setChatRoom] = useState(ChatRoom | null);
    const [messages, setMessages] = useState([Message]);

    useEffect(() => {
        fetchedChatRoom();
    }, []);

    useEffect(() => {
        fetchedMessages();
    }, [chatRoom]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    const fetchedChatRoom = async () => {
        if (!roomId) return;

        const chatRoom = await DataStore.query(ChatRoom, roomId);
        if (!chatRoom) {
            console.error('Coundnt find chat room with this id');
        } else {
            console.log(chatRoom);
            setChatRoom(chatRoom);
        }
    };

    const fetchedMessages = async () => {
        if (!chatRoom) {
            return;
        }
        const fetchedMessages = await DataStore.query(Message, (message) => message.chatroomID('eq', chatRoom?.id), {
            sort: (message) => message.createdAt(SortDirection.DESCENDING),
        });
        setMessages(fetchedMessages);
    };
    if (!chatRoom) {
        return;
    }

    const sendMessage = (e) => {
        e.preventDefault();
        console.log('You types >>> ', input);
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>Last seen at ...</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                <ul className="list__text">
                    {messages.map((message) => {
                        return <MessageProp key={message.id} message={message} />;
                    })}
                </ul>
            </div>

            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                        type="text"
                    />
                    <button onClick={sendMessage} type="submit">
                        Send a message
                    </button>
                </form>
                <MicIcon />
            </div>
        </div>
    );
}

export default Chat;
