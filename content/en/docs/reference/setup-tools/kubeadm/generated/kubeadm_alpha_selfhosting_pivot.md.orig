
Convert a static Pod-hosted control plane into a self-hosted one

### Synopsis

Convert static Pod files for control plane components into self-hosted DaemonSets configured via the Kubernetes API. 

See the documentation for self-hosting limitations. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha selfhosting pivot [flags]
```

### Examples

```
  # Convert a static Pod-hosted control plane into a self-hosted one.
  
  kubeadm alpha phase self-hosting convert-from-staticpods
```

### Options

```
      --cert-dir string          The path where certificates are stored (default "/etc/kubernetes/pki")
      --config string            Path to a kubeadm configuration file.
  -f, --force                    Pivot the cluster without prompting for confirmation
  -h, --help                     help for pivot
      --kubeconfig string        The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
  -s, --store-certs-in-secrets   Enable storing certs in secrets
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

