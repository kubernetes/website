
Downloads the kubelet configuration from the cluster ConfigMap kubelet-config-1.X, where X is the minor version of the kubelet.

### Synopsis

Downloads the kubelet configuration from a ConfigMap of the form "kubelet-config-1.X" in the cluster, where X is the minor version of the kubelet. kubeadm uses the --kubelet-version parameter to determine what the desired kubelet version is. Give

```
kubeadm upgrade node config [flags]
```

### Examples

```
  # Downloads the kubelet configuration from the ConfigMap in the cluster. Uses a specific desired kubelet version.
  kubeadm upgrade node config --kubelet-version v1.11.0
  
  # Simulates the downloading of the kubelet configuration from the ConfigMap in the cluster with a specific desired
  # version. Does not change any state locally on the node.
  kubeadm upgrade node config --kubelet-version v1.11.0 --dry-run
```

### Options

```
      --dry-run                  Do not change any state, just output the actions that would be performed.
  -h, --help                     help for config
      --kubelet-version string   The *desired* version for the kubelet after the upgrade.
```

### Options inherited from parent commands

```
      --allow-experimental-upgrades        Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
      --allow-release-candidate-upgrades   Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.
      --config string                      Path to kubeadm config file. WARNING: Usage of a configuration file is experimental!
      --feature-gates string               A set of key=value pairs that describe feature gates for various features.Options are:
                                           Auditing=true|false (ALPHA - default=false)
                                           CoreDNS=true|false (default=true)
                                           DynamicKubeletConfig=true|false (ALPHA - default=false)
                                           SelfHosting=true|false (ALPHA - default=false)
                                           StoreCertsInSecrets=true|false (ALPHA - default=false)
      --ignore-preflight-errors strings    A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      --kubeconfig string                  The KubeConfig file to use when talking to the cluster. (default "/etc/kubernetes/admin.conf")
      --print-config                       Specifies whether the configuration file that will be used in the upgrade should be printed or not.
```

