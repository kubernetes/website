---
title: Change the Reclaim Policy of a PersistentVolume
---

{% capture overview %}
This page shows how to change the reclaim policy of a Kubernetes
PersistentVolume.
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Why change reclaim policy of a PersistentVolume

`PersistentVolumes` can have various reclaim policies, including "Retain",
"Recycle", and "Delete". For dynamically provisioned `PersistentVolumes`,
the default reclaim policy is "Delete". This means that a dynamically provisioned
volume is automatically deleted when a user deletes the corresponding
`PersistentVolumeClaim`. This automatic behavior might be inappropriate if the volume
contains precious data. In that case, it is more appropriate to use the "Retain"
policy. With the "Retain" policy, if a user deletes a `PersistentVolumeClaim`,
the corresponding `PersistentVolume` is not be deleted. Instead, it is moved to the
`Released` phase, where all of its data can be manually recovered.

## Changing the reclaim policy of a PersistentVolume

1. List the PersistentVolumes in your cluster:

       kubectl get pv

    The output is similar to this:

        NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                  REASON    AGE
        pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1                   10s
        pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2                   6s
        pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim3                   3s

   This list also includes the name of the claims that are bound to each volume
   for easier identification of dynamically provisioned volumes.

1. Choose one of your PersistentVolumes and change its reclaim policy:

       kubectl patch pv <your-pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'

    where `<your-pv-name>` is the name of your chosen PersistentVolume.

1. Verify that your chosen PersistentVolume has the right policy:

       kubectl get pv

    The output is similar to this:

        NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                  REASON    AGE
        pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1                   40s
        pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2                   36s
        pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Retain          Bound     default/claim3                   33s

    In the preceding output, you can see that the volume bound to claim
    `default/claim3` has reclaim policy `Retain`. It will not be automatically
    deleted when a user deletes claim `default/claim3`.

{% endcapture %}

{% capture whatsnext %}
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Learn more about [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

### Reference

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{page.version}}/#persistentvolume-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{page.version}}/#persistentvolumeclaim-v1-core)
* See the `persistentVolumeReclaimPolicy` field of [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{page.version}}/#persistentvolumeclaim-v1-core).
{% endcapture %}

{% include templates/task.md %}
