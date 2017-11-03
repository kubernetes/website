
Generate and print a bootstrap token, but do not create it on the server.

### Synopsis



This command will print out a randomly-generated bootstrap token that can be used with
the "init" and "join" commands.

You don't have to use this command in order to generate a token, you can do so
yourself as long as it's in the format "[a-z0-9]{6}.[a-z0-9]{16}". This
command is provided for convenience to generate tokens in that format.

You can also use "kubeadm init" without specifying a token, and it will
generate and print one for you.


```
kubeadm token generate
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --dry-run                                  Whether to enable dry-run mode or not
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --kubeconfig string                        The KubeConfig file to use for talking to the cluster (default "/etc/kubernetes/admin.conf")
      --version version[=true]                   Print version information and quit
```

