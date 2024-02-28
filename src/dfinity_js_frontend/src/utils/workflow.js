

export async function createIssue(issue) {
  return window.canister.workflow.addIssue(issue);
}

export async function createMember(member) {
  return window.canister.workflow.addMember(member);
}

export async function deleteIssue(id) {
  return window.canister.workflow.deleteIssue(id);
}

export async function deleteMember(id) {
  return window.canister.workflow.deleteMember(id);
}

export async function filterIssues(filter) {
  return window.canister.workflow.filterByStatus(filter);
}

export async function getAllIssuesByProjectPhase(projectPhase) {
  return window.canister.workflow.getAllIssuesByProjectPhase(projectPhase);
}

export async function getComments() {
  return window.canister.workflow.getComments();
}

export async function getIssue(id) {
  return window.canister.workflow.getIssue(id);
}

export async function getIssuesByMember (memberId) {
  return window.canister.workflow.getIssuesByMember(memberId);
}



export async function getIssues() {
  try {
    return await window.canister.workflow.getIssues();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getMembers() {
  try {
    return await window.canister.workflow.getMembers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getMember(id) {
  return window.canister.workflow.getMember(id);
}

export async function getPercentageOfIssues(){
  return window.canister.workflow.getPercentageOfIssues();
}

export async function insertComment(id,comment) {
  return window.canister.workflow.insertComment(id,comment);
}

export async function searchIssues(search) {
  return window.canister.workflow.searchIssues(search);
}

export async function updateIssue(issue) {
  return window.canister.workflow.updateIssue(issue);
}

export async function updateMember(member) {
  return window.canister.workflow.updateMember(member);
}

export async function updateStatus(issueId, status) {
  return window.canister.workflow.changeStatus(issueId, status);
}


