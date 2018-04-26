---
title: Troubleshooting
---

{% capture overview %}
This document with highlighting how to troubleshoot the deployment of a Kubernetes cluster, it will not cover debugging of workloads inside Kubernetes. 
{% endcapture %}
{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}

{% capture steps %}
## Understanding Cluster Status

Using `juju status` can give you some insight as to what's happening in a cluster:


```
Model  Controller  Cloud/Region   Version
kubes  work-multi  aws/us-east-2  2.0.2.1

App                Version  Status  Scale  Charm              Store       Rev  OS      Notes
easyrsa            3.0.1    active      1  easyrsa            jujucharms    3  ubuntu  
etcd               2.2.5    active      1  etcd               jujucharms   17  ubuntu  
flannel            0.6.1    active      2  flannel            jujucharms    6  ubuntu  
kubernetes-master  1.4.5    active      1  kubernetes-master  jujucharms    8  ubuntu  exposed
kubernetes-worker  1.4.5    active      1  kubernetes-worker  jujucharms   11  ubuntu  exposed

Unit                  Workload  Agent  Machine  Public address  Ports           Message
easyrsa/0*            active    idle   0/lxd/0  10.0.0.55                       Certificate Authority connected.
etcd/0*               active    idle   0        52.15.47.228    2379/tcp        Healthy with 1 known peers.
kubernetes-master/0*  active    idle   0        52.15.47.228    6443/tcp        Kubernetes master services ready.
  flannel/1           active    idle            52.15.47.228                    Flannel subnet 10.1.75.1/24
kubernetes-worker/0*  active    idle   1        52.15.177.233   80/tcp,443/tcp  Kubernetes worker running.
  flannel/0*          active    idle            52.15.177.233                   Flannel subnet 10.1.63.1/24

Machine  State    DNS            Inst id              Series  AZ
0        started  52.15.47.228   i-0bb211a18be691473  xenial  us-east-2a
0/lxd/0  started  10.0.0.55      juju-153b74-0-lxd-0  xenial  
1        started  52.15.177.233  i-0502d7de733be31bb  xenial  us-east-2b
```

In this example we can glean some information. The `Workload` column will show the status of a given service. The `Message` section will show you the health of a given service in the cluster. During deployment and maintenance these workload statuses will update to reflect what a given node is doing. For example the workload my say `maintenance` while message will describe this maintenance as `Installing docker`.

During normal operation the Workload should read `active`, the Agent column (which reflects what the Juju agent is doing) should read `idle`, and the messages will either say `Ready` or another descriptive term. `juju status --color` will also return all green results when a cluster's deployment is healthy. 

Status can become unwieldy for large clusters, it is then recommended to check status on individual services, for example to check the status on the workers only:

    juju status kubernetes-worker

or just on the etcd cluster:

    juju status etcd

Errors will have an obvious message, and will return a red result when used with `juju status --color`. Nodes that come up in this manner should be investigated.   

## SSHing to units

You can ssh to individual units easily with the following convention, `juju ssh <servicename>/<unit#>`:

    juju ssh kubernetes-worker/3

Will automatically ssh you to the 3rd worker unit.

    juju ssh easyrsa/0 

This will automatically ssh you to the easyrsa unit. 

## Collecting debug information

Sometimes it is useful to collect all the information from a cluster to share with a developer to identify problems. This is best accomplished with [CDK Field Agent](https://github.com/juju-solutions/cdk-field-agent).

Download and execute the collect.py script from [CDK Field Agent](https://github.com/juju-solutions/cdk-field-agent) on a box that has a Juju client configured with the current controller and model pointing at the CDK deployment of interest.

Running the script will generate a tarball of system information and includes basic information such as systemctl status, Juju logs, charm unit data, etc. Additional application-specific information may be included as well.

## Common Problems

### Load Balancer interfering with Helm

This section assumes you have a working deployment of Kubernetes via Juju using a Load Balancer for the API, and that you are using Helm to deploy charts. 

To deploy Helm you will have run: 

```
helm init
$HELM_HOME has been configured at /home/ubuntu/.helm
Tiller (the helm server side component) has been installed into your Kubernetes Cluster.
Happy Helming!
```

Then when using helm you may see one of the following errors: 

* Helm doesn't get the version from the Tiller server

```
helm version
Client: &version.Version{SemVer:"v2.1.3", GitCommit:"5cbc48fb305ca4bf68c26eb8d2a7eb363227e973", GitTreeState:"clean"}
Error: cannot connect to Tiller
```

* Helm cannot install your chart

```
helm install <chart> --debug
Error: forwarding ports: error upgrading connection: Upgrade request required
```

This is caused by the API load balancer not forwarding ports in the context of the helm client-server relationship. To deploy using helm, you will need to follow these steps: 

1. Expose the Kubernetes Master service

   ```
   juju expose kubernetes-master
   ```

1. Identify the public IP address of one of your masters

   ```
   juju status kubernetes-master
   Model       Controller  Cloud/Region   Version
   production  k8s-admin   aws/us-east-1  2.0.0

   App                Version  Status  Scale  Charm              Store       Rev  OS      Notes
   flannel            0.6.1    active      1  flannel            jujucharms    7  ubuntu
   kubernetes-master  1.5.1    active      1  kubernetes-master  jujucharms   10  ubuntu  exposed

   Unit                  Workload  Agent  Machine  Public address  Ports     Message
   kubernetes-master/0*  active    idle   5        54.210.100.102    6443/tcp  Kubernetes master running.
     flannel/0           active    idle            54.210.100.102              Flannel subnet 10.1.50.1/24

   Machine  State    DNS           Inst id              Series  AZ
   5        started  54.210.100.102  i-002b7150639eb183b  xenial  us-east-1a

   Relation      Provides               Consumes           Type
   certificates  easyrsa                kubernetes-master  regular
   etcd          etcd                   flannel            regular
   etcd          etcd                   kubernetes-master  regular
   cni           flannel                kubernetes-master  regular
   loadbalancer  kubeapi-load-balancer  kubernetes-master  regular
   cni           kubernetes-master      flannel            subordinate
   cluster-dns   kubernetes-master      kubernetes-worker  regular
   cni           kubernetes-worker      flannel            subordinate
   ```

   In this context the public IP address is 54.210.100.102.

   If you want to access this data programmatically you can use the JSON output:

   ```
   juju show-status kubernetes-master --format json | jq --raw-output '.applications."kubernetes-master".units | keys[]'
   54.210.100.102
   ```

1. Update the kubeconfig file

   Identify the kubeconfig file or section used for this cluster, and edit the server configuration.

   By default, it will look like ```https://54.213.123.123:443```. Replace it with the Kubernetes Master endpoint ```https://54.210.100.102:6443``` and save.

   Note that the default port used by CDK for the Kubernetes Master API is 6443 while the port exposed by the load balancer is 443.

1. Start helm again!

   ```
   helm install <chart> --debug
   Created tunnel using local port: '36749'
   SERVER: "localhost:36749"
   CHART PATH: /home/ubuntu/.helm/<chart>
   NAME:   <chart>
   ...
   ...
   ```

## Logging and monitoring

By default there is no log aggregation of the Kubernetes nodes, each node logs locally. Please read over the [logging](https://kubernetes.io/docs/getting-started-guides/ubuntu/logging/) page for more information.
{% endcapture %}

{% include templates/task.md %}
