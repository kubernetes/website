---
assignees:
- soltysh
- sttts
- ericchiang
title: Auditing
redirect_from:
- "/docs/admin/audit/"
- "/docs/admin/audit.html"
- "/docs/concepts/cluster-administration/audit/"
- "/docs/concepts/cluster-administration/audit.html"
---

* TOC
{:toc}

Kubernetes Audit provides a security-relevant chronological set of records documenting
the sequence of activities that have affected system by individual users, administrators
or other components of the system. It allows cluster administrator to
answer the following questions:

    - what happened?
    - when did it happen?
    - who initiated it?
    - on what did it happen?
    - where was it observed?
    - from where was it initiated?
    - to where was it going?

Audit is composed of two phases. Policy, which determines what's recorded, and backends,
which persist records. Backend implementations include logs files and webhooks.

As of 1.7 audit features require the `AdvancedAuditing` feature gate on the
[kube-apiserver][kube-apiserver], which can be enabled through the `--feature-gates`
flag.

```
--feature-gates=AdvancedAuditing=true
```

If disabled, the legacy 1.6 behavior is preserved.

## Audit Policy

Audit policy is a document defining rules about what events should be recorded. It's passed
to the [kube-apiserver][kube-apiserver] using the `--audit-policy-file` flag.

```
--audit-policy-file=/etc/kubernetes/audit-policy.yaml
```

If `AdvancedAuditing` is enabled and this flag is omitted, no events will be logged.

The policy file holds rules that determine the level of an event. Known audit levels are:

- `None` - don't log events that match this rule.
- `Metadata` - log event metadata but not request or response body.
- `Request` - log event metadata and request body but not response body.
- `RequestResponse` - log event metadata, request and response bodies.

When an event is processed it's compared against the list of rules in order.
The first matching rule sets the audit level of the event. An example audit
policy file:

```yaml
rules:
  # Don't log watch requests by the "system:kube-proxy" on endpoints or services
  - level: None
    users: ["system:kube-proxy"]
    verbs: ["watch"]
    resources:
    - group: "" # core API group
      resources: ["endpoints", "services"]

  # Don't log authenticated requests to certain non-resource URL paths.
  - level: None
    userGroups: ["system:authenticated"]
    nonResourceURLs:
    - "/api*" # Wildcard matching.
    - "/version"

  # Log the request body of configmap changes in kube-system.
  - level: Request
    resources:
    - group: ""
      resources: ["configmaps"]
    # The empty string "" can be used to select non-namespaced resources.
    namespaces: ["kube-system"]

  # Log configmap and secret changes in all other namespaces at the Metadata level.
  - level: Metadata
    resources:
    - group: "" # core API group
      resources: ["secrets", "configmaps"]
  - level: Request
    resources:
    - group: ""
      resources: ["configmaps"]

  # Log all other resources in core and extensions at the Request level.
  - level: Request
    resources:
    - group: ""
  - level: Request
    resources:
    - group: "extensions/v1beta1"

  # A catch-all rule to log all other requests at the Metadata level.
  - level: Metadata
```

A minimal audit policy file can be used to log all requests at the `Metadata` level:

```yaml
# Log all requests at the Metadata level.
rules:
- level: Metadata
```

## Audit backends

Audit backends implement strategies for emitting events. The [kube-apiserver][kube-apiserver]
provides a logging and webhook backend.

Each request to the API server can generate multiple events, one when the request is received,
another when the response is sent, and additional events for log running requests (such as
watches). The ID of events will be the same if they were generated from the same request.

The event format is defined by the `audit.k8s.io` API group. The `v1alpha1` format of this
API can be found [here][audit-api] with more details about the exact fields captured.

### Audit logs

[Kube-apiserver][kube-apiserver] provides the following options which are responsible
for configuring where and how audit logs are handled:

- `audit-log-path` - enables the audit log pointing to a file where the requests are being logged to.
- `audit-log-maxage` - specifies maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
- `audit-log-maxbackup` - specifies maximum number of old audit log files to retain.
- `audit-log-maxsize` - specifies maximum size in megabytes of the audit log file before it gets rotated. Defaults to 100MB

If an audit log file already exists, Kubernetes appends new audit logs to that file.
Otherwise, Kubernetes creates an audit log file at the location you specified in
`audit-log-path`. If the audit log file exceeds the size you specify in `audit-log-maxsize`,
Kubernetes will rename the current log file by appending the current timestamp on
the file name (before the file extension) and create a new audit log file.
Kubernetes may delete old log files when creating a new log file; you can configure
how many files are retained and how old they can be by specifying the `audit-log-maxbackup`
and `audit-log-maxage` options.

Logged events are printed as:

```
2017-06-15T21:50:50.259470834Z AUDIT: id="591e9fde-6a98-46f6-b7bc-ec8ef575696d" stage="RequestReceived" ip="10.2.1.3" method="update" user="system:serviceaccount:kube-system:default" groups="\"system:serviceaccounts\",\"system:serviceaccounts:kube-system\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="kube-system" uri="/api/v1/namespaces/kube-system/endpoints/kube-controller-manager" response="<deferred>"
2017-06-15T21:50:50.259470834Z AUDIT: id="591e9fde-6a98-46f6-b7bc-ec8ef575696d" stage="ResponseComplete" ip="10.2.1.3" method="update" user="system:serviceaccount:kube-system:default" groups="\"system:serviceaccounts\",\"system:serviceaccounts:kube-system\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="kube-system" uri="/api/v1/namespaces/kube-system/endpoints/kube-controller-manager" response="200"
```

If the `AdvancedAuditing` feature flag is not enabled, the audit log reverts to its legacy format:

```
2017-03-21T03:57:09.106841886-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" ip="127.0.0.1" method="GET" user="admin" groups="\"system:masters\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="default" uri="/api/v1/namespaces/default/pods"
2017-03-21T03:57:09.108403639-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" response="200"
```

### Audit webhook

The audit webhook backend can be used to have [kube-apiserver][kube-apiserver]
send audit events to a remote service. The webhook requires the `AdvancedAuditing`
feature flag and is configured using the following command line flags:

```
--audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
--audit-webhook-mode=batch
```

`audit-webhook-mode` controls caching strategies used by the webhook. Known modes are:

- `batch` - buffer events and asynchronously send the set of events to the external service.
- `blocking` - block API server responses on sending each event to the external service.

The webhook config file uses the kubeconfig format for specify the remote address of
the service and credentials used to connect to it.

```
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-audit-service
    cluster:
      certificate-authority: /path/to/ca.pem         # CA for verifying the remote service.
      server: https://authn.example.com/authenticate # URL of remote service to query. Must use 'https'.

# users refers to the API server's webhook configuration.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # cert for the webhook plugin to use
      client-key: /path/to/key.pem          # key matching the cert

# kubeconfig files require a context. Provide one for the API server.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-audit-service
    user: name-of-api-sever
  name: webhook
```

Events are POSTed as a JSON serialized `EventList`. An example payload:

```json
{
  "kind": "EventList",
  "apiVersion": "audit.k8s.io/v1alpha1",
  "items": [
    {
      "metadata": {
        "creationTimestamp": null
      },
      "level": "Metadata",
      "timestamp": "2017-06-15T23:07:40Z",
      "auditID": "4faf711a-9094-400f-a876-d9188ceda548",
      "stage": "ResponseComplete",
      "requestURI": "/apis/rbac.authorization.k8s.io/v1beta1/namespaces/kube-public/rolebindings/system:controller:bootstrap-signer",
      "verb": "get",
      "user": {
        "username": "system:apiserver",
        "uid": "97a62906-e4d7-4048-8eda-4f0fb6ff8f1e",
        "groups": [
          "system:masters"
        ]
      },
      "sourceIPs": [
        "127.0.0.1"
      ],
      "objectRef": {
        "resource": "rolebindings",
        "namespace": "kube-public",
        "name": "system:controller:bootstrap-signer",
        "apiVersion": "rbac.authorization.k8s.io/v1beta1"
      },
      "responseStatus": {
        "metadata": {},
        "code": 200
      }
    }
  ]
}
```

[audit-api]: https://godoc.org/k8s.io/apiserver/pkg/apis/audit/v1alpha1
[kube-apiserver]: /docs/admin/kube-apiserver
