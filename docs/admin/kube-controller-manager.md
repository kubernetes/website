---
---

## kube-controller-manager



### Synopsis


The Kubernetes controller manager is a daemon that embeds
the core control loops shipped with Kubernetes. In applications of robotics and
automation, a control loop is a non-terminating loop that regulates the state of
the system. In Kubernetes, a controller is a control loop that watches the shared
state of the cluster through the apiserver and makes changes attempting to move the
current state towards the desired state. Examples of controllers that ship with
Kubernetes today are the replication controller, endpoints controller, namespace
controller, and serviceaccounts controller.

```
kube-controller-manager
```

### Options

```
      --address=0.0.0.0: The IP address to serve on (set to 0.0.0.0 for all interfaces)
      --allocate-node-cidrs[=false]: Should CIDRs for Pods be allocated and set on the cloud provider.
      --cloud-config="": The path to the cloud provider configuration file.  Empty string for no configuration file.
      --cloud-provider="": The provider for cloud services.  Empty string for no provider.
      --cluster-cidr="": CIDR Range for Pods in cluster.
      --cluster-name="kubernetes": The instance prefix for the cluster
      --concurrent-deployment-syncs=5: The number of deployment objects that are allowed to sync concurrently. Larger number = more responsive deployments, but more CPU (and network) load
      --concurrent-endpoint-syncs=5: The number of endpoint syncing operations that will be done concurrently. Larger number = faster endpoint updating, but more CPU (and network) load
      --concurrent-namespace-syncs=2: The number of namespace objects that are allowed to sync concurrently. Larger number = more responsive namespace termination, but more CPU (and network) load
      --concurrent-replicaset-syncs=5: The number of replica sets that are allowed to sync concurrently. Larger number = more responsive replica management, but more CPU (and network) load
      --concurrent-resource-quota-syncs=5: The number of resource quotas that are allowed to sync concurrently. Larger number = more responsive quota management, but more CPU (and network) load
      --concurrent_rc_syncs=5: The number of replication controllers that are allowed to sync concurrently. Larger number = more responsive replica management, but more CPU (and network) load
      --daemonset-lookup-cache-size=1024: The the size of lookup cache for daemonsets. Larger number = more responsive daemonsets, but more MEM load.
      --deleting-pods-burst=10: Number of nodes on which pods are bursty deleted in case of node failure. For more details look into RateLimiter.
      --deleting-pods-qps=0.1: Number of nodes per second on which pods are deleted in case of node failure.
      --deployment-controller-sync-period=30s: Period for syncing the deployments.
      --enable-hostpath-provisioner[=false]: Enable HostPath PV provisioning when running without a cloud provider. This allows testing and development of provisioning features.  HostPath provisioning is not supported in any way, won't work in a multi-node cluster, and should not be used for anything other than testing or development.
      --google-json-key="": The Google Cloud Platform Service Account JSON Key to use for authentication.
      --horizontal-pod-autoscaler-sync-period=30s: The period for syncing the number of pods in horizontal pod autoscaler.
      --kube-api-burst=30: Burst to use while talking with kubernetes apiserver
      --kube-api-qps=20: QPS to use while talking with kubernetes apiserver
      --kubeconfig="": Path to kubeconfig file with authorization and master location information.
      --leader-elect[=false]: Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.
      --leader-elect-lease-duration=15s: The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.
      --leader-elect-renew-deadline=10s: The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.
      --leader-elect-retry-period=2s: The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.
      --log-flush-frequency=5s: Maximum number of seconds between log flushes
      --master="": The address of the Kubernetes API server (overrides any value in kubeconfig)
      --min-resync-period=12h0m0s: The resync period in reflectors will be random between MinResyncPeriod and 2*MinResyncPeriod
      --namespace-sync-period=5m0s: The period for syncing namespace life-cycle updates
      --node-monitor-grace-period=40s: Amount of time which we allow running Node to be unresponsive before marking it unhealty. Must be N times more than kubelet's nodeStatusUpdateFrequency, where N means number of retries allowed for kubelet to post node status.
      --node-monitor-period=5s: The period for syncing NodeStatus in NodeController.
      --node-startup-grace-period=1m0s: Amount of time which we allow starting Node to be unresponsive before marking it unhealty.
      --node-sync-period=10s: The period for syncing nodes from cloudprovider. Longer periods will result in fewer calls to cloud provider, but may delay addition of new nodes to cluster.
      --pod-eviction-timeout=5m0s: The grace period for deleting pods on failed nodes.
      --port=10252: The port that the controller-manager's http service runs on
      --profiling[=true]: Enable profiling via web interface host:port/debug/pprof/
      --pv-recycler-increment-timeout-nfs=30: the increment of time added per Gi to ActiveDeadlineSeconds for an NFS scrubber pod
      --pv-recycler-minimum-timeout-hostpath=60: The minimum ActiveDeadlineSeconds to use for a HostPath Recycler pod.  This is for development and testing only and will not work in a multi-node cluster.
      --pv-recycler-minimum-timeout-nfs=300: The minimum ActiveDeadlineSeconds to use for an NFS Recycler pod
      --pv-recycler-pod-template-filepath-hostpath="": The file path to a pod definition used as a template for HostPath persistent volume recycling. This is for development and testing only and will not work in a multi-node cluster.
      --pv-recycler-pod-template-filepath-nfs="": The file path to a pod definition used as a template for NFS persistent volume recycling
      --pv-recycler-timeout-increment-hostpath=30: the increment of time added per Gi to ActiveDeadlineSeconds for a HostPath scrubber pod.  This is for development and testing only and will not work in a multi-node cluster.
      --pvclaimbinder-sync-period=10m0s: The period for syncing persistent volumes and persistent volume claims
      --replicaset-lookup-cache-size=4096: The the size of lookup cache for replicatsets. Larger number = more responsive replica management, but more MEM load.
      --replication-controller-lookup-cache-size=4096: The the size of lookup cache for replication controllers. Larger number = more responsive replica management, but more MEM load.
      --resource-quota-sync-period=5m0s: The period for syncing quota usage status in the system
      --root-ca-file="": If set, this root certificate authority will be included in service account's token secret. This must be a valid PEM-encoded CA bundle.
      --service-account-private-key-file="": Filename containing a PEM-encoded private RSA key used to sign service account tokens.
      --service-sync-period=5m0s: The period for syncing services with their external load balancers
      --terminated-pod-gc-threshold=12500: Number of terminated pods that can exist before the terminated pod garbage collector starts deleting terminated pods. If <= 0, the terminated pod garbage collector is disabled.
```

###### Auto generated by spf13/cobra on 29-Feb-2016
