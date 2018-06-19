---
reviewers:
- davidopp
title: Configuring Kubernetes with Salt
---

The Kubernetes cluster can be configured using Salt.

The Salt scripts are shared across multiple hosting providers and depending on where you host your Kubernetes cluster, you may be using different operating systems and different networking configurations. As a result, it's important to understand some background information before making Salt changes in order to minimize introducing failures for other hosting providers.

## Salt cluster setup

The **salt-master** service runs on the kubernetes-master [(except on the default GCE and OpenStack-Heat setup)](#standalone-salt-configuration-on-gce-and-others).

The **salt-minion** service runs on the kubernetes-master and each kubernetes-node in the cluster.

Each salt-minion service is configured to interact with the **salt-master** service hosted on the kubernetes-master via the **master.conf** file [(except on GCE and OpenStack-Heat)](#standalone-salt-configuration-on-gce-and-others).

```shell
[root@kubernetes-master] $ cat /etc/salt/minion.d/master.conf
master: kubernetes-master
```

The salt-master is contacted by each salt-minion and depending upon the machine information presented, the salt-master will provision the machine as either a kubernetes-master or kubernetes-node with all the required capabilities needed to run Kubernetes.

If you are running the Vagrant based environment, the **salt-api** service is running on the kubernetes-master.  It is configured to enable the vagrant user to introspect the salt cluster in order to find out about machines in the Vagrant environment via a REST API.

## Standalone Salt Configuration on GCE and others

On GCE and OpenStack, using the Openstack-Heat provider, the master and nodes are all configured as [standalone minions](http://docs.saltstack.com/en/latest/topics/tutorials/standalone_minion.html). The configuration for each VM is derived from the VM's [instance metadata](https://cloud.google.com/compute/docs/metadata) and then stored in Salt grains (`/etc/salt/minion.d/grains.conf`) and pillars (`/srv/salt-overlay/pillar/cluster-params.sls`) that local Salt uses to enforce state.

All remaining sections that refer to master/minion setups should be ignored for GCE and OpenStack. One fallout of this setup is that the Salt mine doesn't exist - there is no sharing of configuration amongst nodes.

## Salt security

*(Not applicable on default GCE and OpenStack-Heat setup.)*

Security is not enabled on the salt-master, and the salt-master is configured to auto-accept incoming requests from minions.  It is not recommended to use this security configuration in production environments without deeper study.  (In some environments this isn't as bad as it might sound if the salt master port isn't externally accessible and you trust everyone on your network.)

```shell
[root@kubernetes-master] $ cat /etc/salt/master.d/auto-accept.conf
open_mode: True
auto_accept: True
```

## Salt minion configuration

Each minion in the salt cluster has an associated configuration that instructs the salt-master how to provision the required resources on the machine.

An example file is presented below using the Vagrant based environment.

```shell
[root@kubernetes-master] $ cat /etc/salt/minion.d/grains.conf
grains:
  etcd_servers: $MASTER_IP
  cloud: vagrant
  roles:
    - kubernetes-master
```

Each hosting environment has a slightly different grains.conf file that is used to build conditional logic where required in the Salt files.

The following enumerates the set of defined key/value pairs that are supported today.  If you add new ones, please make sure to update this list.

Key | Value
-----------------------------------|----------------------------------------------------------------
`api_servers` | (Optional) The IP address / host name where a kubelet can get read-only access to kube-apiserver
`cbr-cidr` | (Optional) The minion IP address range used for the docker container bridge.
`cloud` | (Optional) Which IaaS platform is used to host Kubernetes, *gce*, *azure*, *aws*, *vagrant*
`etcd_servers` | (Optional) Comma-delimited list of IP addresses the kube-apiserver and kubelet use to reach etcd.  Uses the IP of the first machine in the kubernetes_master role, or 127.0.0.1 on GCE.
`hostnamef` | (Optional) The full host name of the machine, i.e. uname -n
`node_ip` | (Optional) The IP address to use to address this node
`hostname_override` | (Optional) Mapped to the kubelet hostname-override
`network_mode` | (Optional) Networking model to use among nodes: *openvswitch*
`networkInterfaceName` | (Optional) Networking interface to use to bind addresses, default value *eth0*
`publicAddressOverride` | (Optional) The IP address the kube-apiserver should use to bind against for external read-only access
`roles` | (Required) 1. `kubernetes-master` means this machine is the master in the Kubernetes cluster.  2. `kubernetes-pool` means this machine is a kubernetes-node.  Depending on the role, the Salt scripts will provision different resources on the machine.

These keys may be leveraged by the Salt sls files to branch behavior.

In addition, a cluster may be running a Debian based operating system or Red Hat based operating system (Centos, Fedora, RHEL, etc.).  As a result, it's important to sometimes distinguish behavior based on operating system using if branches like the following.

```liquid

{% if grains['os_family'] == 'RedHat' %}
// something specific to a RedHat environment (Centos, Fedora, RHEL) where you may use yum, systemd, etc.
{% else %}
// something specific to Debian environment (apt-get, initd)
{% endif %}

```

## Best Practices

When configuring default arguments for processes, it's best to avoid the use of EnvironmentFiles (Systemd in Red Hat environments) or init.d files (Debian distributions) to hold default values that should be common across operating system environments.  This helps keep our Salt template files easy to understand for editors who may not be familiar with the particulars of each distribution.

## Future enhancements (Networking)

Per pod IP configuration is provider-specific, so when making networking changes, it's important to sandbox these as all providers may not use the same mechanisms (iptables, openvswitch, etc.)

We should define a grains.conf key that captures more specifically what network configuration environment is being used to avoid future confusion across providers.
