---
---

This guide explains how to use Kubernetes Federated Ingress to deploy
a common HTTP(S) virtual IP load balancer across a federated service running in
multiple Kubernetes clusters.  As of v1.4, clusters hosted in Google
Cloud (both GKE and GCE, or both) are supported. This makes it
easy to deploy a service that reliably serves HTTP(S) traffic
originating from web clients around the globe on a single, static IP
address and DNS name, while retaining low
network latency, high fault tolerance and easy administration.
Clients are automatically routed, via the shortest network path, to
the cluster closest to them with available capacity (despite the fact
that they all use exactly the same IP address and/or DNS name).  The load balancer
automatically checks the health of the pods comprising your service,
and avoids sending requests to unresponsive or slow pods (or entire
unresponsive clusters).

Federated Ingress is released as beta for Google Cloud (GKE,
GCE and hybrid scenarios involving both) in Kubernetes v1.4.  Work is under way to support other cloud
providers (e.g. AWS) and other hybrid cloud scenarios (e.g. services
spanning private on-premise as well as public cloud kubernetes
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
[Kubernetes Ingresses](/docs/user-guide/ingress/) by making an API
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
   reachable via a single, static IP address, globally.

Clients inside your federated Kubernetes clusters (i.e. Pods) will be 
automatically  routed to the cluster-local shard of the Federated Service
backing the Ingress in their
cluster if it exists and is healthy, or the closest healthy shard in a
different cluster if it does not.  Note that this involves a network
trip to the HTTP(s) load balancer, which resides outside your local
Kubernetes cluster but inside the same GCP region.

## Creating a federated ingress

This is done in the usual way, for example:

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

## Adding backend pods

To render the underlying ingress shards shards healthy, we need to add
backend Pods behind the services upon which they are based.  There are several ways to achieve this, but
the easiest is to create a
[Federated Replicaset](federated-replicaset.md).  Details of how those
work are covered in the [user guide] - here we'll simply use one, to
create appropriately labelled pods in the 13 underlying clusters of
our federation:

``` shell
  kubectl --context=federation-cluster create -f myreplicaset.yaml
```

## Hybrid cloud capabilities

Federations of Kubernetes Clusters can include clusters running in
different cloud providers (e.g. Google Cloud, AWS), and on-premises
(e.g. on OpenStack).  However, in Kubernetes v1.4, Federated Ingress is only
supported across Google Cloud clusters.  In future versions we intend
to support hybrid cloud Ingress-based deployments.

## Discovering a federated ingress

TODO: Needs editing from here on.

### From pods inside your federated clusters

By default, Kubernetes clusters come pre-configured with a
cluster-local DNS server ('KubeDNS'), as well as an intelligently
constructed DNS search path which together ensure that DNS queries
like "myservice", "myservice.mynamespace",
"bobsservice.othernamespace" etc issued by your software running
inside Pods are automatically expanded and resolved correctly to the
appropriate service IP of services running in the local cluster.

With the introduction of Federated Services and Cross-Cluster Service
Discovery, this concept is extended to cover Kubernetes services
running in any other cluster across your Cluster Federation, globally.
To take advantage of this extended range, you use a slightly different
DNS name (of the form "<servicename>.<namespace>.<federationname>",
e.g. myservice.mynamespace.myfederation) to resolve Federated
Services. Using a different DNS name also avoids having your existing
applications accidentally traversing cross-zone or cross-region
networks and you incurring perhaps unwanted network charges or
latency, without you explicitly opting in to this behavior.

So, using our NGINX example service above, and the Federated Service
DNS name form just described, let's consider an example: A Pod in a
cluster in the `us-central1-f` availability zone needs to contact our
NGINX service. Rather than use the service's traditional cluster-local
DNS name (```"nginx.mynamespace"```, which is automatically expanded
to ```"nginx.mynamespace.svc.cluster.local"```) it can now use the
service's Federated DNS name, which is
```"nginx.mynamespace.myfederation"```. This will be automatically
expanded and resolved to the closest healthy shard of my NGINX
service, wherever in the world that may be. If a healthy shard exists
in the local cluster, that service's cluster-local (typically
10.x.y.z) IP address will be returned (by the cluster-local KubeDNS).
This is almost exactly equivalent to non-federated service resolution
(almost because KubeDNS actually returns both a CNAME and an A record
for local federated services, but applications will be oblivious
to this minor technical difference).

But if the service does not exist in the local cluster (or it exists
but has no healthy backend pods), the DNS query is automatically
expanded to
```"nginx.mynamespace.myfederation.svc.us-central1-f.example.com"```
(i.e. logically "find the external IP of one of the shards closest to
my availability zone"). This expansion is performed automatically by
KubeDNS, which returns the associated CNAME record. This results in
automatic traversal of the hierarchy of DNS records in the above
example, and ends up at one of the external IP's of the Federated
Service in the local us-central1 region (i.e. 104.197.247.191,
104.197.244.180 or 104.197.245.170).

It is of course possible to explicitly target service shards in
availability zones and regions other than the ones local to a Pod by
specifying the appropriate DNS names explicitly, and not relying on
automatic DNS expansion. For example,
"nginx.mynamespace.myfederation.svc.europe-west1.example.com" will
resolve to all of the currently healthy service shards in Europe, even
if the Pod issuing the lookup is located in the U.S., and irrespective
of whether or not there are healthy shards of the service in the U.S.
This is useful for remote monitoring and other similar applications.

### From other clients outside your federated clusters

Much of the above discussion applies equally to external clients,
except that the automatic DNS expansion described is no longer
possible.  So external clients need to specify one of the fully
qualified DNS names of the Federated Service, be that a zonal,
regional or global name. For convenience reasons, it is often a good
idea to manually configure additional static CNAME records in your
service, for example:

``` shell
eu.nginx.acme.com        CNAME nginx.mynamespace.myfederation.svc.europe-west1.example.com.
us.nginx.acme.com        CNAME nginx.mynamespace.myfederation.svc.us-central1.example.com.
nginx.acme.com             CNAME nginx.mynamespace.myfederation.svc.example.com.
```
That way your clients can always use the short form on the left, and
always be automatcally routed to the closest healthy shard on their
home continent.  All of the required failover is handled for you
automatically by Kubernetes Cluster Federation.  Future releases will
improve upon this even further.

## Handling failures of backend pods and whole clusters

Standard Kubernetes service cluster-IP's already ensure that
non-responsive individual Pod endpoints are automatically taken out of
service with low latency (a few seconds). In addition, as alluded
above, the Kubernetes Cluster Federation system automatically monitors
the health of clusters and the endpoints behind all of the shards of
your Federated Service, taking shards in and out of service as
required (e.g. when all of the endpoints behind a service, or perhaps
the entire cluster or availability zone go down, or conversely recover
from an outage). Due to the latency inherent in DNS caching (the cache
timeout, or TTL for Federated Service DNS records is configured to 3
minutes, by default, but can be adjusted), it may take up to that long
for all clients to completely fail over to an alternative cluster in
the case of catastrophic failure. However, given the number of
discrete IP addresses which can be returned for each regional service
endpoint (see e.g. us-central1 above, which has three alternatives)
many clients will fail over automatically to one of the alternative
IP's in less time than that given appropriate configuration.

## Troubleshooting

#### I cannot connect to my cluster federation API
Check that your

1. Client (typically kubectl) is correctly configured (including API endpoints and login credentials), and
2. Cluster Federation API server is running and network-reachable.

See the [federation admin guide](/docs/admin/federation/) to learn
how to bring up a cluster federation correctly (or have your cluster administrator do this for you), and how to correctly configure your client.

#### I can create a federated service successfully against the cluster federation API, but no matching services are created in my underlying clusters
Check that:

1. Your clusters are correctly registered in the Cluster Federation API (`kubectl describe clusters`)
2. Your clusters are all 'Active'.  This means that the cluster Federation system was able to connect and authenticate against the clusters' endpoints.  If not, consult the logs of the federation-controller-manager pod to ascertain what the failure might be. (`kubectl --namespace=federation logs $(kubectl get pods --namespace=federation -l module=federation-controller-manager -oname`)
3. That the login credentials provided to the Cluster Federation API for the clusters have the correct authorization and quota to create services in the relevant namespace in the clusters.  Again you should see associated error messages providing more detail in the above log file if this is not the case.
4. Whether any other error is preventing the service creation operation from succeeding (look for `service-controller` errors in the output of `kubectl logs federation-controller-manager --namespace federation`).

#### I can create a federated service successfully, but no matching DNS records are created in my DNS provider.
Check that:

1. Your federation name, DNS provider, DNS domain name are configured correctly.  Consult the [federation admin guide](/docs/admin/federation/) or  [tutorial](https://github.com/kelseyhightower/kubernetes-cluster-federation) to learn
how to configure your Cluster Federation system's DNS provider (or have your cluster administrator do this for you).
2. Confirm that the Cluster Federation's service-controller is successfully connecting to and authenticating against your selected DNS provider (look for `service-controller` errors or successes in the output of `kubectl logs federation-controller-manager --namespace federation`)
3. Confirm that the Cluster Federation's service-controller is successfully creating DNS records in your DNS provider (or outputting errors in it's logs explaining in more detail what's failing).

#### Matching DNS records are created in my DNS provider, but clients are unable to resolve against those names
Check that:

1. The DNS registrar that manages your federation DNS domain has been correctly configured to point to your configured DNS provider's nameservers.  See for example [Google Domains Documentation](https://support.google.com/domains/answer/3290309?hl=en&ref_topic=3251230) and [Google Cloud DNS Documentation](https://cloud.google.com/dns/update-name-servers), or equivalent guidance from your domain registrar and DNS provider.

#### This troubleshooting guide did not help me solve my problem

1. Please use one of our  [support channels](http://kubernetes.io/docs/troubleshooting/) to seek assistance.

## For more information

 * [Federation proposal](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/federation.md) details use cases that motivated this work.
