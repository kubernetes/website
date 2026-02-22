---
layout: blog
title:  'Introducing Kubebuilder: an SDK for building Kubernetes APIs using CRDs'
date:   2018-08-10
author: >
  Phillip Wittrock (Google),
  Sunil Arora (Google)
---

[kubebuilder-repo]: https://github.com/kubernetes-sigs/kubebuilder
[controller-runtime]: https://github.com/kubernetes-sigs/controller-runtime
[SIG-APIMachinery]: https://github.com/kubernetes/community/tree/master/sig-api-machinery
[mailing-list]: https://groups.google.com/forum/#!forum/kubernetes-sig-api-machinery
[slack-channel]: https://slack.k8s.io/#kubebuilder 
[kubebuilder-book]: https://book.kubebuilder.io
[open-an-issue]: https://github.com/kubernetes-sigs/kubebuilder/issues/new


How can we enable applications such as MySQL, Spark and Cassandra to manage themselves just like Kubernetes Deployments and Pods do? How do we configure these applications as their own first class APIs instead of a collection of StatefulSets, Services, and ConfigMaps?

We have been working on a solution and are happy to introduce [*kubebuilder*][kubebuilder-repo], a comprehensive development kit for rapidly building and publishing Kubernetes APIs and Controllers using CRDs. Kubebuilder scaffolds projects and API definitions and is built on top of the [controller-runtime][controller-runtime] libraries.

### Why Kubebuilder and Kubernetes APIs?
Applications and cluster resources typically require some operational work - whether it is replacing failed replicas with new ones, or scaling replica counts while resharding data. Running the MySQL application may require scheduling backups, reconfiguring replicas after scaling, setting up failure detection and remediation, etc.

With the Kubernetes API model, management logic is embedded directly into an application specific Kubernetes API, e.g. a “MySQL” API. Users then declaratively manage the application through YAML configuration using tools such as kubectl, just like they do for Kubernetes objects. This approach is referred to as an Application Controller, also known as an Operator. Controllers are a powerful technique backing the core Kubernetes APIs that may be used to build many kinds of solutions in addition to Applications; such as Autoscalers, Workload APIs, Configuration APIs, CI/CD systems, and more.

However, while it has been possible for trailblazers to build new Controllers on top of the raw API machinery, doing so has been a DIY “from scratch” experience, requiring developers to learn low level details about how Kubernetes libraries are implemented, handwrite boilerplate code, and wrap their own solutions for integration testing, RBAC configuration, documentation, etc. Kubebuilder makes this experience simple and easy by applying the lessons learned from building the core Kubernetes APIs.

### Getting Started Building Application Controllers and Kubernetes APIs

By providing an opinionated and structured solution for creating Controllers and Kubernetes APIs, developers have a working “out of the box” experience that uses the lessons and best practices learned from developing the core Kubernetes APIs. Creating a new "Hello World" Controller with `kubebuilder` is as simple as:

 1. Create a project with `kubebuilder init`
 2. Define a new API with `kubebuilder create api`
 3. Build and run the provided main function with `make install & make run`

This will scaffold the API and Controller for users to modify, as well as scaffold integration tests, RBAC rules, Dockerfiles, Makefiles, etc.
After adding their implementation to the project, users create the artifacts to publish their API through:

 1. Build and push the container image from the provided Dockerfile using `make docker-build` and `make docker-push` commands
 2. Deploy the API using `make deploy` command

Whether you are already a Controller aficionado or just want to learn what the buzz is about, check out the [kubebuilder repo][kubebuilder-repo] or take a look at an example in the [kubebuilder book][kubebuilder-book] to learn about how simple and easy it is to build Controllers.

### Get Involved
Kubebuilder is a project under [SIG API Machinery][SIG-APIMachinery] and is being actively developed by contributors from many companies such as Google, Red Hat, VMware, Huawei and others. Get involved by giving us feedback through these channels:
 
 - Kubebuilder [chat room on Slack][slack-channel]
 - SIG [mailing list][mailing-list]
 - [GitHub issues][open-an-issue]
 - Send a pull request in the [kubebuilder repo][kubebuilder-repo]
