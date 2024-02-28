import React, { useCallback, useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { createMember, getMembers as getMembersList } from '../../utils/workflow';
import AddMember from './AddMember';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import Loader from '../utils/Loader';
import Member from './Member';
import { useNavigate } from 'react-router-dom';


const Members = () => {
  const [loading, setLoading] = useState(false);
  const [membersList, setMembersList] = useState([]);



  const getMembers = useCallback(async () => {
    try {
      setLoading(true);
      setMembersList(await getMembersList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addMember = async (data) => {
    try {
      setLoading(true);
      createMember(data).then((resp) => {
        getMembers();
      });

      toast(<NotificationSuccess text="Member added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a Member." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMembers();
  } , []);
  return (
    <>
    {!loading ? (
      <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fs-4 fw-bold mb-0">Members</h1>
          <AddMember save={addMember} />
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              {membersList.map((_member, index) => (
                < Member key={index}
                 member={{
                  ..._member
                }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </>
    ) : (
      <Loader />
    )}
    </>
  )
}

export default Members