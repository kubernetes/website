---
assignees:
- soltysh
- sttts
- ericchiang
title: Auditing
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

## Audit logs

Kubernetes audit is part of [Kube-apiserver][kube-apiserver] logging all requests
processed by the server. Each audit log entry contains two lines:

1. The request line containing a unique ID to match the response and request metadata, such as the source IP, requesting user, impersonation information, resource being requested, etc.
2. The response line containing a unique ID matching the request line and the response code.

Example output for `admin` user listing pods in the `default` namespace:

```
2017-03-21T03:57:09.106841886-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" ip="127.0.0.1" method="GET" user="admin" groups="\"system:masters\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="default" uri="/api/v1/namespaces/default/pods"
2017-03-21T03:57:09.108403639-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" response="200"
```

Note that this format changes when enabling the `AdvancedAuditing` feature discussed
later in this document.

### Configuration

[Kube-apiserver][kube-apiserver] provides the following options which are responsible
for configuring where and how audit logs are handled:

- `audit-log-path` - enables the audit log pointing to a file where the requests are being logged to, '-' means standard out.
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

## Advanced audit

Kubernetes 1.7 expands auditing with experimental functionality such as event
filtering and a webhook for integration with external systems. The rest of this
document covers features that are __alpha__ and may change in backward incompatible
ways.

Enable the alpha auditing features using the `AdvancedAuditing` feature gate on
the [kube-apiserver][kube-apiserver]:

```
--feature-gates=AdvancedAuditing=true
```

`AdvancedAuditing`is customizeable in two ways. Policy, which determines what's recorded,
and backends, which persist records. Backend implementations include logs files and
webhooks.

The structure of audit events changes when enabling the `AdvancedAuditing` feature
flag. This includes some cleanups, such as the `method` reflecting the verb evaluated
by the [authorization layer](/docs/admin/authorization/) instead of the [HTTP verb](/docs/admin/authorization/#determine-the-request-verb).
Also, instead of always generating two events per request, events are recorded with an associated "stage."
The known stages are:

- `RequestReceived` - The stage for events generated as soon as the audit handler receives the request.
- `ResponseStarted` - Once the response headers are sent, but before the response body is sent. This stage is only generated for long-running requests (e.g. watch).
- `ResponseComplete` - Once the response body has been completed.
- `Panic` - Events generated when a panic occured.

### Audit Policy

Audit policy is a document defining rules about what events should be recorded.
The policy is passed to the [kube-apiserver][kube-apiserver] using the
`--audit-policy-file` flag.

```
--audit-policy-file=/etc/kubernetes/audit-policy.yaml
```

If `AdvancedAuditing` is enabled and this flag is omitted, no events are logged.

The policy file holds rules that determine the level of an event. Known audit levels are:

- `None` - don't log events that match this rule.
- `Metadata` - log request metadata (requesting user, timestamp, resource, verb, etc.) but not request or response body.
- `Request` - log event metadata and request body but not response body.
- `RequestResponse` - log event metadata, request and response bodies.

When an event is processed it's compared against the list of rules in order.
The first matching rule sets the audit level of the event. The audit policy is
defined by the [`audit.k8s.io` API group][audit-api].

An example audit policy file:

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
    - group: "" # core API group
      resources: ["configmaps"]
    # This rule only applies to resources in the "kube-system" namespace.
    # The empty string "" can be used to select non-namespaced resources.
    namespaces: ["kube-system"]

  # Log configmap and secret changes in all other namespaces at the Metadata level.
  - level: Metadata
    resources:
    - group: "" # core API group
      resources: ["secrets", "configmaps"]

  # Log all other resources in core and extensions at the Request level.
  - level: Request
    resources:
    - group: "" # core API group
    - group: "extensions" # Version of group should NOT be included.

  # A catch-all rule to log all other requests at the Metadata level.
  - level: Metadata
```

You can use a minimal audit policy file to log all requests at the `Metadata` level:

```yaml
# Log all requests at the Metadata level.
rules:
- level: Metadata
```

The [audit profile used by GCE][gce-audit-profile] should be used as reference by
admins constructing their own audit profiles.

### Audit backends

Audit backends implement strategies for emitting events. The [kube-apiserver][kube-apiserver]
provides a logging and webhook backend.

Each request to the API server can generate multiple events, one when the request is received,
another when the response is sent, and additional events for long running requests (such as
watches). The ID of events will be the same if they were generated from the same request.

The event format is defined by the `audit.k8s.io` API group. The `v1alpha1` format of this
API can be found [here][audit-api] with more details about the exact fields captured.

#### Log backend

The behavior of the `--audit-log-path` flag changes when enabling the `AdvancedAuditing`
feature flag. This includes the cleanups discussed above, such as changes to the `method`
values and the introduction of a "stage" for each event. As before, the `id` field of
the log indicates which events were generated from the same request. With default legacy
format, events are formatted as follows:

```
2017-06-15T21:50:50.259470834Z AUDIT: id="591e9fde-6a98-46f6-b7bc-ec8ef575696d" stage="RequestReceived" ip="10.2.1.3" method="update" user="system:serviceaccount:kube-system:default" groups="\"system:serviceaccounts\",\"system:serviceaccounts:kube-system\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="kube-system" uri="/api/v1/namespaces/kube-system/endpoints/kube-controller-manager" response="<deferred>"
2017-06-15T21:50:50.259470834Z AUDIT: id="591e9fde-6a98-46f6-b7bc-ec8ef575696d" stage="ResponseComplete" ip="10.2.1.3" method="update" user="system:serviceaccount:kube-system:default" groups="\"system:serviceaccounts\",\"system:serviceaccounts:kube-system\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="kube-system" uri="/api/v1/namespaces/kube-system/endpoints/kube-controller-manager" response="200"
```

Logged events omit the request and response bodies. The `Request` and
`RequestResponse` levels are equivalent to `Metadata` for legacy format.

Since Kubernetes 1.8, structed json fromat is supported for log backend.
Use the following option to switch log to json format:

```
--audit-log-format=json
```

With json format, events are formatted as follows:

```
{"kind":"Event","apiVersion":"audit.k8s.io/v1alpha1","metadata":{"creationTimestamp":null},"level":"Metadata","timestamp":"2017-07-12T11:02:43Z","auditID":"2e79f0c9-a941-45ae-a9ce-663a1b19ff14","stage":"RequestReceived","requestURI":"/api/v1/namespaces/default/pods","verb":"list","user":{"username":"kubecfg","groups":["system:masters","system:authenticated"]},"sourceIPs":["172.16.116.128"],"objectRef":{"resource":"pods","namespace":"default","apiVersion":"/v1"}}
{"kind":"Event","apiVersion":"audit.k8s.io/v1alpha1","metadata":{"creationTimestamp":null},"level":"Metadata","timestamp":"2017-07-12T11:02:43Z","auditID":"2e79f0c9-a941-45ae-a9ce-663a1b19ff14","stage":"ResponseComplete","requestURI":"/api/v1/namespaces/default/pods","verb":"list","user":{"username":"kubecfg","groups":["system:masters","system:authenticated"]},"sourceIPs":["172.16.116.128"],"objectRef":{"resource":"pods","namespace":"default","apiVersion":"/v1"},"responseStatus":{"metadata":{},"code":200}}
```

#### Webhook backend

The audit webhook backend can be used to have [kube-apiserver][kube-apiserver]
send audit events to a remote service. The webhook requires the `AdvancedAuditing`
feature flag and is configured using the following command line flags:

```
--audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
--audit-webhook-mode=batch
```

`audit-webhook-mode` controls buffering strategies used by the webhook. Known modes are:

- `batch` - buffer events and asynchronously send the set of events to the external service.
- `blocking` - block API server responses on sending each event to the external service.

The webhook config file uses the kubeconfig format to specify the remote address of
the service and credentials used to connect to it.

```
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-audit-service
    cluster:
      certificate-authority: /path/to/ca.pem  # CA for verifying the remote service.
      server: https://audit.example.com/audit # URL of remote service to query. Must use 'https'.

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

### Log Collector Examples

#### Use fluentd to collect and distribute audit events from log file

[Fluentd][fluentd] is an open source data collector for unified logging layer.
In this example, we will use fluentd to split audit events by different namespaces.
Note that this example requries json format output support in Kubernetes 1.8.

1. install [fluentd, fluent-plugin-forest and fluent-plugin-rewrite-tag-filter][fluentd_install_doc] in the kube-apiserver node
1. create a config file for fluentd

          $ cat <<EOF > /etc/fluentd/config
          # fluentd conf runs in the same host with kube-apiserver
          <source>
              @type tail
              # audit log path of kube-apiserver
              path /var/log/audit
              pos_file /var/log/audit.pos
              format json
              time_key time
              time_format %Y-%m-%dT%H:%M:%S.%N%z
              tag audit
          </source>
          
          <filter audit>
              #https://github.com/fluent/fluent-plugin-rewrite-tag-filter/issues/13
              type record_transformer
              enable_ruby
              <record>
              	namespace ${record["objectRef"].nil? ? "none":(record["objectRef"]["namespace"].nil? ?  "none":record["objectRef"]["namespace"])}
              </record>
          </filter>
          
          <match audit>
              # route audit according to namespace element in context
              @type rewrite_tag_filter
              rewriterule1 namespace ^(.+) ${tag}.$1
          </match>
          
          <filter audit.**>
          	  @type record_transformer
          	  remove_keys namespace
          </filter>
          
          <match audit.**>
              @type forest
              subtype file
              remove_prefix audit
              <template>
                  time_slice_format %Y%m%d%H
                  compress gz
                  path /var/log/audit-${tag}.*.log
                  format json
                  include_time_key true
              </template>
          </match>
1. start fluentd

          $ fluentd -c /etc/fluentd/config  -vv
1. start kube-apiserver with the following options:

          --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-log-path=/var/log/kube-audit --audit-log-format=json
1. check audits for different namespaces in /var/log/audit-*.log

#### Use logstash to collect and distribute audit events from webhook backend

[Logstash][logstash] is an open source, server-side data processing tool. In this example,
we will use logstash to collect audit events from webhook backend, and save events of
different users into different files.

1. install [logstash][logstash_install_doc]
1. create config file for logstash

          $ cat <<EOF > /etc/logstash/config
          input{
              http{
                  #TODO, figure out a way to use kubeconfig file to authenticate to logstash
                  #https://www.elastic.co/guide/en/logstash/current/plugins-inputs-http.html#plugins-inputs-http-ssl
                  port=>8888
              }
          }
          filter{
              split{
                  # Webhook audit backend sends several events together with EventList
                  # split each event here.
                  field=>[items]
                  # We only need event subelement, remove others.
                  remove_field=>[headers, metadata, apiVersion, "@timestamp", kind, "@version", host]
              }
              mutate{
                  rename => {items=>event}
              }
          }
          output{
              file{
                  # Audit events from different users will be saved into different files.
                  path=>"/var/log/kube-audit-%{[event][user][username]}/audit"
              }
          }
1. start logstash

          $ bin/logstash -f /etc/logstash/config --path.settings /etc/logstash/
1. create a [kubeconfig file](/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/) for kube-apiserver webhook audit backend

          $ cat <<EOF > /etc/kubernetes/audit-webhook-kubeconfig
          apiVersion: v1
          clusters:
          - cluster:
              server: http://<ip_of_logstash>:8888
            name: logstash
          contexts:
          - context:
              cluster: logstash
              user: ""
            name: default-context
          current-context: default-context
          kind: Config
          preferences: {}
          users: []
          EOF
1. start kube-apiserver with the following options:

          --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
1. check audits in logstash node's directories /var/log/kube-audit-*/audit

Note that in addition to file output plugin, logstash has a variety of outputs that
let users route data where they want. For example, users can emit audit events to elasticsearch
plugin which supports full-text search and analytics.

[audit-api]: https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/staging/src/k8s.io/apiserver/pkg/apis/audit/v1alpha1/types.go
[kube-apiserver]: /docs/admin/kube-apiserver
[gce-audit-profile]: https://github.com/kubernetes/kubernetes/blob/v1.7.0/cluster/gce/gci/configure-helper.sh#L490
[fluentd]: http://www.fluentd.org/
[fluentd_install_doc]: http://docs.fluentd.org/v0.12/articles/quickstart#step1-installing-fluentd
[logstash]: https://www.elastic.co/products/logstash
[logstash_install_doc]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
