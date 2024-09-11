---
layout: blog
title: 'Kubernetes v1.30: Uwubernetes'
date: 2024-04-17
slug: kubernetes-v1-30-release
author: >
  [Kubernetes v1.30 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.30/release-team.md)
---


**Editors:** Amit Dsouza, Frederick Kautz, Kristin Martin, Abigail McCarthy, Natali Vlatko

Announcing the release of Kubernetes v1.30: Uwubernetes, the cutest release!

Similar to previous releases, the release of Kubernetes v1.30 introduces new stable, beta, and alpha
features. The consistent delivery of top-notch releases underscores the strength of our development
cycle and the vibrant support from our community.

This release consists of 45 enhancements. Of those enhancements, 17 have graduated to Stable, 18 are
entering Beta, and 10 have graduated to Alpha.

## Release theme and logo

Kubernetes v1.30: *Uwubernetes*

{{< figure src="/images/blog/2024-04-17-kubernetes-1.30-release/k8s-1.30.png" alt="Kubernetes v1.30 Uwubernetes logo" class="release-logo" >}}

Kubernetes v1.30 makes your clusters cuter!

Kubernetes is built and released by thousands of people from all over the world and all walks of
life. Most contributors are not being paid to do this; we build it for fun, to solve a problem, to
learn something, or for the simple love of the community. Many of us found our homes, our friends,
and our careers here. The Release Team is honored to be a part of the continued growth of
Kubernetes. 

For the people who built it, for the people who release it, and for the furries who keep all of our
clusters online, we present to you Kubernetes v1.30: Uwubernetes, the cutest release to date. The
name is a portmanteau of “kubernetes” and “UwU,” an emoticon used to indicate happiness or cuteness.
We’ve found joy here, but we’ve also brought joy from our outside lives that helps to make this
community as weird and wonderful and welcoming as it is. We’re so happy to share our work with you. 

UwU ♥️

## Improvements that graduated to stable in Kubernetes v1.30 {#graduations-to-stable}

_This is a selection of some of the improvements that are now stable following the v1.30 release._

### Robust VolumeManager reconstruction after kubelet restart ([SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage))

This is a volume manager refactoring that allows the kubelet to populate additional information
about how existing volumes are mounted during the kubelet startup. In general, this makes volume
cleanup after kubelet restart or machine reboot more robust.

This does not bring any changes for user or cluster administrators. We used the feature process and
feature gate `NewVolumeManagerReconstruction` to be able to fall back to the previous behavior in
case something goes wrong. Now that the feature is stable, the feature gate is locked and cannot be
disabled.

### Prevent unauthorized volume mode conversion during volume restore ([SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage))

For Kubernetes v1.30, the control plane always prevents unauthorized changes to volume modes when
restoring a snapshot into a PersistentVolume. As a cluster administrator, you'll need to grant
permissions to the appropriate identity principals (for example: ServiceAccounts representing a
storage integration) if you need to allow that kind of change at restore time.

{{< warning >}}
Action required before upgrading. The `prevent-volume-mode-conversion` feature flag is enabled by
default in the external-provisioner `v4.0.0` and external-snapshotter `v7.0.0`. Volume mode change
will be rejected when creating a PVC from a VolumeSnapshot unless you perform the steps described in
the "Urgent Upgrade Notes" sections for the [external-provisioner
4.0.0](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v4.0.0) and the
[external-snapshotter
v7.0.0](https://github.com/kubernetes-csi/external-snapshotter/releases/tag/v7.0.0). 
{{< /warning >}}

For more information on this feature also read [converting the volume mode of a
Snapshot](/docs/concepts/storage/volume-snapshots/#convert-volume-mode). 


### Pod Scheduling Readiness ([SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling))

_Pod scheduling readiness_ graduates to stable this release, after being promoted to beta in
Kubernetes v1.27.

This now-stable feature lets Kubernetes avoid trying to schedule a Pod that has been defined, when
the cluster doesn't yet have the resources provisioned to allow actually binding that Pod to a node.
That's not the only use case; the custom control on whether a Pod can be allowed to schedule also
lets you implement quota mechanisms, security controls, and more.

Crucially, marking these Pods as exempt from scheduling cuts the work that the scheduler would
otherwise do, churning through Pods that can't or won't schedule onto the nodes your cluster
currently has. If you have [cluster
autoscaling](/docs/concepts/cluster-administration/cluster-autoscaling/) active, using scheduling
gates doesn't just cut the load on the scheduler, it can also save money. Without scheduling gates,
the autoscaler might otherwise launch a node that doesn't need to be started.

In Kubernetes v1.30, by specifying (or removing) a Pod's `.spec.schedulingGates`, you can control
when a Pod is ready to be considered for scheduling. This is a stable feature and is now formally
part of the Kubernetes API definition for Pod.

### Min domains in PodTopologySpread ([SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling))

The `minDomains` parameter for PodTopologySpread constraints graduates to stable this release, which
allows you to define the minimum number of domains. This feature is designed to be used with Cluster
Autoscaler.

If you previously attempted use and there weren't enough domains already present, Pods would be
marked as unschedulable. The Cluster Autoscaler would then provision node(s) in new domain(s), and
you'd eventually get Pods spreading over enough domains.

### Go workspaces for k/k ([SIG Architecture](https://github.com/kubernetes/community/tree/master/sig-architecture))

The Kubernetes repo now uses Go workspaces. This should not impact end users at all, but does have a
impact for developers of downstream projects. Switching to workspaces caused some breaking changes
in the flags to the various [k8s.io/code-generator](https://github.com/kubernetes/code-generator)
tools. Downstream consumers should look at
[`staging/src/k8s.io/code-generator/kube_codegen.sh`](https://github.com/kubernetes/code-generator/blob/master/kube_codegen.sh)
to see the changes.

For full details on the changes and reasons why Go workspaces was introduced, read [Using Go
workspaces in Kubernetes](https://www.kubernetes.dev/blog/2024/03/19/go-workspaces-in-kubernetes/).

## Improvements that graduated to beta in Kubernetes v1.30 {#graduations-to-beta}

_This is a selection of some of the improvements that are now beta following the v1.30 release._

### Node log query ([SIG Windows](https://github.com/kubernetes/community/tree/master/sig-windows))

To help with debugging issues on nodes, Kubernetes v1.27 introduced a feature that allows fetching
logs of services running on the node. To use the feature, ensure that the `NodeLogQuery` feature
gate is enabled for that node, and that the kubelet configuration options `enableSystemLogHandler`
and `enableSystemLogQuery` are both set to true.

Following the v1.30 release, this is now beta (you still need to enable the feature to use it,
though).

On Linux the assumption is that service logs are available via journald. On Windows the assumption
is that service logs are available in the application log provider. Logs are also available by
reading files within `/var/log/` (Linux) or `C:\var\log\` (Windows). For more information, see the
[log query](/docs/concepts/cluster-administration/system-logs/#log-query) documentation.

### CRD validation ratcheting ([SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery))

You need to enable the `CRDValidationRatcheting` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) to use this behavior, which then
applies to all CustomResourceDefinitions in your cluster.

Provided you enabled the feature gate, Kubernetes implements _validation ratcheting_ for
CustomResourceDefinitions. The API server is willing to accept updates to resources that are not valid
after the update, provided that each part of the resource that failed to validate was not changed by
the update operation. In other words, any invalid part of the resource that remains invalid must
have already been wrong. You cannot use this mechanism to update a valid resource so that it becomes
invalid.

This feature allows authors of CRDs to confidently add new validations to the OpenAPIV3 schema under
certain conditions. Users can update to the new schema safely without bumping the version of the
object or breaking workflows.

### Contextual logging ([SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation))

Contextual Logging advances to beta in this release, empowering developers and operators to inject
customizable, correlatable contextual details like service names and transaction IDs into logs
through `WithValues` and `WithName`. This enhancement simplifies the correlation and analysis of log
data across distributed systems, significantly improving the efficiency of troubleshooting efforts.
By offering a clearer insight into the workings of your Kubernetes environments, Contextual Logging
ensures that operational challenges are more manageable, marking a notable step forward in
Kubernetes observability.

### Make Kubernetes aware of the LoadBalancer behaviour ([SIG Network](https://github.com/kubernetes/community/tree/master/sig-network))

The `LoadBalancerIPMode` feature gate is now beta and is now enabled by default. This feature allows
you to set the `.status.loadBalancer.ingress.ipMode` for a Service with `type` set to
`LoadBalancer`. The `.status.loadBalancer.ingress.ipMode` specifies how the load-balancer IP
behaves. It may be specified only when the `.status.loadBalancer.ingress.ip` field is also
specified. See more details about [specifying IPMode of load balancer
status](/docs/concepts/services-networking/service/#load-balancer-ip-mode).

### Structured Authentication Configuration ([SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth))

_Structured Authentication Configuration_ graduates to beta in this release.

Kubernetes has had a long-standing need for a more flexible and extensible
authentication system. The current system, while powerful, has some limitations
that make it difficult to use in certain scenarios. For example, it is not
possible to use multiple authenticators of the same type (e.g., multiple JWT
authenticators) or to change the configuration without restarting the API server. The
Structured Authentication Configuration feature is the first step towards
addressing these limitations and providing a more flexible and extensible way
to configure authentication in Kubernetes. See more details about [structured
authentication configuration](/docs/reference/access-authn-authz/authentication/#using-authentication-configuration).

### Structured Authorization Configuration ([SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth))

_Structured Authorization Configuration_ graduates to beta in this release.

Kubernetes continues to evolve to meet the intricate requirements of system
administrators and developers alike. A critical aspect of Kubernetes that
ensures the security and integrity of the cluster is the API server
authorization. Until recently, the configuration of the authorization chain in
kube-apiserver was somewhat rigid, limited to a set of command-line flags and
allowing only a single webhook in the authorization chain. This approach, while
functional, restricted the flexibility needed by cluster administrators to
define complex, fine-grained authorization policies. The latest Structured
Authorization Configuration feature aims to revolutionize this aspect by introducing 
a more structured and versatile way to configure the authorization chain, focusing 
on enabling multiple webhooks and providing explicit control mechanisms. See more
details about [structured authorization configuration](/docs/reference/access-authn-authz/authorization/#configuring-the-api-server-using-an-authorization-config-file).

## New alpha features

### Speed up recursive SELinux label change ([SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage))

From the v1.27 release, Kubernetes already included an optimization that sets SELinux labels on the
contents of volumes, using only constant time. Kubernetes achieves that speed up using a mount
option. The slower legacy behavior requires the container runtime to recursively walk through the
whole volumes and apply SELinux labelling individually to each file and directory; this is
especially noticable for volumes with large amount of files and directories.

Kubernetes v1.27 graduated this feature as beta, but limited it to ReadWriteOncePod volumes. The
corresponding feature gate is `SELinuxMountReadWriteOncePod`. It's still enabled by default and
remains beta in v1.30.

Kubernetes v1.30 extends support for SELinux mount option to **all** volumes as alpha, with a
separate feature gate: `SELinuxMount`. This feature gate introduces a behavioral change when
multiple Pods with different SELinux labels share the same volume. See
[KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1710-selinux-relabeling#behavioral-changes)
for details.

We strongly encourage users that run Kubernetes with SELinux enabled to test this feature and
provide any feedback on the [KEP issue](https://kep.k8s.io/1710).

| Feature gate | Stage in v1.30 | Behavior change |
|---|---|---| 
| SELinuxMountReadWriteOncePod |  Beta | No |
| SELinuxMount | Alpha | Yes | 

Both feature gates `SELinuxMountReadWriteOncePod` and `SELinuxMount` must be enabled to test this
feature on all volumes.

This feature has no effect on Windows nodes or on Linux nodes without SELinux support.

### Recursive Read-only (RRO) mounts ([SIG Node](https://github.com/kubernetes/community/tree/master/sig-node))

Introducing Recursive Read-Only (RRO) Mounts in alpha this release, you'll find a new layer of
security for your data. This feature lets you set volumes and their submounts as read-only,
preventing accidental modifications. Imagine deploying a critical application where data integrity
is key—RRO Mounts ensure that your data stays untouched, reinforcing your cluster's security with an
extra safeguard. This is especially crucial in tightly controlled environments, where even the
slightest change can have significant implications.

### Job success/completion policy ([SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps))

From Kubernetes v1.30, indexed Jobs support `.spec.successPolicy` to define when a Job can be
declared succeeded based on succeeded Pods. This allows you to define two types of criteria:

- `succeededIndexes` indicates that the Job can be declared succeeded when these indexes succeeded,
  even if other indexes failed.
- `succeededCount` indicates that the Job can be declared succeeded when the number of succeeded
  Indexes reaches this criterion.

After the Job meets the success policy, the Job controller terminates the lingering Pods.

### Traffic distribution for services ([SIG Network](https://github.com/kubernetes/community/tree/master/sig-network))

Kubernetes v1.30 introduces the `spec.trafficDistribution` field within a Kubernetes Service as
alpha. This allows you to express preferences for how traffic should be routed to Service endpoints.
While [traffic policies](/docs/reference/networking/virtual-ips/#traffic-policies) focus on strict
semantic guarantees, traffic distribution allows you to express _preferences_ (such as routing to
topologically closer endpoints). This can help optimize for performance, cost, or reliability. You
can use this field by enabling the `ServiceTrafficDistribution` feature gate for your cluster and
all of its nodes. In Kubernetes v1.30, the following field value is supported: 

`PreferClose`: Indicates a preference for routing traffic to endpoints that are topologically
proximate to the client. The interpretation of "topologically proximate" may vary across
implementations and could encompass endpoints within the same node, rack, zone, or even region.
Setting this value gives implementations permission to make different tradeoffs, for example
optimizing for proximity rather than equal distribution of load. You should not set this value if
such tradeoffs are not acceptable.

If the field is not set, the implementation (like kube-proxy) will apply its default routing
strategy.

See [Traffic Distribution](/docs/reference/networking/virtual-ips/#traffic-distribution) for more 
details. 

### Storage Version Migration ([SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery))
Kubernetes v1.30 introduces a new built-in API for _StorageVersionMigration_.
Kubernetes relies on API data being actively re-written, to support some
maintenance activities related to at rest storage. Two prominent examples are
the versioned schema of stored resources (that is, the preferred storage schema
changing from v1 to v2 for a given resource) and encryption at rest (that is,
rewriting stale data based on a change in how the data should be encrypted).

StorageVersionMigration is alpha API which was available [out of tree](https://github.com/kubernetes-sigs/kube-storage-version-migrator) before.

See [storage version migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration) for more details.

## Graduations, deprecations and removals for Kubernetes v1.30

### Graduated to stable

This lists all the features that graduated to stable (also known as _general availability_). For a
full list of updates including new features and graduations from alpha to beta, see the [release
notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md).

This release includes a total of 17 enhancements promoted to Stable:

- [Container Resource based Pod Autoscaling](https://kep.k8s.io/1610)
- [Remove transient node predicates from KCCM's service controller](https://kep.k8s.io/3458)
- [Go workspaces for k/k](https://kep.k8s.io/4402)
- [Reduction of Secret-based Service Account Tokens](https://kep.k8s.io/2799)
- [CEL for Admission Control](https://kep.k8s.io/3488)
- [CEL-based admission webhook match conditions](https://kep.k8s.io/3716)
- [Pod Scheduling Readiness](https://kep.k8s.io/3521)
- [Min domains in PodTopologySpread](https://kep.k8s.io/3022)
- [Prevent unauthorised volume mode conversion during volume restore](https://kep.k8s.io/3141)
- [API Server Tracing](https://kep.k8s.io/647)
- [Cloud Dual-Stack --node-ip Handling](https://kep.k8s.io/3705)
- [AppArmor support](https://kep.k8s.io/24)
- [Robust VolumeManager reconstruction after kubelet restart](https://kep.k8s.io/3756)
- [kubectl delete: Add interactive(-i) flag](https://kep.k8s.io/3895)
- [Metric cardinality enforcement](https://kep.k8s.io/2305)
- [Field `status.hostIPs` added for Pod](https://kep.k8s.io/2681)
- [Aggregated Discovery](https://kep.k8s.io/3352)

### Deprecations and removals

#### Removed the SecurityContextDeny admission plugin, deprecated since v1.27 
([SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth), [SIG Security](https://github.com/kubernetes/community/tree/master/sig-security), and [SIG Testing](https://github.com/kubernetes/community/tree/master/sig-testing))
With the removal of the SecurityContextDeny admission plugin, the Pod Security Admission plugin,
available since v1.25, is recommended instead.

## Release notes

Check out the full details of the Kubernetes v1.30 release in our [release
notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md).

## Availability

Kubernetes v1.30 is available for download on
[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.30.0). To get started with
Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run
local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily
install v1.30 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/). 

## Release team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each
release team is made up of dedicated community volunteers who work together to build the many pieces
that make up the Kubernetes releases you rely on. This requires the specialized skills of people
from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.30/release-team.md)
for the hours spent hard at work to deliver the Kubernetes v1.30 release to our community. The 
Release Team's membership ranges from first-time shadows to returning team leads with experience 
forged over several release cycles. A very special thanks goes out our release lead, Kat Cosgrove, 
for supporting us through a successful release cycle, advocating for us, making sure that we could
all contribute in the best way possible, and challenging us to improve the release process.

## Project velocity

The CNCF K8s DevStats project aggregates a number of interesting data points related to the velocity
of Kubernetes and various sub-projects. This includes everything from individual contributions to
the number of companies that are contributing and is an illustration of the depth and breadth of
effort that goes into evolving this ecosystem.

In the v1.30 release cycle, which ran for 14 weeks (January 8 to April 17), we saw contributions 
from [863 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.29.0%20-%20now&var-metric=contributions) and [1391 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.29.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes&var-country_name=All&var-companies=All).


## Event update

* KubeCon + CloudNativeCon China 2024 will take place in Hong Kong, from 21 – 23 August 2024! You
  can find more information about the conference and registration on the [event
  site](https://events.linuxfoundation.org/kubecon-cloudnativecon-open-source-summit-ai-dev-china/).
* KubeCon + CloudNativeCon North America 2024 will take place in Salt Lake City, Utah, The United
  States of America, from 12 – 15 November 2024! You can find more information about the conference
  and registration on the [eventsite](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/).

## Upcoming release webinar

Join members of the Kubernetes v1.30 release team on Thursday, May 23rd, 2024, at 9 A.M. PT to learn
about the major features of this release, as well as deprecations and removals to help plan for
upgrades. For more information and registration, visit the [event
page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-130-release/)
on the CNCF Online Programs site.

## Get involved

The simplest way to get involved
with Kubernetes is by joining one of the many [Special Interest
Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your
interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at
our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication),
and through the channels below. Thank you for your continued feedback and support.

- Follow us on 𝕏 [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack
  Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes
  [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release
  Team](https://github.com/kubernetes/sig-release/tree/master/release-team)

*This blog was updated on April 19th, 2024 to highlight two additional changes not originally included in the release blog.*
