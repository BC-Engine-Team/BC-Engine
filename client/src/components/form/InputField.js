import { useState } from 'react'

const InputField = (props) => {
    const [state, setState] = useState(props)
    
    const handleChange = (val) => {
        setState({
            value: val,
            name: state.name,
            placeholder: state.placeholder,
        })
    }

    return (
        <div className="form-group">
            <label className="pb-2" for={state.name}>{state.name}</label>
            <input 
                className="form-control"
                type={state.name}
                name={state.name}
                id={state.name}
                placeholder={state.placeholder}
                value={state.value}
                onChange={(e) => handleChange(e.target.value)} />
        </div>
    )
}

export default InputField
