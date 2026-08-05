---
layout: blog
title: "Kubernetes 1.26: Alpha API For Dynamic Resource Allocation"
date: 2022-12-15
slug: dynamic-resource-allocation
author: >
  Patrick Ohly (Intel),
  Kevin Klues (NVIDIA)
---

Dynamic resource allocation is a new API for requesting resources. It is a
generalization of the persistent volumes API for generic resources, making it possible to:

- access the same resource instance in different pods and containers,
- attach arbitrary constraints to a resource request to get the exact resource
  you are looking for,
- initialize a resource according to parameters provided by the user.

Third-party resource drivers are responsible for interpreting these parameters
as well as tracking and allocating resources as requests come in.

Dynamic resource allocation is an *alpha feature* and only enabled when the
`DynamicResourceAllocation`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and the
`resource.k8s.io/v1alpha1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} are enabled. For details,
see the `--feature-gates` and `--runtime-config` [kube-apiserver
parameters](/docs/reference/command-line-tools-reference/kube-apiserver/).
The kube-scheduler, kube-controller-manager and kubelet components all need
the feature gate enabled as well.

The default configuration of kube-scheduler enables the `DynamicResources`
plugin if and only if the feature gate is enabled. Custom configurations may
have to be modified to include it.

Once dynamic resource allocation is enabled, resource drivers can be installed
to manage certain kinds of hardware. Kubernetes has a test driver that is used
for end-to-end testing, but also can be run manually. See
[below](#running-the-test-driver) for step-by-step instructions.

## API

The new `resource.k8s.io/v1alpha1` {{< glossary_tooltip text="API group" term_id="api-group" >}}
provides four new types:

ResourceClass
: Defines which resource driver handles a certain kind of
  resource and provides common parameters for it. ResourceClasses
  are created by a cluster administrator when installing a resource
  driver.

ResourceClaim
: Defines a particular resource instances that is required by a
  workload. Created by a user (lifecycle managed manually, can be shared
  between different Pods) or for individual Pods by the control plane based on
  a ResourceClaimTemplate (automatic lifecycle, typically used by just one
  Pod).

ResourceClaimTemplate
: Defines the spec and some meta data for creating
  ResourceClaims. Created by a user when deploying a workload.

PodScheduling
: Used internally by the control plane and resource drivers
  to coordinate pod scheduling when ResourceClaims need to be allocated
  for a Pod.

Parameters for ResourceClass and ResourceClaim are stored in separate objects,
typically using the type defined by a {{< glossary_tooltip
term_id="CustomResourceDefinition" text="CRD" >}} that was created when
installing a resource driver.

With this alpha feature enabled, the `spec` of Pod defines ResourceClaims that are needed for a Pod
to run: this information goes into a new
`resourceClaims` field. Entries in that list reference either a ResourceClaim
or a ResourceClaimTemplate. When referencing a ResourceClaim, all Pods using
this `.spec` (for example, inside a Deployment or StatefulSet) share the same
ResourceClaim instance. When referencing a ResourceClaimTemplate, each Pod gets
its own ResourceClaim instance.

For a container defined within a Pod, the `resources.claims` list
defines whether that container gets
access to these resource instances, which makes it possible to share resources
between one or more containers inside the same Pod. For example, an init container could
set up the resource before the application uses it.

Here is an example of a fictional resource driver. Two ResourceClaim objects
will get created for this Pod and each container gets access to one of them.

Assuming a resource driver called `resource-driver.example.com` was installed
together with the following resource class:

```yaml
apiVersion: resource.k8s.io/v1alpha1
kind: ResourceClass
name: resource.example.com
driverName: resource-driver.example.com
```

An end-user could then allocate two specific resources of type
`resource.example.com` as follows:

```yaml
---
apiVersion: cats.resource.example.com/v1
kind: ClaimParameters
name: large-black-cats
spec:
  color: black
  size: large
---
apiVersion: resource.k8s.io/v1alpha1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cats
spec:
  spec:
    resourceClassName: resource.example.com
    parametersRef:
      apiGroup: cats.resource.example.com
      kind: ClaimParameters
      name: large-black-cats
–--
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  containers: # two example containers; each container claims one cat resource
  - name: first-example
    image: ubuntu:22.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: second-example
    image: ubuntu:22.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  resourceClaims:
  - name: cat-0
    source:
      resourceClaimTemplateName: large-black-cats
  - name: cat-1
    source:
      resourceClaimTemplateName: large-black-cats
```

## Scheduling

In contrast to native resources (such as CPU or RAM) and
[extended resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
(managed by a device plugin, advertised by kubelet), the scheduler has no knowledge of what
dynamic resources are available in a cluster or how they could be split up to
satisfy the requirements of a specific ResourceClaim. Resource drivers are
responsible for that. Drivers mark ResourceClaims as _allocated_ once resources
for it are reserved. This also then tells the scheduler where in the cluster a
claimed resource is actually available.

ResourceClaims can get resources allocated as soon as the ResourceClaim
is created (_immediate allocation_), without considering which Pods will use
the resource. The default (_wait for first consumer_) is to delay allocation until
a Pod that relies on the ResourceClaim becomes eligible for scheduling.
This design with two allocation options is similar to how Kubernetes handles
storage provisioning with PersistentVolumes and PersistentVolumeClaims.

In the wait for first consumer mode, the scheduler checks all ResourceClaims needed
by a Pod. If the Pods has any ResourceClaims, the scheduler creates a PodScheduling
(a special object that requests scheduling details on behalf of the Pod). The PodScheduling
has the same name and namespace as the Pod and the Pod as its as owner.
Using its PodScheduling, the scheduler informs the resource drivers
responsible for those ResourceClaims about nodes that the scheduler considers
suitable for the Pod. The resource drivers respond by excluding nodes that
don't have enough of the driver's resources left.

Once the scheduler has that resource
information, it selects one node and stores that choice in the PodScheduling
object. The resource drivers then allocate resources based on the relevant
ResourceClaims so that the resources will be available on that selected node.
Once that resource allocation is complete, the scheduler attempts to schedule the Pod
to a suitable node. Scheduling can still fail at this point; for example, a different Pod could
be scheduled to the same node in the meantime. If this happens, already allocated
ResourceClaims may get deallocated to enable scheduling onto a different node.

As part of this process, ResourceClaims also get reserved for the
Pod. Currently ResourceClaims can either be used exclusively by a single Pod or
an unlimited number of Pods.

One key feature is that Pods do not get scheduled to a node unless all of
their resources are allocated and reserved. This avoids the scenario where
a Pod gets scheduled onto one node and then cannot run there, which is bad
because such a pending Pod also blocks all other resources like RAM or CPU that were
set aside for it.

## Limitations

The scheduler plugin must be involved in scheduling Pods which use
ResourceClaims. Bypassing the scheduler by setting the `nodeName` field leads
to Pods that the kubelet refuses to start because the ResourceClaims are not
reserved or not even allocated. It may be possible to remove this
[limitation](https://github.com/kubernetes/kubernetes/issues/114005) in the
future.

## Writing a resource driver

A dynamic resource allocation driver typically consists of two separate-but-coordinating
components: a centralized controller, and a DaemonSet of node-local kubelet
plugins. Most of the work required by the centralized controller to coordinate
with the scheduler can be handled by boilerplate code. Only the business logic
required to actually allocate ResourceClaims against the ResourceClasses owned
by the plugin needs to be customized. As such, Kubernetes provides
the following package, including APIs for invoking this boilerplate code as
well as a `Driver` interface that you can implement to provide their custom
business logic:

- [k8s.io/dynamic-resource-allocation/controller](https://github.com/kubernetes/dynamic-resource-allocation/tree/release-1.26/controller)

Likewise, boilerplate code can be used to register the node-local plugin with
the kubelet, as well as start a gRPC server to implement the kubelet plugin
API. For drivers written in Go, the following package is recommended:

- [k8s.io/dynamic-resource-allocation/kubeletplugin](https://github.com/kubernetes/dynamic-resource-allocation/tree/release-1.26/kubeletplugin)

It is up to the driver developer to decide how these two components
communicate. The [KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md) outlines an [approach using
CRDs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation#implementing-a-plugin-for-node-resources).

Within SIG Node, we also plan to provide a complete
[example driver](https://github.com/kubernetes-sigs/dra-example-driver) that can serve
as a template for other drivers.

## Running the test driver

The following steps bring up a local, one-node cluster directly from the
Kubernetes source code. As a prerequisite, your cluster must have nodes with a container
runtime that supports the
[Container Device Interface](https://github.com/container-orchestrated-devices/container-device-interface)
(CDI). For example, you can run CRI-O [v1.23.2](https://github.com/cri-o/cri-o/releases/tag/v1.23.2) or later.
Once containerd v1.7.0 is released, we expect that you can run that or any later version.
In the example below, we use CRI-O.

First, clone the Kubernetes source code. Inside that directory, run:

```console
$ hack/install-etcd.sh
...

$ RUNTIME_CONFIG=resource.k8s.io/v1alpha1 \
  FEATURE_GATES=DynamicResourceAllocation=true \
  DNS_ADDON="coredns" \
  CGROUP_DRIVER=systemd \
  CONTAINER_RUNTIME_ENDPOINT=unix:///var/run/crio/crio.sock \
  LOG_LEVEL=6 \
  ENABLE_CSI_SNAPSHOTTER=false \
  API_SECURE_PORT=6444 \
  ALLOW_PRIVILEGED=1 \
  PATH=$(pwd)/third_party/etcd:$PATH \
  ./hack/local-up-cluster.sh -O
...
```

To start using your cluster, you can open up another terminal/tab and run:

```console
$ export KUBECONFIG=/var/run/kubernetes/admin.kubeconfig
```

Once the cluster is up, in another terminal run the test driver controller.
`KUBECONFIG` must be set for all of the following commands.

```console
$ go run ./test/e2e/dra/test-driver --feature-gates ContextualLogging=true -v=5 controller
```

In another terminal, run the kubelet plugin:

```console
$ sudo mkdir -p /var/run/cdi && \
  sudo chmod a+rwx /var/run/cdi /var/lib/kubelet/plugins_registry /var/lib/kubelet/plugins/
$ go run ./test/e2e/dra/test-driver --feature-gates ContextualLogging=true -v=6 kubelet-plugin
```

Changing the permissions of the directories makes it possible to run and (when
using delve) debug the kubelet plugin as a normal user, which is convenient
because it uses the already populated Go cache. Remember to restore permissions
with `sudo chmod go-w` when done. Alternatively, you can also build the binary
and run that as root.

Now the cluster is ready to create objects:

```console
$ kubectl create -f test/e2e/dra/test-driver/deploy/example/resourceclass.yaml
resourceclass.resource.k8s.io/example created

$ kubectl create -f test/e2e/dra/test-driver/deploy/example/pod-inline.yaml
configmap/test-inline-claim-parameters created
resourceclaimtemplate.resource.k8s.io/test-inline-claim-template created
pod/test-inline-claim created

$ kubectl get resourceclaims
NAME                         RESOURCECLASSNAME   ALLOCATIONMODE         STATE                AGE
test-inline-claim-resource   example             WaitForFirstConsumer   allocated,reserved   8s

$ kubectl get pods
NAME                READY   STATUS      RESTARTS   AGE
test-inline-claim   0/2     Completed   0          21s
```

The test driver doesn't do much, it only sets environment variables as defined
in the ConfigMap. The test pod dumps the environment, so the log can be checked
to verify that everything worked:

```console
$ kubectl logs test-inline-claim with-resource | grep user_a
user_a='b'
```

## Next steps

- See the
  [Dynamic Resource Allocation](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)
  KEP for more information on the design.
- Read [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
  in the official Kubernetes documentation.
- You can participate in
  [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md)
  and / or the [CNCF Container Orchestrated Device Working Group](https://github.com/cncf/tag-runtime/blob/master/wg/COD.md).
- You can view or comment on the [project board](https://github.com/orgs/kubernetes/projects/95/views/1)
  for dynamic resource allocation.
- In order to move this feature towards beta, we need feedback from hardware
  vendors, so here's a call to action: try out this feature, consider how it can help
  with problems that your users are having, and write resource drivers…
