---
title: kube-scheduler
content_type: tool-reference
weight: 30
auto_generated: true
---


<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->


## {{% heading "synopsis" %}}


The Kubernetes scheduler is a control plane process which assigns
Pods to Nodes. The scheduler determines which Nodes are valid placements for
each Pod in the scheduling queue according to constraints and available
resources. The scheduler then ranks each valid Node and binds the Pod to a
suitable Node. Multiple different schedulers may be used within a cluster;
kube-scheduler is the reference implementation.
See [scheduling](https://kubernetes.io/docs/concepts/scheduling-eviction/)
for more information about scheduling and the kube-scheduler component.

```
kube-scheduler [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: []</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The map from metric-label to value allow-list of this label. The key's format is &lt;MetricName&gt;,&lt;LabelName&gt;. The value's format is &lt;allowed_value&gt;,&lt;allowed_value&gt;...e.g. metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.</p></td>
</tr>

<tr>
<td colspan="2">--allow-metric-labels-manifest string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The path to the manifest file that contains the allow-list mapping. The format of the file is the same as the flag --allow-metric-labels. Note that the flag --allow-metric-labels will override the manifest file.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeconfig file pointing at the 'core' kubernetes server with enough rights to create tokenreviews.authentication.k8s.io. This is optional. If empty, all token requests are considered to be anonymous and no client CA is looked up in the cluster.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-skip-lookup</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If false, the authentication-kubeconfig will be used to lookup missing authentication configuration from the cluster.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration to cache responses from the webhook token authenticator.</p></td>
</tr>

<tr>
<td colspan="2">--authentication-tolerate-lookup-failure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-always-allow-paths strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/healthz,/readyz,/livez"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeconfig file pointing at the 'core' kubernetes server with enough rights to create subjectaccessreviews.authorization.k8s.io. This is optional. If empty, all requests not skipped by authorization are forbidden.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration to cache 'authorized' responses from the webhook authorizer.</p></td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration to cache 'unauthorized' responses from the webhook authorizer.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces and IP address families will be used.</p></td>
</tr>

<tr>
<td colspan="2">--cert-dir string</td>
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
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The path to the configuration file.</p></td>
</tr>

<tr>
<td colspan="2">--contention-profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: enable block profiling, if profiling is enabled. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--disabled-metrics strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>This flag provides an escape hatch for misbehaving metrics. You must provide the fully qualified metric name in order to disable it. Disclaimer: disabling metrics is higher in precedence than showing hidden metrics.</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates &lt;comma-separated 'key=True|False' pairs&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIResponseCompression=true|false (BETA - default=true)<br/>APIServerIdentity=true|false (BETA - default=true)<br/>APIServerTracing=true|false (BETA - default=true)<br/>AdmissionWebhookMatchConditions=true|false (BETA - default=true)<br/>AggregatedDiscoveryEndpoint=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AnyVolumeDataSource=true|false (BETA - default=true)<br/>AppArmor=true|false (BETA - default=true)<br/>CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>CRDValidationRatcheting=true|false (ALPHA - default=false)<br/>CSIMigrationPortworx=true|false (BETA - default=false)<br/>CSIVolumeHealth=true|false (ALPHA - default=false)<br/>CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>CloudDualStackNodeIPs=true|false (BETA - default=true)<br/>ClusterTrustBundle=true|false (ALPHA - default=false)<br/>ClusterTrustBundleProjection=true|false (ALPHA - default=false)<br/>ComponentSLIs=true|false (BETA - default=true)<br/>ConsistentListFromCache=true|false (ALPHA - default=false)<br/>ContainerCheckpoint=true|false (ALPHA - default=false)<br/>ContextualLogging=true|false (ALPHA - default=false)<br/>CronJobsScheduledAnnotation=true|false (BETA - default=true)<br/>CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>DevicePluginCDIDevices=true|false (BETA - default=true)<br/>DisableCloudProviders=true|false (BETA - default=true)<br/>DisableKubeletCloudCredentialProviders=true|false (BETA - default=true)<br/>DisableNodeKubeProxyVersion=true|false (ALPHA - default=false)<br/>DynamicResourceAllocation=true|false (ALPHA - default=false)<br/>ElasticIndexedJob=true|false (BETA - default=true)<br/>EventedPLEG=true|false (BETA - default=false)<br/>GracefulNodeShutdown=true|false (BETA - default=true)<br/>GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>HPAContainerMetrics=true|false (BETA - default=true)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HonorPVReclaimPolicy=true|false (ALPHA - default=false)<br/>ImageMaximumGCAge=true|false (ALPHA - default=false)<br/>InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>InTreePluginAWSUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureDiskUnregister=true|false (ALPHA - default=false)<br/>InTreePluginAzureFileUnregister=true|false (ALPHA - default=false)<br/>InTreePluginGCEUnregister=true|false (ALPHA - default=false)<br/>InTreePluginOpenStackUnregister=true|false (ALPHA - default=false)<br/>InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>InTreePluginvSphereUnregister=true|false (ALPHA - default=false)<br/>JobBackoffLimitPerIndex=true|false (BETA - default=true)<br/>JobPodFailurePolicy=true|false (BETA - default=true)<br/>JobPodReplacementPolicy=true|false (BETA - default=true)<br/>KubeProxyDrainingTerminatingNodes=true|false (ALPHA - default=false)<br/>KubeletCgroupDriverFromCRI=true|false (ALPHA - default=false)<br/>KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>KubeletSeparateDiskGC=true|false (ALPHA - default=false)<br/>KubeletTracing=true|false (BETA - default=true)<br/>LegacyServiceAccountTokenCleanUp=true|false (BETA - default=true)<br/>LoadBalancerIPMode=true|false (ALPHA - default=false)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>LogarithmicScaleDown=true|false (BETA - default=true)<br/>LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>LoggingBetaOptions=true|false (BETA - default=true)<br/>MatchLabelKeysInPodAffinity=true|false (ALPHA - default=false)<br/>MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>MemoryManager=true|false (BETA - default=true)<br/>MemoryQoS=true|false (ALPHA - default=false)<br/>MinDomainsInPodTopologySpread=true|false (BETA - default=true)<br/>MultiCIDRServiceAllocator=true|false (ALPHA - default=false)<br/>NFTablesProxyMode=true|false (ALPHA - default=false)<br/>NewVolumeManagerReconstruction=true|false (BETA - default=true)<br/>NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>NodeLogQuery=true|false (ALPHA - default=false)<br/>NodeSwap=true|false (BETA - default=false)<br/>OpenAPIEnums=true|false (BETA - default=true)<br/>PDBUnhealthyPodEvictionPolicy=true|false (BETA - default=true)<br/>PersistentVolumeLastPhaseTransitionTime=true|false (BETA - default=true)<br/>PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>PodDeletionCost=true|false (BETA - default=true)<br/>PodDisruptionConditions=true|false (BETA - default=true)<br/>PodHostIPs=true|false (BETA - default=true)<br/>PodIndexLabel=true|false (BETA - default=true)<br/>PodLifecycleSleepAction=true|false (ALPHA - default=false)<br/>PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>PodSchedulingReadiness=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RecoverVolumeExpansionFailure=true|false (ALPHA - default=false)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>SchedulerQueueingHints=true|false (BETA - default=false)<br/>SecurityContextDeny=true|false (ALPHA - default=false)<br/>SeparateTaintEvictionController=true|false (BETA - default=true)<br/>ServiceAccountTokenJTI=true|false (ALPHA - default=false)<br/>ServiceAccountTokenNodeBinding=true|false (ALPHA - default=false)<br/>ServiceAccountTokenNodeBindingValidation=true|false (ALPHA - default=false)<br/>ServiceAccountTokenPodNodeInfo=true|false (ALPHA - default=false)<br/>SidecarContainers=true|false (BETA - default=true)<br/>SizeMemoryBackedVolumes=true|false (BETA - default=true)<br/>StableLoadBalancerNodeSet=true|false (BETA - default=true)<br/>StatefulSetAutoDeletePVC=true|false (BETA - default=true)<br/>StatefulSetStartOrdinal=true|false (BETA - default=true)<br/>StorageVersionAPI=true|false (ALPHA - default=false)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>StructuredAuthenticationConfiguration=true|false (ALPHA - default=false)<br/>StructuredAuthorizationConfiguration=true|false (ALPHA - default=false)<br/>TopologyAwareHints=true|false (BETA - default=true)<br/>TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>TopologyManagerPolicyOptions=true|false (BETA - default=true)<br/>TranslateStreamCloseWebsocketRequests=true|false (ALPHA - default=false)<br/>UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>UserNamespacesSupport=true|false (ALPHA - default=false)<br/>ValidatingAdmissionPolicy=true|false (BETA - default=false)<br/>VolumeAttributesClass=true|false (ALPHA - default=false)<br/>VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>WatchList=true|false (ALPHA - default=false)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (BETA - default=true)<br/>WindowsHostNetwork=true|false (ALPHA - default=true)<br/>ZeroLimitedNominalConcurrencyShares=true|false (BETA - default=false)</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>help for kube-scheduler</p></td>
</tr>

<tr>
<td colspan="2">--http2-max-streams-per-connection int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: burst to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: content type of requests sent to apiserver. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 50</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: QPS to use while talking with kubernetes apiserver. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: path to kubeconfig file with authorization and master location information. This parameter is ignored if a config file is specified in --config.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than the lease duration. This is only applicable if leader election is enabled.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "leases"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The type of resource object that is used for locking during leader election. Supported options are 'leases', 'endpointsleases' and 'configmapsleases'.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-scheduler"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The name of resource object that is used for locking during leader election.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The namespace of resource object that is used for locking during leader election.</p></td>
</tr>

<tr>
<td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.</p></td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Maximum number of seconds between log flushes</p></td>
</tr>

<tr>
<td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Sets the log format. Permitted formats: &quot;text&quot;.</p></td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The address of the Kubernetes API server (overrides any value in kubeconfig)</p></td>
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
<td colspan="2">--pod-max-in-unschedulable-pods-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: the maximum time a pod can stay in unschedulablePods. If a pod stays in unschedulablePods for longer than this value, the pod will be moved from unschedulablePods to backoffQ or activeQ. This flag is deprecated and will be removed in 1.26</p></td>
</tr>

<tr>
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: enable profiling via web interface host:port/debug/pprof/. This parameter is ignored if a config file is specified in --config.</p></td>
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
<td colspan="2">--requestheader-extra-headers-prefix strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "x-remote-extra-"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of request header prefixes to inspect. X-Remote-Extra- is suggested.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-group-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "x-remote-group"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of request headers to inspect for groups. X-Remote-Group is suggested.</p></td>
</tr>

<tr>
<td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "x-remote-user"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>List of request headers to inspect for usernames. X-Remote-User is common.</p></td>
</tr>

<tr>
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10259</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.</p></td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is &lt;major&gt;.&lt;minor&gt;, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that.</p></td>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.<br/>Preferred values: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384.<br/>Insecure values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_RC4_128_SHA.</p></td>
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
<td colspan="2">-v, --v int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>number for the log level verbosity</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>--version, --version=raw prints version information and quits; --version=vX.Y.Z... sets the reported version</p></td>
</tr>

<tr>
<td colspan="2">--vmodule pattern=N,...</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>comma-separated list of pattern=N settings for file-filtered logging (only works for text log format)</p></td>
</tr>

<tr>
<td colspan="2">--write-config-to string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>If set, write the configuration values to this file and exit.</p></td>
</tr>

</tbody>
</table>



