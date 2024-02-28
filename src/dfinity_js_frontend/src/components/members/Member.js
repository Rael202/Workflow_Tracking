import React from 'react'
import UpdateMember from './UpdateMember';
import DeleteMember from './DeleteMember';

const Member = ({member}) => {
    const { id, name, skill, experience } = member;
  return (
    <tr key={member.id}>
        <td>{id}</td>
        <td>{name}</td>
        <td>{skill}</td>
        <td>{experience}</td>
        <td className="d-flex justify-content-between align-center">
            <UpdateMember memberId={id} />
            <DeleteMember memberId={id} />
        </td>
    </tr>
  )
}

export default Member