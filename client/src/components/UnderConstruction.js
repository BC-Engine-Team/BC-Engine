import { useState } from 'react'
import logo from '../Images/underConstruction.gif'

const UnderConstruction = (props) => {
    const [state] = useState(props);

    return (
        <div className="text-center">
            <img src={logo} alt="Under Construction"/>
            <p className="h1">{state.pageName} Page Under Construction</p>
            <p>B&C Dev Team</p>
        </div>
    )
}

export default UnderConstruction
