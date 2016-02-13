---
title: "Getting started with config files."
---
In addition to the imperative style commands described [elsewhere](simple-nginx), Kubernetes
supports declarative YAML or JSON configuration files.  Often times config files are preferable
to imperative commands, since they can be checked into version control and changes to the files
can be code reviewed, producing a more robust, reliable and archival system.

### Running a container from a pod configuration file

{% highlight console %}

$ cd kubernetes
$ kubectl create -f ./pod.yaml

{% endhighlight %}

Where pod.yaml contains something like:

<!-- BEGIN MUNGE: EXAMPLE pod.yaml -->

{% highlight yaml %}

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

{% endhighlight %}

[Download example](pod.yaml)
<!-- END MUNGE: EXAMPLE pod.yaml -->

You can see your cluster's pods:

{% highlight console %}

$ kubectl get pods

{% endhighlight %}

and delete the pod you just created:

{% highlight console %}

$ kubectl delete pods nginx

{% endhighlight %}

### Running a replicated set of containers from a configuration file

To run replicated containers, you need a [Replication Controller](replication-controller).
A replication controller is responsible for ensuring that a specific number of pods exist in the
cluster.

{% highlight console %}

$ cd kubernetes
$ kubectl create -f ./replication.yaml

{% endhighlight %}

Where `replication.yaml` contains:

<!-- BEGIN MUNGE: EXAMPLE replication.yaml -->

{% highlight yaml %}

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

{% endhighlight %}

[Download example](replication.yaml)
<!-- END MUNGE: EXAMPLE replication.yaml -->

To delete the replication controller (and the pods it created):

{% highlight console %}

$ kubectl delete rc nginx

{% endhighlight %}



