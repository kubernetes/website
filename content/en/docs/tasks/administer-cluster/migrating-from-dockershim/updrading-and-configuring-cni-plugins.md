---
title: Upgrading and configuring CNI plugins
content_type: task
reviewers:
- SergeyKanzhelev
weight: 10
---

<!-- overview -->

Before you upgrade to Kubernetes 1.24, if you use a CNI network plugin that is
set up to use Container Network Interface (CNI) versions earlier than v1.0.0 and
you plan to use any of the following container runtimes, you must specify the
CNI version. Otherwise, your network will break.

This issue applies to the following container runtimes:
- **containerd** v1.6.0 and later
- **CRI-O** 1.24 and later

## {{% heading "prerequisites" %}}

You must have an existing cluster. This page is about upgrading from Kubernetes
{{< skew prevMinorVersion >}} to Kubernetes {{< skew latestVersion >}}. If your
cluster is not currently running Kubernetes {{< skew prevMinorVersion >}} then
please check the documentation for the version of Kubernetes that you plan to
upgrade to.

## High-level steps

At a high level, to upgrade and configure the CNI plugins, you typically perform
the following steps:

1. [Safely drain and cordon the node](/docs/tasks/administer-cluster/safely-drain-node/).
2. After stopping your container runtime and kubelet services, perform the
following upgrade operations:
  - If you’re running CNI plugins, upgrade them to the latest version.
  - If you’re using non-CNI plugins, replace them with CNI plugins. Use the
  latest version of the plugins.
  - Update the plugin configuration file to specify/match the version of the CNI
  specification that the plugin supports.
  - For `containerd`, ensure that you have installed the latest version (v1.0.0
  or later) of the CNI loopback plugin.
  - Upgrade node components (for example, the kubelet) to Kubernetes 1.24
  - Upgrade to or install the most current version of the container runtime.
3. Bring the node back into your cluster by restarting your container runtime
and kubelet. Uncordon the node.

How you perform these steps varies depending on your cluster setup and
management tools.

If you performed the upgrade without following these steps and your network is
broken, see the following [Troubleshooting](#troubleshooting) section.

## Explanation

CNI enables Kubernetes 1.24 networking. The given container runtimes support the
most current versions of CNI, v1.0.0 and later. For CNI to work, you must use a
CNI plugin, and its configuration file must specify the CNI version for which
the plugin was compiled.

If the version of the plugin is not specified, CNI v1.0.0 determines that the
plugin is v0.1.0, even if this is not the version. As a DevOps engineer or
administrator, you must review your CNI configuration files to ensure that they
specify the correct plugin version. If an incorrect version is specified, errors
might occur.

You must safely drain and cordon a node before upgrading the CNI plugins on the
node to a current version. Draining is required because the currently running
pods have a networking setup based on the older CNI plugins. To correctly tear
down the network on the running pods, you should leave the older version of the
CNI Plugins in place to perform the cordoning operation correctly.

## An example containerd configuration file

The following example shows a configuration for `containerd` runtime v1.6.x,
which supports the latest version of CNI, v1.0.x.

Please see the documentation from your plugin and networking provider for
further instructions on configuring your system.

By default, the `containerd` runtime adds a loopback interface, `lo`, to
containers via the CNI plugin. The loopback plugin is distributed with the
`containerd` release binaries that have the `cni` designation. `containerd`
v1.6.0 and later includes a CNI v1.0.0-compatible loopback plugin as well as
other default CNI plugins. The configuration for the loopback plugin is done
internally and is set to CNI v1.0.0. This means the version of the loopback
plugin must be v1.0.0 or later when this newer version `containerd` is started.

The following bash command generates a default CNI config. Here, the 1.0.0 value
for the config version is assigned to the `cniVersion` field for use when
`containerd` invokes the CNI bridge plugin.

```bash
cat << EOF | tee /etc/cni/net.d/10-containerd-net.conflist
{
 "cniVersion": "1.0.0",
 "name": "containerd-net",
 "plugins": [
   {
     "type": "bridge",
     "bridge": "cni0",
     "isGateway": true,
     "ipMasq": true,
     "promiscMode": true,
     "ipam": {
       "type": "host-local",
       "ranges": [
         [{
           "subnet": "10.88.0.0/16"
         }],
         [{
           "subnet": "2001:4860:4860::/64"
         }]
       ],
       "routes": [
         { "dst": "0.0.0.0/0" },
         { "dst": "::/0" }
       ]
     }
   },
   {
     "type": "portmap",
     "capabilities": {"portMappings": true}
   }
 ]
}
EOF
```

## Troubleshooting

If the version of your CNI plugin does not correctly match the plugin version in
the config because the config version is later than the plugin version, the
containerd log may/will likely show an error message on startup of a pod similar
to:

```
incompatible CNI versions; config is \"1.0.0\", plugin supports [\"0.1.0\" \"0.2.0\" \"0.3.0\" \"0.3.1\" \"0.4.0\"]"
```

Follow the instructions to update your CNI plugins and CNI config files to fix
this problem.

If the version of the plugin is missing in the CNI plugin config, the pod may
run. However, when the pod is stopped, an error will be reported similar to:

```
ERRO[2022-04-26T00:43:24.518165483Z] StopPodSandbox for "b" failed
error="failed to destroy network for sandbox \"bbc85f891eaf060c5a879e27bba9b6b06450210161dfdecfbb2732959fb6500a\": invalid version \"\": the version is empty"
```

This error leaves the pod in the not-ready state with a network namespace still
attached. To recover from this problem, edit the CNI config file to add the
missing version information. Then the next attempt to stop the pod should be
successful, and you can remove the pod.
