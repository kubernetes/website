---
title: Deploying Cassandra a StatefulSet
---

{% capture overview %}
This tutorial will show you how to develop a native cloud [Cassandra](http://cassandra.apache.org/) deployment on Kubernetes. In this instance, a custom Cassandra `SeedProvider` enables Cassandra to discover new Cassandra nodes as they join the cluster.
{% endcapture %}

{% capture objectives %}
* Create and Validate a Cassandra headless service.
* Use a StatefulSet to create a Cassandra ring.
* Validate the StatefulSet.
* Modify the StatefulSet.
* Delete the StatefulSet and its pods.
{% endcapture %}

{% capture prerequisites %}
You should already have a basic familiarity with [Pods](#), [Services](#), and [StatefulSets](#), but to complete this tutorial you only need: 

* To [Install and Configure](/docs/tasks/tools/install-kubectl/) the `kubectl` command line

* To have a v1.5 or later Kubernetes Cluster running

Check out the the [getting started guides](/docs/setup/pick-right-solution/) if you don’t already have a cluster. 

Warning: [Minikube](/docs/getting-started-guides/minikube/) defaults to 1024MB of memory and 1 CPU which results in an insufficient resource errors. 

To avoid these errors add the flags `--memory 5120` and `--cpus=4` to `minikube start`

```
minikube start --memory 5120 --cpus=4
``` 
* To download [cassandra-service.yaml](docs/tutorials/stateful-application/cassandra-service.yaml) and [cassandra-statefulset.yaml](/docs/tutorials/stateful-application/cassandra-statefulset.yaml)
{% endcapture %}

{% capture lessoncontent %}
## Creating a Cassandra Headless Service
A Kubernetes [Service](/docs/user-guide/services) describes a set of [Pods](/docs/user-guide/pods) that perform the same task. 

The following `Service` is used for DNS lookups between Cassandra pods and clients within the Kubernetes Cluster.

1. `cd` to the folder you saved the .yaml files.
2. Create a Service to track all Cassandra StatefulSet Nodes from the following .yaml file:

```shell
kubectl create -f cassandra-service.yaml
```

{% include code.html language="yaml" file="cassandra-service.yaml" ghlink="/docs/tutorials/stateful-application/cassandra-service.yaml" %}

### Validating (optional)

* Get the Cassandra `Service`.

```shell
kubectl get svc cassandra
```

The response should be

```console
NAME        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
cassandra   None         <none>        9042/TCP   45s
```

If anything else returns, the service was not successfully created. Check out [Debug Services](/docs/tasks/debug-application-cluster/debug-service/) for common issues.

## Using a StatefulSet to Create a Cassandra Ring

The StatefulSet manifest, included below, creates a Cassandra ring that consists
of three pods.

Note: This example uses the default provisioner for Minikube. Please update the following StatefulSet for the cloud you are working with. 

1. Update the StatefulSet if necessary.
2. Create the Cassandra StatefulSet from the following .yaml file:

```shell
kubectl create -f cassandra-statefulset.yaml
```

{% include code.html language="yaml" file="cassandra-statefulset.yaml" ghlink="/docs/tutorials/stateful-application/cassandra-statefulset.yaml" %}

## Validating The Cassandra StatefulSet

1. Get the Cassandra StatefulSet:

```shell
kubectl get statefulset cassandra
```

   The response should be

```console
NAME        DESIRED   CURRENT   AGE
cassandra   3         0         13s
```

   The StatefulSet resource deploys pods sequentially.  

{:start="2"}
2. Get the Pods to see the ordered creation status:

```shell
kubectl get pods -l="app=cassandra"
NAME          READY     STATUS              RESTARTS   AGE
cassandra-0   1/1       Running             0          1m
cassandra-1   0/1       ContainerCreating   0          8s
```

Note: It can take up to ten minutes for all three pods to deploy. 

Once all pods are deployed, the same command will return:

```shell
kubectl get pods -l="app=cassandra"
NAME          READY     STATUS    RESTARTS   AGE
cassandra-0   1/1       Running   0          10m
cassandra-1   1/1       Running   0          9m
cassandra-2   1/1       Running   0          8m
```

## Modifying the Cassandra StatefulSet
Use `kubectl edit` to modify the size of of a Cassandra StatefulSet. For more information, read [kubectl edit](#) 

1. Run the following command:
```shell
kubectl edit statefulset cassandra
```

   This command opens an editor in your terminal. The line you need to change is `Replicas`.

```console
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  creationTimestamp: 2016-08-13T18:40:58Z
  generation: 1
  labels:
    app: cassandra
  name: cassandra
  namespace: default
  resourceVersion: "323"
  selfLink: /apis/apps/v1beta1/namespaces/default/statefulsets/cassandra
  uid: 7a219483-6185-11e6-a910-42010a8a0fc0
spec:
  replicas: 3
```

{:start="2"}
2. Increase the number of replicas to 4, and then save the manifest. 

   The StatefulSet now contains 4 pods.

3. Get the Cassandra StatefulSet to verify:

```shell
kubectl get statefulset cassandra
```

  The response should be

```console
NAME        DESIRED   CURRENT   AGE
cassandra   4         4         36m
```
{% endcapture %}

{% capture cleanup %}
Deleting or scaling a StatefulSet down will not delete the volumes associated with the StatefulSet. This is done to ensure safety first, your data is more valuable than an auto purge of all related StatefulSet resources. 

Warning: Depending on the storage class and reclaim policy, deleting the Persistent Volume Claims may cause the associated volumes to also be deleted. Never assume you’ll be able to access data if its volume claims are deleted. 

* Run the following command to delete everything in a StatefulSet:

```shell
grace=$(kubectl get po cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
  && kubectl delete statefulset -l app=cassandra \
  && echo "Sleeping $grace" \
  && sleep $grace \
  && kubectl delete pvc -l app=cassandra
```

{% endcapture %}

{% capture whatsnext %}
* Learn how to [Scale a StatefullSet](/docs/tasks/run-application/scale-stateful-set/).
{% endcapture %}

{% include templates/tutorial.md %}


