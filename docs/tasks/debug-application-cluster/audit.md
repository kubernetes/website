---
approvers:
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

## Legacy Audit

Kubernetes audit is part of [Kube-apiserver][kube-apiserver] logging all requests
processed by the server. Each audit log entry contains two lines:

1. The request line containing a unique ID to match the response and request metadata, such as the source IP, requesting user, impersonation information, resource being requested, etc.
2. The response line containing a unique ID matching the request line and the response code.

Example output for `admin` user listing pods in the `default` namespace:

```
2017-03-21T03:57:09.106841886-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" ip="127.0.0.1" method="GET" user="admin" groups="\"system:masters\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="default" uri="/api/v1/namespaces/default/pods"
2017-03-21T03:57:09.108403639-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" response="200"
```

Note that Kubernetes 1.8 has switched to use the advanced structured audit log by default.
To fallback to this legacy audit, disable the advanced auditing feature
using the `AdvancedAuditing` feature gate on the [kube-apiserver][kube-apiserver]:

```
--feature-gates=AdvancedAuditing=false
```

### Configuration

[Kube-apiserver][kube-apiserver] provides the following options which are responsible
for configuring where and how audit logs are handled:

- `audit-log-path` - enables the audit log pointing to a file where the requests are being logged to, '-' means standard out.
- `audit-log-maxage` - specifies maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
- `audit-log-maxbackup` - specifies maximum number of old audit log files to retain.
- `audit-log-maxsize` - specifies maximum size in megabytes of the audit log file before it gets rotated. Defaults to 100MB.

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
filtering and a webhook for integration with external systems. Kubernetes 1.8
upgrades the advanced audit feature to beta, and some backward incompatible changes
have been committed.


`AdvancedAuditing` is customizable in two ways. Policy, which determines what's recorded,
and backends, which persist records. Backend implementations include logs files and
webhooks.

The structure of audit events changes when enabling the `AdvancedAuditing` feature
flag. This includes some cleanups, such as the `method` reflecting the verb evaluated
by the [authorization layer](/docs/admin/authorization/) instead of the [HTTP verb](/docs/admin/authorization/#determine-the-request-verb).
Also, instead of always generating two events per request, events are recorded with an associated "stage".
The known stages are:

- `RequestReceived` - The stage for events generated as soon as the audit handler receives the request.
- `ResponseStarted` - Once the response headers are sent, but before the response body is sent. This stage is only generated for long-running requests (e.g. watch).
- `ResponseComplete` - Once the response body has been completed.
- `Panic` - Events generated when a panic occurred.

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

When an event is processed, it's compared against the list of rules in order.
The first matching rule sets the audit level of the event. The audit policy is
defined by the [`audit.k8s.io` API group][audit-api].
Some new fields are supported in beta version, like `resourceNames` and `omitStages`.

In Kubernetes 1.8 `kind` and `apiVersion` along with `rules` __must__ be provided in
the audit policy file. A policy file with 0 rules, or a policy file that doesn't provide
a valid `apiVersion` and `kind` value will be treated as illgal.

Some example audit policy files:

```yaml
apiVersion: audit.k8s.io/v1beta1  #this is required in Kubernetes 1.8
kind: Policy
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

The next audit policy file shows new features introduced in Kubernetes 1.8:

```yaml
apiVersion: audit.k8s.io/v1beta1
kind: Policy
rules:
  # Log pod changes at Request level
  - level: Request
    resources:
    - group: ""
      # Resource "pods" no longer matches requests to any subresource of pods,
      # This behavior is consistent with the RBAC policy.
      resources: ["pods"]
  # Log "pods/log", "pods/status" at Metadata level
  - level: Metadata
    resources:
    - group: ""
      resources: ["pods/log", "pods/status"]

  # Don't log requests to a configmap called "controller-leader"
  - level: None
    resources:
    - group: ""
      resources: ["configmaps"]
      resourceNames: ["controller-leader"]

  # A catch-all rule to log all other requests at the Metadata level.
  # For this rule we use "omitStages" to omit events at "ReqeustReceived" stage.
  # Events in this stage will not be sent to backend.
  - level: Metadata
    omitStages:
      - "RequestReceived"
```

You can use a minimal audit policy file to log all requests at the `Metadata` level:

```yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1beta1
kind: Policy
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
feature flag. All generated events defined by `--audit-policy-file` are recorded in structured
json format:

```
{"kind":"Event","apiVersion":"audit.k8s.io/v1beta1","metadata":{"creationTimestamp":null},"level":"Metadata","timestamp":"2017-09-05T10:04:55Z","auditID":"77e58433-d345-40ac-b2d8-9866bd355cea","stage":"RequestReceived","requestURI":"/apis/rbac.authorization.k8s.io/v1/namespaces/default/roles","verb":"list","user":{"username":"kubecfg","groups":["system:masters","system:authenticated"]},"sourceIPs":["172.16.116.128"],"objectRef":{"resource":"roles","namespace":"default","apiGroup":"rbac.authorization.k8s.io","apiVersion":"v1"}}
{"kind":"Event","apiVersion":"audit.k8s.io/v1beta1","metadata":{"creationTimestamp":null},"level":"Metadata","timestamp":"2017-09-05T10:04:55Z","auditID":"77e58433-d345-40ac-b2d8-9866bd355cea","stage":"ResponseComplete","requestURI":"/apis/rbac.authorization.k8s.io/v1/namespaces/default/roles","verb":"list","user":{"username":"kubecfg","groups":["system:masters","system:authenticated"]},"sourceIPs":["172.16.116.128"],"objectRef":{"resource":"roles","namespace":"default","apiGroup":"rbac.authorization.k8s.io","apiVersion":"v1"},"responseStatus":{"metadata":{},"code":200}}
```

In alpha version, objectRef.apiVersion holds both the api group and version.
In beta version these were break out into objectRef.apiGroup and objectRef.apiVersion.

Starting from Kubernetes 1.8, structured json format is used for log backend by default.
Use the following option to switch log to legacy format:

```
--audit-log-format=legacy
```

With legacy format, events are formatted as follows:

```
2017-09-05T06:08:19.885328047-04:00 AUDIT: id="c28a95ad-f9dd-47e1-a617-b6dc152db95f" stage="RequestReceived" ip="172.16.116.128" method="list" user="kubecfg" groups="\"system:masters\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="default" uri="/apis/rbac.authorization.k8s.io/v1/namespaces/default/roles" response="<deferred>"
2017-09-05T06:08:19.885328047-04:00 AUDIT: id="c28a95ad-f9dd-47e1-a617-b6dc152db95f" stage="ResponseComplete" ip="172.16.116.128" method="list" user="kubecfg" groups="\"system:masters\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="default" uri="/apis/rbac.authorization.k8s.io/v1/namespaces/default/roles" response="200"
```

Logged events omit the request and response bodies. The `Request` and
`RequestResponse` levels are equivalent to `Metadata` for legacy format. This legacy format
of advanced audit is different from the [Legacy Audit](# Legacy Audit) discussed above, such
as changes to the method values and the introduction of a "stage" for each event.

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
    "apiVersion": "audit.k8s.io/v1beta1",
    "items": [
        {
            "auditID": "24f30caf-d7d4-45d5-b7bd-e7af300d7886",
            "level": "Metadata",
            "metadata": {
                "creationTimestamp": null
            },
            "objectRef": {
                "apiGroup": "rbac.authorization.k8s.io",
                "apiVersion": "v1",
                "name": "jane",
                "namespace": "default",
                "resource": "roles"
            },
            "requestURI": "/apis/rbac.authorization.k8s.io/v1/namespaces/default/roles/jane",
            "responseStatus": {
                "code": 200,
                "metadata": {}
            },
            "sourceIPs": [
                "172.16.116.128"
            ],
            "stage": "ResponseComplete",
            "timestamp": "2017-09-05T10:20:24Z",
            "user": {
                "groups": [
                    "system:masters",
                    "system:authenticated"
                ],
                "username": "kubecfg"
            },
            "verb": "get"
        }
    ],
    "kind": "EventList",
    "metadata": {}
}
```

### Audit-Id

Audit-Id is a unique ID for each http request to kube-apiserver. The ID of events will be the
same if they were generated from the same request. Starting from Kubernetes 1.8, if an audit
event is generated for the request, kube-apiserver will respond with an Audit-Id in the HTTP header.
Note that for some special requests like `kubectl exec`, `kubectl attach`, kube-apiserver works
like a proxy, no Audit-Id will be returned even if audit events are recorded.

### Log Collector Examples

#### Use fluentd to collect and distribute audit events from log file

[Fluentd][fluentd] is an open source data collector for unified logging layer.
In this example, we will use fluentd to split audit events by different namespaces.
Note that this example requires json format output support in Kubernetes 1.8.

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

[audit-api]: https://github.com/kubernetes/kubernetes/blob/v1.8.0-beta.1/staging/src/k8s.io/apiserver/pkg/apis/audit/v1beta1/types.go
[kube-apiserver]: /docs/admin/kube-apiserver
[gce-audit-profile]: https://github.com/kubernetes/kubernetes/blob/v1.8.0-beta.0/cluster/gce/gci/configure-helper.sh#L532
[fluentd]: http://www.fluentd.org/
[fluentd_install_doc]: http://docs.fluentd.org/v0.12/articles/quickstart#step1-installing-fluentd
[logstash]: https://www.elastic.co/products/logstash
[logstash_install_doc]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
