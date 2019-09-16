
Upgrade the kubelet configuration for this node

### Synopsis

Download the kubelet configuration from a ConfigMap of the form "kubelet-config-1.X" in the cluster, where X is the minor version of the kubelet. kubeadm uses the KuberneteVersion field in the kubeadm-config ConfigMap to determine what the desired kubelet version is, but the user can override this by using the --kubelet-version parameter.

```
kubeadm upgrade node phase kubelet-config [flags]
```

### Options

```
      --dry-run                  Do not change any state, just output the actions that would be performed.
  -h, --help                     help for kubelet-config
      --kubeconfig string        The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
      --kubelet-version string   The *desired* version for the kubelet config after the upgrade. If not specified, the KubernetesVersion from the kubeadm-config ConfigMap will be used
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

