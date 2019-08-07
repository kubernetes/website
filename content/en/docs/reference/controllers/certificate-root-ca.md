---
title: Root CA controller
content_template: templates/concept
---

{{% capture overview %}}

Kubernetes clusters have a [certificate authority](/docs/concepts/cluster-administration/certificates/)
(CA) that the control plane uses to authenticate different components. This
controller manages a ConfigMap in every configured namespace, so that Pods
in that namespace have access to the cluster's root CA and can validate other
components' identity.

{{% /capture %}}

{{% capture body %}}

The root CA controller is built in to kube-controller-manager.

## Controller behaviour

This controller watches for namespaces being created. For every new namespace the
controller adds a ConfigMap containing the cluster's root certificate.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [certificate approver](/docs/reference/controllers/certificate-approver/)
{{% /capture %}}
