---
---

* TOC
{:toc}

## Prerequisites

1. You need an IBM SoftLayer account. Visit [http://www.softlayer.com/](http://www.softlayer.com/) to get started
2. You need a SoftLayer API Key, as documented at [https://knowledgelayer.softlayer.com/procedure/retrieve-your-api-key](https://knowledgelayer.softlayer.com/procedure/retrieve-your-api-key)


## Creating the environment

Follow this procedure to create a Kubernetes environment in IBM SoftLayer:

* First clone the project [https://github.com/patrocinio/kubernetes-softlayer](https://github.com/patrocinio/kubernetes-softlayer)

* Edit the kubernetes.cfg file to enter the following SoftLayer configuration

    - USER
    - API_KEY
    - (Optional) DATACENTER: Check http://www.softlayer.com/data-centers and look at the Ping/Trace Route column for the code. For example, the code for speedtest.wdc01.softlayer.com is wdc01
    - (Optional) CPU: Define the number of CPIUs you want in each server
    - (Optional) MEMORY: Define the amount of RAM (in MB) in each server
    - (Optional) PUBLIC_VLAN: Define the public VLAN number
    - (Optional) PRIVATE_VLAN: Define the private VLAN number

* Run the following command: 


```shell
deploy-kubernetes.sh
````

## Tearing down the cluster

Use the following script to destroy the Kubernetes environment:

```shell
destroy-kubernetes.sh
```

## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.