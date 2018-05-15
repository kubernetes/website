---
title: "Example: Deploying Cassandra with Stateful Sets"
reviewers:
- ahmetb
content_template: templates/tutorial
weight: 30
---

{{% capture overview %}}
This tutorial shows you how to develop a native cloud [Cassandra](http://cassandra.apache.org/) deployment on Kubernetes. In this instance, a custom Cassandra `SeedProvider` enables Cassandra to discover new Cassandra nodes as they join the cluster.

Deploying stateful distributed applications, like Cassandra, within a clustered environment can be challenging. StatefulSets greatly simplify this process. Please read about [StatefulSets](/docs/concepts/workloads/controllers/statefulset/)  for more information about the features used in this tutorial.

**Cassandra Docker**

The Pods use the [`gcr.io/google-samples/cassandra:v13`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile)
image from Google's [container registry](https://cloud.google.com/container-registry/docs/).
The docker image above is based on [debian-base](https://github.com/kubernetes/kubernetes/tree/master/build/debian-base) and includes OpenJDK 8. This image includes a standard Cassandra installation from the Apache Debian repo.  By using environment variables you can change values that are inserted into `cassandra.yaml`.

| ENV VAR       | DEFAULT VALUE  |
| ------------- |:-------------: |
| CASSANDRA_CLUSTER_NAME | 'Test Cluster'  |
| CASSANDRA_NUM_TOKENS  | 32               |
| CASSANDRA_RPC_ADDRESS | 0.0.0.0          |

{{% /capture %}}

{{% capture objectives %}}
* Create and Validate a Cassandra headless [Services](/docs/concepts/services-networking/service/).
* Use a [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) to create a Cassandra ring.
* Validate the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
* Modify the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
* Delete the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) and its [Pods](/docs/concepts/workloads/pods/pod/).
{{% /capture %}}

{{% capture prerequisites %}}
To complete this tutorial, you should already have a basic familiarity with [Pods](/docs/concepts/workloads/pods/pod/), [Services](/docs/concepts/services-networking/service/), and [StatefulSets](/docs/concepts/workloads/controllers/statefulset/). In addition, you should:

* [Install and Configure](/docs/tasks/tools/install-kubectl/) the `kubectl` command line

* Download [cassandra-service.yaml](/docs/tutorials/stateful-application/cassandra/cassandra-service.yaml) and [cassandra-statefulset.yaml](/docs/tutorials/stateful-application/cassandra/cassandra-statefulset.yaml)

* Have a supported Kubernetes Cluster running

{{< note >}}
**Note:** Please read the [getting started guides](/docs/setup/pick-right-solution/) if you do not already have a cluster.
{{< /note >}}

### Additional Minikube Setup Instructions

{{< caution >}}
**Caution:** [Minikube](/docs/getting-started-guides/minikube/) defaults to 1024MB of memory and 1 CPU which results in an insufficient resource errors during this tutorial. 
{{< /caution >}}

To avoid these errors, run minikube with:

    minikube start --memory 5120 --cpus=4
 
{{% /capture %}}

{{% capture lessoncontent %}}
## Creating a Cassandra Headless Service
A Kubernetes [Service](/docs/concepts/services-networking/service/) describes a set of [Pods](/docs/concepts/workloads/pods/pod/) that perform the same task. 

The following `Service` is used for DNS lookups between Cassandra Pods and clients within the Kubernetes Cluster.

1. Launch a terminal window in the directory you downloaded the manifest files.
2. Create a `Service` to track all Cassandra StatefulSet Nodes from the `cassandra-service.yaml` file:

       kubectl create -f cassandra-service.yaml

{{< code file="cassandra/cassandra-service.yaml" >}}

### Validating (optional)

Get the Cassandra `Service`.

    kubectl get svc cassandra

The response should be

    NAME        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    cassandra   None         <none>        9042/TCP   45s

If anything else returns, the service was not successfully created. Read [Debug Services](/docs/tasks/debug-application-cluster/debug-service/) for common issues.

## Using a StatefulSet to Create a Cassandra Ring

The StatefulSet manifest, included below, creates a Cassandra ring that consists of three Pods.

{{< note >}}
**Note:** This example uses the default provisioner for Minikube. Please update the following StatefulSet for the cloud you are working with.
{{< /note >}}

1. Update the StatefulSet if necessary.
2. Create the Cassandra StatefulSet from the `cassandra-statefulset.yaml` file:

       kubectl create -f cassandra-statefulset.yaml

{{< code file="cassandra/cassandra-statefulset.yaml" >}}

## Validating The Cassandra StatefulSet

1. Get the Cassandra StatefulSet:

       kubectl get statefulset cassandra

   The response should be

       NAME        DESIRED   CURRENT   AGE
       cassandra   3         0         13s

   The StatefulSet resource deploys Pods sequentially.  

2. Get the Pods to see the ordered creation status:

       kubectl get pods -l="app=cassandra"
       
   The response should be    
       
       NAME          READY     STATUS              RESTARTS   AGE
       cassandra-0   1/1       Running             0          1m
       cassandra-1   0/1       ContainerCreating   0          8s

   {{< note >}}
   **Note:** It can take up to ten minutes for all three Pods to deploy. 
   {{< /note >}}

    Once all Pods are deployed, the same command returns:

       NAME          READY     STATUS    RESTARTS   AGE
       cassandra-0   1/1       Running   0          10m
       cassandra-1   1/1       Running   0          9m
       cassandra-2   1/1       Running   0          8m

3. Run the Cassandra utility nodetool to display the status of the ring.

       kubectl exec cassandra-0 -- nodetool status

   The response is:

       Datacenter: DC1-K8Demo
       ======================
       Status=Up/Down
       |/ State=Normal/Leaving/Joining/Moving
       --  Address     Load       Tokens       Owns (effective)  Host ID                               Rack
       UN  172.17.0.5  83.57 KiB  32           74.0%             e2dd09e6-d9d3-477e-96c5-45094c08db0f  Rack1-K8Demo
       UN  172.17.0.4  101.04 KiB  32           58.8%             f89d6835-3a42-4419-92b3-0e62cae1479c  Rack1-K8Demo
       UN  172.17.0.6  84.74 KiB  32           67.1%             a6a1e8c2-3dc5-4417-b1a0-26507af2aaad  Rack1-K8Demo

## Modifying the Cassandra StatefulSet
Use `kubectl edit` to modify the size of a Cassandra StatefulSet. 

1. Run the following command:

       kubectl edit statefulset cassandra

   This command opens an editor in your terminal. The line you need to change is the `replicas` field.
   
   {{< note >}}
   **Note:** The following sample is an excerpt of the StatefulSet file.
   {{< /note >}}

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

2. Change the number of replicas to 4, and then save the manifest. 

   The StatefulSet now contains 4 Pods.

3. Get the Cassandra StatefulSet to verify:

       kubectl get statefulset cassandra

   The response should be

       NAME        DESIRED   CURRENT   AGE
       cassandra   4         4         36m
      
{{% /capture %}}

{{% capture cleanup %}}
Deleting or scaling a StatefulSet down does not delete the volumes associated with the StatefulSet. This ensures safety first: your data is more valuable than an auto purge of all related StatefulSet resources. 

{{< warning >}}
**Warning:** Depending on the storage class and reclaim policy, deleting the Persistent Volume Claims may cause the associated volumes to also be deleted. Never assume you’ll be able to access data if its volume claims are deleted.
{{< /warning >}}

1. Run the following commands to delete everything in a `StatefulSet`:

       grace=$(kubectl get po cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
         && kubectl delete statefulset -l app=cassandra \
         && echo "Sleeping $grace" \
         && sleep $grace \
         && kubectl delete pvc -l app=cassandra

2. Run the following command to delete the Cassandra `Service`.

       kubectl delete service -l app=cassandra

{{% /capture %}}

{{% capture whatsnext %}}
* Learn how to [Scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
* Learn more about the [KubernetesSeedProvider](https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)
* See more custom [Seed Provider Configurations](https://git.k8s.io/examples/cassandra/java/README.md)

{{% /capture %}}


