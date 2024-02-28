import React, { useCallback, useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { createIssue, filterIssues, getIssuesByMember, getIssues as getIssuesList, getPercentageOfIssues, searchIssues } from '../../utils/workflow';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { Row, Button,InputGroup, Form } from "react-bootstrap";
import Loader from '../utils/Loader';
import AddIssue from './AddIssue';
import Issue from './Issue';
import { Link } from 'react-router-dom';



const Issues = () => {

  const [issuesList, setIssuesList] = useState([]);
  const [searchIssue, setSearchIssue] = useState("");
  const [searchById, setSearchById] = useState("")
  const [percantageString, setPercantageString] = useState("");
  const [loading, setLoading] = useState(false);


  const search = async (searchTerm) => {
    try {
      setLoading(true);
      setIssuesList(await searchIssues(searchTerm));
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  const searchByMemberId = async (memberId) => {
    try {
      setLoading(true);
      setIssuesList(await getIssuesByMember(memberId));
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

    const getPercentage = useCallback(async () => {
    try {
      setLoading(true);
      setPercantageString(await getPercentageOfIssues());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });
  const getIssues = useCallback(async () => {
    try {
      setLoading(true);
      setIssuesList(await getIssuesList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addIssue = async (data) => {
    try {
      setLoading(true);
      createIssue(data).then((resp) => {
        getIssues();
      });
      toast(<NotificationSuccess text="Project Issue added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a Project Issue." />);
    } finally {
      setLoading(false);
    }
  };

  const filter = async (filterTerm) => {
    try {
      setLoading(true);
      setIssuesList(await filterIssues(filterTerm));
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getPercentage();
  } , [issuesList]);
  
  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Workflow Tracking</h1>
            <AddIssue save={addIssue} />
          </div>
          <div className="d-flex justify-content-end align-items-center mb-4">
            <InputGroup className="mb-3 mx-2 mx-2">
              <Form.Control
                placeholder="Search by title or description" 
                aria-label="Search"
                aria-describedby="basic-addon2"
                onChange={(e) => setSearchIssue(e.target.value)}
              />
              <Button variant="dark" id="button-addon2"
                onClick={() => search(searchIssue)}
              >
                Search
              </Button>
            </InputGroup>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button variant="outline-dark" onClick={() => getIssues()}>All</Button>
            <Button variant="outline-dark" onClick={() => filter("Pending")}>Pending</Button>
            <Button variant="outline-dark" onClick={() => filter("In Progress")}>In Progress</Button>
            <Button variant="outline-dark" onClick={() => filter("Accomplished")}>Accomplished</Button>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <strong>{percantageString}</strong>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <InputGroup className="mb-3 mx-2 mx-2">
                <Form.Control
                  placeholder="Get Issues Assigned to a Member Id" 
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  onChange={(e) => setSearchById(e.target.value)}
                />
                <Button variant="dark" id="button-addon2"
                  onClick={() => searchByMemberId(searchById)}
                >
                  Get
                </Button>
              </InputGroup>
              <Link to="/members" className='justify-content-center py-2 px-3 
              my-2 bg-dark text-white rounded-pill '>Members</Link> 
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {issuesList.map((_issue, index) => (
              <Issue key={index} issue={{
                ..._issue,
              }
            }
              />
            ))}
          </Row>
            
        </>

      ) : (
        <Loader />
      )}
    </>
  )
}

export default Issues