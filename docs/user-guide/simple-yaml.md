---
---

In addition to the imperative style commands described [elsewhere](/docs/user-guide/simple-nginx), Kubernetes
supports declarative YAML or JSON configuration files.  Often times config files are preferable
to imperative commands, since they can be checked into version control and changes to the files
can be code reviewed, producing a more robust, reliable and archival system.

### Running a container from a pod configuration file

```shell
$ cd kubernetes
$ kubectl create -f ./pod.yaml
```

Where pod.yaml contains something like:

{% include code.html language="yaml" file="pod.yaml" ghlink="/docs/user-guide/pod.yaml" %}

You can see your cluster's pods:

```shell
$ kubectl get pods
```

and delete the pod you just created:

```shell
$ kubectl delete pods nginx
```

### Running a replicated set of containers from a configuration file

To run replicated containers, you need a [Replication Controller](/docs/user-guide/replication-controller).
A replication controller is responsible for ensuring that a specific number of pods exist in the
cluster.

```shell
$ cd kubernetes
$ kubectl create -f ./replication.yaml
```

Where `replication.yaml` contains:

{% include code.html language="yaml" file="replication.yaml" ghlink="/docs/user-guide/replication.yaml" %}

To delete the replication controller (and the pods it created):

```shell
$ kubectl delete rc nginx
```