---
reviewers:
- jpbetz
title: Mixed Version Proxy
content_type: concept
weight: 220
---

<!-- overview -->

{{< feature-state feature_gate_name="UnknownVersionInteroperabilityProxy" >}}

Kubernetes {{< skew currentVersion >}} includes an alpha feature that lets an
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
proxy a resource requests to other _peer_ API servers. This is useful when there are multiple
API servers running different versions of Kubernetes in one cluster
(for example, during a long-lived rollout to a new release of Kubernetes).

This enables cluster administrators to configure highly available clusters that can be upgraded
more safely, by directing resource requests (made during the upgrade) to the correct kube-apiserver.
That proxying prevents users from seeing unexpected 404 Not Found errors that stem
from the upgrade process.

This mechanism is called the _Mixed Version Proxy_.

## Enabling the Mixed Version Proxy

Ensure that `UnknownVersionInteroperabilityProxy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled when you start the {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}:

```shell
kube-apiserver \
--feature-gates=UnknownVersionInteroperabilityProxy=true \
# required command line arguments for this feature
--peer-ca-file=<path to kube-apiserver CA cert>
--proxy-client-cert-file=<path to aggregator proxy cert>,
--proxy-client-key-file=<path to aggregator proxy key>,
--requestheader-client-ca-file=<path to aggregator CA cert>,
# requestheader-allowed-names can be set to blank to allow any Common Name
--requestheader-allowed-names=<valid Common Names to verify proxy client cert against>,

# optional flags for this feature
--peer-advertise-ip=`IP of this kube-apiserver that should be used by peers to proxy requests`
--peer-advertise-port=`port of this kube-apiserver that should be used by peers to proxy requests`

# …and other flags as usual
```

### Proxy transport and authentication between API servers {#transport-and-authn}

* The source kube-apiserver reuses the
  [existing APIserver client authentication flags](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#kubernetes-apiserver-client-authentication)
  `--proxy-client-cert-file` and `--proxy-client-key-file` to present its identity that
  will be verified by its peer (the destination kube-apiserver). The destination API server
  verifies that peer connection based on the configuration you specify using the
  `--requestheader-client-ca-file` command line argument.

* To authenticate the destination server's serving certs, you must configure a certificate
  authority bundle by specifying the `--peer-ca-file` command line argument to the **source** API server.

### Configuration for peer API server connectivity

To set the network location of a kube-apiserver that peers will use to proxy requests, use the
`--peer-advertise-ip` and `--peer-advertise-port` command line arguments to kube-apiserver or specify
these fields in the API server configuration file.
If these flags are unspecified, peers will use the value from either `--advertise-address` or
`--bind-address` command line argument to the kube-apiserver.
If those too, are unset, the host's default interface is used.

## Mixed version proxying

When you enable mixed version proxying, the [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
loads a special filter that does the following:

* When a resource request reaches an API server that cannot serve that API
  (either because it is at a version pre-dating the introduction of the API or the API is turned off on the API server)
  the API server attempts to send the request to a peer API server that can serve the requested API.
  It does so by identifying API groups / versions / resources that the local server doesn't recognise,
  and tries to proxy those requests to a peer API server that is capable of handling the request.
* If the peer API server fails to respond, the _source_ API server responds with 503 ("Service Unavailable") error.

### How it works under the hood

When an API Server receives a resource request, it first checks which API servers can
serve the requested resource. This check happens using the internal
[`StorageVersion` API](/docs/reference/generated/kubernetes-api/v{{< skew currentVersion >}}/#storageversioncondition-v1alpha1-internal-apiserver-k8s-io).

* If the resource is known to the API server that received the request
  (for example, `GET /api/v1/pods/some-pod`), the request is handled locally.

* If there is no internal `StorageVersion` object found for the requested resource
  (for example, `GET /my-api/v1/my-resource`) and the configured APIService specifies proxying
  to an extension API server, that proxying happens following the usual
  [flow](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) for extension APIs.

* If a valid internal `StorageVersion` object is found for the requested resource
  (for example, `GET /batch/v1/jobs`) and the API server trying to handle the request
  (the _handling API server_) has the `batch` API disabled, then the _handling API server_
  fetches the peer API servers that do serve the relevant API group / version / resource
  (`api/v1/batch` in this case) using the information in the fetched `StorageVersion` object.
  The _handling API server_ then proxies the request to one of the matching peer kube-apiservers
  that are aware of the requested resource.

  * If there is no peer known for that API group / version / resource, the handling API server
    passes the request to its own handler chain which should eventually return a 404 ("Not Found") response.

  * If the handling API server has identified and selected a peer API server, but that peer fails
    to respond (for reasons such as network connectivity issues, or a data race between the request
    being received and a controller registering the peer's info into the control plane), then the handling
    API server responds with a 503 ("Service Unavailable") error.
