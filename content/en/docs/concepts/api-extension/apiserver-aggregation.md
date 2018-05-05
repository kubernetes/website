---
title: Extending the Kubernetes API with the aggregation layer
reviewers:
- lavalamp
- cheftako
- chenopis
content_template: templates/concept
---

{{% capture overview %}}

The aggregation layer allows Kubernetes to be extended with additional APIs, beyond what is offered by the core Kubernetes APIs. 

{{% /capture %}}

{{% capture body %}}

## Overview

The aggregation layer enables installing additional Kubernetes-style APIs in your cluster. These can either be pre-built, existing 3rd party solutions, such as [service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/README.md), or user-created APIs like [apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md), which can get you started.

In 1.7 the aggregation layer runs in-process with the kube-apiserver. Until an extension resource is registered, the aggregation layer will do nothing. To register an API, users must add an APIService object, which "claims" the URL path in the Kubernetes API. At that point, the aggregation layer will proxy anything sent to that API path (e.g. /apis/myextension.mycompany.io/v1/…) to the registered APIService. 

Ordinarily, the APIService will be implemented by an *extension-apiserver* in a pod running in the cluster. This extension-apiserver will normally need to be paired with one or more controllers if active management of the added resources is needed. As a result, the apiserver-builder will actually provide a skeleton for both. As another example, when the service-catalog is installed, it provides both the extension-apiserver and controller for the services it provides.

{{% /capture %}}

{{% capture whatsnext %}}

* To get the aggregator working in your environment, [configure the aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/).
* Then, [setup an extension api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) to work with the aggregation layer.
* Also, learn how to [extend the Kubernetes API using Custom Resource Definitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).

{{% /capture %}}


