---
reviewers:
- soltysh
- sttts
- ericchiang
content_template: templates/concept
title: Auditing
---

{{% capture overview %}}

Kubernetes auditing provides a security-relevant chronological set of records documenting
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

{{% /capture %}}


{{% capture body %}}

[Kube-apiserver][kube-apiserver] performs auditing. Each request on each stage
of its execution generates an event, which is then pre-processed according to
a certain policy and written to a backend. The policy determines what's recorded
and the backends persist the records. The current backend implementations
include logs files and webhooks.

Each request can be recorded with an associated "stage". The known stages are:

- `RequestReceived` - The stage for events generated as soon as the audit
  handler receives the request, and before it is delegated down the handler
  chain.
- `ResponseStarted` - Once the response headers are sent, but before the
  response body is sent. This stage is only generated for long-running requests
  (e.g. watch).
- `ResponseComplete` - The response body has been completed and no more bytes
  will be sent.
- `Panic` - Events generated when a panic occurred.

{{< note >}}
The audit logging feature increases the memory consumption of the API server
because some context required for auditing is stored for each request.
Additionally, memory consumption depends on the audit logging configuration.
{{< /note >}}

## Audit Policy

Audit policy defines rules about what events should be recorded and what data
they should include. The audit policy object structure is defined in the
[`audit.k8s.io` API group][auditing-api]. When an event is processed, it's
compared against the list of rules in order. The first matching rule sets the
"audit level" of the event. The known audit levels are:

- `None` - don't log events that match this rule.
- `Metadata` - log request metadata (requesting user, timestamp, resource,
  verb, etc.) but not request or response body.
- `Request` - log event metadata and request body but not response body.
  This does not apply for non-resource requests.
- `RequestResponse` - log event metadata, request and response bodies.
  This does not apply for non-resource requests.

You can pass a file with the policy to [kube-apiserver][kube-apiserver]
using the `--audit-policy-file` flag. If the flag is omitted, no events are logged.
Note that the `rules` field __must__ be provided in the audit policy file.
A policy with no (0) rules is treated as illegal.

Below is an example audit policy file:

{{< codenew file="audit/audit-policy.yaml" >}}

You can use a minimal audit policy file to log all requests at the `Metadata` level:

```yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

The [audit profile used by GCE][gce-audit-profile] should be used as reference by
admins constructing their own audit profiles.

## Audit backends

Audit backends persist audit events to an external storage.
[Kube-apiserver][kube-apiserver] out of the box provides three backends:

- Log backend, which writes events to a disk
- Webhook backend, which sends events to an external API
- Dynamic backend, which configures webhook backends through an AuditSink API object.

In all cases, audit events structure is defined by the API in the
`audit.k8s.io` API group. The current version of the API is
[`v1`][auditing-api].

{{< note >}}
In case of patches, request body is a JSON array with patch operations, not a JSON object
with an appropriate Kubernetes API object. For example, the following request body is a valid patch
request to `/apis/batch/v1/namespaces/some-namespace/jobs/some-job-name`.

```json
[
  {
    "op": "replace",
    "path": "/spec/parallelism",
    "value": 0
  },
  {
    "op": "remove",
    "path": "/spec/template/spec/containers/0/terminationMessagePolicy"
  }
]
```
{{< /note >}}

### Log backend

Log backend writes audit events to a file in JSON format. You can configure
log audit backend using the following [kube-apiserver][kube-apiserver] flags:

- `--audit-log-path` specifies the log file path that log backend uses to write
  audit events. Not specifying this flag disables log backend. `-` means standard out
- `--audit-log-maxage` defined the maximum number of days to retain old audit log files
- `--audit-log-maxbackup` defines the maximum number of audit log files to retain
- `--audit-log-maxsize` defines the maximum size in megabytes of the audit log file before it gets rotated

### Webhook backend

Webhook backend sends audit events to a remote API, which is assumed to be the
same API as [kube-apiserver][kube-apiserver] exposes. You can configure webhook
audit backend using the following kube-apiserver flags:

- `--audit-webhook-config-file` specifies the path to a file with a webhook
  configuration. Webhook configuration is effectively a [kubeconfig][kubeconfig].
- `--audit-webhook-initial-backoff` specifies the amount of time to wait after the first failed
  request before retrying. Subsequent requests are retried with exponential backoff.

The webhook config file uses the kubeconfig format to specify the remote address of
the service and credentials used to connect to it.

In v1.13 webhook backends can be configured [dynamically](#dynamic-backend).

### Batching

Both log and webhook backends support batching. Using webhook as an example, here's the list of
available flags. To get the same flag for log backend, replace `webhook` with `log` in the flag
name. By default, batching is enabled in `webhook` and disabled in `log`. Similarly, by default
throttling is enabled in `webhook` and disabled in `log`.

- `--audit-webhook-mode` defines the buffering strategy. One of the following:
  - `batch` - buffer events and asynchronously process them in batches. This is the default.
  - `blocking` - block API server responses on processing each individual event.
  - `blocking-strict` - Same as blocking, but when there is a failure during audit logging at RequestReceived stage, the whole request to apiserver will fail.

The following flags are used only in the `batch` mode.

- `--audit-webhook-batch-buffer-size` defines the number of events to buffer before batching.
  If the rate of incoming events overflows the buffer, events are dropped.
- `--audit-webhook-batch-max-size` defines the maximum number of events in one batch.
- `--audit-webhook-batch-max-wait` defines the maximum amount of time to wait before unconditionally
  batching events in the queue.
- `--audit-webhook-batch-throttle-qps` defines the maximum average number of batches generated
  per second.
- `--audit-webhook-batch-throttle-burst` defines the maximum number of batches generated at the same
  moment if the allowed QPS was underutilized previously.

#### Parameter tuning

Parameters should be set to accommodate the load on the apiserver.

For example, if kube-apiserver receives 100 requests each second, and each request is audited only
on `ResponseStarted` and `ResponseComplete` stages, you should account for ~200 audit
events being generated each second. Assuming that there are up to 100 events in a batch,
you should set throttling level at least 2 QPS. Assuming that the backend can take up to
5 seconds to write events, you should set the buffer size to hold up to 5 seconds of events, i.e.
10 batches, i.e. 1000 events.

In most cases however, the default parameters should be sufficient and you don't have to worry about
setting them manually. You can look at the following Prometheus metrics exposed by kube-apiserver
and in the logs to monitor the state of the auditing subsystem.

- `apiserver_audit_event_total` metric contains the total number of audit events exported.
- `apiserver_audit_error_total` metric contains the total number of events dropped due to an error
  during exporting.

### Truncate

Both log and webhook backends support truncating. As an example, the following is the list of flags
available for the log backend:

 - `audit-log-truncate-enabled` whether event and batch truncating is enabled.
 - `audit-log-truncate-max-batch-size` maximum size in bytes of the batch sent to the underlying backend.
 - `audit-log-truncate-max-event-size` maximum size in bytes of the audit event sent to the underlying backend.

By default truncate is disabled in both `webhook` and `log`, a cluster administrator should set `audit-log-truncate-enabled` or `audit-webhook-truncate-enabled` to enable the feature.

### Dynamic backend

{{< feature-state for_k8s_version="v1.13" state="alpha" >}}

In Kubernetes version 1.13, you can configure dynamic audit webhook backends AuditSink API objects.

To enable dynamic auditing you must set the following apiserver flags:

- `--audit-dynamic-configuration`: the primary switch. When the feature is at GA, the only required flag.
- `--feature-gates=DynamicAuditing=true`: feature gate at alpha and beta.
- `--runtime-config=auditregistration.k8s.io/v1alpha1=true`: enable API.

When enabled, an AuditSink object can be provisioned:

```yaml
apiVersion: auditregistration.k8s.io/v1alpha1
kind: AuditSink
metadata:
  name: mysink
spec:
  policy:
    level: Metadata
    stages:
    - ResponseComplete
  webhook:
    throttle:
      qps: 10
      burst: 15
    clientConfig:
      url: "https://audit.app"
```

For the complete API definition, see [AuditSink](/docs/reference/generated/kubernetes-api/v1.13/#auditsink-v1alpha1-auditregistration). Multiple objects will exist as independent solutions.

Existing static backends that you configure with runtime flags are not affected by this feature. However, the dynamic backends share the truncate options of the static webhook. If webhook truncate options are set with runtime flags, they are applied to all dynamic backends.

#### Policy

The AuditSink policy differs from the legacy audit runtime policy. This is because the API object serves different use cases. The policy will continue to evolve to serve more use cases.

The `level` field applies the given audit level to all requests. The `stages` field is now a whitelist of stages to record.

#### Contacting the webhook

Once the API server has determined a request should be sent to a audit sink webhook,
it needs to know how to contact the webhook. This is specified in the `clientConfig`
stanza of the webhook configuration.

Audit sink webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.

##### URL

`url` gives the location of the webhook, in standard URL form
(`scheme://host:port/path`).

The `host` should not refer to a service running in the cluster; use
a service reference by specifying the `service` field instead.
The host might be resolved via external DNS in some apiservers
(i.e., `kube-apiserver` cannot resolve in-cluster DNS as that would 
be a layering violation). `host` may also be an IP address.

Please note that using `localhost` or `127.0.0.1` as a `host` is
risky unless you take great care to run this webhook on all hosts
which run an apiserver which might need to make calls to this
webhook. Such installs are likely to be non-portable, i.e., not easy
to turn up in a new cluster.

The scheme must be "https"; the URL must begin with "https://".

Attempting to use a user or basic auth e.g. "user:password@" is not allowed.
Fragments ("#...") and query parameters ("?...") are also not allowed.

Here is an example of a webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):

```yaml
apiVersion: auditregistration.k8s.io/v1alpha1
kind: AuditSink
...
spec:
  webhook:
    clientConfig:
      url: "https://my-webhook.example.com:9443/my-webhook-path"
```

##### Service Reference

The `service` stanza inside `clientConfig` is a reference to the service for a audit sink webhook.
If the webhook is running within the cluster, then you should use `service` instead of `url`.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".

Here is an example of a webhook that is configured to call a service on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle.

```yaml
apiVersion: auditregistration.k8s.io/v1alpha1
kind: AuditSink
...
spec:
  webhook:
    clientConfig:
      service:
        namespace: my-service-namespace
        name: my-service-name
        path: /my-path
        port: 1234
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
```

#### Security

Administrators should be aware that allowing write access to this feature grants read access to all cluster data. Access should be treated as a `cluster-admin` level privilege.

#### Performance

Currently, this feature has performance implications for the apiserver in the form of increased cpu and memory usage. This should be nominal for a small number of sinks, and performance impact testing will be done to understand its scope before the API progresses to beta.

## Multi-cluster setup

If you're extending the Kubernetes API with the [aggregation layer][kube-aggregator], you can also
set up audit logging for the aggregated apiserver. To do this, pass the configuration options in the
same format as described above to the aggregated apiserver and set up the log ingesting pipeline
to pick up audit logs. Different apiservers can have different audit configurations and different
audit policies.

## Log Collector Examples

### Use fluentd to collect and distribute audit events from log file

[Fluentd][fluentd] is an open source data collector for unified logging layer.
In this example, we will use fluentd to split audit events by different namespaces.

1. install [fluentd][fluentd_install_doc],  fluent-plugin-forest and fluent-plugin-rewrite-tag-filter in the kube-apiserver node
{{< note >}}
Fluent-plugin-forest and fluent-plugin-rewrite-tag-filter are plugins for fluentd. You can get details about plugin installation from [fluentd plugin-management][fluentd_plugin_management_doc].
{{< /note >}}

1. create a config file for fluentd

    ```
    cat <<'EOF' > /etc/fluentd/config
    # fluentd conf runs in the same host with kube-apiserver
    <source>
        @type tail
        # audit log path of kube-apiserver
        path /var/log/kube-audit
        pos_file /var/log/audit.pos
        format json
        time_key time
        time_format %Y-%m-%dT%H:%M:%S.%N%z
        tag audit
    </source>

    <filter audit>
        #https://github.com/fluent/fluent-plugin-rewrite-tag-filter/issues/13
        @type record_transformer
        enable_ruby
        <record>
         namespace ${record["objectRef"].nil? ? "none":(record["objectRef"]["namespace"].nil? ? "none":record["objectRef"]["namespace"])}
        </record>
    </filter>

    <match audit>
        # route audit according to namespace element in context
        @type rewrite_tag_filter
        <rule>
            key namespace
            pattern /^(.+)/
            tag ${tag}.$1
        </rule>
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
    EOF
    ```

1. start fluentd

    ```shell
    fluentd -c /etc/fluentd/config  -vv
    ```

1. start kube-apiserver with the following options:

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-log-path=/var/log/kube-audit --audit-log-format=json
    ```

1. check audits for different namespaces in `/var/log/audit-*.log`

### Use logstash to collect and distribute audit events from webhook backend

[Logstash][logstash] is an open source, server-side data processing tool. In this example,
we will use logstash to collect audit events from webhook backend, and save events of
different users into different files.

1. install [logstash][logstash_install_doc]

1. create config file for logstash

    ```
    cat <<EOF > /etc/logstash/config
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
    EOF
    ```

1. start logstash

    ```shell
    bin/logstash -f /etc/logstash/config --path.settings /etc/logstash/
    ```

1. create a [kubeconfig file](/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/) for kube-apiserver webhook audit backend

        cat <<EOF > /etc/kubernetes/audit-webhook-kubeconfig
        apiVersion: v1
        kind: Config
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
        preferences: {}
        users: []
        EOF

1. start kube-apiserver with the following options:

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
    ```

1. check audits in logstash node's directories `/var/log/kube-audit-*/audit`

Note that in addition to file output plugin, logstash has a variety of outputs that
let users route data where they want. For example, users can emit audit events to elasticsearch
plugin which supports full-text search and analytics.

[kube-apiserver]: /docs/admin/kube-apiserver
[auditing-proposal]: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/auditing.md
[auditing-api]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/staging/src/k8s.io/apiserver/pkg/apis/audit/v1/types.go
[gce-audit-profile]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh#L735
[kubeconfig]: /docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[fluentd]: http://www.fluentd.org/
[fluentd_install_doc]: https://docs.fluentd.org/v1.0/articles/quickstart#step-1:-installing-fluentd
[fluentd_plugin_management_doc]: https://docs.fluentd.org/v1.0/articles/plugin-management
[logstash]: https://www.elastic.co/products/logstash
[logstash_install_doc]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
[kube-aggregator]: /docs/concepts/api-extension/apiserver-aggregation

{{% /capture %}}
