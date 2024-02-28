import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";



const AddMember = ({save}) => {
    const [name, setName] = useState("");
    const [skill, setSkill] = useState("");
    const [experience, setExperience] = useState("");

    const isFormFilled = () => name && skill && experience;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button onClick={handleShow} variant="dark" className="rounded-pill px-0" style={{ width: "38px" }}>
                <i className="bi bi-plus
                "></i>
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Member</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel controlId="inputName" label="Member name" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setName(e.target.value);
                            }} placeholder="Enter name of member" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputSkills" label="Skills" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setSkill(e.target.value);
                            }} placeholder="Enter skills of member" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputExperience" label="Experience" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setExperience(e.target.value);
                            }} placeholder="Enter experience of member" />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary"
                            disabled={!isFormFilled()}
                            onClick={() => {
                            save({ name, skill, experience });
                            handleClose();
                            
                            }}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>

    )
}

AddMember.propTypes = {
    save: PropTypes.func.isRequired,
};


export default AddMember