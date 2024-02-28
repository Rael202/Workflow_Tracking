import React from 'react'
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteIssue } from '../../utils/workflow';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const DeleteIssue = ({issueId}) => {

    const removeIssue =  () => {
        try {
          deleteIssue(issueId);
          toast(<NotificationSuccess text="Project Issue removed successfully." />);
          window.location.reload()
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to Remove a Project Issue" />);
        }
      }

  return (
    <Button variant="danger" className="rounded-pill px-0" style={{ width: "38px" }}
        onClick={() => { 
            removeIssue()
        }}
    >
      <i class="bi bi-trash"></i>
    </Button>
  )
}

export default DeleteIssue