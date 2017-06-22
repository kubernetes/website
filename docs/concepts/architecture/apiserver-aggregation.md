---
title: Extending the Kubernetes API with Aggregator
assignees:
- chenopis
---

{% capture overview %}

The *Aggregator* is a system to allow the Kubernetes apiserver to be extended with additional APIs, which are not part of the core Kubernetes APIs. 

{% endcapture %}

{% capture body %}

## Overview

The Aggregator allows both third party extension via something like [service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/README.md) and the creation of extensions to allow seamless addition of the resources a customer needs. The latter can be easily bootstrapped using [apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md). 

In 1.7, the Aggregator runs in a process with the kube-apiserver; however, until an extension resource is registered, the Aggregator will do nothing. Once a new resource is registered, Aggregator will proxy the request to the extension-apiserver to be served. 

**Note:** The extension-apiserver will normally need to be paired with a controller to actually provide any functionality. As a result, things like the apiserver-builder will actually provide a skeleton for both. The service-catalog should provide both the extension-apiserver and controller for the services it provides.

{% endcapture %}

{% capture whatsnext %}

* To get the aggregator working in your environment, see [Setup the API aggregator](/docs/tasks/access-kubernetes-api/setup-api-aggregator/).
* Learn how to [Extend the Kubernetes API Using Third Party Resources](/docs/tasks/access-kubernetes-api/extend-api-third-party-resource/).

{% endcapture %}

{% include templates/concept.md %}