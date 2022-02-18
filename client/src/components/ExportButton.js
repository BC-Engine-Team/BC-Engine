import Icon from '@mdi/react'
import { mdiFileExport, mdiFileExportOutline } from '@mdi/js'

const EditButton = ({ onExport, id, styles, iconColor }) => {
  return (
    <button id={id} style={styles} className='btnEdit btn-edit' onClick={onExport}>
      <Icon
        path={mdiFileExport}
        style={iconColor}
        className='mdi mdi-edit'
        title='edit Button'
        size={1}
        horizontal
      />

      <Icon
        path={mdiFileExportOutline}
        className='mdi mdi-edit-empty'
        title='edit Button empty'
        size={1}
        horizontal
      />
    </button>
  )
}

export default EditButton
