---
title: " Dancing at the Lip of a Volcano: The Kubernetes Security Process - Explained "
date: 2017-05-18
slug: kubernetes-security-process-explained
url: /blog/2017/05/Kubernetes-Security-Process-Explained
author: >
  Brandon Philips (CoreOS),
  Jess Frazelle (Google)
---
Software running on servers underpins ever growing amounts of the world's commerce, communications, and physical infrastructure. And nearly all of these systems are connected to the internet; which means vital security updates must be applied rapidly. As software developers and IT professionals, we often find ourselves dancing on the edge of a volcano: we may either fall into magma induced oblivion from a security vulnerability exploited before we can fix it, or we may slide off the side of the mountain because of an inadequate process to address security vulnerabilities.&nbsp;  

The Kubernetes community believes that we can help teams restore their footing on this volcano with a foundation built on Kubernetes. And the bedrock of this foundation requires a process for quickly acknowledging, patching, and releasing security updates to an ever growing community of Kubernetes users.&nbsp;  

With over 1,200 contributors and [over a million lines of code](https://www.openhub.net/p/kubernetes), each release of Kubernetes is a massive undertaking staffed by brave volunteer [release managers](https://github.com/kubernetes/community/wiki). These normal releases are fully transparent and the process happens in public. However, security releases must be handled differently to keep potential attackers in the dark until a fix is made available to users.  

We drew inspiration from other open source projects in order to create the [**Kubernetes security release process**](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/release.md). Unlike a regularly scheduled release, a security release must be delivered on an accelerated schedule, and we created the [Product Security Team](https://git.k8s.io/security/security-release-process.md#product-security-committee-psc)&nbsp;to handle this process.

This team quickly selects a lead to coordinate work and manage communication with the persons that disclosed the vulnerability and the Kubernetes community. The security release process also documents ways to measure vulnerability severity using the [Common Vulnerability Scoring System (CVSS) Version 3.0 Calculator](https://www.first.org/cvss/calculator/3.0). This calculation helps inform decisions on release cadence in the face of holidays or limited developer bandwidth. By making severity criteria transparent we are able to better set expectations and hit critical timelines during an incident where we strive to:  

- Respond to the person or team who reported the vulnerability and staff a development team responsible for a fix within 24 hours
- Disclose a forthcoming fix to users within 7 days of disclosure
- Provide advance notice to vendors within 14 days of disclosure
- Release a fix within 21 days of disclosure

As we [continue to harden Kubernetes](https://lwn.net/Articles/720215/), the security release process will help ensure that Kubernetes remains a secure platform for internet scale computing. If you are interested in learning more about the security release process please watch the presentation from KubeCon Europe 2017 [on YouTube](https://www.youtube.com/watch?v=sNjylW8FV9A)&nbsp;and follow along with the [slides](https://speakerdeck.com/philips/kubecon-eu-2017-dancing-on-the-edge-of-a-volcano). If you are interested in learning more about authentication and authorization in Kubernetes, along with the Kubernetes cluster security model, consider joining [Kubernetes SIG Auth](https://github.com/kubernetes/community/blob/master/sig-auth/README.md). We also hope to see you at security related presentations and panels at the next Kubernetes community event: [CoreOS Fest 2017 in San Francisco on May 31 and June 1](https://coreos.com/fest/).  

As a thank you to the Kubernetes community, a special 25 percent discount to CoreOS Fest is available using k8s25code&nbsp;or via this special [25 percent off link](https://coreosfest17.eventbrite.com/?discount=k8s25code) to register today for CoreOS Fest 2017.&nbsp;  

  
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/)
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
