
Generates an etcd serving certificate and key

### Synopsis

Generates the etcd serving certificate and key and saves them into etcd/server.crt and etcd/server.key files. 

The certificate includes default subject alternative names and additional SANs provided by the user; default SANs are: localhost, 127.0.0.1. 

If both files already exist, kubeadm skips the generation step and existing files will be used. 

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase certs etcd-server [flags]
```

### Options

```
      --cert-dir string   The path where to save the certificates (default "/etc/kubernetes/pki")
      --config string     Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
  -h, --help              help for etcd-server
```

