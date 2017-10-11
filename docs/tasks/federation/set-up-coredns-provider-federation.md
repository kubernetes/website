---
title: Set up CoreDNS as DNS provider for Cluster Federation
---

{% capture overview %}

This page shows how to configure and deploy CoreDNS to be used as the
DNS provider for Cluster Federation.

{% endcapture %}


{% capture objectives %}

* Configure and deploy CoreDNS server
* Bring up federation with CoreDNS as dns provider
* Setup CoreDNS server in nameserver lookup chain

{% endcapture %}


{% capture prerequisites %}

* You need to have a running Kubernetes cluster (which is
referenced as host cluster). Please see one of the
[getting started](/docs/setup/) guides for
installation instructions for your platform.
* Support for `LoadBalancer` services in member clusters of federation is
mandatory to enable `CoreDNS` for service discovery across federated clusters.

{% endcapture %}


{% capture lessoncontent %}

## Deploying CoreDNS and etcd charts

CoreDNS can be deployed in various configurations. Explained below is a
reference and can be tweaked to suit the needs of the platform and the
cluster federation.

To deploy CoreDNS, we shall make use of helm charts. CoreDNS will be
deployed with [etcd](https://coreos.com/etcd) as the backend and should
be pre-installed. etcd can also be deployed using helm charts. Shown
below are the instructions to deploy etcd.

    helm install --namespace my-namespace --name etcd-operator stable/etcd-operator
    helm upgrade --namespace my-namespace --set cluster.enabled=true etcd-operator stable/etcd-operator

*Note: etcd default deployment configurations can be overridden, suiting the
host cluster.*

After deployment succeeds, etcd can be accessed with the
[http://etcd-cluster.my-namespace:2379](http://etcd-cluster.my-namespace:2379) endpoint within the host cluster.

The CoreDNS default configuration should be customized to suit the federation.
Shown below is the Values.yaml, which overrides the default
configuration parameters on the CoreDNS chart.

{% include code.html language="yaml" file="Values.yaml" ghlink="/docs/tasks/federation/Values.yaml" %}

The above configuration file needs some explanation:

 - `isClusterService` specifies whether CoreDNS should be deployed as a
cluster-service, which is the default. You need to set it to false, so
that CoreDNS is deployed as a Kubernetes application service.
 - `serviceType` specifies the type of Kubernetes service to be created
for CoreDNS. You need to choose either "LoadBalancer" or "NodePort" to
make the CoreDNS service accessible outside the Kubernetes cluster.
 - Disable `middleware.kubernetes`, which is enabled by default by
setting `middleware.kubernetes.enabled` to false.
 - Enable `middleware.etcd` by setting `middleware.etcd.enabled` to
true.
 - Configure the DNS zone (federation domain) for which CoreDNS is
authoritative by setting `middleware.etcd.zones` as shown above.
 - Configure the etcd endpoint which was deployed earlier by setting
`middleware.etcd.endpoint`

Now deploy CoreDNS by running

    helm install --namespace my-namespace --name coredns -f Values.yaml stable/coredns

Verify that both etcd and CoreDNS pods are running as expected.


## Deploying Federation with CoreDNS as DNS provider

The Federation control plane can be deployed using `kubefed init`. CoreDNS
can be chosen as the DNS provider by specifying two additional parameters.

    --dns-provider=coredns
    --dns-provider-config=coredns-provider.conf

coredns-provider.conf has below format:

    [Global]
    etcd-endpoints = http://etcd-cluster.my-namespace:2379
    zones = example.com.
    coredns-endpoints = <coredns-server-ip>:<port>

 - `etcd-endpoints` is the endpoint to access etcd.
 - `zones` is the federation domain for which CoreDNS is authoritative and is same as --dns-zone-name flag of `kubefed init`.
 - `coredns-endpoints` is the endpoint to access CoreDNS server. This is an optional parameter introduced from v1.7 onwards.

*Note: middleware.etcd.zones in CoreDNS configuration and --dns-zone-name
flag to kubefed init should match.*


## Setup CoreDNS server in nameserver resolv.conf chain

*Note: The following section applies only to versions prior to v1.7
and will be automatically taken care of if the `coredns-endpoints`
parameter is configured in `coredns-provider.conf` as described in
section above.*

Once the federation control plane is deployed and federated clusters
are joined to the federation, you need to add the CoreDNS server to the
pod's nameserver resolv.conf chain in all the federated clusters as this
self hosted CoreDNS server is not discoverable publicly. This can be
achieved by adding the below line to `dnsmasq` container's arg in
`kube-dns` deployment.

    --server=/example.com./<CoreDNS endpoint>

Replace `example.com` above with federation domain.


Now the federated cluster is ready for cross-cluster service discovery!

{% endcapture %}

{% include templates/tutorial.md %}
