import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios';
import Cookies from 'universal-cookie'

import Icon from '@mdi/react'
import { mdiEye } from '@mdi/js';
import { mdiEyeOff } from '@mdi/js';

import CloseButton from 'react-bootstrap/CloseButton'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'

const UsersForm = (props) => {
    let navigate = useNavigate();

    const displayNone = "d-none";
    const cookies = new Cookies();

    // To fix issue where useEffects would trigger when component was loaded
    const [isLoadEdit, setIsLoadEdit] = useState(false);
    const [isLoadAdd, setIsLoadAdd] = useState(false);
    const [isLoadDisable, setIsLoadDisable] = useState(false);

    const [FormTitle, setFormTitle] = useState("");
    const [emailEnable, setEmailEnable] = useState("");
    const [FormSubmit, setFormSubmit] = useState("");
    const [passwordEnable, setPasswordEnable] = useState("");
    const [roleEnable, setRoleEnable] = useState("");
    const [InvalidInput, setInvalidInput] = useState("");
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    
    const [onConfirmationScreen, setOnConfirmationScreen] = useState(false);
    const [submitType, setSubmitType] = useState("submit");
    const [validated, setValidated] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password1: "",
        password2: "",
        role: ""
    });

    const [backEnabled, setBackEnabled] = useState({
        backButton: displayNone
    })

    const enableBackButton = () => {
        setBackEnabled({
            backButton: "btn btn-light py-2 px-5 my-1 shadow-sm border"
        });
    }
    const disableBackButton = () => {
        setBackEnabled({
            backButton: displayNone
        });
    }

    // calls disableForm function located in Users.js
    const disableForm = () => {
        props.disableForm();
    }

    const handleAddUser = () => {
        // calls enableForm function located in Users.js
        props.enableForm();

        setInvalidInput("");
        setEmailEnable("");
        setPasswordEnable("");
        setRoleEnable("");
        setFormTitle("Add User");
        setFormSubmit("Add");
        disableBackButton();
        setErrors({});
        setForm({
            email: "",
            password1: "",
            password2: "",
            role: ""
        });
    }

    useEffect(() => {
        if (isLoadAdd) handleAddUser();
        else setIsLoadAdd(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [props.handleAddUser]);

    const handleEditUser = (email, role) => {
        // calls enableForm function located in Users.js
        props.enableForm();

        setEmailEnable("disable");
        setPasswordEnable("");
        setRoleEnable("");
        setFormTitle("Edit User");
        setFormSubmit("Save Changes");
        disableBackButton();
        setForm({
            email: email,
            password1: "",
            password2: "",
            role: role
        });
    }

    // values email and role are passed from Users.js
    useEffect(() => {
        if (isLoadEdit) handleEditUser(props.editValues.email, props.editValues.role);
        else setIsLoadEdit(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [props.handleEditUser]);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        setInvalidInput("");

        const newErrors = findFormErrors();

        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        }

        else if(InvalidInput.length === 0) {
            if(FormTitle === "Add User") {
                setFormTitle("Confirm creation?");
            }
            else if(FormTitle === "Edit User") {
                setFormTitle("Confirm modification?");
            }

            setSubmitType("button");
            setOnConfirmationScreen(true);
            setFormSubmit("Confirm");
            setEmailEnable("disable");
            setPasswordEnable("disable");
            setShowPass(false);
            setShowPass2(false);
            setRoleEnable("disable");
            enableBackButton();
            setErrors({});
        }
    }

    const handleConfirm = (event) => {
        event.preventDefault();
        event.stopPropagation();

        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }

        let data = {
            email: form.email,
            password: form.password1,
            role: form.role
        }

        if(FormTitle === "Confirm modification?") {
            onUpdateClick();
        }
        else if(FormTitle === "Confirm creation?") {
            Axios.post(`${process.env.REACT_APP_API}/users/`, data, {headers: header})
            .then((response) => {
                if(response.status === 200 || response.status === 201) {
                    disableForm();
                }
            })
            .catch((error) => {
                if (error.response) {
                    if(error.response.status === 403 || error.response.status === 401) {
                        setInvalidInput(error.response.data.message || "");
                        navigate("/login");
                    }
                    else {
                        console.log(error.response.data.message);
                        setInvalidInput(error.response.data.message);

                        handleGoBack();
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    setInvalidInput("Could not reach B&C Engine...");
                  }
            });
        }
    }

    const findFormErrors = () => {
        const {email, password1, password2, role} = form;
        const newErrors = {};

        // email errors
        if(!email || email === "") newErrors.email = "This field cannot be empty!";
        else if(!email.endsWith("@benoit-cote.com")) newErrors.email = "Invalid email. Must end with 'benoit-cote.com'.";
        
        // password errors
        if(!password1 || password1 === "") {
                newErrors.password1 = "This field cannot be empty!";

        }else if(!RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})").exec(password1)) {
            newErrors.password1 = "Password must be at least 8 characters, contain 1 upper-case and 1 lower-case letter, and contain a number.";

        }
        if(password1 !== password2) {
            newErrors.password1 = "Passwords must match!";
            newErrors.password2 = "Passwords must match!";

        }
        if(!password2 || password2 === "") {
            newErrors.password2 = "This field cannot be empty!";
        }
        
        // role errors
        if(!role || role === "") newErrors.role = "Must select a role!";

        return newErrors;
    }

    const setField = (field, value) => {
        setForm({
          ...form,
          [field]: value
        });

        if ( !!errors[field] ){
            setErrors({
                ...errors,
                [field]: null
              });
        } 
    }
    
    const onUpdateClick = () => {
        let header = {
            'authorization': "Bearer " + cookies.get("accessToken")
        }
    
        Axios.defaults.withCredentials = true;
    
        let user = {
            email: form.email,
            password: form.password2,
            role: form.role
        };

        Axios.put(`${process.env.REACT_APP_API}/users/modify/${form.email}`, user, {headers: header})
        .then((response) => {
            if(response.data === true)
            {
                console.log("User modified successfully!");
            }
            disableForm();
        })
        .catch((error) => {
            if(error.response) {
                if(error.response.status === 401 || error.response.status === 403) {
                    setInvalidInput("Cannot recognize the email address");
                }
            }
            else if(error.request) {
                setInvalidInput("Can't send the request to modify the user");
            }
        });    

        setValidated(true);
        return false;     
    }

    const handleGoBack = () => {
        if(FormTitle === "Confirm creation?") {
            setEmailEnable("");
            setFormTitle("Add User");
            setFormSubmit("Add");
        }
        else if(FormTitle === "Confirm modification?") {
            setEmailEnable("disable");
            setFormTitle("Edit User");
            setFormSubmit("Save Changes");
        }

        setSubmitType("submit");
        setOnConfirmationScreen(false);
        setPasswordEnable("");
        setRoleEnable("");
        disableBackButton();
    }

    const showHide = (firstPassword) => {
        if(firstPassword) {
            if(showPass) setShowPass(false);
            else setShowPass(true);
        }
        else {
            if(showPass2) setShowPass2(false);
            else setShowPass2(true);
        }
    }

    useEffect(() => {
        if(isLoadDisable) {
            setValidated(false);
            setOnConfirmationScreen(false);
            setSubmitType("submit");
    
            Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = "")
            );
            Array.from(document.querySelectorAll("select")).forEach(
                select => (select.value = "")
            );
        }
        else {
            setIsLoadDisable(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [props.handleDisableForm]);

    return (
        <div>
            <CloseButton 
                className="position-absolute top-0 end-0 m-4"
                onClick={disableForm}/>

            <Form
                noValidate 
                className="mt-4 mx-5 uForm" 
                validated={validated} 
                onSubmit={handleSubmit}>

            <h1 className="display-4 text-center mb-5">{FormTitle}</h1>

            {
                InvalidInput.length > 0 ? 
                <Alert id="alertUserForm" variant="danger">
                    {InvalidInput}
                </Alert> :
                <></>
            }

            <Form.Group className="mb-4" controlId="floatingEmail">
                <FloatingLabel controlId="floatingEmail" label="Email address" className="mb-3" >
                    <Form.Control 
                        required
                        type="email"
                        onChange={(e) => setField('email', e.target.value)}
                        value={form.email}
                        autoComplete='new-email'
                        disabled={emailEnable}
                        isInvalid={!!errors.email}
                    />

                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-4" controlId="floatingPassword1">
                <FloatingLabel controlId="floatingPassword1" label="Password" className="mb-3" >
                    <Form.Control 
                        required 
                        type={showPass ? "text" : "password"}
                        onChange={(e) => setField('password1', e.target.value)}
                        autoComplete='new-password'
                        disabled={passwordEnable}
                        value={form.password1}
                        isInvalid={!!errors.password1}
                    />
                    {
                        passwordEnable ? 
                        <></> :
                        <Icon 
                            className='showHideBTN'
                            path={showPass ? mdiEye : mdiEyeOff}
                            onClick={() => showHide(true)} 
                            size={1} />
                    }
                    

                    <Form.Control.Feedback type="invalid">
                        {errors.password1}
                    </Form.Control.Feedback>
                </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-4" controlId="floatingPassword2">
                <FloatingLabel controlId="floatingPassword2" label="Confirm Password" className="mb-3" >
                    <Form.Control 
                        required 
                        type={showPass2 ? "text" : "password"}
                        onChange={(e) => setField('password2', e.target.value)}
                        autoComplete='off'
                        value={form.password2}
                        disabled={passwordEnable}
                        isInvalid={!!errors.password2}
                    />

                    {
                        passwordEnable ? 
                        <></> :
                        <Icon 
                            className='showHideBTN'
                            path={showPass2 ? mdiEye : mdiEyeOff}
                            onClick={() => showHide(false)} 
                            size={1}  />
                    }
                    

                    <Form.Control.Feedback type="invalid">
                        {errors.password2}
                    </Form.Control.Feedback>
                </FloatingLabel>
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="floatingModifyRole">
                <Form.Label>Role</Form.Label>
                <Form.Select required
                            size="sm" 
                            aria-label="Default select example"
                            onChange={(e) => setField('role', e.target.value)}
                            value={form.role}
                            disabled={roleEnable}
                            isInvalid={!!errors.role}>

                    <option value="">Select User</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                    
                </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-center mt-3 mb-4 position-aboslute bottom-0">
                <Button 
                    type={submitType} 
                    className="btn btn-light py-2 px-5 my-1 mx-2 shadow-sm border submitButton"
                    style={{display: 'inline-block'}}
                    onClick={onConfirmationScreen ? handleConfirm : undefined}>
                    {FormSubmit}
                </Button>
                

                <Button 
                    className={backEnabled.backButton}
                    style={{display: 'inline-block'}}
                    onClick={handleGoBack}>
                    Go back
                </Button>
                
            </div>
        </Form>
    </div>
    );
}

export default UsersForm