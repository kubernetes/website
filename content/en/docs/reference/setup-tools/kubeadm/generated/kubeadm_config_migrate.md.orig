
Read an older version of the kubeadm configuration API types from a file, and output the similar config object for the newer version

### Synopsis


This command lets you convert configuration objects of older versions to the latest supported version,
locally in the CLI tool without ever touching anything in the cluster.
In this version of kubeadm, the following API versions are supported:

- kubeadm.k8s.io/v1beta1
- kubeadm.k8s.io/v1beta2

Further, kubeadm can only write out config of version "kubeadm.k8s.io/v1beta2", but read both types.
So regardless of what version you pass to the --old-config parameter here, the API object will be
read, deserialized, defaulted, converted, validated, and re-serialized when written to stdout or
--new-config if specified.

In other words, the output of this command is what kubeadm actually would read internally if you
submitted this file to "kubeadm init"


```
kubeadm config migrate [flags]
```

### Options

```
  -h, --help                help for migrate
      --new-config string   Path to the resulting equivalent kubeadm config file using the new API version. Optional, if not specified output will be sent to STDOUT.
      --old-config string   Path to the kubeadm config file that is using an old API version and should be converted. This flag is mandatory.
```

### Options inherited from parent commands

```
      --kubeconfig string   The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file. (default "/etc/kubernetes/admin.conf")
      --rootfs string       [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

