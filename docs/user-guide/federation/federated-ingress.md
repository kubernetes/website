---
---

This guide explains how to use Kubernetes Federated Ingress to deploy
a common HTTP(S) virtual IP load balancer across a federated service running in
multiple Kubernetes clusters.  As of v1.4, clusters hosted in Google
Cloud (both GKE and GCE, or both) are supported. This makes it
easy to deploy a service that reliably serves HTTP(S) traffic
originating from web clients around the globe on a single, static IP
address.   Low
network latency, high fault tolerance and easy administration are
ensured through intelligent request routing and automatic replica
relocation (using [Federated ReplicaSets](docs/user-guide/federation/federated-replicaset.md)).
Clients are automatically routed, via the shortest network path, to
the cluster closest to them with available capacity (despite the fact
that all clients use exactly the same static IP address).  The load balancer
automatically checks the health of the pods comprising the service,
and avoids sending requests to unresponsive or slow pods (or entire
unresponsive clusters).

Federated Ingress is released as an alpha feature, and supports Google Cloud Platform (GKE,
GCE and hybrid scenarios involving both) in Kubernetes v1.4.  Work is under way to support other cloud
providers such as AWS, and other hybrid cloud scenarios (e.g. services
spanning private on-premise as well as public cloud Kubernetes
clusters).  We welcome your feedback.  

* TOC
{:toc}

## Prerequisites

This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/admin/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.

You are also expected to have a basic
[working knowledge of Kubernetes](/docs/getting-started-guides/) in
general, and [Ingress](/docs/user-guide/ingress/) in particular.

## Overview

Federated Ingresses are created in much that same way as traditional
[Kubernetes Ingresses](/docs/user-guide/ingress/): by making an API
call which specifies the desired properties of your logical ingress point. In the
case of Federated Ingress, this API call is directed to the
Federation API endpoint, rather than a Kubernetes cluster API
endpoint. The API for Federated Ingress is 100% compatible with the
API for traditional Kubernetes Services.

Once created, the Federated Ingress automatically:

1. creates matching Kubernetes Ingress objects in every cluster
underlying your Cluster Federation,
2. ensures that all of these in-cluster ingress objects share the same
   logical global L7 (i.e. HTTP(S)) load balancer and IP address.  
3. monitors the health and capacity of the service "shards" (i.e. your
   pods) behind this ingress in each cluster
4. ensures that all client connections are routed to an appropriate
healthy backend service endpoint at all times, even in the event of
pod, cluster,
availability zone or regional outages.

Note that in the
   case of Google Cloud, the logical L7 load balancer is not a single physical device (which
   would present both a single point of failure, and a single global
   network routing choke point), but rather a [truly global, highly available
   load balancing managed service](https://cloud.google.com/load-balancing/),
   globally reachable via a single, static IP address.

Clients inside your federated Kubernetes clusters (i.e. Pods) will be 
automatically  routed to the cluster-local shard of the Federated Service
backing the Ingress in their
cluster if it exists and is healthy, or the closest healthy shard in a
different cluster if it does not.  Note that this involves a network
trip to the HTTP(s) load balancer, which resides outside your local
Kubernetes cluster but inside the same GCP region.

## Creating a federated ingress

You can create a federated ingress in any of the usual ways, for example using kubectl:

``` shell
kubectl --context=federation-cluster create -f myingress.yaml
```

The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation API endpoint, with the appropriate
credentials. If you have not yet configured such a context, visit the
[federation admin guide](/docs/admin/federation/) or one of the
[administration tutorials](https://github.com/kelseyhightower/kubernetes-cluster-federation)
to find out how to do so.  TODO: Update links

As described above, the Federated Ingress will automatically create
and maintain matching Kubernetes ingresses in all of the clusters
underlying your federation.  These cluster-specific ingresses (and
their associated ingress controllers) configure and manage the load
balancing and health checking infrastructure that ensures that traffic
is load balanced to each cluster appropriately. 

You can verify this by checking in each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get ingress myingress
NAME        HOSTS     ADDRESS           PORTS     AGE
myingress      *         130.211.5.194   80, 443   1m
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. The name and
namespace of the underlying ingress will automatically match those of
the Federated Ingress that you created above (and if you happen to
have had ingresses of the same name and namespace already existing in
any of those clusters, they will be automatically adopted by the
Federation and updated to conform with the specification of your
Federated Ingress - either way, the end result will be the same).

The status of your Federated Ingress will automatically reflect the
real-time status of the underlying Kubernetes ingresses, for example:

``` shell
$kubectl --context=federation-cluster describe ingress myingress

Name:           myingress
Namespace:      default
Address:        130.211.5.194
TLS:
  tls-secret terminates 
Rules:
  Host  Path    Backends
  ----  ----    --------
  * *   echoheaders-https:80 (10.152.1.3:8080,10.152.2.4:8080)
Annotations:
  https-target-proxy:       k8s-tps-default-myingress--ff1107f83ed600c0
  target-proxy:         k8s-tp-default-myingress--ff1107f83ed600c0
  url-map:          k8s-um-default-myingress--ff1107f83ed600c0
  backends:         {"k8s-be-30301--ff1107f83ed600c0":"Unknown"}
  forwarding-rule:      k8s-fw-default-myingress--ff1107f83ed600c0
  https-forwarding-rule:    k8s-fws-default-myingress--ff1107f83ed600c0
Events:
  FirstSeen LastSeen    Count   From                SubobjectPath   Type        Reason  Message
  --------- --------    -----   ----                -------------   --------    ------  -------
  3m        3m      1   {loadbalancer-controller }          Normal      ADD default/myingress
  2m        2m      1   {loadbalancer-controller }          Normal      CREATE  ip: 130.211.5.194
```

Note the address of your Federated Ingress
corresponds with the address of all of the
underlying Kubernetes ingresses (once these have been allocated - this
may take up to a few minutes).

Note also that we have not yet provisioned any backend Pods to receive
the network traffic directed to this ingress (i.e. 'Service
Endpoints' behind the service backing the Ingress), so the Federated Ingress does not yet consider these to
be healthy shards and will not direct traffic to any of these clusters.

## Adding backend services and pods

To render the underlying ingress shards healthy, we need to add
backend Pods behind the service upon which the Ingress is based.  There are several ways to achieve this, but
the easiest is to create a [Federated Service](federated-services.md) and 
[Federated Replicaset](federated-replicasets.md).  Details of how those
work are covered in the aforementioned user guides - here we'll simply use them, to
create appropriately labelled pods and services in the 13 underlying clusters of
our federation:

``` shell
kubectl --context=federation-cluster create -f services/nginx.yaml
```

``` shell
  kubectl --context=federation-cluster create -f myreplicaset.yaml
```

You can verify this by checking in each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get services nginx
NAME      CLUSTER-IP     EXTERNAL-IP      PORT(S)   AGE
nginx     10.63.250.98   104.199.136.89   80/TCP    9m
```


## Hybrid cloud capabilities

Federations of Kubernetes Clusters can include clusters running in
different cloud providers (e.g. Google Cloud, AWS), and on-premises
(e.g. on OpenStack).  However, in Kubernetes v1.4, Federated Ingress is only
supported across Google Cloud clusters.  In future versions we intend
to support hybrid cloud Ingress-based deployments.

## Discovering a federated ingress

Ingress objects (in both plain Kubernets clusters, and in federations
of clusters) expose one or more IP addresses (via
the Status.Loadbalancer.Ingress field) that remains static for the lifetime
of the Ingress object (in future, automatically managed DNS names
might also be added).  All clients (whether internal to your cluster,
or on the external network or internet) should connect to one of these IP
or DNS addresses.  As mentioned above, all client requests are automatically
routed, via the shortest network path, to a healthy pod in the
closest cluster to the origin of the request. So for example, HTTP(S)
requests from internet
users in Europe will be routed directly to the closest cluster in
Europe that has available capacity.  If there are no such clusters in
Europe, the request will be routed to the next closest cluster
(typically in the U.S.).

## Handling failures of backend pods and whole clusters

Ingresses are backed by Services, which are typically (but not always)
backed by one or more ReplicaSets.  For Federated Ingresses, it is
common practise to use the federated variants of Services and
ReplicaSets (see [Federated Services](federated-services.md) and
[Federated ReplicaSets](federated-replicasets.md)) for this purpose, as
described above.

In particular, Federated ReplicaSets ensure that the desired number of
pods are kept running in each cluster, even in the event of node
failures.  In the event of entire cluster or availability zone
failures, Federated ReplicaSets automatically place additional
replacas in the other available clusters in the federation to accommodate the
traffic which was previously being served by the now unavailable
cluster. While the Federated ReplicaSet ensures that sufficient replicas are
kept running, the Federated Ingress ensures that user traffic is
automatically redirected away from the failed cluster to other
available clusters.

## Troubleshooting

#### I cannot connect to my cluster federation API
Check that your

1. Client (typically kubectl) is correctly configured (including API endpoints and login credentials), and
2. Cluster Federation API server is running and network-reachable.

See the [federation admin guide](/docs/admin/federation/) to learn
how to bring up a cluster federation correctly (or have your cluster administrator do this for you), and how to correctly configure your client.

#### I can create a federated ingress/service/replicaset successfully against the cluster federation API, but no matching ingresses/services/replicasets are created in my underlying clusters

Check that:

1. Your clusters are correctly registered in the Cluster Federation API (`kubectl describe clusters`)
2. Your clusters are all 'Active'.  This means that the cluster
   Federation system was able to connect and authenticate against the
   clusters' endpoints.  If not, consult the event logs of the federation-controller-manager pod to ascertain what the failure might be. (`kubectl --namespace=federation logs $(kubectl get pods --namespace=federation -l module=federation-controller-manager -oname`)
3. That the login credentials provided to the Cluster Federation API
   for the clusters have the correct authorization and quota to create
   ingresses/services/replicasets in the relevant namespace in the
   clusters.  Again you should see associated error messages providing
   more detail in the above event log file if this is not the case.
4. Whether any other error is preventing the service creation
   operation from succeeding (look for `ingress-controller`,
   `service-controller` or `replicaset-controller`,
   errors in the output of `kubectl logs federation-controller-manager --namespace federation`).

#### This troubleshooting guide did not help me solve my problem

Please use one of our  [support channels](http://kubernetes.io/docs/troubleshooting/) to seek assistance.

## For more information

 * [Federation proposal](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/federation.md) details use cases that motivated this work.
