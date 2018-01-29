---
layout: blog
title: " Scaling Stateful Applications using Kubernetes Pet Sets and FlexVolumes with Datera Elastic Data Fabric "
date:  Tuesday, August 29, 2016 

---
_Editor’s note: today’s guest post is by Shailesh Mittal, Software Architect and Ashok Rajagopalan, Sr Director Product at Datera Inc, talking about Stateful Application provisioning with Kubernetes on Datera Elastic Data Fabric._  
  
**Introduction**  
  
Persistent volumes in Kubernetes are foundational as customers move beyond stateless workloads to run stateful applications. While Kubernetes has supported stateful applications such as MySQL, Kafka, Cassandra, and Couchbase for a while, the introduction of Pet Sets has significantly improved this support. In particular, the procedure to sequence the provisioning and startup, the ability to scale and associate durably by [Pet Sets](http://kubernetes.io/docs/user-guide/petset/) has provided the ability to automate to scale the “Pets” (applications that require consistent handling and durable placement).&nbsp;  
  
Datera, elastic block storage for cloud deployments, has [seamlessly integrated with Kubernetes](http://datera.io/blog-library/8/19/datera-simplifies-stateful-containers-on-kubernetes-13) through the [FlexVolume](http://kubernetes.io/docs/user-guide/volumes/#flexvolume) framework. Based on the first principles of containers, Datera allows application resource provisioning to be decoupled from the underlying physical infrastructure. This brings clean contracts (aka, no dependency or direct knowledge of the underlying physical infrastructure), declarative formats, and eventually portability to stateful applications.  
  
While Kubernetes allows for great flexibility to define the underlying application infrastructure through yaml configurations, Datera allows for that configuration to be passed to the storage infrastructure to provide persistence. Through the notion of Datera AppTemplates, in a Kubernetes environment, stateful applications can be automated to scale.&nbsp;  
  
  

  

**Deploying Persistent Storage**

  

Persistent storage is defined using the Kubernetes [PersistentVolume](http://kubernetes.io/docs/user-guide/persistent-volumes/#persistent-volumes) subsystem. PersistentVolumes are volume plugins and define volumes that live independently of the lifecycle of the pod that is using it. They are implemented as NFS, iSCSI, or by cloud provider specific storage system. Datera has developed a volume plugin for PersistentVolumes that can provision iSCSI block storage on the Datera Data Fabric for Kubernetes pods.

  

The Datera volume plugin gets invoked by kubelets on minion nodes and relays the calls to the Datera Data Fabric over its REST API. Below is a sample deployment of a PersistentVolume with the Datera plugin:

  

| 
 &nbsp;apiVersion: v1

 &nbsp;kind: PersistentVolume

 &nbsp;metadata:

 &nbsp;&nbsp;&nbsp;name: pv-datera-0

 &nbsp;spec:

 &nbsp;&nbsp;&nbsp;capacity:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;storage: 100Gi

 &nbsp;&nbsp;&nbsp;accessModes:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ReadWriteOnce

 &nbsp;&nbsp;&nbsp;persistentVolumeReclaimPolicy: Retain

 &nbsp;&nbsp;&nbsp;flexVolume:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;driver: "datera/iscsi"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fsType: "xfs"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;options:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volumeID: "kube-pv-datera-0"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;size: “100"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;replica: "3"

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;backstoreServer: "[tlx170.tlx.daterainc.com](http://tlx170.tlx.daterainc.com/):7717”
 |

  

This manifest defines a PersistentVolume of 100 GB to be provisioned in the Datera Data Fabric, should a pod request the persistent storage.

  
  

| 
[root@tlx241 /]# kubectl get pv

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CAPACITY &nbsp;&nbsp;ACCESSMODES &nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CLAIM &nbsp;&nbsp;&nbsp;&nbsp;REASON &nbsp;&nbsp;&nbsp;AGE

pv-datera-0 &nbsp;&nbsp;100Gi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RWO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Available &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8s

pv-datera-1 &nbsp;&nbsp;100Gi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RWO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Available &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2s

pv-datera-2 &nbsp;&nbsp;100Gi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RWO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Available &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7s

pv-datera-3 &nbsp;&nbsp;100Gi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RWO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Available &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4s
 |

  

**Configuration**

  

The Datera PersistenceVolume plugin is installed on all minion nodes. When a pod lands on a minion node with a valid claim bound to the persistent storage provisioned earlier, the Datera plugin forwards the request to create the volume on the Datera Data Fabric. All the options that are specified in the PersistentVolume manifest are sent to the plugin upon the provisioning request.

  

Once a volume is provisioned in the Datera Data Fabric, volumes are presented as an iSCSI block device to the minion node, and kubelet mounts this device for the containers (in the pod) to access it.

 ![](https://lh4.googleusercontent.com/ILlUm1HrWhGa8uTt97dQ786Gn20FHFZkavfucz05NHv6moZWiGDG7GlELM6o4CSzANWvZckoAVug5o4jMg17a-PbrfD1FRbDPeUCIc8fKVmVBNUsUPshWanXYkBa3gIJy5BnhLmZ)

  

**Using Persistent Storage**

  

Kubernetes PersistentVolumes are used along with a pod using PersistentVolume Claims. Once a claim is defined, it is bound to a PersistentVolume matching the claim’s specification. A typical claim for the PersistentVolume defined above would look like below:

  
  

| 
kind: PersistentVolumeClaim

apiVersion: v1

metadata:

 &nbsp;name: pv-claim-test-petset-0

spec:

 &nbsp;accessModes:

 &nbsp;&nbsp;&nbsp;- ReadWriteOnce

 &nbsp;resources:

 &nbsp;&nbsp;&nbsp;requests:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;storage: 100Gi
 |

  

When this claim is defined and it is bound to a PersistentVolume, resources can be used with the pod specification:

  
  

| 
[root@tlx241 /]# kubectl get pv

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CAPACITY &nbsp;&nbsp;ACCESSMODES &nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CLAIM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;REASON &nbsp;&nbsp;&nbsp;AGE

pv-datera-0 &nbsp;&nbsp;100Gi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RWO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bound &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;default/pv-claim-test-petset-0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6m

pv-datera-1 &nbsp;&nbsp;100Gi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RWO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bound &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;default/pv-claim-test-petset-1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6m

pv-datera-2 &nbsp;&nbsp;100Gi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RWO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Available &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7s

pv-datera-3 &nbsp;&nbsp;100Gi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RWO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Available &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4s
  

[root@tlx241 /]# kubectl get pvc

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;VOLUME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CAPACITY &nbsp;&nbsp;ACCESSMODES &nbsp;&nbsp;AGE

pv-claim-test-petset-0 &nbsp;&nbsp;Bound &nbsp;&nbsp;&nbsp;&nbsp;pv-datera-0 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m

pv-claim-test-petset-1 &nbsp;&nbsp;Bound &nbsp;&nbsp;&nbsp;&nbsp;pv-datera-1 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m
 |

  

A pod can use a PersistentVolume Claim like below:

  

| 
apiVersion: v1

kind: Pod

metadata:

 &nbsp;name: kube-pv-demo

spec:

 &nbsp;containers:

 &nbsp;- name: data-pv-demo

 &nbsp;&nbsp;&nbsp;image: nginx

 &nbsp;&nbsp;&nbsp;volumeMounts:

 &nbsp;&nbsp;&nbsp;- name: test-kube-pv1

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /data

 &nbsp;&nbsp;&nbsp;ports:

 &nbsp;&nbsp;&nbsp;- containerPort: 80

 &nbsp;volumes:

 &nbsp;- name: test-kube-pv1

 &nbsp;&nbsp;&nbsp;persistentVolumeClaim:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;claimName: pv-claim-test-petset-0
 |

  

The result is a pod using a PersistentVolume Claim as a volume. It in-turn sends the request to the Datera volume plugin to provision storage in the Datera Data Fabric.

  
  

| 
[root@tlx241 /]# kubectl describe pods kube-pv-demo

Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;kube-pv-demo

Namespace: &nbsp;default

Node: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tlx243/172.19.1.243

Start Time: Sun, 14 Aug 2016 19:17:31 -0700

Labels: &nbsp;&nbsp;&nbsp;&nbsp;\<none\>

Status: &nbsp;&nbsp;&nbsp;&nbsp;Running

IP: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10.40.0.3

Controllers: \<none\>

Containers:

 &nbsp;data-pv-demo:

 &nbsp;&nbsp;&nbsp;Container ID: [docker://ae2a50c25e03143d0dd721cafdcc6543fac85a301531110e938a8e0433f74447](about:blank)

 &nbsp;&nbsp;&nbsp;Image: &nbsp;&nbsp;nginx

 &nbsp;&nbsp;&nbsp;Image ID: [docker://sha256:0d409d33b27e47423b049f7f863faa08655a8c901749c2b25b93ca67d01a470d](about:blank)

 &nbsp;&nbsp;&nbsp;Port: &nbsp;&nbsp;&nbsp;80/TCP

 &nbsp;&nbsp;&nbsp;State: &nbsp;&nbsp;Running

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Started: &nbsp;Sun, 14 Aug 2016 19:17:34 -0700

 &nbsp;&nbsp;&nbsp;Ready: &nbsp;&nbsp;True

 &nbsp;&nbsp;&nbsp;Restart Count: &nbsp;0

 &nbsp;&nbsp;&nbsp;Environment Variables: &nbsp;\<none\>

Conditions:

 &nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status

 &nbsp;Initialized &nbsp;&nbsp;&nbsp;True

 &nbsp;Ready &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;True

 &nbsp;PodScheduled &nbsp;&nbsp;True

Volumes:

 &nbsp;test-kube-pv1:

 &nbsp;&nbsp;&nbsp;Type: &nbsp;PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)

 &nbsp;&nbsp;&nbsp;ClaimName: &nbsp;&nbsp;pv-claim-test-petset-0

 &nbsp;&nbsp;&nbsp;ReadOnly: &nbsp;&nbsp;&nbsp;false

 &nbsp;default-token-q3eva:

 &nbsp;&nbsp;&nbsp;Type: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Secret (a volume populated by a Secret)

 &nbsp;&nbsp;&nbsp;SecretName: &nbsp;default-token-q3eva

 &nbsp;&nbsp;&nbsp;QoS Tier: &nbsp;BestEffort

Events:

 &nbsp;FirstSeen LastSeen Count From SubobjectPath Type Reason Message

 &nbsp;--------- -------- ----- ---- ------------- -------- ------ -------

 &nbsp;43s 43s 1 {default-scheduler } Normal Scheduled Successfully assigned kube-pv-demo to tlx243

 &nbsp;42s 42s 1 {kubelet tlx243} spec.containers{data-pv-demo} Normal Pulling pulling image "nginx"

 &nbsp;40s 40s 1 {kubelet tlx243} spec.containers{data-pv-demo} Normal Pulled Successfully pulled image "nginx"

 &nbsp;40s 40s 1 {kubelet tlx243} spec.containers{data-pv-demo} Normal Created Created container with docker id ae2a50c25e03

 &nbsp;40s 40s 1 {kubelet tlx243} spec.containers{data-pv-demo} Normal Started Started container with docker id ae2a50c25e03
 |

  

The persistent volume is presented as iSCSI device at minion node (tlx243 in this case):

  

| 
[root@tlx243 ~]# lsscsi

[0:2:0:0] &nbsp;&nbsp;&nbsp;disk &nbsp;&nbsp;&nbsp;SMC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SMC2208 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.24 &nbsp;/dev/sda&nbsp;

[11:0:0:0] &nbsp;&nbsp;disk &nbsp;&nbsp;&nbsp;DATERA &nbsp;&nbsp;IBLOCK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.0 &nbsp;&nbsp;/dev/sdb
  

[root@tlx243 datera~iscsi]# mount | grep sdb

/dev/sdb on /var/lib/kubelet/pods/6b99bd2a-628e-11e6-8463-0cc47ab41442/volumes/datera~iscsi/pv-datera-0 type xfs (rw,relatime,attr2,inode64,noquota)
 |

  

Containers running in the pod see this device mounted at /data as specified in the manifest:

  

| 
[root@tlx241 /]# kubectl exec kube-pv-demo -c data-pv-demo -it bash

root@kube-pv-demo:/# mount | grep data

/dev/sdb on /data type xfs (rw,relatime,attr2,inode64,noquota)
 |

  

**Using Pet Sets**

  

Typically, pods are treated as stateless units, so if one of them is unhealthy or gets superseded, Kubernetes just disposes it. In contrast, a PetSet is a group of stateful pods that has a stronger notion of identity. The goal of a PetSet is to decouple this dependency by assigning identities to individual instances of an application that are not anchored to the underlying physical infrastructure.

  

A PetSet requires {0..n-1} Pets. Each Pet has a deterministic name, PetSetName-Ordinal, and a unique identity. Each Pet has at most one pod, and each PetSet has at most one Pet with a given identity. A PetSet ensures that a specified number of “pets” with unique identities are running at any given time. The identity of a Pet is comprised of:

- a stable hostname, available in DNS
- an ordinal index
- stable storage: linked to the ordinal & hostname

A typical PetSet definition using a PersistentVolume Claim looks like below:

  

| 
# A headless service to create DNS records

apiVersion: v1

kind: Service

metadata:

 &nbsp;name: test-service

 &nbsp;labels:

 &nbsp;&nbsp;&nbsp;app: nginx

spec:

 &nbsp;ports:

 &nbsp;- port: 80

 &nbsp;&nbsp;&nbsp;name: web

 &nbsp;clusterIP: None

 &nbsp;selector:

 &nbsp;&nbsp;&nbsp;app: nginx

---

apiVersion: apps/v1alpha1

kind: PetSet

metadata:

 &nbsp;name: test-petset

spec:

 &nbsp;serviceName: "test-service"

 &nbsp;replicas: 2

 &nbsp;template:

 &nbsp;&nbsp;&nbsp;metadata:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labels:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: nginx

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;annotations:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[pod.alpha.kubernetes.io/initialized:](http://pod.alpha.kubernetes.io/initialized:) "true"

 &nbsp;&nbsp;&nbsp;spec:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;terminationGracePeriodSeconds: 0

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: nginx

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: [gcr.io/google\_containers/nginx-slim:0.8](http://gcr.io/google_containers/nginx-slim:0.8)

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ports:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- containerPort: 80

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: web

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: pv-claim

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /data

 &nbsp;volumeClaimTemplates:

 &nbsp;- metadata:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: pv-claim

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;annotations:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[volume.alpha.kubernetes.io/storage-class:](http://volume.alpha.kubernetes.io/storage-class:) anything

 &nbsp;&nbsp;&nbsp;spec:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;accessModes: ["ReadWriteOnce"]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resources:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;requests:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;storage: 100Gi
 |

  

We have the following PersistentVolume Claims available:

  

| 
[root@tlx241 /]# kubectl get pvc

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;VOLUME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CAPACITY &nbsp;&nbsp;ACCESSMODES &nbsp;&nbsp;AGE

pv-claim-test-petset-0 &nbsp;&nbsp;Bound &nbsp;&nbsp;&nbsp;&nbsp;pv-datera-0 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;41m

pv-claim-test-petset-1 &nbsp;&nbsp;Bound &nbsp;&nbsp;&nbsp;&nbsp;pv-datera-1 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;41m

pv-claim-test-petset-2 &nbsp;&nbsp;Bound &nbsp;&nbsp;&nbsp;&nbsp;pv-datera-2 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5s

pv-claim-test-petset-3 &nbsp;&nbsp;Bound &nbsp;&nbsp;&nbsp;&nbsp;pv-datera-3 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2s
 |

  

When this PetSet is provisioned, two pods get instantiated:

  

| 
[root@tlx241 /]# kubectl get pods

NAMESPACE &nbsp;&nbsp;&nbsp;&nbsp;NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY &nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;RESTARTS &nbsp;&nbsp;AGE

default &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;test-petset-0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7s

default &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;test-petset-1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3s
 |

  

Here is how the PetSet test-petset instantiated earlier looks like:

  
  

| 
[root@tlx241 /]# kubectl describe petset test-petset

Name: test-petset

Namespace: default

Image(s): [gcr.io/google\_containers/nginx-slim:0.8](http://gcr.io/google_containers/nginx-slim:0.8)

Selector: app=nginx

Labels: app=nginx

Replicas: 2&nbsp;current / 2 desired

Annotations: \<none\>

CreationTimestamp: Sun, 14 Aug 2016 19:46:30 -0700

Pods Status: 2&nbsp;Running / 0 Waiting / 0 Succeeded / 0 Failed

No volumes.

No events.
 |

  

Once a PetSet is instantiated, such as test-petset below, upon increasing the number of replicas (i.e. the number of pods started with that PetSet), more pods get instantiated and more PersistentVolume Claims get bound to new pods:

  

| 
[root@tlx241 /]# kubectl patch petset test-petset -p'{"spec":{"replicas":"3"}}'

"test-petset” patched
  

[root@tlx241 /]# kubectl describe petset test-petset

Name: test-petset

Namespace: default

Image(s): [gcr.io/google\_containers/nginx-slim:0.8](http://gcr.io/google_containers/nginx-slim:0.8)

Selector: app=nginx

Labels: app=nginx

Replicas: 3 current / 3 desired

Annotations: \<none\>

CreationTimestamp: Sun, 14 Aug 2016 19:46:30 -0700

Pods Status: 3 Running / 0 Waiting / 0 Succeeded / 0 Failed

No volumes.

No events.
  

[root@tlx241 /]# kubectl get pods

NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY &nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;RESTARTS &nbsp;&nbsp;AGE

test-petset-0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;29m

test-petset-1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28m

test-petset-2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9s
 |

  

Now the PetSet is running 3 pods after patch application.

  

When the above PetSet definition is patched to have one more replica, it introduces one more pod in the system. This in turn results in one more volume getting provisioned on the Datera Data Fabric. So volumes get dynamically provisioned and attached to a pod upon the PetSet scaling up.

  

To support the notion of durability and consistency, if a pod moves from one minion to another, volumes do get attached (mounted) to the new minion node and detached (unmounted) from the old minion to maintain persistent access to the data.

  

**Conclusion**

  

This demonstrates Kubernetes with Pet Sets orchestrating stateful and stateless workloads. While the Kubernetes community is working on expanding the FlexVolume framework’s capabilities, we are excited that this solution makes it possible for Kubernetes to be run more widely in the datacenters.&nbsp;

  

Join and contribute: Kubernetes [Storage SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-storage).

  

- [Download Kubernetes](http://get.k8s.io/)
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on the [k8s&nbsp;Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates

  

  

  

