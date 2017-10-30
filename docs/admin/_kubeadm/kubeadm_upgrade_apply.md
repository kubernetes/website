
Upgrade your Kubernetes cluster to the specified version

### Synopsis


Upgrade your Kubernetes cluster to the specified version

```
kubeadm upgrade apply [version]
```

### Options

```
      --dry-run                       Do not change any state, just output what actions would be applied.
  -f, --force                         Force upgrading although some requirements might not be met. This also implies non-interactive mode.
      --image-pull-timeout duration   The maximum amount of time to wait for the control plane pods to be downloaded. (default 15m0s)
  -y, --yes                           Perform the upgrade and do not prompt for confirmation (non-interactive mode).
```

### Options inherited from parent commands

```
      --allow-experimental-upgrades              Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
      --allow-release-candidate-upgrades         Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --config string                            Path to kubeadm config file (WARNING: Usage of a configuration file is experimental).
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --kubeconfig string                        The KubeConfig file to use for talking to the cluster. (default "/etc/kubernetes/admin.conf")
      --print-config                             Whether the configuration file that will be used in the upgrade should be printed or not.
      --skip-preflight-checks                    Skip preflight checks normally run before modifying the system
      --version version[=true]                   Print version information and quit
```

