---
title: Workloads API changes in versions 1.8 and 1.9
approvers:
- steveperry-53
- kow3ns
---

## Overview

The Kubernetes core Workloads API includes the Deployment, DaemonSet, ReplicaSet, and StatefulSet kinds. To provide a stable API for users to orchestrate their workloads, we are prioritizing promoting these kinds to GA. The batch Workloads API (Job and CronJob), while also important, is not part of this effort, and it will have a separate path to GA stability.

- In the 1.8 release, we introduce the apps/v1beta2 API group and version. This beta version of the core Workloads API contains the Deployment, DaemonSet,  ReplicaSet, and  StatefulSet kinds, and it is the version we plan to promote to GA in the 1.9 release provided the feedback is positive.

- In the 1.9 release, we plan to introduce the apps/v1 group version. We intend to promote the apps/v1beta2 group version in its entirety to apps/v1 and to deprecate apps/v1beta2 at that time.

- We realize that even after the release of apps/v1, users will need time to migrate their code from extensions/v1beta1, apps/v1beta1, and apps/v1beta2. It is important to remember that the minimum support durations listed in the deprecations guidelines are minimums. We will continue to support conversion between groups and versions until users have had sufficient time to migrate.

## Migration

This section contains information to assist users in migrating core Workloads API kinds between group versions.

### General

- If you are using kinds from the extensions/v1beta1 or apps/v1beta1 group versions, you can wait to migrate existing code until after the release of the apps/v1 group version.

- If your deployment requires features that are available in the apps/v1beta2 group version, you can migrate to this group version before the apps/v1 release.

- You should develop all new code against the latest stable release.

- You can run `kubectl convert` to convert manifests between group versions.

### Migrating to apps/v1beta2

This section provides information on migrating to the apps/v1beta2 group version. It covers general changes to the core Workloads API kinds. For changes that affect a specific kind (for example, default values), consult the reference documentation for the kind.

#### Default selectors are deprecated

In earlier versions of the apps and extensions groups, the spec.selectors of the core Workloads API kinds were, when left unspecified, defaulted to a LabelSelector generated from the spec.template.metadata.labels.

User feedback led us to determine that, as it is incompatible with strategic merge patch and kubectl apply, defaulting the value of a field from the value of another field of the same object is an anti-pattern.

#### Immutable selectors

We have always cautioned users against selector mutation. The core Workloads API controller does not, in the general case, handle selector mutation gracefully.

To provide a consistent, usable, and stable API, selectors are immutable for all kinds in the apps/v1beta2 group and version.

We believe that there are better ways to support features like promotable canaries and orchestrated Pod relabeling, but if restricted selector mutation is a necessary feature for our users, we can relax immutability before GA without breaking backward compatibility.

The development of features like promotable canaries, orchestrated Pod relabeling, and restricted selector mutability is driven by demand signals from our users. If you are currently modifying the selectors of your core Workloads API objects, please tell us about your use case in a GitHub issue or by participating in SIG-apps.

#### Default rolling updates

Before apps/v1beta2, some kinds defaulted the spec.updateStrategy to a strategy other than RollingUpdate. For example, apps/v1beta1 StatefulSet specifies OnDelete by default. In apps/v1beta2 the spec.updateStrategy for all kinds defaults to RollingUpdate.

#### Created-by annotation is deprecated

"kubernetes.io/created-by" is deprecated in version 1.8. Instead, you should specify an object’s ControllerRef from its ownerReferences to determine object ownership.

## Timeline

This section details the timeline for promotion and deprecation of kinds in the core Workloads API.

### Release 1.8

In Kubernetes 1.8, we unify the core Workloads API kinds in a single group and version. We address consistency, usability, and stability issues across the API surface. We have deprecated portions of the apps/v1beta1 group version and the extension/v1beta1 group version and replaced them with the apps/v1beta2 group version. The table below shows the kinds that are deprecated and the kinds that replace them.

<table style="width:100%">
  <tr>
    <th colspan="3">Deprecated</th>
    <th colspan="3">Replaced By</th>
  </tr>
  <tr>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta1</td>
    <td>Deployment</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta1</td>
    <td>ReplicaSet</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>ReplicaSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta1</td>
    <td>StatefulSet</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>StatefulSet</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>Deployment</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>DaemonSet</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>DaemonSet</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>StatefulSet</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>StatefulSet</td>
  </tr>
</table>

### Release 1.9

In Kubernetes 1.9, our goal is to address any feedback on the apps/v1beta2 group version and to promote the group version to GA. The table below shows the kinds that we plan to deprecate and the kinds that will replace them.

<table style="width:100%">
  <tr>
    <th colspan="3">Deprecated</th>
    <th colspan="3">Replaced By</th>
  </tr>
  <tr>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>Deployment</td>
    <td>apps</td>
    <td>v1</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>DaemonSet</td>
    <td>apps</td>
    <td>v1</td>
    <td>DaemonSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>ReplicaSet</td>
    <td>apps</td>
    <td>v1</td>
    <td>ReplicaSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>StatefulSet</td>
    <td>apps</td>
    <td>v1</td>
    <td>StatefulSet</td>
  </tr>
</table>

### Post 1.9

Because users will continue to depend on extensions/v1beta1, apps/v1beta1, and apps/v1beta2, we will not completely remove deprecated kinds in these group versions upon GA promotion. Instead, we will provide auto-conversion between the deprecated portions of the API surface and the GA version. The table below shows the bidirectional conversion that we will support.

<table style="width:100%">
 <tr>
    <th colspan="3">GA</th>
    <th colspan="3">Previous</th>
  </tr>
  <tr>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
    <td>Group</td>
    <td>Version</td>
    <td>Kind</td>
  </tr>
  <tr>
    <td rowspan="3">apps</td>
    <td rowspan="3">v1</td>
    <td rowspan="3">Deployment</td>
    <td>apps</td>
    <td>v1beta1</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>Deployment</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>Deployment</td>
  </tr>
   <tr>
    <td rowspan="2">apps</td>
    <td rowspan="2">v1</td>
    <td rowspan="2">Daemonset</td>
    <td>apps</td>
    <td>v1beta2</td>
    <td>DaemonSet</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>DaemonSet</td>
  </tr>
   <tr>
    <td rowspan="3">apps</td>
    <td rowspan="3">v1</td>
    <td rowspan="3">ReplicaSet</td>
    <td>apps</td>
    <td>v1beta1</td>
    <td>ReplicaSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>ReplicaSet</td>
  </tr>
  <tr>
    <td>extensions</td>
    <td>v1beta1</td>
    <td>ReplicaSet</td>
  </tr>
   <tr>
    <td rowspan="2">apps</td>
    <td rowspan="2">v1</td>
    <td rowspan="2">StatefulSet</td>
    <td>apps</td>
    <td>v1beta1</td>
    <td>StatefulSet</td>
  </tr>
  <tr>
    <td>apps</td>
    <td>v1beta2</td>
    <td>StatefulSet</td>
  </tr>
</table>
