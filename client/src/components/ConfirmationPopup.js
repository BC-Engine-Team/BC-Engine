import React from 'react'
import '../styles/index.css'
import { useTranslation } from 'react-i18next'

const DeleteUserPopup = ({ open, prompt, title, onAccept, onClose }) => {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <>
      <div className='obscure-background' />
      <div className='card popup'>
        <h4 className='text-center'>{prompt} {title}?</h4>
        <div className='popup-inner'>
          <button className='cancel-delete-user-button' onClick={onClose}>{t('user.delete.No')}</button>
          <button className='delete-user-button' onClick={onAccept}>{t('user.delete.Yes')}</button>
        </div>
      </div>
    </>
  )
}

export default DeleteUserPopup
