---
layout: blog
title: "How to Handle Data Duplication in Data-Heavy Kubernetes Environments"
date: 2021-09-29
slug: how-to-handle-data-duplication-in-data-heavy-kubernetes-environments 
author: >
  Augustinas Stirbis (CAST AI)
---

## Why Duplicate Data?

It’s convenient to create a copy of your application with a copy of its state for each team. 
For example, you might want a separate database copy to test some significant schema changes 
or develop other disruptive operations like bulk insert/delete/update...

**Duplicating data takes a lot of time.** That’s because you need first to download 
all the data from a source block storage provider to compute and then send 
it back to a storage provider again. There’s a lot of network traffic and CPU/RAM used in this process.
Hardware acceleration by offloading certain expensive operations to dedicated hardware is 
**always a huge performance boost**. It reduces the time required to complete an operation by orders 
of magnitude.

## Volume Snapshots to the rescue

Kubernetes introduced [VolumeSnapshots](/docs/concepts/storage/volume-snapshots/) as alpha in 1.12,
beta in 1.17, and the Generally Available version in 1.20. 
VolumeSnapshots use specialized APIs from storage providers to duplicate volume of data.

Since data is already in the same storage device (array of devices), duplicating data is usually 
a metadata operation for storage providers with local snapshots (majority of on-premise storage providers).
All you need to do is point a new disk to an immutable snapshot and only 
save deltas (or let it do a full-disk copy). As an operation that is inside the storage back-end,
it’s much quicker and usually doesn’t involve sending traffic over the network.
Public Clouds storage providers under the hood work a bit differently. They save snapshots
to Object Storage and then copy back from Object storage to Block storage when "duplicating" disk.
Technically there is a lot of Compute and network resources spent on Cloud providers side,
but from Kubernetes user perspective VolumeSnapshots work the same way whether is it local or
remote snapshot storage provider and no Compute and Network resources are involved in this operation.

## Sounds like we have our solution, right?

Actually, VolumeSnapshots are namespaced, and Kubernetes protects namespaced data from 
being shared between tenants (Namespaces). This Kubernetes limitation is a conscious design 
decision so that a Pod running in a different namespace can’t mount another application’s
[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC).

One way around it would be to create multiple volumes with duplicate data in one namespace.
However, you could easily reference the wrong copy.

So the idea is to separate teams/initiatives by namespaces to avoid that and generally 
limit access to the production namespace.

## Solution? Creating a Golden Snapshot externally

Another way around this design limitation is to create Snapshot externally (not through Kubernetes).
This is also called pre-provisioning a snapshot manually. Next, I will import it 
as a multi-tenant golden snapshot that can be used for many namespaces. Below illustration will be 
for AWS EBS (Elastic Block Storage) and GCE PD (Persistent Disk) services.

### High-level plan for preparing the Golden Snapshot

1. Identify Disk (EBS/Persistent Disk) that you want to clone with data in the cloud provider
2. Make a Disk Snapshot (in cloud provider console)
3. Get Disk Snapshot ID

### High-level plan for cloning data for each team

1. Create Namespace “sandbox01”
2. Import Disk Snapshot (ID) as VolumeSnapshotContent to Kubernetes
3. Create VolumeSnapshot in the Namespace "sandbox01" mapped to VolumeSnapshotContent
4. Create the PersistentVolumeClaim from VolumeSnapshot
5. Install Deployment or StatefulSet with PVC

## Step 1: Identify Disk

First, you need to identify your golden source. In my case, it’s a PostgreSQL database
on PersistentVolumeClaim “postgres-pv-claim” in the “production” namespace.

```terminal
kubectl -n <namespace> get pvc <pvc-name> -o jsonpath='{.spec.volumeName}'
```

The output will look similar to:
```
pvc-3096b3ba-38b6-4fd1-a42f-ec99176ed0d90
```

## Step 2: Prepare your golden source

You need to do this once or every time you want to refresh your golden data.

### Make a Disk Snapshot

Go to AWS EC2 or GCP Compute Engine console and search for an EBS volume
(on AWS) or Persistent Disk (on GCP), that has a label matching the last output.
In this case I saw: `pvc-3096b3ba-38b6-4fd1-a42f-ec99176ed0d9`.

Click on Create snapshot and give it a name. You can do it in Console manually,
in AWS CloudShell / Google Cloud Shell, or in the terminal. To create a snapshot in the
terminal you must have the AWS CLI tool (`aws`) or Google's CLI (`gcloud`)
installed and configured.

Here’s the command to create snapshot on GCP:

```terminal
gcloud compute disks snapshot <cloud-disk-id> --project=<gcp-project-id> --snapshot-names=<set-new-snapshot-name> --zone=<availability-zone> --storage-location=<region>
```
{{< figure src="/images/blog/2021-09-07-data-duplication-in-data-heavy-k8s-env/create-volume-snapshot-gcp.png" alt="Screenshot of a terminal showing volume snapshot creation on GCP" title="GCP snapshot creation" >}}


GCP identifies the disk by its PVC name, so it’s direct mapping. In AWS, you need to 
find volume by the CSIVolumeName AWS tag with PVC name value first that will be used for snapshot creation.

{{< figure src="/images/blog/2021-09-07-data-duplication-in-data-heavy-k8s-env/identify-volume-aws.png" alt="Screenshot of AWS web console, showing EBS volume identification" title="Identify disk ID on AWS" >}}

Mark done Volume (volume-id) ```vol-00c7ecd873c6fb3ec``` and ether create EBS snapshot in AWS Console, or use ```aws cli```.

```terminal
aws ec2 create-snapshot --volume-id '<volume-id>' --description '<set-new-snapshot-name>' --tag-specifications 'ResourceType=snapshot'
```

## Step 3: Get your Disk Snapshot ID

In AWS, the command above will output something similar to:
```terminal
"SnapshotId": "snap-09ed24a70bc19bbe4"
```

If you’re using the GCP cloud, you can get the snapshot ID from the gcloud command by querying for the snapshot’s given name:

```terminal
gcloud compute snapshots --project=<gcp-project-id> describe <new-snapshot-name> | grep id:
```
You should get similar output to:
```
id: 6645363163809389170
```

## Step 4: Create a development environment for each team

Now I have my Golden Snapshot, which is immutable data. Each team will get a copy 
of this data, and team members can modify it as they see fit, given that a new EBS/persistent 
disk will be created for each team.

Below I will define a manifest for each namespace. To save time, you can replace
the namespace name (such as changing “sandbox01” → “sandbox42”) using tools
such as `sed` or `yq`, with Kubernetes-aware templating tools like
[Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/),
or using variable substitution in a CI/CD pipeline.

Here's an example manifest:

```yaml
---
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
 name: postgresql-orders-db-sandbox01
 namespace: sandbox01
spec:
 deletionPolicy: Retain
 driver: pd.csi.storage.gke.io
 source:
   snapshotHandle: 'gcp/projects/staging-eu-castai-vt5hy2/global/snapshots/6645363163809389170'
 volumeSnapshotRef:
   kind: VolumeSnapshot
   name: postgresql-orders-db-snap
   namespace: sandbox01
---
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
 name: postgresql-orders-db-snap
 namespace: sandbox01
spec:
 source:
   volumeSnapshotContentName: postgresql-orders-db-sandbox01
```

In Kubernetes, VolumeSnapshotContent (VSC) objects are not namespaced.
However, I need a separate VSC for each different namespace to use, so the
`metadata.name` of each VSC must also be different. To make that straightfoward,
I used the target namespace as part of the name.

Now it’s time to replace the driver field with the CSI (Container Storage Interface) driver
installed in your K8s cluster. Major cloud providers have CSI driver for block storage that
support VolumeSnapshots but quite often CSI drivers are not installed by default, consult
with your Kubernetes provider. 

That manifest above defines a VSC that works on GCP.
On AWS, driver and SnashotHandle values might look like:

```YAML
  driver: ebs.csi.aws.com
  source:
    snapshotHandle: "snap-07ff83d328c981c98"
```

At this point, I need to use the *Retain* policy, so that the CSI driver doesn’t try to
delete my manually created EBS disk snapshot.

For GCP, you will have to build this string by hand - add a full project ID and snapshot ID.
For AWS, it’s just a plain snapshot ID.

VSC also requires specifying which VolumeSnapshot (VS) will use it, so VSC and VS are
referencing each other.

Now I can create PersistentVolumeClaim from VS above. It’s important to set this first:


```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
 name: postgres-pv-claim
 namespace: sandbox01
spec:
 dataSource:
   kind: VolumeSnapshot
   name: postgresql-orders-db-snap
   apiGroup: snapshot.storage.k8s.io
 accessModes:
   - ReadWriteOnce
 resources:
   requests:
     storage: 21Gi
```

If default StorageClass has [WaitForFirstConsumer](https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode) policy,
then the actual Cloud Disk will be created from the Golden Snapshot only when some Pod bounds that PVC.

Now I assign that PVC to my Pod (in my case, it’s Postgresql) as I would with any other PVC.

```terminal
kubectl -n <namespace> get volumesnapshotContent,volumesnapshot,pvc,pod
```

Both VS and VSC should be *READYTOUSE* true, PVC bound, and the Pod (from Deployment or StatefulSet) running.

**To keep on using data from my Golden Snapshot, I just need to repeat this for the
next namespace and voilà! No need to waste time and compute resources on the duplication process.**