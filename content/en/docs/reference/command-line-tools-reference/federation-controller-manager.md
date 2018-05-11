---
title: federation-controller-manager
notitle: true
weight: 110
---
## federation-controller-manager



### Synopsis


The federation controller manager is a daemon that embeds
the core control loops shipped with federation. In applications of robotics and
automation, a control loop is a non-terminating loop that regulates the state of
the system. In federation, a controller is a control loop that watches the shared
state of the federation cluster through the apiserver and makes changes attempting
to move the current state towards the desired state. Examples of controllers that
ship with federation today is the cluster controller.

```
federation-controller-manager [flags]
```

### Options

```
      --address ip                             The IP address to serve on (set to 0.0.0.0 for all interfaces) (default 0.0.0.0)
      --cluster-monitor-period duration        The period for syncing ClusterStatus in ClusterController. (default 40s)
      --concurrent-job-syncs int               The number of Jobs syncing operations that will be done concurrently. Larger number = faster endpoint updating, but more CPU (and network) load (default 10)
      --concurrent-replicaset-syncs int        The number of ReplicaSets syncing operations that will be done concurrently. Larger number = faster endpoint updating, but more CPU (and network) load (default 10)
      --concurrent-service-syncs int           The number of service syncing operations that will be done concurrently. Larger number = faster endpoint updating, but more CPU (and network) load (default 10)
      --contention-profiling                   Enable lock contention profiling, if profiling is enabled
      --controllers mapStringString            A set of key=value pairs that describe controller configuration to enable/disable specific controllers. Key should be the resource name (like services) and value should be true or false. For example: services=false,ingresses=false
      --dns-provider string                    DNS provider. Valid values are: ["aws-route53" "azure-azuredns" "coredns" "google-clouddns"]
      --dns-provider-config string             Path to config file for configuring DNS provider.
      --federated-api-burst int                Burst to use while talking with federation apiserver (default 30)
      --federated-api-qps float32              QPS to use while talking with federation apiserver (default 20)
      --federation-name string                 Federation name.
      --federation-only-namespace string       Name of the namespace that would be created only in federation control plane. (default "federation-only")
  -h, --help                                   help for federation-controller-manager
      --hpa-scale-forbidden-window duration    The time window wrt cluster local hpa lastscale time, during which federated hpa would not move the hpa max/min replicas around (default 2m0s)
      --kube-api-content-type string           ContentType of requests sent to apiserver. Passing application/vnd.kubernetes.protobuf is an experimental feature now.
      --kubeconfig string                      Path to kubeconfig file with authorization and master location information.
      --leader-elect                           Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.
      --leader-elect-lease-duration duration   The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled. (default 15s)
      --leader-elect-renew-deadline duration   The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled. (default 10s)
      --leader-elect-resource-lock endpoints   The type of resource object that is used for locking during leader election. Supported options are endpoints (default) and `configmaps`. (default "endpoints")
      --leader-elect-retry-period duration     The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled. (default 2s)
      --log-flush-frequency duration           Maximum number of seconds between log flushes (default 5s)
      --master string                          The address of the federation API server (overrides any value in kubeconfig)
      --port int                               The port that the controller-manager's http service runs on (default 10253)
      --profiling                              Enable profiling via web interface host:port/debug/pprof/ (default true)
      --service-dns-suffix string              DNS Suffix to use when publishing federated service names.  Defaults to zone-name
      --zone-id string                         Zone ID, needed if the zone name is not unique.
      --zone-name string                       Zone name, like example.com.
```

###### Auto generated by spf13/cobra on 25-Mar-2018
