
Delete bootstrap tokens on the server.

### Synopsis



This command will delete a given Bootstrap Token for you.

The [token-value] is the full Token of the form "[a-z0-9]{6}.[a-z0-9]{16}" or the
Token ID of the form "[a-z0-9]{6}" to delete.


```
kubeadm token delete [token-value]
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --dry-run                                  Whether to enable dry-run mode or not
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --kubeconfig string                        The KubeConfig file to use for talking to the cluster (default "/etc/kubernetes/admin.conf")
      --version version[=true]                   Print version information and quit
```

