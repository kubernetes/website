---
layout: blog
title: PersistentVolume Last Phase Transition Time in Kubernetes
date: 2023-10-23
slug: persistent-volume-last-phase-transition-time
author: >
  Roman Bednář (Red Hat)
---

In the recent Kubernetes v1.28 release, we (SIG Storage) introduced a new alpha feature that aims to improve PersistentVolume (PV)
storage management and help cluster administrators gain better insights into the lifecycle of PVs.
With the addition of the `lastPhaseTransitionTime` field into the status of a PV,
cluster administrators are now able to track the last time a PV transitioned to a different
[phase](/docs/concepts/storage/persistent-volumes/#phase), allowing for more efficient
and informed resource management.

## Why do we need new PV field? {#why-new-field}

PersistentVolumes in Kubernetes play a crucial role in providing storage resources to workloads running in the cluster.
However, managing these PVs effectively can be challenging, especially when it comes
to determining the last time a PV transitioned between different phases, such as
`Pending`, `Bound` or `Released`.
Administrators often need to know when a PV was last used or transitioned to certain
phases; for instance, to implement retention policies, perform cleanup, or monitor storage health.

In the past, Kubernetes users have faced data loss issues when using the `Delete` retain policy and had to resort to the safer `Retain` policy.
When we planned the work to introduce the new `lastPhaseTransitionTime` field, we
wanted to provide a more generic solution that can be used for various use cases,
including manual cleanup based on the time a volume was last used or producing alerts based on phase transition times.

## How lastPhaseTransitionTime helps

Provided you've enabled the feature gate (see [How to use it](#how-to-use-it), the new `.status.lastPhaseTransitionTime` field of a PersistentVolume (PV)
is updated every time that PV transitions from one phase to another.
Whether it's transitioning from `Pending` to `Bound`, `Bound` to `Released`, or any other phase transition, the `lastPhaseTransitionTime` will be recorded.
For newly created PVs the phase will be set to `Pending` and the `lastPhaseTransitionTime` will be recorded as well.

This feature allows cluster administrators to:

1. Implement Retention Policies

   With the `lastPhaseTransitionTime`, administrators can now track when a PV was last used or transitioned to the `Released` phase.
   This information can be crucial for implementing retention policies to clean up resources that have been in the `Released` phase for a specific duration.
   For example, it is now trivial to write a script or a policy that deletes all PVs that have been in the `Released` phase for a week.

2. Monitor Storage Health

   By analyzing the phase transition times of PVs, administrators can monitor storage health more effectively.
   For example, they can identify PVs that have been in the `Pending` phase for an unusually long time, which may indicate underlying issues with the storage provisioner.

## How to use it

The `lastPhaseTransitionTime` field is alpha starting from Kubernetes v1.28, so it requires
the `PersistentVolumeLastPhaseTransitionTime` feature gate to be enabled.

If you want to test the feature whilst it's alpha, you need to enable this feature gate on the `kube-controller-manager` and the `kube-apiserver`.

Use the `--feature-gates` command line argument:

```shell
--feature-gates="...,PersistentVolumeLastPhaseTransitionTime=true"
```

Keep in mind that the feature enablement does not have immediate effect; the new field will be populated whenever a PV is updated and transitions between phases.
Administrators can then access the new field through the PV status, which can be retrieved using standard Kubernetes API calls or through Kubernetes client libraries.

Here is an example of how to retrieve the `lastPhaseTransitionTime` for a specific PV using the `kubectl` command-line tool:

```shell
kubectl get pv <pv-name> -o jsonpath='{.status.lastPhaseTransitionTime}'
```

## Going forward

This feature was initially introduced as an alpha feature, behind a feature gate that is disabled by default.
During the alpha phase, we (Kubernetes SIG Storage) will collect feedback from the end user community and address any issues or improvements identified.

Once sufficient feedback has been received, or no complaints are received the feature can move to beta.
The beta phase will allow us to further validate the implementation and ensure its stability.

At least two Kubernetes releases will happen between the release where this field graduates
to beta and the release that graduates the field to general availability (GA). That means that
the earliest release where this field could be generally available is Kubernetes 1.32,
likely to be scheduled for early 2025.

## Getting involved

We always welcome new contributors so if you would like to get involved you can
join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).

If you would like to share feedback, you can do so on our
[public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).
If you're not already part of that Slack workspace, you can visit https://slack.k8s.io/ for an invitation.

Special thanks to all the contributors that provided great reviews, shared valuable insight and helped implement this feature (alphabetical order):

- Han Kang ([logicalhan](https://github.com/logicalhan))
- Jan Šafránek ([jsafrane](https://github.com/jsafrane))
- Jordan Liggitt ([liggitt](https://github.com/liggitt))
- Kiki ([carlory](https://github.com/carlory))
- Michelle Au ([msau42](https://github.com/msau42))
- Tim Bannister ([sftim](https://github.com/sftim))
- Wojciech Tyczynski ([wojtek-t](https://github.com/wojtek-t))
- Xing Yang ([xing-yang](https://github.com/xing-yang))
