---
toc_hide: true
title: ServiceAccount token controller
content_template: templates/concept
---

{{% capture overview %}}

The ServiceAccount token {{< glossary_tooltip term_id="controller" >}} generates and
assigns API access tokens for a ServiceAccount.

{{% /capture %}}

{{% capture body %}}

The ServiceAccount token controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

This controller issues API access tokens for each ServiceAccount and places them into
an associated {{< glossary_tooltip term_id="secret" >}}. Pods that can access that Secret
can use the token to identify as the relevant ServiceAccount.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [ServiceAccount controller](/docs/reference/controllers/serviceaccount/)
* Read about other [cluster orchestration controllers](/docs/reference/controllers/cluster-orchestration-controllers/)
{{% /capture %}}
