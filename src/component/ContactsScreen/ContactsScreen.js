import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CloseIcon from '@material-ui/icons/Close';
import './Contacts.css';
import { useEffect } from 'react';
import { Auth, DataStore } from 'aws-amplify';
import { User } from '../../models';
import ContactListItem from '../ContactListItem/ContactListItem';

function ContactsScreen(props) {
    const [users, setUsers] = useState([User] | null);
    useEffect(() => {
        const fectchUsers = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
            const fectchUsers = await DataStore.query(User);
            setUsers(fectchUsers.filter((user) => user.id !== authUser.attributes.sub));
        };
        // console.log(users);
        fectchUsers();
    }, []);
    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" className="modal__contact">
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: 20, fontWeight: 'bold' }}>
                    List Friend
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="modal__ul">
                    {users &&
                        users.map((user) => {
                            return <ContactListItem key={user.id} user={user} />;
                        })}
                </ul>
            </Modal.Body>
            <Modal.Footer style={{ marginTop: 20, textAlign: 'end' }}>
                <Button onClick={props.onHide} className="modal__button">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ContactsScreen;
