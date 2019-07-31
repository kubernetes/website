
Upload the kubeadm ClusterConfiguration to a ConfigMap

### Synopsis

Upload the kubeadm ClusterConfiguration to a ConfigMap called kubeadm-config in the kube-system namespace. This enables correct configuration of system components and a seamless user experience when upgrading. 

Alternatively, you can use kubeadm config.

```
kubeadm init phase upload-config kubeadm [flags]
```

### Examples

```
  # upload the configuration of your cluster
  kubeadm init phase upload-config --config=myConfig.yaml
```

### Options

```
      --config string       Path to a kubeadm configuration file.
  -h, --help                help for kubeadm
      --kubeconfig string   The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

