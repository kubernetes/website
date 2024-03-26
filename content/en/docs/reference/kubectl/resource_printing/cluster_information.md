---
title: "Cluster Information"
linkTitle: "Cluster Information"
weight: 7
type: docs
description: >
    Prints Cluster Information
---




## Motivation

It may be necessary to learn about the Kubernetes cluster itself, rather
than just the workloads running in it.  This can be useful for debugging
unexpected behavior.

## Versions

The `kubectl version` prints the client and server versions.  Note that
the client version may not be present for clients built locally from
source.

```bash
kubectl version
```

```bash
Client Version: version.Info{Major:"1", Minor:"9", GitVersion:"v1.9.5", GitCommit:"f01a2bf98249a4db383560443a59bed0c13575df", GitTreeState:"clean", BuildDate:"2018-03-19T19:38:17Z", GoVersion:"go1.9.4", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"11+", GitVersion:"v1.11.6-gke.2", GitCommit:"04ad69a117f331df6272a343b5d8f9e2aee5ab0c", GitTreeState:"clean", BuildDate:"2019-01-04T16:19:46Z", GoVersion:"go1.10.3b4", Compiler:"gc", Platform:"linux/amd64"}
```

{{< alert color="warning" title="Version Skew" >}}
Kubectl supports +/-1 version skew with the Kubernetes cluster.  Kubectl
versions that are more than 1 version ahead of or behind the cluster are
not guaranteed to be compatible.
{{< /alert >}}

## Control Plane and Addons

The `kubectl cluster-info` prints information about the control plane and
add-ons.

```bash
kubectl cluster-info
```

```bash
  Kubernetes master is running at https://1.1.1.1
  GLBCDefaultBackend is running at https://1.1.1.1/api/v1/namespaces/kube-system/services/default-http-backend:http/proxy
  Heapster is running at https://1.1.1.1/api/v1/namespaces/kube-system/services/heapster/proxy
  KubeDNS is running at https://1.1.1.1/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
  Metrics-server is running at https://1.1.1.1/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
```

{{< alert color="success" title="Kube Proxy" >}}
The URLs printed by `cluster-info` can be accessed at `127.0.0.1:8001` by
running `kubectl proxy`. 
{{< /alert >}}

## Nodes

The `kubectl top node` and `kubectl top pod` print information about the
top nodes and pods.

```bash
kubectl top node
```

```bash
  NAME                                 CPU(cores)   CPU%      MEMORY(bytes)   MEMORY%   
  gke-dev-default-pool-e1e7bf6a-cc8b   37m          1%        571Mi           10%       
  gke-dev-default-pool-e1e7bf6a-f0xh   103m         5%        1106Mi          19%       
  gke-dev-default-pool-e1e7bf6a-jfq5   139m         7%        1252Mi          22%       
  gke-dev-default-pool-e1e7bf6a-x37l   112m         5%        982Mi           17%  
```

## APIs

The `kubectl api-versions` and `kubectl api-resources` print information
about the available Kubernetes APIs.  This information is read from the
Discovery Service.

Print the Resource Types available in the cluster.

```bash
kubectl api-resources
```

```bash
NAME                              SHORTNAMES   APIGROUP                       NAMESPACED   KIND
bindings                                                                      true         Binding
componentstatuses                 cs                                          false        ComponentStatus
configmaps                        cm                                          true         ConfigMap
endpoints                         ep                                          true         Endpoints
events                            ev                                          true         Event
limitranges                       limits                                      true         LimitRange
namespaces                        ns                                          false        Namespace
...
```

Print the API versions available in the cluster.

```bash
kubectl api-versions
```

```bash
  admissionregistration.k8s.io/v1beta1
  apiextensions.k8s.io/v1beta1
  apiregistration.k8s.io/v1
  apiregistration.k8s.io/v1beta1
  apps/v1
  apps/v1beta1
  apps/v1beta2
  ...
```

{{< alert color="success" title="Discovery" >}}
The discovery information can be viewed at `127.0.0.1:8001/` by running
`kubectl proxy`.  The Discovery for specific API can be found under either
`/api/v1` or `/apis/<group>/<version>`, depending on the API group -
e.g. `127.0.0.1:8001/apis/apps/v1`
{{< /alert >}}

The `kubectl explain` command can be used to print metadata about specific
Resource types.  This is useful for learning about the type.

```bash
kubectl explain deployment --api-version apps/v1
```

```bash
KIND:     Deployment
VERSION:  apps/v1

DESCRIPTION:
     Deployment enables declarative updates for Pods and ReplicaSets.

FIELDS:
   apiVersion	<string>
     APIVersion defines the versioned schema of this representation of an
     object. Servers should convert recognized schemas to the latest internal
     value, and may reject unrecognized values. More info:
     https://git.k8s.io/community/contributors/devel/api-conventions.md#resources

   kind	<string>
     Kind is a string value representing the REST resource this object
     represents. Servers may infer this from the endpoint the client submits
     requests to. Cannot be updated. In CamelCase. More info:
     https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds

   metadata	<Object>
     Standard object metadata.

   spec	<Object>
     Specification of the desired behavior of the Deployment.

   status	<Object>
     Most recently observed status of the Deployment.
```

 
