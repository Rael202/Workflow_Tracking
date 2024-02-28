import React, { useEffect, useState } from 'react'
import { getMember, updateMember } from '../../utils/workflow';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from 'react-toastify';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const UpdateMember = ({memberId}) => {



    const [name, setName] = useState("");
    const [skill, setSkill] = useState("");
    const [experience, setExperience] = useState("");

    const isFormFilled = () => name && skill && experience;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const member = await getMember(memberId);
                setName(member.name);
                setSkill(member.skill);
                setExperience(member.experience);
            } catch (error) {
                console.error(error);
            }
        };
  
        fetchMember();
    }, [memberId]);

    const Update = async () => {
        try {
            await updateMember({ id: memberId, name, skill, experience});
            toast(<NotificationSuccess text="Member updated successfully." />);
            navigate(-1);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to update a Member." />);
        }
      }
  return (
    <>
      <Button onClick={handleShow} variant="dark" className="rounded-pill px-0" style={{ width: "38px" }}>
        <i class="bi bi-pencil"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Member</Modal.Title>
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
                Update();
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

export default UpdateMember