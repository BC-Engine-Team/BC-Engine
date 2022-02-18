import Icon from '@mdi/react'
import { mdiDeleteEmpty, mdiDelete } from '@mdi/js'

const DeleteButton = ({ onDelete }) => {
  return (
    <button className='btnDelete btn-delete' onClick={onDelete}>
      <Icon
        path={mdiDelete}
        className='mdi mdi-delete'
        title='delete Button'
        size={1}
        horizontal
      />

      <Icon
        path={mdiDeleteEmpty}
        className='mdi mdi-delete-empty'
        title='delete Button empty'
        size={1}
        horizontal
      />
    </button>
  )
}

export default DeleteButton
