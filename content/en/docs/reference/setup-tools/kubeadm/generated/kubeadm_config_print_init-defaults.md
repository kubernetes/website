
Print default init configuration, that can be used for 'kubeadm init'

### Synopsis


This command prints objects such as the default init configuration that is used for 'kubeadm init'.

Note that sensitive values like the Bootstrap Token fields are replaced with placeholder values like {"abcdef.0123456789abcdef" "" "nil" <nil> [] []} in order to pass validation but
not perform the real computation for creating a token.


```
kubeadm config print init-defaults [flags]
```

### Options

```
      --component-configs strings   A comma-separated list for component config API objects to print the default values for. Available values: [KubeProxyConfiguration KubeletConfiguration]. If this flag is not set, no component configs will be printed.
  -h, --help                        help for init-defaults
```

### Options inherited from parent commands

```
      --kubeconfig string   The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
      --rootfs string       [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

