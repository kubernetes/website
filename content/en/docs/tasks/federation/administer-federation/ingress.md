---
title: Federated Ingress
content_template: templates/task
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This page explains how to use Kubernetes Federated Ingress to deploy
a common HTTP(S) virtual IP load balancer across a federated service running in
multiple Kubernetes clusters.  As of v1.4, clusters hosted in Google
Cloud (both Google Kubernetes Engine and GCE, or both) are supported. This makes it
easy to deploy a service that reliably serves HTTP(S) traffic
originating from web clients around the globe on a single, static IP
address.   Low network latency, high fault tolerance and easy administration are
ensured through intelligent request routing and automatic replica
relocation (using [Federated ReplicaSets](/docs/tasks/administer-federation/replicaset/).
Clients are automatically routed, via the shortest network path, to
the cluster closest to them with available capacity (despite the fact
that all clients use exactly the same static IP address).  The load balancer
automatically checks the health of the pods comprising the service,
and avoids sending requests to unresponsive or slow pods (or entire
unresponsive clusters).

Federated Ingress is released as an alpha feature, and supports Google Cloud Platform (Google Kubernetes Engine,
GCE and hybrid scenarios involving both) in Kubernetes v1.4.  Work is under way to support other cloud
providers such as AWS, and other hybrid cloud scenarios (e.g. services
spanning private on-premises as well as public cloud Kubernetes
clusters).

You create Federated Ingresses in much that same way as traditional
[Kubernetes Ingresses](/docs/concepts/services-networking/ingress/): by making an API
call which specifies the desired properties of your logical ingress point. In the
case of Federated Ingress, this API call is directed to the
Federation API endpoint, rather than a Kubernetes cluster API
endpoint. The API for Federated Ingress is 100% compatible with the
API for traditional Kubernetes Services.

Once created, the Federated Ingress automatically:

*  Creates matching Kubernetes Ingress objects in every cluster underlying your Cluster Federation
*  Ensures that all of these in-cluster ingress objects share the same
   logical global L7 (that is, HTTP(S)) load balancer and IP address
*  Monitors the health and capacity of the service shards (that is, your pods) behind this ingress in each cluster
*  Ensures that all client connections are routed to an appropriate healthy backend service endpoint at all times, even in the event of pod, cluster, availability zone or regional outages

Note that in the case of Google Cloud, the logical L7 load balancer is
not a single physical device (which would present both a single point
of failure, and a single global network routing choke point), but
rather a
[truly global, highly available load balancing managed service](https://cloud.google.com/load-balancing/),
globally reachable via a single, static IP address.

Clients inside your federated Kubernetes clusters (Pods) will be
automatically routed to the cluster-local shard of the Federated Service
backing the Ingress in their cluster if it exists and is healthy, or the closest healthy shard in a
different cluster if it does not.  Note that this involves a network
trip to the HTTP(s) load balancer, which resides outside your local
Kubernetes cluster but inside the same GCP region.
{{% /capture %}}

{{% capture prerequisites %}}
This document assumes that you have a running Kubernetes Cluster
Federation installation. If not, then see the
[federation admin guide](/docs/tasks/federation/set-up-cluster-federation-kubefed/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.

You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general, and [Ingress](/docs/concepts/services-networking/ingress/) in particular.
{{% /capture %}}

{{% capture steps %}}
## Creating a federated ingress

You can create a federated ingress in any of the usual ways, for example, using kubectl:

``` shell
kubectl --context=federation-cluster create -f myingress.yaml
```
For example ingress YAML configurations, see the [Ingress User Guide](/docs/concepts/services-networking/ingress/).
The `--context=federation-cluster` flag tells kubectl to submit the
request to the Federation API endpoint, with the appropriate
credentials. If you have not yet configured such a context, see the
[federation admin guide](/docs/admin/federation/) or one of the
[administration tutorials](https://github.com/kelseyhightower/kubernetes-cluster-federation)
to find out how to do so.

The Federated Ingress automatically creates
and maintains matching Kubernetes ingresses in all of the clusters
underlying your federation.  These cluster-specific ingresses (and
their associated ingress controllers) configure and manage the load
balancing and health checking infrastructure that ensures that traffic
is load balanced to each cluster appropriately.

You can verify this by checking in each of the underlying clusters. For example:

``` shell
kubectl --context=gce-asia-east1a get ingress myingress
NAME        HOSTS     ADDRESS           PORTS     AGE
myingress   *         130.211.5.194     80, 443   1m
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. The name and
namespace of the underlying ingress automatically matches those of
the Federated Ingress that you created above (and if you happen to
have had ingresses of the same name and namespace already existing in
any of those clusters, they will be automatically adopted by the
Federation and updated to conform with the specification of your
Federated Ingress. Either way, the end result will be the same).

The status of your Federated Ingress automatically reflects the
real-time status of the underlying Kubernetes ingresses. For example:

``` shell
kubectl --context=federation-cluster describe ingress myingress

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

Note that:

*  The address of your Federated Ingress
corresponds with the address of all of the
underlying Kubernetes ingresses (once these have been allocated - this
may take up to a few minutes).
*  You have not yet provisioned any backend Pods to receive
the network traffic directed to this ingress (that is, 'Service
Endpoints' behind the service backing the Ingress), so the Federated Ingress does not yet consider these to
be healthy shards and will not direct traffic to any of these clusters.
*  The federation control system
automatically reconfigures the load balancer controllers in all of the
clusters in your federation to make them consistent, and allows
them to share global load balancers.  But this reconfiguration can
only complete successfully if there are no pre-existing Ingresses in
those clusters (this is a safety feature to prevent accidental
breakage of existing ingresses).  So, to ensure that your federated
ingresses function correctly, either start with new, empty clusters, or make
sure that you delete (and recreate if necessary) all pre-existing
Ingresses in the clusters comprising your federation.

## Adding backend services and pods

To render the underlying ingress shards healthy, you need to add
backend Pods behind the service upon which the Ingress is based.  There are several ways to achieve this, but
the easiest is to create a Federated Service and
Federated ReplicaSet.  To
create appropriately labelled pods and services in the 13 underlying clusters of
your federation:

``` shell
kubectl --context=federation-cluster create -f services/nginx.yaml
```

``` shell
kubectl --context=federation-cluster create -f myreplicaset.yaml
```

Note that in order for your federated ingress to work correctly on
Google Cloud, the node ports of all of the underlying cluster-local
services need to be identical.  If you're using a federated service
this is easy to do.  Simply pick a node port that is not already
being used in any of your clusters, and add that to the spec of your
federated service.  If you do not specify a node port for your
federated service, each cluster will choose its own node port for
its cluster-local shard of the service, and these will probably end
up being different, which is not what you want.

You can verify this by checking in each of the underlying clusters. For example:

``` shell
kubectl --context=gce-asia-east1a get services nginx
NAME      TYPE        CLUSTER-IP     EXTERNAL-IP      PORT(S)   AGE
nginx     ClusterIP   10.63.250.98   104.199.136.89   80/TCP    9m
```

## Hybrid cloud capabilities

Federations of Kubernetes Clusters can include clusters running in
different cloud providers (for example, Google Cloud, AWS), and on-premises
(for example, on OpenStack).  However, in Kubernetes v1.4, Federated Ingress is only
supported across Google Cloud clusters.

## Discovering a federated ingress

Ingress objects (in both plain Kubernetes clusters, and in federations
of clusters) expose one or more IP addresses (via
the Status.Loadbalancer.Ingress field) that remains static for the lifetime
of the Ingress object (in future, automatically managed DNS names
might also be added).  All clients (whether internal to your cluster,
or on the external network or internet) should connect to one of these IP
or DNS addresses.  All client requests are automatically
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
ReplicaSets for this purpose.

In particular, Federated ReplicaSets ensure that the desired number of
pods are kept running in each cluster, even in the event of node
failures.  In the event of entire cluster or availability zone
failures, Federated ReplicaSets automatically place additional
replicas in the other available clusters in the federation to accommodate the
traffic which was previously being served by the now unavailable
cluster. While the Federated ReplicaSet ensures that sufficient replicas are
kept running, the Federated Ingress ensures that user traffic is
automatically redirected away from the failed cluster to other
available clusters.

## Troubleshooting

#### I cannot connect to my cluster federation API.

Check that your:

1. Client (typically `kubectl`) is correctly configured (including API endpoints and login credentials).
2. Cluster Federation API server is running and network-reachable.

See the [federation admin guide](/docs/admin/federation/) to learn
how to bring up a cluster federation correctly (or have your cluster administrator do this for you), and how to correctly configure your client.

#### I can create a Federated Ingress/service/replicaset successfully against the cluster federation API, but no matching ingresses/services/replicasets are created in my underlying clusters.

Check that:

1. Your clusters are correctly registered in the Cluster Federation API. (`kubectl describe clusters`)
2. Your clusters are all 'Active'.  This means that the cluster
   Federation system was able to connect and authenticate against the
   clusters' endpoints.  If not, consult the event logs of the federation-controller-manager pod to ascertain what the failure might be. (`kubectl --namespace=federation logs $(kubectl get pods --namespace=federation -l module=federation-controller-manager -o name`)
3. That the login credentials provided to the Cluster Federation API
   for the clusters have the correct authorization and quota to create
   ingresses/services/replicasets in the relevant namespace in the
   clusters.  Again you should see associated error messages providing
   more detail in the above event log file if this is not the case.
4. Whether any other error is preventing the service creation
   operation from succeeding (look for `ingress-controller`,
   `service-controller` or `replicaset-controller`,
   errors in the output of `kubectl logs federation-controller-manager --namespace federation`).

#### I can create a federated ingress successfully, but request load is not correctly distributed across the underlying clusters.

Check that:

1. The services underlying your federated ingress in each cluster have
    identical node ports.  See [above](#creating_a_federated_ingress) for further explanation.
2. The load balancer controllers in each of your clusters are of the
   correct type ("GLBC") and have been correctly reconfigured by the
   federation control plane to share a global GCE load balancer (this
   should happen automatically).  If they are of the correct type, and
   have been correctly reconfigured, the UID data item in the GLBC
   configmap in each cluster will be identical across all clusters.
   See
   [the GLBC docs](https://github.com/kubernetes/ingress/blob/7dcb4ae17d5def23d3e9c878f3146ac6df61b09d/controllers/gce/README.md)
   for further details.
   If this is not the case, check the logs of your federation
   controller manager to determine why this automated reconfiguration
   might be failing.
3. No ingresses have been manually created in any of your clusters before the above
    reconfiguration of the load balancer controller completed
    successfully.  Ingresses created before the reconfiguration of
    your GLBC will interfere with the behavior of your federated
    ingresses created after the reconfiguration (see
    [the GLBC docs](https://github.com/kubernetes/ingress/blob/7dcb4ae17d5def23d3e9c878f3146ac6df61b09d/controllers/gce/README.md)
    for further information). To remedy this,
    delete any ingresses created before the cluster joined the
    federation (and had its GLBC reconfigured), and recreate them if
    necessary.
{{% /capture %}}

{{% capture whatsnext %}}
*  If you need assistance, use one of the [support channels](/docs/tasks/debug-application-cluster/troubleshooting/) to seek assistance.
 *  For details about use cases that motivated this work, see
 [Federation proposal](https://git.k8s.io/community/contributors/design-proposals/multicluster/federation.md).
{{% /capture %}}

