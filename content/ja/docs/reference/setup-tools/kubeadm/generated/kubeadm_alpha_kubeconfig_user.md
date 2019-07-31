
Output a kubeconfig file for an additional user

### Synopsis

Output a kubeconfig file for an additional user. 

  Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha kubeconfig user [flags]
```

### Examples

```
  # Output a kubeconfig file for an additional user named foo
  kubeadm alpha kubeconfig user --client-name=foo
```

### Options

```
      --apiserver-advertise-address string   The IP address the API server is accessible on
      --apiserver-bind-port int32            The port the API server is accessible on (default 6443)
      --cert-dir string                      The path where certificates are stored (default "/etc/kubernetes/pki")
      --client-name string                   The name of user. It will be used as the CN if client certificates are created
  -h, --help                                 help for user
      --org strings                          The orgnizations of the client certificate. It will be used as the O if client certificates are created
      --token string                         The token that should be used as the authentication mechanism for this kubeconfig, instead of client certificates
```

### Options inherited from parent commands

```
      --rootfs string   [EXPERIMENTAL] The path to the 'real' host root filesystem.
```

