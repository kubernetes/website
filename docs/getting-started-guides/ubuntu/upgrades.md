---
title: Upgrades
---

{% capture overview %}
This page will outline how to manage and execute a Kubernetes upgrade. 
{% endcapture %}

{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.

## Assumptions

You should always back up all your data before attempting an upgrade. Don't forget to include the workload inside your cluster! Refer to the [backup documentation](/docs/getting-started-guides/ubuntu/backups).
{% endcapture %}

{% capture steps %}
## Preparing for an Upgrade

See if upgrades are available. The Kubernetes charms are updated bi-monthly and mentioned in the Kubernetes release notes. Important operational considerations and change in behaviour will always be documented in the release notes. 

You can use `juju status` to see if an upgrade is available. There will either be an upgrade to kubernetes or etcd, or both.

# Upgrade etcd

Backing up etcd requires an export and snapshot, refer to the [backup documentation](/docs/getting-started-guides/ubuntu/backups) to create a snapshot. After the snapshot upgrade the etcd service with:  

    juju upgrade-charm etcd

This will handle upgrades between minor versions of etcd. Major upgrades from etcd 2.x to 3.x are currently unsupported. Upgrade viability will be investigated when etcd 3.0 is finalized.

# Upgrade Kubernetes

## Master Upgrades

First you need to upgrade the masters: 

    juju upgrade-charm kubernetes-master

NOTE: Always upgrade the masters before the workers.

## Worker Upgrades

Two methods of upgrading workers are supported. [Blue/Green Deployment](http://martinfowler.com/bliki/BlueGreenDeployment.html) and upgrade-in-place. Both methods are provided for operational flexibility and both are supported and tested. Blue/Green will require more hardware up front than inplace, but is a safer upgrade route.

## Blue/Green Upgrade 

Given the following deployment, where the workers are named kubernetes-alpha.

Deploy new worker(s): 

    juju deploy kubernetes-beta

Pause the old workers so your workload migrates: 

    juju action kubernetes-alpha/# pause

Verify old workloads have migrated with: 

    kubectl get-pod -o wide

Tear down old workers with: 

    juju remove-application kubernetes-alpha

## In place worker upgrade 

    juju upgrade-charm kubernetes-worker

# Verify upgrade

`kubectl version` should return the newer version. 

It is recommended to rerun a [cluster validation](/docs/getting-started-guides/ubuntu/validation) to ensure that the cluster upgrade has successfully completed.

# Upgrade Flannel

Upgrading flannel can be done at any time, it is independent of Kubernetes upgrades. Be advised that networking is interrupted during the upgrade. You can initiate a flannel upgrade:

    juju upgrade-charm flannel

# Upgrade easyrsa

Upgrading easyrsa can be done at any time, it is independent of Kubernetes upgrades. Upgrading easyrsa should result in zero downtime as it is not a running service:

    juju upgrade-charm easyrsa

## Rolling back etcd

At this time rolling back etcd is unsupported.

## Rolling back Kubernetes

At this time rolling back Kubernetes is unsupported.
{% endcapture %}

{% include templates/task.md %}