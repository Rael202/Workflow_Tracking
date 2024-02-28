import React, { useEffect, useState } from 'react'
import { getIssue, updateIssue } from '../../utils/workflow';
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from 'react-toastify';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const UpdateIssue = ({issueId}) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedMember, setAssignedMember] = useState("");
    const [projectPhase, setProjectPhase] = useState("");
    const [labels, setLabels] = useState("");
    const [comments, setComments] = useState("");

    const isFormFilled = () => title && description && dueDate && status && priority && assignedMember && projectPhase && labels && comments;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
      const fetchIssue = async () => {
          try {
              const issue = await getIssue(issueId);
              setTitle(issue.title);
              setDescription(issue.description);
              setDueDate(issue.dueDate);
              setStatus(issue.status);
              setPriority(issue.priority);
              setAssignedMember(issue.assignedMember);
              setProjectPhase(issue.projectPhase);
              setLabels(issue.labels);
              setComments(issue.comments);

          } catch (error) {
              console.error(error);
          }
      };

      fetchIssue();
  }, [issueId]);

  
  const Update = async () => {
    try {
        await updateIssue({ id: issueId, title, description, dueDate, status, priority, assignedMember, projectPhase, labels, comments });
        toast(<NotificationSuccess text="Project Issue updated successfully." />);
    } catch (error) {
        console.log({ error });
        toast(<NotificationError text="Failed to update a Project Issue." />);
    }
  }

  return (
    <>
      <Button onClick={handleShow} variant="dark" className="rounded-pill px-0" style={{ width: "38px" }}>
          <i class="bi bi-pencil"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
              <Modal.Title>Update Issue</Modal.Title>
          </Modal.Header>
          <Form>
              <Modal.Body>
                  <FloatingLabel controlId="inputName" label="Issue title" className="mb-3">
                      <Form.Control type="text" value={title} onChange={(e) => {
                          setTitle(e.target.value);
                      }} placeholder="Enter title of issue" />
                  </FloatingLabel>
                  <FloatingLabel controlId="inputDescription" label="Description" className="mb-3">
                      <Form.Control type="text" value={description} onChange={(e) => {
                          setDescription(e.target.value);
                      }} placeholder="Enter description of issue" />
                  </FloatingLabel>
                  <FloatingLabel controlId="inputDueDate" label="Due Date" className="mb-3">
                      <Form.Control type="date" value={dueDate} onChange={(e) => {
                          setDueDate(e.target.value);
                      }} placeholder="Enter due date of issue" />
                  </FloatingLabel>
                  <FloatingLabel controlId="inputStatus" label="Status" className="mb-3">
                      <Form.Control type="text" value={status} onChange={(e) => {
                          setStatus(e.target.value);
                      }} placeholder="Enter status of issue" />
                  </FloatingLabel>
                  <FloatingLabel controlId="inputPriority" label="Priority" className="mb-3">
                      <Form.Control type="text" value={priority} onChange={(e) => {
                          setPriority(e.target.value);
                      }} placeholder="Enter priority of issue" />
                  </FloatingLabel>
                  <FloatingLabel controlId="inputAssignedMember" label="Assigned Member" className="mb-3">
                      <Form.Control type="text" value={assignedMember} onChange={(e) => {
                          setAssignedMember(e.target.value);
                      }} placeholder="Enter assigned member of issue" />
                  </FloatingLabel>
                  <FloatingLabel controlId="inputProjectPhase" label="Project Phase" className="mb-3">
                      <Form.Control type="text" value={projectPhase} onChange={(e) => {
                          setProjectPhase(e.target.value);
                      }
                      } placeholder="Enter project phase of issue" />
                  </FloatingLabel>
                  <FloatingLabel controlId="inputLabels" label="Labels" className="mb-3">
                      <Form.Control type="text" value={labels} onChange={(e) => {
                          setLabels(e.target.value);
                      }} placeholder="Enter labels of issue" />
                  </FloatingLabel>
                  <FloatingLabel controlId="inputComments" label="Comments" className="mb-3">
                      <Form.Control type="text" value={comments} onChange={(e) => {
                          setComments(e.target.value);
                      }} placeholder="Enter comments of issue" />
                  </FloatingLabel>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>Close</Button>
                  <Button variant="primary" onClick={()=>{
                    Update();
                    handleClose();
                    }} disabled={!isFormFilled()}>Update</Button>
              </Modal.Footer>
          </Form>
      </Modal>
      </>

    
  )
}

export default UpdateIssue