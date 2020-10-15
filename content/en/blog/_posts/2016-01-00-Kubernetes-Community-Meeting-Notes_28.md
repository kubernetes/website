---
title: Kubernetes Community Meeting Notes - 20160121
date: 2016-01-28
slug: kubernetes-community-meeting-notes_28
url: /blog/2016/01/Kubernetes-Community-Meeting-Notes_28
---
#### January 21 - Configuration, Federation and Testing, oh my.&nbsp;


Note taker: Rob Hirshfeld
  - Use Case (10 min): [SFDC Paul Brown](https://docs.google.com/a/google.com/presentation/d/1MEI97efplr3f-GDX1GcWGfkEuGKKV-4niu27kHOeMLk/edit?usp=sharing_eid&ts=56a114f8)
  
  - SIG Report - SIG-config and the story of [#18215](https://github.com/kubernetes/kubernetes/pull/18215).
    - Application config IN K8s not deployment of K8s
    - Topic has been reuse of configuration,specifically parameterization(aka templates). Needs:
      - include scoping(cluster namespace)
      - slight customization (naming changes, but not major config)
      - multiple positions on how todo this including allowing external or simple extensions
    - PetSet creates instances w/stable namespace

  - Workflow proposal
    - Distributed Chron. Challenge is that configs need to create multiple objects in sequence
    - Trying to figure out how balance the many config options out there (compose, terraform,ansible/etc)
    - Goal is to “meet people where they are” to keep it simple
    - Q: is there an opinion for the keystore sizing
      - large size / data blob would not be appropriate
      - you can pull data(config) from another store for larger objects

  - SIG Report - SIG-federation - progress on Ubernetes-Lite & Ubernetes design
   - Goal is to be able to have a cluster manager, so you can federate clusters. They will automatically distribute the pods.
   - Plan is to use the same API for the master cluster
   - [Quinton's Kubernetes Talk](https://youtu.be/L2ZK24JojB4)
   - [Design for Kubernetes:](https://github.com/kubernetes/kubernetes/pull/19313)


  - Conformance testing Q+A Isaac Hollander McCreery
    - status on conformance testing for release process
    - expect to be forward compatible but not backwards
    - is there interest for a sig-testing meeting
    - testing needs to a higher priority for the project
    - lots of focus on trying to make this a higher priority
To get involved in the Kubernetes community consider joining our [Slack channel](http://slack.k8s.io/), taking a look at the [Kubernetes project](https://github.com/kubernetes/) on GitHub, or join the [Kubernetes-dev Google group](https://groups.google.com/forum/#!forum/kubernetes-dev). If you’re really excited, you can do all of the above and join us for the next community conversation -- January 27th, 2016. Please add yourself or a topic you want to know about to [the agenda](https://docs.google.com/document/d/1VQDIAB0OqiSjIHI8AWMvSdceWhnz56jNpZrLs6o7NJY/edit) and get a calendar invitation by joining [this group](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat).  


Still want more Kubernetes? Check out the [recording](https://www.youtube.com/watch?v=izQLFx_6kwY&feature=youtu.be&list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ) of this meeting and the growing of the archive of [Kubernetes Community Meetings](https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ).
