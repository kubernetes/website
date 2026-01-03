---
title: " Kubernetes Community Meeting Notes - 20160204 "
date: 2016-02-09
slug: kubernetes-community-meeting-notes
url: /blog/2016/02/Kubernetes-Community-Meeting-Notes
---
####  February 4th - rkt demo (congratulations on the 1.0, CoreOS!), eBay puts k8s on Openstack and considers Openstack on k8s, SIGs, and flaky test surge makes progress.

The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via a videoconference. Here are the notes from the latest meeting.

* Note taker: Rob Hirschfeld
* Demo (20 min): CoreOS rkt + Kubernetes [Shaya Potter]
    * expect to see integrations w/ rkt & k8s in the coming months ("rkt-netes"). not integrated into the v1.2 release.
    * Shaya gave a demo (8 minutes into meeting for video reference)
        * CLI of rkt shown spinning up containers
        * [note: audio is garbled at points]
        * Discussion about integration w/ k8s & rkt
        * rkt community sync next week: https://groups.google.com/forum/#!topic/rkt-dev/FlwZVIEJGbY

        * Dawn Chen:
            * The remaining issues of integrating rkt with kubernetes: 1) cadivsor 2) DNS 3) bugs related to logging
            * But need more work on e2e test suites
* Use Case (10 min): eBay k8s on OpenStack and OpenStack on k8s [Ashwin Raveendran]
    * eBay is currently running Kubernetes on OpenStack
    * Goal for eBay is to manage the OpenStack control plane w/ k8s.  Goal would be to achieve upgrades
    * OpenStack Kolla creates containers for the control plane.  Uses Ansible+Docker for management of the containers.  
    * Working on k8s control plan management - Saltstack is proving to be a management challenge at the scale they want to operate.  Looking for automated management of the k8s control plane.
* SIG Report
* Testing update [Jeff, Joe, and Erick]
    * Working to make the workflow about contributing to K8s easier to understanding
        * [pull/19714][1] has flow chart of the bot flow to help users understand
    * Need a consistent way to run tests w/ hacking config scripts (you have to fake a Jenkins process right now)
    * Want to create necessary infrastructure to make test setup less flaky
    * want to decouple test start (single or full) from Jenkins
    * goal is to get to point where you have 1 script to run that can be pointed to any cluster
    * demo included Google internal views - working to try get that external.
    * want to be able to collect test run results
    * Bob Wise calls for testing infrastructure to be a blocker on v1.3
    * Long discussion about testing practices…
        * consensus that we want to have tests work over multiple platforms.
        * would be helpful to have a comprehensive state dump for test reports
        * "phone-home" to collect stack traces - should be available
* 1.2 Release Watch
* CoC [Sarah]
* GSoC [Sarah]

To get involved in the Kubernetes community consider joining our [Slack channel][2], taking a look at the [Kubernetes project][3] on GitHub, or join the [Kubernetes-dev Google group][4]. If you're really excited, you can do all of the above and join us for the next community conversation — February 11th, 2016. Please add yourself or a topic you want to know about to the [agenda][5] and get a calendar invitation by joining [this group][6].   

 "https://youtu.be/IScpP8Cj0hw?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ"


[1]: https://github.com/kubernetes/kubernetes/pull/19714
[2]: http://slack.k8s.io/
[3]: https://github.com/kubernetes/
[4]: https://groups.google.com/forum/#!forum/kubernetes-dev
[5]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#
[6]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat
