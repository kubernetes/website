---
title: kube-apiserver
content_type: tool-reference
weight: 30
auto_generated: true
---


<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->


## {{% heading "synopsis" %}}


The Kubernetes API server validates and configures data
for the api objects which include pods, services, replicationcontrollers, and
others. The API Server services REST operations and provides the frontend to the
cluster's shared state through which all other components interact.

```
kube-apiserver [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--add-dir-header</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, adds the file directory to the header of the log messages</p></td>
</tr>

<tr>
<td colspan="2">--admission-control-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File with admission control configuration.</p></td>
</tr>

<tr>
<td colspan="2">--advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address on which to advertise the apiserver to members of the cluster. This address must be reachable by the rest of the cluster. If blank, the --bind-address will be used. If --bind-address is unspecified, the host's default interface will be used.</p></td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: []</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The map from metric-label to value allow-list of this label. The key's format is <!-- raw HTML omitted -->,<!-- raw HTML omitted -->. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.</p></td>
</tr>

<tr>
<td colspan="2">--allow-privileged</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, allow privileged containers. [default=false]</p></td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>log to standard error as well as files</p></td>
</tr>

<tr>
<td colspan="2">--anonymous-auth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Enables anonymous requests to the secure port of the API server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of system:anonymous, and a group name of system:unauthenticated.</p></td>
</tr>

<tr>
<td colspan="2">--api-audiences strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Identifiers of the API. The service account token authenticator will validate that tokens used against the API are bound to at least one of these audiences. If the --service-account-issuer flag is configured and this flag is not, this field defaults to a single element list containing the issuer URL.</p></td>
</tr>

<tr>
<td colspan="2">--apiserver-count int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The number of apiservers running in the cluster, must be a positive number. (In use when --endpoint-reconciler-type=master-count is enabled.)</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The size of the buffer to store events before batching and writing. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum size of a batch. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-max-wait duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The amount of time to wait before force writing the batch that hadn't reached the max size. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-throttle-burst int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-throttle-enable</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether batching throttling is enabled. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-batch-throttle-qps float</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum average number of batches per second. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-compress</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, the rotated log files will be compressed using gzip.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "json"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Format of saved audits. &quot;legacy&quot; indicates 1-line text format for each event. &quot;json&quot; indicates structured json format. Known formats are legacy,json.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-maxage int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum number of days to retain old audit log files based on the timestamp encoded in their filename.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-maxbackup int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum number of old audit log files to retain.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-maxsize int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum size in megabytes of the audit log file before it gets rotated.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "blocking"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking,blocking-strict.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-path string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, all requests coming to the apiserver will be logged to this file.  '-' means standard out.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-enabled</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether event and batch truncating is enabled.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10485760</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum size of the batch sent to the underlying backend. Actual serialized size can be several hundreds of bytes greater. If a batch exceeds this limit, it is split into several batches of smaller size.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 102400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum size of the audit event sent to the underlying backend. If the size of an event is greater than this number, first request and response are removed, and if this doesn't reduce the size enough, event is discarded.</p></td>
</tr>

<tr>
<td colspan="2">--audit-log-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "audit.k8s.io/v1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>API group and version used for serializing audit events written to log.</p></td>
</tr>

<tr>
<td colspan="2">--audit-policy-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to the file that defines the audit policy configuration.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-buffer-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10000</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The size of the buffer to store events before batching and writing. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-max-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum size of a batch. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-max-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The amount of time to wait before force writing the batch that hadn't reached the max size. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-burst int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum number of requests sent at the same moment if ThrottleQPS was not utilized before. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-enable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether batching throttling is enabled. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-batch-throttle-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum average number of batches per second. Only used in batch mode.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to a kubeconfig formatted file that defines the audit webhook configuration.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-initial-backoff duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The amount of time to wait before retrying the first failed request.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-mode string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "batch"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking,blocking-strict.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-enabled</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Whether event and batch truncating is enabled.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-max-batch-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10485760</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum size of the batch sent to the underlying backend. Actual serialized size can be several hundreds of bytes greater. If a batch exceeds this limit, it is split into several batches of smaller size.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-truncate-max-event-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 102400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum size of the audit event sent to the underlying backend. If the size of an event is greater than this number, first request and response are removed, and if this doesn't reduce the size enough, event is discarded.</p></td>
</tr>

<tr>
<td colspan="2">--audit-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "audit.k8s.io/v1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>API group and version used for serializing audit events written to webhook.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration to cache responses from the webhook token authenticator.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File with webhook configuration for token authentication in kubeconfig format. The API server will query the remote service to determine authentication for bearer tokens.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "v1beta1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The API version of the authentication.k8s.io TokenReview to send to and expect from the webhook.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-mode strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "AlwaysAllow"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Ordered list of plug-ins to do authorization on secure port. Comma-delimited list of: AlwaysAllow,AlwaysDeny,ABAC,Webhook,RBAC,Node.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-policy-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File with authorization policy in json line by line format, used with --authorization-mode=ABAC, on the secure port.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration to cache 'authorized' responses from the webhook authorizer.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration to cache 'unauthorized' responses from the webhook authorizer.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File with webhook configuration in kubeconfig format, used with --authorization-mode=Webhook. The API server will query the remote service to determine access on the API server's secure port.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "v1beta1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The API version of the authorization.k8s.io SubjectAccessReview to send to and expect from the webhook.</p></td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to the file containing Azure container registry configuration information.</p></td>
</tr>

<tr>
<td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces will be used.</p></td>
</tr>

<tr>
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/kubernetes"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.</p></td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.</p></td>
</tr>

<tr>
<td colspan="2">--cloud-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The path to the cloud provider configuration file. Empty string for no configuration file.</p></td>
</tr>

<tr>
<td colspan="2">--cloud-provider string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The provider for cloud services. Empty string for no provider.</p></td>
</tr>

<tr>
<td colspan="2">--cloud-provider-gce-l7lb-src-cidrs cidrs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 130.211.0.0/22,35.191.0.0/16</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>CIDRs opened in GCE firewall for L7 LB traffic proxy &amp; health checks</p></td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Enable lock contention profiling, if profiling is enabled</p></td>
</tr>

<tr>
<td colspan="2">--cors-allowed-origins strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of allowed origins for CORS, comma separated.  An allowed origin can be a regular expression to support subdomain matching. If this list is empty CORS will not be enabled.</p></td>
</tr>

<tr>
<td colspan="2">--default-not-ready-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration.</p></td>
</tr>

<tr>
<td colspan="2">--default-unreachable-toleration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration.</p></td>
</tr>

<tr>
<td colspan="2">--default-watch-cache-size int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Default watch cache size. If zero, watch cache will be disabled for resources that do not have a default watch size set.</p></td>
</tr>

<tr>
<td colspan="2">--delete-collection-workers int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Number of workers spawned for DeleteCollection call. These are used to speed up namespace cleanup.</p></td>
</tr>

<tr>
<td colspan="2">--disable-admission-plugins strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>admission plugins that should be disabled although they are in the default enabled plugins list (NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection, PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, MutatingAdmissionWebhook, ValidatingAdmissionWebhook, ResourceQuota). Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PersistentVolumeLabel, PodNodeSelector, PodSecurityPolicy, PodTolerationRestriction, Priority, ResourceQuota, RuntimeClass, SecurityContextDeny, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.</p></td>
</tr>

<tr>
<td colspan="2">--disabled-metrics strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>This flag provides an escape hatch for misbehaving metrics. You must provide the fully qualified metric name in order to disable it. Disclaimer: disabling metrics is higher in precedence than showing hidden metrics.</p></td>
</tr>

<tr>
<td colspan="2">--egress-selector-config-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File with apiserver egress selector configuration.</p></td>
</tr>

<tr>
<td colspan="2">--enable-admission-plugins strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>admission plugins that should be enabled in addition to default enabled ones (NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection, PersistentVolumeClaimResize, RuntimeClass, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, MutatingAdmissionWebhook, ValidatingAdmissionWebhook, ResourceQuota). Comma-delimited list of admission plugins: AlwaysAdmit, AlwaysDeny, AlwaysPullImages, CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, DenyServiceExternalIPs, EventRateLimit, ExtendedResourceToleration, ImagePolicyWebhook, LimitPodHardAntiAffinityTopology, LimitRanger, MutatingAdmissionWebhook, NamespaceAutoProvision, NamespaceExists, NamespaceLifecycle, NodeRestriction, OwnerReferencesPermissionEnforcement, PersistentVolumeClaimResize, PersistentVolumeLabel, PodNodeSelector, PodSecurityPolicy, PodTolerationRestriction, Priority, ResourceQuota, RuntimeClass, SecurityContextDeny, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionWebhook. The order of plugins in this flag does not matter.</p></td>
</tr>

<tr>
<td colspan="2">--enable-aggregator-routing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Turns on aggregator routing requests to endpoints IP rather than cluster IP.</p></td>
</tr>

<tr>
<td colspan="2">--enable-bootstrap-token-auth</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Enable to allow secrets of type 'bootstrap.kubernetes.io/token' in the 'kube-system' namespace to be used for TLS bootstrapping authentication.</p></td>
</tr>

<tr>
<td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager.</p></td>
</tr>

<tr>
<td colspan="2">--enable-priority-and-fairness&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true and the APIPriorityAndFairness feature gate is enabled, replace the max-in-flight handler with an enhanced one that queues and dispatches with priority and fairness</p></td>
</tr>

<tr>
<td colspan="2">--encryption-provider-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The file containing configuration for encryption providers to be used for storing secrets in etcd</p></td>
</tr>

<tr>
<td colspan="2">--endpoint-reconciler-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "lease"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Use an endpoint reconciler (master-count, lease, none)</p></td>
</tr>

<tr>
<td colspan="2">--etcd-cafile string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>SSL Certificate Authority file used to secure etcd communication.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-certfile string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>SSL certification file used to secure etcd communication.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-compaction-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The interval of compaction requests. If 0, the compaction request from apiserver is disabled.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-count-metric-poll-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Frequency of polling etcd for number of resources per type. 0 disables the metric collection.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-db-metric-poll-interval duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The interval of requests to poll etcd and update metric. 0 disables the metric collection</p></td>
</tr>

<tr>
<td colspan="2">--etcd-healthcheck-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The timeout to use when checking etcd health.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-keyfile string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>SSL key file used to secure etcd communication.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-prefix string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/registry"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The prefix to prepend to all resource paths in etcd.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-servers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of etcd servers to connect with (scheme://ip:port), comma separated.</p></td>
</tr>

<tr>
<td colspan="2">--etcd-servers-overrides strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Per-resource etcd servers overrides, comma separated. The individual override format: group/resource#servers, where servers are URLs, semicolon separated. Note that this applies only to resources compiled into this server binary.</p></td>
</tr>

<tr>
<td colspan="2">--event-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Amount of time to retain events.</p></td>
</tr>

<tr>
<td colspan="2">--experimental-logging-sanitization</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[Experimental] When enabled prevents logging of fields tagged as sensitive (passwords, keys, tokens).<br/>Runtime log sanitization may introduce significant computation overhead and therefore should not be enabled in production.</p></td>
</tr>

<tr>
<td colspan="2">--external-hostname string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The hostname to use when generating externalized URLs for this master (e.g. Swagger API Docs or OpenID Discovery).</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;comma-separated 'key=True|False' pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIPriorityAndFairness=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>APIServerIdentity=true|false (ALPHA - default=false)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AnyVolumeDataSource=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BoundServiceAccountTokenVolume=true|false (BETA - default=true)<br/>CPUManager=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (BETA - default=true)<br/>CSIMigrationAWS=true|false (BETA - default=false)<br/>CSIMigrationAzureDisk=true|false (BETA - default=false)<br/>CSIMigrationAzureFile=true|false (BETA - default=false)<br/>CSIMigrationGCE=true|false (BETA - default=false)<br/>CSIMigrationOpenStack=true|false (BETA - default=true)<br/>CSIMigrationvSphere=true|false (BETA - default=false)<br/>CSIMigrationvSphereComplete=true|false (BETA - default=false)<br/>CSIServiceAccountToken=true|false (BETA - default=true)<br/>CSIStorageCapacity=true|false (BETA - default=true)<br/>CSIVolumeFSGroupPolicy=true|false (BETA - default=true)<br/>CSIVolumeHealth=true|false (ALPHA - default=false)<br/>ConfigurableFSGroupPolicy=true|false (BETA - default=true)<br/>ControllerManagerLeaderMigration=true|false (ALPHA - default=false)<br/>CronJobControllerV2=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>DaemonSetUpdateSurge=true|false (ALPHA - default=false)<br/>DefaultPodTopologySpread=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DisableAcceleratorUsageMetrics=true|false (BETA - default=true)<br/>DownwardAPIHugePages=true|false (BETA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EfficientWatchResumption=true|false (BETA - default=true)<br/>EndpointSliceProxying=true|false (BETA - default=true)<br/>EndpointSliceTerminatingCondition=true|false (ALPHA - default=false)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GenericEphemeralVolume=true|false (BETA - default=true)<br/>GracefulNodeShutdown=true|false (BETA - default=true)<br/>HPAContainerMetrics=true|false (ALPHA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HugePageStorageMediumSize=true|false (BETA - default=true)<br/>IPv6DualStack=true|false (BETA - default=true)<br/>InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>IndexedJob=true|false (ALPHA - default=false)<br/>IngressClassNamespacedParams=true|false (ALPHA - default=false)<br/>KubeletCredentialProviders=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>KubeletPodResourcesGetAllocatable=true|false (ALPHA - default=false)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>LogarithmicScaleDown=true|false (ALPHA - default=false)<br/>MemoryManager=true|false (ALPHA - default=false)<br/>MixedProtocolLBService=true|false (ALPHA - default=false)<br/>NamespaceDefaultLabelName=true|false (BETA - default=true)<br/>NetworkPolicyEndPort=true|false (ALPHA - default=false)<br/>NonPreemptingPriority=true|false (BETA - default=true)<br/>PodAffinityNamespaceSelector=true|false (ALPHA - default=false)<br/>PodDeletionCost=true|false (ALPHA - default=false)<br/>PodOverhead=true|false (BETA - default=true)<br/>PreferNominatedNode=true|false (ALPHA - default=false)<br/>ProbeTerminationGracePeriod=true|false (ALPHA - default=false)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceInternalTrafficPolicy=true|false (ALPHA - default=false)<br/>ServiceLBNodePortControl=true|false (ALPHA - default=false)<br/>ServiceLoadBalancerClass=true|false (ALPHA - default=false)<br/>ServiceTopology=true|false (ALPHA - default=false)<br/>SetHostnameAsFQDN=true|false (BETA - default=true)<br/>SizeMemoryBackedVolumes=true|false (ALPHA - default=false)<br/>StorageVersionAPI=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>SuspendJob=true|false (ALPHA - default=false)<br/>TTLAfterFinished=true|false (BETA - default=true)<br/>TopologyAwareHints=true|false (ALPHA - default=false)<br/>TopologyManager=true|false (BETA - default=true)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>WarningHeaders=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (BETA - default=true)<br/>WindowsEndpointSliceProxying=true|false (BETA - default=true)</p></td>
</tr>

<tr>
<td colspan="2">--goaway-chance float</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>To prevent HTTP/2 clients from getting stuck on a single apiserver, randomly close a connection (GOAWAY). The client's other in-flight requests won't be affected, and the client will reconnect, likely landing on a different apiserver after going through the load balancer again. This argument sets the fraction of requests that will be sent a GOAWAY. Clusters with single apiservers, or which don't use a load balancer, should NOT enable this. Min is 0 (off), Max is .02 (1/50 requests); .001 (1/1000) is a recommended starting point.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for kube-apiserver</p></td>
</tr>

<tr>
<td colspan="2">--http2-max-streams-per-connection int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.</p></td>
</tr>

<tr>
<td colspan="2">--identity-lease-duration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 3600</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration of kube-apiserver lease in seconds, must be a positive number. (In use when the APIServerIdentity feature gate is enabled.)</p></td>
</tr>

<tr>
<td colspan="2">--identity-lease-renew-interval-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The interval of kube-apiserver renewing its lease in seconds, must be a positive number. (In use when the APIServerIdentity feature gate is enabled.)</p></td>
</tr>

<tr>
<td colspan="2">--kubelet-certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to a cert file for the certificate authority.</p></td>
</tr>

<tr>
<td colspan="2">--kubelet-client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to a client cert file for TLS.</p></td>
</tr>

<tr>
<td colspan="2">--kubelet-client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to a client key file for TLS.</p></td>
</tr>

<tr>
<td colspan="2">--kubelet-preferred-address-types strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "Hostname,InternalDNS,InternalIP,ExternalDNS,ExternalIP"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of the preferred NodeAddressTypes to use for kubelet connections.</p></td>
</tr>

<tr>
<td colspan="2">--kubelet-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Timeout for kubelet operations.</p></td>
</tr>

<tr>
<td colspan="2">--kubernetes-service-node-port int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-zero, the Kubernetes master service (which apiserver creates/maintains) will be of type NodePort, using this as the value of the port. If zero, the Kubernetes master service will be of type ClusterIP.</p></td>
</tr>

<tr>
<td colspan="2">--lease-reuse-duration-seconds int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 60</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The time in seconds that each lease is reused. A lower value could avoid large number of objects reusing the same lease. Notice that a too small value may cause performance problems at storage layer.</p></td>
</tr>

<tr>
<td colspan="2">--livez-grace-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>This option represents the maximum amount of time it should take for apiserver to complete its startup sequence and become live. From apiserver's start time to when this amount of time has elapsed, /livez will assume that unfinished post-start hooks will complete successfully and therefore return true.</p></td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum number of seconds between log flushes</p></td>
</tr>

<tr>
<td colspan="2">--log-backtrace-at &lt;a string in the form 'file:N'&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>when logging hits line file:N, emit a stack trace</p></td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-empty, write log files in this directory</p></td>
</tr>

<tr>
<td colspan="2">--log-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-empty, use this log file</p></td>
</tr>

<tr>
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.</p></td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Sets the log format. Permitted formats: &quot;json&quot;, &quot;text&quot;.<br/>Non-default formats don't honor these flags: --add-dir-header, --alsologtostderr, --log-backtrace-at, --log-dir, --log-file, --log-file-max-size, --logtostderr, --one-output, --skip-headers, --skip-log-headers, --stderrthreshold, --vmodule, --log-flush-frequency.<br/>Non-default choices are currently alpha and subject to change without warning.</p></td>
</tr>

<tr>
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>log to standard error instead of files</p></td>
</tr>

<tr>
<td colspan="2">--master-service-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: the namespace from which the Kubernetes master services should be injected into pods.</p></td>
</tr>

<tr>
<td colspan="2">--max-connection-bytes-per-sec int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If non-zero, throttle each user connection to this number of bytes/sec. Currently only applies to long-running requests.</p></td>
</tr>

<tr>
<td colspan="2">--max-mutating-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 200</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum number of mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit.</p></td>
</tr>

<tr>
<td colspan="2">--max-requests-inflight int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 400</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum number of non-mutating requests in flight at a given time. When the server exceeds this, it rejects requests. Zero for no limit.</p></td>
</tr>

<tr>
<td colspan="2">--min-request-timeout int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>An optional field indicating the minimum number of seconds a handler must keep a request open before timing it out. Currently only honored by the watch request handler, which picks a randomized value above this number as the connection timeout, to spread out load.</p></td>
</tr>

<tr>
<td colspan="2">--oidc-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, the OpenID server's certificate will be verified by one of the authorities in the oidc-ca-file, otherwise the host's root CA set will be used.</p></td>
</tr>

<tr>
<td colspan="2">--oidc-client-id string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The client ID for the OpenID Connect client, must be set if oidc-issuer-url is set.</p></td>
</tr>

<tr>
<td colspan="2">--oidc-groups-claim string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If provided, the name of a custom OpenID Connect claim for specifying user groups. The claim value is expected to be a string or array of strings. This flag is experimental, please see the authentication documentation for further details.</p></td>
</tr>

<tr>
<td colspan="2">--oidc-groups-prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If provided, all groups will be prefixed with this value to prevent conflicts with other authentication strategies.</p></td>
</tr>

<tr>
<td colspan="2">--oidc-issuer-url string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The URL of the OpenID issuer, only HTTPS scheme will be accepted. If set, it will be used to verify the OIDC JSON Web Token (JWT).</p></td>
</tr>

<tr>
<td colspan="2">--oidc-required-claim &lt;comma-separated 'key=value' pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A key=value pair that describes a required claim in the ID Token. If set, the claim is verified to be present in the ID Token with a matching value. Repeat this flag to specify multiple claims.</p></td>
</tr>

<tr>
<td colspan="2">--oidc-signing-algs strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "RS256"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Comma-separated list of allowed JOSE asymmetric signing algorithms. JWTs with a 'alg' header value not in this list will be rejected. Values are defined by RFC 7518 https://tools.ietf.org/html/rfc7518#section-3.1.</p></td>
</tr>

<tr>
<td colspan="2">--oidc-username-claim string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "sub"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The OpenID claim to use as the user name. Note that claims other than the default ('sub') is not guaranteed to be unique and immutable. This flag is experimental, please see the authentication documentation for further details.</p></td>
</tr>

<tr>
<td colspan="2">--oidc-username-prefix string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If provided, all usernames will be prefixed with this value. If not provided, username claims other than 'email' are prefixed by the issuer URL to avoid clashes. To skip any prefixing, provide the value '-'.</p></td>
</tr>

<tr>
<td colspan="2">--one_output</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, only write logs to their native severity level (vs also writing to each lower severity level)</p></td>
</tr>

<tr>
<td colspan="2">--permit-address-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, SO_REUSEADDR will be used when binding the port. This allows binding to wildcard IPs like 0.0.0.0 and specific IPs in parallel, and it avoids waiting for the kernel to release sockets in TIME_WAIT state. [default=false]</p></td>
</tr>

<tr>
<td colspan="2">--permit-port-sharing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, SO_REUSEPORT will be used when binding the port, which allows more than one instance to bind on the same address and port. [default=false]</p></td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Enable profiling via web interface host:port/debug/pprof/</p></td>
</tr>

<tr>
<td colspan="2">--proxy-client-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Client certificate used to prove the identity of the aggregator or kube-apiserver when it must call out during a request. This includes proxying requests to a user api-server and calling out to webhook admission plugins. It is expected that this cert includes a signature from the CA in the --requestheader-client-ca-file flag. That CA is published in the 'extension-apiserver-authentication' configmap in the kube-system namespace. Components receiving calls from kube-aggregator should use that CA to perform their half of the mutual TLS verification.</p></td>
</tr>

<tr>
<td colspan="2">--proxy-client-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Private key for the client certificate used to prove the identity of the aggregator or kube-apiserver when it must call out during a request. This includes proxying requests to a user api-server and calling out to webhook admission plugins.</p></td>
</tr>

<tr>
<td colspan="2">--request-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>An optional field indicating the duration a handler must keep a request open before timing it out. This is the default request timeout for requests but may be overridden by flags such as --min-request-timeout for specific types of requests.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-allowed-names strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-extra-headers-prefix strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of request header prefixes to inspect. X-Remote-Extra- is suggested.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of request headers to inspect for groups. X-Remote-Group is suggested.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of request headers to inspect for usernames. X-Remote-User is common.</p></td>
</tr>

<tr>
<td colspan="2">--runtime-config &lt;comma-separated 'key=value' pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A set of key=value pairs that enable or disable built-in APIs. Supported options are:<br/>v1=true|false for the core API group<br/><!-- raw HTML omitted -->/<!-- raw HTML omitted -->=true|false for a specific API group and version (e.g. apps/v1=true)<br/>api/all=true|false controls all API versions<br/>api/ga=true|false controls all API versions of the form v[0-9]+<br/>api/beta=true|false controls all API versions of the form v[0-9]+beta[0-9]+<br/>api/alpha=true|false controls all API versions of the form v[0-9]+alpha[0-9]+<br/>api/legacy is deprecated, and will be removed in a future version</p></td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The port on which to serve HTTPS with authentication and authorization. It cannot be switched off with 0.</p></td>
</tr>

<tr>
<td colspan="2">--service-account-extend-token-expiration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Turns on projected service account expiration extension during token generation, which helps safe transition from legacy token to bound service account token feature. If this flag is enabled, admission injected tokens would be extended up to 1 year to prevent unexpected failure during transition, ignoring value of service-account-max-token-expiration.</p></td>
</tr>

<tr>
<td colspan="2">--service-account-issuer string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Identifier of the service account token issuer. The issuer will assert this identifier in &quot;iss&quot; claim of issued tokens. This value is a string or URI. If this option is not a valid URI per the OpenID Discovery 1.0 spec, the ServiceAccountIssuerDiscovery feature will remain disabled, even if the feature gate is set to true. It is highly recommended that this value comply with the OpenID spec: https://openid.net/specs/openid-connect-discovery-1_0.html. In practice, this means that service-account-issuer must be an https URL. It is also highly recommended that this URL be capable of serving OpenID discovery documents at {service-account-issuer}/.well-known/openid-configuration.</p></td>
</tr>

<tr>
<td colspan="2">--service-account-jwks-uri string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Overrides the URI for the JSON Web Key Set in the discovery doc served at /.well-known/openid-configuration. This flag is useful if the discovery docand key set are served to relying parties from a URL other than the API server's external (as auto-detected or overridden with external-hostname). Only valid if the ServiceAccountIssuerDiscovery feature gate is enabled.</p></td>
</tr>

<tr>
<td colspan="2">--service-account-key-file strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File containing PEM-encoded x509 RSA or ECDSA private or public keys, used to verify ServiceAccount tokens. The specified file can contain multiple keys, and the flag can be specified multiple times with different files. If unspecified, --tls-private-key-file is used. Must be specified when --service-account-signing-key is provided</p></td>
</tr>

<tr>
<td colspan="2">--service-account-lookup&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, validate ServiceAccount tokens exist in etcd as part of authentication.</p></td>
</tr>

<tr>
<td colspan="2">--service-account-max-token-expiration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The maximum validity duration of a token created by the service account token issuer. If an otherwise valid TokenRequest with a validity duration larger than this value is requested, a token will be issued with a validity duration of this value.</p></td>
</tr>

<tr>
<td colspan="2">--service-account-signing-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Path to the file that contains the current private key of the service account token issuer. The issuer will sign issued ID tokens with this private key.</p></td>
</tr>

<tr>
<td colspan="2">--service-cluster-ip-range string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A CIDR notation IP range from which to assign service cluster IPs. This must not overlap with any IP ranges assigned to nodes or pods. Max of two dual-stack CIDRs is allowed.</p></td>
</tr>

<tr>
<td colspan="2">--service-node-port-range &lt;a string in the form 'N1-N2'&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30000-32767</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A port range to reserve for services with NodePort visibility. Example: '30000-32767'. Inclusive at both ends of the range.</p></td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is <!-- raw HTML omitted -->.<!-- raw HTML omitted -->, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that.</p></td>
</tr>

<tr>
<td colspan="2">--shutdown-delay-duration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Time to delay the termination. During that time the server keeps serving requests normally. The endpoints /healthz and /livez will return success, but /readyz immediately returns failure. Graceful termination starts after this delay has elapsed. This can be used to allow load balancer to stop sending traffic to this server.</p></td>
</tr>

<tr>
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, avoid header prefixes in the log messages</p></td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, avoid headers when opening log files</p></td>
</tr>

<tr>
<td colspan="2">--stderrthreshold int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>logs at or above this threshold go to stderr</p></td>
</tr>

<tr>
<td colspan="2">--storage-backend string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The storage backend for persistence. Options: 'etcd3' (default).</p></td>
</tr>

<tr>
<td colspan="2">--storage-media-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The media type to use to store objects in storage. Some resources or storage backends may only support a specific media type and will ignore this setting.</p></td>
</tr>

<tr>
<td colspan="2">--strict-transport-security-directives strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of directives for HSTS, comma separated. If this list is empty, then HSTS directives will not be added. Example: 'max-age=31536000,includeSubDomains,preload'</p></td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.</p></td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>Preferred values: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384.<br/>Insecure values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.</p></td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Minimum TLS version supported. Possible values: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13</p></td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>File containing the default x509 private key matching --tls-cert-file.</p></td>
</tr>

<tr>
<td colspan="2">--tls-sni-cert-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. The domain patterns also allow IP addresses, but IPs should only be used if the apiserver has visibility to the IP address requested by a client. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: &quot;example.crt,example.key&quot; or &quot;foo.crt,foo.key:*.foo.com,foo.com&quot;.</p></td>
</tr>

<tr>
<td colspan="2">--token-auth-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, the file that will be used to secure the secure port of the API server via token authentication.</p></td>
</tr>

<tr>
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>number for the log level verbosity</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Print version information and quit</p></td>
</tr>

<tr>
<td colspan="2">--vmodule &lt;comma-separated 'pattern=N' settings&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>comma-separated list of pattern=N settings for file-filtered logging</p></td>
</tr>

<tr>
<td colspan="2">--watch-cache&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Enable watch caching in the apiserver</p></td>
</tr>

<tr>
<td colspan="2">--watch-cache-sizes strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Watch cache size settings for some resources (pods, nodes, etc.), comma separated. The individual setting format: resource[.group]#size, where resource is lowercase plural (no version), group is omitted for resources of apiVersion v1 (the legacy core API) and included for others, and size is a number. It takes effect when watch-cache is enabled. Some resources (replicationcontrollers, endpoints, nodes, pods, services, apiservices.apiregistration.k8s.io) have system defaults set by heuristics, others default to default-watch-cache-size</p></td>
</tr>

</tbody>
</table>



