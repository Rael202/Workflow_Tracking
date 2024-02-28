import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

/**
 * This type represents a product that can be listed on a marketplace.
 * It contains basic properties that are needed to define a product.
 */
const Issue = Record({
    id: text,
    title: text,
    description: text,
    dueDate: text,
    status: text,
    priority: text,
    assignedMember: text,
    projectPhase: text,
    labels: text, // eg Bug, Feature, Enhancements etc
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
    // comments: text, comment is "" initial then added when change of project situation
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
        issueStorage.insert(issueOpt.Some.id, payload);
        return Ok(payload);
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
        memberStorage.insert(memberOpt.Some.id, payload);
        return Ok(payload);
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
    }
    ),

    filterByStatus: query([text], Vec(Issue), (status) => {
        return issueStorage.values().filter(issue => issue.status.toLowerCase() === status.toLowerCase());
    }
    ),

    getAllIssuesByProjectPhase: query([text], Vec(Issue), (projectPhase) => {
        return issueStorage.values().filter(issue => issue.projectPhase.toLowerCase() === projectPhase.toLowerCase());
    }

    ),

    searchIssues: query([text], Vec(Issue), (searchText) => {
        return issueStorage.values().filter(issue => issue.title.toLowerCase().includes(searchText.toLowerCase()
         || issue.description.toLowerCase().includes(searchText.toLowerCase())));
    } 
    ),

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
            return "issue with id=" + id + " not found";
        }
        return issueOpt.Some.comments;
    }), 

    getIssuesByMember: query([text], Vec(Issue), (memberId) => {
        return issueStorage.values().filter(issue => issue.assignedMember.toLowerCase() === memberId.toLowerCase());
    }),

    // get Percentage of issues based on Priority
    getPercentageOfIssues: query([], text, () => {
        const issues = issueStorage.values();
        const totalIssues = issues.length;
        const highPriorityIssues = issues.filter(issue => issue.priority.toLowerCase() === "high").length;
        const mediumPriorityIssues = issues.filter(issue => issue.priority.toLowerCase() === "medium").length;
        const lowPriorityIssues = issues.filter(issue => issue.priority.toLowerCase() === "low").length;
        return `Total Issues: ${totalIssues.toString()}, High Priority: ${((highPriorityIssues / totalIssues) * 100).toFixed(2).toString()}%, Medium Priority: ${((mediumPriorityIssues / totalIssues) * 100).toFixed(2).toString()}%, Low Priority: ${((lowPriorityIssues / totalIssues) * 100).toFixed(2).toString()}%`;
    }),

    // change the status of the issue
    changeStatus: update([text, text], Result(text, Message), (id, status) => {
        const issueOpt = issueStorage.get(id);
        if ("None" in issueOpt) {
            return Err({ NotFound: `cannot change status: issue with id=${id} not found` });
        }
        const issue = issueOpt.Some;
        issue.status = status;
        issueStorage.insert(issue.id, issue);
        return Ok(issue.status);
    }),




   
});

/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
*/
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};

// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};

