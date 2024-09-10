---
layout: blog
title: "Kubernetes 1.15: Extensibility and Continuous Improvement"
date: 2019-06-19
slug: kubernetes-1-15-release-announcement
evergreen: true
author: >
  [Kubernetes 1.15 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.15/release_team.md)
---

We’re pleased to announce the delivery of Kubernetes 1.15, our second release of 2019! Kubernetes 1.15 consists of 25 enhancements: 2 moving to stable, 13 in beta, and 10 in alpha. The main themes of this release are:

- Continuous Improvement
  - Project sustainability is not just about features. Many SIGs have been working on improving test coverage, ensuring the basics stay reliable, and stability of the core feature set and working on maturing existing features and cleaning up the backlog.
- Extensibility
  - The community has been asking for continuing support of extensibility, so this cycle features more work around CRDs and API Machinery. Most of the enhancements in this cycle were from SIG API Machinery and related areas.

Let’s dive into the key features of this release:

## Extensibility around core Kubernetes APIs

The theme of the new developments around CustomResourceDefinitions is data consistency and native behaviour. A user should not notice whether the interaction is with a CustomResource or with a Golang-native resource. With big steps we are working towards a GA release of CRDs and GA of admission webhooks in one of the next releases.

In this direction, we have rethought our OpenAPI based validation schemas in CRDs and from 1.15 on we check each schema against a restriction called “structural schema”. This basically enforces non-polymorphic and complete typing of each field in a CustomResource. We are going to require structural schemas in the future, especially for all new features including those listed below, and list violations in a `NonStructural` condition. Non-structural schemas keep working for the time being in the v1beta1 API group. But any serious CRD application is urged to migrate to structural schemas in the foreseeable future.

Details about what makes a schema structural will be published in a blog post on kubernetes.io later this week, and it is of course [documented in the Kubernetes documentation](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).

**beta: CustomResourceDefinition Webhook Conversion**

CustomResourceDefinitions support multiple versions as beta since 1.14. With Kubernetes 1.15, they gain the ability to convert between different versions on-the-fly, just like users are used to from native resources for long term. Conversions for CRDs are implemented via webhooks, deployed inside the cluster by the cluster admin. This feature is promoted to beta in Kubernetes 1.15, lifting CRDs to a completely new level for serious CRD applications.

**beta: CustomResourceDefinition OpenAPI Publishing**

OpenAPI specs for native types have been served at `/openapi/v2` by kube-apiserver for a long time, and they are consumed by a number of components, notably kubectl client-side validation, kubectl explain and OpenAPI based client generators.

OpenAPI publishing for CRDs will be available with Kubernetes 1.15 as beta, yet again only for structural schemas.

**beta: CustomResourceDefinitions Pruning**

Pruning is the automatic removal of unknown fields in objects sent to a Kubernetes API. A field is unknown if it is not specified in the OpenAPI validation schema. This is both a data consistency and security relevant feature. It enforces that only data structures specified by the CRD developer are persisted to etcd. This is the behaviour of native resources, and will be available for CRDs as well, starting as beta in Kubernetes 1.15.

Pruning is activated via `spec.preserveUnknownFields: false` in the CustomResourceDefinition. A future apiextensions.k8s.io/v1 variant of CRDs will enforce pruning (with a possible, but explicitly necessary opt-out).

Pruning requires that CRD developer provides complete, structural validation schemas, either top-level or for all versions of the CRD.

**alpha: CustomResourceDefinition Defaulting**

CustomResourceDefinitions get support for defaulting. Defaults are specified using the `default` keyword in the OpenAPI validation schema. Defaults are set for unspecified field in an object sent to the API, and when reading from etcd.

Defaulting will be available as alpha in Kubernetes 1.15 for structural schemas.

**beta: Admission Webhook Reinvocation & Improvements**

Mutating and validating admission webhooks become more and more mainstream for projects extending the Kubernetes API. Until now mutating webhooks were only called once, in alphabetical order. An earlier run webhook cannot react on the output of webhooks called later in the chain. With Kubernetes 1.15 this will change:

Mutating webhooks can opt-in into at least one re-invocation by specifying `reinvocationPolicy: IfNeeded`. If a later mutating webhook modifies the object, the earlier webhook will get a second chance.

This requires that webhooks have an idem-potent-like behaviour which can cope with this second invocation.

It is not planned to add another round of invocations such that webhook authors still have to be careful about the changes to admitted objects they implement. Finally the validating webhooks are called to verify that promised invariants are fulfilled.

There are more smaller changes to admission webhook, notably `objectSelector` to exclude objects with certain labels from admission, arbitrary port (not only 443) for the webhook server.

## Cluster Lifecycle Stability and Usability Improvements

Work on making Kubernetes installation, upgrade and configuration even more robust has been a major focus for this cycle for SIG Cluster Lifecycle (see our last [Community Update](https://docs.google.com/presentation/d/1QUOsQxfEfHlMq4lPjlK2ewQHsr9peEKymDw5_XwZm8Q/edit?usp=sharing)). Bug fixes across bare metal tooling and production-ready user stories, such as the high availability use cases have been given priority for 1.15.

**kubeadm**, the cluster lifecycle building block, continues to receive features and stability work required for bootstrapping production clusters efficiently. kubeadm has promoted high availability (HA) capability to beta, allowing users to use the familiar `kubeadm init` and `kubeadm join` commands to [configure and deploy an HA control plane](/docs/setup/production-environment/tools/kubeadm/high-availability/). An entire new test suite has been created specifically for ensuring these features will stay stable over time.

Certificate management has become more robust in 1.15, with kubeadm now seamlessly rotating all your certificates (on upgrades) before they expire. Check the [kubeadm documentation](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) for information on how to manage your certificates.

The kubeadm configuration file API is moving from v1beta1 to v1beta2 in 1.15.

Finally, let’s celebrate that kubeadm now [has its own logo](https://github.com/kubernetes/kubeadm/issues/1588)!

![kubeadm official logo](/images/blog/2019-06-19-kubernetes-1-15-release-announcement/kubeadm-logo.png)

## Continued improvement of CSI

In Kubernetes v1.15, SIG Storage continued work to [enable migration of in-tree volume plugins](https://github.com/kubernetes/enhancements/issues/625) to Container Storage Interface (CSI). SIG Storage worked on bringing CSI to feature parity with in-tree functionality, including functionality like resizing, inline volumes, and more. SIG Storage introduces new alpha functionality in CSI that doesn't exist in the Kubernetes Storage subsystem yet, like volume cloning.

Volume cloning enables users to specify another PVC as a "DataSource" when provisioning a new volume. If the underlying storage system supports this functionality and implements the "CLONE_VOLUME" capability in its CSI driver, then the new volume becomes a clone of the source volume.

**Additional Notable Feature Updates**

- Support for go modules in Kubernetes Core
- Continued preparation on cloud provider extraction and code organization. The cloud provider code has been moved to [kubernetes/legacy-cloud-providers](https://github.com/kubernetes/legacy-cloud-providers) for easier removal later and external consumption.
- Kubectl [get and describe](https://github.com/kubernetes/enhancements/issues/515) now work with extensions
- Nodes now support [third party monitoring plugins](https://github.com/kubernetes/enhancements/issues/606).
- A new [Scheduling Framework](https://github.com/kubernetes/enhancements/issues/624) for schedule plugins is now Alpha
- ExecutionHook API [designed to trigger hook commands](https://github.com/kubernetes/enhancements/issues/962) in the containers for different use cases is now Alpha.
- Continued deprecation of extensions/v1beta1, apps/v1beta1, and apps/v1beta2 APIs; these extensions will be retired in 1.16!

Check the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.15.md#kubernetes-v115-release-notes) for a complete list of notable features and fixes.

**Availability**

Kubernetes 1.15 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.15.0). To get started with Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/). You can also easily install 1.15 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/).

**Features Blog Series**

If you’re interested in exploring these features more in depth, check back this week and the next for our Days of Kubernetes series where we’ll highlight detailed walkthroughs of the following features:

- Future of CRDs: Structural Schemas
- Introducing Volume Cloning Alpha for Kubernetes
- Automated High Availability in Kubeadm

**Release team**

This release is made possible through the efforts of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md) led by Claire Laurence, Senior Technical Program Manager at Pivotal Software. The 38 individuals on the release team coordinated many aspects of the release, from documentation to testing, validation, and feature completeness.

As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid clip. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has had over [32,000 individual contributors](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1) to date and an active community of more than 66,000 people.

**Project Velocity**

The CNCF has continued refining DevStats, an ambitious project to visualize the myriad contributions that go into the project. [K8s DevStats](https://devstats.k8s.io) illustrates the breakdown of contributions from major company contributors, as well as an impressive set of preconfigured reports on everything from individual contributors to pull request lifecycle times. On average over the past year, [379 different companies and over 2,715 individuals](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=now-1y&to=now) contribute to Kubernetes each month. [Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) to learn more about the overall velocity of the Kubernetes project and community.

**User Highlights**

Established, global organizations are using [Kubernetes in production](https://kubernetes.io/case-studies/) at massive scale. Recently published user stories from the community include:

- **China Unicom** is using Kubernetes to [increase their resource utilization 20-50%](https://kubernetes.io/case-studies/chinaunicom/), lowering IT infrastructure costs, and cutting deployment time from hours to 10-15 minutes.
- **The City of Montreal** is using Kubernetes to [decrease deployments from months to hours](https://kubernetes.io/case-studies/city-of-montreal/) and run 200 application components on 8 machines with 5 people operating Kubernetes clusters.
- **SLAMTEC** is using Kubernetes along with other CNCF projects to achiever [18+ months of 100% uptime](https://kubernetes.io/case-studies/slamtec/) saving 50% time spent on troubleshooting and debugging and 30% time savings on CI/CD efforts.
- **ThredUP** has decreased deployment time by [about 50% on average for key services](https://kubernetes.io/case-studies/thredup/) and has shrunk lead time for deployment to under 20 minutes.

Is Kubernetes helping your team? [Share your story](https://docs.google.com/a/google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) with the community.

**Ecosystem Updates**

- Kubernetes recently celebrated its [five-year anniversary](https://www.cncf.io/blog/2019/06/06/reflections-on-the-fifth-anniversary-of-kubernetes/) at KubeCon + CloudNativeCon Barcelona
- The [Certified Kubernetes Administrator (CKA) exam](https://www.cncf.io/certification/expert/cka/) has become one of the most popular Linux Foundation certifications to date with over 9,000 registrations and over 1,700 individuals that passed and received the certification.
- Coming off the heels of a successful [KubeCon + CloudNativeCon Europe 2019](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019/), the CNCF announced it has over 400 members with a 130 percent year-over-year growth rate.

**KubeCon**

The world’s largest Kubernetes gathering, KubeCon + CloudNativeCon is coming to [Shanghai](https://www.lfasiallc.com/events/kubecon-cloudnativecon-china-2019/) (co-located with Open Source Summit) from June 24-26, 2019 and [San Diego](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2019/) from November 18-21. These conferences will feature technical sessions, case studies, developer deep dives, salons, and more! [Register today](https://www.cncf.io/community/kubecon-cloudnativecon-events/)!

## **Webinar**

Join members of the Kubernetes 1.15 release team on July 23 at 10am PDT to learn about the major features in this release. Register [here](https://zoom.us/webinar/register/8415609575308/WN_AtjsGjz5TRqOsLrEFTWlJQ).

**Get Involved**

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
