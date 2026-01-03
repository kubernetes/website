---

title: " Kubernetes StatefulSets & DaemonSets Updates "
date: 2017-09-27
slug: kubernetes-statefulsets-daemonsets
url: /blog/2017/09/Kubernetes-Statefulsets-Daemonsets
author: >
   Janet Kuo (Google),
   Kenneth Owens (Kenneth Owens)
---

This post talks about recent updates to the [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) and [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) API objects for Kubernetes. We explore these features using [Apache ZooKeeper](https://zookeeper.apache.org/) and [Apache Kafka](https://kafka.apache.org/) StatefulSets and a [Prometheus node exporter](https://github.com/prometheus/node_exporter) DaemonSet.



In Kubernetes 1.6, we added the [RollingUpdate](/docs/tasks/manage-daemon/update-daemon-set/) update strategy to the DaemonSet API Object. Configuring your DaemonSets with the RollingUpdate strategy causes the DaemonSet controller to perform automated rolling updates to the Pods in your DaemonSets when their spec.template are updated.



In Kubernetes 1.7, we enhanced the DaemonSet controller to track a history of revisions to the PodTemplateSpecs of DaemonSets. This allows the DaemonSet controller to roll back an update. We also added the [RollingUpdate](/docs/concepts/workloads/controllers/statefulset/#update-strategies) strategy to the [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) API Object, and implemented revision history tracking for the StatefulSet controller. Additionally, we added the [Parallel](/docs/concepts/workloads/controllers/statefulset/#parallel-pod-management) pod management policy to support stateful applications that require Pods with unique identities but not ordered Pod creation and termination.

# StatefulSet rolling update and Pod management policy

First, we’re going to demonstrate how to use StatefulSet rolling updates and Pod management policies by deploying a ZooKeeper ensemble and a Kafka cluster.

## Prerequisites

To follow along, you’ll need to set up a Kubernetes 1.7 cluster with at least 3 schedulable nodes. Each node needs 1 CPU and 2 GiB of memory available. You will also need either a dynamic provisioner to allow the StatefulSet controller to provision 6 persistent volumes (PVs) with 10 GiB each, or you will need to manually provision the PVs prior to deploying the ZooKeeper ensemble or deploying the Kafka cluster.

## Deploying a ZooKeeper ensemble

Apache ZooKeeper is a strongly consistent, distributed system used by other distributed systems for cluster coordination and configuration management.



Note: You can create a ZooKeeper ensemble using this [zookeeper\_mini.yaml](https://kow3ns.github.io/kubernetes-zookeeper/manifests/zookeeper_mini.yaml) manifest. You can learn more about running a ZooKeeper ensemble on Kubernetes [here, as well as a](https://kow3ns.github.io/kubernetes-zookeeper/) more in-depth explanation of [the manifest and its contents.](https://kow3ns.github.io/kubernetes-zookeeper/manifests/)



When you apply the manifest, you will see output like the following.



```  
$ kubectl apply -f zookeeper\_mini.yaml

service "zk-hs" created

service "zk-cs" created

poddisruptionbudget "zk-pdb" created

statefulset "zk" created
 ```




The manifest creates an ensemble of three ZooKeeper servers using a StatefulSet, zk; a Headless Service, zk-hs, to control the domain of the ensemble; a Service, zk-cs, that clients can use to connect to the ready ZooKeeper instances; and a PodDisruptionBugdet, zk-pdb, that allows for one planned disruption. (Note that while this ensemble is suitable for demonstration purposes, it isn’t sized correctly for production use.)



If you use kubectl get to watch Pod creation in another terminal you will see that, in contrast to the [OrderedReady](/docs/concepts/workloads/controllers/statefulset/#orderedready-pod-management) strategy (the default policy that implements the full version of the StatefulSet guarantees), all of the Pods in the zk StatefulSet are created in parallel.



```  
$ kubectl get po -lapp=zk -w

NAME           READY         STATUS        RESTARTS     AGE


zk-0           0/1             Pending      0                   0s


zk-0           0/1             Pending     0                  0s


zk-1           0/1             Pending     0                  0s


zk-1           0/1             Pending     0                  0s


zk-0           0/1             ContainerCreating      0                  0s


zk-2           0/1             Pending      0                  0s


zk-1           0/1             ContainerCreating     0                  0s


zk-2           0/1             Pending      0                  0s


zk-2           0/1             ContainerCreating      0                  0s


zk-0           0/1             Running     0                  10s


zk-2           0/1             Running     0                  11s


zk-1           0/1             Running      0                  19s


zk-0           1/1             Running      0                  20s


zk-1           1/1             Running      0                  30s


zk-2           1/1             Running      0                  30s

 ```




This is because the zookeeper\_mini.yaml manifest sets the podManagementPolicy of the StatefulSet to Parallel.



```  
apiVersion: apps/v1beta1  
kind: StatefulSet  
metadata:  
   name: zk  

spec:  
   serviceName: zk-hs  

   replicas: 3  

   updateStrategy:  

       type: RollingUpdate  

   podManagementPolicy: Parallel  

 ...
 ```




Many distributed systems, like ZooKeeper, do not require ordered creation and termination for their processes. You can use the Parallel Pod management policy to accelerate the creation and deletion of StatefulSets that manage these systems. Note that, when Parallel Pod management is used, the StatefulSet controller will not block when it fails to create a Pod. Ordered, sequential Pod creation and termination is performed when a StatefulSet’s podManagementPolicy is set to   OrderedReady.


## Deploying a Kafka Cluster

Apache Kafka is a popular distributed streaming platform. Kafka producers write data to partitioned topics which are stored, with a configurable replication factor, on a cluster of brokers. Consumers consume the produced data from the partitions stored on the brokers.



Note: Details of the manifests contents can be found [here](https://kow3ns.github.io/kubernetes-kafka/manifests/). You can learn more about running a Kafka cluster on Kubernetes [here](https://kow3ns.github.io/kubernetes-kafka/).



To create a cluster, you only need to download and apply the [kafka\_mini.yaml](https://kow3ns.github.io/kubernetes-kafka/manifests/kafka_mini.yaml) manifest. When you apply the manifest, you will see output like the following:



```  
$ kubectl apply -f kafka\_mini.yaml

service "kafka-hs" created

poddisruptionbudget "kafka-pdb" created

statefulset "kafka" created
 ```




The manifest creates a three broker cluster using the kafka StatefulSet, a Headless Service, kafka-hs, to control the domain of the brokers; and a PodDisruptionBudget, kafka-pdb, that allows for one planned disruption. The brokers are configured to use the ZooKeeper ensemble we created above by connecting through the zk-cs Service. As with the ZooKeeper ensemble deployed above, this Kafka cluster is fine for demonstration purposes, but it’s probably not sized correctly for production use.



If you watch Pod creation, you will notice that, like the ZooKeeper ensemble created above, the Kafka cluster uses the Parallel podManagementPolicy.



```  
$ kubectl get po -lapp=kafka -w

NAME           READY         STATUS        RESTARTS     AGE


kafka-0     0/1             Pending      0                   0s


kafka-0     0/1             Pending      0                  0s


kafka-1     0/1             Pending      0                  0s


kafka-1     0/1             Pending      0                  0s


kafka-2     0/1             Pending      0                  0s


kafka-0     0/1             ContainerCreating     0                  0s


kafka-2     0/1             Pending      0                  0s


kafka-1     0/1             ContainerCreating     0                  0s


kafka-1     0/1             Running     0                  11s


kafka-0     0/1             Running     0                  19s


kafka-1     1/1             Running     0                  23s


kafka-0     1/1             Running     0                  32s

 ```

## Producing and consuming data

You can use kubectl run to execute the kafka-topics.sh script to create a topic named test.



```  
$ kubectl run -ti --image=gcr.io/google\_containers/kubernetes-kafka:1.0-10.2.1 createtopic --restart=Never --rm -- kafka-topics.sh --create \

\> --topic test \

\> --zookeeper zk-cs.default.svc.cluster.local:2181 \

\> --partitions 1 \

\> --replication-factor 3
 ```




Now you can use kubectl run to execute the kafka-console-consumer.sh command to listen for messages.



```  
$ kubectl run -ti --image=gcr.io/google\_containers/kubnetes-kafka:1.0-10.2.1 consume --restart=Never --rm -- kafka-console-consumer.sh --topic test --bootstrap-server kafka-0.kafka-hs.default.svc.cluster.local:9093
 ```




In another terminal, you can run the kafka-console-producer.sh command.



```  
$kubectl run -ti --image=gcr.io/google\_containers/kubernetes-kafka:1.0-10.2.1 produce --restart=Never --rm \

\>   -- kafka-console-producer.sh --topic test --broker-list kafka-0.kafka-hs.default.svc.cluster.local:9093,kafka-1.kafka-hs.default.svc.cluster.local:9093,kafka-2.kafka-hs.default.svc.cluster.local:9093

 ```




Output from the second terminal appears in the first terminal. If you continue to produce and consume messages while updating the cluster, you will notice that no messages are lost. You may see error messages as the leader for the partition changes when individual brokers are updated, but the client retries until the message is committed. This is due to the ordered, sequential nature of StatefulSet rolling updates which we will explore further in the next section.



Updating the Kafka cluster

StatefulSet updates are like DaemonSet updates in that they are both configured by setting the spec.updateStrategy of the corresponding API object. When the update strategy is set to OnDelete, the respective controllers will only create new Pods when a Pod in the StatefulSet or DaemonSet has been deleted. When the update strategy is set to RollingUpdate, the controllers will delete and recreate Pods when a modification is made to the spec.template field of a DaemonSet or StatefulSet. You can use rolling updates to change the configuration (via environment variables or command line parameters), resource requests, resource limits, container images, labels, and/or annotations of the Pods in a StatefulSet or DaemonSet. Note that all updates are destructive, always requiring that each Pod in the DaemonSet or StatefulSet be destroyed and recreated. StatefulSet rolling updates differ from DaemonSet rolling updates in that Pod termination and creation is ordered and sequential.



You can patch the kafka StatefulSet to reduce the CPU resource request to 250m.



```  
$ kubectl patch sts kafka --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/requests/cpu", "value":"250m"}]'

statefulset "kafka" patched
 ```




If you watch the status of the Pods in the StatefulSet, you will see that each Pod is deleted and recreated in reverse ordinal order (starting with the Pod with the largest ordinal and progressing to the smallest). The controller waits for each updated Pod to be running and ready before updating the subsequent Pod.



```  
$kubectl get po -lapp=kafka -w

NAME           READY         STATUS       RESTARTS     AGE


kafka-0     1/1             Running     0                   13m


kafka-1     1/1             Running     0                   13m


kafka-2     1/1             Running     0                   13m


kafka-2     1/1             Terminating     0                 14m


kafka-2     0/1             Terminating     0                 14m


kafka-2     0/1             Terminating     0                 14m


kafka-2     0/1             Terminating     0                 14m


kafka-2     0/1             Pending     0                 0s


kafka-2     0/1             Pending     0                 0s


kafka-2     0/1             ContainerCreating     0                 0s


kafka-2     0/1             Running     0                 10s


kafka-2     1/1             Running     0                 21s


kafka-1     1/1             Terminating     0                 14m


kafka-1     0/1             Terminating     0                 14m


kafka-1     0/1             Terminating     0                 14m


kafka-1     0/1             Terminating     0                 14m


kafka-1     0/1             Pending     0                 0s


kafka-1     0/1             Pending     0                 0s


kafka-1     0/1             ContainerCreating     0                 0s


kafka-1     0/1             Running     0                 11s


kafka-1     1/1             Running     0                 21s


kafka-0     1/1             Terminating     0                 14m


kafka-0     0/1             Terminating     0                 14m


kafka-0     0/1             Terminating     0                 14m


kafka-0     0/1             Terminating     0                 14m


kafka-0     0/1             Pending     0                 0s


kafka-0     0/1             Pending     0                 0s


kafka-0     0/1             ContainerCreating     0                 0s


kafka-0     0/1             Running     0                 10s


kafka-0     1/1             Running     0                 22s

 ```




Note that unplanned disruptions will not lead to unintentional updates during the update process. That is, the StatefulSet controller will always recreate the Pod at the correct version to ensure the ordering of the update is preserved. If a Pod is deleted, and if it has already been updated, it will be created from   the updated version of the StatefulSet’s spec.template. If the Pod has not already been updated, it will be created from the previous version of the StatefulSet’s spec.template. We will explore this further in the following sections.


## Staging an update

Depending on how your organization handles deployments and configuration modifications, you may want or need to stage updates to a StatefulSet prior to allowing the roll out to progress. You can accomplish this by setting a partition for the RollingUpdate. When the StatefulSet controller detects a partition in the updateStrategy of a StatefulSet, it will only apply the updated version of the StatefulSet’s spec.template to Pods whose ordinal is greater than or equal to the value of the partition.



You can patch the kafka StatefulSet to add a partition to the RollingUpdate update strategy. If you set the partition to a number greater than or equal to the StatefulSet’s spec.replicas (as below), any subsequent updates you perform to the StatefulSet’s spec.template will be staged for roll out, but the StatefulSet controller will not start a rolling update.



```  
$ kubectl patch sts kafka -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":3}}}}'

statefulset "kafka" patched
 ```




If you patch the StatefulSet to set the requested CPU to 0.3, you will notice that none of the Pods are updated.



```  
$ kubectl patch sts kafka --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/requests/cpu", "value":"0.3"}]'

statefulset "kafka" patched
 ```




Even if you delete a Pod and wait for the StatefulSet controller to recreate it, you will notice that the Pod is recreated with current CPU request.



```  
$   kubectl delete po kafka-1


pod "kafka-1" deleted


$ kubectl get po kafka-1 -w

NAME           READY         STATUS                           RESTARTS     AGE


kafka-1     0/1             ContainerCreating     0                   10s


kafka-1     0/1             Running     0                 19s


kafka-1     1/1             Running     0                 21s



$ kubectl get po kafka-1 -o yaml

apiVersion: v1

kind: Pod

metadata:

   ...


       resources:


           requests:


               cpu: 250m


               memory: 1Gi

 ```

## Rolling out a canary

Often, we want to verify an image update or configuration change on a single instance of an application before rolling it out globally. If you modify the partition created above to be 2, the StatefulSet controller will roll out a [canary](http://whatis.techtarget.com/definition/canary-canary-testing) that can be used to verify that the update is working as intended.



```  
$ kubectl patch sts kafka -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'

statefulset "kafka" patched
 ```




You can watch the StatefulSet controller update the kafka-2 Pod and pause after the update is complete.



```  
$   kubectl get po -lapp=kafka -w


NAME           READY         STATUS       RESTARTS     AGE


kafka-0     1/1             Running     0                   50m


kafka-1     1/1             Running     0                   10m


kafka-2     1/1             Running     0                   29s


kafka-2     1/1             Terminating     0                 34s


kafka-2     0/1             Terminating     0                 38s


kafka-2     0/1             Terminating     0                 39s


kafka-2     0/1             Terminating     0                 39s


kafka-2     0/1             Pending     0                 0s


kafka-2     0/1             Pending     0                 0s


kafka-2     0/1             Terminating     0                 20s


kafka-2     0/1             Terminating     0                 20s


kafka-2     0/1             Pending     0                 0s


kafka-2     0/1             Pending     0                 0s


kafka-2     0/1             ContainerCreating     0                 0s


kafka-2     0/1             Running     0                 19s


kafka-2     1/1             Running     0                 22s

 ```

## Phased roll outs

Similar to rolling out a canary, you can roll out updates based on a phased progression (e.g. linear, geometric, or exponential roll outs).



If you patch the kafka StatefulSet to set the partition to 1, the StatefulSet controller updates one more broker.



```  
$ kubectl patch sts kafka -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":1}}}}'

statefulset "kafka" patched
 ```




If you set it to 0, the StatefulSet controller updates the final broker and completes the update.



```  
$ kubectl patch sts kafka -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":0}}}}'

statefulset "kafka" patched
 ```




Note that you don’t have to decrement the partition by one. For a larger StatefulSet--for example, one with 100 replicas--you might use a progression more like 100, 99, 90, 50, 0. In this case, you would stage your update, deploy a canary, roll out to 10 instances, update fifty percent of the Pods, and then complete the update.

## Cleaning up

To delete the API Objects created above, you can use kubectl delete on the two manifests you used to create the ZooKeeper ensemble and the Kafka cluster.



```  
$ kubectl delete -f kafka\_mini.yaml

service "kafka-hs" deleted

poddisruptionbudget "kafka-pdb" deleted

Statefulset “kafka” deleted


$ kubectl delete -f zookeeper\_mini.yaml

service "zk-hs" deleted

service "zk-cs" deleted

poddisruptionbudget "zk-pdb" deleted

statefulset "zk" deleted
 ```




By design, the StatefulSet controller does not delete any persistent volume claims (PVCs): the PVCs created for the ZooKeeper ensemble and the Kafka cluster must be manually deleted. Depending on the storage reclamation policy of your cluster, you many also need to manually delete the backing PVs.

# DaemonSet rolling update, history, and rollback

In this section, we’re going to show you how to perform a rolling update on a DaemonSet, look at its history, and then perform a rollback after a bad rollout. We will use a DaemonSet to deploy a [Prometheus node exporter](https://github.com/prometheus/node_exporter) on each Kubernetes node in the cluster. These node exporters export node metrics to the Prometheus monitoring system. For the sake of simplicity, we’ve omitted the installation of the [Prometheus server](https://github.com/prometheus/prometheus) and the service for [communication with DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/#communicating-with-daemon-pods) from this blogpost.

## Prerequisites

To follow along with this section of the blog, you need a working Kubernetes 1.7 cluster and kubectl version 1.7 or later. If you followed along with the first section, you can use the same cluster.

## DaemonSet rolling upFirst, prepare the node exporter DaemonSet manifest to run a v0.13 Prometheus node exporter on every node in the cluster:



```  
$ cat \>\> node-exporter-v0.13.yaml \<\<EOF

apiVersion: extensions/v1beta1  
kind: DaemonSet  
metadata:  
   name: node-exporter  

spec:  
   updateStrategy:  

       type: RollingUpdate  

   template:  

       metadata:  

           labels:  

               app: node-exporter  

           name: node-exporter  

       spec:  

           containers:  

           - image: prom/node-exporter:v0.13.0  

               name: node-exporter  

               ports:  

               - containerPort: 9100  

                   hostPort: 9100  

                   name: scrape  

           hostNetwork: true  

           hostPID: true


EOF
 ```




Note that you need to enable the DaemonSet rolling update feature by explicitly setting DaemonSet .spec.updateStrategy.type to RollingUpdate.



Apply the manifest to create the node exporter DaemonSet:



```  
$ kubectl apply -f node-exporter-v0.13.yaml --record

daemonset "node-exporter" created
 ```




Wait for the first DaemonSet rollout to complete:



```  
$ kubectl rollout status ds node-exporter  
daemon set "node-exporter" successfully rolled out
 ```




You should see each of your node runs one copy of the node exporter pod:



```  
$ kubectl get pods -l app=node-exporter -o wide
 ```




To perform a rolling update on the node exporter DaemonSet, prepare a manifest that includes the v0.14 Prometheus node exporter:



```  
$ cat node-exporter-v0.13.yaml ```  sed "s/v0.13.0/v0.14.0/g" \> node-exporter-v0.14.yaml
 ```




Then apply the v0.14 node exporter DaemonSet:



```  
$ kubectl apply -f node-exporter-v0.14.yaml --record

daemonset "node-exporter" configured
 ```




Wait for the DaemonSet rolling update to complete:



```  
$ kubectl rollout status ds node-exporter

...

Waiting for rollout to finish: 3 out of 4 new pods have been updated...  
Waiting for rollout to finish: 3 of 4 updated pods are available...  
daemon set "node-exporter" successfully rolled out
 ```




We just triggered a DaemonSet rolling update by updating the DaemonSet template. By default, one old DaemonSet pod will be killed and one new DaemonSet pod will be created at a time.



Now we’ll cause a rollout to fail by updating the image to an invalid value:



```  
$ cat node-exporter-v0.13.yaml | sed "s/v0.13.0/bad/g" \> node-exporter-bad.yaml


$ kubectl apply -f node-exporter-bad.yaml --record

daemonset "node-exporter" configured
 ```




Notice that the rollout never finishes:



```  
$ kubectl rollout status ds node-exporter   
Waiting for rollout to finish: 0 out of 4 new pods have been updated...  
Waiting for rollout to finish: 1 out of 4 new pods have been updated…

# Use ^C to exit
 ```




This behavior is expected. We mentioned earlier that a DaemonSet rolling update kills and creates one pod at a time. Because the new pod never becomes available, the rollout is halted, preventing the invalid specification from propagating to more than one node. StatefulSet rolling updates implement the same behavior with respect to failed deployments. Unsuccessful updates are blocked until it corrected via roll back or by rolling forward with a specification.



```  
$ kubectl get pods -l app=node-exporter

NAME                                   READY         STATUS                 RESTARTS     AGE


node-exporter-f2n14     0/1             ErrImagePull     0                   3m


...


# N = number of nodes

$ kubectl get ds node-exporter  
NAME                       DESIRED     CURRENT     READY         UP-TO-DATE     AVAILABLE     NODE SELECTOR     AGE  

node-exporter     N                 N                 N-1             1                       N                     \<none\>                   46m

 ```




## DaemonSet history, rollbacks, and rolling forward

Next,   perform a rollback. Take a look at the node exporter DaemonSet rollout history:




```  
$ kubectl rollout history ds node-exporter   
daemonsets "node-exporter"  
REVISION               CHANGE-CAUSE  

1                             kubectl apply --filename=node-exporter-v0.13.yaml --record=true  

2                             kubectl apply --filename=node-exporter-v0.14.yaml --record=true


3                             kubectl apply --filename=node-exporter-bad.yaml --record=true

 ```




Check the details of the revision you want to roll back to:



```  
$ kubectl rollout history ds node-exporter --revision=2  
daemonsets "node-exporter" with revision #2  
Pod Template:  
   Labels:             app=node-exporter  

   Containers:  

     node-exporter:  

       Image:           prom/node-exporter:v0.14.0  

       Port:             9100/TCP  

       Environment:               \<none\>  

       Mounts:         \<none\>  

   Volumes:           \<none\>

 ```




You can quickly roll back to any DaemonSet revision you found through kubectl rollout history:



```  
# Roll back to the last revision

$ kubectl rollout undo ds node-exporter   
daemonset "node-exporter" rolled back


# Or use --to-revision to roll back to a specific revision

$ kubectl rollout undo ds node-exporter --to-revision=2  
daemonset "node-exporter" rolled back
 ```




A DaemonSet rollback is done by rolling forward. Therefore, after the rollback, DaemonSet revision 2 becomes revision 4 (current revision):



```  
$ kubectl rollout history ds node-exporter   
daemonsets "node-exporter"  
REVISION               CHANGE-CAUSE  

1                             kubectl apply --filename=node-exporter-v0.13.yaml --record=true  

3                             kubectl apply --filename=node-exporter-bad.yaml --record=true  

4                             kubectl apply --filename=node-exporter-v0.14.yaml --record=true

 ```




The node exporter DaemonSet is now healthy again:



```  
$ kubectl rollout status ds node-exporter  
daemon set "node-exporter" successfully rolled out


# N = number of nodes

$ kubectl get ds node-exporter

NAME                       DESIRED     CURRENT     READY         UP-TO-DATE     AVAILABLE     NODE SELECTOR     AGE  

node-exporter     N                 N                 N                 N                       N                     \<none\>                   46m

 ```




If current DaemonSet revision is specified while performing a rollback, the rollback is skipped:



```  
$ kubectl rollout undo ds node-exporter --to-revision=4  
daemonset "node-exporter" skipped rollback (current template already matches revision 4)
 ```




You will see this complaint from kubectl if the DaemonSet revision is not found:



```  
$ kubectl rollout undo ds node-exporter --to-revision=10  
error: unable to find specified revision 10 in history
 ```




Note that kubectl rollout history and kubectl rollout status support StatefulSets, too!

## Cleaning up

```  
$ kubectl delete ds node-exporter
 ```




# What’s next for DaemonSet and StatefulSet

Rolling updates and roll backs close an important feature gap for DaemonSets and StatefulSets. As we plan for Kubernetes 1.8, we want to continue to focus on advancing the core controllers to GA. This likely means that some advanced feature requests (e.g. automatic roll back, infant mortality detection) will be deferred in favor of ensuring the consistency, usability, and stability of the core controllers. We welcome feedback and contributions, so please feel free to reach out on [Slack](http://slack.k8s.io/), to ask questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes), or open issues or pull requests on [GitHub](https://github.com/kubernetes/kubernetes).



- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/)
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
