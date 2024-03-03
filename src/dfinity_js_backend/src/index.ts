import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

const Issue = Record({
    id: text,
    title: text,
    description: text,
    dueDate: text,
    status: text,
    priority: text,
    assignedMember: text,
    projectPhase: text,
    labels: text,
    comments: text,
});

const IssuePayload = Record({
    title: text,
    description: text,
    dueDate: text,
    status: text,
    priority: text,
    assignedMember: text,
    projectPhase: text,
    labels: text,
});

const Member = Record({
    id: text,
    name: text,
    skill: text,
    experience: text,
});

const MemberPayload = Record({
    name: text,
    skill: text,
    experience: text,
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text
});

const issueStorage = StableBTreeMap(0, text, Issue);
const memberStorage = StableBTreeMap(1, text, Member);

export default Canister({
    getIssues: query([], Vec(Issue), () => {
        return issueStorage.values();
    }),
    getMembers: query([], Vec(Member), () => {
        return memberStorage.values();
    }),
    getIssue: query([text], Result(Issue, Message), (id) => {
        const issueOpt = issueStorage.get(id);
        if ("None" in issueOpt) {
            return Err({ NotFound: `issue with id=${id} not found` });
        }
        return Ok(issueOpt.Some);
    }),

    addIssue: update([IssuePayload], Result(Issue, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ NotFound: "invalid payoad" })
        }
        const issue = { id: uuidv4(), ...payload, comments: ""};
        issueStorage.insert(issue.id, issue);
        return Ok(issue);
    }),

    updateIssue: update([Issue], Result(Issue, Message), (payload) => {
        const issueOpt = issueStorage.get(payload.id);
        if ("None" in issueOpt) {
            return Err({ NotFound: `cannot update the issue: issue with id=${payload.id} not found` });
        }
        const updatedIssue = { ...issueOpt.Some, ...payload };
        issueStorage.insert(updatedIssue.id, updatedIssue);
        return Ok(updatedIssue);
    }),

    deleteIssue: update([text], Result(text, Message), (id) => {
        const deletedIssueOpt = issueStorage.remove(id);
        if ("None" in deletedIssueOpt) {
            return Err({ NotFound: `cannot delete the issue: issue with id=${id} not found` });
        }
        return Ok(deletedIssueOpt.Some.id);
    }),

    addMember: update([MemberPayload], Result(Member, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ NotFound: "invalid payoad" })
        }
        const member = { id: uuidv4(), ...payload };
        memberStorage.insert(member.id, member);
        return Ok(member);
    }),

    updateMember: update([Member], Result(Member, Message), (payload) => {
        const memberOpt = memberStorage.get(payload.id);
        if ("None" in memberOpt) {
            return Err({ NotFound: `cannot update the member: member with id=${payload.id} not found` });
        }
        const updatedMember = { ...memberOpt.Some, ...payload };
        memberStorage.insert(updatedMember.id, updatedMember);
        return Ok(updatedMember);
    }),

    deleteMember: update([text], Result(text, Message), (id) => {
        const deletedMemberOpt = memberStorage.remove(id);
        if ("None" in deletedMemberOpt) {
            return Err({ NotFound: `cannot delete the member: member with id=${id} not found` });
        }
        return Ok(deletedMemberOpt.Some.id);
    }),

    getMember: query([text], Result(Member, Message), (id) => {
        const memberOpt = memberStorage.get(id);
        if ("None" in memberOpt) {
            return Err({ NotFound: `member with id=${id} not found` });
        }
        return Ok(memberOpt.Some);
    }),

    filterByStatus: query([text], Vec(Issue), (status) => {
        return issueStorage.values().filter(issue => issue.status.toLowerCase() === status.toLowerCase());
    }),

    getAllIssuesByProjectPhase: query([text], Vec(Issue), (projectPhase) => {
        return issueStorage.values().filter(issue => issue.projectPhase.toLowerCase() === projectPhase.toLowerCase());
    }),

    searchIssues: query([text], Vec(Issue), (searchText) => {
        return issueStorage.values().filter(issue => issue.title.toLowerCase().includes(searchText.toLowerCase()
         || issue.description.toLowerCase().includes(searchText.toLowerCase())));
    }),

    insertComment: update([text, text], Result(text, Message), (id, comment) => {
        const issueOpt = issueStorage.get(id);
        if ("None" in issueOpt) {
            return Err({ NotFound: `cannot add comment: issue with id=${id} not found` });
        }
        const issue = issueOpt.Some;
        issue.comments = issue.comments + "\n" + comment;
        issueStorage.insert(issue.id, issue);
        return Ok(issue.comments);
    }),

    getComments: query([text], text, (id) => {
        const issueOpt = issueStorage.get(id);
        if ("None" in issueOpt) {
            return "";
        }
        return issueOpt.Some.comments;
    }),

    getIssuesByMember: query([text], Vec(Issue), (memberId) => {
        return issueStorage.values().filter(issue => issue.assignedMember.toLowerCase() === memberId.toLowerCase());
    }),

    getPercentageOfIssues: query([], text, () => {
        const issues = issueStorage.values();
        const totalIssues = issues.length;
        if (totalIssues === 0) {
            return "No issues found.";
        }
        const highPriorityIssues = issues.filter(issue => issue.priority.toLowerCase() === "high").length;
        const mediumPriorityIssues = issues.filter(issue => issue.priority.toLowerCase() === "medium").length;
        const lowPriorityIssues = issues.filter(issue => issue.priority.toLowerCase() === "low").length;
        return {
            totalIssues,
            highPriority: ((highPriorityIssues / totalIssues) * 100).toFixed(2),
            mediumPriority: ((mediumPriorityIssues / totalIssues) * 100).toFixed(2),
            lowPriority: ((lowPriorityIssues / totalIssues) * 100).toFixed(2)
        };
    }),

    changeStatus: update([text, text], Result(text, Message), (id, status) => {
        const issueOpt = issueStorage.get(id);
        if ("None" in issueOpt) {
            return Err({ NotFound: `cannot change status: issue with id=${id} not found` });
        }
        const issue = { ...issueOpt.Some, status };
        issueStorage.insert(issue.id, issue);
        return Ok(issue.status);
    }),
});

function hash(input: any): nat64 {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(input));
    return BigInt(`0x${hash.digest('hex')}`);
};

globalThis.crypto = {
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};
