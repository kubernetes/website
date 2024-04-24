---
content_type: concept
title: Contribute to Kubernetes Documentation
weight: 09
card:
  name: contribute
  weight: 11
  title: Contribute to documentation
---


This website is maintained by [Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs).
The Kubernetes project welcomes help from all contributors, new or experienced!

Kubernetes documentation contributors:

- Improve existing content
- Create new content
- Translate the documentation
- Manage and publish the documentation parts of the Kubernetes release cycle

---

{{< note >}}
To learn more about contributing to Kubernetes in general, see the general
[contributor documentation](https://www.kubernetes.dev/docs/) site.
{{< /note >}}


<!-- body -->

## Getting started

Anyone can open an issue about documentation, or contribute a change with a
pull request (PR) to the
[`kubernetes/website` GitHub repository](https://github.com/kubernetes/website).
You need to be comfortable with
[git](https://git-scm.com/) and
[GitHub](https://skills.github.com/)
to work effectively in the Kubernetes community.

To get involved with documentation:

1. Sign the CNCF [Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md).
2. Familiarize yourself with the [documentation repository](https://github.com/kubernetes/website)
   and the website's [static site generator](https://gohugo.io).
3. Make sure you understand the basic processes for
   [opening a pull request](/docs/contribute/new-content/open-a-pr/) and
   [reviewing changes](/docs/contribute/review/reviewing-prs/).

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[Open PR]
direction TB
U[ ] -.-
Q[Improve content] --- N[Create content]
N --- O[Translate docs]
O --- P[Manage/publish docs parts<br>of K8s release cycle]

end

subgraph second[Review]
direction TB
   T[ ] -.-
   D[Look over the<br>kubernetes/website<br>repository] --- E[Check out the<br>Hugo static site<br>generator]
   E --- F[Understand basic<br>GitHub commands]
   F --- G[Review open PR<br>and change review <br>processes]
end

subgraph first[Sign up]
    direction TB
    S[ ] -.-
    B[Sign the CNCF<br>Contributor<br>License Agreement] --- C[Join sig-docs<br>Slack channel] 
    C --- V[Join kubernetes-sig-docs<br>mailing list]
    V --- M[Attend weekly<br>sig-docs calls<br>or slack meetings]
end

A([fa:fa-user New<br>Contributor]) --> first
A --> second
A --> third
A --> H[Ask Questions!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
Figure 1. Getting started for a new contributor.

Figure 1 outlines a roadmap for new contributors. You can follow some or all of
the steps for `Sign up` and `Review`. Now you are ready to open PRs that achieve
your contribution objectives with some listed under `Open PR`. Again, questions
are always welcome!

Some tasks require more trust and more access in the Kubernetes organization.
See [Participating in SIG Docs](/docs/contribute/participate/) for more details about
roles and permissions.

## Your first contribution

You can prepare for your first contribution by reviewing several steps beforehand.
Figure 2 outlines the steps and the details follow.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[First Contribution]
    direction TB
    S[ ] -.-
    G[Review PRs from other<br>K8s members] -->
    A[Check kubernetes/website<br>issues list for<br>good first PRs] --> B[Open a PR!!]
    end
    subgraph first[Suggested Prep]
    direction TB
       T[ ] -.-
       D[Read contribution overview] -->E[Read K8s content<br>and style guides]
       E --> F[Learn about Hugo page<br>content types<br>and shortcodes]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
Figure 2. Preparation for your first contribution.

- Read the [Contribution overview](/docs/contribute/new-content/) to
  learn about the different ways you can contribute.
- Check [`kubernetes/website` issues list](https://github.com/kubernetes/website/issues/)
  for issues that make good entry points.
- [Open a pull request using GitHub](/docs/contribute/new-content/open-a-pr/#changes-using-github)
  to existing documentation and learn more about filing issues in GitHub.
- [Review pull requests](/docs/contribute/review/reviewing-prs/) from other
  Kubernetes community members for accuracy and language.
- Read the Kubernetes [content](/docs/contribute/style/content-guide/) and
  [style guides](/docs/contribute/style/style-guide/) so you can leave informed comments.
- Learn about [page content types](/docs/contribute/style/page-content-types/)
  and [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/).

## Getting help when contributing

Making your first contribution can be overwhelming. The
[New Contributor Ambassadors](https://github.com/kubernetes/website#new-contributor-ambassadors)
are there to walk you through making your first few contributions. You can reach out to them in the
[Kubernetes Slack](https://slack.k8s.io/) preferably in the `#sig-docs` channel. There is also the
[New Contributors Meet and Greet call](https://www.kubernetes.dev/resources/calendar/)
that happens on the first Tuesday of every month. You can interact with the New Contributor Ambassadors
and get your queries resolved here.

## Next steps

- Learn to [work from a local clone](/docs/contribute/new-content/open-a-pr/#fork-the-repo)
  of the repository.
- Document [features in a release](/docs/contribute/new-content/new-features/).
- Participate in [SIG Docs](/docs/contribute/participate/), and become a
  [member or reviewer](/docs/contribute/participate/roles-and-responsibilities/).
                       
- Start or help with a [localization](/docs/contribute/localization/).

## Get involved with SIG Docs

[SIG Docs](/docs/contribute/participate/) is the group of contributors who
publish and maintain Kubernetes documentation and the website. Getting
involved with SIG Docs is a great way for Kubernetes contributors (feature
development or otherwise) to have a large impact on the Kubernetes project.

SIG Docs communicates with different methods:

- [Join `#sig-docs` on the Kubernetes Slack instance](https://slack.k8s.io/). Make sure to
  introduce yourself!
- [Join the `kubernetes-sig-docs` mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  where broader discussions take place and official decisions are recorded.
- Join the [SIG Docs video meeting](https://github.com/kubernetes/community/tree/master/sig-docs)
  held every two weeks. Meetings are always announced on `#sig-docs` and added to the
  [Kubernetes community meetings calendar](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles).
  You'll need to download the [Zoom client](https://zoom.us/download) or dial in using a phone.
- Join the SIG Docs async Slack standup meeting on those weeks when the in-person Zoom
  video meeting does not take place. Meetings are always announced on `#sig-docs`.
  You can contribute to any one of the threads up to 24 hours after meeting announcement.

## Other ways to contribute

- Visit the [Kubernetes community site](/community/). Participate on Twitter or Stack Overflow,
  learn about local Kubernetes meetups and events, and more.
- Read the [contributor cheatsheet](https://www.kubernetes.dev/docs/contributor-cheatsheet/)
  to get involved with Kubernetes feature development.
- Visit the contributor site to learn more about [Kubernetes Contributors](https://www.kubernetes.dev/)
  and [additional contributor resources](https://www.kubernetes.dev/resources/).
- Submit a [blog post or case study](/docs/contribute/new-content/blogs-case-studies/).
