---
layout: blog
title: "Kubernetes 1.17 Feature: Kubernetes In-Tree to CSI Volume Migration Moves to Beta"
date: 2019-12-09T09:00:00+08:00
slug: kubernetes-1-17-feature-csi-migration-beta
author: >
  David Zhu (Software Engineer, Google)
---

The Kubernetes in-tree storage plugin to [Container Storage Interface (CSI)](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) migration infrastructure is now beta in Kubernetes v1.17. CSI migration was introduced as alpha in Kubernetes v1.14.

Kubernetes features are generally introduced as alpha and moved to beta (and eventually to stable/GA) over subsequent Kubernetes releases. This process allows Kubernetes developers to get feedback, discover and fix issues, iterate on the designs, and deliver high quality, production grade features.

## Why are we migrating in-tree plugins to CSI?

Prior to CSI, Kubernetes provided a powerful volume plugin system. These volume plugins were “in-tree” meaning their code was part of the core Kubernetes code and shipped with the core Kubernetes binaries. However, adding support for new volume plugins to Kubernetes was challenging. Vendors that wanted to add support for their storage system to Kubernetes (or even fix a bug in an existing volume plugin) were forced to align with the Kubernetes release process. In addition, third-party storage code caused reliability and security issues in core Kubernetes binaries and the code was often difficult (and in some cases impossible) for Kubernetes maintainers to test and maintain. Using the Container Storage Interface in Kubernetes resolves these major issues.

As more CSI Drivers were created and became production ready, we wanted all Kubernetes users to reap the benefits of the CSI model. However, we did not want to force users into making workload/configuration changes by breaking the existing generally available storage APIs. The way forward was clear - we would have to replace the backend of the “in-tree plugin” APIs with CSI.

## What is CSI migration?

The CSI migration effort enables the replacement of existing in-tree storage plugins such as `kubernetes.io/gce-pd` or `kubernetes.io/aws-ebs` with a corresponding [CSI driver](https://kubernetes-csi.github.io/docs/introduction.html). If CSI Migration is working properly, Kubernetes end users shouldn’t notice a difference. After migration, Kubernetes users may continue to rely on all the functionality of in-tree storage plugins using the existing interface.

When a Kubernetes cluster administrator updates a cluster to enable CSI migration, existing stateful deployments and workloads continue to function as they always have; however, behind the scenes Kubernetes hands control of all storage management operations (previously targeting in-tree drivers) to CSI drivers.

The Kubernetes team has worked hard to ensure the stability of storage APIs and for the promise of a smooth upgrade experience. This involves meticulous accounting of all existing features and behaviors to ensure backwards compatibility and API stability. You can think of it like changing the wheels on a racecar while it’s speeding down the straightaway.

## How to try out CSI migration for existing plugins?

If you are Kubernetes distributor that deploys in one of the environments listed below, now would be a good time to start testing the CSI migration and figuring out how to deploy/manage the appropriate CSI driver.

To try out CSI migration in beta for an existing plugin you must be using Kubernetes v1.17 or higher. First, you must update/create a Kubernetes cluster with the feature flags `CSIMigration` (on by default in 1.17) and `CSIMigration{provider}` (off by default) enabled on all Kubernetes components (master and node). Where {provider} is the in-tree cloud provider storage type that is used in your cluster. Please note that during a cluster upgrade you must drain each node (remove running workloads) before updating or changing configuration of your Kubelet. You may also see an optional `CSIMigration{provider}Complete` flag that you *may* enable if all of your nodes have CSI migration enabled.

You must also install the requisite CSI driver on your cluster - instructions for this can generally be found from you provider of choice. CSI migration is available for GCE Persistent Disk and AWS Elastic Block Store in beta as well as for Azure File/Disk and Openstack Cinder in alpha. Kubernetes distributors should look at automating the deployment and management (upgrade, downgrade, etc.) of the CSI Drivers they will depend on.

To verify the feature flag is enabled and driver installed on a particular node you can get the CSINode object. You should see the in-tree plugin name of the migrated plugin as well as your [installed] driver in the drivers list.


```shell
kubectl get csinodes -o yaml
```

```yaml
- apiVersion: storage.k8s.io/v1
  kind: CSINode
  metadata:
    annotations:
      storage.alpha.kubernetes.io/migrated-plugins: kubernetes.io/gce-pd
    name: test-node
    ...
  spec:
    drivers:
      name: pd.csi.storage.gke.io
      ...
```

After the above set up is complete you can confirm that your cluster has functioning CSI migration by deploying a stateful workload using the legacy APIs.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-disk
spec:
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: web-server
spec:
  containers:
   - name: web-server
     image: nginx
     volumeMounts:
       - mountPath: /var/lib/www/html
         name: mypvc
  volumes:
   - name: mypvc
     persistentVolumeClaim:
       claimName: test-disk
```

Verify that the pod is RUNNING after some time

```shell
kubectl get pods web-server
```

```
NAME         READY   STATUS    RESTARTS   AGE
web-server   1/1     Running   0          39s
```

To confirm that the CSI driver is actually serving your requests it may be prudent to check the container logs of the CSI Driver after exercising the storage management operations. Note that your container logs may look different depending on the provider used.

```shell
kubectl logs {CSIdriverPodName} --container={CSIdriverContainerName}
```

```
/csi.v1.Controller/ControllerPublishVolume called with request: ...
Attaching disk ... to ...
ControllerPublishVolume succeeded for disk ... to instance ...
```

## Current limitations

Although CSI migration is now beta there is one major limitation that prevents us from turning it on by default. Turning on migration still requires a cluster administrator to install a CSI driver before storage functionality is seamlessly handed over. We are currently working with SIG-CloudProvider to provide a frictionless experience of bundling the required CSI Drivers with cloud distributions.

## What is the timeline/status?

The timeline for CSI migration is actually set by the cloud provider extraction project. It is part of the effort to remove all cloud provider code from Kubernetes. By migrating cloud storage plugins to external CSI drivers we are able to extract out all the cloud provider dependencies.

Although the overall feature is beta and not on by default, there is still work to be done on a per-plugin basis. Currently only GCE PD and AWS EBS have gone beta with Migration and yet both are still off by default since they depend on a manual installation of their respective CSI Drivers. Azure File/Disk, OpenStack, and VMWare plugins are currently in less mature states and non-cloud plugins such as NFS, Portworx, RBD etc are still in the planning stages.

The current and targeted releases for each individual cloud driver is shown in the table below:

| Driver            | Alpha         | Beta (in-tree deprecated) | GA            | Target "in-tree plugin" removal |
| ----------------- | ------------- | ------------------------- | ------------- | ------------------------------- |
| AWS EBS           | 1.14          | 1.17                      | 1.19 (Target) | 1.21                            |
| GCE PD            | 1.14          | 1.17                      | 1.19 (Target) | 1.21                            |
| OpenStack Cinder  | 1.14          | 1.18 (Target)             | 1.19 (Target) | 1.21                            |
| Azure Disk + File | 1.15          | 1.18 (Target)             | 1.19 (Target) | 1.21                            |
| VSphere           | 1.18 (Target) | 1.19 (Target)             | 1.20 (Target) | 1.22                            |

## What's next?

Major upcoming work includes implementing and hardening CSI migration for the remaining in-tree plugins, installing CSI Drivers by default in distributions, turning on CSI migration by default, and finally removing all in-tree plugin code as a part of cloud provider extraction. We expect to complete this project including the full switch to “on-by-default” migration by Kubernetes v1.21.

## What should I do as a user?

Note that all new features for the Kubernetes storage system (like volume snapshotting) will only be added to the CSI interface. Therefore, if you are starting up a new cluster, creating stateful applications for the first time, or require these new features we recommend using CSI drivers natively (instead of the in-tree volume plugin API). Follow the [updated user guides for CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html) and use the new CSI APIs.

However, if you choose to roll a cluster forward or continue using specifications with the legacy volume APIs, CSI Migration will ensure we continue to support those deployments with the new CSI drivers.

## How do I get involved?

The Kubernetes Slack channel csi-migration along with any of the standard [SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and migration working group teams.

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. We offer a huge thank you to the contributors who stepped up these last quarters to help the project reach Beta:

- David Zhu
- Deep Debroy
- Cheng Pan
- Jan Šafránek

With special thanks to:

- Michelle Au
- Saad Ali
- Jonathan Basseri
- Fabio Bertinatto
- Ben Elder
- Andrew Sy Kim
- Hemant Kumar

For fruitful dialogues, insightful reviews, and thorough consideration of CSI migration in other features.
