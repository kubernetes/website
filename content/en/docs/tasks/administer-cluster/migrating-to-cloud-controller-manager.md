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

{{% /capture %}}

{{% capture steps %}}

1. Ensure a CCM for your cloud environment is available, with roughly the same feature set than the integrated KCM provider. Determine compatibility issues (missing features, different implementation, etc).
2. Prepare your cloud environment and workloads for the migration: Disable unsupported features, build a list of manual actions to be done after migration (deleting unused cloud resources, renaming, etc).
3. Prepare the CCM for deployment: Write configuration files, deploy credentials, etc. **Do not deploy the CCM yet**
4. Disable the integrated provider in KCM and kubelet: Remove flags, replace with --provider external, etc. Restart these services.
5. Deploy the cloud provider.
6. Ensure it synchronises with the running environment correctly, detects existing resources, deploys new resources where appropriate. Apply manual fixes where necessary.
7. Test deploy new cloud resources such as LoadBalancers and Nodes.

{{% /capture %}}

{{% capture discussion %}}

{{% /capture %}}

{{% capture whatsnext %}}

{{% /capture %}}
