---
title: Configure the Aggregation Layer
reviewers:
- lavalamp
- cheftako
- chenopis
content_template: templates/task
weight: 10
---

{{% capture overview %}}

Configuring the [aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/) allows the Kubernetes apiserver to be extended with additional APIs, which are not part of the core Kubernetes APIs. 

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
There are a few setup requirements for getting the aggregation layer working in your environment to support mutual TLS auth between the proxy and extension apiservers. Kubernetes and the kube-apiserver have multiple CAs, so make sure that the proxy is signed by the aggregation layer CA and not by something else, like the master CA.
{{< /note >}}

{{% /capture %}}

{{% capture steps %}}

## Enable apiserver flags

Enable the aggregation layer via the following kube-apiserver flags. They may have already been taken care of by your provider.

    --requestheader-client-ca-file=<path to aggregator CA cert>
    --requestheader-allowed-names=front-proxy-client
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --proxy-client-cert-file=<path to aggregator proxy cert>
    --proxy-client-key-file=<path to aggregator proxy key>

WARNING: do **not** reuse a CA that is used in a different context unless you understand the risks and the mechanisms to protect the CA's usage.

If you are not running kube-proxy on a host running the API server, then you must make sure that the system is enabled with the following apiserver flag:

    --enable-aggregator-routing=true

{{% /capture %}}

{{% capture whatsnext %}}

* [Setup an extension api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) to work with the aggregation layer.
* For a high level overview, see [Extending the Kubernetes API with the aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API Using Custom Resource Definitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).

{{% /capture %}}



