---
title: Backups
---

{% capture overview %}
The state of a Kubernetes cluster is kept in the etcd datastore.
This page shows how to backup and restore the etcd shipped with
the Canonical Distribution of Kubernetes. Backing up application specific data,
normally stored in a persistent volume, is outside the scope of this
document.
{% endcapture %}

{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}

{% capture steps %}
## Snapshot etcd data

The `snapshot` action of the etcd charm allows the operator to snapshot
a running cluster's data for use in cloning,
backing up, or migrating to a new cluster.

    juju run-action etcd/0 snapshot 

This will create a snapshot in `/home/ubuntu/etcd-snapshots` by default.

## Restore etcd data

The etcd charm is capable of restoring its data from a cluster-data snapshot
via the `restore` action.
This comes with caveats and a very specific path to restore a cluster:
The cluster must be in a state of only having a single member. So it's best to
deploy a new cluster using the etcd charm, without adding any additional units.

```
juju deploy etcd new-etcd
```

The above code snippet will deploy a single unit of etcd, as 'new-etcd'

```
juju run-action etcd/0 restore target=/mnt/etcd-backups
```

Once the restore action has completed, evaluate the cluster health. If the unit
is healthy, you may resume scaling the application to meet your needs.

- **param** target: destination directory to save the existing data.

- **param** skip-backup: Don't backup any existing data.


## Migrating an etcd cluster
Using the above snapshot and restore operations, migrating etcd is a fairly easy task.

**Step 1:** Snapshot your existing cluster. This is encapsulated in the `snapshot`
action.

```
juju run-action etcd/0 snapshot
```

Results:

```
Action queued with id: b46d5d6f-5625-4320-8cda-b611c6ae580c
```

**Step 2:** Check the status of the action so you can grab the snapshot and verify
the sum. The `copy.cmd` result output is a copy/paste command for you to download
the exact snapshot that you just created.

Download the snapshot archive from the unit that created the snapshot and verify
the sha256 sum

```
juju show-action-output b46d5d6f-5625-4320-8cda-b611c6ae580c
```

Results:

```
results:
  copy:
    cmd: juju scp etcd/0:/home/ubuntu/etcd-snapshots/etcd-snapshot-2016-11-09-02.41.47.tar.gz
      .
  snapshot:
    path: /home/ubuntu/etcd-snapshots/etcd-snapshot-2016-11-09-02.41.47.tar.gz
    sha256: 1dea04627812397c51ee87e313433f3102f617a9cab1d1b79698323f6459953d
    size: 68K
status: completed
```

Copy the snapshot to the local disk and then check the sha256sum. 

```
juju scp etcd/0:/home/ubuntu/etcd-snapshots/etcd-snapshot-2016-11-09-02.41.47.tar.gz .
sha256sum etcd-snapshot-2016-11-09-02.41.47.tar.gz
```

**Step 3:** Deploy the new cluster leader, and attach the snapshot:

```
juju deploy etcd new-etcd --resource snapshot=./etcd-snapshot-2016-11-09-02.41.47.tar.gz
```

**Step 4:** Reinitialize the master with the data from the resource we just attached
in step 3.

```
juju run-action new-etcd/0 restore
```


{% endcapture %}

{% capture discussion %}
## Known Limitations

#### Loss of PKI warning

If you destroy the leader - identified with the `*` text next to the unit number in status:
all TLS pki will be lost. No PKI migration occurs outside
of the units requesting and registering the certificates.

**Caution:**  Mismanaging this configuration will result in locking yourself
out of the cluster, and can potentially break existing deployments in very
strange ways relating to x509 validation of certificates, which affects both
servers and clients.
{: .caution}

#### Restoring from snapshot on a scaled cluster

Restoring from a snapshot on a scaled cluster will result in a broken cluster.
Etcd performs clustering during unit turn-up, and state is stored in Etcd itself.
During the snapshot restore phase, a new cluster ID is initialized, and peers
are dropped from the snapshot state to enable snapshot restoration. Please
follow the migration instructions above in the restore action description.
{% endcapture %}

{% include templates/task.md %}
