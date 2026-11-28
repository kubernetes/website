---
layout: blog
title: "Follow a Pod to its device with Dynamic Resource Allocation in Headlamp"
draft: true
slug: dynamic-resource-allocation-in-headlamp
author: >
  [Anjali Chauhan](https://github.com/Anjali-Chauhan1) (LFX Mentee, CNCF),
  [Kevin Hannon](https://github.com/kannon92) (Red Hat),
  [René Dudfield](https://github.com/illume) (Microsoft)
---

Before DRA, a Pod asked for a GPU with a number, such as `nvidia.com/gpu: 1`. The scheduler knew how many GPUs a node had but not what kind they were. With [Dynamic Resource Allocation](/docs/concepts/resource-management/dynamic-resource-allocation/) (DRA), stable since Kubernetes v1.34, a driver lists each device with details such as its model and memory. A Pod describes the device it needs, and the scheduler picks one that fits. The answer to "which GPU did my Pod get?" is now spread over several objects. From the command line, you read the Pod, then its claim, then the object that describes the device.

[Headlamp](https://headlamp.dev/) is a web UI for Kubernetes. Its **Devices (alpha)** section links these objects. This post follows a Pod to its device, step by step, and shows how to check the device's health and how many devices are free.

## Before you begin

You need:

- A cluster running Kubernetes v1.34 or later.
- A DRA driver installed in that cluster, for example a GPU or network driver.
- Headlamp v0.47.0 or later.

The **Devices** section appears only when the cluster serves the `resource.k8s.io/v1` API.

## Why DRA is hard to follow from the command line

With kubectl, you follow a DRA request by reading one YAML file after another. The Pod names a template, the template creates a claim with a new name, the claim names a device and the device is described in yet another object. DRA adds these objects on top of the Pod:

- **DeviceClass**: a kind of device you can ask for, such as "a GPU from this driver". A cluster admin or the driver creates it.
- **ResourceClaimTemplate**: a pattern that gives each Pod its own claim.
- **ResourceClaim**: a request for devices. After scheduling, it also records the devices it got.
- **ResourceSlice**: the devices a driver offers, grouped into pools. There is no Device object, so this is where a device's details live.

In short, the device your Pod got is written in its ResourceClaim and the details of that device are in a ResourceSlice.

In the steps below, Pod `pod0` asks for one GPU from the `gpu.example.com` driver, through the template `single-gpu`.

## Step 1: See which devices can be requested

The **Device Classes** list shows each kind of device: how many selectors it has, which drivers it passes settings to, and its extended resource name.

A class's page shows its selectors, the settings it passes to the driver and its extended resource name, if it has one. That name lets a Pod ask for the device the classic way, in `resources.limits`.

An empty list explains why it is empty: a driver usually creates the classes when it is installed.

{{< figure src="device-classes.png" alt="The Device Classes list in Headlamp with four classes. big-gpu.example.com has two selectors, passes settings to the gpu.example.com driver, and has the extended resource example.com/big-gpu. any-device has no selectors and shows All devices." caption="The kinds of devices that can be requested" >}}

## Step 2: Find the claim behind your Pod

`pod0` uses the template `single-gpu`. On the Pod's page, the **Resource Claims** section shows each claim, where it comes from (a claim, a template or an extended resource) and which containers use it.

{{< figure src="pod-claims.png" alt="The Resource Claims section of Pod pod0 in Headlamp. The claim pod0-gpu-5rbv9 comes from the template single-gpu and is used by container ctr0." caption="The Resource Claims section of a Pod" >}}

When a claim comes from a template, Kubernetes gives it a generated name: the Pod name, the claim name, and a random suffix. That name is not in the Pod spec, only in `status.resourceClaimStatuses`, so it is hard to find on the command line. Here it is one click away. If the claim does not exist yet, the section says **Not generated yet**.

The same link works from the other side. The template's page lists its **Requests** and the claim it made for each Pod.

## Step 3: See which device the claim got

The claim's status shows where it is: **Pending** (no device yet), **Allocated** (device picked) or **In use by N** (N Pods use it). The claim's page puts what was asked for next to what was given:

- **Requests**: the device class and how many devices.
- **Allocated Devices**: the device, its pool, and its driver. If the request listed alternatives, **Chosen Alternative** shows which one was used.
- **Used By**: the Pods using the claim.

The top of the page also shows the claim's **Node**.

{{< figure src="claim-details.png" alt="The details page of claim pod0-gpu-5rbv9 in Headlamp. It requests one device from class gpu.example.com, got device gpu-3 from driver gpu.example.com with health Healthy, and is used by Pod pod0." caption="What the claim asked for, the device it got and its health, and the Pod that uses it" >}}

The **Resource Claims** list shows the status, device classes, number of devices and node of every claim.

## Step 4: Look up the device

In **Resource Slices**, the row with the device's driver and pool is the one to open. Each row shows how many devices the slice has and where they can be used: one node, **All nodes**, **Selected nodes**, or **Set per device**.

The slice's **Devices** table shows each device's attributes, such as model, and capacity, such as memory. For a **Set per device** slice, a **Node** column shows where each device is.

{{< figure src="resource-slices.png" alt="The Resource Slices list in Headlamp. Each row shows a slice's driver, pool, where its devices can be used (one node, Selected nodes, Set per device, or All nodes), and how many devices it has." caption="The slices that drivers publish, and where their devices can be used" >}}

## Step 5: Check the device's health

A GPU can fail after the job starts. Headlamp shows this in two places:

- The **Health** column on the claim page shows **Healthy**, **Unhealthy**, or **Unknown**, as reported by the kubelet. Hover over the label to see the reason.
- The **Taints** column on the slice page appears when a driver marks a device so that no new claim gets it. A `NoExecute` taint also removes the Pods already using it.

## Step 6: Check how many devices are free

Before starting another job, check whether any GPUs are left. Click a pool name in the **Resource Slices** list to open **Pool Availability** for that pool. It shows how many devices are **Available**, **Allocated**, and **Unavailable**, out of the **Total**.

{{< figure src="pool-availability.png" alt="The Pool Availability page in Headlamp for driver gpu.example.com and pool dra-pool-status-control-plane. The pool has 1 available, 7 allocated, and 0 unavailable devices out of 8." caption="How many devices are free in a pool" >}}

The numbers come from the cluster through a ResourcePoolStatusRequest. If a pool is incomplete or still being published, the page says so instead of showing a wrong count.

This page needs Kubernetes v1.36 or later with the `DRAResourcePoolStatus` feature gate and the `resource.k8s.io/v1alpha3` API turned on. By default, only cluster admins can use it.

## Step 7: See everything on the Map

Open the **Map** and turn on the **Devices** group. It shows each Pod connected to its claims and templates and those connected to their DeviceClasses. Pods that only share a DeviceClass are not grouped together so the Map stays clear.

{{< figure src="map.png" alt="The Headlamp Map with the Devices group turned on. Pod pod0 links to its claim pod0-gpu-5rbv9 and to the template single-gpu, and both link to the gpu.example.com DeviceClass." caption="DRA objects on the Map" >}}

## Headlamp and kubectl

Headlamp doesn't replace kubectl. It saves joining several YAML files by hand:

| Question | With kubectl | In Headlamp |
| --- | --- | --- |
| Which devices can be requested? | `kubectl get deviceclasses -o yaml` | **Device Classes** |
| Which claim does the Pod use? | `status.resourceClaimStatuses` in the Pod | Pod's **Resource Claims** |
| Which device did it get? | `status.allocation` in the claim | **Allocated Devices** |
| What is that device? | Search `kubectl get resourceslices -o yaml` | Slice's **Devices** table |
| Is it healthy? | `allocatedResourcesStatus` in the Pod's container statuses | **Health** column |
| Are any devices free? | Create a ResourcePoolStatusRequest and read its status | **Pool Availability** |

## Developed during LFX Mentorship

I built the Devices section during the [LFX Mentorship](https://mentorship.lfx.linuxfoundation.org/) program, Term 3 2026. Thank you to my mentors René Dudfield, Kevin Hannon, and Heba Elayoty for their reviews and guidance.

## Try it and share feedback

1. Install or update to Headlamp v0.47.0 or later.
2. Connect to a cluster with a DRA driver.
3. Open **Devices** and follow a Pod to its device.

The [Headlamp documentation](https://headlamp.dev/docs/latest/learn/devices/) covers every page in the Devices section. For anything missing or confusing, open an issue in [kubernetes-sigs/headlamp](https://github.com/kubernetes-sigs/headlamp/issues).
