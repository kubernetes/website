---
title: kubelet
notitle: true
---
## kubelet



### Synopsis


The kubelet is the primary "node agent" that runs on each
node. The kubelet works in terms of a PodSpec. A PodSpec is a YAML or JSON object
that describes a pod. The kubelet takes a set of PodSpecs that are provided through
various mechanisms (primarily through the apiserver) and ensures that the containers
described in those PodSpecs are running and healthy. The kubelet doesn't manage
containers which were not created by Kubernetes.

Other than from a PodSpec from the apiserver, there are three ways that a container
manifest can be provided to the Kubelet.

File: Path passed as a flag on the command line. Files under this path will be monitored
periodically for updates. The monitoring period is 20s by default and is configurable
via a flag.

HTTP endpoint: HTTP endpoint passed as a parameter on the command line. This endpoint
is checked every 20 seconds (also configurable with a flag).

HTTP server: The kubelet can also listen for HTTP and respond to a simple API
(underspec'd currently) to submit a new manifest.

#### Pod Lifecycle Event Generator (PLEG)

The Pod Lifecycle Event Generator is a function of the kubelet that creates a list of
the states for all containers and pods then compares it to the previous states of the
containers and pods in a process called Relisting. This allows the PLEG to know which
pods and containers need to be synced. In versions prior to 1.2, this was accomplished
by polling and was CPU intensive. By changing to this method, this significantly reduced
resource utilization allowing for better container density.


```
kubelet [flags]
```

### Options

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--address 0.0.0.0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address for the Kubelet to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces) (default 0.0.0.0)</td>
    </tr>

    <tr>
      <td colspan="2">--allow-privileged</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, allow containers to request privileged mode.</td>
    </tr>

    <tr>
      <td colspan="2">--alsologtostderr</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error as well as files</td>
    </tr>

    <tr>
      <td colspan="2">--anonymous-auth</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enables anonymous requests to the Kubelet server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of system:anonymous, and a group name of system:unauthenticated. (default true)</td>
    </tr>

    <tr>
      <td colspan="2">--application-metrics-count-limit int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Max number of application metrics to store (per container) (default 100)</td>
    </tr>

    <tr>
      <td colspan="2">--authentication-token-webhook</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Use the TokenReview API to determine authentication for bearer tokens.</td>
    </tr>

    <tr>
      <td colspan="2">--authentication-token-webhook-cache-ttl duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache responses from the webhook token authenticator. (default 2m0s)</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-mode string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Authorization mode for Kubelet server. Valid options are AlwaysAllow or Webhook. Webhook mode uses the SubjectAccessReview API to determine authorization. (default "AlwaysAllow")</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-webhook-cache-authorized-ttl duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'authorized' responses from the webhook authorizer. (default 5m0s)</td>
    </tr>

    <tr>
      <td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'unauthorized' responses from the webhook authorizer. (default 30s)</td>
    </tr>


     <tr>
       <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file container Azure container registry configuration information.</td>
    </tr>


     <tr>
       <td colspan="2">--boot-id-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of files to check for boot-id. Use the first one that exists. (default "/proc/sys/kernel/random/boot_id")</td>
    </tr>

     <tr>
       <td colspan="2">--bootstrap-checkpoint-path string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> Path to the directory where the checkpoints are stored</td>
    </tr>

     <tr>
       <td colspan="2">--bootstrap-kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeconfig file that will be used to get client certificate for kubelet. If the file specified by --kubeconfig does not exist, the bootstrap kubeconfig is used to request a client certificate from the API server. On success, a kubeconfig file referencing the generated client certificate and key is written to the path specified by --kubeconfig. The client certificate and key file will be stored in the directory pointed by --cert-dir.</td>
    </tr>

     <tr>
       <td colspan="2">--cert-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored. (default "/var/lib/kubelet/pki")</td>
    </tr>

     <tr>
       <td colspan="2">--cgroup-driver string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Driver that the kubelet uses to manipulate cgroups on the host.</td>
    </tr>

     <tr>
       <td colspan="2">--cgroup-root string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Optional root cgroup to use for pods. This is handled by the container runtime on a best effort basis. Default: '', which means use the container runtime default.</td>
    </tr>

     <tr>
       <td colspan="2">--cgroups-per-qos</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable creation of QoS cgroup hierarchy, if true top level QoS and pod cgroups are created. (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--chaos-chance float</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If > 0.0, introduce random client errors and latency. Intended for testing.</td>
    </tr>

     <tr>
       <td colspan="2">--client-ca-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.</td>
    </tr>

     <tr>
       <td colspan="2">--cloud-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the cloud provider configuration file.</td>
    </tr>

     <tr>
       <td colspan="2">--cloud-provider string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The provider for cloud services. Specify empty string for running with no cloud provider.</td>
    </tr>

     <tr>
       <td colspan="2">--cloud-provider-gce-lb-src-cidrs cidrs</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">CIDRs opened in GCE firewall for LB traffic proxy & health checks (default 130.211.0.0/22,35.191.0.0/16,209.85.152.0/22,209.85.204.0/22)</td>
    </tr>

     <tr>
       <td colspan="2">--cluster-dns stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of DNS server IP address.</td>
    </tr>

     <tr>
       <td colspan="2">--cluster-domain string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Domain for this cluster.</td>
    </tr>

     <tr>
       <td colspan="2">--cni-bin-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> The full path of the directory in which to search for CNI plugin binaries. Default: /opt/cni/bin</td>
    </tr>

     <tr>
       <td colspan="2">--cni-conf-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> The full path of the directory in which to search for CNI config files. Default: /etc/cni/net.d</td>
    </tr>

     <tr>
       <td colspan="2">--container-hints string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">location of the container hints file (default "/etc/cadvisor/container_hints.json")</td>
    </tr>

     <tr>
       <td colspan="2">--container-runtime string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The container runtime to use. Possible values: 'docker', 'remote', 'rkt(deprecated)'. (default "docker")</td>
    </tr>

     <tr>
       <td colspan="2">--container-runtime-endpoint string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[Experimental] The endpoint of remote runtime service. Currently unix socket is supported on Linux, and tcp is supported on windows.</td>
    </tr>

     <tr>
       <td colspan="2">--containerd string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">containerd endpoint (default "unix:///var/run/containerd.sock")</td>
    </tr>

     <tr>
       <td colspan="2">--containerized</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Experimental support for running kubelet in a container.</td>
    </tr>

     <tr>
       <td colspan="2">--contention-profiling</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable lock contention profiling, if profiling is enabled</td>
    </tr>

     <tr>
       <td colspan="2">--cpu-cfs-quota</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable CPU CFS quota enforcement for containers that specify CPU limits (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--cpu-manager-policy string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> CPU Manager policy to use. Possible values: 'none', 'static'. (default "none")</td>
    </tr>

     <tr>
       <td colspan="2">--cpu-manager-reconcile-period NodeStatusUpdateFrequency</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> CPU Manager reconciliation period. Examples: '10s', or '1m'. If not supplied, defaults to NodeStatusUpdateFrequency (default 10s)</td>
    </tr>

     <tr>
       <td colspan="2">--docker string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">docker endpoint (default "unix:///var/run/docker.sock")</td>
    </tr>

     <tr>
       <td colspan="2">--docker-disable-shared-pid</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The Container Runtime Interface (CRI) defaults to using a shared PID namespace for containers in a pod when running with Docker 1.13.1 or higher. Setting this flag reverts to the previous behavior of isolated PID namespaces. This ability will be removed in a future Kubernetes release. (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--docker-endpoint string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Use this for the docker endpoint to communicate with (default "unix:///var/run/docker.sock")</td>
    </tr>

     <tr>
       <td colspan="2">--docker-env-metadata-whitelist string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">a comma-separated list of environment variable keys that needs to be collected for docker containers</td>
    </tr>

     <tr>
       <td colspan="2">--docker-only</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Only report docker containers in addition to root stats</td>
    </tr>

     <tr>
       <td colspan="2">--docker-root string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: docker root is read from docker info (this is a fallback, default: /var/lib/docker) (default "/var/lib/docker")</td>
    </tr>

     <tr>
       <td colspan="2">--docker-tls</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">use TLS to connect to docker</td>
    </tr>

     <tr>
       <td colspan="2">--docker-tls-ca string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">path to trusted CA (default "ca.pem")</td>
    </tr>

     <tr>
       <td colspan="2">--docker-tls-cert string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">path to client certificate (default "cert.pem")</td>
    </tr>

     <tr>
       <td colspan="2">--docker-tls-key string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">path to private key (default "key.pem")</td>
    </tr>

     <tr>
       <td colspan="2">--dynamic-config-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The Kubelet will use this directory for checkpointing downloaded configurations and tracking configuration health. The Kubelet will create this directory if it does not already exist. The path may be absolute or relative; relative paths start at the Kubelet's current working directory. Providing this flag enables dynamic Kubelet configuration. Presently, you must also enable the DynamicKubeletConfig feature gate to pass this flag.</td>
    </tr>

     <tr>
       <td colspan="2">--enable-controller-attach-detach</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enables the Attach/Detach controller to manage attachment/detachment of volumes scheduled to this node, and disables kubelet from executing any attach/detach operations (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--enable-debugging-handlers</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enables server endpoints for log collection and local running of containers and commands (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--enable-load-reader</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Whether to enable cpu load reader</td>
    </tr>

     <tr>
       <td colspan="2">--enable-server</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Enable the Kubelet's server (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--enforce-node-allocatable stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A comma separated list of levels of node allocatable enforcement to be enforced by kubelet. Acceptable options are 'pods', 'system-reserved' & 'kube-reserved'. If the latter two options are specified, '--system-reserved-cgroup' & '--kube-reserved-cgroup' must also be set respectively. See /docs/tasks/administer-cluster/reserve-compute-resources/ for more details. (default [pods])</td>
    </tr>

     <tr>
       <td colspan="2">--event-burst int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum size of a bursty event records, temporarily allows event records to burst to this number, while still not exceeding event-qps. Only used if --event-qps > 0 (default 10)</td>
    </tr>

     <tr>
       <td colspan="2">--event-qps int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If > 0, limit event creations per second to this value. If 0, unlimited. (default 5)</td>
    </tr>

     <tr>
       <td colspan="2">--event-storage-age-limit string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Max length of time for which to store events (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or "default" and the value is a duration. Default is applied to all non-specified event types (default "default=0")</td>
    </tr>

     <tr>
       <td colspan="2">--event-storage-event-limit string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Max number of events to store (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or "default" and the value is an integer. Default is applied to all non-specified event types (default "default=0")</td>
    </tr>

     <tr>
       <td colspan="2">--eviction-hard mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of eviction thresholds (e.g. memory.available<1Gi) that if met would trigger a pod eviction. (default imagefs.available<15%,memory.available<100Mi,nodefs.available<10%,nodefs.inodesFree<5%)</td>
    </tr>

     <tr>
       <td colspan="2">--eviction-max-pod-grace-period int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum allowed grace period (in seconds) to use when terminating pods in response to a soft eviction threshold being met.</td>
    </tr>

     <tr>
       <td colspan="2">--eviction-minimum-reclaim mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of minimum reclaims (e.g. imagefs.available=2Gi) that describes the minimum amount of resource the kubelet will reclaim when performing a pod eviction if that resource is under pressure.</td>
    </tr>

     <tr>
       <td colspan="2">--eviction-pressure-transition-period duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Duration for which the kubelet has to wait before transitioning out of an eviction pressure condition. (default 5m0s)</td>
    </tr>

     <tr>
       <td colspan="2">--eviction-soft mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of eviction thresholds (e.g. memory.available<1.5Gi) that if met over a corresponding grace period would trigger a pod eviction.</td>
    </tr>

     <tr>
       <td colspan="2">--eviction-soft-grace-period mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of eviction grace periods (e.g. memory.available=1m30s) that correspond to how long a soft eviction threshold must hold before triggering a pod eviction.</td>
    </tr>

     <tr>
       <td colspan="2">--exit-on-lock-contention</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Whether kubelet should exit upon lock-file contention.</td>
    </tr>

     <tr>
       <td colspan="2">--experimental-allocatable-ignore-eviction</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">When set to 'true', Hard Eviction Thresholds will be ignored while calculating Node Allocatable. See /docs/tasks/administer-cluster/reserve-compute-resources/ for more details. [default=false]</td>
    </tr>

     <tr>
       <td colspan="2">--experimental-allowed-unsafe-sysctls stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated whitelist of unsafe sysctls or unsafe sysctl patterns (ending in *). Use these at your own risk.</td>
    </tr>

     <tr>
       <td colspan="2">--experimental-bootstrap-kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">deprecated: use --bootstrap-kubeconfig</td>
    </tr>

     <tr>
       <td colspan="2">--experimental-check-node-capabilities-before-mount</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[Experimental] if set true, the kubelet will check the underlying node for required components (binaries, etc.) before performing the mount</td>
    </tr>

     <tr>
       <td colspan="2">--experimental-kernel-memcg-notification</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If enabled, the kubelet will integrate with the kernel memcg notification to determine if memory eviction thresholds are crossed rather than polling.</td>
    </tr>

     <tr>
       <td colspan="2">--experimental-mounter-path string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[Experimental] Path of mounter binary. Leave empty to use the default mount.</td>
    </tr>

     <tr>
       <td colspan="2">--experimental-qos-reserved mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of ResourceName=Percentage (e.g. memory=50%) pairs that describe how pod resource requests are reserved at the QoS level. Currently only memory is supported. [default=none]</td>
    </tr>

     <tr>
       <td colspan="2">--fail-swap-on</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Makes the Kubelet fail to start if swap is enabled on the node.</td>
    </tr>

     <tr>
       <td colspan="2">--feature-gates mapStringBool</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (ALPHA - default=false)<br/>Accelerators=true|false<br/>AdvancedAuditing=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllowExtTrafficLocalEndpoints=true|false<br/>AppArmor=true|false (BETA - default=true)<br/>BlockVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CSIPersistentVolume=true|false (ALPHA - default=false)<br/>CustomPodDNS=true|false (ALPHA - default=false)<br/>CustomResourceValidation=true|false (BETA - default=true)<br/>DebugContainers=true|false <br/>DevicePlugins=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (ALPHA - default=false)<br/>EnableEquivalenceClassCache=true|false (ALPHA - default=false)<br/>ExpandPersistentVolumes=true|false (ALPHA - default=false)<br/>ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>HugePages=true|false (ALPHA - default=false)<br/>KubeletConfigFile=true|false (ALPHA - default=false)<br/>LocalStorageCapacityIsolation=true|false (ALPHA - default=false)<br/>MountContainers=true|false (ALPHA - default=false)<br/>MountPropagation=true|false (ALPHA - default=false)<br/>PVCProtection=true|false (ALPHA - default=false)<br/>PersistentLocalVolumes=true|false (ALPHA - default=false)<br/>PodPriority=true|false (ALPHA - default=false)<br/>ReadOnlyAPIDataVolumes=true|false<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (ALPHA - default=false)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>ServiceProxyAllowExternalIPs=true|false<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportIPVSProxyMode=true|false (ALPHA - default=false)<br/>TaintBasedEvictions=true|false (BETA - default=true)<br/>TaintNodesByCondition=true|false (BETA - default=true)<br/>VolumeScheduling=true|false (ALPHA - default=false)<br/>VolumeSubpath=true|false<br/>
      </td>
    </tr>

     <tr>
       <td colspan="2">--file-check-frequency duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Duration between checking config files for new data (default 20s)</td>
    </tr>

     <tr>
       <td colspan="2">--global-housekeeping-interval duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Interval between global housekeepings (default 1m0s)</td>
    </tr>

     <tr>
       <td colspan="2">--google-json-key string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The Google Cloud Platform Service Account JSON Key to use for authentication.</td>
    </tr>

     <tr>
       <td colspan="2">--hairpin-mode string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">How should the kubelet setup hairpin NAT. This allows endpoints of a Service to loadbalance back to themselves if they should try to access their own Service. Valid values are "promiscuous-bridge", "hairpin-veth" and "none". (default "promiscuous-bridge")</td>
    </tr>

     <tr>
       <td colspan="2">--healthz-bind-address 0.0.0.0</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address for the healthz server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces) (default 127.0.0.1)</td>
    </tr>

     <tr>
       <td colspan="2">--healthz-port int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port of the localhost healthz endpoint (set to 0 to disable) (default 10248)</td>
    </tr>

     <tr>
       <td colspan="2">--host-ipc-sources stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of sources from which the Kubelet allows pods to use the host ipc namespace. (default [*])</td>
    </tr>

     <tr>
       <td colspan="2">--host-network-sources stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of sources from which the Kubelet allows pods to use of host network. (default [*])</td>
    </tr>

     <tr>
       <td colspan="2">--host-pid-sources stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of sources from which the Kubelet allows pods to use the host pid namespace. (default [*])</td>
    </tr>

     <tr>
       <td colspan="2">--hostname-override string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, will use this string as identification instead of the actual hostname.</td>
    </tr>

     <tr>
       <td colspan="2">--housekeeping-interval duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Interval between container housekeepings (default 10s)</td>
    </tr>

     <tr>
       <td colspan="2">--http-check-frequency duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Duration between checking http for new data (default 20s)</td>
    </tr>

     <tr>
       <td colspan="2">--image-gc-high-threshold int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The percent of disk usage after which image garbage collection is always run. (default 85)</td>
    </tr>

     <tr>
       <td colspan="2">--image-gc-low-threshold int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. (default 80)</td>
    </tr>

     <tr>
       <td colspan="2">--image-pull-progress-deadline duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If no pulling progress is made before this deadline, the image pulling will be cancelled. (default 1m0s)</td>
    </tr>

     <tr>
       <td colspan="2">--image-service-endpoint string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[Experimental] The endpoint of remote image service. If not specified, it will be the same with container-runtime-endpoint by default. Currently unix socket is supported on Linux, and tcp is supported on windows.</td>
    </tr>

     <tr>
       <td colspan="2">--init-config-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The Kubelet will look in this directory for the init configuration. The path may be absolute or relative; relative paths start at the Kubelet's current working directory. Omit this argument to use the built-in default configuration values. Presently, you must also enable the KubeletConfigFile feature gate to pass this flag.</td>
    </tr>

     <tr>
       <td colspan="2">--iptables-drop-bit int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The bit of the fwmark space to mark packets for dropping. Must be within the range [0, 31]. (default 15)</td>
    </tr>

     <tr>
       <td colspan="2">--iptables-masquerade-bit int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The bit of the fwmark space to mark packets for SNAT. Must be within the range [0, 31]. Please match this parameter with corresponding parameter in kube-proxy. (default 14)</td>
    </tr>

     <tr>
       <td colspan="2">--kube-api-burst int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Burst to use while talking with kubernetes apiserver (default 10)</td>
    </tr>

     <tr>
       <td colspan="2">--kube-api-content-type string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Content type of requests sent to apiserver. (default "application/vnd.kubernetes.protobuf")</td>
    </tr>

     <tr>
       <td colspan="2">--kube-api-qps int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">QPS to use while talking with kubernetes apiserver (default 5)</td>
    </tr>

     <tr>
       <td colspan="2">--kube-reserved mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of ResourceName=ResourceQuantity (e.g. cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid=1000) pairs that describe resources reserved for kubernetes system components. Currently cpu, memory, pid, and local ephemeral storage for root file system are supported. See http://kubernetes.io/docs/user-guide/compute-resources for more detail. [default=none]</td>
    </tr>

     <tr>
       <td colspan="2">--kube-reserved-cgroup string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Absolute name of the top level cgroup that is used to manage kubernetes components for which compute resources were reserved via '--kube-reserved' flag. Ex. '/kube-reserved'. [default='']</td>
    </tr>

     <tr>
       <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeconfig file, specifying how to connect to the API server. Providing --kubeconfig enables API server mode, omitting --kubeconfig enables standalone mode. </td>
    </tr>

     <tr>
       <td colspan="2">--kubelet-cgroups string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Optional absolute name of cgroups to create and run the Kubelet in.</td>
    </tr>

     <tr>
       <td colspan="2">--lock-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> The path to file for kubelet to use as a lock file.</td>
    </tr>

     <tr>
       <td colspan="2">--log-backtrace-at traceLocation</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">when logging hits line file:N, emit a stack trace (default :0)</td>
    </tr>

     <tr>
       <td colspan="2">--log-cadvisor-usage</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Whether to log the usage of the cAdvisor container</td>
    </tr>

     <tr>
       <td colspan="2">--log-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, write log files in this directory</td>
    </tr>

     <tr>
       <td colspan="2">--log-flush-frequency duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes (default 5s)</td>
    </tr>

     <tr>
       <td colspan="2">--logtostderr</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error instead of files (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--machine-id-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of files to check for machine-id. Use the first one that exists. (default "/etc/machine-id,/var/lib/dbus/machine-id")</td>
    </tr>

     <tr>
       <td colspan="2">--make-iptables-util-chains</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, kubelet will ensure iptables utility rules are present on host. (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--manifest-url string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">URL for accessing the container manifest</td>
    </tr>

     <tr>
       <td colspan="2">--manifest-url-header --manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of HTTP headers to use when accessing the manifest URL. Multiple headers with the same name will be added in the same order provided. This flag can be repeatedly invoked. For example: --manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'</td>
    </tr>

     <tr>
       <td colspan="2">--max-open-files int</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Number of files that can be opened by Kubelet process. (default 1000000)</td>
    </tr>

     <tr>
       <td colspan="2">--max-pods int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Number of Pods that can run on this Kubelet. (default 110)</td>
    </tr>

     <tr>
       <td colspan="2">--minimum-image-ttl-duration duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Minimum age for an unused image before it is garbage collected.</td>
    </tr>

     <tr>
       <td colspan="2">--network-plugin string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> The name of the network plugin to be invoked for various events in kubelet/pod lifecycle</td>
    </tr>

     <tr>
       <td colspan="2">--network-plugin-mtu int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> The MTU to be passed to the network plugin, to override the default. Set to 0 to use the default 1460 MTU.</td>
    </tr>

     <tr>
       <td colspan="2">--node-ip string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">IP address of the node. If set, kubelet will use this IP address for the node</td>
    </tr>

     <tr>
       <td colspan="2">--node-labels mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> Labels to add when registering the node in the cluster.</td>
    </tr>

     <tr>
       <td colspan="2">--node-status-update-frequency duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specifies how often kubelet posts node status to master. Note: be cautious when changing the constant, it must work with nodeMonitorGracePeriod in nodecontroller. (default 10s)</td>
    </tr>

     <tr>
       <td colspan="2">--oom-score-adj int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The oom-score-adj value for kubelet process. Values must be within the range [-1000, 1000] (default -999)</td>
    </tr>

     <tr>
       <td colspan="2">--pod-cidr string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The CIDR to use for pod IP addresses, only used in standalone mode.</td>
    </tr>

     <tr>
       <td colspan="2">--pod-infra-container-image string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The image whose network/ipc namespaces containers in each pod will use. (default "k8s.gcr.io/pause:3.1")</td>
    </tr>

     <tr>
       <td colspan="2">--pod-manifest-path string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the directory containing pod manifest files to run, or the path to a single pod manifest file. Files starting with dots will be ignored.</td>
    </tr>

     <tr>
       <td colspan="2">--pods-per-core int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Number of Pods per core that can run on this Kubelet. The total number of Pods on this Kubelet cannot exceed max-pods, so max-pods will be used if this calculation results in a larger number of Pods allowed on the Kubelet. A value of 0 disables this limit.</td>
    </tr>

     <tr>
       <td colspan="2">--port int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The port for the Kubelet to serve on. (default 10250)</td>
    </tr>

     <tr>
       <td colspan="2">--protect-kernel-defaults</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Default kubelet behaviour for kernel tuning. If set, kubelet errors if any of kernel tunables is different than kubelet defaults.</td>
    </tr>

     <tr>
       <td colspan="2">--provider-id string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Unique identifier for identifying the node in a machine database, i.e cloudprovider</td>
    </tr>

     <tr>
       <td colspan="2">--read-only-port int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The read-only port for the Kubelet to serve on with no authentication/authorization (set to 0 to disable) (default 10255)</td>
    </tr>

     <tr>
       <td colspan="2">--really-crash-for-testing</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, when panics occur crash. Intended for testing.</td>
    </tr>

     <tr>
       <td colspan="2">--register-node</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Register the node with the apiserver. If --kubeconfig is not provided, this flag is irrelevant, as the Kubelet won't have an apiserver to register with. Default=true. (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--register-with-taints []api.Taint</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Register the node with the given list of taints (comma separated "<key>=<value>:<effect>"). No-op if register-node is false.</td>
    </tr>

     <tr>
       <td colspan="2">--registry-burst int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum size of bursty pulls, temporarily allows pulls to burst to this number, while still not exceeding registry-qps. Only used if --registry-qps > 0 (default 10)</td>
    </tr>

     <tr>
       <td colspan="2">--registry-qps int32</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If > 0, limit registry pull QPS to this value.</td>
    </tr>

     <tr>
       <td colspan="2">--resolv-conf string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Resolver configuration file used as the basis for the container DNS resolution configuration. (default "/etc/resolv.conf")</td>
    </tr>

     <tr>
       <td colspan="2">--root-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Directory path for managing kubelet files (volume mounts,etc). (default "/var/lib/kubelet")</td>
    </tr>

     <tr>
       <td colspan="2">--rotate-certificates</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Beta feature> Auto rotate the kubelet client certificates by requesting new certificates from the kube-apiserver when the certificate expiration approaches.</td>
    </tr>

     <tr>
       <td colspan="2">--rotate-server-certificates</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Beta feature> Auto-request and rotate the kubelet serving certificates by requesting new certificates from the kube-apiserver when the certificate expiration approaches. Requires the RotateKubeletServerCertificate feature gate to be enabled, and approval of the submitted CertificateSigningRequest objects.</td>
    </tr>

     <tr>
       <td colspan="2">--runonce</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If true, exit after spawning pods from local manifests or remote urls. Exclusive with --enable-server</td>
    </tr>

     <tr>
       <td colspan="2">--runtime-cgroups string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Optional absolute name of cgroups to create and run the runtime in.</td>
    </tr>

     <tr>
       <td colspan="2">--runtime-request-timeout duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Timeout of all runtime requests except long running request - pull, logs, exec and attach. When timeout exceeded, kubelet will cancel the request, throw out an error and retry later. (default 2m0s)</td>
    </tr>

     <tr>
       <td colspan="2">--seccomp-profile-root string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> Directory path for seccomp profiles. (default "/var/lib/kubelet/seccomp")</td>
    </tr>

     <tr>
       <td colspan="2">--serialize-image-pulls</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Pull images one at a time. We recommend *not* changing the default value on nodes that run docker daemon with version < 1.9 or an Aufs storage backend. Issue #10959 has more details. (default true)</td>
    </tr>

     <tr>
       <td colspan="2">--stderrthreshold severity</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">logs at or above this threshold go to stderr (default 2)</td>
    </tr>

     <tr>
       <td colspan="2">--storage-driver-buffer-duration duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction (default 1m0s)</td>
    </tr>

     <tr>
       <td colspan="2">--storage-driver-db string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">database name (default "cadvisor")</td>
    </tr>

     <tr>
       <td colspan="2">--storage-driver-host string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">database host:port (default "localhost:8086")</td>
    </tr>

     <tr>
       <td colspan="2">--storage-driver-password string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">database password (default "root")</td>
    </tr>

     <tr>
       <td colspan="2">--storage-driver-secure</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">use secure connection with database</td>
    </tr>

     <tr>
       <td colspan="2">--storage-driver-table string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">table name (default "stats")</td>
    </tr>

     <tr>
       <td colspan="2">--storage-driver-user string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">database username (default "root")</td>
    </tr>

     <tr>
       <td colspan="2">--streaming-connection-idle-timeout duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum time a streaming connection can be idle before the connection is automatically closed. 0 indicates no timeout. Example: '5m' (default 4h0m0s)</td>
    </tr>

     <tr>
       <td colspan="2">--sync-frequency duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Max period between synchronizing running containers and config (default 1m0s)</td>
    </tr>

     <tr>
       <td colspan="2">--system-cgroups /</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Optional absolute name of cgroups in which to place all non-kernel processes that are not already inside a cgroup under /. Empty for no container. Rolling back the flag requires a reboot.</td>
    </tr>

     <tr>
       <td colspan="2">--system-reserved mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of ResourceName=ResourceQuantity (e.g. cpu=200m,memory=500Mi,ephemeral-storage=1Gi,pid=1000) pairs that describe resources reserved for non-kubernetes components. Currently only cpu, memory, and pid are supported. See http://kubernetes.io/docs/user-guide/compute-resources for more detail. [default=none]</td>
    </tr>

     <tr>
       <td colspan="2">--system-reserved-cgroup string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Absolute name of the top level cgroup that is used to manage non-kubernetes components for which compute resources were reserved via '--system-reserved' flag. Ex. '/system-reserved'. [default='']</td>
    </tr>

     <tr>
       <td colspan="2">--tls-cert-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">File containing x509 Certificate used for serving HTTPS (with intermediate certs, if any, concatenated after server cert). If --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory passed to --cert-dir.</td>
    </tr>

    <tr>
      <td colspan="2">--tls-cipher-suites stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used.  Possible values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA</td>
    </tr>

     <tr>
       <td colspan="2">--tls-private-key-file string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">File containing x509 private key matching --tls-cert-file.</td>
    </tr>

     <tr>
       <td colspan="2">-v, --v Level</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">log level for V logs</td>
    </tr>

     <tr>
       <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td>
    </tr>

     <tr>
       <td colspan="2">--vmodule moduleSpec</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">comma-separated list of pattern=N settings for file-filtered logging</td>
    </tr>

     <tr>
       <td colspan="2">--volume-plugin-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"><Warning: Alpha feature> The full path of the directory in which to search for additional third party volume plugins (default "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/")</td>
    </tr>

     <tr>
       <td colspan="2">--volume-stats-agg-period duration</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specifies interval for kubelet to calculate and cache the volume disk usage for all pods and volumes.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kubelet</td>
    </tr>

  </tbody>
</table>
