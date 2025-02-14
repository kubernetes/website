---
title: " Kubernetes 1.4: Making it easy to run on Kubernetes anywhere "
date: 2016-09-26
slug: kubernetes-1.4-making-it-easy-to-run-on-kuberentes-anywhere
url: /blog/2016/09/Kubernetes-1-4-Making-It-Easy-To-Run-On-Kuberentes-Anywhere
author: >
  Aparna Sinha (Google)
---
Today we’re happy to announce the release of Kubernetes 1.4.  
  
Since the release to general availability just over 15 months ago, Kubernetes has continued to grow and achieve broad adoption across the industry. From brand new startups to large-scale businesses, users have described how big a difference Kubernetes has made in building, deploying and managing distributed applications. However, one of our top user requests has been making Kubernetes itself easier to install and use. We’ve taken that feedback to heart, and 1.4 has several major improvements.  
  
These setup and usability enhancements are the result of concerted, coordinated work across the community - more than 20 contributors from SIG-Cluster-Lifecycle came together to greatly simplify the Kubernetes user experience, covering improvements to installation, startup, certificate generation, discovery, networking, and application deployment.  
  
Additional product highlights in this release include simplified cluster deployment on any cloud, easy installation of stateful apps, and greatly expanded Cluster Federation capabilities, enabling a straightforward deployment across multiple clusters, and multiple clouds.  
  
**What’s new:**  
  
**Cluster creation with two commands -** To get started with Kubernetes a user must provision nodes, install Kubernetes and bootstrap the cluster. A common request from users is to have an easy, portable way to do this on any cloud (public, private, or bare metal).  
  

- Kubernetes 1.4 introduces ‘[kubeadm](/docs/getting-started-guides/kubeadm/)’ which reduces bootstrapping to two commands, with no complex scripts involved. Once kubernetes is installed, kubeadm init starts the master while kubeadm join joins the nodes to the cluster.
- Installation is also streamlined by packaging Kubernetes with its dependencies, for most major Linux distributions including Red Hat and Ubuntu Xenial. This means users can now install Kubernetes using familiar tools such as apt-get and yum.
- Add-on deployments, such as for an overlay network, can be reduced to one command by using a [DaemonSet](/docs/admin/daemons/).
- Enabling this simplicity is a new certificates API and its use for kubelet [TLS bootstrap](/docs/admin/master-node-communication/#kubelet-tls-bootstrap), as well as a new discovery API.
  
**Expanded stateful application support -** While cloud-native applications are built to run in containers, many existing applications need additional features to make it easy to adopt containers. Most commonly, these include stateful applications such as batch processing, databases and key-value stores. In Kubernetes 1.4, we have introduced a number of features simplifying the deployment of such applications, including:&nbsp;  
  

- [ScheduledJob](/docs/user-guide/scheduled-jobs/) is introduced as Alpha so users can run batch jobs at regular intervals.
- Init-containers are Beta, addressing the need to run one or more containers before starting the main application, for example to sequence dependencies when starting a database or multi-tier app.
- [Dynamic PVC Provisioning](/docs/user-guide/persistent-volumes/) moved to Beta. This feature now enables cluster administrators to expose multiple storage provisioners and allows users to select them using a new Storage Class API object. &nbsp;
- Curated and pre-tested [Helm charts](https://github.com/kubernetes/charts) for common stateful applications such as MariaDB, MySQL and Jenkins will be available for one-command launches using version 2 of the Helm Package Manager.
  
**Cluster federation API additions -** One of the most requested capabilities from our global customers has been the ability to build applications with clusters that span regions and clouds.&nbsp;  
  

- [Federated Replica Sets](/docs/user-guide/federation/replicasets/) Beta - replicas can now span some or all clusters enabling cross region or cross cloud replication. The total federated replica count and relative cluster weights / replica counts are continually reconciled by a federated replica-set controller to ensure you have the pods you need in each region / cloud.
- Federated Services are now Beta, and [secrets](/docs/user-guide/federation/secrets/), [events](/docs/user-guide/federation/events) and [namespaces](/docs/user-guide/federation/namespaces) have also been added to the federation API.
- [Federated Ingress](/docs/user-guide/federation/federated-ingress/) Alpha - starting with Google Cloud Platform (GCP), users can create a single L7 globally load balanced VIP that spans services deployed across a federation of clusters within GCP. With Federated Ingress in GCP, external clients point to a single IP address and are sent to the closest cluster with usable capacity in any region or zone of the federation in GCP.
  
**Container security support -** Administrators of multi-tenant clusters require the ability to provide varying sets of permissions among tenants, infrastructure components, and end users of the system.  
  

- [Pod Security Policy](/docs/user-guide/pod-security-policy/) is a new object that enables cluster administrators to control the creation and validation of security contexts for pods/containers. Admins can associate service accounts, groups, and users with a set of constraints to define a security context.
- [AppArmor](/docs/admin/apparmor/) support is added, enabling admins to run a more secure deployment, and provide better auditing and monitoring of their systems. Users can configure a container to run in an AppArmor profile by setting a single field.
  
**Infrastructure enhancements -&nbsp;** We continue adding to the scheduler, storage and client capabilities in Kubernetes based on user and ecosystem needs.  
  

- Scheduler - introducing [inter-pod affinity and anti-affinity](/docs/user-guide/node-selection/)&nbsp;Alpha for users who want to customize how Kubernetes co-locates or spreads their pods. Also [priority scheduling capability for cluster add-ons](/docs/admin/rescheduler/#guaranteed-scheduling-of-critical-add-on-pods) such as DNS, Heapster, and the Kube Dashboard.
- Disruption SLOs - Pod Disruption Budget is introduced to limit impact of pods deleted by cluster management operations (such as node upgrade) at any one time.
- Storage - New [volume plugins](/docs/user-guide/volumes/) for Quobyte and Azure Data Disk have been added.
- Clients - Swagger 2.0 support is added, enabling non-Go clients.
  
**Kubernetes Dashboard UI -** lastly, a great looking Kubernetes [Dashboard UI](https://github.com/kubernetes/dashboard#kubernetes-dashboard) with 90% CLI parity for at-a-glance management.  
  
For a complete list of updates see the [release notes](https://github.com/kubernetes/kubernetes/pull/33410) on GitHub. Apart from features the most impressive aspect of Kubernetes development is the community of contributors. This is particularly true of the 1.4 release, the full breadth of which will unfold in upcoming weeks.  
  
**Availability**  
Kubernetes 1.4 is available for download at [get.k8s.io](http://get.k8s.io/) and via the open source repository hosted on [GitHub](http://github.com/kubernetes/kubernetes). To get started with Kubernetes try the [Hello World app](/docs/hellonode/).  
  
To get involved with the project, join the [weekly community meeting](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat) or start contributing to the project here (marked help).&nbsp;  
  
**Users and Case Studies**  
Over the past fifteen months since the Kubernetes 1.0 GA release, the [adoption and enthusiasm](http://kubernetes.io/case-studies/) for this project has surpassed everyone's imagination. Kubernetes runs in production at hundreds of organization and thousands more are in development. Here are a few unique highlights of companies running Kubernetes:&nbsp;  
  

- **[Box](https://www.box.com/) --** accelerated their time to delivery from six months to launch a service to less than a week. [Read more](https://blog.box.com/blog/kubernetes-box-microservices-maximum-velocity/) on how Box runs mission critical production services on Kubernetes.
- **[Pearson](https://www.pearson.com/) --** minimized complexity and increased their engineer productivity. [Read how](http://kubernetes.io/case-studies/pearson) Pearson is using Kubernetes to reinvent the world’s largest educational company.&nbsp;
- **[OpenAI](https://openai.com/) --** a non-profit artificial intelligence research company, built [infrastructure for deep learning](https://openai.com/blog/infrastructure-for-deep-learning/) with Kubernetes to maximize productivity for researchers allowing them to focus on the science.
  
We’re very grateful to our community of over 900 contributors who contributed more than 5,000 commits to make this release possible. To get a closer look on how the community is using Kubernetes, join us at the user conference [KubeCon](http://events.linuxfoundation.org/events/kubecon) to hear directly from users and contributors.  
  
**Connect**  
  

- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
  
Thank you for your support!
