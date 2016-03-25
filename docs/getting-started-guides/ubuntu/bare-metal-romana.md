---
---

* TOC
{:toc}

## Installation on Ubuntu with Vagrant and Romana Networking.

See the [Romana](http://romana.io) project site and the [Github repository](http://github.com/romana/romana) for updates and latest installation details.

The setup described below has been tested on Ubuntu 14.04 LTS, but should work similarly on other Linux or Mac OS X environments.
You may need to install additional development tools.

This should be done on your host. A 'run from a VM' option is being developed, for users that do not wish to install additional tools on the host.

## Prepare

To run this installation, you will need
* [Vagrant](https://www.vagrantup.com/downloads.html) installed (and [tested](https://www.vagrantup.com/docs/getting-started/) to be sure it works)
* [ansible](https://www.ansible.com) v1.9.4 or higher, and supporting python tools / libraries

## Set up Ansible

```shell
# Ubuntu
sudo apt-get install git python-pip python-dev
sudo pip install ansible netaddr

# OS X
sudo easy_install pip
sudo pip install ansible netaddr
```

# Install

Check out the Romana repository and run the installer

```shell
git clone https://github.com/romana/romana
cd romana/romana-install
./romana-setup -p vagrant -s kubernetes install
```

The Vagrant installation can take a long time to complete, because of some large downloads that are performed. Please be patient. When installation is complete, information about the cluster should be provided.

```shell
Kubernetes Summary
==================

Master
------
IP: 192.168.99.10
ssh -i /.../romana/romana-install/romana_id_rsa ubuntu@192.168.99.10

Minions
-------
ssh -i /.../romana/romana-install/romana_id_rsa ubuntu@192.168.99.11
```

You can now proceed to [Using Romana on Kubernetes](kubernetes_romana.md).

# Uninstall

From the same directory, you can perform an uninstall:

```shell
./romana-setup -p vagrant -s kubernetes install
```

This will destroy the Kubernetes cluster.

