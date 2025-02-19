---
title: " Introducing the Kubernetes OpenStack Special Interest Group "
date: 2016-04-22
slug: introducing-kubernetes-openstack-sig
url: /blog/2016/04/Introducing-Kubernetes-Openstack-Sig
author: >
  Steve Gordon (Red Hat),
  Ihor Dvoretskyi (Mirantis)
---
_**Editor's note:**  This week we’re featuring [Kubernetes Special Interest Groups](https://github.com/kubernetes/kubernetes/wiki/Special-Interest-Groups-(SIGs)); Today’s post is by the SIG-OpenStack team about their mission to facilitate ideas between the OpenStack and Kubernetes communities.&nbsp;_  



The community around the Kubernetes project includes a number of Special Interest Groups (SIGs) for the purposes of facilitating focused discussions relating to important subtopics between interested contributors. Today we would like to highlight the [Kubernetes OpenStack SIG](https://github.com/kubernetes/kubernetes/wiki/SIG-Openstack) focused on the interaction between [Kubernetes](http://kubernetes.io/) and [OpenStack](http://www.openstack.org/), the Open Source cloud computing platform.  

There are two high level scenarios that are being discussed in the SIG:  


- Using Kubernetes to manage containerized workloads running on top of OpenStack
- Using Kubernetes to manage containerized OpenStack services themselves  

In both cases the intent is to help facilitate the inter-pollination of ideas between the growing Kubernetes and OpenStack communities. The OpenStack community itself includes a number of projects broadly aimed at assisting with both of these use cases including:  


- [Kolla](http://governance.openstack.org/reference/projects/kolla.html) - Provides OpenStack service containers and deployment tooling for operating OpenStack clouds.
- [Kuryr](http://governance.openstack.org/reference/projects/kuryr.html) - Provides bridges between container networking/storage framework models and OpenStack infrastructure services.
- [Magnum](http://governance.openstack.org/reference/projects/magnum.html) - Provides containers as a service for OpenStack.
- [Murano](http://governance.openstack.org/reference/projects/murano.html) - Provides an Application Catalog service for OpenStack including support for Kubernetes itself, and for containerized applications, managed by Kubernetes.  


There are also a number of example templates available to assist with using the OpenStack Orchestration service ([Heat](http://governance.openstack.org/reference/projects/heat.html)) to deploy and configure either Kubernetes itself or offerings built around Kubernetes such as [OpenShift](https://github.com/redhat-openstack/openshift-on-openstack/). While each of these approaches has their own pros and cons the common theme is the ability, or potential ability, to use Kubernetes and where available leverage deeper integration between it and the OpenStack services themselves.&nbsp;



Current SIG participants represent a broad array of organizations including but not limited to: CoreOS, eBay, GoDaddy, Google, IBM, Intel, Mirantis, OpenStack Foundation, Rackspace, Red Hat, Romana, Solinea, VMware.&nbsp;



The SIG is currently working on [collating information](https://docs.google.com/document/d/1wNl_xcITKwzUsFNRu5npUTJuh9pbJAdzzpG6Cd2Fcp0/edit?ts=57033dd6) about these approaches to help Kubernetes users navigate the OpenStack ecosystem along with feedback on which approaches to the requirements presented work best for operators.&nbsp;



**Kubernetes at OpenStack Summit Austin**



The [OpenStack Summit](https://www.openstack.org/summit/austin-2016/) is in Austin from April 25th to 29th and is packed with sessions related to containers and container management using Kubernetes. If you plan on joining us in Austin you can review the [schedule](https://www.openstack.org/summit/austin-2016/summit-schedule/) online where you will find a number of sessions, both in the form of presentations and hands on workshops, relating to [Kubernetes](https://www.openstack.org/summit/austin-2016/summit-schedule/global-search?t=Kubernetes) and [containerization](https://www.openstack.org/summit/austin-2016/summit-schedule/global-search?t=containers) at large. Folks from the Kubernetes OpenStack SIG are particularly keen to get the thoughts of operators in the “[Ops: Containers on OpenStack](https://www.openstack.org/summit/austin-2016/summit-schedule/events/9500)” and “[Ops: OpenStack in Containers](https://www.openstack.org/summit/austin-2016/summit-schedule/events/9501)” working sessions.



Kubernetes community experts will also be on hand in the Container Expert Lounge to answer your burning questions. You can find the lounge on the 4th floor of the Austin Convention Center.



Follow [@kubernetesio](https://twitter.com/kubernetesio) and [#OpenStackSummit](https://twitter.com/search?q=%23openstacksummit) to keep up with the latest updates on Kubernetes at OpenStack Summit throughout the week.  

**Connect With Us**  

If you’re interested in Kubernetes and OpenStack, there are several ways to participate:  


- Email us at the [SIG-OpenStack mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-openstack)
- Chat with us on the [Kubernetes Slack](http://slack.k8s.io/): [#sig-openstack channel](https://kubernetes.slack.com/messages/sig-openstack/)&nbsp;and #openstack-kubernetes on freenode
- Join our meeting occurring every second Tuesday at 2 PM PDT; attend via the zoom videoconference found in our [meeting notes](https://docs.google.com/document/d/1iAQ3LSF_Ky6uZdFtEZPD_8i6HXeFxIeW4XtGcUJtPyU/edit#).
