---
title: Cross-cluster Service Discovery using Federated Services
reviewers:
- bprashanth
- quinton-hoole
content_template: templates/task
weight: 140
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This guide explains how to use Kubernetes Federated Services to deploy
a common Service across multiple Kubernetes clusters. This makes it
easy to achieve cross-cluster service discovery and availability zone
fault tolerance for your Kubernetes applications.


Federated Services are created in much that same way as traditional
[Kubernetes Services](/docs/concepts/services-networking/service/) by making an API
call which specifies the desired properties of your service. In the
case of Federated Services, this API call is directed to the
Federation API endpoint, rather than a Kubernetes cluster API
endpoint. The API for Federated Services is 100% compatible with the
API for traditional Kubernetes Services.

Once created, the Federated Service automatically:

1. Creates matching Kubernetes Services in every cluster underlying your Cluster Federation,
2. Monitors the health of those service "shards" (and the clusters in which they reside), and
3. Manages a set of DNS records in a public DNS provider (like Google Cloud DNS, or AWS Route 53), thus ensuring that clients
of your federated service can seamlessly locate an appropriate healthy service endpoint at all times, even in the event of cluster,
availability zone or regional outages.

Clients inside your federated Kubernetes clusters (that is Pods) will
automatically find the local shard of the Federated Service in their
cluster if it exists and is healthy, or the closest healthy shard in a
different cluster if it does not.

{{% /capture %}}

{{< toc >}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Prerequisites

This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/admin/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you.

You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general, and [Services](/docs/concepts/services-networking/service/) in particular.

## Hybrid cloud capabilities

Federations of Kubernetes Clusters can include clusters running in
different cloud providers (such as Google Cloud or AWS), and on-premises
(such as on OpenStack). Simply create all of the clusters that you
require, in the appropriate cloud providers and/or locations, and
register each cluster's API endpoint and credentials with your
Federation API Server (See the
[federation admin guide](/docs/admin/federation/) for details).

Thereafter, your applications and services can span different clusters
and cloud providers as described in more detail below.

## Creating a federated service

This is done in the usual way, for example:

``` shell
kubectl --context=federation-cluster create -f services/nginx.yaml
```

The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation API endpoint, with the appropriate
credentials. If you have not yet configured such a context, visit the
[federation admin guide](/docs/admin/federation/) or one of the
[administration tutorials](https://github.com/kelseyhightower/kubernetes-cluster-federation)
to find out how to do so.

As described above, the Federated Service will automatically create
and maintain matching Kubernetes services in all of the clusters
underlying your federation.

You can verify this by checking in each of the underlying clusters, for example:

``` shell
kubectl --context=gce-asia-east1a get services nginx
NAME     TYPE        CLUSTER-IP     EXTERNAL-IP      PORT(S)   AGE
nginx    ClusterIP   10.63.250.98   104.199.136.89   80/TCP    9m
```

The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. The name and
namespace of the underlying services will automatically match those of
the Federated Service that you created above (and if you happen to
have had services of the same name and namespace already existing in
any of those clusters, they will be automatically adopted by the
Federation and updated to conform with the specification of your
Federated Service - either way, the end result will be the same).

The status of your Federated Service will automatically reflect the
real-time status of the underlying Kubernetes services, for example:

``` shell
kubectl --context=federation-cluster describe services nginx
```
```
Name:                   nginx
Namespace:              default
Labels:                 run=nginx
Annotations:            <none>
Selector:               run=nginx
Type:                   LoadBalancer
IP:                     10.63.250.98
LoadBalancer Ingress:   104.197.246.190, 130.211.57.243, 104.196.14.231, 104.199.136.89, ...
Port:                   http    80/TCP
Endpoints:              <none>
Session Affinity:       None
Events:                 <none>
```

{{< note >}}
The 'LoadBalancer Ingress' addresses of your Federated Service
correspond with the 'LoadBalancer Ingress' addresses of all of the
underlying Kubernetes services (once these have been allocated - this
may take a few seconds). For inter-cluster and inter-cloud-provider
networking between service shards to work correctly, your services
need to have an externally visible IP address. [Service Type:
Loadbalancer](/docs/concepts/services-networking/service/#loadbalancer)
is typically used for this, although other options
(for example [External IPs](/docs/concepts/services-networking/service/#external-ips)) exist.
{{< /note >}}

Note also that we have not yet provisioned any backend Pods to receive
the network traffic directed to these addresses (that is 'Service
Endpoints'), so the Federated Service does not yet consider these to
be healthy service shards, and has accordingly not yet added their
addresses to the DNS records for this Federated Service (more on this
aspect later).

## Adding backend pods

To render the underlying service shards healthy, we need to add
backend Pods behind them. This is currently done directly against the
API endpoints of the underlying clusters (although in future the
Federation server will be able to do all this for you with a single
command, to save you the trouble). For example, to create backend Pods
in 13 underlying clusters:

``` shell
for CLUSTER in asia-east1-c asia-east1-a asia-east1-b \
                        europe-west1-d europe-west1-c europe-west1-b \
                        us-central1-f us-central1-a us-central1-b us-central1-c \
                        us-east1-d us-east1-c us-east1-b
do
  kubectl --context=$CLUSTER run nginx --image=nginx:1.11.1-alpine --port=80
done
```

Note that `kubectl run` automatically adds the `run=nginx` labels required to associate the backend pods with their services.

## Verifying public DNS records

Once the above Pods have successfully started and have begun listening
for connections, Kubernetes will report them as healthy endpoints of
the service in that cluster (through automatic health checks). The Cluster
Federation will in turn consider each of these
service 'shards' to be healthy, and place them in serving by
automatically configuring corresponding public DNS records. You can
use your preferred interface to your configured DNS provider to verify
this. For example, if your Federation is configured to use Google
Cloud DNS, and a managed DNS domain 'example.com':

``` shell
gcloud dns managed-zones describe example-dot-com
```
```
creationTime: '2016-06-26T18:18:39.229Z'
description: Example domain for Kubernetes Cluster Federation
dnsName: example.com.
id: '3229332181334243121'
kind: dns#managedZone
name: example-dot-com
nameServers:
- ns-cloud-a1.googledomains.com.
- ns-cloud-a2.googledomains.com.
- ns-cloud-a3.googledomains.com.
- ns-cloud-a4.googledomains.com.
```

```shell
gcloud dns record-sets list --zone example-dot-com
```
```
NAME                                                            TYPE      TTL     DATA
example.com.                                                    NS        21600   ns-cloud-e1.googledomains.com., ns-cloud-e2.googledomains.com.
example.com.                                                    OA        21600   ns-cloud-e1.googledomains.com. cloud-dns-hostmaster.google.com. 1 21600 3600 1209600 300
nginx.mynamespace.myfederation.svc.example.com.                 A         180     104.197.246.190, 130.211.57.243, 104.196.14.231, 104.199.136.89,...
nginx.mynamespace.myfederation.svc.us-central1-a.example.com.   A         180     104.197.247.191
nginx.mynamespace.myfederation.svc.us-central1-b.example.com.   A         180     104.197.244.180
nginx.mynamespace.myfederation.svc.us-central1-c.example.com.   A         180     104.197.245.170
nginx.mynamespace.myfederation.svc.us-central1-f.example.com.   CNAME     180     nginx.mynamespace.myfederation.svc.us-central1.example.com.
nginx.mynamespace.myfederation.svc.us-central1.example.com.     A         180     104.197.247.191, 104.197.244.180, 104.197.245.170
nginx.mynamespace.myfederation.svc.asia-east1-a.example.com.    A         180     130.211.57.243
nginx.mynamespace.myfederation.svc.asia-east1-b.example.com.    CNAME     180     nginx.mynamespace.myfederation.svc.asia-east1.example.com.
nginx.mynamespace.myfederation.svc.asia-east1-c.example.com.    A         180     130.211.56.221
nginx.mynamespace.myfederation.svc.asia-east1.example.com.      A         180     130.211.57.243, 130.211.56.221
nginx.mynamespace.myfederation.svc.europe-west1.example.com.    CNAME     180     nginx.mynamespace.myfederation.svc.example.com.
nginx.mynamespace.myfederation.svc.europe-west1-d.example.com.  CNAME     180     nginx.mynamespace.myfederation.svc.europe-west1.example.com.
... etc.
```

{{< note >}}
If your Federation is configured to use AWS Route53, you can use one of the equivalent AWS tools, for example:

``` shell
aws route53 list-hosted-zones
```
and

``` shell
aws route53 list-resource-record-sets --hosted-zone-id Z3ECL0L9QLOVBX
```
{{< /note >}}

Whatever DNS provider you use, any DNS query tool (for example 'dig'
or 'nslookup') will of course also allow you to see the records
created by the Federation for you. Note that you should either point
these tools directly at your DNS provider (such as `dig
@ns-cloud-e1.googledomains.com...`) or expect delays in the order of
your configured TTL (180 seconds, by default) before seeing updates,
due to caching by intermediate DNS servers.

### Some notes about the above example

1. Notice that there is a normal ('A') record for each service shard that has at least one healthy backend endpoint. For example, in us-central1-a, 104.197.247.191 is the external IP address of the service shard in that zone, and in asia-east1-a the address is 130.211.56.221.
2. Similarly, there are regional 'A' records which include all healthy shards in that region. For example, 'us-central1'.  These regional records are useful for clients which do not have a particular zone preference, and as a building block for the automated locality and failover mechanism described below.
3. For zones where there are currently no healthy backend endpoints, a CNAME ('Canonical Name') record is used to alias (automatically redirect) those queries to the next closest healthy zone.  In the example, the service shard in us-central1-f currently has no healthy backend endpoints (that is Pods), so a CNAME record has been created to automatically redirect queries to other shards in that region (us-central1 in this case).
4. Similarly, if no healthy shards exist in the enclosing region, the search progresses further afield. In the europe-west1-d availability zone, there are no healthy backends, so queries are redirected to the broader europe-west1 region (which also has no healthy backends), and onward to the global set of healthy addresses (' nginx.mynamespace.myfederation.svc.example.com.').

The above set of DNS records is automatically kept in sync with the
current state of health of all service shards globally by the
Federated Service system. DNS resolver libraries (which are invoked by
all clients) automatically traverse the hierarchy of 'CNAME' and 'A'
records to return the correct set of healthy IP addresses. Clients can
then select any one of the returned addresses to initiate a network
connection (and fail over automatically to one of the other equivalent
addresses if required).

## Discovering a federated service

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
DNS name of the form ```"<servicename>.<namespace>.<federationname>"```
to resolve Federated Services. For example, you might use
`myservice.mynamespace.myfederation`. Using a different DNS name also
avoids having your existing applications accidentally traversing
cross-zone or cross-region networks and you incurring perhaps unwanted
network charges or latency, without you explicitly opting in to this
behavior.

So, using our NGINX example service above, and the Federated Service
DNS name form just described, let's consider an example: A Pod in a
cluster in the `us-central1-f` availability zone needs to contact our
NGINX service. Rather than use the service's traditional cluster-local
DNS name (`"nginx.mynamespace"`, which is automatically expanded
to `"nginx.mynamespace.svc.cluster.local"`) it can now use the
service's Federated DNS name, which is
`"nginx.mynamespace.myfederation"`. This will be automatically
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
expanded to ```"nginx.mynamespace.myfederation.svc.us-central1-f.example.com"```
(that is, logically "find the external IP of one of the shards closest to
my availability zone"). This expansion is performed automatically by
KubeDNS, which returns the associated CNAME record. This results in
automatic traversal of the hierarchy of DNS records in the above
example, and ends up at one of the external IPs of the Federated
Service in the local us-central1 region (that is 104.197.247.191,
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
nginx.acme.com           CNAME nginx.mynamespace.myfederation.svc.example.com.
```
That way your clients can always use the short form on the left, and
always be automatically routed to the closest healthy shard on their
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
required (for example, when all of the endpoints behind a service, or perhaps
the entire cluster or availability zone go down, or conversely recover
from an outage). Due to the latency inherent in DNS caching (the cache
timeout, or TTL for Federated Service DNS records is configured to 3
minutes, by default, but can be adjusted), it may take up to that long
for all clients to completely fail over to an alternative cluster in
the case of catastrophic failure. However, given the number of
discrete IP addresses which can be returned for each regional service
endpoint (such as us-central1 above, which has three alternatives)
many clients will fail over automatically to one of the alternative
IP's in less time than that given appropriate configuration.

{{% /capture %}}

{{% capture discussion %}}

## Troubleshooting

### I cannot connect to my cluster federation API
Check that your

1. Client (typically kubectl) is correctly configured (including API endpoints and login credentials).
2. Cluster Federation API server is running and network-reachable.

See the [federation admin guide](/docs/admin/federation/) to learn
how to bring up a cluster federation correctly (or have your cluster administrator do this for you), and how to correctly configure your client.

### I can create a federated service successfully against the cluster federation API, but no matching services are created in my underlying clusters
Check that:

1. Your clusters are correctly registered in the Cluster Federation API (`kubectl describe clusters`).
2. Your clusters are all 'Active'. This means that the cluster Federation system was able to connect and authenticate against the clusters' endpoints. If not, consult the logs of the federation-controller-manager pod to ascertain what the failure might be. 
      ```
      kubectl --namespace=federation logs $(kubectl get pods --namespace=federation -l module=federation-controller-manager -o name)
      ```
3. That the login credentials provided to the Cluster Federation API for the clusters have the correct authorization and quota to create services in the relevant namespace in the clusters.  Again you should see associated error messages providing more detail in the above log file if this is not the case.
4. Whether any other error is preventing the service creation operation from succeeding (look for `service-controller` errors in the output of `kubectl logs federation-controller-manager --namespace federation`).

### I can create a federated service successfully, but no matching DNS records are created in my DNS provider.
Check that:

1. Your federation name, DNS provider, DNS domain name are configured correctly.  Consult the [federation admin guide](/docs/admin/federation/) or  [tutorial](https://github.com/kelseyhightower/kubernetes-cluster-federation) to learn
how to configure your Cluster Federation system's DNS provider (or have your cluster administrator do this for you).
2. Confirm that the Cluster Federation's service-controller is successfully connecting to and authenticating against your selected DNS provider (look for `service-controller` errors or successes in the output of `kubectl logs federation-controller-manager --namespace federation`).
3. Confirm that the Cluster Federation's service-controller is successfully creating DNS records in your DNS provider (or outputting errors in its logs explaining in more detail what's failing).

### Matching DNS records are created in my DNS provider, but clients are unable to resolve against those names
Check that:

1. The DNS registrar that manages your federation DNS domain has been correctly configured to point to your configured DNS provider's nameservers.  See for example [Google Domains Documentation](https://support.google.com/domains/answer/3290309?hl=en&ref_topic=3251230) and [Google Cloud DNS Documentation](https://cloud.google.com/dns/update-name-servers), or equivalent guidance from your domain registrar and DNS provider.

### This troubleshooting guide did not help me solve my problem

1. Please use one of our [support channels](/docs/tasks/debug-application-cluster/troubleshooting/) to seek assistance.

## For more information

 * [Federation proposal](https://git.k8s.io/community/contributors/design-proposals/multicluster/federation.md) details use cases that motivated this work.
{{% /capture %}}
