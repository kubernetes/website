---
title: "Set Up DRA in a Cluster"
content_type: task
min-kubernetes-server-version: v1.34
weight: 10
---
{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->

This page shows you how to configure _dynamic resource allocation (DRA)_ in a
Kubernetes cluster by enabling API groups and configuring classes of devices.
These instructions are for cluster administrators. 

<!-- body -->

## About DRA {#about-dra}

{{< glossary_definition term_id="dra" length="all" >}}

Ensure that you're familiar with how DRA works and with DRA terminology like
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}},
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}, and
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}.
For details, see
[Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Directly or indirectly attach devices to your cluster. To avoid potential
  issues with drivers, wait until you set up the DRA feature for your
  cluster before you install drivers.

<!-- steps -->

## Optional: enable additional DRA API groups {#enable-dra}

DRA overall is a stable feature in Kubernetes; however, aspects of it may still be alpha or beta.
If you want to use any aspect of DRA that is not yet stable,
and the associated feature relies on a dedicated API kind,
then you must enable the associated alpha or beta API groups.

Some older DRA drivers or workloads might still need the
v1beta1 API from Kubernetes 1.30 or v1beta2 from Kubernetes 1.32.
If and only if support for those is desired, then enable the following
{{< glossary_tooltip text="API groups" term_id="api-group" >}}:

    * `resource.k8s.io/v1beta1`
    * `resource.k8s.io/v1beta2`

Alpha features with separate API types need:

   * `resource.k8s.io/v1alpha3`

For more information, see
[Enabling or disabling API groups](/docs/reference/using-api/#enabling-or-disabling).

## Verify that DRA is enabled {#verify}

To verify that the cluster is configured correctly, try to list DeviceClasses:

```shell
kubectl get deviceclasses
```
If the component configuration was correct, the output is similar to the
following:

```
No resources found
```

If DRA isn't correctly configured, the output of the preceding command is
similar to the following:
   
```
error: the server doesn't have a resource type "deviceclasses"
```

For example, this can occur when the resource.k8s.io API group was disabled.
A similar check is applicable to alpha or beta quality top-level types.

Try the following troubleshooting steps:

1. Reconfigure and restart the `kube-apiserver` component.

1. If the complete `.spec.resourceClaims` field gets removed from Pods, or if
   Pods get scheduled without considering the ResourceClaims, then verify
   that the `DynamicResourceAllocation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is not turned off
   for kube-apiserver, kube-controller-manager, kube-scheduler or the kubelet.

## Install device drivers {#install-drivers}

After you enable DRA for your cluster, you can install the drivers for your
attached devices. For instructions, check the documentation of your device
owner or the project that maintains the device drivers. The drivers that you
install must be compatible with DRA.

To verify that your installed drivers are working as expected, list
ResourceSlices in your cluster:

```shell
kubectl get resourceslices
```
The output is similar to the following:

```
NAME                                                  NODE                DRIVER               POOL                             AGE
cluster-1-device-pool-1-driver.example.com-lqx8x      cluster-1-node-1    driver.example.com   cluster-1-device-pool-1-r1gc     7s
cluster-1-device-pool-2-driver.example.com-29t7b      cluster-1-node-2    driver.example.com   cluster-1-device-pool-2-446z     8s
```

Try the following troubleshooting steps:

1. Check the health of the DRA driver and look for error messages about
   publishing ResourceSlices in its log output. The vendor of the driver
   may have further instructions about installation and troubleshooting.

## Create DeviceClasses {#create-deviceclasses}

You can define categories of devices that your application operators can
claim in workloads by creating
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}. Some device
driver providers might also instruct you to create DeviceClasses during driver
installation.

The ResourceSlices that your driver publishes contain information about the
devices that the driver manages, such as capacity, metadata, and attributes. You
can use {{< glossary_tooltip term_id="cel" >}} to filter for properties in your
DeviceClasses, which can make finding devices easier for your workload
operators.

1.  To find the device properties that you can select in DeviceClasses by using
    CEL expressions, get the specification of a ResourceSlice:

    ```shell
    kubectl get resourceslice <resourceslice-name> -o yaml
    ```
    The output is similar to the following:

    ```yaml
    apiVersion: resource.k8s.io/v1
    kind: ResourceSlice
    # lines omitted for clarity
    spec:
      devices:
      - attributes:
          type:
            string: gpu
        capacity:
          memory:
            value: 64Gi
        name: gpu-0
      - attributes:
          type:
            string: gpu
        capacity:
          memory:
            value: 64Gi
        name: gpu-1
      driver: driver.example.com
      nodeName: cluster-1-node-1
    # lines omitted for clarity
    ```
    You can also check the driver provider's documentation for available
    properties and values.

1.  Review the following example DeviceClass manifest, which selects any device
    that's managed by the `driver.example.com` device driver:

    {{% code_sample file="dra/deviceclass.yaml" %}}

1.  Create the DeviceClass in your cluster:

    ```shell
    kubectl apply -f https://k8s.io/examples/dra/deviceclass.yaml
    ```

## Clean up {#clean-up}

To delete the DeviceClass that you created in this task, run the following
command:

```shell
kubectl delete -f https://k8s.io/examples/dra/deviceclass.yaml
```

## {{% heading "whatsnext" %}}

* [Learn more about DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Allocate Devices to Workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
