import React, { useEffect, useState } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import AttachFile from '@material-ui/icons/AttachFile';
import MoreVert from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useParams } from 'react-router-dom';
import { ChatRoom, ChatRoomUser, Message, User } from '../../models';
import { Auth, DataStore, SortDirection } from 'aws-amplify';
import MessageProp from '../Message/MessageProp';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';

function Chat() {
    const [input, setInput] = useState('');
    const [seed, setSeed] = useState('');
    const { roomId } = useParams();
    const [chatRoom, setChatRoom] = useState(ChatRoom | null);
    const [messages, setMessages] = useState([Message]);
    const [user, setUser] = useState(User | null);
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchedChatRoom();
    }, [roomId]);

    useEffect(() => {
        fetchedMessages();
    }, [chatRoom]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    useEffect(() => {
        const subscription = DataStore.observe(Message).subscribe((data) => {
            // console.log(data.model, data.opType, data.element);
            if (data.model === Message && data.opType === 'INSERT') {
                setMessages((existingMessages) => [data.element, ...existingMessages]);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const fetchUsers = async () => {
        const chatRoomUsers = await (await DataStore.query(ChatRoomUser))
            .filter((chatRoomUser) => chatRoomUser.chatRoom.id === roomId)
            .map((chatRoomUser) => chatRoomUser.user);

        // setAllUsers(chatRoomUsers);

        const authUser = await Auth.currentAuthenticatedUser();
        setUser(chatRoomUsers.find((user) => user.id != authUser.attributes.sub));
    };

    const fetchedChatRoom = async () => {
        if (!roomId) return;

        const chatRoom = await DataStore.query(ChatRoom, roomId);
        if (!chatRoom) {
            console.error('Coundnt find chat room with this id');
        } else {
            // console.log(chatRoom);
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

    const getLastOnLineText = () => {
        if (!user?.lastOnlineAt) {
            return null;
        }
        // if lastOnlineAt is less than 5 minutes ago show him online
        const lastOnlineDiffMS = moment().diff(moment(user?.lastOnlineAt));
        if (lastOnlineDiffMS < 5 * 60 * 1000) {
            // less than 5 minutes
            return 'online';
        } else {
            return `Last seen ${moment(user.lastOnlineAt).fromNow()}`;
        }
    };

    const resetFields = () => {
        setInput('');
        setIsEmojiOpen(false);
        // setImage(null);
        // setProgress(0);
        // setSoundURI(null);
        // removeMessageReplyTo();
    };

    const updateLastMessage = async (newMessage) => {
        DataStore.save(
            ChatRoom.copyOf(chatRoom, (updateChatRoom) => {
                updateChatRoom.LastMessage = newMessage;
            }),
        );
    };

    const sendMessage = async (e) => {
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(
            new Message({
                content: input,
                userID: user.attributes.sub,
                chatroomID: chatRoom.id,
            }),
        );

        updateLastMessage(newMessage);
        resetFields();
    };

    const onPress = (e) => {
        e.preventDefault();
        if (input) {
            sendMessage();
        } else {
            console.log('fail');
        }
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={user.imageUri} />
                <div className="chat__headerInfo">
                    <h3>{user.name}</h3>
                    <p>{getLastOnLineText()}</p>
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

            <div>
                {isEmojiOpen && (
                    <EmojiPicker
                        width={'none'}
                        onEmojiClick={(emoji) => setInput((currentMessage) => currentMessage + emoji.emoji)}
                    />
                )}
            </div>

            <div className="chat__footer">
                <div className="input__box">
                    <div className="input__icon">
                        <InsertEmoticonIcon
                            onClick={() => {
                                setIsEmojiOpen((currentValue) => !currentValue);
                            }}
                        />
                        <MicIcon />
                    </div>

                    <form>
                        <input
                            className="input__message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message"
                            type="text"
                        />
                        <button onClick={onPress} type="submit" style={{ display: 'none' }}></button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;
