
Generate all PKI assets necessary to establish the control plane

### Synopsis


Generate all PKI assets necessary to establish the control plane

```
kubeadm alpha phase certs all
```

### Options

```
      --apiserver-advertise-address string      The IP address the API Server will advertise it's listening on. 0.0.0.0 means the default network interface's address.
      --apiserver-cert-extra-sans stringSlice   Optional extra altnames to use for the API Server serving cert. Can be both IP addresses and dns names.
      --cert-dir string                         The path where to save and store the certificates
      --config string                           Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --service-cidr string                     Use alternative range of IP address for service VIPs
      --service-dns-domain string               Use alternative domain for services, e.g. "myorg.internal"
```

