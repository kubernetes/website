---
assignees:
- bprashanth
- derekwaynecarr
- mikedanese

---

## kubelet



### Synopsis


The kubelet is the primary "node agent" that runs on each
node. The kubelet works in terms of a PodSpec. A PodSpec is a YAML or JSON object
that describes a pod. The kubelet takes a set of PodSpecs that are provided through
various mechanisms (primarily through the apiserver) and ensures that the containers
described in those PodSpecs are running and healthy.

Other than a PodSpec from the apiserver, there are three ways that a container
manifest can be provided to the Kubelet:

* File: Path passed as a flag on the command line. This file is rechecked every 20
seconds (configurable with a flag).
* HTTP endpoint: HTTP endpoint passed as a parameter on the command line. This endpoint
is checked every 20 seconds (also configurable with a flag).
* HTTP server: The kubelet can also listen for HTTP and respond to a simple API
(underspec'd currently) to submit a new manifest.

```
kubelet
```

### Options

```
      --address=0.0.0.0: The IP address for the Kubelet to serve on (set to 0.0.0.0 for all interfaces)
      --allow-privileged[=false]: If true, allow containers to request privileged mode. [default=false]
      --api-servers=[]: List of Kubernetes API servers for publishing events, and reading pods and services. (ip:port), comma separated.
      --cadvisor-port=4194: The port of the localhost cAdvisor endpoint
      --cert-dir="/var/run/kubernetes": The directory where the TLS certs are located (by default /var/run/kubernetes). If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.
      --cgroup-root="": Optional root cgroup to use for pods. This is handled by the container runtime on a best effort basis. Default: '', which means use the container runtime default.
      --chaos-chance=0: If > 0.0, introduce random client errors and latency. Intended for testing. [default=0.0]
      --cloud-config="": The path to the cloud provider configuration file.  Empty string for no configuration file.
      --cloud-provider="": The provider for cloud services.  Empty string for no provider.
      --cluster-dns="": IP address for a cluster DNS server.  If set, kubelet will configure all containers to use this for DNS resolution in addition to the host's DNS servers
      --cluster-domain="": Domain for this cluster.  If set, kubelet will configure all containers to search this domain in addition to the host's search domains
      --config="": Path to the config file or directory of files
      --configure-cbr0[=false]: If true, kubelet will configure cbr0 based on Node.Spec.PodCIDR.
      --container-runtime="docker": The container runtime to use. Possible values: 'docker', 'rkt'. Default: 'docker'.
      --containerized[=false]: Experimental support for running kubelet in a container.  Intended for testing. [default=false]
      --cpu-cfs-quota[=true]: Enable CPU CFS quota enforcement for containers that specify CPU limits
      --docker-endpoint="": If non-empty, use this for the docker endpoint to communicate with
      --docker-exec-handler="native": Handler to use when executing a command in a container. Valid values are 'native' and 'nsenter'. Defaults to 'native'.
      --enable-custom-metrics[=false]: Support for gathering custom metrics.
      --enable-debugging-handlers[=true]: Enables server endpoints for log collection and local running of containers and commands
      --enable-server[=true]: Enable the Kubelet's server
      --event-burst=10: Maximum size of a bursty event records, temporarily allows event records to burst to this number, while still not exceeding event-qps. Only used if --event-qps > 0
      --event-qps=5: If > 0, limit event creations per second to this value. If 0, unlimited.
      --experimental-flannel-overlay[=false]: Experimental support for starting the kubelet with the default overlay network (flannel). Assumes flanneld is already running in client mode. [default=false]
      --file-check-frequency=20s: Duration between checking config files for new data
      --google-json-key="": The Google Cloud Platform Service Account JSON Key to use for authentication.
      --hairpin-mode="promiscuous-bridge": How should the kubelet setup hairpin NAT. This allows endpoints of a Service to loadbalance back to themselves if they should try to access their own Service. Valid values are "promiscuous-bridge", "hairpin-veth" and "none".
      --healthz-bind-address=127.0.0.1: The IP address for the healthz server to serve on, defaulting to 127.0.0.1 (set to 0.0.0.0 for all interfaces)
      --healthz-port=10248: The port of the localhost healthz endpoint
      --host-ipc-sources="*": Comma-separated list of sources from which the Kubelet allows pods to use the host ipc namespace. [default="*"]
      --host-network-sources="*": Comma-separated list of sources from which the Kubelet allows pods to use of host network. [default="*"]
      --host-pid-sources="*": Comma-separated list of sources from which the Kubelet allows pods to use the host pid namespace. [default="*"]
      --hostname-override="": If non-empty, will use this string as identification instead of the actual hostname.
      --http-check-frequency=20s: Duration between checking http for new data
      --image-gc-high-threshold=90: The percent of disk usage after which image garbage collection is always run. Default: 90%
      --image-gc-low-threshold=80: The percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. Default: 80%
      --kube-api-burst=10: Burst to use while talking with kubernetes apiserver
      --kube-api-qps=5: QPS to use while talking with kubernetes apiserver
      --kube-reserved=: A set of ResourceName=ResourceQuantity (e.g. cpu=200m,memory=150G) pairs that describe resources reserved for kubernetes system components. Currently only cpu and memory are supported. See http://releases.k8s.io/HEAD/docs/user-guide/compute-resources.md for more detail. [default=none]
      --kubeconfig="/var/lib/kubelet/kubeconfig": Path to a kubeconfig file, specifying how to authenticate to API server (the master location is set by the api-servers flag).
      --kubelet-cgroups="": Optional absolute name of cgroups to create and run the Kubelet in.
      --lock-file="": <Warning: Alpha feature> The path to file for kubelet to use as a lock file.
      --log-flush-frequency=5s: Maximum number of seconds between log flushes
      --low-diskspace-threshold-mb=256: The absolute free disk space, in MB, to maintain. When disk space falls below this threshold, new pods would be rejected. Default: 256
      --manifest-url="": URL for accessing the container manifest
      --manifest-url-header="": HTTP header to use when accessing the manifest URL, with the key separated from the value with a ':', as in 'key:value'
      --master-service-namespace="default": The namespace from which the kubernetes master services should be injected into pods
      --max-open-files=1000000: Number of files that can be opened by Kubelet process. [default=1000000]
      --max-pods=110: Number of Pods that can run on this Kubelet.
      --maximum-dead-containers=240: Maximum number of old instances of containers to retain globally.  Each container takes up some disk space.  Default: 100.
      --maximum-dead-containers-per-container=2: Maximum number of old instances to retain per container.  Each container takes up some disk space.  Default: 2.
      --minimum-container-ttl-duration=1m0s: Minimum age for a finished container before it is garbage collected.  Examples: '300ms', '10s' or '2h45m'
      --minimum-image-ttl-duration=2m0s: Minimum age for a unused image before it is garbage collected.  Examples: '300ms', '10s' or '2h45m'. Default: '2m'
      --network-plugin="": <Warning: Alpha feature> The name of the network plugin to be invoked for various events in kubelet/pod lifecycle
      --network-plugin-dir="/usr/libexec/kubernetes/kubelet-plugins/net/exec/": <Warning: Alpha feature> The full path of the directory in which to search for network plugins
      --node-ip="": IP address of the node. If set, kubelet will use this IP address for the node
      --node-labels=: <Warning: Alpha feature> Labels to add when registering the node in the cluster.  Labels must be key=value pairs separated by ','.
      --node-status-update-frequency=10s: Specifies how often kubelet posts node status to master. Note: be cautious when changing the constant, it must work with nodeMonitorGracePeriod in nodecontroller. Default: 10s
      --non-masquerade-cidr="10.0.0.0/8": Traffic to IPs outside this range will use IP masquerade.
      --oom-score-adj=-999: The oom-score-adj value for kubelet process. Values must be within the range [-1000, 1000]
      --outofdisk-transition-frequency=5m0s: Duration for which the kubelet has to wait before transitioning out of out-of-disk node condition status. Default: 5m0s
      --pod-cidr="": The CIDR to use for pod IP addresses, only used in standalone mode.  In cluster mode, this is obtained from the master.
      --pod-infra-container-image="gcr.io/google_containers/pause:2.0": The image whose network/ipc namespaces containers in each pod will use.
      --port=10250: The port for the Kubelet to serve on.
      --read-only-port=10255: The read-only port for the Kubelet to serve on with no authentication/authorization (set to 0 to disable)
      --really-crash-for-testing[=false]: If true, when panics occur crash. Intended for testing.
      --reconcile-cidr[=true]: Reconcile node CIDR with the CIDR specified by the API server. No-op if register-node or configure-cbr0 is false. [default=true]
      --register-node[=true]: Register the node with the apiserver (defaults to true if --api-servers is set)
      --register-schedulable[=true]: Register the node as schedulable. No-op if register-node is false. [default=true]
      --registry-burst=10: Maximum size of a bursty pulls, temporarily allows pulls to burst to this number, while still not exceeding registry-qps.  Only used if --registry-qps > 0
      --registry-qps=5: If > 0, limit registry pull QPS to this value.  If 0, unlimited. [default=5.0]
      --resolv-conf="/etc/resolv.conf": Resolver configuration file used as the basis for the container DNS resolution configuration.
      --rkt-path="": Path of rkt binary. Leave empty to use the first rkt in $PATH.  Only used if --container-runtime='rkt'
      --rkt-stage1-image="": image to use as stage1. Local paths and http/https URLs are supported. If empty, the 'stage1.aci' in the same directory as '--rkt-path' will be used
      --root-dir="/var/lib/kubelet": Directory path for managing kubelet files (volume mounts,etc).
      --runonce[=false]: If true, exit after spawning pods from local manifests or remote urls. Exclusive with --api-servers, and --enable-server
      --runtime-cgroups="": Optional absolute name of cgroups to create and run the runtime in.
      --serialize-image-pulls[=true]: Pull images one at a time. We recommend *not* changing the default value on nodes that run docker daemon with version < 1.9 or an Aufs storage backend. Issue #10959 has more details. [default=true]
      --streaming-connection-idle-timeout=4h0m0s: Maximum time a streaming connection can be idle before the connection is automatically closed. 0 indicates no timeout. Example: '5m'
      --sync-frequency=1m0s: Max period between synchronizing running containers and config
      --system-cgroups="": Optional absolute name of cgroups in which to place all non-kernel processes that are not already inside a cgroup under `/`. Empty for no container. Rolling back the flag requires a reboot. (Default: "").
      --system-reserved=: A set of ResourceName=ResourceQuantity (e.g. cpu=200m,memory=150G) pairs that describe resources reserved for non-kubernetes components. Currently only cpu and memory are supported. See http://releases.k8s.io/HEAD/docs/user-guide/compute-resources.md for more detail. [default=none]
      --tls-cert-file="": File containing x509 Certificate for HTTPS.  (CA cert, if any, concatenated after server cert). If --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory passed to --cert-dir.
      --tls-private-key-file="": File containing x509 private key matching --tls-cert-file.
      --volume-plugin-dir="/usr/libexec/kubernetes/kubelet-plugins/volume/exec/": <Warning: Alpha feature> The full path of the directory in which to search for additional third party volume plugins
      --volume-stats-agg-period=1m0s: Specifies interval for kubelet to calculate and cache the volume disk usage for all pods and volumes.  To disable volume calculations, set to 0.  Default: '1m'
```

###### Auto generated by spf13/cobra on 15-Mar-2016
