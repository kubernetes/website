---
reviewers:
- jsafrane
- saad-ali
- msau42
- xing-yang
--
title: Volume Health Monitoring 
content_type: concept
---

<!-- overview -->

{{< glossary_tooltip text="CSI" term_id="csi" >}} volume health monitoring allows CSI Drivers to detect abnormal volume conditions from the underlying storage systems and report them as events on {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}} or {{< glossary_tooltip text="Pods" term_id="pod" >}}.

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

<!-- body -->

## Volume Health Monitoring

The Volume Health Monitoring feature is part of Kubernetes implementation of Container Storage Interface (CSI). The Volume Health Monitoring feature is implemented in two components: External Health Monitor Controller and Kubelet.

If a CSI Driver supports Volume Health Monitoring feature from the controller side, an event will be reported on the PVC when an abnormal volume condition is detected on a CSI volume.

External Health Monitor Controller will also watch for node failure events. This can be enabled by setting the `enable-node-watcher` flag to true. When a node failure event is detected, an event will be reported on the PVC to indicate that pods using this PVC are on a failed node.

If a CSI Driver supports Volume Health Monitoring feature from the node side, an event will be reported on every Pod using the PVC when an abnormal volume condition is detected on a CSI volume.

Note that you need to enable the `CSIVolumeHealth` feature gate to use this feature from the node side.

See CSI driver [docs](https://kubernetes-csi.github.io/docs/drivers.html) to find out which CSI drivers have implemented this feature.
