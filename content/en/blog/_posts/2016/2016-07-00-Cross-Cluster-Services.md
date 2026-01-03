---
title: " Cross Cluster Services - Achieving Higher Availability for your Kubernetes Applications "
date: 2016-07-14
slug: cross-cluster-services
url: /blog/2016/07/Cross-Cluster-Services
author: >
  Quinton Hoole (Google),
  Allan Naim (Google),
---

_**Editor's note:** this post is part of a [series of in-depth articles](/blog/2016/07/five-days-of-kubernetes-1-3) on what's new in Kubernetes 1.3_

As Kubernetes users scale their production deployments we’ve heard a clear desire to deploy services across zone, region, cluster and cloud boundaries. Services that span clusters provide geographic distribution, enable hybrid and multi-cloud scenarios and improve the level of high availability beyond single cluster multi-zone deployments. Customers who want their services to span one or more (possibly remote) clusters, need them to be reachable in a consistent manner from both within and outside their clusters.  

In Kubernetes 1.3, our goal was to minimize the friction points and reduce the management/operational overhead associated with deploying a service with geographic distribution to multiple clusters. This post explains how to do this.   

Note: Though the examples used here leverage Google Container Engine ([GKE](https://cloud.google.com/container-engine/)) to provision Kubernetes clusters, they work anywhere you want to deploy Kubernetes.  

Let’s get started. The first step is to create is to create Kubernetes clusters into 4 Google Cloud Platform (GCP) regions using GKE.  


- asia-east1-b
- europe-west1-b
- us-east1-b
- us-central1-b

Let’s run the following commands to build the clusters:  




```
gcloud container clusters create gce-asia-east1 \

  --scopes cloud-platform \

  --zone asia-east1-b

gcloud container clusters create gce-europe-west1 \

  --scopes cloud-platform \

  --zone=europe-west1-b

gcloud container clusters create gce-us-east1 \

  --scopes cloud-platform \

  --zone=us-east1-b

gcloud container clusters create gce-us-central1 \

  --scopes cloud-platform \

  --zone=us-central1-b
 ```


Let’s verify the clusters are created:



```
gcloud container clusters list

NAME              ZONE            MASTER\_VERSION  MASTER\_IP       NUM\_NODES  STATUS  
gce-asia-east1    asia-east1-b    1.2.4           104.XXX.XXX.XXX 3          RUNNING  
gce-europe-west1  europe-west1-b  1.2.4           130.XXX.XX.XX   3          RUNNING  
gce-us-central1   us-central1-b   1.2.4           104.XXX.XXX.XX  3          RUNNING  
gce-us-east1      us-east1-b      1.2.4           104.XXX.XX.XXX  3          RUNNING
 ```



[![](https://lh6.googleusercontent.com/LEMtlOvr6i_iK1DwVmS-ltSKU5PmjrrN287sxwvyiGH-QLjOhF25RUjVTVt4IUo-0oGXvj8bxfRFCxTZa_5Qfv_LjxglshTxcnpm73E6Uy7MgVPTiI2GevdwAogHenZIb2S6A6lr)](https://lh6.googleusercontent.com/LEMtlOvr6i_iK1DwVmS-ltSKU5PmjrrN287sxwvyiGH-QLjOhF25RUjVTVt4IUo-0oGXvj8bxfRFCxTZa_5Qfv_LjxglshTxcnpm73E6Uy7MgVPTiI2GevdwAogHenZIb2S6A6lr)



The next step is to bootstrap the clusters and deploy the federation control plane on one of the clusters that has been provisioned. If you’d like to follow along, refer to Kelsey Hightower’s [tutorial](https://github.com/kelseyhightower/kubernetes-cluster-federation) which walks through the steps involved.



**Federated Services**



[Federated Services](https://github.com/kubernetes/kubernetes/blob/release-1.3/docs/design/federated-services.md) are directed to the Federation API endpoint and specify the desired properties of your service.



Once created, the Federated Service automatically:

- creates matching Kubernetes Services in every cluster underlying your cluster federation,
- monitors the health of those service "shards" (and the clusters in which they reside), and
- manages a set of DNS records in a public DNS provider (like Google Cloud DNS, or AWS Route 53), thus ensuring that clients of your federated service can seamlessly locate an appropriate healthy service endpoint at all times, even in the event of cluster, availability zone or regional outages.

Clients inside your federated Kubernetes clusters (i.e. Pods) will automatically find the local shard of the federated service in their cluster if it exists and is healthy, or the closest healthy shard in a different cluster if it does not.



Federations of Kubernetes Clusters can include clusters running in different cloud providers (e.g. GCP, AWS), and on-premise (e.g. on OpenStack). All you need to do is create your clusters in the appropriate cloud providers and/or locations, and register each cluster's API endpoint and credentials with your Federation API Server.



In our example, we have clusters created in 4 regions along with a federated control plane API deployed in one of our clusters, that we’ll be using to provision our service. See diagram below for visual representation.



 ![](https://lh6.googleusercontent.com/4_s4eMx0Dihz3RHENvFN16WnbaIyLadoQhYp3AYgSijDz5tTwmpuYXw4wufBKUTp1nM1vGyiFpIy6LRu3wJoj4_RXvXj6XqqlBzBB2FCttvLZw-RLaqIVXDjPwHtsGE_Q_920Zqy)



**Creating a Federated Service**



Let’s list out all the clusters in our federation:



```
kubectl --context=federation-cluster get clusters

NAME               STATUS    VERSION   AGE  
gce-asia-east1     Ready               1m  
gce-europe-west1   Ready               57s  
gce-us-central1    Ready               47s  
gce-us-east1       Ready               34s
 ```



Let’s create a federated service object:




```
kubectl --context=federation-cluster create -f services/nginx.yaml
 ```



The '--context=federation-cluster' flag tells kubectl to submit the request to the Federation API endpoint, with the appropriate credentials. The federated service will automatically create and maintain matching Kubernetes services in all of the clusters underlying your federation.



You can verify this by checking in each of the underlying clusters, for example:




```
kubectl --context=gce-asia-east1a get svc nginx  
NAME      CLUSTER-IP     EXTERNAL-IP      PORT(S)   AGE  
nginx     10.63.250.98   104.199.136.89   80/TCP    9m
 ```



The above assumes that you have a context named 'gce-asia-east1a' configured in your client for your cluster in that zone. The name and namespace of the underlying services will automatically match those of the federated service that you created above.



The status of your Federated Service will automatically reflect the real-time status of the underlying Kubernetes services, for example:




```
kubectl --context=federation-cluster describe services nginx  

Name:                   nginx  
Namespace:              default  
Labels:                 run=nginx  
Selector:               run=nginx  
Type:                   LoadBalancer  
IP:           
LoadBalancer Ingress:   104.XXX.XX.XXX, 104.XXX.XX.XXX, 104.XXX.XX.XXX, 104.XXX.XXX.XX  
Port:                   http    80/TCP  
Endpoints:              \<none\>  
Session Affinity:       None  
No events.
 ```



The 'LoadBalancer Ingress' addresses of your federated service corresponds with the 'LoadBalancer Ingress' addresses of all of the underlying Kubernetes services. For inter-cluster and inter-cloud-provider networking between service shards to work correctly, your services need to have an externally visible IP address. Service Type: Loadbalancer is typically used here.



Note also what we have not yet provisioned any backend Pods to receive the network traffic directed to these addresses (i.e. 'Service Endpoints'), so the federated service does not yet consider these to be healthy service shards, and has accordingly not yet added their addresses to the DNS records for this federated service.



**Adding Backend Pods**



To render the underlying service shards healthy, we need to add backend Pods behind them. This is currently done directly against the API endpoints of the underlying clusters (although in future the Federation server will be able to do all this for you with a single command, to save you the trouble). For example, to create backend Pods in our underlying clusters:




```
for CLUSTER in asia-east1-a europe-west1-a us-east1-a us-central1-a  
do  
kubectl --context=$CLUSTER run nginx --image=nginx:1.11.1-alpine --port=80  
done
 ```



**Verifying Public DNS Records**



Once the Pods have successfully started and begun listening for connections, Kubernetes in each cluster (via automatic health checks) will report them as healthy endpoints of the service in that cluster. The cluster federation will in turn consider each of these service 'shards' to be healthy, and place them in serving by automatically configuring corresponding public DNS records. You can use your preferred interface to your configured DNS provider to verify this. For example, if your Federation is configured to use Google Cloud DNS, and a managed DNS domain 'example.com':




```
$ gcloud dns managed-zones describe example-dot-com   

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

$ gcloud dns record-sets list --zone example-dot-com  

NAME                                                                                                 TYPE      TTL     DATA  
example.com.                                                                                       NS     21600  ns-cloud-e1.googledomains.com., ns-cloud-e2.googledomains.com.  
example.com.                                                                                      SOA     21600 ns-cloud-e1.googledomains.com. cloud-dns-hostmaster.google.com. 1 21600 3600 1209600 300  
nginx.mynamespace.myfederation.svc.example.com.                            A     180     104.XXX.XXX.XXX, 130.XXX.XX.XXX, 104.XXX.XX.XXX, 104.XXX.XXX.XX  
nginx.mynamespace.myfederation.svc.us-central1-a.example.com.     A     180     104.XXX.XXX.XXX  
nginx.mynamespace.myfederation.svc.us-central1.example.com.  
nginx.mynamespace.myfederation.svc.us-central1.example.com.         A    180     104.XXX.XXX.XXX, 104.XXX.XXX.XXX, 104.XXX.XXX.XXX  
nginx.mynamespace.myfederation.svc.asia-east1-a.example.com.       A    180     130.XXX.XX.XXX  
nginx.mynamespace.myfederation.svc.asia-east1.example.com.  
nginx.mynamespace.myfederation.svc.asia-east1.example.com.           A    180     130.XXX.XX.XXX, 130.XXX.XX.XXX  
nginx.mynamespace.myfederation.svc.europe-west1.example.com.  CNAME    180   nginx.mynamespace.myfederation.svc.example.com.  
... etc.
 ```



Note: If your Federation is configured to use AWS Route53, you can use one of the equivalent AWS tools, for example:




```
$aws route53 list-hosted-zones

and

$aws route53 list-resource-record-sets --hosted-zone-id Z3ECL0L9QLOVBX
 ```



Whatever DNS provider you use, any DNS query tool (for example 'dig' or 'nslookup') will of course also allow you to see the records created by the Federation for you.



**Discovering a Federated Service from pods Inside your Federated Clusters**



By default, Kubernetes clusters come preconfigured with a cluster-local DNS server ('KubeDNS'), as well as an intelligently constructed DNS search path which together ensure that DNS queries like "myservice", "myservice.mynamespace", "bobsservice.othernamespace" etc issued by your software running inside Pods are automatically expanded and resolved correctly to the appropriate service IP of services running in the local cluster.



With the introduction of Federated Services and Cross-Cluster Service Discovery, this concept is extended to cover Kubernetes services running in any other cluster across your Cluster Federation, globally. To take advantage of this extended range, you use a slightly different DNS name (e.g. myservice.mynamespace.myfederation) to resolve federated services. Using a different DNS name also avoids having your existing applications accidentally traversing cross-zone or cross-region networks and you incurring perhaps unwanted network charges or latency, without you explicitly opting in to this behavior.



So, using our NGINX example service above, and the federated service DNS name form just described, let's consider an example: A Pod in a cluster in the us-central1-a availability zone needs to contact our NGINX service. Rather than use the service's traditional cluster-local DNS name ("nginx.mynamespace", which is automatically expanded to"nginx.mynamespace.svc.cluster.local") it can now use the service's Federated DNS name, which is"nginx.mynamespace.myfederation". This will be automatically expanded and resolved to the closest healthy shard of my NGINX service, wherever in the world that may be. If a healthy shard exists in the local cluster, that service's cluster-local (typically 10.x.y.z) IP address will be returned (by the cluster-local KubeDNS). This is exactly equivalent to non-federated service resolution.



If the service does not exist in the local cluster (or it exists but has no healthy backend pods), the DNS query is automatically expanded to "nginx.mynamespace.myfederation.svc.us-central1-a.example.com". Behind the scenes, this is finding the external IP of one of the shards closest to my availability zone. This expansion is performed automatically by KubeDNS, which returns the associated CNAME record. This results in a traversal of the hierarchy of DNS records in the above example, and ends up at one of the external IP's of the Federated Service in the local us-central1 region.



It is also possible to target service shards in availability zones and regions other than the ones local to a Pod by specifying the appropriate DNS names explicitly, and not relying on automatic DNS expansion. For example, "nginx.mynamespace.myfederation.svc.europe-west1.example.com" will resolve to all of the currently healthy service shards in Europe, even if the Pod issuing the lookup is located in the U.S., and irrespective of whether or not there are healthy shards of the service in the U.S. This is useful for remote monitoring and other similar applications.



**Discovering a Federated Service from Other Clients Outside your Federated Clusters**



For external clients, automatic DNS expansion described is no longer possible. External clients need to specify one of the fully qualified DNS names of the federated service, be that a zonal, regional or global name. For convenience reasons, it is often a good idea to manually configure additional static CNAME records in your service, for example:




```
eu.nginx.acme.com        CNAME nginx.mynamespace.myfederation.svc.europe-west1.example.com.  
us.nginx.acme.com        CNAME nginx.mynamespace.myfederation.svc.us-central1.example.com.  
nginx.acme.com             CNAME nginx.mynamespace.myfederation.svc.example.com.
 ```



That way your clients can always use the short form on the left, and always be automatically routed to the closest healthy shard on their home continent. All of the required failover is handled for you automatically by Kubernetes Cluster Federation.



**Handling Failures of Backend Pods and Whole Clusters**



Standard Kubernetes service cluster-IP's already ensure that non-responsive individual Pod endpoints are automatically taken out of service with low latency. The Kubernetes cluster federation system automatically monitors the health of clusters and the endpoints behind all of the shards of your federated service, taking shards in and out of service as required. Due to the latency inherent in DNS caching (the cache timeout, or TTL for federated service DNS records is configured to 3 minutes, by default, but can be adjusted), it may take up to that long for all clients to completely fail over to an alternative cluster in in the case of catastrophic failure. However, given the number of discrete IP addresses which can be returned for each regional service endpoint (see e.g. us-central1 above, which has three alternatives) many clients will fail over automatically to one of the alternative IP's in less time than that given appropriate configuration.



**Community**



We'd love to hear feedback on Kubernetes Cross Cluster Services. To join the community:

- Post issues or feature requests on [GitHub](https://github.com/kubernetes/kubernetes/tree/release-1.8/federation)
- Join us in the #federation channel on [Slack](https://kubernetes.slack.com/messages/sig-federation)
- Participate in the [Cluster Federation SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-federation)


Please give Cross Cluster Services a try, and let us know how it goes!
