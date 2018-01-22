---
layout: blog
title: " Autoscaling in Kubernetes "
date:  Wednesday, July 12, 2016 

---
_Editor’s note: this post is part of a [series of in-depth articles](http://blog.kubernetes.io/2016/07/five-days-of-kubernetes-1.3.html) on what's new in Kubernetes 1.3_  
  
Customers using Kubernetes respond to end user requests quickly and ship software faster than ever before. But what happens when you build a service that is even more popular than you planned for, and run out of compute? In [Kubernetes 1.3](http://blog.kubernetes.io/2016/07/kubernetes-1.3-bridging-cloud-native-and-enterprise-workloads.html), we are proud to announce that we have a solution: autoscaling. On [Google Compute Engine](https://cloud.google.com/compute/) (GCE) and [Google Container Engine](https://cloud.google.com/container-engine/) (GKE) (and coming soon on [AWS](https://aws.amazon.com/)), Kubernetes will automatically scale up your cluster as soon as you need it, and scale it back down to save you money when you don’t.  
  

### **Benefits of Autoscaling**
  
To understand better where autoscaling would provide the most value, let’s start with an example. Imagine you have a 24/7 production service with a load that is variable in time, where it is very busy during the day in the US, and relatively low at night. Ideally, we would want the number of nodes in the cluster and the number of pods in deployment to dynamically adjust to the load to meet end user demand. The new Cluster Autoscaling feature together with Horizontal Pod Autoscaler can handle this for you automatically.  
  

### Setting Up Autoscaling on GCE
  
The following instructions apply to GCE. For GKE please check the autoscaling section in cluster operations manual available [here](https://cloud.google.com/container-engine/docs/clusters/operations#create_a_cluster_with_autoscaling).  
  
Before we begin, we need to have an active GCE project with Google Cloud Monitoring, Google Cloud Logging and Stackdriver enabled. For more information on project creation, please read our [Getting Started Guide](https://github.com/kubernetes/kubernetes/blob/master/docs/getting-started-guides/gce.md#prerequisites). We also need to download a recent version of Kubernetes project (version [v1.3.0](http://v1.3.0/) or later).  
  
First, we set up a cluster with Cluster Autoscaler turned on. The number of nodes in the cluster will start at 2, and autoscale up to a maximum of 5. To implement this, we’ll export the following environment variables:  

  

  

| 
export NUM\_NODES=2

export KUBE\_AUTOSCALER\_MIN\_NODES=2

export KUBE\_AUTOSCALER\_MAX\_NODES=5

export KUBE\_ENABLE\_CLUSTER\_AUTOSCALER=true
 |

  
and start the cluster by running:

  

| 
./cluster/kube-up.sh 
 |

  

The kube-up.sh script creates a cluster together with Cluster Autoscaler add-on. The autoscaler will try to add new nodes to the cluster if there are pending pods which could schedule on a new node.

  

Let’s see our cluster, it should have two nodes:

  
  

| 
$ kubectl get nodes 

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AGE

kubernetes-master &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready,SchedulingDisabled &nbsp;&nbsp;2m

kubernetes-minion-group-de5q &nbsp;&nbsp;Ready &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2m

kubernetes-minion-group-yhdx &nbsp;&nbsp;Ready &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1m 
 |

  

#### **Run & Expose PHP-Apache Server**

  

To demonstrate autoscaling we will use a custom docker image based on php-apache server. The image can be found [here](https://github.com/kubernetes/kubernetes/blob/8caeec429ee1d2a9df7b7a41b21c626346b456fb/docs/user-guide/horizontal-pod-autoscaling/image). It defines [index.php](https://github.com/kubernetes/kubernetes/blob/8caeec429ee1d2a9df7b7a41b21c626346b456fb/docs/user-guide/horizontal-pod-autoscaling/image/index.php) page which performs some CPU intensive computations.

  

First, we’ll start a deployment running the image and expose it as a service:

  
  

| 
$ kubectl run php-apache \ &nbsp;&nbsp;

 &nbsp;--image=gcr.io/google\_containers/hpa-example \

 &nbsp;--requests=cpu=500m,memory=500M --expose --port=80  

service "php-apache" createddeployment "php-apache" created |

  

  

Now, we will wait some time and verify that both the deployment and the service were correctly created and are running:

  

  

| 
$ kubectl get deployment

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DESIRED &nbsp;&nbsp;CURRENT &nbsp;&nbsp;UP-TO-DATE &nbsp;&nbsp;AVAILABLE &nbsp;&nbsp;AGE

php-apache &nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;49s
  
  

$ kubectl get pods  
NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY &nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;RESTARTS &nbsp;&nbsp;AGE

php-apache-2046965998-z65jn &nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30s
 |

  

  

We may now check that php-apache server works correctly by calling wget with the service's address:

  

  

| 
$ kubectl run -i --tty service-test --image=busybox /bin/sh  
Hit enter for command prompt  
$ wget -q -O- http://php-apache.default.svc.cluster.local

OK!
 |

  

#### Starting Horizontal Pod Autoscaler

  
Now that the deployment is running, we will create a Horizontal Pod Autoscaler for it. To create it, we will use kubectl autoscale command, which looks like this:

  

  

| 
$ kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
 |

  

  

This defines a Horizontal Ppod Autoscaler that maintains between 1 and 10 replicas of the Pods controlled by the php-apache deployment we created in the first step of these instructions. Roughly speaking, the horizontal autoscaler will increase and decrease the number of replicas (via the deployment) so as to maintain an average CPU utilization across all Pods of 50% (since each pod requests 500 milli-cores by [kubectl run](https://github.com/kubernetes/kubernetes/blob/8caeec429ee1d2a9df7b7a41b21c626346b456fb/docs/user-guide/horizontal-pod-autoscaling/README.md#kubectl-run), this means average CPU usage of 250 milli-cores). See [here](https://github.com/kubernetes/kubernetes/blob/8caeec429ee1d2a9df7b7a41b21c626346b456fb/docs/design/horizontal-pod-autoscaler.md#autoscaling-algorithm) for more details on the algorithm.

  

We may check the current status of autoscaler by running:

  
  

| 
$ kubectl get hpa

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;REFERENCE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TARGET &nbsp;&nbsp;&nbsp;CURRENT &nbsp;&nbsp;MINPODS &nbsp;&nbsp;MAXPODS &nbsp;&nbsp;AGE

php-apache &nbsp;&nbsp;Deployment/php-apache/scale &nbsp;&nbsp;50% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14s
 |

  

  

Please note that the current CPU consumption is 0% as we are not sending any requests to the server (the CURRENT column shows the average across all the pods controlled by the corresponding replication controller).

####   
Raising the Load

  
Now, we will see how our autoscalers (Cluster Autoscaler and Horizontal Pod Autoscaler) react on the increased load of the server. We will start two infinite loops of queries to our server (please run them in different terminals):

  

  

| 
$ kubectl run -i --tty load-generator --image=busybox /bin/sh  
Hit enter for command prompt  
$ while true; do wget -q -O- http://php-apache.default.svc.cluster.local; done
 |

  

  

We need to wait a moment (about one minute) for stats to propagate. Afterwards, we will examine status of Horizontal Pod Autoscaler:

  
  

| 
$ kubectl get hpa

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;REFERENCE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TARGET &nbsp;&nbsp;&nbsp;CURRENT &nbsp;&nbsp;MINPODS &nbsp;&nbsp;MAXPODS &nbsp;&nbsp;AGE

php-apache &nbsp;&nbsp;Deployment/php-apache/scale &nbsp;&nbsp;50% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;310% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2m
  
  

$ kubectl get deployment php-apache

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DESIRED &nbsp;&nbsp;CURRENT &nbsp;&nbsp;UP-TO-DATE &nbsp;&nbsp;AVAILABLE &nbsp;&nbsp;AGE

php-apache &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4m
 |

  

  

Horizontal Pod Autoscaler has increased the number of pods in our deployment to 7. Let’s now check, if all the pods are running:

  

  

| 
jsz@jsz-desk2:~/k8s-src$ kubectl get pods

php-apache-2046965998-3ewo6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pending &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1m

php-apache-2046965998-8m03k &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1m

php-apache-2046965998-ddpgp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5m

php-apache-2046965998-lrik6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1m

php-apache-2046965998-nj465 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pending &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1m

php-apache-2046965998-tmwg1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1m

php-apache-2046965998-xkbw1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pending &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1m
 |

  

  
As we can see, some pods are pending. Let’s describe one of pending pods to get the reason of the pending state:

  

  

| 
$ kubectl describe pod php-apache-2046965998-3ewo6

Name: php-apache-2046965998-3ewo6

Namespace: default

...

Events:

 &nbsp;FirstSeen From SubobjectPath Type Reason Message
  
  

 &nbsp;1m {default-scheduler } Warning FailedScheduling pod (php-apache-2046965998-3ewo6) failed to fit in any node

fit failure on node (kubernetes-minion-group-yhdx): Insufficient CPU

fit failure on node (kubernetes-minion-group-de5q): Insufficient CPU

 &nbsp;

 &nbsp;1m {cluster-autoscaler } Normal TriggeredScaleUp pod triggered scale-up, mig: kubernetes-minion-group, sizes (current/new): 2/3 
 |

  

The pod is pending as there was no CPU in the system for it. We see there’s a TriggeredScaleUp event connected with the pod. It means that the pod triggered reaction of Cluster Autoscaler and a new node will be added to the cluster. Now we’ll wait for the reaction (about 3 minutes) and list all nodes:

  

  

| 
$ kubectl get nodes

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AGE

kubernetes-master &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready,SchedulingDisabled &nbsp;&nbsp;9m

kubernetes-minion-group-6z5i &nbsp;&nbsp;Ready &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;43s

kubernetes-minion-group-de5q &nbsp;&nbsp;Ready &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9m

kubernetes-minion-group-yhdx &nbsp;&nbsp;Ready &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9m
 |

  

As we see a new node kubernetes-minion-group-6z5i was added by Cluster Autoscaler. Let’s verify that all pods are now running:

  
  

| 
$ kubectl get pods

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY &nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;RESTARTS &nbsp;&nbsp;AGE

php-apache-2046965998-3ewo6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m

php-apache-2046965998-8m03k &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m

php-apache-2046965998-ddpgp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7m

php-apache-2046965998-lrik6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m

php-apache-2046965998-nj465 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m

php-apache-2046965998-tmwg1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m

php-apache-2046965998-xkbw1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m
 |

  

After the node addition all php-apache pods are running!

  

#### Stop Load

  
We will finish our example by stopping the user load. We’ll terminate both infinite while loops sending requests to the server and verify the result state:

  
  

| 
$ kubectl get hpa

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;REFERENCE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TARGET &nbsp;&nbsp;&nbsp;CURRENT &nbsp;&nbsp;MINPODS &nbsp;&nbsp;MAXPODS &nbsp;&nbsp;AGE

php-apache &nbsp;&nbsp;Deployment/php-apache/scale &nbsp;&nbsp;50% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16m

  
  
$ kubectl get deployment php-apache

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DESIRED &nbsp;&nbsp;CURRENT &nbsp;&nbsp;UP-TO-DATE &nbsp;&nbsp;AVAILABLE &nbsp;&nbsp;AGE

php-apache &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14m
 |

  

  

As we see, in the presented case CPU utilization dropped to 0, and the number of replicas dropped to 1.

  

After deleting pods most of the cluster resources are unused. Scaling the cluster down may take more time than scaling up because Cluster Autoscaler makes sure that the node is really not needed so that short periods of inactivity (due to pod upgrade etc) won’t trigger node deletion (see [cluster autoscaler doc](https://github.com/kubernetes/kubernetes.github.io/blob/release-1.3/docs/admin/cluster-management.md#cluster-autoscaling)). After approximately 10-12 minutes you can verify that the number of nodes in the cluster dropped:

  
  

| 
$ kubectl get nodes

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AGE

kubernetes-master &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready,SchedulingDisabled &nbsp;&nbsp;37m

kubernetes-minion-group-de5q &nbsp;&nbsp;Ready &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;36m

kubernetes-minion-group-yhdx &nbsp;&nbsp;Ready &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;36m
 |

  

The number of nodes in our cluster is now two again as node kubernetes-minion-group-6z5i was removed by Cluster Autoscaler.

  

### Other use cases

  

As we have shown, it is very easy to dynamically adjust the number of pods to the load using a combination of Horizontal Pod Autoscaler and Cluster Autoscaler.&nbsp;

  

However Cluster Autoscaler alone can also be quite helpful whenever there are irregularities in the cluster load. For example, clusters related to development or continuous integration tests can be less needed on weekends or at night. Batch processing clusters may have periods when all jobs are over and the new will only start in couple hours. Having machines that do nothing is a waste of money.&nbsp;

  

In all of these cases Cluster Autoscaler can reduce the number of unused nodes and give quite significant savings because you will only pay for these nodes that you actually need to run your pods. It also makes sure that you always have enough compute power to run your tasks.&nbsp;

  

_-- Jerzy Szczepkowski and Marcin Wielgus, Software Engineers, Google_

  

  

  

