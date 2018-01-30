---
layout: blog
title: " Kubernetes Community Meeting Notes - 20160225 "
date:  Wednesday, March 01, 2016 

---
### February 25th - Redspread demo, 1.2 update and planning 1.3, newbie introductions, SIG-networking and a shout out to CoreOS blog post.

The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via videoconference. Here are the notes from the latest meeting.

- 
Note taker: [Ilan Rabinovich]
- 
Quick call out for sharing presentations/slides [JBeda] 

  - 
[https://github.com/jbeda/slides-kubernetes-101](https://github.com/jbeda/slides-kubernetes-101)
- 
Demo (10 min):[Redspread](https://redspread.com/) [Mackenzie Burnett, Dan Gillespie]

  - 
Just open sourced
  - 
YC company
  - 
[https://github.com/redspread/spread](https://github.com/redspread/spread)
  - 
Streamline tool to build/push/deploy to k8s in one command
  - 
Looking forward to offline development of k8s cluster.
  - 
Client only

    - 
reuses a lot of kubectl code
    - 
Convention on directory structure
  - 
Roadmap

    - 
Linking between Kube objects as an app definition.
    - 
Parameterization and versioning of configs (eg git for k8s)
  - 
Happily welcoming contributors and user feedback via github ([https://github.com/redspread/spread](https://github.com/redspread/spread) or firstname@redspread.com)
  - 
Q/A

    - 
Brian Grant asked for feedback on how to reorganize the kubectl code base to make projects like redspread easier.
- 
1.2 Release Watch [T.J. Goltermann]

  - 
[committed in 1.2](https://github.com/kubernetes/kubernetes/milestones/v1.2)

    - 
currently about 80 issues in the queue that need to be addressed before branching.
    - 
currently looks like March 7th may slip to later in the week, but up in the air until flakey tests are resolved.
    - 
non-1.2 changes may be delayed in review/merging until 1.2 stabilization work completes.
  - 
[might make 1.2](https://github.com/kubernetes/kubernetes/milestones/v1.2-candidate)
  - 
1.3 release planning

    - 
March 17th meeting will discuss features from community members and Google. Bring your notes/plans to that meeting
- 
Newbie Introductions 
- 
SIG Reports -

  - 
Networking [Tim Hockin]

    - 
Meets later today.
    - 
Working on a (proto)-specification for a 3rd party resource to describe network policies. (eg pod x can talk to service y, or frontends can/cannot talk to backends)

      - 
Currently ironing out naming/structure
      - 
Calico has a running demo that shows Calico project enforcing network policy based on an earlier form of the spec.
      - 
 Shouldn’t require any changes to the 1.2 code
      - 
Goal is to submit it as part of the 1.3 cycle.
  - 
Scale [Bob Wise]

    - 
CoreOS Blog post on scheduler scaling- https://coreos.com/blog/improving-kubernetes-scheduler-performance.html
  - 
[Cluster Ops](https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit?pref=2&pli=1#) [Rob Hirschfeld]

    - 
meeting last Friday went very well. &nbsp;Discussed charter AND a working deployment
    - 
moved meeting to Thursdays @ 1 (so in 3 hours!)
    - 
Rob is posting a Cluster Ops announce on TheNewStack to recruit more members
- 
GSoC participation -- no application submitted. &nbsp;[Sarah Novotny]
- 
Brian Grant has offered to review PRs that need attention for 1.2 
- 
Dynamic Provisioning 

  - 
Currently overlaps a bit with the ubernetes work
  - 
PR in progress. 
  - 
Should work in 1.2, but being targeted more in 1.3
- 
Next meeting is March 3rd.

  - 
Demo from Weave on Kubernetes Anywhere
  - 
Another Kubernetes 1.2 update
  - 
Update from CNCF update
  - 
1.3 commitments from google 
- 
No meeting on March 10th. &nbsp;

  - 
See you at [Kubecon EU](http://blog.kubernetes.io/2016/02/kubecon-eu-2016-kubernetes-community-in.html)

To get involved in the Kubernetes community consider joining our [Slack channel](http://slack.k8s.io/), taking a look at the [Kubernetes project](https://github.com/kubernetes/) on GitHub, or join the [Kubernetes-dev Google group](https://groups.google.com/forum/#!forum/kubernetes-dev). If you’re really excited, you can do all of the above and join us for the next community conversation — March 3rd, 2016. Please add yourself or a topic you want to know about to the [agenda](https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#) and get a calendar invitation by joining [this group](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat). &nbsp;&nbsp;
The full recording is available on YouTube in the growing archive of [Kubernetes Community Meetings](https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ)._-- Kubernetes Community_