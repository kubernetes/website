---
title: " Highly Available Kubernetes Clusters "
date: 2017-02-02
slug: highly-available-kubernetes-clusters
url: /blog/2017/02/Highly-Available-Kubernetes-Clusters
author: >
  Jerzy Szczepkowski (Google) 
---

Today’s post shows how to set-up a reliable, highly available distributed Kubernetes cluster. The support for running such clusters on Google Compute Engine (GCE) was added as an alpha feature in [Kubernetes 1.5 release](https://kubernetes.io/blog/2016/12/kubernetes-1-5-supporting-production-workloads/).

**Motivation**  

We will create a Highly Available Kubernetes cluster, with master replicas and worker nodes distributed among three zones of a region. Such setup will ensure that the cluster will continue operating during a zone failure.   

**Setting Up HA cluster**  

The following instructions apply to GCE. First, we will setup a cluster that will span over one zone (europe-west1-b), will contain one master and three worker nodes and will be HA-compatible (will allow adding more master replicas and more worker nodes in multiple zones in future). To implement this, we’ll export the following environment variables:  


 ```
$ export KUBERNETES\_PROVIDER=gce

$ export NUM\_NODES=3

$ export MULTIZONE=true

$ export ENABLE\_ETCD\_QUORUM\_READ=true
  ```




and run kube-up script (note that the entire cluster will be initially placed in zone europe-west1-b):  


 ```
$ KUBE\_GCE\_ZONE=europe-west1-b ./cluster/kube-up.sh
  ```



Now, we will add two additional pools of worker nodes, each of three nodes, in zones europe-west1-c and europe-west1-d (more details on adding pools of worker nodes can be find [here](/docs/setup/multiple-zones/)):  


 ```
$ KUBE\_USE\_EXISTING\_MASTER=true KUBE\_GCE\_ZONE=europe-west1-c ./cluster/kube-up.sh


$ KUBE\_USE\_EXISTING\_MASTER=true KUBE\_GCE\_ZONE=europe-west1-d ./cluster/kube-up.sh
  ```



To complete setup of HA cluster, we will add two master replicase, one in zone europe-west1-c, the other in europe-west1-d:




 ```
$ KUBE\_GCE\_ZONE=europe-west1-c KUBE\_REPLICATE\_EXISTING\_MASTER=true ./cluster/kube-up.sh


$ KUBE\_GCE\_ZONE=europe-west1-d KUBE\_REPLICATE\_EXISTING\_MASTER=true ./cluster/kube-up.sh
  ```



Note that adding the first replica will take longer (~15 minutes), as we need to reassign the IP of the master to the load balancer in front of replicas and wait for it to propagate (see [design doc](https://github.com/kubernetes/kubernetes/blob/master/docs/design/ha_master.md) for more details).



**Verifying in HA cluster works as intended**



We may now list all nodes present in the cluster:  


 ```
$ kubectl get nodes

NAME                      STATUS                AGE

kubernetes-master         Ready,SchedulingDisabled 48m

kubernetes-master-2d4     Ready,SchedulingDisabled 5m

kubernetes-master-85f     Ready,SchedulingDisabled 32s

kubernetes-minion-group-6s52 Ready                 39m

kubernetes-minion-group-cw8e Ready                 48m

kubernetes-minion-group-fw91 Ready                 48m

kubernetes-minion-group-h2kn Ready                 31m

kubernetes-minion-group-ietm Ready                 39m

kubernetes-minion-group-j6lf Ready                 31m

kubernetes-minion-group-soj7 Ready                 31m

kubernetes-minion-group-tj82 Ready                 39m

kubernetes-minion-group-vd96 Ready                 48m
  ```



As we can see, we have 3 master replicas (with disabled scheduling) and 9 worker nodes.



We will deploy a sample application (nginx server) to verify that our cluster is working correctly:  


 ```
$ kubectl run nginx --image=nginx --expose --port=80
  ```



After waiting for a while, we can verify that both the deployment and the service were correctly created and are running:  


 ```
$ kubectl get pods

NAME                READY STATUS RESTARTS AGE

...

nginx-3449338310-m7fjm 1/1 Running 0     4s

...


$ kubectl run -i --tty test-a --image=busybox /bin/sh

If you don't see a command prompt, try pressing enter.

# wget -q -O- http://nginx.default.svc.cluster.local

...

\<title\>Welcome to nginx!\</title\>

...
  ```



Now, let’s simulate failure of one of master’s replicas by executing halt command on it (kubernetes-master-137, zone europe-west1-c):  


 ```
$ gcloud compute ssh kubernetes-master-2d4 --zone=europe-west1-c

...

$ sudo halt
  ```



After a while the master replica will be marked as NotReady:  


 ```
$ kubectl get nodes

NAME                      STATUS                   AGE

kubernetes-master         Ready,SchedulingDisabled 51m

kubernetes-master-2d4     NotReady,SchedulingDisabled 8m

kubernetes-master-85f     Ready,SchedulingDisabled 4m

...
  ```



However, the cluster is still operational. We may verify it by checking if our nginx server works correctly:




 ```
$ kubectl run -i --tty test-b --image=busybox /bin/sh

If you don't see a command prompt, try pressing enter.

# wget -q -O- http://nginx.default.svc.cluster.local

...

\<title\>Welcome to nginx!\</title\>

...
  ```



We may also run another nginx server:




 ```
$ kubectl run nginx-next --image=nginx --expose --port=80
  ```



The new server should be also working correctly:




 ```
$ kubectl run -i --tty test-c --image=busybox /bin/sh

If you don't see a command prompt, try pressing enter.

# wget -q -O- http://nginx-next.default.svc.cluster.local

...

\<title\>Welcome to nginx!\</title\>

...
  ```



Let’s now reset the broken replica:




 ```
$ gcloud compute instances start kubernetes-master-2d4 --zone=europe-west1-c
  ```



After a while, the replica should be re-attached to the cluster:




 ```
$ kubectl get nodes

NAME                      STATUS                AGE

kubernetes-master         Ready,SchedulingDisabled 57m

kubernetes-master-2d4     Ready,SchedulingDisabled 13m

kubernetes-master-85f     Ready,SchedulingDisabled 9m

...
  ```



**Shutting down HA cluster**



To shutdown the cluster, we will first shut down master replicas in zones D and E:




 ```
$ KUBE\_DELETE\_NODES=false KUBE\_GCE\_ZONE=europe-west1-c ./cluster/kube-down.sh


$ KUBE\_DELETE\_NODES=false KUBE\_GCE\_ZONE=europe-west1-d ./cluster/kube-down.sh
  ```



Note that the second removal of replica will take longer (~15 minutes), as we need to reassign the IP of the load balancer in front of replicas to the remaining master and wait for it to propagate (see [design doc](https://github.com/kubernetes/kubernetes/blob/master/docs/design/ha_master.md) for more details).



Then, we will remove the additional worker nodes from zones europe-west1-c and europe-west1-d:  


 ```
$ KUBE\_USE\_EXISTING\_MASTER=true KUBE\_GCE\_ZONE=europe-west1-c ./cluster/kube-down.sh


$ KUBE\_USE\_EXISTING\_MASTER=true KUBE\_GCE\_ZONE=europe-west1-d ./cluster/kube-down.sh
  ```



And finally, we will shutdown the remaining master with the last group of nodes (zone europe-west1-b):




 ```
$ KUBE\_GCE\_ZONE=europe-west1-b ./cluster/kube-down.sh
  ```



**Conclusions**



We have shown how, by adding worker node pools and master replicas, a Highly Available Kubernetes cluster can be created. As of Kubernetes version 1.5.2, it is supported in kube-up/kube-down scripts for GCE (as alpha). Additionally, there is a support for HA cluster on AWS in kops scripts (see [this article](http://kubecloud.io/setup-ha-k8s-kops/) for more details).  


- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates

