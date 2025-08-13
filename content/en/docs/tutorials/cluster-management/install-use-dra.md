---
title: Install Drivers and Allocate Devices with DRA
content_type: tutorial
weight: 60
min-kubernetes-server-version: v1.32
---
<!-- FUTURE MAINTAINERS: 
The original point of this doc was for people (mainly cluster administrators) to
understand the importance of the DRA driver and its interaction with the DRA
APIs. As a result it was a requirement of this tutorial to not use Helm and to
be more direct with all the component installation procedures. While much of
this content is also useful to workload authors, I see the primary audience of
_this_ tutorial as cluster administrators, who I feel also need to understand
how the DRA APIs interact with the driver to maintain them well. If I had to
choose which audience to focus on in this doc, I would choose cluster
administrators. If the prose gets too muddied by considering both of them, I'd
rather make a second tutorial for the workload authors that doesn't go into the
driver at all (since IMHO that is more representative of what we think their
experience should be like) and also potentially goes into much more detailed/ ✨
fun ✨ use cases. 
-->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}


<!-- overview -->
This tutorial shows you how to install {{< glossary_tooltip term_id="dra"
text="DRA" >}} drivers in your cluster and how to use them in conjunction with
the DRA APIs to allocate {{< glossary_tooltip text="devices" term_id="device"
>}} to Pods. This page is intended for cluster administrators.

{{< glossary_tooltip text="Dynamic Resource Allocation (DRA)" term_id="dra" >}}
is a Kubernetes feature that allows a cluster to manage availability and
allocation of hardware resources to satisfy Pod-based claims for hardware
requirements and preferences (see the [DRA Concept
page](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) for more
background). To support this, a mixture of Kubernetes built-in components (like
the Kubernetes scheduler, kubelet, and kube-controller-manager) and third-party
components (called DRA drivers) share the responsibility to advertise, allocate,
prepare, mount, healthcheck, unprepare, and cleanup resources throughout the Pod
lifecycle. These components share information via a series of DRA specific APIs
in the `resource.k8s.io` API group, including {{< glossary_tooltip
text="DeviceClasses" term_id="deviceclass" >}}, {{< glossary_tooltip
text="ResourceSlices" term_id="resourceslice" >}}, {{< glossary_tooltip
text="ResourceClaims" term_id="resourceclaim" >}}, as well as new fields in the
Pod spec itself.

<!-- objectives -->

### {{% heading "objectives" %}}
* Deploy an example DRA driver
* Deploy a Pod requesting a hardware claim using DRA APIs
* Delete a Pod that has a claim

<!-- prerequisites -->
## {{% heading "prerequisites" %}}

Your cluster should support [RBAC](/docs/reference/access-authn-authz/rbac/).
You can try this tutorial with a cluster using
a different authorization mechanism, but in that case you will have to adapt the
steps around defining roles and permissions.

{{< include "task-tutorial-prereqs.md" >}}

This tutorial has been tested with Linux nodes, though it may also work with
other types of nodes.

 {{< version-check >}}

Your cluster also must be configured to use the Dynamic Resource Allocation
feature.
To enable the DRA feature, you must enable the following feature gates and API groups:

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


<!-- lessoncontent -->

## Explore the DRA initial state

With no driver installed or Pod claims yet to satisfy, you can observe the
initial state of a cluster with DRA enabled.

1.  Get a list of {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}:

    ```shell
    kubectl get deviceclasses
    ```
    The output is similar to this:
    ```
    No resources found
    ```

    If you set up a new blank cluster for this tutorial, it's normal to find that
    there are no DeviceClasses. [Learn more about DeviceClasses
    here.](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#deviceclass)

1.  Get a list of  {{< glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}}:

    ```shell
    kubectl get resourceslices
    ```
    The output is similar to this:
    ```
    No resources found
    ```

    If you set up a new blank cluster for this tutorial, it's normal to find that
    there are no ResourceSlices advertised. [Learn more about ResourceSlices
    here.](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceslice)

1.  View {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} and {{<
glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate"
>}}

    ```shell
    kubectl get resourceclaims -A
    kubectl get resourceclaimtemplates -A
    ```
    The output is similar to this:
    ```
    No resources found
    No resources found
    ```

    If you set up a new blank cluster for this tutorial, it's normal to find that
    there are no ResourceClaims or ResourceClaimTemplates as you, the user, have
    not created any. [Learn more about ResourceClaims and ResourceClaimTemplates
    here.](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaims-templates)


At this point, you have confirmed that DRA is enabled and configured properly in
the cluster, and that no DRA drivers have advertised any resources to the DRA
APIs yet.

## Install an example DRA driver {#install-example-driver}  

DRA drivers are third-party applications that run on each node of your cluster
to interface with the hardware of that node and Kubernetes' built-in DRA
components. The installation procedure depends on the driver you choose, but is
likely deployed as a {{< glossary_tooltip term_id="daemonset" >}} to all or a
selection of the nodes (using {{< glossary_tooltip text="selectors"
term_id="selector" >}} or similar mechanisms) in your cluster.

Check your driver's documentation for specific installation instructions, which
may include a Helm chart, a set of manifests, or other deployment tooling.

This tutorial uses an example driver which can be found in the
[kubernetes-sigs/dra-example-driver](https://github.com/kubernetes-sigs/dra-example-driver)
repository to demonstrate driver installation.

### Prepare your cluster for driver installation

To make it easier to cleanup later, create a namespace called `dra-tutorial` in your cluster.

In a production environment, you would likely be using a previously released or
qualified image from the driver vendor or your own organization, and your nodes
would need to have access to the image registry where the driver image is
hosted. In this tutorial, you will use a publicly released image of the
dra-example-driver to simulate access to a DRA driver image.


1.  Create the namespace:

    ```shell
    kubectl create namespace dra-tutorial 
    ```

1.  Confirm your nodes have access to the image by running the following
from within one of your cluster's nodes:

    ```shell
    docker pull registry.k8s.io/dra-example-driver/dra-example-driver:v0.1.0
    ```

### Deploy the DRA driver components

For this tutorial, you will install the critical example resource driver
components individually with `kubectl`.

1.  Create the DeviceClass representing the device types this DRA driver
   supports:

    {{% code_sample language="yaml" file="dra/driver-install/deviceclass.yaml" %}}

    ```shell
    kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/deviceclass.yaml
    ```

1.  Create the ServiceAccount, ClusterRole and ClusterRoleBinding that will
be used by the driver to gain permissions to interact with the Kubernetes API
on this cluster:

      1.  Create the Service Account: 

          {{% code_sample language="yaml" file="dra/driver-install/serviceaccount.yaml" %}}

          ```shell
          kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/serviceaccount.yaml
          ```

      1.  Create the ClusterRole: 

          {{% code_sample language="yaml" file="dra/driver-install/clusterrole.yaml" %}}

          ```shell
          kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/clusterrole.yaml
          ```

      1.  Create the ClusterRoleBinding:

          {{% code_sample language="yaml" file="dra/driver-install/clusterrolebinding.yaml" %}}

          ```shell
          kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/clusterrolebinding.yaml
          ```

1.  Create a {{< glossary_tooltip term_id="priority-class" >}} for the DRA
    driver. The DRA driver component is responsible for important lifecycle
    operations for Pods with claims, so you don't want it to be preempted. Learn
    more about [pod priority and preemption
    here](/docs/concepts/scheduling-eviction/pod-priority-preemption/). Learn
    more about [good practices when maintaining a DRA driver
    here](/docs/concepts/cluster-administration/dra/).

    {{% code_sample language="yaml" file="dra/driver-install/priorityclass.yaml" %}}

    ```shell
    kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/priorityclass.yaml
    ```

1.  Deploy the actual DRA driver as a DaemonSet configured to run the example
   driver binary with the permissions provisioned above.

    {{% code_sample language="yaml" file="dra/driver-install/daemonset.yaml" %}}

    ```shell
    kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/daemonset.yaml
    ```
    It is configured with
      the volume mounts necessary to interact with the underlying Container Device
      Interface (CDI) directory, and to expose its socket to kubelet via the
      kubelet plugins directory.

### Verify the DRA driver installation

1.  Observe the Pods of the DRA driver DaemonSet across all worker nodes:

    ```shell
    kubectl get pod -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
    ```
    The output is similar to this:
    ```
    NAME                                     READY   STATUS    RESTARTS   AGE
    dra-example-driver-kubeletplugin-4sk2x   1/1     Running   0          13s
    dra-example-driver-kubeletplugin-cttr2   1/1     Running   0          13s
    ```


1.  The initial reponsibility of each node's local DRA driver is to update the
cluster with what devices are available to Pods on that node, by publishing its
metadata to the ResourceSlices API. You can check that API to see that each node
with a driver is advertising the device class it represents. 

    Check for available ResourceSlices: 

    ```shell
    kubectl get resourceslices
    ```
    The output is similar to this:
    ```
    NAME                                 NODE           DRIVER            POOL           AGE
    kind-worker-gpu.example.com-k69gd    kind-worker    gpu.example.com   kind-worker    19s
    kind-worker2-gpu.example.com-qdgpn   kind-worker2   gpu.example.com   kind-worker2   19s
    ```

At this point, you have successfully installed the example DRA driver, and
confirmed its initial configuration. You're now ready to use DRA to schedule
Pods.

## Claim resources and deploy a Pod  

To request resources using DRA, you create ResourceClaims or
ResourceClaimTemplates that define the resources that your Pods need. In the
example driver, a memory capacity attribute is exposed for mock GPU devices.
This section shows you how to use {{< glossary_tooltip term_id="cel" >}} to
express your requirements in a ResourceClaim, select that ResourceClaim in a Pod
specification, and observe the resource allocation.

This tutorial showcases only one basic example of a DRA ResourceClaim. Read
[Dynamic Resource
Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) to
learn more about ResourceClaims. 

### Create the ResourceClaim

The Pod manifest itself will include a reference to its relevant ResourceClaim
object, which you will create now. Whatever the claim, the `deviceClassName` is
a required field, narrowing down the scope of the request to a specific device
class. The request itself can include a {{< glossary_tooltip term_id="cel" >}}
expression that references attributes that may be advertised by the driver
managing that device class. 

In this example, you will create a request for any GPU advertising over 10Gi
memory capacity. The attribute exposing capacity from the example driver takes
the form `device.capacity['gpu.example.com'].memory`. Note also that the name of
the claim is set to `some-gpu`.

{{% code_sample language="yaml" file="dra/driver-install/example/resourceclaim.yaml" %}}

```shell
kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/example/resourceclaim.yaml
```

### Create the Pod that references that ResourceClaim

Below is the Pod manifest referencing the ResourceClaim you just made,
`some-gpu`, in the `spec.resourceClaims.resourceClaimName` field. The local name
for that claim, `gpu`, is then used in the
`spec.containers.resources.claims.name` field to allocate the claim to the Pod's
underlying container.

{{% code_sample language="yaml" file="dra/driver-install/example/pod.yaml" %}}

```shell
kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/example/pod.yaml
```

### Explore the DRA state

The cluster now tries to schedule that Pod to a node where Kubernetes can
satisfy the ResourceClaim. In our situation, the DRA driver is deployed on all
nodes, and is advertising mock GPUs on all nodes, all of which have enough
capacity advertised to satisfy the Pod's claim, so this Pod may be scheduled to
any node and any of the mock GPUs on that node may be allocated.

The mock GPU driver injects environment variables in each container it is
allocated to in order to indicate which GPUs _would_ have been injected into
them by a real resource driver and how they would have been configured, so you
can check those environment variables to see how the Pods have been handled by
the system.

1.  Confirm the pod has deployed:

    ```shell
    kubectl get pod pod0 -n dra-tutorial
    ```

    The output is similar to this:
    ```
    NAME   READY   STATUS    RESTARTS   AGE
    pod0   1/1     Running   0          9s
    ```

1.  Observe the pod logs which report the name of the mock GPU allocated:

    ```shell
    kubectl logs pod0 -c ctr0 -n dra-tutorial | grep -E "GPU_DEVICE_[0-9]+=" | grep -v "RESOURCE_CLAIM"
    ```

    The output is similar to this:
    ```
    declare -x GPU_DEVICE_4="gpu-4"
    ```

1.  Observe the ResourceClaim object:

    You can observe the ResourceClaim more closely, first only to see its state
    is allocated and reserved.

    ```shell
    kubectl get resourceclaims -n dra-tutorial
    ```

    The output is similar to this:

    ```
    NAME       STATE                AGE
    some-gpu   allocated,reserved   34s
    ```

    Looking deeper at the `some-gpu` ResourceClaim, you can see that the status stanza includes information about the
    device that has been allocated and for what pod it has been reserved for:

    ```shell
    kubectl get resourceclaim some-gpu -n dra-tutorial -o yaml
    ```

    The output is similar to this:
    {{< highlight yaml "linenos=inline, hl_lines=30-33 41-44, style=emacs" >}}
    apiVersion: v1
    items:
    - apiVersion: resource.k8s.io/v1beta2
      kind: ResourceClaim
      metadata:
        creationTimestamp: "2025-07-29T05:11:52Z"
        finalizers:
        - resource.kubernetes.io/delete-protection
        name: some-gpu
        namespace: dra-tutorial
        resourceVersion: "58357"
        uid: 79e1e8d8-7e53-4362-aad1-eca97678339e
      spec:
        devices:
          requests:
          - exactly:
              allocationMode: ExactCount
              count: 1
              deviceClassName: gpu.example.com
              selectors:
              - cel:
                  expression: device.capacity['gpu.example.com'].memory.compareTo(quantity('10Gi'))
                    >= 0
            name: some-gpu
      status:
        allocation:
          devices:
            results:
            - adminAccess: null
              device: gpu-4
              driver: gpu.example.com
              pool: kind-worker
              request: some-gpu
          nodeSelector:
            nodeSelectorTerms:
            - matchFields:
              - key: metadata.name
                operator: In
                values:
                - kind-worker
        reservedFor:
        - name: pod0
          resource: pods
          uid: fa55b59b-d28d-4f7d-9e5b-ef4c8476dff5
    kind: List
    metadata:
      resourceVersion: ""
    {{< /highlight >}}

1.  Observe the driver by checking the pod logs for pods backing the driver
   daemonset:

    ```shell
    kubectl logs -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
    ```

    The output is similar to this:
    ```
    I0729 05:11:52.679057       1 driver.go:84] NodePrepareResource is called: number of claims: 1
    I0729 05:11:52.684450       1 driver.go:112] Returning newly prepared devices for claim '79e1e8d8-7e53-4362-aad1-eca97678339e': [&Device{RequestNames:[some-gpu],PoolName:kind-worker,DeviceName:gpu-4,CDIDeviceIDs:[k8s.gpu.example.com/gpu=common k8s.gpu.example.com/gpu=79e1e8d8-7e53-4362-aad1-eca97678339e-gpu-4],}]
    ```

You have now successfully deployed a Pod with a DRA based claim, and seen it
scheduled to an appropriate node and the associated DRA APIs updated to reflect
its status.

## Remove the Pod with a claim

When a Pod with a claim is deleted, the DRA driver deallocates the resource so
it can be available for future scheduling. You can observe that by deleting our
pod with a claim and seeing that the state of the ResourceClaim changes.

###  Delete the pod using the resource claim

1.  Delete the pod directly:

    ```shell
    kubectl delete pod pod0 -n dra-tutorial
    ```

    The output is similar to this:

    ```
    pod "pod0" deleted
    ```

### Observe the DRA state

The driver will deallocate the hardware and update the corresponding
ResourceClaim resource that previously held the association.

1.  Check the ResourceClaim is now pending:

    ```shell
    kubectl get resourceclaims -n dra-tutorial
    ```

    The output is similar to this:
    ```
    NAME       STATE     AGE
    some-gpu   pending   76s
    ```

1.  Observe the driver logs and see that it processed unpreparing the device for
   this claim:

    ```shell
    kubectl logs -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
    ```
    The output is similar to this:
    ```
    I0729 05:13:02.144623       1 driver.go:117] NodeUnPrepareResource is called: number of claims: 1
    ```

You have now deleted a Pod that had a claim, and observed that the driver took
action to unprepare the underlying hardware resource and update the DRA APIs to
reflect that the resource is available again for future scheduling.

## {{% heading "cleanup" %}}

To cleanup the resources, delete the namespace for the tutorial which will clean up the ResourceClaims, driver components, and ServiceAccount. Then also delete the cluster level DeviceClass resource and cluster level RBAC resources.

```shell
kubectl delete namespace dra-tutorial
kubectl delete deviceclass gpu.example.com
kubectl delete clusterrole dra-example-driver-role
kubectl delete clusterrolebinding dra-example-driver-role-binding
```

## {{% heading "whatsnext" %}}

* [Learn more about DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Allocate Devices to Workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)