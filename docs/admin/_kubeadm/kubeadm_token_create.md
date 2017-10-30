
Create bootstrap tokens on the server.

### Synopsis



This command will create a Bootstrap Token for you.
You can specify the usages for this token, the time to live and an optional human friendly description.

The [token] is the actual token to write.
This should be a securely generated random token of the form "[a-z0-9]{6}.[a-z0-9]{16}".
If no [token] is given, kubeadm will generate a random token instead.


```
kubeadm token create [token]
```

### Options

```
      --description string   A human friendly description of how this token is used.
      --groups stringSlice   Extra groups that this token will authenticate as when used for authentication. Must match "system:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]". (default [system:bootstrappers:kubeadm:default-node-token])
      --ttl duration         The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). 0 means 'never expires'. (default 24h0m0s)
      --usages stringSlice   The ways in which this token can be used. Valid options: [signing,authentication]. (default [signing,authentication])
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --dry-run                                  Whether to enable dry-run mode or not
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --kubeconfig string                        The KubeConfig file to use for talking to the cluster (default "/etc/kubernetes/admin.conf")
      --version version[=true]                   Print version information and quit
```

