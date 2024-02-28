import React from 'react'
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { deleteMember } from '../../utils/workflow';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const DeleteMember = ({memberId}) => {

  const navigate = useNavigate();
    const removeMember =  () => {
        try {
          deleteMember(memberId);
          toast(<NotificationSuccess text="Member  removed successfully." />);
          navigate(-1)
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to Remove a Member " />);
        }
      }
  return (
    <Button variant="danger" className="rounded-pill px-0" style={{ width: "38px" }}
        onClick={() => { 
            removeMember()
        }}
    >
      <i class="bi bi-trash"></i>
    </Button>
  )
}

export default DeleteMember