---
title: Accessing the Kubernetes API from a Pod
reviewers:
- sftim
description: Accessing the Kubernetes REST API from within a Pod
content_type: task
---

<!-- overview -->

This guide demonstrates how to access the Kubernetes API from within a pod.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Accessing the API from within a Pod

When accessing the API from within a Pod, locating and authenticating
to the API server are slightly different to the external client case.

The easiest way to use the Kubernetes API from a Pod is to use
one of the official [client libraries](/docs/reference/using-api/client-libraries/). These
libraries can automatically discover the API server and authenticate.

### Using Official Client Libraries

From within a Pod, the recommended ways to connect to the Kubernetes API are:

  - For a Go client, use the official [Go client library](https://github.com/kubernetes/client-go/).
    The `rest.InClusterConfig()` function handles API host discovery and authentication automatically.
    See [an example here](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go).

  - For a Python client, use the official [Python client library](https://github.com/kubernetes-client/python/).
    The `config.load_incluster_config()` function handles API host discovery and authentication automatically.
    See [an example here](https://github.com/kubernetes-client/python/blob/master/examples/in_cluster_config.py).

  - There are a number of other libraries available, please refer to the [Client Libraries](/docs/reference/using-api/client-libraries/) page.

In each case, the service account credentials of the Pod are used to communicate
securely with the API server.

### Directly accessing the REST API

While running in a Pod, the Kubernetes apiserver is accessible via a Service named
`kubernetes` in the `default` namespace. Therefore, Pods can use the
`kubernetes.default.svc` hostname to query the API server. Official client libraries
do this automatically.

The recommended way to authenticate to the API server is with a
[service account](/docs/tasks/configure-pod-container/configure-service-account/) credential. By default, a Pod
is associated with a service account, and a credential (token) for that
service account is placed into the filesystem tree of each container in that Pod,
at `/var/run/secrets/kubernetes.io/serviceaccount/token`.

If available, a certificate bundle is placed into the filesystem tree of each
container at `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, and should be
used to verify the serving certificate of the API server.

Finally, the default namespace to be used for namespaced API operations is placed in a file
at `/var/run/secrets/kubernetes.io/serviceaccount/namespace` in each container.

### Using kubectl proxy

If you would like to query the API without an official client library, you can run `kubectl proxy`
as the [command](/docs/tasks/inject-data-application/define-command-argument-container/)
of a new sidecar container in the Pod. This way, `kubectl proxy` will authenticate
to the API and expose it on the `localhost` interface of the Pod, so that other containers
in the Pod can use it directly.

### Without using a proxy

It is possible to avoid using the kubectl proxy by passing the authentication token
directly to the API server.  The internal certificate secures the connection.

```shell
# Point to the internal API server hostname
APISERVER=https://kubernetes.default.svc

# Path to ServiceAccount token
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# Read this Pod's namespace
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Read the ServiceAccount bearer token
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Reference the internal certificate authority (CA)
CACERT=${SERVICEACCOUNT}/ca.crt

# Explore the API with TOKEN
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api
```

The output will be similar to this:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```
