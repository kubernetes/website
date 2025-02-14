---
title: " Adding Support for Kubernetes in Rancher "
date: 2016-04-08
slug: adding-support-for-kubernetes-in-rancher
url: /blog/2016/04/Adding-Support-For-Kubernetes-In-Rancher
author: >
  Darren Shepherd (Rancher Labs) 
---

Over the last year, we’ve seen a tremendous increase in the number of companies looking to leverage containers in their software development and IT organizations. To achieve this, organizations have been looking at how to build a centralized container management capability that will make it simple for users to get access to containers, while centralizing visibility and control with the IT organization. In 2014 we started the open-source Rancher project to address this by building a management platform for containers.  

Recently we shipped Rancher v1.0. With this latest release, [Rancher](http://www.rancher.com/), an open-source software platform for managing containers, now supports Kubernetes as a container orchestration framework when creating environments. Now, launching a Kubernetes environment with Rancher is fully automated, delivering a functioning cluster in just 5-10 minutes.&nbsp;  

We created Rancher to provide organizations with a complete management platform for containers. As part of that, we’ve always supported deploying Docker environments natively using the Docker API and Docker Compose. Since its inception, we’ve been impressed with the operational maturity of Kubernetes, and with this release, we’re making it possible to deploy a variety of container orchestration and scheduling frameworks within the same management platform.  

Adding Kubernetes gives users access to one of the fastest growing platforms for deploying and managing containers in production. We’ll provide first-class Kubernetes support in Rancher going forward and continue to support native Docker deployments.&nbsp;  

**Bringing Kubernetes to Rancher**  


 ![Kubernetes deployment-3.PNG](https://lh6.googleusercontent.com/bhmC1-XO5T-itFN3ZsCQmrxUSSEcnezaL-qch6ILWvJRnbhEBZZlAMEj-RcNgkM9XVEUzsRMsvDGc7u8f-M19Jdk_J0GCoO-gZTCZDtgkokgqNkCgP98o8W29xD0kmKiMPeLN-Tt)

Our platform was already extensible for a variety of different packaging formats, so we were optimistic about embracing Kubernetes. We were right, working with the Kubernetes project has been a fantastic experience as developers. The design of the project made this incredibly easy, and we were able to utilize plugins and extensions to build a distribution of Kubernetes that leveraged our infrastructure and application services. For instance, we were able to plug in Rancher’s software defined networking, storage management, load balancing, DNS and infrastructure management functions directly into Kubernetes, without even changing the code base.



Even better, we have been able to add a number of services around the core Kubernetes functionality. For instance, we implemented our popular [application catalog on top of Kubernetes](https://github.com/rancher/community-catalog/tree/master/kubernetes-templates). Historically we’ve used Docker Compose to define application templates, but with this release, we now support Kubernetes services, replication controllers and pods to deploy applications. With the catalog, users connect to a git repo and automate deployment and upgrade of an application deployed as Kubernetes services. Users then configure and deploy a complex multi-node enterprise application with one click of a button. Upgrades are fully automated as well, and pushed out centrally to users.



**Giving Back**



Like Kubernetes, Rancher is an open-source software project, free to use by anyone, and given to the community without any restrictions. You can find all of the source code, upcoming releases and issues for Rancher on [GitHub](http://www.github.com/rancher/rancher). We’re thrilled to be joining the Kubernetes community, and look forward to working with all of the other contributors. View a demo of the new Kubernetes support in Rancher [here](http://rancher.com/kubernetes/).
