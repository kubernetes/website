---
reviewers:
- jlowdermilk
- justinsb
- quinton-hoole
title: Running in multiple zones
weight: 10
content_template: templates/concept
---

{{% capture overview %}}

This page describes how to run a cluster in multiple zones.

{{% /capture %}}

{{% capture body %}}

## Introduction

Kubernetes 1.2 adds support for running a single cluster in multiple failure zones
(GCE calls them simply "zones", AWS calls them "availability zones", here we'll refer to them as "zones").
This is a lightweight version of a broader Cluster Federation feature (previously referred to by the affectionate
nickname ["Ubernetes"](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/multicluster/federation.md)).
Full Cluster Federation allows combining separate
Kubernetes clusters running in different regions or cloud providers
(or on-premises data centers).  However, many
users simply want to run a more available Kubernetes cluster in multiple zones
of their single cloud provider, and this is what the multizone support in 1.2 allows
(this previously went by the nickname "Ubernetes Lite").

Multizone support is deliberately limited: a single Kubernetes cluster can run
in multiple zones, but only within the same region (and cloud provider).  Only
GCE and AWS are currently supported automatically (though it is easy to
add similar support for other clouds or even bare metal, by simply arranging
for the appropriate labels to be added to nodes and volumes).


## Functionality

When nodes are started, the kubelet automatically adds labels to them with
zone information.

Kubernetes will automatically spread the pods in a replication controller
or service across nodes in a single-zone cluster (to reduce the impact of
failures.)  With multiple-zone clusters, this spreading behavior is
extended across zones (to reduce the impact of zone failures.)  (This is
achieved via `SelectorSpreadPriority`).  This is a best-effort
placement, and so if the zones in your cluster are heterogeneous
(e.g. different numbers of nodes, different types of nodes, or
different pod resource requirements), this might prevent perfectly
even spreading of your pods across zones. If desired, you can use
homogeneous zones (same number and types of nodes) to reduce the
probability of unequal spreading.

When persistent volumes are created, the `PersistentVolumeLabel`
admission controller automatically adds zone labels to them.  The scheduler (via the
`VolumeZonePredicate` predicate) will then ensure that pods that claim a
given volume are only placed into the same zone as that volume, as volumes
cannot be attached across zones.

## Limitations

There are some important limitations of the multizone support:

* We assume that the different zones are located close to each other in the
network, so we don't perform any zone-aware routing.  In particular, traffic
that goes via services might cross zones (even if some pods backing that service
exist in the same zone as the client), and this may incur additional latency and cost.

* Volume zone-affinity will only work with a `PersistentVolume`, and will not
work if you directly specify an EBS volume in the pod spec (for example).

* Clusters cannot span clouds or regions (this functionality will require full
federation support).

* Although your nodes are in multiple zones, kube-up currently builds
a single master node by default.  While services are highly
available and can tolerate the loss of a zone, the control plane is
located in a single zone.  Users that want a highly available control
plane should follow the [high availability](/docs/admin/high-availability) instructions.

### Volume limitations
The following limitations are addressed with [topology-aware volume binding](/docs/concepts/storage/storage-classes/#volume-binding-mode).

* StatefulSet volume zone spreading when using dynamic provisioning is currently not compatible with
  pod affinity or anti-affinity policies.

* If the name of the StatefulSet contains dashes ("-"), volume zone spreading
  may not provide a uniform distribution of storage across zones.

* When specifying multiple PVCs in a Deployment or Pod spec, the StorageClass
  needs to be configured for a specific single zone, or the PVs need to be
  statically provisioned in a specific zone. Another workaround is to use a
  StatefulSet, which will ensure that all the volumes for a replica are
  provisioned in the same zone.

## Walkthrough

We're now going to walk through setting up and using a multi-zone
cluster on both GCE & AWS.  To do so, you bring up a full cluster
(specifying `MULTIZONE=true`), and then you add nodes in additional zones
by running `kube-up` again (specifying `KUBE_USE_EXISTING_MASTER=true`).

### Bringing up your cluster

Create the cluster as normal, but pass MULTIZONE to tell the cluster to manage multiple zones; creating nodes in us-central1-a.

GCE:

```shell
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-a NUM_NODES=3 bash
```

AWS:

```shell
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2a NUM_NODES=3 bash
```

This step brings up a cluster as normal, still running in a single zone
(but `MULTIZONE=true` has enabled multi-zone capabilities).

### Nodes are labeled

View the nodes; you can see that they are labeled with zone information.
They are all in `us-central1-a` (GCE) or `us-west-2a` (AWS) so far.  The
labels are `failure-domain.beta.kubernetes.io/region` for the region,
and `failure-domain.beta.kubernetes.io/zone` for the zone:

```shell
kubectl get nodes --show-labels
```

The output is similar to this:

```shell
NAME                     STATUS                     ROLES    AGE   VERSION          LABELS
kubernetes-master        Ready,SchedulingDisabled   <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-87j9   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
```

### Add more nodes in a second zone

Let's add another set of nodes to the existing cluster, reusing the
existing master, running in a different zone (us-central1-b or us-west-2b).
We run kube-up again, but by specifying `KUBE_USE_EXISTING_MASTER=true`
kube-up will not create a new master, but will reuse one that was previously
created instead.

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-b NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

On AWS we also need to specify the network CIDR for the additional
subnet, along with the master internal IP address:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2b NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.1.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```


View the nodes again; 3 more nodes should have launched and be tagged
in us-central1-b:

```shell
kubectl get nodes --show-labels
```

The output is similar to this:

```shell
NAME                     STATUS                     ROLES    AGE   VERSION           LABELS
kubernetes-master        Ready,SchedulingDisabled   <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-281d   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-87j9   Ready                      <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      <none>   17m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
kubernetes-minion-pp2f   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-pp2f
kubernetes-minion-wf8i   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-wf8i
```

### Volume affinity

Create a volume using the dynamic volume creation (only PersistentVolumes are supported for zone affinity):

```json
kubectl apply -f - <<EOF
{
  "apiVersion": "v1",
  "kind": "PersistentVolumeClaim",
  "metadata": {
    "name": "claim1",
    "annotations": {
        "volume.alpha.kubernetes.io/storage-class": "foo"
    }
  },
  "spec": {
    "accessModes": [
      "ReadWriteOnce"
    ],
    "resources": {
      "requests": {
        "storage": "5Gi"
      }
    }
  }
}
EOF
```

{{< note >}}
For version 1.3+ Kubernetes will distribute dynamic PV claims across
the configured zones. For version 1.2, dynamic persistent volumes were
always created in the zone of the cluster master
(here us-central1-a / us-west-2a); that issue
([#23330](https://github.com/kubernetes/kubernetes/issues/23330))
was addressed in 1.3+.
{{< /note >}}

Now let's validate that Kubernetes automatically labeled the zone & region the PV was created in.

```shell
kubectl get pv --show-labels
```

The output is similar to this:

```shell
NAME           CAPACITY   ACCESSMODES   RECLAIM POLICY   STATUS    CLAIM            STORAGECLASS    REASON    AGE       LABELS
pv-gce-mj4gm   5Gi        RWO           Retain           Bound     default/claim1   manual                    46s       failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a
```

So now we will create a pod that uses the persistent volume claim.
Because GCE PDs / AWS EBS volumes cannot be attached across zones,
this means that this pod can only be created in the same zone as the volume:

```yaml
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: claim1
EOF
```

Note that the pod was automatically created in the same zone as the volume, as
cross-zone attachments are not generally permitted by cloud providers:

```shell
kubectl describe pod mypod | grep Node
```

```shell
Node:        kubernetes-minion-9vlv/10.240.0.5
```

And check node labels:

```shell
kubectl get node kubernetes-minion-9vlv --show-labels
```

```shell
NAME                     STATUS    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     22m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
```

### Pods are spread across zones

Pods in a replication controller or service are automatically spread
across zones.  First, let's launch more nodes in a third zone:

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-f NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

AWS:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2c NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.2.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```

Verify that you now have nodes in 3 zones:

```shell
kubectl get nodes --show-labels
```

Create the guestbook-go example, which includes an RC of size 3, running a simple web app:

```shell
find kubernetes/examples/guestbook-go/ -name '*.json' | xargs -I {} kubectl apply -f {}
```

The pods should be spread across all 3 zones:

```shell
kubectl describe pod -l app=guestbook | grep Node
```

```shell
Node:        kubernetes-minion-9vlv/10.240.0.5
Node:        kubernetes-minion-281d/10.240.0.8
Node:        kubernetes-minion-olsh/10.240.0.11
```

```shell
kubectl get node kubernetes-minion-9vlv kubernetes-minion-281d kubernetes-minion-olsh --show-labels
```

```shell
NAME                     STATUS    ROLES    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     <none>   34m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-281d   Ready     <none>   20m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-olsh   Ready     <none>   3m     v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-f,kubernetes.io/hostname=kubernetes-minion-olsh
```


Load-balancers span all zones in a cluster; the guestbook-go example
includes an example load-balanced service:

```shell
kubectl describe service guestbook | grep LoadBalancer.Ingress
```

The output is similar to this:

```shell
LoadBalancer Ingress:   130.211.126.21
```

Set the above IP:

```shell
export IP=130.211.126.21
```

Explore with curl via IP:

```shell
curl -s http://${IP}:3000/env | grep HOSTNAME
```

The output is similar to this:

```shell
  "HOSTNAME": "guestbook-44sep",
```

Again, explore multiple times:

```shell
(for i in `seq 20`; do curl -s http://${IP}:3000/env | grep HOSTNAME; done)  | sort | uniq
```

The output is similar to this:

```shell
  "HOSTNAME": "guestbook-44sep",
  "HOSTNAME": "guestbook-hum5n",
  "HOSTNAME": "guestbook-ppm40",
```

The load balancer correctly targets all the pods, even though they are in multiple zones.

### Shutting down the cluster

When you're done, clean up:

GCE:

```shell
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true KUBE_GCE_ZONE=us-central1-f kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true KUBE_GCE_ZONE=us-central1-b kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-a kubernetes/cluster/kube-down.sh
```

AWS:

```shell
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2c kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2b kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2a kubernetes/cluster/kube-down.sh
```

{{% /capture %}}
