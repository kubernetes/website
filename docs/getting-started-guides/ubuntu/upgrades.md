---
title: Upgrades
---

{% capture overview %}
This page will outline how to manage and execute a Kubernetes upgrade.
{% endcapture %}

{% capture prerequisites %}
This page assumes you have a working deployed cluster.

**Warning:** You should always back up all your data before attempting an upgrade.
Don't forget to include the workload inside your cluster!
Refer to the [backup documentation](/docs/getting-started-guides/ubuntu/backups).
{: .warning}

{% endcapture %}

{% capture steps %}
## Patch kubernetes upgrades for example 1.9.0 -> 1.9.1

Clusters are transparently upgraded to the latest Kubernetes patch release.
To be clear, a cluster deployed using the 1.9/stable channel
will transparently receive unattended upgrades for the 1.9.X Kubernetes
releases.
The upgrade causes no disruption to the operation of the cluster and requires
no intervention from a cluster administrator.
Each patch release is evaluated by the
Canonical Kubernetes Distribution team.
Once a patch release passes internal testing and is deemed safe for upgrade,
it is packaged in snap format and pushed to the stable channel.


## Upgrading a minor Kubernetes release for example 1.8.1 -> 1.9.0


The Kubernetes charms follow the Kubernetes releases. Please consult
your support plan on the upgrade frequency. Important operational considerations
and changes in behaviour will always be documented in the release notes.

### Upgrade etcd

Backing up etcd requires an export and snapshot, refer to the
[backup documentation](/docs/getting-started-guides/ubuntu/backups) to create a snapshot.
After the snapshot, upgrade the etcd service with:

    juju upgrade-charm etcd

This will handle upgrades between minor versions of etcd. Instructions on how to upgrade from 2.x to 3.x can be found [here](https://github.com/juju-solutions/bundle-canonical-kubernetes/wiki/Etcd-2.3-to-3.x-upgrade) in the juju-solutions wiki.

### Upgrade kubeapi-load-balancer

The Kubernetes Charms are generally all updated and released at the same time. A core part of a cluster on Ubuntu is the kubeapi-load-balancer component. Incorrect or missing changes there can have an effect on API availability and access controls. To ensure API service continuity for the master and workers when they are updated, this upgrade needs to precede them.

To upgrade the charm run:

    juju upgrade-charm kubeapi-load-balancer

### Upgrade Kubernetes

The Kubernetes Charms use snap channels to drive payloads.
The channels are defined by `X.Y/channel` where `X.Y` is the `major.minor` release
of Kubernetes (for example 1.9) and `channel` is one of the four following channels:

| Channel name        | Description  |
| ------------------- | ------------ |
| stable              | The latest stable released patch version of Kubernetes |
| candidate           | Release candidate releases of Kubernetes |
| beta                | Latest alpha or beta of Kubernetes for that minor release |
| edge                | Nightly builds of that minor release of Kubernetes |

If a release isn't available, the next highest channel is used.
For example, 1.9/beta will load `/candidate` or `/stable` depending on availability of release.
Development versions of Kubernetes are available in the edge channel for each minor release.
There is no guarantee that edge snaps will work with the current charms.

### Master Upgrades

First you need to upgrade the masters:

    juju upgrade-charm kubernetes-master

**Note:** Always upgrade the masters before the workers.
{: .note}

Once the latest charm is deployed, the channel for Kubernetes can be selected by issuing the following:

    juju config kubernetes-master channel=1.x/stable

Where `x` is the minor version of Kubernetes. For example, `1.9/stable`. See above for Channel definitions.
Once you've configured kubernetes-master with the appropriate channel, run the upgrade action on each master:

    juju run-action kubernetes-master/0 upgrade
    juju run-action kubernetes-master/1 upgrade
    ...

### Worker Upgrades

Two methods of upgrading workers are supported.
[Blue/Green Deployment](http://martinfowler.com/bliki/BlueGreenDeployment.html)
and upgrade-in-place. Both methods are provided for operational flexibility and both
are supported and tested. Blue/Green will require more hardware up front than in-place,
but is a safer upgrade route.

#### Blue/green worker upgrade

Given a deployment where the workers are named kubernetes-alpha.

Deploy new workers:

    juju deploy kubernetes-beta

Pause the old workers so your workload migrates:

    juju run-action kubernetes-alpha/# pause

Verify old workloads have migrated with:

    kubectl get pod -o wide

Tear down old workers with:

    juju remove-application kubernetes-alpha

#### In place worker upgrade

    juju upgrade-charm kubernetes-worker
    juju config kubernetes-worker channel=1.x/stable

Where `x` is the minor version of Kubernetes. For example, `1.9/stable`.
See above for Channel definitions. Once you've configured kubernetes-worker with the appropriate channel,
run the upgrade action on each worker:

    juju run-action kubernetes-worker/0 upgrade
    juju run-action kubernetes-worker/1 upgrade
    ...

### Verify upgrade

`kubectl version` should return the newer version.

It is recommended to rerun a [cluster validation](/docs/getting-started-guides/ubuntu/validation)
to ensure that the cluster upgrade has successfully completed.

### Upgrade Flannel

Upgrading flannel can be done at any time, it is independent of Kubernetes upgrades.
Be advised that networking is interrupted during the upgrade. You can initiate a flannel upgrade with:

    juju upgrade-charm flannel

### Upgrade easyrsa

Upgrading easyrsa can be done at any time, it is independent of Kubernetes upgrades.
Upgrading easyrsa should result in zero downtime as it is not a running service:

    juju upgrade-charm easyrsa

{% endcapture %}

{% include templates/task.md %}
