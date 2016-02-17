---
title: "Getting started with config files."
---
In addition to the imperative style commands described [elsewhere](simple-nginx), Kubernetes
supports declarative YAML or JSON configuration files.  Often times config files are preferable
to imperative commands, since they can be checked into version control and changes to the files
can be code reviewed, producing a more robust, reliable and archival system.

### Running a container from a pod configuration file

```shell

$ cd kubernetes
$ kubectl create -f ./pod.yaml

```

Where pod.yaml contains something like:

<!-- BEGIN MUNGE: EXAMPLE pod.yaml -->

```yaml

apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80

```

[Download example](pod.yaml)
<!-- END MUNGE: EXAMPLE pod.yaml -->

You can see your cluster's pods:

```shell

$ kubectl get pods

```

and delete the pod you just created:

```shell

$ kubectl delete pods nginx

```

### Running a replicated set of containers from a configuration file

To run replicated containers, you need a [Replication Controller](replication-controller).
A replication controller is responsible for ensuring that a specific number of pods exist in the
cluster.

```shell

$ cd kubernetes
$ kubectl create -f ./replication.yaml

```

Where `replication.yaml` contains:

<!-- BEGIN MUNGE: EXAMPLE replication.yaml -->

```yaml

apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    app: nginx
  template:
    metadata:
      name: nginx
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80

```

[Download example](replication.yaml)
<!-- END MUNGE: EXAMPLE replication.yaml -->

To delete the replication controller (and the pods it created):

```shell

$ kubectl delete rc nginx

```



