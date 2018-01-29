---
layout: blog
title: " Kubernetes Community Meeting Notes - 20160211 "
date:  Wednesday, February 16, 2016 

---
### February 11th - Pangaea Demo, #AWS SIG formed, release automation and documentation team introductions. 1.2 update and planning 1.3.&nbsp;
  
The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via videoconference. Here are the notes from the latest meeting.  
  

- 
Note taker: Rob Hirschfeld
- 
Demo: [Pangaea](http://hasura.io/blog/pangaea-point-and-shoot-kubernetes/) [Shahidh K Muhammed, Tanmai Gopal, and Akshaya Acharya]

  - 
Microservices packages
  - 
Focused on Application developers
  - 
Demo at recording +4 minutes
  - 
Single node kubernetes cluster — runs locally using Vagrant CoreOS image
  - 
Single user/system cluster allows use of DNS integration (unlike Compose)

    - 
prevents collisions
  - 
Can run locally or in cloud
  - 
Best contact is via the [Pangaea repo](https://github.com/hasura/pangaea)
- 
SIG Report 

  - 
[SIG Cluster Ops](https://groups.google.com/forum/#!forum/kubernetes-sig-clusterops)

    - 
collecting operators and tools (inventory)
    - 
will set time for meeting: &nbsp;recommendations? &nbsp;time zone?
  - 
Hello world from [SIG-AWS](https://groups.google.com/forum/#!forum/kubernetes-sig-aws)

    - 
running K8s on AWS
- 
Release Automation and an introduction to David McMahon

  - 
Current is heavily documented but not automated
  - 
objectives

    - 
separate build and release
    - 
make it more of a software process (less manual & more repeatable)
    - 
target to have framework built (automation will not be ready next release)
- 
Docs and k8s website redesign proposal and an introduction to John Mulhausen

  - 
Switching from native script munging to Jekyll ([http://jekyllrb.com/docs/home/](http://jekyllrb.com/docs/home/))
  - 
This will allow the system to build docs correctly from Github w/ minimal effort
  - 
Will be check-in triggered
  - 
Getting website style updates
  - 
Want to keep authoring really light
  - 
There will be some automated checks
  - 
Next week: preview of the new website during the community meeting
- 
[@goltermann] 1.2 Release Watch (time +34 minutes) 

  - 
[committed in 1.2](https://github.com/kubernetes/kubernetes/milestones/v1.2)
  - 
[might make 1.2](https://github.com/kubernetes/kubernetes/milestones/v1.2-candidate)
  - 
code slush date: 2/9/2016

    - 
not 100% but close. &nbsp;some resources still moving from beta to v1
  - 
no major features or refactors accepted
  - 
discussion about release criteria: we will hold release date for bugs

    - 
we’re getting accurate counts of bugs. &nbsp;
    - 
hard to predict burn down at this point
- 
Testing flake surge is over (one time event and then maintain test stability)

  - 
if you find a “flaky” test, then it’s a P0 to fix it. &nbsp;Want to eliminate false fail test results

    - 
they are down by 75%! &nbsp;(meaning, that 75% of them are eliminated)
- 
1.3 Planning (time +40 minutes)

  - 
working to cleanup the Github milestones — they should be a source of truth. &nbsp;you can use Github for bug reporting
  - 
push off discussion while 1.2 crunch is under
  - 
Framework

    - 
dates
    - 
prioritization
    - 
feedback
  - 
Design Review meetings
  - 
General discussion about the PRD process — still at the beginning states

  

  - 
Working on a contributor conference
  - 
Rob suggested tracking relationships between PRD/Mgmr authors 
  - 
PLEASE DO REVIEWS — talked about the way people are authorized to +2 reviews.
  
To get involved in the Kubernetes community consider joining our [Slack channel,](http://slack.k8s.io/) taking a look at the [Kubernetes](https://github.com/kubernetes/) project on GitHub, or join the [Kubernetes-dev Google group](https://groups.google.com/forum/#!forum/kubernetes-dev). If you’re really excited, you can do all of the above and join us for the next community conversation — February 18th, 2016. Please add yourself or a topic you want to know about to the [agenda](https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit) and get a calendar invitation by joining [this group](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat).  
  
The full recording is available on YouTube in the growing archive of [Kubernetes Community Meetings](https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ). 