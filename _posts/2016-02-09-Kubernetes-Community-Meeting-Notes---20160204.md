---
layout: blog
title: " Kubernetes Community Meeting Notes - 20160204 "
date:  Wednesday, February 09, 2016 

---
### February 4th - rkt demo (congratulations on the 1.0, CoreOS!), eBay puts k8s on Openstack and considers Openstack on k8s, SIGs, and flaky test surge makes progress.

  

The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via a videoconference. Here are the notes from the latest meeting.  
  

- 
Note taker: Rob Hirschfeld
- 
Demo (20 min): CoreOS rkt + Kubernetes [Shaya Potter]

  - 
rkt 1.0 [released today](https://coreos.com/blog/rkt-hits-1.0.html)
  - 
expect to see integrations w/ rkt & k8s in the coming months (“rkt-netes”). not integrated into the v1.2 release.
  - 
Shaya gave a demo (8 minutes into meeting for video reference)

    - 
CLI of rkt shown spinning up containers
    - 
[note: audio is garbled at points]
    - 
Discussion about integration w/ k8s & rkt
    - 
rkt community sync next week: https://groups.google.com/forum/#!topic/rkt-dev/FlwZVIEJGbY 
    - 
Dawn Chen:

      - 
The remaining issues of integrating rkt with kubernetes: 1) cadivsor 2) DNS 3) bugs related to logging
      - 
But need more work on e2e test suites
- 
Use Case (10 min): eBay k8s on OpenStack and OpenStack on k8s [Ashwin Raveendran]

  - 
eBay is currently running Kubernetes on OpenStack
  - 
Goal for eBay is to manage the OpenStack control plane w/ k8s. &nbsp;Goal would be to achieve upgrades
  - 
OpenStack Kolla creates containers for the control plane. &nbsp;Uses Ansible+Docker for management of the containers. &nbsp;
  - 
Working on k8s control plan management - Saltstack is proving to be a management challenge at the scale they want to operate. &nbsp;Looking for automated management of the k8s control plane.
- 
SIG Report 

  - 
Wikipage: [https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs)](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs))

    - 
updated by Joe Beda. &nbsp;Please add SIGs there.
    - 
[SIG calendar](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles)
  - 
SIG Openstack [Ashwin Raveendran]

    - 
Meets Tuesday afternoon, bi-weekly
    - 
Kubernetes-Sig-Openstack
  - 
Launch SIG Cluster Ops or SIG Deploy. &nbsp;[Rob Hirschfeld]. &nbsp;please review [Draft Charter](https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit?usp=sharing)

    - 
working to standardize operationalization of Kubernetes
- 
Testing update [Jeff, Joe, and Erick]

  - 
Working to make the workflow about contributing to K8s easier to understanding

    - 
[pull/19714](https://github.com/kubernetes/kubernetes/pull/19714) has flow chart of the bot flow to help users understand
  - 
Need a consistent way to run tests w/ hacking config scripts (you have to fake a Jenkins process right now)
  - 
Want to create necessary infrastructure to make test setup less flaky
  - 
want to decouple test start (single or full) from Jenkins
  - 
goal is to get to point where you have 1 script to run that can be pointed to any cluster
  - 
demo included Google internal views - working to try get that external.
  - 
want to be able to collect test run results
  - 
Bob Wise calls for testing infrastructure to be a blocker on v1.3
  - 
Long discussion about testing practices… 

    - 
consensus that we want to have tests work over multiple platforms.
    - 
would be helpful to have a comprehensive state dump for test reports
    - 
“phone-home” to collect stack traces - should be available 
- 
1.2 Release Watch

  - 
it’s coming!!! 
  - 
[committed in 1.2](https://github.com/kubernetes/kubernetes/milestones/v1.2)
  - 
[might make 1.](https://github.com/kubernetes/kubernetes/milestones/v1.2-candidate)2
  - 
code slush starts - Friday or Monday
- 
CoC [Sarah]

  - 
=========== RAN OUT OF TIME ===============
  - 
Existing CoC: [https://github.com/kubernetes/kubernetes/blob/master/code-of-conduct.md](https://github.com/kubernetes/kubernetes/blob/master/code-of-conduct.md)
  - 
Previous Discussion: [https://github.com/kubernetes/kubernetes/pull/13578](https://github.com/kubernetes/kubernetes/pull/13578)
- 
GSoC [Sarah]

  - 
need mentors!! &nbsp;deadline is very soon.

  

To get involved in the Kubernetes community consider joining our [Slack channel](http://slack.k8s.io/), taking a look at the [Kubernetes project](https://github.com/kubernetes/) on GitHub, or join the [Kubernetes-dev Google group](https://groups.google.com/forum/#!forum/kubernetes-dev). If you’re really excited, you can do all of the above and join us for the next community conversation — February 11th, 2016. Please add yourself or a topic you want to know about to the [agenda](https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#) and get a calendar invitation by joining [this group](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat). &nbsp;&nbsp;
  

The full recording is available on YouTube in the growing archive of [Kubernetes Community Meetings](https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ).  
  

  

  

  

