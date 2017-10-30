
Outputs a kubeconfig file for an additional user.

### Synopsis


Outputs a kubeconfig file for an additional user.

```
kubeadm alpha phase kubeconfig user
```

### Options

```
      --apiserver-advertise-address string   The IP address or DNS name the API Server is accessible on.
      --apiserver-bind-port int32            The port the API Server is accessible on.
      --cert-dir string                      The path where certificates are stored.
      --client-name string                   The name of the KubeConfig user that will be created. Will also be used as the CN if client certs are created.
      --token string                         The token that should be used as the authentication mechanism for this kubeconfig.
```

### Options inherited from parent commands

```
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --version version[=true]                   Print version information and quit
```
