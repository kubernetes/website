---
reviewers:
- andrewsykim
title: Migrating to Cloud Controller Manager
content_template: templates/task
---

{{% capture overview %}}

Cloud providers used to be integrated into the Kubernetes Controller Manager (KCM).
In Kubernetes 1.17, this changes, and cloud platform integrations must run in a
dedicated Cloud Controller Manager (CCM) that is specific to each cloud platform.

This document describes how to migrate from the integrated cloud provider in KCM
to a dedicated CCM.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Your cluster will most likely be running in cloud mode, using one of the
integrated cloud providers. You can check by describing the KCM deployment:

```shell
kubectl describe pod kube-controller-manager -n kube-system
```

Look for the `--cloud-provider` option, which will show you which cloud
provider was used.

If the cloud provider is set to `external`, you are already running an external
cloud provider. If the option is not set at all, you're most likely not
using cloud integration. In this case, refer to [LINK TO DOCS ABOUT INSTALLING PROVIDER FROM SCRATCH].

If you were previously running the KCM outside the Kubernetes cluster (as a
systemd service, for example), you need to determine the command line arguments
by appropriate means. This will not be covered here.

Once you've determined which cloud provide you're using, ensure that an external
alternative is available. Note that there may be several alternatives, with
different features. Choose a provider has roughly the same feature set or, even
better, is based on the former internal provider.

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
  Examples:
  * Deleting unused cloud resources
  * Renaming
  * etc.

### Prepare the CCM for deployment

* Write configuration files
* Deploy credentials
* etc.

**Do not deploy the CCM yet**

### Disable the integrated provider

* In KCM and kubelet:
  * Replace `--cloud-provider <OLD CLOUD PROVIDER>` with `--cloud-provider external`
  * Remove other `--cloud-` options
  * Restart KCM and kubelet

### Deploy the cloud provider

Adapt the example deployment for your new external cloud provider:

```yaml
EXAMPLE DEPLOYMENT HERE
```

Apply this deployment into your system namespace:

```shell
kubectl apply -n kube-system -f cloud-provider.yml
```

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
