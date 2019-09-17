---
title: "Example: Deploying Cassandra with Stateful Sets"
reviewers:
- ahmetb
content_template: templates/tutorial
weight: 30
---

{{% capture overview %}}
This tutorial shows you how to develop a native cloud [Cassandra](http://cassandra.apache.org/) deployment on Kubernetes. In this example, a custom Cassandra *SeedProvider* enables Cassandra to discover new Cassandra nodes as they join the cluster.

*StatefulSets* make it easier to deploy stateful applications within a clustered environment. For more information on the features used in this tutorial, see the [*StatefulSet*](/docs/concepts/workloads/controllers/statefulset/) documentation.

**Cassandra on Docker**

The *Pods* in this tutorial use the [`gcr.io/google-samples/cassandra:v13`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile)
image from Google's [container registry](https://cloud.google.com/container-registry/docs/).
The Docker image above is based on [debian-base](https://github.com/kubernetes/kubernetes/tree/master/build/debian-base)
and includes OpenJDK 8.

This image includes a standard Cassandra installation from the Apache Debian repo.
By using environment variables you can change values that are inserted into `cassandra.yaml`.

| ENV VAR       | DEFAULT VALUE  |
| ------------- |:-------------: |
| `CASSANDRA_CLUSTER_NAME` | `'Test Cluster'`  |
| `CASSANDRA_NUM_TOKENS`  | `32`               |
| `CASSANDRA_RPC_ADDRESS` | `0.0.0.0`          |

{{% /capture %}}

{{% capture objectives %}}
* Create and validate a Cassandra headless [*Service*](/docs/concepts/services-networking/service/).
* Use a [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) to create a Cassandra ring.
* Validate the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
* Modify the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
* Delete the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) and its [Pods](/docs/concepts/workloads/pods/pod/).
{{% /capture %}}

{{% capture prerequisites %}}
To complete this tutorial, you should already have a basic familiarity with [Pods](/docs/concepts/workloads/pods/pod/), [Services](/docs/concepts/services-networking/service/), and [StatefulSets](/docs/concepts/workloads/controllers/statefulset/). In addition, you should:

* [Install and Configure](/docs/tasks/tools/install-kubectl/) the *kubectl* command-line tool

* Download [`cassandra-service.yaml`](/examples/application/cassandra/cassandra-service.yaml)
  and [`cassandra-statefulset.yaml`](/examples/application/cassandra/cassandra-statefulset.yaml)

* Have a supported Kubernetes cluster running

{{< note >}}
Please read the [setup](/docs/setup/) if you do not already have a cluster.
{{< /note >}}

### Additional Minikube Setup Instructions

{{< caution >}}
[Minikube](/docs/getting-started-guides/minikube/) defaults to 1024MB of memory and 1 CPU. Running Minikube with the default resource configuration results in insufficient resource errors during this tutorial. To avoid these errors, start Minikube with the following settings:

```shell
minikube start --memory 5120 --cpus=4
```
{{< /caution >}}
 
{{% /capture %}}

{{% capture lessoncontent %}}
## Creating a Cassandra Headless Service

A Kubernetes [Service](/docs/concepts/services-networking/service/) describes a set of [Pods](/docs/concepts/workloads/pods/pod/) that perform the same task. 

The following `Service` is used for DNS lookups between Cassandra Pods and clients within the Kubernetes cluster.

{{< codenew file="application/cassandra/cassandra-service.yaml" >}}

1. Launch a terminal window in the directory you downloaded the manifest files.
1. Create a Service to track all Cassandra StatefulSet nodes from the `cassandra-service.yaml` file:

    ```shell
    kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-service.yaml
    ```

### Validating (optional)

Get the Cassandra Service.

```shell
kubectl get svc cassandra
```

The response is

```
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
cassandra   ClusterIP   None         <none>        9042/TCP   45s
```

Service creation failed if anything else is returned. Read [Debug Services](/docs/tasks/debug-application-cluster/debug-service/) for common issues.

## Using a StatefulSet to Create a Cassandra Ring

The StatefulSet manifest, included below, creates a Cassandra ring that consists of three Pods.

{{< note >}}
This example uses the default provisioner for Minikube. Please update the following StatefulSet for the cloud you are working with.
{{< /note >}}

{{< codenew file="application/cassandra/cassandra-statefulset.yaml" >}}

1. Update the StatefulSet if necessary.
1. Create the Cassandra StatefulSet from the `cassandra-statefulset.yaml` file:

    ```shell
    kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml
    ```

## Validating The Cassandra StatefulSet

1. Get the Cassandra StatefulSet:

    ```shell
    kubectl get statefulset cassandra
    ```

    The response should be:

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   3         0         13s
    ```

    The `StatefulSet` resource deploys Pods sequentially.  

1. Get the Pods to see the ordered creation status:

    ```shell
    kubectl get pods -l="app=cassandra"
    ```
       
    The response should be:
       
    ```shell
    NAME          READY     STATUS              RESTARTS   AGE
    cassandra-0   1/1       Running             0          1m
    cassandra-1   0/1       ContainerCreating   0          8s
    ```
    
    It can take several minutes for all three Pods to deploy. Once they are deployed, the same command returns:
    
    ```
    NAME          READY     STATUS    RESTARTS   AGE
    cassandra-0   1/1       Running   0          10m
    cassandra-1   1/1       Running   0          9m
    cassandra-2   1/1       Running   0          8m
    ```

3. Run the Cassandra [nodetool](https://wiki.apache.org/cassandra/NodeTool) to display the status of the ring.

    ```shell
    kubectl exec -it cassandra-0 -- nodetool status
    ```

    The response should look something like this:

    ```
    Datacenter: DC1-K8Demo
    ======================
    Status=Up/Down
    |/ State=Normal/Leaving/Joining/Moving
    --  Address     Load       Tokens       Owns (effective)  Host ID                               Rack
    UN  172.17.0.5  83.57 KiB  32           74.0%             e2dd09e6-d9d3-477e-96c5-45094c08db0f  Rack1-K8Demo
    UN  172.17.0.4  101.04 KiB  32           58.8%             f89d6835-3a42-4419-92b3-0e62cae1479c  Rack1-K8Demo
    UN  172.17.0.6  84.74 KiB  32           67.1%             a6a1e8c2-3dc5-4417-b1a0-26507af2aaad  Rack1-K8Demo
    ```

## Modifying the Cassandra StatefulSet

Use `kubectl edit` to modify the size of a Cassandra StatefulSet. 

1. Run the following command:

    ```shell
    kubectl edit statefulset cassandra
    ```

    This command opens an editor in your terminal. The line you need to change is the `replicas` field. The following sample is an excerpt of the `StatefulSet` file:

    ```yaml
    # Please edit the object below. Lines beginning with a '#' will be ignored,
    # and an empty file will abort the edit. If an error occurs while saving this file will be
    # reopened with the relevant failures.
    #
    apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
    kind: StatefulSet
    metadata:
      creationTimestamp: 2016-08-13T18:40:58Z
      generation: 1
      labels:
      app: cassandra
      name: cassandra
      namespace: default
      resourceVersion: "323"
      selfLink: /apis/apps/v1/namespaces/default/statefulsets/cassandra
      uid: 7a219483-6185-11e6-a910-42010a8a0fc0
    spec:
      replicas: 3
    ```

1. Change the number of replicas to 4, and then save the manifest. 

    The `StatefulSet` now contains 4 Pods.

1. Get the Cassandra StatefulSet to verify:

    ```shell
    kubectl get statefulset cassandra
    ```

    The response should be

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   4         4         36m
    ```
      
{{% /capture %}}

{{% capture cleanup %}}
Deleting or scaling a StatefulSet down does not delete the volumes associated with the StatefulSet. This setting is for your safety because your data is more valuable than automatically purging all related StatefulSet resources. 

{{< warning >}}
Depending on the storage class and reclaim policy, deleting the *PersistentVolumeClaims* may cause the associated volumes to also be deleted. Never assume you’ll be able to access data if its volume claims are deleted.
{{< /warning >}}

1. Run the following commands (chained together into a single command) to delete everything in the Cassandra `StatefulSet`:

    ```shell
    grace=$(kubectl get po cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
      && kubectl delete statefulset -l app=cassandra \
      && echo "Sleeping $grace" \
      && sleep $grace \
      && kubectl delete pvc -l app=cassandra
    ```

1. Run the following command to delete the Cassandra Service.

    ```shell
    kubectl delete service -l app=cassandra
    ```

{{% /capture %}}

{{% capture whatsnext %}}

* Learn how to [Scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
* Learn more about the [*KubernetesSeedProvider*](https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)
* See more custom [Seed Provider Configurations](https://git.k8s.io/examples/cassandra/java/README.md)

{{% /capture %}}

