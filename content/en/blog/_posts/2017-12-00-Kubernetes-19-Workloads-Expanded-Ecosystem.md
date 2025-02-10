---
title: "Kubernetes 1.9: Apps Workloads GA and Expanded Ecosystem"
date: 2017-12-15
slug: kubernetes-19-workloads-expanded-ecosystem
url: /blog/2017/12/Kubernetes-19-Workloads-Expanded-Ecosystem
evergreen: true
author: >
  [Kubernetes v1.9 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.9/release_team.md)
---

We’re pleased to announce the delivery of Kubernetes 1.9, our fourth and final release this year.  

Today’s release continues the evolution of an increasingly rich feature set, more robust stability, and even greater community contributions. As the fourth release of the year, it gives us an opportunity to look back at the progress made in key areas. Particularly notable is the advancement of the Apps Workloads API to stable. This removes any reservations potential adopters might have had about the functional stability required to run mission-critical workloads. Another big milestone is the beta release of Windows support, which opens the door for many Windows-specific applications and workloads to run in Kubernetes, significantly expanding the implementation scenarios and enterprise readiness of Kubernetes.  



## Workloads API GA
We’re excited to announce General Availability (GA) of the [apps/v1 Workloads API](/docs/reference/workloads-18-19/), which is now enabled by default. The Apps Workloads API groups the DaemonSet, Deployment, ReplicaSet, and StatefulSet APIs together to form the foundation for long-running stateless and stateful workloads in Kubernetes. Note that the Batch Workloads API (Job and CronJob) is not part of this effort and will have a separate path to GA stability.  

Deployment and ReplicaSet, two of the most commonly used objects in Kubernetes, are now stabilized after more than a year of real-world use and feedback. [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) has applied the lessons from this process to all four resource kinds over the last several release cycles, enabling DaemonSet and StatefulSet to join this graduation. The v1 (GA) designation indicates production hardening and readiness, and comes with the guarantee of long-term backwards compatibility.  


## Windows Support (beta)
Kubernetes was originally developed for Linux systems, but as our users are realizing the benefits of container orchestration at scale, we are seeing demand for Kubernetes to run Windows workloads. Work to support Windows Server in Kubernetes began in earnest about 12 months ago. [SIG-Windows](https://github.com/kubernetes/community/tree/master/sig-windows)has now promoted this feature to beta status, which means that we can evaluate it for [usage](/docs/getting-started-guides/windows/).



## Storage Enhancements
From the first release, Kubernetes has supported multiple options for persistent data storage, including commonly-used NFS or iSCSI, along with native support for storage solutions from the major public and private cloud providers. As the project and ecosystem grow, more and more storage options have become available for Kubernetes. Adding volume plugins for new storage systems, however, has been a challenge.  

Container Storage Interface (CSI) is a cross-industry standards initiative that aims to lower the barrier for cloud native storage development and ensure compatibility. [SIG-Storage](https://github.com/kubernetes/community/tree/master/sig-storage) and the [CSI Community](https://github.com/container-storage-interface/community) are collaborating to deliver a single interface for provisioning, attaching, and mounting storage compatible with Kubernetes.  

Kubernetes 1.9 introduces an [alpha implementation](https://github.com/kubernetes/features/issues/178) of the Container Storage Interface (CSI), which will make installing new volume plugins as easy as deploying a pod, and enable third-party storage providers to develop their solutions without the need to add to the core Kubernetes codebase.  

Because the feature is alpha in 1.9, it must be explicitly enabled and is not recommended for production usage, but it indicates the roadmap working toward a more extensible and standards-based Kubernetes storage ecosystem.



## Additional Features
Custom Resource Definition (CRD) Validation, now graduating to beta and enabled by default, helps CRD authors give clear and immediate feedback for invalid objects  

SIG Node hardware accelerator moves to alpha, enabling GPUs and consequently machine learning and other high performance workloads  

CoreDNS alpha makes it possible to install CoreDNS with standard tools  

IPVS mode for kube-proxy goes beta, providing better scalability and performance for large clusters  

Each Special Interest Group (SIG) in the community continues to deliver the most requested user features for their area. For a complete list, please visit the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#v190).



## Availability
Kubernetes 1.9 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.9.0). To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/kubernetes-basics/).&nbsp;



## Release team
This release is made possible through the effort of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://github.com/kubernetes/features/blob/master/release-1.9/release_team.md) led by Anthony Yeh, Software Engineer at Google. The 14 individuals on the release team coordinate many aspects of the release, from documentation to testing, validation, and feature completeness.  

As the Kubernetes community has grown, our release process has become an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid clip. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem.&nbsp;



## Project Velocity
The CNCF has embarked on an ambitious project to visualize the myriad contributions that go into the project. [K8s DevStats](https://devstats.k8s.io/) illustrates the breakdown of contributions from major company contributors. Open issues remained relatively stable over the course of the release, while forks rose approximately 20%, as did individuals starring the various project repositories. Approver volume has risen slightly since the last release, but a lull is commonplace during the last quarter of the year. With 75,000+ comments, Kubernetes remains one of the most actively discussed projects on GitHub.



## User highlights
According to the l[atest survey conducted by CNCF](https://www.cncf.io/blog/2017/12/06/cloud-native-technologies-scaling-production-applications), 61 percent of organizations are evaluating and 83 percent are using Kubernetes in production. Example of user stories from the community include:  

BlaBlaCar, the world’s largest long distance carpooling community connects 40 million members across 22 countries. The company has about 3,000 pods, with [1,200 of them running on Kubernetes](https://kubernetes.io/case-studies/blablacar/), leading to improved website availability for customers.  

Pokémon GO, the popular free-to-play, location-based augmented reality game developed by Niantic for iOS and Android devices, has its application logic running on Google Container Engine powered by Kubernetes. This was the [largest Kubernetes deployment](https://cloudplatform.googleblog.com/2016/09/bringing-Pokemon-GO-to-life-on-Google-Cloud.html) ever on Google Container Engine.  

Is Kubernetes helping your team? [Share your story](https://docs.google.com/a/google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) with the community.&nbsp;



## Ecosystem updates
Announced on November 13, the [Certified Kubernetes Conformance Program](https://www.cncf.io/announcement/2017/11/13/cloud-native-computing-foundation-launches-certified-kubernetes-program-32-conformant-distributions-platforms/) ensures that Certified Kubernetes™ products deliver consistency and portability. Thirty-two Certified Kubernetes Distributions and Platforms are [now available](https://kubernetes.io/partners/#dist). Development of the certification program involved close collaboration between CNCF and the rest of the Kubernetes community, especially the Testing and Architecture Special Interest Groups (SIGs). The Kubernetes Architecture SIG is the final arbiter of the definition of API conformance for the program. The program also includes strong guarantees that commercial providers of Kubernetes will continue to release new versions to ensure that customers can take advantage of the rapid pace of ongoing development.  

CNCF also offers [online training](https://www.cncf.io/certification/training/) that teaches the skills needed to create and configure a real-world Kubernetes cluster.



## KubeCon
For recorded sessions from the largest Kubernetes gathering, [KubeCon + CloudNativeCon](http://events.linuxfoundation.org/events/cloudnativecon-and-kubecon-north-america) in Austin from December 6-8, 2017, visit [YouTube/CNCF](https://www.youtube.com/channel/UCvqbFHwN-nwalWPjPUKpvTA). The premiere Kubernetes event will be back May 2-4, 2018 in Copenhagen and will feature technical sessions, case studies, developer deep dives, salons and more! [CFP](http://events.linuxfoundation.org/events/kubecon-and-cloudnativecon-europe/program/cfpguide) closes January 12, 2018.&nbsp;



## Webinar

Join members of the Kubernetes 1.9 release team on **January 9th from 10am-11am PT** to learn about the major features in this release as they demo some of the highlights in the areas of Windows and Docker support, storage, admission control, and the workloads API.&nbsp;[~Register here~](https://zoom.us/webinar/register/WN_oVjQMwyzQFOmWsfVzDsa2A).  


## Get involved:
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting), and through the channels below.  

Thank you for your continued feedback and support.  

- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Chat with the community on [Slack](http://slack.k8s.io/)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform).
