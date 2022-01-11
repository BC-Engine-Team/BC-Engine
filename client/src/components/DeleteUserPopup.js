import React from 'react'
import '../styles/index.css'

const DeleteUserPopup = ({ open, title, onDelete, onClose }) => {
    if(!open) return null;

    return(
        <>
        <div className="obscureBackground"/>
            <div className="card popup">
                <h4>Are you sure you want to delete {title}?</h4>
                <div className='popup-inner'>
                    <button className='cancelDeleteUserButton' onClick={onClose}>No</button>
                    <button className='deleteUserButton' onClick={onDelete}>Yes</button>
                </div>
            </div>
        </>
    )
}

export default DeleteUserPopup