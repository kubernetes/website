
Manage bootstrap tokens.

### Synopsis



This command will manage Bootstrap Token for you.
  Please note this usage of this command is optional, and mostly for advanced users.

In short, Bootstrap Tokens are used for establishing bidirectional trust between a client and a server.
A Bootstrap Token can be used when a client (for example a node that's about to join the cluster) needs
to trust the server it is talking to. Then a Bootstrap Token with the "signing" usage can be used.
Bootstrap Tokens can also function as a way to allow short-lived authentication to the API Server
(the token serves as a way for the API Server to trust the client), for example for doing the TLS Bootstrap.

What is a Bootstrap Token more exactly?
 - It is a Secret in the kube-system namespace of type "bootstrap.kubernetes.io/token".
 - A Bootstrap Token must be of the form "[a-z0-9]{6}.[a-z0-9]{16}"; the former part is the public Token ID,
   and the latter is the Token Secret, which must be kept private at all circumstances.
 - The name of the Secret must be named "bootstrap-token-(token-id)".

You can read more about Bootstrap Tokens here:

  https://kubernetes.io/docs/admin/bootstrap-tokens/


```
kubeadm token
```

### Options

```
      --dry-run             Whether to enable dry-run mode or not
      --kubeconfig string   The KubeConfig file to use for talking to the cluster (default "/etc/kubernetes/admin.conf")
```

