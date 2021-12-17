import React from 'react'
import '../styles/index.css'

export default function DeleteUserPopup({ open, onDelete, onClose }) {
    if(!open) return null;

    return(
        <>
        <div className="obscureBackground"/>
            <div className="card popup">
                <h3>Are you sure you want to delete this user?</h3>
                <div className='popup-inner'>
                    <button className='cancelDeleteUserButton' onClick={onClose}>No</button>
                    <button className='deleteUserButton' onClick={onDelete}>Yes</button>
                </div>
            </div>
        </>
    )
}