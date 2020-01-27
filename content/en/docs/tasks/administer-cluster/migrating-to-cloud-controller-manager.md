---
reviewers:
- andrewsykim
title: Migrating to Cloud Controller Manager
content_template: templates/task
min-kubernetes-server-version: v1.16
---

{{% capture overview %}}

Cloud providers used to be integrated into the Kubernetes Controller Manager (KCM).
In Kubernetes 1.17, this changes, and cloud platform integrations must run in a
dedicated Cloud Controller Manager (CCM) that is specific to each cloud platform.

This document describes how to migrate from the integrated cloud provider in KCM
to a dedicated CCM.

{{% /capture %}}

{{% capture prerequisites %}}

You need to have a Kubernetes cluster, and the kubectl command-line tool must
be configured to communicate with your cluster. {{< version-check >}}

It's also assumed that you are currently running one of the cloud integrations
provided by `kube-controller-manager`. This daemon may be running either as
a pod or as a standalone service.

### As a Pod

Find out which cloud provider you are using by running the following command:

```shell
kubectl describe pod kube-controller-manager -n kube-system
```

### As a systemd service

Find the `kube-controller-manager` parameters with the following command:

```shell
systemctl status | grep kube-controller-manager
```

Look for the `--cloud-provider` option, which will show you which cloud
provider is used.

If the option says `--cloud-provider=external`, you are already running an
external cloud provider. If the option is not set at all, you're most likely not
using cloud integration. In this case, you don't need to migrate.

Once you've determined which cloud provide you're using, ensure that an external
alternative is available. Note that there may be several alternatives, with
different features. Choose a provider that has roughly the same feature set or,
even better, is based on the former integrated provider.

**TODO** Links to external providers here

{{% /capture %}}

{{% capture steps %}}

## Preparation

### Determine compatibility issues between internal and external cloud provider

* Missing features
* Different implementation
* etc.

### Prepare your cloud environment and workloads for the migration

* Disable unsupported features
* Build a list of manual actions to be done after migration

Resources to watch for:

* Nodes, in particular labeling
* LoadBalancers

### Prepare the CCM for deployment

* Write configuration files
* Deploy credentials
* etc.

**Do not deploy the CCM yet!**

## Deploy Cloud Controller Manager

### Disable the integrated provider

Depending on if you're running `kube-controller-manager` as a Pod or a system
service, change the following options either in the ReplicaSet or in the
systemd service file.

#### As a Pod

Use the following command to change the deployment:

```shell
kubectl edit replicaset kube-controller-manager
```

Replace `--cloud-provider=<OLD CLOUD PROVIDER>` with `--cloud-provider=external`.
Remove all other `--cloud-` options.

Do the same for kubelet:

```shell
kubectl edit replicaset kubelet
```

#### As a SystemD service

Edit the KCM service file on each control plane node:

```shell
nano /etc/systemd/system/kube-controller-manager.service
```

Replace `--cloud-provider=<OLD CLOUD PROVIDER>` with `--cloud-provider=external`.
Remove all other `--cloud-` options.

Do the same for `kubelet` on all nodes:

```shell
nano /etc/systemd/system/kubelet.service
```

Reload the service files and restart the services on each node:

```shell
systemctl daemon-reload
systemctl restart kube-controller-manager
systemctl restart kubelet
```

### Deploy the cloud provider

Adapt the example deployment for your new external cloud provider:

```yaml
EXAMPLE DEPLOYMENT HERE
```

Apply this deployment into your system namespace:

```shell
kubectl apply -n kube-system -f cloud-provider.yml
```

## Verify

### Ensure synchronization with existing environment

Watch the log of the CCM. Check that:

* Existing cloud resources (LoadBalancers and Nodes) are detected
* New resources are applyied where appropriate
* Apply manual fixes where necessary

### Test

Create test deployments, such as LoadBalancers and new Nodes.

{{% /capture %}}

{{% capture discussion %}}

{{% /capture %}}

{{% capture whatsnext %}}

{{% /capture %}}
