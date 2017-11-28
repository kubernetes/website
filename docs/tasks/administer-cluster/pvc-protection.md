---
approvers:
- msau42
- jsafrane
title: Persistent Volume Claim Protection
---

{% capture overview %}
{% assign for_k8s_version="v1.9" %}{% include feature-state-alpha.md %}

As of Kubernetes 1.9, persistent volume claims (PVCs) that are actively used by a pod can be protected from pre-mature delettion.

{% endcapture %}

{% capture prerequisites %}

- A v1.9 or higher Kubernetes must be installed.

{% endcapture %}

{% capture steps %}

## PVC Protection Configuration

As PVC Protection is an alpha feature it must be turned on:
1. Admission controller must be started with the PVC Protection plugin.
2. All kubelets must be started with the `PVCProtection` alpha features switched on.

{% endcapture %}

{% capture discussion %}


{% endcapture %}

{% include templates/task.md %}
