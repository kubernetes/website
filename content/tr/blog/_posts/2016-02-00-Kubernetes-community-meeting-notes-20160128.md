---
title: " Kubernetes Community Meeting Notes - 20160128 "
date: 2016-02-02
slug: kubernetes-community-meeting-notes-20160128
url: /blog/2016/02/Kubernetes-community-meeting-notes-20160128
---
##### January 28 - 1.2 release update, Deis demo, flaky test surge and SIGs

The Kubernetes contributing community meets once a week to discuss the project's status via a videoconference. Here are the notes from the latest meeting.  

 Note taker: Erin Boyd
* Discuss process around code freeze/code slush (TJ Goltermann)
  * Code wind down was happening during holiday (for 1.1)
  * Releasing ~ every 3 months
  * Build stability is still missing
  * Issue on Transparency (Bob Wise)
    * Email from Sarah for call to contribute (Monday, January 25)
      * Concern over publishing dates / understanding release schedule /etc…
  * Release targeted for early March
    * Where does one find information on the release schedule with the committed features?
      * For 1.2 - Send email / Slack to TJ
      * For 1.3 - Working on better process to communicate to the community
        * Twitter
        * Wiki
        * GitHub Milestones
  * How to better communicate issues discovered in the SIG
    * AI: People need to email the kubernetes-dev@ mailing list with summary of findings
    * AI: Each SIG needs a note taker
* Release planning vs Release testing
  * Testing SIG lead Ike McCreery
    * Also part of the testing infrastructure team at Google
    * Community being able to integrate into the testing framework
      * Federated testing
  * Release Manager = David McMahon
    * Request to &nbsp;introduce him to the community meeting
* Demo: Jason Hansen Deis
  * Implemented simple REST API to interact with the platform
  * Deis managed application (deployed via)
    * Source -\> image
    * Rolling upgrades -\> Rollbacks
    * AI: Jason will provide the slides & notes
      * Slides: [https://speakerdeck.com/slack/kubernetes-community-meeting-demo-january-28th-2016](https://speakerdeck.com/slack/kubernetes-community-meeting-demo-january-28th-2016)
      * Alpha information: [https://groups.google.com/forum/#!topic/deis-users/Qhia4DD2pv4](https://groups.google.com/forum/#!topic/deis-users/Qhia4DD2pv4)
    * Adding an administrative component (dashboard)
    * Helm wraps kubectl
* Testing
  * Called for community interaction
  * Need to understand friction points from community
    * Better documentation
    * Better communication on how things “should work"
  * Internally, Google is having daily calls to resolve test flakes
  * Started up SIG testing meetings (Tuesday at 10:30 am PT)
  * Everyone wants it, but no one want to pony up the time to make it happen
    * Google is dedicating headcount to it (3-4 people, possibly more)
  * [https://groups.google.com/forum/?hl=en#!forum/kubernetes-sig-testing](https://groups.google.com/forum/?hl=en#%21forum/kubernetes-sig-testing)
* Best practices for labeling
    * Are there tools built on top of these to leverage
    * AI: Generate artifact for labels and what they do (Create doc)
      * Help Wanted Label - good for new community members
      * Classify labels for team and area
        * User experience, test infrastructure, etc..
* SIG Config (not about deployment)
  * Any interest in ansible, etc.. type
* SIG Scale meeting (Bob Wise & Tim StClair)
  * Tests related to performance SLA get relaxed in order to get the tests to pass
    * exposed process issues
    * AI: outline of a proposal for a notice policy if things are being changed that are critical to the system (Bob Wise/Samsung)
      * Create a Best Practices of set of constants into well documented place

To get involved in the Kubernetes community consider joining our [Slack channel](http://slack.k8s.io/), taking a look at the [Kubernetes project](https://github.com/kubernetes/) on GitHub, or join the [Kubernetes-dev Google group](https://groups.google.com/forum/#!forum/kubernetes-dev). If you’re really excited, you can do all of the above and join us for the next community conversation — February 4th, 2016. Please add yourself or a topic you want to know about to the [agenda](https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit) and get a calendar invitation by joining [this group](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat).  

The full recording is available on YouTube in the growing archive of [Kubernetes Community Meetings](https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ).
