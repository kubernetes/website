---
---

Following this example, you will create a pod with a downward API volume.
A downward API volume is a k8s volume plugin with the ability to save some pod information in a plain text file. The pod information can be  for example some [metadata](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/api-conventions.md#metadata).

Supported metadata fields:

1. `metadata.annotations`
2. `metadata.namespace`
3. `metadata.name`
4. `metadata.labels`

### Step Zero: Prerequisites

This example assumes you have a Kubernetes cluster installed and running, and the `kubectl` command line tool somewhere in your path. Please see the [gettingstarted](/docs/getting-started-guides/) for installation instructions for your platform.

### Step One: Create the pod

Use the [dapi-volume.yaml](/docs/user-guide/downward-api/volume/dapi-volume.yaml) file to create a Pod with a downward API volume which stores pod labels and pod annotations to `/etc/labels` and `/etc/annotations` respectively.

```shell
$ kubectl create -f  docs/user-guide/downward-api/volume/dapi-volume.yaml
```

### Step Two: Examine pod/container output

The pod displays (every 5 seconds) the content of the dump files which can be executed via the usual `kubectl log` command

```shell
$ kubectl logs kubernetes-downwardapi-volume-example
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
build="two"
builder="john-doe"
kubernetes.io/config.seen="2015-08-24T13:47:23.432459138Z"
kubernetes.io/config.source="api"
```

### Internals

In pod's `/etc` directory one may find the file created by the plugin (system files elided):

```shell
$ kubectl exec kubernetes-downwardapi-volume-example -i -t -- sh
/ # ls -laR /etc
/etc:
total 4
drwxrwxrwt    3 0        0              120 Jun  1 19:55 .
drwxr-xr-x   17 0        0             4096 Jun  1 19:55 ..
drwxr-xr-x    2 0        0               80 Jun  1 19:55 ..6986_01_06_15_55_10.473583074
lrwxrwxrwx    1 0        0               31 Jun  1 19:55 ..data -> ..6986_01_06_15_55_10.473583074
lrwxrwxrwx    1 0        0               18 Jun  1 19:55 annotations -> ..data/annotations
lrwxrwxrwx    1 0        0               13 Jun  1 19:55 labels -> ..data/labels

/etc/..6986_01_06_15_55_10.473583074:
total 8
drwxr-xr-x    2 0        0               80 Jun  1 19:55 .
drwxrwxrwt    3 0        0              120 Jun  1 19:55 ..
-rw-r--r--    1 0        0              129 Jun  1 19:55 annotations
-rw-r--r--    1 0        0               59 Jun  1 19:55 labels
/ #
```

The file `labels` is stored in a temporary directory (`..6986_01_06_15_55_10.473583074` in the example above) which is symlinked to by `..data`. Symlinks for annotations and labels in `/etc` point to files containing the actual metadata through the `..data` indirection.  This structure allows for dynamic atomic refresh of the metadata: updates are written to a new temporary directory, and the `..data` symlink is updated atomically using `rename(2)`.
