---
layout: blog
title: "Kubernetes v1.37: Tracking When a PVC was last used (Beta)"
date: 
slug: kubernetes-pvc-last-used-time
author: >
  [Roman Bednář](https://github.com/RomanBednar) (Red Hat)
---

Kubernetes v1.37 promotes the `PersistentVolumeClaimUnusedSinceTime` feature gate to beta (enabled by
default). With this feature, the PVC protection controller adds an `Unused` condition to each
PersistentVolumeClaim (PVC), telling you whether any running pod currently references it — no custom
tooling or cross-referencing required.

For the API definition of PVC conditions, see the
[PersistentVolumeClaim API reference](https://kubernetes.io/docs/reference/kubernetes-api/core/persistent-volume-claim-v1/#PersistentVolumeClaimCondition).
Read on to learn how the `Unused` condition works and how to use it.

## Why track PVC usage?

In large-scale Kubernetes clusters, it is common for users to create PVCs and then delete the
associated pods without cleaning up the storage. Over time, these "orphaned" PVCs accumulate, silently
consuming storage capacity and driving up cloud costs.

Determining whether a PVC is actively in use today requires cross-referencing pods, PVs, and PVCs
across a potentially large window of time. Administrators often resort to building custom monitoring
pipelines or scripts to answer a seemingly simple question: _"Is anything actually using this
volume?"_

The `PersistentVolumeClaimUnusedSinceTime` feature solves this by making the answer available
natively in the PVC status. Once the feature is enabled, every PVC gets an `Unused` condition managed
by the PVC protection controller.

### User stories

* **Storage administrator**: "I want to know which PVCs in my cluster are not being used by any pod
  so I can safely identify orphaned volumes and schedule them for deletion."
* **DevOps engineer**: "I want to list PVCs that have the `Unused` condition set to `True` so I
  can automate cleanup in development environments."

## How does it work?

The PVC protection controller — which already watches pods to enforce the
[storage object in use protection](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)
— now also manages a new `Unused` condition on PVCs.

The condition works as follows:

| Scenario | Condition status | Reason |
|---|---|---|
| No non-terminal pods reference the PVC | `Unused=True` | `NoPodsUsingPVC` |
| At least one running or pending pod references the PVC | `Unused=False` | `PodUsingPVC` |

A few details worth noting:

- **Terminated pods don't count**: A pod that has completed (phase `Succeeded` or `Failed`) does not
  keep the PVC marked as in use. This means batch jobs with `restartPolicy: Never` won't prevent
  the PVC from becoming `Unused=True` after they finish.
- **Pending pods do count**: Even an unschedulable pod (for example, one with an impossible node
  selector) still counts as using the PVC. The intent to use the volume is enough.
- **Multiple pods**: If several pods reference the same PVC, the condition transitions to
  `Unused=True` only after the _last_ non-terminal pod is removed.

### Using `lastTransitionTime` to find when a PVC became idle

Like every Kubernetes condition, the `Unused` condition carries a standard `lastTransitionTime`
field. This means you get a useful bonus for free: when the condition transitions from `False` to
`True`, the `lastTransitionTime` records exactly when the PVC became idle. You can use this
timestamp to answer questions like _"how long has this PVC been sitting unused?"_ — for example,
to find PVCs that have been idle for more than 30 days (see the
[example query](#finding-unused-pvcs-across-the-cluster) below).

## What changed from alpha to beta?

The feature was introduced as alpha in Kubernetes v1.36, where it had to be explicitly enabled via
the `PersistentVolumeClaimUnusedSinceTime` feature gate. For beta in v1.37:

- The feature gate is now **enabled by default**. No action is needed to start using it.
- Full end-to-end test coverage has been added upstream.

## How to use it

Since the feature is beta and enabled by default in Kubernetes v1.37, the `Unused` condition will
appear on PVCs automatically. Here is a walkthrough to see it in action:

1. Create a PVC:

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: my-data
   spec:
     accessModes:
     - ReadWriteOnce
     resources:
       requests:
         storage: 1Gi
   ```

2. After a short time, inspect the PVC conditions:

   ```shell
   kubectl get pvc my-data -o jsonpath='{.status.conditions[*]}' | jq .
   ```

   You should see an `Unused` condition with status `True` and reason `NoPodsUsingPVC`:

   ```json
   {
     "type": "Unused",
     "status": "True",
     "reason": "NoPodsUsingPVC",
     "lastTransitionTime": "2026-08-26T10:00:00Z"
   }
   ```

3. Create a pod that uses the PVC:

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: my-app
   spec:
     containers:
     - name: app
       image: busybox
       command: ["sleep", "3600"]
       volumeMounts:
       - name: data
         mountPath: /data
     volumes:
     - name: data
       persistentVolumeClaim:
         claimName: my-data
   ```

4. Check the condition again — it should now show `Unused=False`:

   ```shell
   kubectl get pvc my-data -o jsonpath='{.status.conditions[?(@.type=="Unused")].status}'
   ```

   Output:
   ```
   False
   ```

5. Delete the pod and wait for the condition to transition back to `Unused=True`:

   ```shell
   kubectl delete pod my-app
   kubectl get pvc my-data -o jsonpath='{.status.conditions[?(@.type=="Unused")]}'
   ```

   The condition should show `Unused=True` with reason `NoPodsUsingPVC` again.

### Finding unused PVCs across the cluster

To list all PVCs that have been unused for more than 30 days, you can use a command like:

```shell
kubectl get pvc -A -o json | jq -r '
  .items[]
  | select(.status.conditions[]? | select(.type=="Unused" and .status=="True"))
  | select(
      (.status.conditions[] | select(.type=="Unused") | .lastTransitionTime) as $t
      | (now - ($t | fromdateiso8601)) > (30 * 86400)
    )
  | "\(.metadata.namespace)/\(.metadata.name) unused since \(.status.conditions[] | select(.type=="Unused") | .lastTransitionTime)"
'
```

## What's next?

Depending on feedback and adoption, the Kubernetes project plans to graduate this feature to
General Availability (GA) in a future release. If you have feedback on this feature, please
open an issue in the [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.

## Getting involved

We always welcome new contributors. If you would like to get involved, you can join our
[Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage)
(SIG Storage).

If you would like to share feedback, you can do so on our
[public Slack channel](https://kubernetes.slack.com/messages/sig-storage)
(visit https://slack.k8s.io/ for an invitation if you need one).

Special thanks to the contributors who helped design and implement this feature (alphabetical order):

- Arvind Parekh ([ArvindParekh](https://github.com/ArvindParekh))
- Hemant Kumar ([gnufied](https://github.com/gnufied))
- Jan Šafránek ([jsafrane](https://github.com/jsafrane))
- Kevin Hannon ([kannon92](https://github.com/kannon92))
- Roman Bednar ([RomanBednar](https://github.com/RomanBednar))
