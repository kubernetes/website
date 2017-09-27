---
title: Workloads API changes in version 1.8 and 1.9
approvers:
- steveperry-53
- kow3ns
---

## Overview

The Kubernetes core workload API consists of the Deployment, DaemonSet, ReplicaSet, and StatefulSet API objects. In order to provide a stable API for users to orchestrate their workloads, we are prioritizing promoting the core workload API to GA. The batch workload API (Job and CronJob), while also important, is not part of this effort, and it will have a separate path to GA stability.

- In the 1.8 release, we introduce the apps/v1beta2 API group and version. This beta version of the core workload API contains the current version of Deployment, DaemonSet,  ReplicaSet, and  StatefulSet, and it is the version we plan to promote, provided the feedback is positive, to GA in the 1.9 release.

- In the 1.9 release, we plan to introduce the apps/v1 API. We intend to promote the you also mentioned that we might want to not mark everything in types.go with +DEPRECATED should we clean this up prior to approval or apps/v1beta2 group version in its entirety to apps/v1 and to deprecate apps/v1beta2 at that time.

- We realize that even after the release of apps/v1, users will need time to migrate their code from extensions/v1beta1, apps/v1beta1, and apps/v1beta2. It is important to remember that the minimum support durations listed in the deprecations guidelines is a minimum. We will continue to support conversion between groups and versions until users have had sufficient time to migrate.

## Migration

This section contains information to assist users in migrating core Workloads API kinds between group versions.

### General

- If you are using kinds from the extensions/v1beta1 or apps/v1beta1 group versions, you can wait to migrate existing code until after the release of the apps/v1 group version.

- If there are features in the apps/v1beta2 group version that you want to consume, you may migrate to this group version prior to the apps/v1 release.

- You should develop all new code againsts the latest stable release.

- You can run `kubectl convert` to convert manifests between group versions.

### Migrating to apps/v1beta2

This section provides information on migrating to the apps/v1beta2 group version. It covers general changes to the core workloads API kinds. For changes that affect a specific kind (e.g. defaults), you should consult the reference documentation for the kind.

#### Selector Defaulting is Deprecated

In earlier versions of the apps and extensions groups, the spec.selectors of the core workloads API kinds were, when left unspecified, defaulted to a LabelSelector generated from the spec.template.metadata.labels.

User feedback led us to determine that, as it is incompatible with strategic merge patch and kubectl apply, defaulting the value of a field from the value of another field of the same object is an anti-pattern.

#### Immutable Selectors

Selector mutation, while allowing for some use cases like promotable Deployment canaries, the core workloads controller do not, in the general case, handle selector mutation gracefully, and we have always strongly cautioned users against it.

To provide a consistent, usable, and stable API, selectors have been made immutable for all kinds in the apps/v1beta2 group and version.

We believe that there are better ways to support features like promotable canaries and orchestrated Pod relabeling, but, if restricted selector mutation is a necessary feature for our users, we can relax immutability prior to GA without breaking backward compatibility.

The development of features like promotable canaries, orchestrated Pod relabeling,and restricted selector mutability is driven by demand signals from our users. If you are currently modifying the selectors of your core workload API objects, please tell us about your use case in a GitHub issue, or by participating in SIG-apps.

#### Default Rolling Updates

Prior to apps/v1beta2, some kinds defaulted the spec.updateStrategy to a strategy other than RollingUpdate. For example, app/v1beta1 StatefulSet specifies OnDelete by default. In apps/v1beta2 the spec.updateStrategy for all kinds defaults to RollingUpdate.

#### CreatedBy Annotation is Deprecated
"kubernetes.io/created-by" will be deprecated in 1.8. Users should use an object’s ControllerRef from its ownerReferences to determine object ownership.
