---
title: Allocate Devices to Workloads with DRA
content_type: task
min-kubernetes-server-version: v1.34
weight: 20
---
{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->

This page shows you how to allocate devices to your Pods by using
_dynamic resource allocation (DRA)_. These instructions are for workload
operators. Before reading this page, familiarize yourself with how DRA works and
with DRA terminology like
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} and
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}.
For more information, see
[Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).

<!-- body -->

## About device allocation with DRA {#about-device-allocation-dra}

As a workload operator, you can _claim_ devices for your workloads by creating
ResourceClaims or ResourceClaimTemplates. When you deploy your workload,
Kubernetes and the device drivers find available devices, allocate them to your
Pods, and place the Pods on nodes that can access those devices.

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Ensure that your cluster admin has set up DRA, attached devices, and installed
  drivers. For more information, see
  [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).

<!-- steps -->

## Identify devices to claim {#identify-devices}

Your cluster administrator or the device drivers create
_{{< glossary_tooltip term_id="deviceclass" text="DeviceClasses" >}}_ that
define categories of devices. You can claim devices by using
{{< glossary_tooltip term_id="cel" >}} to filter for specific device properties.

Get a list of DeviceClasses in the cluster:

```shell
kubectl get deviceclasses
```
The output is similar to the following:

```
NAME                 AGE
driver.example.com   16m
```
If you get a permission error, you might not have access to get DeviceClasses.
Check with your cluster administrator or with the driver provider for available
device properties.

## Claim resources {#claim-resources}

You can request resources from a DeviceClass by using 
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}. To
create a ResourceClaim, do one of the following:

* Manually create a ResourceClaim if you want multiple Pods to share access to
  the same devices, or if you want a claim to exist beyond the lifetime of a
  Pod.
* Use a
  {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}
  to let Kubernetes generate and manage per-Pod ResourceClaims. Create a
  ResourceClaimTemplate if you want every Pod to have access to separate devices
  that have similar configurations. For example, you might want simultaneous
  access to devices for Pods in a Job that uses
  [parallel execution](/docs/concepts/workloads/controllers/job/#parallel-jobs).

If you directly reference a specific ResourceClaim in a Pod, that ResourceClaim
must already exist in the cluster. If a referenced ResourceClaim doesn't exist,
the Pod remains in a pending state until the ResourceClaim is created. You can
reference an auto-generated ResourceClaim in a Pod, but this isn't recommended
because auto-generated ResourceClaims are bound to the lifetime of the Pod that
triggered the generation.

To create a workload that claims resources, select one of the following options:

{{< tabs name="claim-resources" >}}
{{% tab name="ResourceClaimTemplate" %}}

Review the following example manifest: 

{{% code_sample file="dra/resourceclaimtemplate.yaml" %}}

This manifest creates a ResourceClaimTemplate that requests devices in the
`example-device-class` DeviceClass that match both of the following parameters:

  * Devices that have a `driver.example.com/type` attribute with a value of
    `gpu`.
  * Devices that have `64Gi` of capacity.

To create the ResourceClaimTemplate, run the following command:

```shell
kubectl apply -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
```

{{% /tab %}}
{{% tab name="ResourceClaim" %}}

Review the following example manifest:

{{% code_sample file="dra/resourceclaim.yaml" %}}

This manifest creates ResourceClaim that requests devices in the
`example-device-class` DeviceClass that match both of the following parameters:

  * Devices that have a `driver.example.com/type` attribute with a value of
    `gpu`.
  * Devices that have `64Gi` of capacity.

To create the ResourceClaim, run the following command:

```shell
kubectl apply -f https://k8s.io/examples/dra/resourceclaim.yaml
```

{{% /tab %}}
{{< /tabs >}}

## Request devices in workloads using DRA {#request-devices-workloads}

To request device allocation, specify a ResourceClaim or a ResourceClaimTemplate
in the `resourceClaims` field of the Pod specification. Then, request a specific
claim by name in the `resources.claims` field of a container in that Pod.
You can specify multiple entries in the `resourceClaims` field and use specific
claims in different containers.

1. Review the following example Job:

   {{% code_sample file="dra/dra-example-job.yaml" %}}

   Each Pod in this Job has the following properties:
   
   * Makes a ResourceClaimTemplate named `separate-gpu-claim` and a
     ResourceClaim named `shared-gpu-claim` available to containers.
   * Runs the following containers:
       * `container0` requests the devices from the `separate-gpu-claim` 
         ResourceClaimTemplate. 
       * `container1` and `container2` share access to the devices from the
         `shared-gpu-claim` ResourceClaim.

1. Create the Job: 

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-example-job.yaml
   ```

Try the following troubleshooting steps:

1. When the workload does not start as expected, drill down from Job
   to Pods to ResourceClaims and check the objects
   at each level with `kubectl describe` to see whether there are any
   status fields or events which might explain why the workload is
   not starting.
1. When creating a Pod fails with `must specify one of: resourceClaimName,
   resourceClaimTemplateName`, check that all entries in `pod.spec.resourceClaims`
   have exactly one of those fields set. If they do, then it is possible
   that the cluster has a mutating Pod webhook installed which was built
   against APIs from Kubernetes < 1.32. Work with your cluster administrator
   to check this.

## Clean up {#clean-up}

To delete the Kubernetes objects that you created in this task, follow these
steps:

1.  Delete the example Job:

    ```shell
    kubectl delete -f https://k8s.io/examples/dra/dra-example-job.yaml
    ```

1.  To delete your resource claims, run one of the following commands:

    * Delete the ResourceClaimTemplate:

      ```shell
      kubectl delete -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
      ```
    * Delete the ResourceClaim:

      ```shell
      kubectl delete -f https://k8s.io/examples/dra/resourceclaim.yaml
      ```

## {{% heading "whatsnext" %}}

* [Learn more about DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
