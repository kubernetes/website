---
layout: blog
title: " Kubernetes Community Meeting Notes - 20160218 "
date:  Wednesday, February 23, 2016 

---
### February 18th - kmachine demo, clusterops SIG formed, new k8s.io website preview, 1.2 update and planning 1.3

The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via videoconference. Here are the notes from the latest meeting.

- 
Note taker: Rob HIrschfeld
- 
Demo (10 min): [kmachine](https://github.com/skippbox/kmachine) [Sebastien Goasguen] 

  - 
started :01 intro video
  - 
looking to create mirror of Docker tools for Kubernetes (similar to machine, compose, etc)
  - 
kmachine (forked from Docker Machine, so has the same endpoints) 

    - 
creates a single machine w/ kubernetes endpoint setup
    - 
demo showing AWS & Virtual Box
- 
Use Case (10 min): started at :15

  - 
Network isolation for different namespaces

    - 
Pods in namespace1 should not be able to contact Pods in namespace2
    - 
No native implementation at this point
    - 
Project Calico and Openshift have plugins that enable this 

      - 
Calico implements this at the moment here: https://github.com/projectcalico/calico-containers/blob/master/docs/cni/kubernetes/Policy.md
    - 
More details from [Networking SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-network)
- 
SIG Report starter

  - 
Cluster Ops launch meeting Friday ([doc](https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit#)). [Rob Hirschfeld]
- 
Time Zone Discussion [:22]

  - 
This timezone does not work for Asia. &nbsp;
  - 
Considering rotation - once per month
  - 
Likely 5 or 6 PT
  - 
Rob suggested moving the regular meeting up a little
- 
k8s.io website preview [John Mulhausen] [:27]

  - 
using github for docs. &nbsp;you can fork and do a pull request against the site
  - 
will be it’s own kubernetes organization BUT not in the code repo
  - 
Google will offer a “doc bounty” where you can get GCP credits for working on docs
  - 
Uses Jekyll to generate the site (e.g. the ToC)
  - 
Principle will be to 100% GitHub Pages; no script trickery or plugins, just fork/clone, edit, and push
  - 
Hope to launch at Kubecon EU
  - 
Source Repo: [https://github.com/kubernetes/kubernetes.github.io](https://github.com/kubernetes/kubernetes.github.io)
  - 
Preview: [http://kubernetes.github.io](http://kubernetes.github.io/)
  - 
Home Page Only Preview: http://kub.unitedcreations.xyz
- 
1.2 Release Watch [T.J. Goltermann] [:38]

  - 
[committed in 1.2](https://github.com/kubernetes/kubernetes/milestones/v1.2)
  - 
[might make 1.2](https://github.com/kubernetes/kubernetes/milestones/v1.2-candidate)
  - 
[Discussion - trying to find the balance between early and late branch](https://github.com/kubernetes/kubernetes/milestones/v1.2-candidate)

    - 
[it is likely too early to branch (there are \>100 issues)](https://github.com/kubernetes/kubernetes/milestones/v1.2-candidate)
    - 
[thinking to delay by a week based on bug burn down](https://github.com/kubernetes/kubernetes/milestones/v1.2-candidate)
    - 
[for now, we’re leaving it open. &nbsp;it’s at least a week out](https://github.com/kubernetes/kubernetes/milestones/v1.2-candidate)
- 
1.3 Planning update [T.J. Goltermann]

  - 
google 1.3 feature list to be presented 3/3
  - 
Community members (company or otherwise) commitments requested 3/17?
- 
GSoC participation -- deadline 2/19 &nbsp;[Sarah Novotny]

  - 
if you’re interested in being a mentor, please reach out &nbsp;to Sarah today.
- 
March 10th meeting? [Sarah Novotny]

  - 
March 10th is KubeCon EU. &nbsp;I’m inclined to cancel the community meeting. &nbsp;Thoughts?

To get involved in the Kubernetes community consider joining our [Slack channel](http://slack.k8s.io/), taking a look at the [Kubernetes project](https://github.com/kubernetes/) on GitHub, or join the [Kubernetes-dev Google group](https://groups.google.com/forum/#!forum/kubernetes-dev). If you’re really excited, you can do all of the above and join us for the next community conversation — February 25th, 2016. Please add yourself or a topic you want to know about to the [agenda](https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#) and get a calendar invitation by joining [this group](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat). &nbsp;&nbsp;

The full recording is available on YouTube in the growing archive of [Kubernetes Community Meetings](https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ).

  

  

_-- Kubernetes Community_

  

