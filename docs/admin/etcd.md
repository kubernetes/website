---
assignees:
- lavalamp
title: Configuring Kubernetes Use of etcd
---

[etcd](https://coreos.com/etcd/docs/latest/) is a highly-available key value
store which Kubernetes uses for persistent storage of all of its REST API
objects.

## Configuration: high-level goals

Access Control: give *only* kube-apiserver read/write access to etcd. You do not
want apiserver's etcd exposed to every node in your cluster (or worse, to the
internet at large), because access to etcd is equivalent to root in your
cluster.

Data Reliability: for reasonable safety, either etcd needs to be run as a
[cluster](/docs/admin/high-availability/#clustering-etcd) (multiple machines each running
etcd) or etcd's data directory should be located on durable storage (e.g., GCE's
persistent disk). In either case, if high availability is required--as it might
be in a production cluster--the data directory ought to be [backed up
periodically](https://coreos.com/etcd/docs/latest/op-guide/recovery.html),
to reduce downtime in case of corruption.

## Default configuration

The default setup scripts use kubelet's file-based static pods feature to run etcd in a
[pod](http://releases.k8s.io/{{page.githubbranch}}/cluster/saltbase/salt/etcd/etcd.manifest). This manifest should only
be run on master VMs. The default location that kubelet scans for manifests is
`/etc/kubernetes/manifests/`.

## Kubernetes's usage of etcd

By default, Kubernetes objects are stored under the `/registry` key in etcd.
This path can be prefixed by using the [kube-apiserver](/docs/admin/kube-apiserver) flag
`--etcd-prefix="/foo"`.

`etcd` is the only place that Kubernetes keeps state.

## Troubleshooting

To test whether `etcd` is running correctly, you can try writing a value to a
test key. On your master VM (or somewhere with firewalls configured such that
you can talk to your cluster's etcd), try:

```shell
curl -fs -X PUT "http://${host}:${port}/v2/keys/_test"
```
