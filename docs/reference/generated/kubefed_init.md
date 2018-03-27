---
title: kubefed init
notitle: true
---
## kubefed init

Initialize a federation control plane

### Synopsis


Init initializes a federation control plane. 

    Federation control plane is hosted inside a Kubernetes
    cluster. The host cluster must be specified using the
    --host-cluster-context flag.

```
kubefed init FEDERATION_NAME --host-cluster-context=HOST_CONTEXT [flags]
```

### Examples

```
  # Initialize federation control plane for a federation
  # named foo in the host cluster whose local kubeconfig
  # context is bar.
  kubefed init foo --host-cluster-context=bar
```

### Options

```
      --api-server-advertise-address string      Preferred address to advertise api server nodeport service. Valid only if 'api-server-service-type=NodePort'.
      --api-server-port int32                    Preferred port to use for api server nodeport service (0 for random port assignment). Valid only if 'api-server-service-type=NodePort'.
      --api-server-service-type string           The type of service to create for federation API server. Options: 'LoadBalancer' (default), 'NodePort'. (default "LoadBalancer")
      --apiserver-arg-overrides string           comma separated list of federation-apiserver arguments to override: Example "--arg1=value1,--arg2=value2..."
      --apiserver-enable-basic-auth              Enables HTTP Basic authentication for the federation-apiserver. Defaults to false.
      --apiserver-enable-token-auth              Enables token authentication for the federation-apiserver. Defaults to false.
      --controllermanager-arg-overrides string   comma separated list of federation-controller-manager arguments to override: Example "--arg1=value1,--arg2=value2..."
      --dns-provider string                      Dns provider to be used for this deployment.
      --dns-provider-config string               Config file path on local file system for configuring DNS provider.
      --dns-zone-name string                     DNS suffix for this federation. Federated Service DNS names are published with this suffix.
      --dry-run                                  dry run without sending commands to server.
      --etcd-image string                        Image to use for etcd server. (default "gcr.io/google_containers/etcd:3.1.10")
      --etcd-persistent-storage                  Use persistent volume for etcd. Defaults to 'true'. (default true)
      --etcd-pv-capacity string                  Size of persistent volume claim to be used for etcd. (default "10Gi")
      --etcd-pv-storage-class string             The storage class of the persistent volume claim used for etcd.   Must be provided if a default storage class is not enabled for the host cluster.
      --etcd-servers string                      External pre-deployed etcd server to be used to store federation state.
      --federation-system-namespace string       Namespace in the host cluster where the federation system components are installed (default "federation-system")
  -h, --help                                     help for init
      --host-cluster-context string              Host cluster context
      --image string                             Image to use for federation API server and controller manager binaries. (default "gcr.io/k8s-jkns-e2e-gce-federation/fcp-amd64:v0.0.0-master_$Format:%h$")
      --image-pull-policy string                 PullPolicy describes a policy for if/when to pull a container image. The default pull policy is IfNotPresent which will not pull an image if it already exists. (default "IfNotPresent")
      --image-pull-secrets string                Provide secrets that can access the private registry.
      --node-selector string                     comma separated list of nodeSelector arguments: Example "arg1=value1,arg2=value2..."
```

### Options inherited from parent commands

```
      --alsologtostderr                              log to standard error as well as files
      --as string                                    Username to impersonate for the operation
      --as-group stringArray                         Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --cache-dir string                             Default HTTP cache directory (default "/Users/jrondeau/.kube/http-cache")
      --certificate-authority string                 Path to a cert file for the certificate authority
      --client-certificate string                    Path to a client certificate file for TLS
      --client-key string                            Path to a client key file for TLS
      --cloud-provider-gce-lb-src-cidrs cidrs        CIDRs opened in GCE firewall for LB traffic proxy & health checks (default 130.211.0.0/22,209.85.152.0/22,209.85.204.0/22,35.191.0.0/16)
      --cluster string                               The name of the kubeconfig cluster to use
      --context string                               The name of the kubeconfig context to use
      --default-not-ready-toleration-seconds int     Indicates the tolerationSeconds of the toleration for notReady:NoExecute that is added by default to every pod that does not already have such a toleration. (default 300)
      --default-unreachable-toleration-seconds int   Indicates the tolerationSeconds of the toleration for unreachable:NoExecute that is added by default to every pod that does not already have such a toleration. (default 300)
      --insecure-skip-tls-verify                     If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --ir-data-source string                        Data source used by InitialResources. Supported options: influxdb, gcm. (default "influxdb")
      --ir-dbname string                             InfluxDB database name which contains metrics required by InitialResources (default "k8s")
      --ir-hawkular string                           Hawkular configuration URL
      --ir-influxdb-host string                      Address of InfluxDB which contains metrics required by InitialResources (default "localhost:8080/api/v1/namespaces/kube-system/services/monitoring-influxdb:api/proxy")
      --ir-namespace-only                            Whether the estimation should be made only based on data from the same namespace.
      --ir-password string                           Password used for connecting to InfluxDB (default "root")
      --ir-percentile int                            Which percentile of samples should InitialResources use when estimating resources. For experiment purposes. (default 90)
      --ir-user string                               User used for connecting to InfluxDB (default "root")
      --kubeconfig string                            Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at traceLocation               when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                               If non-empty, write log files in this directory
      --log-flush-frequency duration                 Maximum number of seconds between log flushes (default 5s)
      --logtostderr                                  log to standard error instead of files (default true)
      --match-server-version                         Require server version to match client version
  -n, --namespace string                             If present, the namespace scope for this CLI request
      --password string                              Password for basic authentication to the API server
      --request-timeout string                       The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                                The address and port of the Kubernetes API server
      --stderrthreshold severity                     logs at or above this threshold go to stderr (default 2)
      --token string                                 Bearer token for authentication to the API server
      --user string                                  The name of the kubeconfig user to use
      --username string                              Username for basic authentication to the API server
  -v, --v Level                                      log level for V logs
      --vmodule moduleSpec                           comma-separated list of pattern=N settings for file-filtered logging
```

### SEE ALSO
* [kubefed](kubefed.md)	 - kubefed controls a Kubernetes Cluster Federation

###### Auto generated by spf13/cobra on 25-Mar-2018
