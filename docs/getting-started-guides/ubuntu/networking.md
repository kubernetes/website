* TOC
{:toc}

Kubernetes supports the Container Network Interface (CNI). This is a network plugin architecture that allows you to use whatever Kubernetes-friendly SDN you want. Currently this means support for Flannel.

## Flannel

By default Flannel is included as the default network overlay. This allows hosts to address each other.

For information on the implementation of Flannel see this page:

- [https://github.com/juju-solutions/charm-flannel](https://github.com/juju-solutions/charm-flannel)

