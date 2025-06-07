---
title: Manage DRA Drivers
content_type: task
weight: 60
---

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->
This page contains a high level background on the third-party and Kubernetes native components involved in providing the Dynamic Resource Allocation feature, in the context of cluster administration and operations. This page then explains what to expect when installing, maintaining, and troubleshooting Dynamic Resource Allocation (DRA) drivers in your cluster.

# Background

TODO: component diagram

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Your cluster also must be configured to use the Dynamic Resource Allocation feature. Depending on the version of your Kubernetes cluster, you may need to enable and configure it as described in [Setting up Dynamic Resource Allocation](??).

<!-- steps -->

# Install your DRA driver

DRA drivers are third-party applications that run on each node of your cluster to interface with the hardware of that node and Kubernetes' native DRA components. The installation procedure depends on the driver you choose, but is likely deployed as a daemonset to all or a selection of the nodes (using node selectors or similar mechanisms) in your cluster.

Check your driver's documentation for specific installation instructions, which may include a helm chart, a set of manifests, or other deployment tooling.

To illustrate a common installation procedure in this task, you will use an example driver which can be found in the [kubernetes-sigs/dra-example-driver](https://github.com/kubernetes-sigs/dra-example-driver) repository.

## {{% heading "procedure" %}}

### Download the helm charts for the example driver

Clone the repository:

```shell
git clone https://github.com/kubernetes-sigs/dra-example-driver.git
cd dra-example-driver
```

### Enable access to your DRA driver's image

In a production environment, you would likely be using a previously released or qualified image from the driver vendor or your own organization, and your nodes would need to have access to the image registry where the driver image is hosted. In this task, you will build an image locally to simulate access to a DRA driver image. 

Build an image containing the binary for the example driver:

```shell
./demo/build-driver.sh
```

### Deploy the DRA driver

Install the example resource driver with `helm`:

```shell
helm upgrade -i \
  --create-namespace \
  --namespace dra-example-driver \
  dra-example-driver \
  deployments/helm/dra-example-driver
```

### Confirm the DRA driver daemonset is running

```
$ kubectl get pod -n dra-example-driver
NAME                                                  READY   STATUS    RESTARTS   AGE
dra-example-driver-kubeletplugin-qwmbl                1/1     Running   0          1m
dra-example-driver-webhook-7d465fbd5b-n2wxt           1/1     Running   0          1m
```

## Troubleshooting your DRA driver

Many different symptoms could appear that might be caused by an issue with your DRA driver. These include:

- Pods with claims failing to be scheduled
- Pods with claims stuck in a `Pending` state
- Pods with claims stuck in a `Terminating` state
- `ResourceSlice` objects not being created or updated, or repeatedly being deleted and recreated

It is important to note that DRA driver issues are not the only reasons that the above issues might occur. The following sections describe how to determine if your DRA driver is the cause of the issue, and what options you have to mitigate it.

### Driver application errors

If your DRA driver is deployed as a Kubernetes daemonset, as shown in this task page, you can use standard Kubernetes tooling to inspect the health of the daemonset and its logs in order to troubleshoot runtime application errors specific to the driver.

TODO: show examples of doing that

### Driver registration errors

Internally, all DRA drivers implement a specific interface and call a helper package in Kubernetes (`kubelet:dra:kubeletplugin`) that registers themselves with the kubelet by placing a Unix domain socket in `/var/lib/kubelet/plugins_registry/`. An internal kubelet client watches this directory and discovers new drivers as they appear. Other internal kubelet clients connect over this Unix socket at different points in the DRA lifecycle to allocate, prepare, or unprepare your workload's claims. If your DRA driver becomes unhealthy, variations in connection timeouts and log level patterns by these clients can compete for your attention. This section explains the different error logs you must be able to understand in order to diagnose what happened.

TODO: more logs and where they fit in in the architecture diagram

```shell
May 28 17:18:20 kind-worker kubelet[234]: I0528 17:18:20.598764     234 plugin_watcher.go:159] "Handling create event" event="CREATE        \"/var/lib/kubelet/plugins_registry/gpu.example.com.sock\""
May 28 17:18:20 kind-worker kubelet[234]: I0528 17:18:20.598839     234 plugin_watcher.go:194] "Adding socket path or updating timestamp to desired state cache" path="/var/lib/kubelet/plugins_registry/gpu.example.com.sock"
```