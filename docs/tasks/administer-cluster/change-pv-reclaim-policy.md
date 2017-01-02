---
---

{% capture overview %}
This page shows how to change the reclaim policy of a Kubernetes Persistent
Volume.
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

### Why change reclaim policy of a PersistentVolume

`PersistentVolumes` can have various reclaim policies and the default
policy of dynamically provisioned `PersistentVolumes` is "Delete".
This means that a dynamically provisioned volume is automatically deleted
when user deletes the corresponding PeristentVolumeClaim. Such automatic
behavior may be inappropriate if the volume contains precious data.
Instead using the "Retain" policy may be more appropriate. This way, if user
deletes a `PeristentVolumeClaim`, the `PersistentVolume` will not be deleted and
it will move to the `Released` phase, where all of its data can still be
manually recovered.

### Changing reclaim policy of a PersistentVolume

1. List Persistent Volumes in your cluster:

        kubectl get pv

    The output is similar to this:

        NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                  REASON    AGE
        pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1                   10s
        pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2                   6s
        pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim3                   3s

   This list also includes the name of the claims that are bound to each volume
   for easier identification of dynamically provisioned volumes.

1. Chose one of your PersistentVolumes and change its reclaim policy:

        kubectl patch pv <your-pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'

    where `<your-pv-name>` is the name of your chosen PersistentVolume.

1. Verify that your chosen PersistentVolume has the right policy:

        kubectl get pv

    The output is similar to this:

        NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                  REASON    AGE
        pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1                   40s
        pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2                   36s
        pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Retain          Bound     default/claim3                   33s

    In the preceding output, you can see that the volume that is bound to claim
    `default/claim3` has reclaim policy `Retain` and it will not be automatically
    deleted when user deletes claim `default/claim3`.

{% endcapture %}

{% capture whatsnext %}
Learn more about [PersistentVolumes](/docs/user-guide/persistent-volumes/).
{% endcapture %}

{% include templates/task.md %}
