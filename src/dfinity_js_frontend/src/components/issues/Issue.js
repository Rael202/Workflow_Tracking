import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Stack, Row, Modal, Form, InputGroup} from "react-bootstrap";
import { toast } from "react-toastify";
import UpdateIssue from "./UpdateIssue";
import DeleteIssue from "./DeleteIssue";
import { insertComment, updateStatus } from "../../utils/workflow";
import AddComment from "./AddComment";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";

const Issue = ({issue}) => {
    const {id, title, description, dueDate, status, priority, assignedMember,
         projectPhase, labels, comments} = issue;

    const [currentStatus, setCurrentStatus] = useState(status);
    
    const addComment = async (issueCommentId, comment) => {
        console.log(issueCommentId, comment)
        try {
            insertComment(issueCommentId, comment).then
            ((resp) => {
                console.log({ resp });
            });
            window.location.reload();
            toast(<NotificationSuccess text="Comment added successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to create a Comment." />);
        } 
    };

    const handleStatusChange = async () => {
        try {
            updateStatus(id, currentStatus).then((res) => {
                console.log(res)
            });
            toast(<NotificationSuccess text="Status changed successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to change status." />);
        }
    }
  
        
  return (
    <Card className="mb-3 mx-2">
        <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>
            {description}
            </Card.Text>
            <Row>
            <Col>
                <Card.Text>
                <strong>Due Date:</strong> {dueDate}
                </Card.Text>
            </Col>
            <Col>
                <Card.Text>
                <strong>Status:</strong> {status}
                </Card.Text>
            </Col>
            <Col>
                <Card.Text>
                <strong>Priority:</strong> {priority}
                </Card.Text>
            </Col>
            </Row>
            <Row>
            <Col>
                <Card.Text>
                <strong>Assigned Member:</strong> {assignedMember}
                </Card.Text>
            </Col>
            <Col>
                <Card.Text>
                <strong>Project Phase:</strong> {projectPhase}
                </Card.Text>
            </Col>
            <Col>
                <Card.Text>
                <strong>Labels:</strong> {labels}
                </Card.Text>
            </Col>
            <Col>
              <Card.Text>
                <strong>Comments:</strong> {comments}
                </Card.Text>
            </Col>
            </Row>
            <Row className="mt-2 justify-content-between">
                <Col>
                    <AddComment addComment={addComment} issueId={id} />
                </Col>
                {/* Form select for status change */}
                <Col>
                   
                    <InputGroup className="mb-3 mx-2 mx-2">
                        <Form.Control
                        placeholder="Status" 
                        aria-label="Status"
                        aria-describedby="basic-addon2"
                        onChange={(e) => setCurrentStatus(e.target.value)}
                        />
                        <Button variant="dark" id="button-addon2"
                        onClick={() => handleStatusChange()}
                        >
                        Change
                        </Button>
                    </InputGroup>
                </Col>
            </Row>
            <Stack direction="horizontal" gap={2} className="mt-2">
            <UpdateIssue issueId={id} />
            <DeleteIssue issueId={id} />
            </Stack>
        </Card.Body>
    </Card>
    
  )
}

export default Issue