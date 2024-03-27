---
layout: blog
title: 'Kubernetes v1.30: TBA'
date: 2024-04-17
slug: kubernetes-v1-30-release
---

**Authors:** [Kubernetes v1.30 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.30/release_team.md)

**Editors:** Amit Dsouza, Frederick Kautz, Kristin Martin, Abigail McCarthy, Natali Vlatko

Announcing the release of Kubernetes v1.30: Theme TBA, the first release of 2024!

Similar to previous releases, the release of Kubernetes v1.30 introduces new stable, beta, and alpha
features. The consistent delivery of top-notch releases underscores the strength of our development
cycle and the vibrant support from our community.

This release consists of XX enhancements. Of those enhancements, XX have graduated to Stable, XX are
entering Beta, and XX have graduated to Alpha.


## Release theme and logo
<Logo image size is recommended to be no more than 2160px> 
[Kat requested to hold review for this section until after the theme is revealed, and other 
sections are reviewed.]


## Improvements that graduated to stable in Kubernetes v1.30 {#graduations-to-stable}

_This is a selection of some of the improvements that are now stable following the v1.30 release._

### Robust VolumeManager reconstruction after kubelet restart ([SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage))

This is a volume manager refactoring that allows the kubelet to populate additional information about how existing volumes are mounted during the kubelet startup. In general, this makes volume cleanup after kubelet restart or machine reboot more robust.

This does not bring any changes for user or cluster administrators. We used the feature process and feature gate `NewVolumeManagerReconstruction` to be able to fall back to the previous behavior in case something goes wrong. Now that the feature is stable, the feature gate is locked and cannot be disabled.

### Prevent unauthorised volume mode conversion during volume restore ([SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage))

Blurb for 3141 goes here.

### Pod Scheduling Readiness ([SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling))

Blurb for 3521 goes here.

### Min domains in PodTopologySpread ([SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling))

Blurb for 3022 goes here.

### Go workspaces for k/k ([SIG Architecture](https://github.com/kubernetes/community/tree/master/sig-architecture))

Blurb for 4402 goes here.

## Improvements that graduated to beta in Kubernetes v1.30 {#graduations-to-beta}

_This is a selection of some of the improvements that are now beta following the v1.30 release._

### Node log query ([SIG Windows](https://github.com/kubernetes/community/tree/master/sig-windows))

To help with debugging issues on nodes, Kubernetes v1.27 introduced a feature that allows viewing logs of services running on the node. To use the feature, ensure that the NodeLogQuery feature gate is enabled for that node, and that the kubelet configuration options enableSystemLogHandler and enableSystemLogQuery are both set to true. 

On Linux the assumption is that service logs are available via journald. On Windows the assumption is that service logs are available in the application log provider. On both operating systems, logs are also available by reading files within /var/log/.
[To read more about the feature, please click here](https://kubernetes.io/docs/concepts/cluster-administration/system-logs/#log-query)

### CRD Validation Ratcheting ([SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery))

Blurb for 4008 goes here--subject to Docs Freeze

### Contextual logging ([SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation))

Blurb for 3077 goes here.

## New alpha features

### Speed up recursive SELinux label change ([SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage))

Blurb for 1710 goes here.

### Recursive Read-only (RRO) mounts ([SIG Node](https://github.com/kubernetes/community/tree/master/sig-node))

Blurb for 3857 goes here--subject to Docs Freeze

### Job success/completion policy ([SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps))

Blurb for 3998 goes here--subject to Docs Freeze

## Graduations, deprecations and removals for Kubernetes v1.30

### Graduated to stable

This lists all the features that graduated to stable (also known as _general availability_). For a
full list of updates including new features and graduations from alpha to beta, see the [release
notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md).

This release includes a total of XX enhancements promoted to Stable:

(List goes here)

### Deprecations and removals
(We may not include this section, re-check if any deprecations)

### Release Notes

Check out the full details of the Kubernetes 1.30 release in our [release
notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md).

### Availability

Kubernetes 1.30 is available for download on
[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.30.0). To get started with
Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/) or run
local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily
install 1.30 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/). 

### Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each
release team is made up of dedicated community volunteers who work together to build the many pieces
that make up the Kubernetes releases you rely on. This requires the specialized skills of people
from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.30/release_team.md)
for the hours spent hard at work to deliver the Kubernetes v1.30 release to our community. The 
Release Team's membership ranges from first-time shadows to returning team leads with experience 
forged over several release cycles. A very special thanks goes out our release lead, Kat Cosgrove, 
for supporting us through a successful release cycle, advocating for us, making sure that we could
all contribute in the best way possible, and challenging us to improve the release process.

### Project Velocity

The CNCF K8s DevStats project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.30 release cycle, which ran for 14 weeks (January 8 to April 17), we saw contributions from [888 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.29.0%20-%20now&var-metric=contributions) and [1268 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.29.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes&var-country_name=All&var-companies=All).


### Event Update

<THERE WILL BE ALWAYS A KUBECON/CLOUDNATIVECON AROUND, GIVE THE LATEST INFORMATION>

### Upcoming Release Webinar

<RELEASE WEBINARE WILL TAKE PLACE NORMALLY 30 DAYS AFTER RELEASE, ALIGN WITH CNCF TO HIGHLIGHT THE
WEBINAR>

Join members of the Kubernetes v1.30 release team on DATE AND TIME TBA to learn about the major
features of this release, as well as deprecations and removals to help plan for upgrades. For more
information and registration, visit the event page on the CNCF Online Programs site.

### Get Involved
<THIS COMMUNITY LIVES BY ITS GREAT COMMUNITY, GET THEM INVOLVED!> The simplest way to get involved
with Kubernetes is by joining one of the many [Special Interest
Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your
interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at
our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication),
and through the channels below. Thank you for your continued feedback and support.

- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack
  Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes
  [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release
  Team](https://github.com/kubernetes/sig-release/tree/master/release-team)

