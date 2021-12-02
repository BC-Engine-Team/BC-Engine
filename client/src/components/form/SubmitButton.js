import React, { useState } from 'react'

const SubmitButton = (props) => {
    const [state, setstate] = useState(props);
    return (
        <div className="d-flex justify-content-center">
            <input className="submitButton btn btn-light px-4 shadow-sm border mb-5" type="submit" name="submitBTN" value={state.name}/>
        </div>
    )
}

export default SubmitButton
