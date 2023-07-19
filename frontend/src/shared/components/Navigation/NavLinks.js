import React, { useContext, useState } from "react";
import Modal from "../UIElements/Modal";
import Button from "../FormElements/Button";
import { NavLink } from 'react-router-dom';
import { AuthContext } from "../../context/auth-context";
import './NavLinks.css';
import '../../../places/components/PlaceItem.css';

const NavLinks = props => {

    const auth = useContext(AuthContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const showLogoutHandler = () => setShowLogoutModal(true);

    const cancelLogoutHandler = () => setShowLogoutModal(false);

    const confirmLogoutHandler = () => {
        setShowLogoutModal(false);
        auth.logout();
    };

    return (
        <React.Fragment>
            <Modal 
                show={showLogoutModal} 
                onCancel={cancelLogoutHandler} 
                header="Log Out" 
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelLogoutHandler}>CANCEL</Button>
                        <Button danger onClick={confirmLogoutHandler}>LOG OUT</Button>
                    </React.Fragment>}
            >
                <h3>Log out of your account?</h3>
            </Modal>
            <ul className="nav-links">
                <li>
                    <NavLink exact to="/">ALL USERS</NavLink>
                </li>
                {auth.isLoggedIn && (<li>
                    <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
                </li>)}
                {auth.isLoggedIn && (<li>
                    <NavLink to="/places/new">ADD PLACE</NavLink>
                </li>)}
                {!auth.isLoggedIn && (<li>
                    <NavLink to="/auth">AUTHENTICATE</NavLink>
                </li>)}
                {auth.isLoggedIn && (<li>
                    <button style={{border: "2px solid"}} onClick={showLogoutHandler}>
                        LOG OUT
                    </button>
                </li>)}
            </ul>
        </React.Fragment>
    );
};

export default NavLinks;