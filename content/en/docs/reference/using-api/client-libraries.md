---
title: Client Libraries
reviewers:
- ahmetb
content_template: templates/concept
weight: 30
---

{{% capture overview %}}
This page contains an overview of the client libraries for using the Kubernetes
API from various programming languages.
{{% /capture %}}

{{% capture body %}}
To write applications using the [Kubernetes REST API](/docs/reference/using-api/api-overview/),
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
| Python       | [github.com/kubernetes-client/python/](https://github.com/kubernetes-client/python/) | [browse](https://github.com/kubernetes-client/python/tree/master/examples)
| Java     | [github.com/kubernetes-client/java](https://github.com/kubernetes-client/java/) | [browse](https://github.com/kubernetes-client/java#installation)
| dotnet   | [github.com/kubernetes-client/csharp](https://github.com/kubernetes-client/csharp) | [browse](https://github.com/kubernetes-client/csharp/tree/master/examples/simple)
| JavaScript   | [github.com/kubernetes-client/javascript](https://github.com/kubernetes-client/javascript) | [browse](https://github.com/kubernetes-client/javascript/tree/master/examples)
| Haskell  | [github.com/kubernetes-client/haskell](https://github.com/kubernetes-client/haskell) | [browse](https://github.com/kubernetes-client/haskell/tree/master/kubernetes-client/example)

{{% /capture %}}
