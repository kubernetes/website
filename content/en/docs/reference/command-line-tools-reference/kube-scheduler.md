---
title: kube-scheduler
notitle: true
weight: 70
---
## kube-scheduler



### Synopsis

The Kubernetes scheduler is a policy-rich, topology-aware,
workload-specific function that significantly impacts availability, performance,
and capacity. The scheduler needs to take into account individual and collective
resource requirements, quality of service requirements, hardware/software/policy
constraints, affinity and anti-affinity specifications, data locality, inter-workload
interference, deadlines, and so on. Workload-specific requirements will be exposed
through the API as necessary.

```
kube-scheduler [flags]
```

### Options

```
      --address string                           DEPRECATED: the IP address on which to listen for the --port port (set to 0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces). See --bind-address instead. (default "0.0.0.0")
      --algorithm-provider string                DEPRECATED: the scheduling algorithm provider to use, one of: ClusterAutoscalerProvider | DefaultProvider
      --azure-container-registry-config string   Path to the file containing Azure container registry configuration information.
      --config string                            The path to the configuration file. Flags override values in this file.
      --contention-profiling                     DEPRECATED: enable lock contention profiling, if profiling is enabled
      --feature-gates mapStringBool              A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                                 APIListChunking=true|false (BETA - default=true)
                                                 APIResponseCompression=true|false (ALPHA - default=false)
                                                 AdvancedAuditing=true|false (BETA - default=true)
                                                 AllAlpha=true|false (ALPHA - default=false)
                                                 AppArmor=true|false (BETA - default=true)
                                                 AttachVolumeLimit=true|false (ALPHA - default=false)
                                                 BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)
                                                 BlockVolume=true|false (ALPHA - default=false)
                                                 CPUManager=true|false (BETA - default=true)
                                                 CRIContainerLogRotation=true|false (BETA - default=true)
                                                 CSIBlockVolume=true|false (ALPHA - default=false)
                                                 CSIPersistentVolume=true|false (BETA - default=true)
                                                 CustomPodDNS=true|false (BETA - default=true)
                                                 CustomResourceSubresources=true|false (BETA - default=true)
                                                 CustomResourceValidation=true|false (BETA - default=true)
                                                 DebugContainers=true|false (ALPHA - default=false)
                                                 DevicePlugins=true|false (BETA - default=true)
                                                 DynamicKubeletConfig=true|false (BETA - default=true)
                                                 DynamicProvisioningScheduling=true|false (ALPHA - default=false)
                                                 EnableEquivalenceClassCache=true|false (ALPHA - default=false)
                                                 ExpandInUsePersistentVolumes=true|false (ALPHA - default=false)
                                                 ExpandPersistentVolumes=true|false (BETA - default=true)
                                                 ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)
                                                 ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)
                                                 GCERegionalPersistentDisk=true|false (BETA - default=true)
                                                 HugePages=true|false (BETA - default=true)
                                                 HyperVContainer=true|false (ALPHA - default=false)
                                                 Initializers=true|false (ALPHA - default=false)
                                                 KubeletPluginsWatcher=true|false (ALPHA - default=false)
                                                 LocalStorageCapacityIsolation=true|false (BETA - default=true)
                                                 MountContainers=true|false (ALPHA - default=false)
                                                 MountPropagation=true|false (BETA - default=true)
                                                 PersistentLocalVolumes=true|false (BETA - default=true)
                                                 PodPriority=true|false (BETA - default=true)
                                                 PodReadinessGates=true|false (BETA - default=false)
                                                 PodShareProcessNamespace=true|false (ALPHA - default=false)
                                                 QOSReserved=true|false (ALPHA - default=false)
                                                 ReadOnlyAPIDataVolumes=true|false (DEPRECATED - default=true)
                                                 ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)
                                                 ResourceQuotaScopeSelectors=true|false (ALPHA - default=false)
                                                 RotateKubeletClientCertificate=true|false (BETA - default=true)
                                                 RotateKubeletServerCertificate=true|false (ALPHA - default=false)
                                                 RunAsGroup=true|false (ALPHA - default=false)
                                                 ScheduleDaemonSetPods=true|false (ALPHA - default=false)
                                                 ServiceNodeExclusion=true|false (ALPHA - default=false)
                                                 ServiceProxyAllowExternalIPs=true|false (DEPRECATED - default=false)
                                                 StorageObjectInUseProtection=true|false (default=true)
                                                 StreamingProxyRedirects=true|false (BETA - default=true)
                                                 SupportIPVSProxyMode=true|false (default=true)
                                                 SupportPodPidsLimit=true|false (ALPHA - default=false)
                                                 Sysctls=true|false (BETA - default=true)
                                                 TaintBasedEvictions=true|false (ALPHA - default=false)
                                                 TaintNodesByCondition=true|false (ALPHA - default=false)
                                                 TokenRequest=true|false (ALPHA - default=false)
                                                 TokenRequestProjection=true|false (ALPHA - default=false)
                                                 VolumeScheduling=true|false (BETA - default=true)
                                                 VolumeSubpath=true|false (default=true)
                                                 VolumeSubpathEnvExpansion=true|false (ALPHA - default=false)
  -h, --help                                     help for kube-scheduler
      --kube-api-burst int32                     DEPRECATED: burst to use while talking with kubernetes apiserver (default 100)
      --kube-api-content-type string             DEPRECATED: content type of requests sent to apiserver. (default "application/vnd.kubernetes.protobuf")
      --kube-api-qps float32                     DEPRECATED: QPS to use while talking with kubernetes apiserver (default 50)
      --kubeconfig string                        DEPRECATED: path to kubeconfig file with authorization and master location information.
      --leader-elect                             Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability. (default true)
      --leader-elect-lease-duration duration     The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled. (default 15s)
      --leader-elect-renew-deadline duration     The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled. (default 10s)
      --leader-elect-resource-lock endpoints     The type of resource object that is used for locking during leader election. Supported options are endpoints (default) and `configmaps`. (default "endpoints")
      --leader-elect-retry-period duration       The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled. (default 2s)
      --lock-object-name string                  DEPRECATED: define the name of the lock object. (default "kube-scheduler")
      --lock-object-namespace string             DEPRECATED: define the namespace of the lock object. (default "kube-system")
      --log-flush-frequency duration             Maximum number of seconds between log flushes (default 5s)
      --master string                            The address of the Kubernetes API server (overrides any value in kubeconfig)
      --policy-config-file string                DEPRECATED: file with scheduler policy configuration. This file is used if policy ConfigMap is not provided or --use-legacy-policy-config=true
      --policy-configmap string                  DEPRECATED: name of the ConfigMap object that contains scheduler's policy configuration. It must exist in the system namespace before scheduler initialization if --use-legacy-policy-config=false. The config must be provided as the value of an element in 'Data' map with the key='policy.cfg'
      --policy-configmap-namespace string        DEPRECATED: the namespace where policy ConfigMap is located. The kube-system namespace will be used if this is not provided or is empty. (default "kube-system")
      --port int                                 DEPRECATED: the port on which to serve HTTP insecurely without authentication and authorization. If 0, don't serve HTTPS at all. See --secure-port instead. (default 10251)
      --profiling                                DEPRECATED: enable profiling via web interface host:port/debug/pprof/
      --scheduler-name string                    DEPRECATED: name of the scheduler, used to select which pods will be processed by this scheduler, based on pod's "spec.schedulerName". (default "default-scheduler")
      --use-legacy-policy-config                 DEPRECATED: when set to true, scheduler will ignore policy ConfigMap and uses policy config file
      --version version[=true]                   Print version information and quit
      --write-config-to string                   If set, write the configuration values to this file and exit.
```

###### Auto generated by spf13/cobra on 9-Jun-2018
