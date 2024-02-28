import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddIssue = ({save}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedMember, setAssignedMember] = useState("");
    const [projectPhase, setProjectPhase] = useState("");
    const [labels, setLabels] = useState("");

    const isFormFilled = () => title && description && dueDate && status && priority && assignedMember && projectPhase && labels;

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
                    <Modal.Title>New Issue</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel controlId="inputName" label="Issue title" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setTitle(e.target.value);
                            }} placeholder="Enter title of issue" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputDescription" label="Description" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setDescription(e.target.value);
                            }} placeholder="Enter description of issue" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputDueDate" label="Due Date" className="mb-3">
                            <Form.Control type="date" onChange={(e) => {
                                setDueDate(e.target.value);
                            }} placeholder="Enter due date of issue" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputStatus" label="Status" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setStatus(e.target.value);
                            }} placeholder="Enter status of issue" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputPriority" label="Priority" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setPriority(e.target.value);
                            }} placeholder="Enter priority of issue" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputAssignedMember" label="Assigned Member" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setAssignedMember(e.target.value);
                            }} placeholder="Enter assigned member of issue" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputProjectPhase" label="Project Phase" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setProjectPhase(e.target.value);
                            }} placeholder="Enter project phase of issue" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputLabels" label="Labels" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setLabels(e.target.value);
                            }} placeholder="Enter labels of issue" />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary"
                         disabled={!isFormFilled()}
                         onClick={() => {
                            save({title, description, dueDate, status, priority, assignedMember, projectPhase, labels});
                            handleClose();
                        }}>Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
        
    )
}

AddIssue.propTypes = {
    save: PropTypes.func.isRequired
}

export default AddIssue