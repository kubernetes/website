
Generates an etcd peer certificate and key

### Synopsis

Generates the etcd peer certificate and key and saves them into etcd/peer.crt and etcd/peer.key files. 

The certificate includes default subject alternative names and additional SANs provided by the user; default SANs are: <node-name>, <apiserver-advertise-address>. 

If both files already exist, kubeadm skips the generation step and existing files will be used. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase certs etcd-peer [flags]
```

### Options

```
      --cert-dir string   The path where to save the certificates (default "/etc/kubernetes/pki")
      --config string     Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
  -h, --help              help for etcd-peer
```

