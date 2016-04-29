---
---

The purpose of this guide is to help you become familiar with [Kubernetes Persistent Volumes](/docs/user-guide/persistent-volumes/).  By the end of the guide, we'll have
nginx serving content from your persistent volume.

You can view all the files for this example in [the docs repo
here](https://github.com/kubernetes/kubernetes.github.io/tree/{{page.docsbranch}}/docs/user-guide/persistent-volumes).

This guide assumes knowledge of Kubernetes fundamentals and that you have a cluster up and running.

See [Persistent Storage design document](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/persistent-storage.md) for more information.

## Provisioning

A Persistent Volume (PV) in Kubernetes represents a real piece of underlying storage capacity in the infrastructure.  Cluster administrators
must first create storage (create their Google Compute Engine (GCE) disks, export their NFS shares, etc.) in order for Kubernetes to mount it.

PVs are intended for "network volumes" like GCE Persistent Disks, NFS shares, and AWS ElasticBlockStore volumes.  `HostPath` was included
for ease of development and testing.  You'll create a local `HostPath` for this example.

> IMPORTANT! For `HostPath` to work, you will need to run a single node cluster.  Kubernetes does not
support local storage on the host at this time.  There is no guarantee your pod ends up on the correct node where the `HostPath` resides.

```shell
# This will be nginx's webroot
$ mkdir /tmp/data01
$ echo 'I love Kubernetes storage!' > /tmp/data01/index.html
```

PVs are created by posting them to the API server.

```shell
$ kubectl create -f docs/user-guide/persistent-volumes/volumes/local-01.yaml
NAME      LABELS       CAPACITY      ACCESSMODES   STATUS      CLAIM     REASON
pv0001    type=local   10737418240   RWO           Available 
```

### Access Control

Storage configured with GID will only allow writing by pods using the
same GID. Mismatched or missing GIDs will cause `permission denied`
errors. Adding GID to a PersistentVolume- via the
`pv.beta.kubernetes.io/gid annotation` -allows Kubelet to automatically
add the GID to the pod that requires it. No coordination between an
admin and end user is required. Setting GID automatically is safe
because this is only done for PersistentVolumes which are accessed
through a PersistentVolumeClaim.

To add the volume's GID to the volume you use the
`volume.kuberntes.io/gid` annotation as follows:

```yaml
apiVersion: v1
metadata:
  name: pv1
  annotations:
    volume.kubernetes.io/gid: "1234"
#...
```

For more information please see [Security Contexts](../security-context.md) for more information.

## Requesting storage

Users of Kubernetes request persistent storage for their pods.  They don't know how the underlying cluster is provisioned.
They just know they can rely on their claim to storage and can manage its lifecycle independently from the many pods that may use it.

Claims must be created in the same namespace as the pods that use them.

```shell
$ kubectl create -f docs/user-guide/persistent-volumes/claims/claim-01.yaml

$ kubectl get pvc
NAME                LABELS              STATUS              VOLUME
myclaim-1           map[]                                   
           
           
# A background process will attempt to match this claim to a volume.
# The eventual state of your claim will look something like this:

$ kubectl get pvc
NAME        LABELS    STATUS    VOLUME
myclaim-1   map[]     Bound     pv0001

$ kubectl get pv
NAME      LABELS       CAPACITY      ACCESSMODES   STATUS    CLAIM               REASON
pv0001    type=local   10737418240   RWO           Bound     default/myclaim-1 
```

## Using your claim as a volume

Claims are used as volumes in pods.  Kubernetes uses the claim to look up its bound PV.  The PV is then exposed to the pod.

```shell
$ kubectl create -f docs/user-guide/persistent-volumes/simpletest/pod.yaml

$ kubectl get pods
NAME      READY     STATUS    RESTARTS   AGE
mypod     1/1       Running   0          1h

$ kubectl create -f docs/user-guide/persistent-volumes/simpletest/service.json
$ kubectl get services
NAME              CLUSTER_IP       EXTERNAL_IP       PORT(S)       SELECTOR           AGE
frontendservice   10.0.0.241       <none>            3000/TCP      name=frontendhttp  1d
kubernetes        10.0.0.2         <none>            443/TCP       <none>             2d
```

## Next steps

You should be able to query your service endpoint and see what content nginx is serving.  A "forbidden" error might mean you
need to disable SELinux (setenforce 0).

```shell
$ curl 10.0.0.241:3000
I love Kubernetes storage!
```

Hopefully this simple guide is enough to get you started with PersistentVolumes.  If you have any questions, join the team on [Slack](/docs/troubleshooting/#slack) and ask!

Enjoy!