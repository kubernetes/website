---
assignees:
- shashidharatd
title: Setting up CoreDNS as DNS provider for Cluster Federation
---

* TOC
{:toc}

This guide explains how to configure and deploy CoreDNS to be used as
DNS provider for Cluster Federation.

CoreDNS can be deployed in various configuration suiting the cluster
federation deployment. In this guide we are explaining CoreDNS
deployment as a reference and can be tweaked to suit the needs of the
platform and the cluster federation.

## Prerequisites

This guide assumes that you have a running Kubernetes cluster (which is
referenced as host cluster). Please see one of the
[getting started](/docs/getting-started-guides/) guides for
installation instructions for your platform.

## Deploying CoreDNS and etcd charts

To deploy CoreDNS we shall make use of helm charts. CoreDNS will be
deployed with [etcd](https://coreos.com/etcd) as the backend and should
be pre-installed. etcd also can be deployed using helm charts. Shown
below are the instructions to deploy etcd.

```shell
$ helm install --namespace my-namespace --name etcd-operator stable/etcd-operator
$ helm upgrade --namespace my-namespace --set cluster.enabled=true etcd-operator stable/etcd-operator
```

> Note: etcd default deployment configurations can be overridden, suiting the
host cluster.

After deployment succeeds, etcd can be accessed with
http://etcd-cluster.my-namespace:2379 endpoint within the host cluster.

CoreDNS default configuration should be customized to suit federation
and shown below is the Values.yaml, which overrides the default
configuration parameters on CoreDNS chart.

```shell
isClusterService: false
serviceType: "LoadBalancer"
middleware:
  kubernetes:
    enabled: false
  etcd:
    enabled: true
    zones:
    - "example.com."
    endpoint: "http://etcd-cluster.my-namespace:2379"
```

The above configuration file needs some explanation:

 - `isClusterService` specifies whether CoreDNS should be deployed as
cluster-service, which is default. You need to set it to false, so that
CoreDNS is deployed as kubernetes application service.
 - `serviceType` specifies the type of kubernetes service to be created
for CoreDNS. You need to choose either "LoadBalancer" or "NodePort" in
order that CoreDNS service is accessible outside the kubernetes
cluster.
 - Disable `middleware.kubernetes`, which is enabled by default by
setting `middleware.kubernetes.enabled` to false.
 - Enable `middleware.etcd` by setting `middleware.etcd.enabled` to
true.
 - Configure the DNS zone (federation domain) for which CoreDNS is
authoritative by setting `middleware.etcd.zones` as shown above.
 - Configure the etcd endpoint which was deployed earlier by setting
`middleware.etcd.endpoint`

Now deploy CoreDNS by running

```shell
$ helm install --namespace my-namespace --name coredns -f Values.yaml stable/coredns
```

Verify that both etcd and CoreDNS pods are running as expected.

## Deploying Federation with CoreDNS as DNS provider

Federation control plane can be deployed using `kubefed init`. CoreDNS
can be chosen as DNS provider by specifying two additional parameters.

* --dns-provider=coredns
* --dns-provider-config=coredns-provider.conf

coredns-provider.conf has below format:

```shell
[Global]
etcd-endpoints = http://etcd-cluster.my-namespace:2379
zones = example.com.
```

 - `etcd-endpoints` is the endpoint to access etcd.
 - `zones` is the federation domain for which CoreDNS is authoritative and is same as --dns-zone-name flag of `kubefed init`.

> Note: middleware.etcd.zones in CoreDNS configuration and --dns-zone-name flag to kubefed init should match.

## Setup CoreDNS server in nameserver resolv.conf chain

Once the federation control plane is deployed and federated clusters
are joined to the federation, you need to add the CoreDNS server to
pod's nameserver resolv.conf chain in all the federated clusters as this
self hosted CoreDNS server is not discoverable publicly. This can be
achieved by adding the below line to `dnsmasq` container's arg in
`kube-dns` deployment.

```shell
        - --server=/example.com./<CoreDNS endpoint>
```

Replace `example.com` above with federation domain.

> Note: Adding CoreDNS server to pod's nameserver resolv.conf chain will be
automated in subsequent releases.


Now the federated cluster is ready for cross-cluster service dicovery !
