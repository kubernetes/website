---
title: Kubefed init
---

## kubefed init

Initialize a federation control plane

### Synopsis


Init initializes a federation control plane. 

    Federation control plane is hosted inside a Kubernetes
    cluster. The host cluster must be specified using the
    --host-cluster-context flag.

```
kubefed init FEDERATION_NAME --host-cluster-context=HOST_CONTEXT
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
      --api-server-service-type string           The type of service to create for federation API server. Options: 'LoadBalancer' (default), 'NodePort'. (default "LoadBalancer")
      --apiserver-arg-overrides string           comma separated list of federation-apiserver arguments to override: Example "--arg1=value1,--arg2=value2..."
      --apiserver-enable-basic-auth              Enables HTTP Basic authentication for the federation-apiserver. Defaults to false.
      --apiserver-enable-token-auth              Enables token authentication for the federation-apiserver. Defaults to false.
      --controllermanager-arg-overrides string   comma separated list of federation-controller-manager arguments to override: Example "--arg1=value1,--arg2=value2..."
      --dns-provider string                      Dns provider to be used for this deployment.
      --dns-provider-config string               Config file path on local file system for configuring DNS provider.
      --dns-zone-name string                     DNS suffix for this federation. Federated Service DNS names are published with this suffix.
      --dry-run                                  dry run without sending commands to server.
      --etcd-persistent-storage                  Use persistent volume for etcd. Defaults to 'true'. (default true)
      --etcd-pv-capacity string                  Size of persistent volume claim to be used for etcd. (default "10Gi")
      --federation-system-namespace string       Namespace in the host cluster where the federation system components are installed (default "federation-system")
      --host-cluster-context string              Host cluster context
      --image string                             Image to use for federation API server and controller manager binaries. (default "gcr.io/google_containers/hyperkube-amd64:v0.0.0-master+$Format:%h$")
      --kubeconfig string                        Path to the kubeconfig file to use for CLI requests.
```

### Options inherited from parent commands

```
      --alsologtostderr                  log to standard error as well as files
      --as string                        Username to impersonate for the operation
      --certificate-authority string     Path to a cert. file for the certificate authority
      --client-certificate string        Path to a client certificate file for TLS
      --client-key string                Path to a client key file for TLS
      --cluster string                   The name of the kubeconfig cluster to use
      --context string                   The name of the kubeconfig context to use
      --insecure-skip-tls-verify         If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files
      --match-server-version             Require server version to match client version
  -n, --namespace string                 If present, the namespace scope for this CLI request
      --password string                  Password for basic authentication to the API server
      --request-timeout string           The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                    The address and port of the Kubernetes API server
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
      --token string                     Bearer token for authentication to the API server
      --user string                      The name of the kubeconfig user to use
      --username string                  Username for basic authentication to the API server
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```

### SEE ALSO
* [kubefed](kubefed.md)	 - kubefed controls a Kubernetes Cluster Federation

###### Auto generated by spf13/cobra on 21-Mar-2017
