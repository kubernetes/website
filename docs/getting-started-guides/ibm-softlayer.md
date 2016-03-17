---
---

* TOC
{:toc}

## Prerequisites

1. You need an IBM SoftLayer account. Visit [http://www.softlayer.com/](http://www.softlayer.com/) to get started
2. You need a SoftLayer API Key, as documented at [https://knowledgelayer.softlayer.com/procedure/retrieve-your-api-key](https://knowledgelayer.softlayer.com/procedure/retrieve-your-api-key)


## Creating the environment


The procedure to create a Kubernetes environment in SoftLayer is described at:
[https://github.com/patrocinio/kubernetes-softlayer](https://github.com/patrocinio/kubernetes-softlayer)
Follow the instructions there to create your environment.


## Tearing down the cluster

Use the following script to destroy the Kubernetes environment:

```shell
destroy-kubernetes.sh
```

## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.