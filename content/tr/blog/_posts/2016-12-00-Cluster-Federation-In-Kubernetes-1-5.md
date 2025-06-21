---
title: " Cluster Federation in Kubernetes 1.5 "
date: 2016-12-22
slug: cluster-federation-in-kubernetes-1.5
url: /blog/2016/12/Cluster-Federation-In-Kubernetes-1-5
author: >
  Lukasz Guminski (Container Solutions),
  Allan Naim (Google)
---
_**Editor's note:** this post is part of a [series of in-depth articles](/blog/2016/12/five-days-of-kubernetes-1-5/) on what's new in Kubernetes 1.5_

In the latest [Kubernetes 1.5 release](https://kubernetes.io/blog/2016/12/kubernetes-1-5-supporting-production-workloads/), you’ll notice that support for Cluster Federation is maturing. That functionality was introduced in Kubernetes 1.3, and the 1.5 release includes a number of new features, including an easier setup experience and a step closer to supporting all Kubernetes API objects.

A new command line tool called ‘**[kubefed](/docs/admin/federation/kubefed/)**’ was introduced to make getting started with Cluster Federation much simpler. Also, alpha level support was added for Federated DaemonSets, Deployments and ConfigMaps. In summary:  

- **DaemonSets** are Kubernetes deployment rules that guarantee that a given pod is always present at every node, as new nodes are added to the cluster (more [info](/docs/admin/daemons/)).
- **Deployments** describe the desired state of Replica Sets (more [info](/docs/user-guide/deployments/)).
- **ConfigMaps** are variables applied to Replica Sets (which greatly improves image reusability as their parameters can be externalized - more [info](/docs/user-guide/configmap/)).
**Federated DaemonSets** , **Federated Deployments** , **Federated ConfigMaps** take the qualities of the base concepts to the next level. For instance, Federated DaemonSets guarantee that a pod is deployed on every node of the newly added cluster.  

But what actually is “federation”? Let’s explain it by what needs it satisfies. Imagine a service that operates globally. Naturally, all its users expect to get the same quality of service, whether they are located in Asia, Europe, or the US. What this means is that the service must respond equally fast to requests at each location. This sounds simple, but there’s lots of logic involved behind the scenes. This is what Kubernetes Cluster Federation aims to do.  

How does it work? One of the Kubernetes clusters must become a master by running a **Federation Control Plane**. In practice, this is a controller that monitors the health of other clusters, and provides a single entry point for administration. The entry point behaves like a typical Kubernetes cluster. It allows creating [Replica Sets](/docs/user-guide/replicasets/), [Deployments](/docs/user-guide/deployments/), [Services](/docs/user-guide/services/), but the federated control plane passes the resources to underlying clusters. This means that if we request the federation control plane to create a Replica Set with 1,000 replicas, it will spread the request across all underlying clusters. If we have 5 clusters, then by default each will get its share of 200 replicas.  

This on its own is a powerful mechanism. But there’s more. It’s also possible to create a Federated Ingress. Effectively, this is a global application-layer load balancer. Thanks to an understanding of the application layer, it allows load balancing to be “smarter” -- for instance, by taking into account the geographical location of clients and servers, and routing the traffic between them in an optimal way.  

In summary, with Kubernetes Cluster Federation, we can facilitate administration of all the clusters (single access point), but also optimize global content delivery around the globe. In the following sections, we will show how it works.  

**Creating a Federation Plane**  

In this exercise, we will federate a few clusters. For convenience, all commands have been grouped into 6 scripts available [here](https://github.com/ContainerSolutions/k8shserver/tree/master/scripts):  

- 0-settings.sh
- 1-create.sh
- 2-getcredentials.sh
- 3-initfed.sh
- 4-joinfed.sh
- 5-destroy.sh
First we need to define several variables (0-settings.sh)  

```
$ cat 0-settings.sh && . 0-settings.sh

# this project create 3 clusters in 3 zones. FED\_HOST\_CLUSTER points to the one, which will be used to deploy federation control plane

export FED\_HOST\_CLUSTER=us-east1-b


# Google Cloud project name

export FED\_PROJECT=\<YOUR PROJECT e.g. company-project\>


# DNS suffix for this federation. Federated Service DNS names are published with this suffix. This must be a real domain name that you control and is programmable by one of the DNS providers (Google Cloud DNS or AWS Route53)

export FED\_DNS\_ZONE=\<YOUR DNS SUFFIX e.g. example.com\>
 ```


And get kubectl and kubefed binaries. (for installation instructions refer to guides [here](/docs/user-guide/prereqs/) and [here](/docs/admin/federation/kubefed/#getting-kubefed)).  
Now the setup is ready to create a few Google Container Engine (GKE) clusters with gcloud container clusters create (1-create.sh). In this case one is in US, one in Europe and one in Asia.  

```
$ cat 1-create.sh && . 1-create.sh

gcloud container clusters create gce-us-east1-b --project=${FED\_PROJECT} --zone=us-east1-b --scopes cloud-platform,storage-ro,logging-write,monitoring-write,service-control,service-management,https://www.googleapis.com/auth/ndev.clouddns.readwrite


gcloud container clusters create gce-europe-west1-b --project=${FED\_PROJECT} --zone=europe-west1-b --scopes cloud-platform,storage-ro,logging-write,monitoring-write,service-control,service-management,https://www.googleapis.com/auth/ndev.clouddns.readwrite


gcloud container clusters create gce-asia-east1-a --project=${FED\_PROJECT} --zone=asia-east1-a --scopes cloud-platform,storage-ro,logging-write,monitoring-write,service-control,service-management,https://www.googleapis.com/auth/ndev.clouddns.readwrite
 ```


The next step is fetching kubectl configuration with gcloud -q container clusters get-credentials (2-getcredentials.sh). The configurations will be used to indicate the current context for kubectl commands.  

```
$ cat 2-getcredentials.sh && . 2-getcredentials.sh

gcloud -q container clusters get-credentials gce-us-east1-b --zone=us-east1-b --project=${FED\_PROJECT}


gcloud -q container clusters get-credentials gce-europe-west1-b --zone=europe-west1-b --project=${FED\_PROJECT}


gcloud -q container clusters get-credentials gce-asia-east1-a --zone=asia-east1-a --project=${FED\_PROJECT}
 ```


Let’s verify the setup:  

```
$ kubectl config get-contexts

CURRENT   NAME CLUSTER  AUTHINFO  NAMESPACE

\*         

gke\_container-solutions\_europe-west1-b\_gce-europe-west1-b

gke\_container-solutions\_europe-west1-b\_gce-europe-west1-b   

gke\_container-solutions\_europe-west1-b\_gce-europe-west1-b      

gke\_container-solutions\_us-east1-b\_gce-us-east1-b

gke\_container-solutions\_us-east1-b\_gce-us-east1-b           

gke\_container-solutions\_us-east1-b\_gce-us-east1-b

gke\_container-solutions\_asia-east1-a\_gce-asia-east1-a

gke\_container-solutions\_asia-east1-a\_gce-asia-east1-a  

gke\_container-solutions\_asia-east1-a\_gce-asia-east1-a
 ```



We have 3 clusters. One, indicated by the FED\_HOST\_CLUSTER environment variable, will be used to run the federation plane. For this, we will use the kubefed init federation command (3-initfed.sh).  

```
$ cat 3-initfed.sh && . 3-initfed.sh

kubefed init federation --host-cluster-context=gke\_${FED\_PROJECT}\_${FED\_HOST\_CLUSTER}\_gce-${FED\_HOST\_CLUSTER} --dns-zone-name=${FED\_DNS\_ZONE}
 ```



You will notice that after executing the above command, a new kubectl context has appeared:  

```
$ kubectl config get-contexts

CURRENT   NAME  CLUSTER  AUTHINFO NAMESPACE

...         

federation

federation
 ```



The federation context will become our administration entry point. Now it’s time to join clusters (4-joinfed.sh):

```
$ cat 4-joinfed.sh && . 4-joinfed.sh

kubefed --context=federation join cluster-europe-west1-b --cluster-context=gke\_${FED\_PROJECT}\_europe-west1-b\_gce-europe-west1-b --host-cluster-context=gke\_${FED\_PROJECT}\_${FED\_HOST\_CLUSTER}\_gce-${FED\_HOST\_CLUSTER}


kubefed --context=federation join cluster-asia-east1-a --cluster-context=gke\_${FED\_PROJECT}\_asia-east1-a\_gce-asia-east1-a --host-cluster-context=gke\_${FED\_PROJECT}\_${FED\_HOST\_CLUSTER}\_gce-${FED\_HOST\_CLUSTER}


kubefed --context=federation join cluster-us-east1-b --cluster-context=gke\_${FED\_PROJECT}\_us-east1-b\_gce-us-east1-b --host-cluster-context=gke\_${FED\_PROJECT}\_${FED\_HOST\_CLUSTER}\_gce-${FED\_HOST\_CLUSTER}
 ```


Note that cluster gce-us-east1-b is used here to run the federation control plane and also to work as a worker cluster. This circular dependency helps to use resources more efficiently and it can be verified by using the kubectl --context=federation get clusters command:  

```
$ kubectl --context=federation get clusters

NAME                        STATUS    AGE

cluster-asia-east1-a        Ready     7s

cluster-europe-west1-b      Ready     10s

cluster-us-east1-b          Ready     10s
 ```



We are good to go.



**Using Federation To Run An Application**  

In our [repository](https://github.com/ContainerSolutions/k8shserver) you will find instructions on how to build a docker image with a web service that displays the container’s hostname and the Google Cloud Platform (GCP) zone.


An example output might look like this:


```
{"hostname":"k8shserver-6we2u","zone":"europe-west1-b"}
 ```


Now we will deploy the Replica Set ([k8shserver.yaml](https://github.com/ContainerSolutions/k8shserver/blob/master/rs/k8shserver.yaml)):  

```
$ kubectl --context=federation create -f rs/k8shserver
 ```



And a Federated Service ([k8shserver.yaml](https://github.com/ContainerSolutions/k8shserver/blob/master/services/k8shserver.yaml)):  

```
$ kubectl --context=federation create -f service/k8shserver
 ```



As you can see, the two commands refer to the “federation” context, i.e. to the federation control plane. After a few minutes, you will realize that underlying clusters run the Replica Set and the Service.  


**Creating The Ingress**  

After the Service is ready, we can create [Ingress](/docs/user-guide/ingress/) - the global load balancer. The command is like this:



```
kubectl --context=federation create -f ingress/k8shserver.yaml
 ```



The contents of the file point to the service we created in the previous step:



```
apiVersion: extensions/v1beta1

kind: Ingress

metadata:

  name: k8shserver

spec:

  backend:

    serviceName: k8shserver

    servicePort: 80
 ```




After a few minutes, we should get a global IP address:

```
$ kubectl --context=federation get ingress

NAME         HOSTS     ADDRESS          PORTS     AGE

k8shserver   \*         130.211.40.125   80        20m
 ```

Effectively, the response of:  



```
$ curl 130.211.40.125
 ```


depends on the location of client. Something like this would be expected in the US:



```
{"hostname":"k8shserver-w56n4","zone":"us-east1-b"}
 ```


Whereas in Europe, we might have:



```
{"hostname":"k8shserver-z31p1","zone":"eu-west1-b"}
 ```




Please refer to this [issue](https://github.com/kubernetes/kubernetes/issues/39087) for additional details on how everything we've described works.



**Demo**  




**Summary**



Cluster Federation is actively being worked on and is still not fully General Available. Some APIs are in beta and others are in alpha. Some features are missing, for instance cross-cloud load balancing is not supported (federated ingress currently only works on Google Cloud Platform as it depends on GCP [HTTP(S) Load Balancing](https://cloud.google.com/compute/docs/load-balancing/http/)).



Nevertheless, as the functionality matures, it will become an enabler for all companies that aim at global markets, but currently cannot afford sophisticated administration techniques as used by the likes of Netflix or Amazon. That’s why we closely watch the technology, hoping that it soon fulfills its promise.



PS. When done, remember to destroy your clusters:




```
$ . 5-destroy.sh
 ```

