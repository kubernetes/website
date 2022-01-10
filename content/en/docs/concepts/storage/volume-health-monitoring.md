---
reviewers:
- jsafrane
- saad-ali
- msau42
- xing-yang
title: Volume Health Monitoring
content_type: concept
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

{{< glossary_tooltip text="CSI" term_id="csi" >}} volume health monitoring allows CSI Drivers to detect abnormal volume conditions from the underlying storage systems and report them as events on {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}} or {{< glossary_tooltip text="Pods" term_id="pod" >}}.

<!-- body -->

## Volume health monitoring

Kubernetes _volume health monitoring_ is part of how Kubernetes implements the Container Storage Interface (CSI). Volume health monitoring feature is implemented in two components: an External Health Monitor controller, and the {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}.

If a CSI Driver supports Volume Health Monitoring feature from the controller side, an event will be reported on the related {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} (PVC) when an abnormal volume condition is detected on a CSI volume.

The External Health Monitor {{< glossary_tooltip text="controller" term_id="controller" >}} also watches for node failure events. You can enable node failure monitoring by setting the `enable-node-watcher` flag to true. When the external health monitor detects a node failure event, the controller reports an Event will be reported on the PVC to indicate that pods using this PVC are on a failed node.

If a CSI Driver supports Volume Health Monitoring feature from the node side, an Event will be reported on every Pod using the PVC when an abnormal volume condition is detected on a CSI volume.

{{< note >}}
You need to enable the `CSIVolumeHealth` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to use this feature from the node side.
{{< /note >}}

## {{% heading "whatsnext" %}}

See the [CSI driver documentation](https://kubernetes-csi.github.io/docs/drivers.html) to find out which CSI drivers have implemented this feature.
