---
title: Client Libraries
assignees:
- ahmetb
---

{% capture overview %}
This page contains an overview of the client libraries for using the Kubernetes
API from various programming languages.
{% endcapture %}

{% capture body %}
To write applications using the [Kubernetes REST API](/docs/reference/api-overview/),
you do not need to implement the API calls and request/response types yourself.
You can use a client library for the programming language you are using.

Client libraries often handle common tasks such as authentication for you.
Most client libraries can discover and use the Kubernetes Service Account to 
authenticate if the API client is running inside the Kubernetes cluster, or can
understand the [kubeconfig file](/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/)
format to read the credentials and the API Server address.

## Officially-supported Kubernetes client libraries

The following client libraries are officially maintained by [Kubernetes SIG API
Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).


| Language | Client Library | Sample Programs |
|----------|----------------|-----------------|
| Go       | [github.com/kubernetes/client-go/](https://github.com/kubernetes/client-go/) | [browse](https://github.com/kubernetes/client-go/tree/master/examples)
| Python       | [github.com/kubernetes-incubator/client-python/](https://github.com/kubernetes-incubator/client-python/) | [browse](https://github.com/kubernetes-incubator/client-python/tree/master/examples)

## Community-maintained client libraries

The following Kubernetes API client libraries are provided and maintained by
their authors, not the Kubernetes team.

| Language | Client Library |
|----------|----------------|
| Clojure  | [github.com/yanatan16/clj-kubernetes-api](https://github.com/yanatan16/clj-kubernetes-api) |
| Go       | [github.com/ericchiang/k8s](https://github.com/ericchiang/k8s) |
| Java (OSGi) | [bitbucket.org/amdatulabs/amdatu-kubernetes](https://bitbucket.org/amdatulabs/amdatu-kubernetes) |
| Java (Fabric8, OSGi) | [github.com/fabric8io/kubernetes-client](https://github.com/fabric8io/kubernetes-client) |
| Node.js  | [github.com/tenxcloud/node-kubernetes-client](https://github.com/tenxcloud/node-kubernetes-client) |
| Node.js  | [github.com/godaddy/kubernetes-client](https://github.com/godaddy/kubernetes-client) |
| Perl     | [metacpan.org/pod/Net::Kubernetes](https://metacpan.org/pod/Net::Kubernetes) |
| PHP      | [github.com/devstub/kubernetes-api-php-client](https://github.com/devstub/kubernetes-api-php-client) |
| PHP      | [github.com/maclof/kubernetes-client](https://github.com/maclof/kubernetes-client) |
| Python   | [github.com/eldarion-gondor/pykube](https://github.com/eldarion-gondor/pykube) |
| Ruby     | [github.com/Ch00k/kuber](https://github.com/Ch00k/kuber) |
| Ruby     | [github.com/abonas/kubeclient](https://github.com/abonas/kubeclient) |
| Scala    | [github.com/doriordan/skuber](https://github.com/doriordan/skuber) |
{% endcapture %}

{% include templates/concept.md %}
