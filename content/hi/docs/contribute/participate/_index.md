---
शीर्षक: SIG डॉक्स में भाग लेना
सामग्री प्रकार: संकल्पना
वजन: 60
कार्ड:
  नाम: योगदान देना
  वजन: 60
---

<!-- overview -->

SIG डॉक्स उनमें से एक है
[विशेष रुचि समूह](https://github.com/kubernetes/community/blob/master/sig-list.md)
कुबेरनेट्स परियोजना के भीतर, लेखन, अद्यतन और रखरखाव पर केंद्रित
कुबेरनेट्स के लिए समग्र रूप से प्रलेखन। देखना
[समुदाय जीथब रेपो से एसआईजी डॉक्स](https://github.com/kubernetes/community/tree/master/sig-docs)
एसआईजी के बारे में अधिक जानकारी के लिए।

SIG डॉक्स सभी योगदानकर्ताओं की सामग्री और समीक्षाओं का स्वागत करता है। कोई भी खोल सकता है
पुल अनुरोध (पीआर), और सामग्री या टिप्पणी के बारे में मुद्दों को दर्ज करने के लिए किसी का भी स्वागत है
पुल अनुरोधों पर प्रगति पर।

आप भी बन सकते हैं [सदस्य](/docs/contribute/participate/roles-and-responsibilities/#members),
[आलोचक](/docs/contribute/participate/roles-and-responsibilities/#reviewers), या
[अनुमोदक](/docs/contribute/participate/roles-and-responsibilities/#approvers).
इन भूमिकाओं के लिए अधिक पहुंच की आवश्यकता होती है और इसके लिए कुछ जिम्मेदारियों की आवश्यकता होती है
अनुमोदन और परिवर्तन करना। देखना
[](https://github.com/kubernetes/community/blob/master/community-membership.md)
for more information on how membership works within the Kubernetes community.

The rest of this document outlines some unique ways these roles function within
SIG Docs, which is responsible for maintaining one of the most public-facing
aspects of Kubernetes -- the Kubernetes website and documentation.

<!-- body -->

## SIG Docs chairperson

Each SIG, including SIG Docs, selects one or more SIG members to act as
chairpersons. These are points of contact between SIG Docs and other parts of
the Kubernetes organization. They require extensive knowledge of the structure
of the Kubernetes project as a whole and how SIG Docs works within it. See
[Leadership](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
for the current list of chairpersons.

## SIG Docs teams and automation

Automation in SIG Docs relies on two different mechanisms:
GitHub teams and OWNERS files.

### GitHub teams

There are two categories of SIG Docs [teams](https://github.com/orgs/kubernetes/teams?query=sig-docs) on GitHub:

- `@sig-docs-{language}-owners` are approvers and leads
- `@sig-docs-{language}-reviews` are reviewers

Each can be referenced with their `@name` in GitHub comments to communicate with
everyone in that group.

Sometimes Prow and GitHub teams overlap without matching exactly. For
assignment of issues, pull requests, and to support PR approvals, the
automation uses information from `OWNERS` files.

### OWNERS files and front-matter

The Kubernetes project uses an automation tool called prow for automation
related to GitHub issues and pull requests. The
[Kubernetes website repository](https://github.com/kubernetes/website) uses
two [prow plugins](https://github.com/kubernetes/test-infra/tree/master/prow/plugins):

- blunderbuss
- approve

These two plugins use the
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) and
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
files in the top level of the `kubernetes/website` GitHub repository to control
how prow works within the repository.

An OWNERS file contains a list of people who are SIG Docs reviewers and
approvers. OWNERS files can also exist in subdirectories, and can override who
can act as a reviewer or approver of files in that subdirectory and its
descendants. For more information about OWNERS files in general, see
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

In addition, an individual Markdown file can list reviewers and approvers in its
front-matter, either by listing individual GitHub usernames or GitHub groups.

The combination of OWNERS files and front-matter in Markdown files determines
the advice PR owners get from automated systems about who to ask for technical
and editorial review of their PR.

## How merging works

When a pull request is merged to the branch used to publish content, that content is published to http://kubernetes.io. To ensure that
the quality of our published content is high, we limit merging pull requests to
SIG Docs approvers. Here's how it works.

- When a pull request has both the `lgtm` and `approve` labels, has no `hold`
  labels, and all tests are passing, the pull request merges automatically.
- Kubernetes organization members and SIG Docs approvers can add comments to
  prevent automatic merging of a given pull request (by adding a `/hold` comment
  or withholding a `/lgtm` comment).
- Any Kubernetes member can add the `lgtm` label by adding a `/lgtm` comment.
- Only SIG Docs approvers can merge a pull request
  by adding an `/approve` comment. Some approvers also perform additional
  specific roles, such as [PR Wrangler](/docs/contribute/participate/pr-wranglers/) or
  [SIG Docs chairperson](#sig-docs-chairperson).



## {{% heading "whatsnext" %}}


For more information about contributing to the Kubernetes documentation, see:

- [Contributing new content](/docs/contribute/new-content/)
- [Reviewing content](/docs/contribute/review/reviewing-prs)
- [Documentation style guide](/docs/contribute/style/)
