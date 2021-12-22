import Icon from '@mdi/react'
import { mdiPencil } from '@mdi/js';
import { mdiPencilOutline } from '@mdi/js';

const EditButton = ({ onEdit }) => {
    return (
        <button className="btnEdit btn-edit" onClick={onEdit}>
        <Icon path={mdiPencil} 
            className="mdi mdi-edit" 
            title="edit Button"
            size={1}
            horizontal/>

        <Icon path={mdiPencilOutline}
            className="mdi mdi-edit-empty" 
            title="edit Button empty"
            size={1}
            horizontal/>
    </button>

     
    )
}

export default EditButton
