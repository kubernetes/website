---
title: " ElasticBox introduces ElasticKube to help manage Kubernetes within the enterprise "
date: 2016-03-11
slug: elasticbox-introduces-elastickube-to
url: /blog/2016/03/Elasticbox-Introduces-Elastickube-To
author: >
   Brannan Matherson (ElasticBox)
---
Today’s guest post is brought to you by Brannan Matherson, from ElasticBox, who’ll discuss a new open source project to help standardize container deployment and management in enterprise environments. This highlights the advantages of authentication and user management for containerized applications

I’m delighted to share some exciting work that we’re doing at ElasticBox to contribute to the open source community regarding the rapidly changing advancements in container technologies. Our team is kicking off a new initiative called [ElasticKube](http://elastickube.com/) to help solve the problem of challenging container management scenarios within the enterprise. This project is a native container management experience that is specific to Kubernetes and leverages automation to provision clusters for containerized applications based on the latest release of Kubernetes 1.2. &nbsp;

I’ve talked to many enterprise companies, both large and small, and the plethora of cloud offering capabilities is often confusing and makes the evaluation process very difficult, so why Kubernetes? Of the large public cloud players - Amazon Web Services, Microsoft Azure, and Google Cloud Platform - Kubernetes is poised to take an innovative leadership role in framing the container management space. The Kubernetes platform does not restrict or dictate any given technical approach for containers, but encourages the community to collectively solve problems as this container market still takes form. &nbsp;With a proven track record of supporting open source efforts, Kubernetes platform allows my team and me to actively contribute to this fundamental shift in the IT and developer world.

We’ve chosen Kubernetes, not just for the core infrastructure services, but also the agility of Kubernetes to leverage the cluster management layer across any cloud environment - GCP, AWS, Azure, vSphere, and Rackspace. Kubernetes also provides a huge benefit for users to run clusters for containers locally on many popular technologies such as: Docker, Vagrant (and VirtualBox), CoreOS, Mesos and more. &nbsp;This amount of choice enables our team and many others in the community to consider solutions that will be viable for a wide range of enterprise scenarios. In the case of ElasticKube, we’re pleased with Kubernetes 1.2 which includes the full release of the deployment API. This provides the ability for us to perform seamless rolling updates of containerized applications that are running in production. In addition, we’ve been able to support new resource types like ConfigMaps and Horizontal Pod Autoscalers.

Fundamentally, ElasticKube delivers a web console for which compliments Kubernetes for users managing their clusters. The initial experience incorporates team collaboration, lifecycle management and reporting, so organizations can efficiently manage resources in a predictable manner. Users will see an ElasticKube portal that takes advantage of the infrastructure abstraction that enables users to run a container that has already been built. With ElasticKube assuming the cluster has been deployed, the overwhelming value is to provide visibility into who did what and define permissions for access to the cluster with multiple containers running on them. Secondly, by partitioning clusters into namespaces, authorization management is more effective. Finally, by empowering users to build a set of reusable templates in a modern portal, ElasticKube provides a vehicle for delivering a self-service template catalog that can be stored in GitHub (for instance, using Helm templates) and deployed easily.

ElasticKube enables organizations to accelerate adoption by developers, application operations and traditional IT operations teams and shares a mutual goal of increasing developer productivity, driving efficiency in container management and promoting the use of microservices as a modern application delivery methodology. When leveraging ElasticKube in your environment, users need to ensure the following technologies are configured appropriately to guarantee everything runs correctly:

- Configure Google Container Engine (GKE) for cluster installation and management
- Use Kubernetes to provision the infrastructure and clusters for containers &nbsp;
- Use your existing tools of choice to actually build your containers
- Use ElasticKube to run, deploy and manage your containers and services

[![](https://cl.ly/0i3M2L3Q030z/Image%202016-03-11%20at%209.49.12%20AM.png)](http://cl.ly/0i3M2L3Q030z/Image%202016-03-11%20at%209.49.12%20AM.png)



Getting Started with Kubernetes and ElasticKube  




(this is a 3min walk through video with the following topics)

1. Deploy ElasticKube to a Kubernetes cluster
2. Configuration
3. Admin: Setup and invite a user
4. Deploy an instance



Hear What Others are Saying

“Kubernetes has provided us the level of sophistication required for enterprises to manage containers across complex networking environments and the appropriate amount of visibility into the application lifecycle. &nbsp;Additionally, the community commitment and engagement has been exceptional, and we look forward to being a major contributor to this next wave of modern cloud computing and application management.” &nbsp;

_~Alberto Arias Maestro, Co-founder and Chief Technology Officer, ElasticBox_
