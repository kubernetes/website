---
layout: blog
title: "Volume Health Monitoring Alpha Update"
date: 2021-04-16
slug: volume-health-monitoring-alpha-update
---

**Author:** Xing Yang (VMware)

The CSI Volume Health Monitoring feature, originally introduced in 1.19 has undergone a large update for the 1.21 release.

## Why add Volume Health Monitoring to Kubernetes?

Without Volume Health Monitoring, Kubernetes has no knowledge of the state of the underlying volumes of a storage system after a PVC is provisioned and used by a Pod. Many things could happen to the underlying storage system after a volume is provisioned in Kubernetes. For example, the volume could be deleted by accident outside of Kubernetes, the disk that the volume resides on could fail, it could be out of capacity, the disk may be degraded which affects its performance, and so on. Even when the volume is mounted on a pod and used by an application, there could be problems later on such as read/write I/O errors, file system corruption, accidental unmounting of the volume outside of Kubernetes, etc. It is very hard to debug and detect root causes when something happened like this.

Volume health monitoring can be very beneficial to Kubernetes users. It can communicate with the CSI driver to retrieve errors detected by the underlying storage system. PVC events can be reported up to the user to take action. For example, if the volume is out of capacity, they could request a volume expansion to get more space.

## What is Volume Health Monitoring?

CSI Volume Health Monitoring allows CSI Drivers to detect abnormal volume conditions from the underlying storage systems and report them as events on PVCs or Pods.

The Kubernetes components that monitor the volumes and report events with volume health information include the following:

* Kubelet, in addition to gathering the existing volume stats will watch the volume health of the PVCs on that node. If a PVC has an abnormal health condition, an event will be reported on the pod object using the PVC. If multiple pods are using the same PVC, events will be reported on all pods using that PVC.
* An [External Volume Health Monitor Controller](https://github.com/kubernetes-csi/external-health-monitor) watches volume health of the PVCs and reports events on the PVCs.

Note that the node side volume health monitoring logic was an external agent when this feature was first introduced in the Kubernetes 1.19 release. In Kubernetes 1.21, the node side volume health monitoring logic was moved from the external agent into the Kubelet, to avoid making duplicate CSI function calls. With this change in 1.21, a new alpha [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `CSIVolumeHealth` was introduced for the volume health monitoring logic in Kubelet.

Currently the Volume Health Monitoring feature is informational only as it only reports abnormal volume health events on PVCs or Pods. Users will need to check these events and manually fix the problems. This feature serves as a stepping stone towards programmatic detection and resolution of volume health issues by Kubernetes in the future.

## How do I use Volume Health on my Kubernetes Cluster?

To use the Volume Health feature, first make sure the CSI driver you are using supports this feature. Refer to this [CSI drivers doc](https://kubernetes-csi.github.io/docs/drivers.html) to find out which CSI drivers support this feature.

To enable Volume Health Monitoring from the node side, the alpha feature gate `CSIVolumeHealth` needs to be enabled.

If a CSI driver supports the Volume Health Monitoring feature from the controller side, events regarding abnormal volume conditions will be recorded on PVCs.

If a CSI driver supports the Volume Health Monitoring feature from the controller side, user can also get events regarding node failures if the `enable-node-watcher` flag is set to true when deploying the External Health Monitor Controller. When a node failure event is detected, an event will be reported on the PVC to indicate that pods using this PVC are on a failed node.

If a CSI driver supports the Volume Health Monitoring feature from the node side, events regarding abnormal volume conditions will be recorded on pods using the PVCs.

## As a storage vendor, how do I add support for volume health to my CSI driver?

Volume Health Monitoring includes two parts:
* An External Volume Health Monitoring Controller monitors volume health from the controller side.
* Kubelet monitors volume health from the node side.

For details, see the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md) and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/volume-health-monitor.html).

There is a sample implementation for volume health in [CSI host path driver](https://github.com/kubernetes-csi/csi-driver-host-path).

### Controller Side Volume Health Monitoring

To learn how to deploy the External Volume Health Monitoring controller, see [CSI external-health-monitor-controller](https://kubernetes-csi.github.io/docs/external-health-monitor-controller.html) in the CSI documentation.

The External Health Monitor Controller calls either `ListVolumes` or `ControllerGetVolume` CSI RPC and reports VolumeConditionAbnormal events with messages on PVCs if abnormal volume conditions are detected. Only CSI drivers with `LIST_VOLUMES` and `VOLUME_CONDITION` controller capability or `GET_VOLUME` and `VOLUME_CONDITION` controller capability support Volume Health Monitoring in the external controller.

To implement the volume health feature from the controller side, a CSI driver **must** add support for the new controller capabilities.

If a CSI driver supports `LIST_VOLUMES` and `VOLUME_CONDITION` controller capabilities, it **must** implement controller RPC `ListVolumes` and report the volume condition in the response.

If a CSI driver supports `GET_VOLUME` and `VOLUME_CONDITION` controller capability, it **must** implement controller PRC `ControllerGetVolume` and report the volume condition in the response.

If a CSI driver supports `LIST_VOLUMES`, `GET_VOLUME`, and `VOLUME_CONDITION` controller capabilities, only `ListVolumes` CSI RPC will be invoked by the External Health Monitor Controller.

### Node Side Volume Health Monitoring

Kubelet calls `NodeGetVolumeStats` CSI RPC and reports VolumeConditionAbnormal events with messages on Pods if abnormal volume conditions are detected. Only CSI drivers with `VOLUME_CONDITION` node capability support Volume Health Monitoring in Kubelet.

To implement the volume health feature from the node side, a CSI driver **must** add support for the new node capabilities.

If a CSI driver supports `VOLUME_CONDITION` node capability, it **must** report the volume condition in node RPC `NodeGetVoumeStats`.

## What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the CSI volume health implementation to beta in either 1.22 or 1.23.

We are also exploring how to use volume health information for programmatic detection and automatic reconcile in Kubernetes.

## How can I learn more?

To learn the design details for Volume Health Monitoring, read the [Volume Health Monitor](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor) enhancement proposal.

The Volume Health Monitor controller source code is at [https://github.com/kubernetes-csi/external-health-monitor](https://github.com/kubernetes-csi/external-health-monitor).

There are also more details about volume health checks in the [Container Storage Interface Documentation](https://kubernetes-csi.github.io/docs/).

## How do I get involved?

The [Kubernetes Slack channel #csi](https://kubernetes.slack.com/messages/csi) and any of the [standard SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and the CSI team.

We offer a huge thank you to the contributors who helped release this feature in 1.21. We want to thank Yuquan Ren ([NickrenREN](https://github.com/nickrenren)) who implemented the initial volume health monitor controller and agent in the external health monitor repo, thank Ran Xu ([fengzixu](https://github.com/fengzixu)) who moved the volume health monitoring logic from the external agent to Kubelet in 1.21, and we offer special thanks to the following people for their insightful reviews: David Ashpole ([dashpole](https://github.com/dashpole)), Michelle Au ([msau42](https://github.com/msau42)), David Eads ([deads2k](https://github.com/deads2k)), Elana Hashman ([ehashman](https://github.com/ehashman)), Seth Jennings ([sjenning](https://github.com/sjenning)), and Jiawei Wang ([Jiawei0227](https://github.com/Jiawei0227)).

Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We’re rapidly growing and always welcome new contributors.
