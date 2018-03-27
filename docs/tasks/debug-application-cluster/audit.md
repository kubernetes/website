---
reviewers:
- soltysh
- sttts
- ericchiang
title: Auditing
---

* TOC
{:toc}

{% include feature-state-beta.md %}

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

[Kube-apiserver][kube-apiserver] performs auditing. Each request on each stage
of its execution generates an event, which is then pre-processed according to
a certain policy and written to a backend. You can find more details about the
pipeline in the [design proposal][auditing-proposal].

**Note,** that audit logging feature increases apiserver memory consumption, since some context
required for auditing is stored for each request. Additionally, memory consumption depends on the
audit logging configuration.

## Audit Policy

Audit policy defines rules about what events should be recorded and what data
they should include. When an event is processed, it's compared against the list
of rules in order. The first matching rule sets the [audit level][auditing-level]
of the event. The audit policy object structure is defined in the
[`audit.k8s.io` API group][auditing-api].

You can pass a file with the policy to [kube-apiserver][kube-apiserver]
using the `--audit-policy-file` flag. If the flag is omitted, no events are logged.
__Note:__ `kind` and `apiVersion` fields along with `rules` __must__ be provided
in the audit policy file. A policy with no (0) rules, or a policy that doesn't
provide valid `apiVersion` and `kind` values is treated as illegal.

Some example audit policy files:

{% include code.html language="yaml" file="audit-policy.yaml" ghlink="/docs/tasks/debug-application-cluster/audit-policy.yaml" %}

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

## Audit backends

Audit backends implement exporting audit events to an external storage.
[Kube-apiserver][kube-apiserver] out of the box provides two backends:

- Log backend, which writes events to a disk
- Webhook backend, which sends events to an external API

In both cases, audit events structure is defined by the API in the
`audit.k8s.io` API group. The current version of the API is
[`v1beta1`][auditing-api].

**Note:** In case of patches, request body is a JSON array with patch operations, not a JSON object
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

### Batching

Both log and webhook backends support batching. Using webhook as an example, here's the list of
available flags. To get the same flag for log backend, replace `webhook` with `log` in the flag
name. By default, batching is enabled in `webhook` and disabled in `log`. Similarly, by default
throttling is enabled in `webhook` and disabled in `log`.

- `--audit-webhook-mode` defines the buffering strategy. One of the following:
  - `batch` - buffer events and asynchronously process them in batches. This is the default.
  - `blocking` - block API server responses on processing each individual event.

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
you should set throttling level at at least 2 QPS. Assuming that the backend can take up to
5 seconds to write events, you should set the buffer size to hold up to 5 seconds of events, i.e.
10 batches, i.e. 1000 events.

In most cases however, the default parameters should be sufficient and you don't have to worry about
setting them manually. You can look at the following Prometheus metrics exposed by kube-apiserver
and in the logs to monitor the state of the auditing subsystem.

- `apiserver_audit_event_total` metric contains the total number of audit events exported.
- `apiserver_audit_error_total` metric contains the total number of events dropped due to an error
  during exporting.

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

1. install [fluentd, fluent-plugin-forest and fluent-plugin-rewrite-tag-filter][fluentd_install_doc] in the kube-apiserver node
1. create a config file for fluentd

   ```shell
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
   ```

1. start fluentd

   ```shell
   $ fluentd -c /etc/fluentd/config  -vv
   ```

1. start kube-apiserver with the following options:

   ```shell
   --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-log-path=/var/log/kube-audit --audit-log-format=json
   ```

1. check audits for different namespaces in /var/log/audit-*.log

### Use logstash to collect and distribute audit events from webhook backend

[Logstash][logstash] is an open source, server-side data processing tool. In this example,
we will use logstash to collect audit events from webhook backend, and save events of
different users into different files.

1. install [logstash][logstash_install_doc]
1. create config file for logstash

   ```shell
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
   ```

1. start logstash

   ```shell
   $ bin/logstash -f /etc/logstash/config --path.settings /etc/logstash/
   ```

1. create a [kubeconfig file](/docs/tasks/access-application-cluster/authenticate-across-clusters-kubeconfig/) for kube-apiserver webhook audit backend

   ```shell
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
   ```

1. start kube-apiserver with the following options:

   ```shell
   --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
   ```

1. check audits in logstash node's directories /var/log/kube-audit-*/audit

Note that in addition to file output plugin, logstash has a variety of outputs that
let users route data where they want. For example, users can emit audit events to elasticsearch
plugin which supports full-text search and analytics.

## Legacy Audit

__Note:__ Legacy Audit is deprecated and is disabled by default since Kubernetes 1.8. Legacy Audit
will be removed in 1.12. To fallback to this legacy audit, disable the advanced auditing feature
using the `AdvancedAuditing` feature gate in [kube-apiserver][kube-apiserver]:

```
--feature-gates=AdvancedAuditing=false
```

In legacy format, each audit log entry contains two lines:

1. The request line containing a unique ID to match the response and request metadata, such as the source IP, requesting user, impersonation information, resource being requested, etc.
2. The response line containing a unique ID matching the request line and the response code.

Example output for `admin` user listing pods in the `default` namespace:

```
2017-03-21T03:57:09.106841886-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" ip="127.0.0.1" method="GET" user="admin" groups="\"system:masters\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="default" uri="/api/v1/namespaces/default/pods"
2017-03-21T03:57:09.108403639-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" response="200"
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

[kube-apiserver]: /docs/admin/kube-apiserver
[auditing-proposal]: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/auditing.md
[auditing-level]: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/auditing.md#levels
[auditing-api]: https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/staging/src/k8s.io/apiserver/pkg/apis/audit/v1beta1/types.go
[gce-audit-profile]: https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/cluster/gce/gci/configure-helper.sh#L735
[kubeconfig]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[fluentd]: http://www.fluentd.org/
[fluentd_install_doc]: http://docs.fluentd.org/v0.12/articles/quickstart#step1-installing-fluentd
[logstash]: https://www.elastic.co/products/logstash
[logstash_install_doc]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
[kube-aggregator]: /docs/concepts/api-extension/apiserver-aggregation
