---
title: Allocate Devices to Workloads with DRA
content_type: task
weight: 10
---
{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->

This page shows you how to allocate devices to your Pods by using
_dynamic resource allocation (DRA)_. These instructions are for cluster
administrators and workload operators. 

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

{{< include "task-tutorial-prereqs.md" >}}

* Ensure that you have a device that you can directly or indirectly attach to
  your nodes.

<!-- steps -->

## Attach devices and install drivers {#attach-devices-install-drivers}

For Kubernetes to identify and allocate resources using DRA, you must ensure
that those resources are attached to nodes and that DRA-compatible drivers are
installed. How you do this depends on the specific device and driver, so ensure
that you follow the relevant documentation. Before you proceed to
[Set up DRA in the cluster](#set-up-dra-cluster), ensure that the devices and
drivers are compatible with DRA.

## Set up DRA in the cluster {#set-up-dra-cluster}

To let Kubernetes allocate resources to your Pods with DRA, complete the
following configuration steps:

1.  Enable the `DynamicResourceAllocation`
    [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
    on all of the following components:
   
    * `kube-apiserver`
    * `kube-controller-manager`
    * `kube-scheduler`
    * `kubelet`

1.  Enable the following
    {{< glossary_tooltip text="API groups" term_id="api-group" >}}:

    * `resource.k8s.io/v1beta1`: required for DRA to function.
    * `resource.k8s.io/v1beta2`: optional, recommended improvements to the user
    experience.
     
    For more information, see
    [Enabling or disabling API groups](/docs/reference/using-api/#enabling-or-disabling).
   
1.  To verify that the cluster is configured correctly, try to list
    DeviceClasses:

    ```shell
    kubectl get deviceclasses
    ```
    If your cluster supports DRA, the response is either a list of DeviceClasses
    or the following:

    ```
    No resources found
    ```
 
If DRA isn't correctly configured, the output of the preceding command is
similar to the following:
   
```
error: the server doesn't have a resource type "deviceclasses"
```
Try the following troubleshooting steps:

1. Ensure that the `kube-scheduler` component has the `DynamicResourceAllocation`
   feature gate enabled *and* uses the
   [v1 configuration API](/docs/reference/config-api/kube-scheduler-config.v1/).
   If you use a custom configuration, you might need to perform additional steps
   to enable the `DynamicResource` plugin.
1. Restart the `kube-apiserver` component and the `kube-controller-manager`
   component to propagate the API group changes.
   
## Create a DeviceClass {#create-deviceclass}

{{< glossary_definition term_id="deviceclass" length="all" >}}

In addition to any DeviceClasses that device drivers install by default, cluster
administrators can create custom DeviceClasses. You can use
[common expression language (CEL)](https://cel.dev) to perform fine-grained
filtering based on specific device attributes or capacity. The available
parameters for filtering depend on the device and the drivers.

1. Check whether the device drivers have created
   {{< glossary_tooltip term_id="resourceslice" text="ResourceSlices" >}} for the
   devices:
   
   ```shell
   kubectl get resourceslices
   ```
   The output is a list of available ResourceSlices. If the output doesn't
   display the specific device that you want, or if the output is empty, the
   driver hasn't registered the device yet.
   
1. Save the following example DeviceClass as `basic-dra-class.yaml`:

   ```yaml
   apiVersion: resource.k8s.io/v1beta2
   kind: DeviceClass
   metadata:
     name: example-device-class
   spec:
     selectors:
     - cel:
         expression: |-
           device.driver == "resource-driver.example.com"
   ```
   This DeviceClass lets you request devices that are managed by the
   `resource-driver.example.com` driver.

1. Create the DeviceClass: 

   ```shell
   kubectl apply -f basic-dra-class.yaml
   ```

Workload operators can reference the DeviceClass in their ResourceClaims or
ResourceClaimTemplates, and can filter for specific device configurations in
those claims.

## Claim resources {#claim-resources}

You can request resources like devices from a DeviceClass by using
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}. You can
directly create a ResourceClaim or use a
{{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}
to let Kubernetes generate and manage per-Pod ResourceClaims. 

### Create a ResourceClaim {#create-resourceclaim}

Manually create ResourceClaims if you want multiple Pods to share access to the
same devices, or if you want a claim to exist beyond the lifetime of a Pod.
If you directly reference a specific ResourceClaim in a Pod, that ResourceClaim
must already exist in the cluster. If a referenced ResourceClaim doesn't exist,
the Pod remains in a pending state until the ResourceClaim is created. 

You can reference an auto-generated ResourceClaim in a Pod, but this isn't
recommended because auto-generated ResourceClaims are bound to the lifetime of
the Pod that triggered the generation.

1. Save the following ResourceClaim as `basic-dra-resourceclaim.yaml`:

   ```yaml
   apiVersion: resource.k8s.io/v1beta2
   kind: ResourceClaim
   metadata:
     name: big-blue-claim
   spec:
     devices:
       requests:
       - name: big-blue-request
         exactly:
           deviceClassName: example-device-class
           allocationMode: All
           selectors:
           - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "blue" &&
                device.attributes["resource-driver.example.com"].size == "big"
   ```
   This ResourceClaim requests devices in the `example-device-class` DeviceClass
   that match both of the following parameters:

   * `resource-driver.example.com/color` attribute with a value of `blue`
   * `resource-driver.example.com/size` attribute with a value of `big`

   The `constraints` field indicates that only devices that have an attribute
   named `resource-driver.example.com/color` can be allocated to this
   ResourceClaim.

1. Create the ResourceClaim: 

   ```shell
   kubectl apply -f basic-dra-resourceclaim.yaml
   ```

For every available field, see the
{{< api-reference page="workload-resources/resource-claim-v1beta2" text="ResourceClaim reference" >}}.

### Create a ResourceClaimTemplate {#create-resourceclaimtemplate}

Create a ResourceClaimTemplate if you want every Pod to have access to separate
devices that have similar configurations. For example, you might want simultaneous
access to devices for Pods in a Job that uses
[parallel execution](/docs/concepts/workloads/controllers/job/#parallel-jobs).

1. Save the following ResourceClaimTemplate as
   `basic-dra-resourceclaimtemplate.yaml`:

   ```yaml
   apiVersion: resource.k8s.io/v1beta2
   kind: ResourceClaimTemplate
   metadata:
     name: large-black-cat-claim-template
   spec:
     spec:
       devices:
         constraints:
         - matchAttribute: "resource-driver.example.com/cat"
         requests:
         - name: large-black-cat-claim
           exactly:
             deviceClassName: resource-driver.example.com
             selectors:
             - cel:
                expression: |-
                   device.attributes["resource-driver.example.com"].color == "black" &&
                   device.attributes["resource-driver.example.com"].size == "large"
   ``` 
   This ResourceClaimTemplate defines a ResourceClaim that does the following
   filtering:

   * Selects devices that have the following attributes:
       * `resource-driver.example.com/color` attribute with a value of `black`
       * `resource-driver.example.com/size` attribute with a value of `large`
   * Limits the devices that can be allocated to only devices that have the
     `resource-driver.example.com/cat` attribute.

1. Create the ResourceClaimTemplate: 

   ```shell
   kubectl apply -f basic-dra-resourceclaimtemplate.yaml
   ```

Kubernetes only generates ResourceClaims when you request this
ResourceClaimTemplate in a workload.

## Request devices in workloads using DRA {#request-devices-workloads}

To request device allocation, specify a ResourceClaim or a ResourceClaimTemplate
in the `resourceClaims` field of the Pod specification. Then, request a specific
claim by name in the `resources.claims` field of a container in that Pod.
You can specify multiple entries in the `resourceClaims` field and use specific
claims in different containers.

1. Save the following Job as `basic-dra-job.yaml`:

   ```yaml
   apiVersion: batch/v1
   kind: Job
   metadata:
     name: job-with-cats
   spec:
     completions: 10
     parallelism: 2
     template:
       spec:
         restartPolicy: Never
         containers:
         - name: container0
           image: ubuntu:24.04
           command: ["sleep", "9999"]
           resources:
             claims:
             - name: cat-0
         - name: container1
           image: ubuntu:24.04
           command: ["sleep", "9999"]
           resources:
             claims:
             - name: cat-1
         resourceClaims:
         - name: cat-0
           resourceClaimTemplateName: large-black-cat-claim-template
         - name: cat-1
           resourceClaimName: big-blue-claim
   ```
   Each Pod in this Job has the following properties:
   
   * Makes a ResourceClaimTemplate named `cat-0` and a ResourceClaim named
     `cat-1` available to containers.
   * Runs the following containers:
       * `container0` requests the devices from the `cat-0` 
         ResourceClaimTemplate. 
       * `container1` requests the devices from the `cat-1` ResourceClaim.

1. Create the Job: 

   ```shell
   kubectl apply -f basic-dra-job.yaml
   ```

When you create this Job, devices are allocated as follows:

* `container0` in every Pod gets access to a separate device because the `cat-0`
  claim is a ResourceClaimTemplate.
* `container1` in every Pod shares access to a _specific_ device because the `cat-1`
  claim is a specific ResourceClaim.
