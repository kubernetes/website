
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

