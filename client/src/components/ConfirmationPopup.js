import React from 'react'
import '../styles/index.css'
import { useTranslation } from 'react-i18next';

const DeleteUserPopup = ({ open, prompt, title, onAccept, onClose }) => {
    const { t } = useTranslation();

    if (!open) return null;

    return (
        <>
            <div className="obscureBackground" />
            <div className="card popup">
                <h4 className="text-center">{prompt} {title}?</h4>
                <div className='popup-inner'>
                    <button className='cancelDeleteUserButton' onClick={onClose}>{t('user.delete.No')}</button>
                    <button className='deleteUserButton' onClick={onAccept}>{t('user.delete.Yes')}</button>
                </div>
            </div>
        </>
    )
}

export default DeleteUserPopup