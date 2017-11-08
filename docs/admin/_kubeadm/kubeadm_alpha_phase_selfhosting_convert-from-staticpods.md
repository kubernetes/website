
Converts a Static Pod-hosted control plane into a self-hosted one.

### Synopsis


Converts a Static Pod-hosted control plane into a self-hosted one.

```
kubeadm alpha phase selfhosting convert-from-staticpods
```

### Options

```
      --cert-dir string        The path where certificates are stored
      --config string          Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --feature-gates string   A set of key=value pairs that describe feature gates for various features.Options are:
HighAvailability=true|false (ALPHA - default=false)
SelfHosting=true|false (BETA - default=false)
StoreCertsInSecrets=true|false (ALPHA - default=false)
SupportIPVSProxyMode=true|false (ALPHA - default=false)
      --kubeconfig string      The KubeConfig file to use for talking to the cluster (default "/etc/kubernetes/admin.conf")
```

