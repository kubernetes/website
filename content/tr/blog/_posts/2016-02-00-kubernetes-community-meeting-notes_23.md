---
title: " Kubernetes Community Meeting Notes - 20160218 "
date: 2016-02-23
slug: kubernetes-community-meeting-notes_23
url: /blog/2016/02/kubernetes-community-meeting-notes_23
---
#####  February 18th - kmachine demo, clusterops SIG formed, new k8s.io website preview, 1.2 update and planning 1.3
The Kubernetes contributing community meets most Thursdays at 10:00PT to discuss the project's status via videoconference. Here are the notes from the latest meeting.

* Note taker: Rob Hirschfeld
* Demo (10 min): [kmachine][1] [Sebastien Goasguen]
    * started :01 intro video
    * looking to create mirror of Docker tools for Kubernetes (similar to machine, compose, etc)
    * kmachine (forked from Docker Machine, so has the same endpoints)
* Use Case (10 min): started at :15
* SIG Report starter
    * Cluster Ops launch meeting Friday ([doc][2]). [Rob Hirschfeld]
* Time Zone Discussion [:22]
    * This timezone does not work for Asia.  
    * Considering rotation - once per month
    * Likely 5 or 6 PT
    * Rob suggested moving the regular meeting up a little
* k8s.io website preview [John Mulhausen] [:27]
    * using github for docs.  you can fork and do a pull request against the site
    * will be its own kubernetes organization BUT not in the code repo
    * Google will offer a "doc bounty" where you can get GCP credits for working on docs
    * Uses Jekyll to generate the site (e.g. the ToC)
    * Principle will be to 100% GitHub Pages; no script trickery or plugins, just fork/clone, edit, and push
    * Hope to launch at Kubecon EU
    * Home Page Only Preview: http://kub.unitedcreations.xyz
* 1.2 Release Watch [T.J. Goltermann] [:38]
* 1.3 Planning update [T.J. Goltermann]
* GSoC participation -- deadline 2/19  [Sarah Novotny]
* March 10th meeting? [Sarah Novotny]

To get involved in the Kubernetes community consider joining our [Slack channel][3], taking a look at the [Kubernetes project][4] on GitHub, or join the [Kubernetes-dev Google group][5]. If you're really excited, you can do all of the above and join us for the next community conversation — February 25th, 2016. Please add yourself or a topic you want to know about to the [agenda][6] and get a calendar invitation by joining [this group][7].    

 "https://youtu.be/L5BgX2VJhlY?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ"

_\-- Kubernetes Community_

[1]: https://github.com/skippbox/kmachine
[2]: https://docs.google.com/document/d/1IhN5v6MjcAUrvLd9dAWtKcGWBWSaRU8DNyPiof3gYMY/edit#
[3]: http://slack.k8s.io/
[4]: https://github.com/kubernetes/
[5]: https://groups.google.com/forum/#!forum/kubernetes-dev
[6]: https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit#
[7]: https://groups.google.com/forum/#!forum/kubernetes-community-video-chat
