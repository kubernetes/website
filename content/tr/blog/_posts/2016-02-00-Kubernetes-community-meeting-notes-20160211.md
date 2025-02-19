---
title: " Kubernetes Community Meeting Notes - 20160211 "
date: 2016-02-16
slug: kubernetes-community-meeting-notes-20160211
url: /blog/2016/02/Kubernetes-community-meeting-notes-20160211
---

#####  February 11th - Pangaea Demo, #AWS SIG formed, release automation and documentation team introductions. 1.2 update and planning 1.3.


The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via videoconference. Here are the notes from the latest meeting.

Note taker: Rob Hirschfeld
* Demo: [Pangaea][1] [Shahidh K Muhammed, Tanmai Gopal, and Akshaya Acharya]

    * Microservices packages
    * Focused on Application developers
    * Demo at recording +4 minutes
    * Single node kubernetes cluster — runs locally using Vagrant CoreOS image
    * Single user/system cluster allows use of DNS integration (unlike Compose)
    * Can run locally or in cloud
  * *SIG Report:*
    * Release Automation and an introduction to David McMahon
    * Docs and k8s website redesign proposal and an introduction to John Mulhausen
    * This will allow the system to build docs correctly from GitHub w/ minimal effort
    * Will be check-in triggered
    * Getting website style updates
    * Want to keep authoring really light
    * There will be some automated checks
    * Next week: preview of the new website during the community meeting
* [@goltermann] 1.2 Release Watch (time +34 minutes)
    * code slush     * no major features or refactors accepted
    * discussion about release criteria: we will hold release date for bugs
* Testing flake surge is over (one time event and then maintain test stability)
* 1.3 Planning (time +40 minutes)
    * working to cleanup the GitHub milestones — they should be a source of truth.  you can use GitHub for bug reporting
    * push off discussion while 1.2 crunch is under
    * Framework
        * dates
        * prioritization
        * feedback
    * Design Review meetings
    * General discussion about the PRD process — still at the beginning states
    * Working on a contributor conference
    * Rob suggested tracking relationships between PRD/Mgmr authors
    * PLEASE DO REVIEWS — talked about the way people are authorized to +2 reviews.


To get involved in the Kubernetes community consider joining our [Slack channel,][2] taking a look at the [Kubernetes][3] project on GitHub, or join the [Kubernetes-dev Google group][4]. If you're really excited, you can do all of the above and join us for the next community conversation — February 18th, 2016. Please add yourself or a topic you want to know about to the [agenda][5] and get a calendar invitation by joining [this group][6].

The full recording is available on YouTube in the growing archive of [Kubernetes Community Meetings][7].

[1]: http://hasura.io/blog/pangaea-point-and-shoot-kubernetes/
[2]: http://slack.k8s.io/
[3]: https://github.com/kubernetes/
[4]: https://groups.google.com/forum/#!forum/kubernetes-dev
[5]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit
[6]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat
[7]: https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ
