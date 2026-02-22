---
layout: blog
title: 'Comparing Local Kubernetes Development Tools: Telepresence, Gefyra, and mirrord'
date: 2023-09-12
slug: local-k8s-development-tools
author: >
  Eyal Bukchin (MetalBear)
---

The Kubernetes development cycle is an evolving landscape with a myriad of tools seeking to streamline the process. Each tool has its unique approach, and the choice often comes down to individual project requirements, the team's expertise, and the preferred workflow.

Among the various solutions, a category we dubbed “Local K8S Development tools” has emerged, which seeks to enhance the Kubernetes development experience by connecting locally running components to the Kubernetes cluster. This facilitates rapid testing of new code in cloud conditions, circumventing the traditional cycle of Dockerization, CI, and deployment.

In this post, we compare three solutions in this category: Telepresence, Gefyra, and our own contender, mirrord.

## Telepresence
The oldest and most well-established solution in the category, [Telepresence](https://www.telepresence.io/) uses a VPN (or more specifically, a `tun` device) to connect the user's machine (or a locally running container) and the cluster's network. It then supports the interception of incoming traffic to a specific service in the cluster, and its redirection to a local port. The traffic being redirected can also be filtered to avoid completely disrupting the remote service. It also offers complementary features to support file access (by locally mounting a volume mounted to a pod) and importing environment variables.
Telepresence requires the installation of a local daemon on the user's machine (which requires root privileges) and a Traffic Manager component on the cluster. Additionally, it runs an Agent as a sidecar on the pod to intercept the desired traffic.



## Gefyra
[Gefyra](https://gefyra.dev/), similar to Telepresence, employs a VPN to connect to the cluster. However, it only supports connecting locally running Docker containers to the cluster. This approach enhances portability across different OSes and local setups. However, the downside is that it does not support natively run uncontainerized code.

Gefyra primarily focuses on network traffic, leaving file access and environment variables unsupported. Unlike Telepresence, it doesn't alter the workloads in the cluster, ensuring a straightforward clean-up process if things go awry.


## mirrord
The newest of the three tools, [mirrord](https://mirrord.dev/) adopts a different approach by injecting itself
into the local binary (utilizing `LD_PRELOAD` on Linux or `DYLD_INSERT_LIBRARIES` on macOS),
and overriding libc function calls, which it then proxies a temporary agent it runs in the cluster.
For example, when the local process tries to read a file mirrord intercepts that call and sends it
to the agent, which then reads the file from the remote pod. This method allows mirrord to cover
all inputs and outputs to the process – covering network access, file access, and
environment variables uniformly.

By working at the process level, mirrord supports running multiple local processes simultaneously, each in the context of their respective pod in the cluster, without requiring them to be containerized and without needing root permissions on the user’s machine. 


## Summary

<table>
<caption>Comparison of Telepresence, Gefyra, and mirrord</caption>
<thead>
<tr>
<td class="empty"></td>
<th>Telepresence</th>
<th>Gefyra</th>
<th>mirrord</th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">Cluster connection scope</th>
<td>Entire machine or container</td>
<td>Container</td>
<td>Process</td>
</tr>
<tr>
<th scope="row">Developer OS support</th>
<td>Linux, macOS, Windows</td>
<td>Linux, macOS, Windows</td>
<td>Linux, macOS, Windows (WSL)</td>
</tr>
<tr>
<th scope="row">Incoming traffic features</th>
<td>Interception</td>
<td>Interception</td>
<td>Interception or mirroring</td>
</tr>
<tr>
<th scope="row">File access</th>
<td>Supported</td>
<td>Unsupported</td>
<td>Supported</td>
</tr>
<tr>
<th scope="row">Environment variables</th>
<td>Supported</td>
<td>Unsupported</td>
<td>Supported</td>
</tr>
<tr>
<th scope="row">Requires local root</th>
<td>Yes</td>
<td>No</td>
<td>No</td>
</tr>
<tr>
<th scope="row">How to use</th>
<td><ul><li>CLI</li><li>Docker Desktop extension</li></ul></td>
<td><ul><li>CLI</li><li>Docker Desktop extension</li></ul></td>
<td><ul><li>CLI</li><li>Visual Studio Code extension</li><li>IntelliJ plugin</li></ul></td>
</tr>
</tbody>
</table>


## Conclusion
Telepresence, Gefyra, and mirrord each offer unique approaches to streamline the Kubernetes development cycle, each having its strengths and weaknesses. Telepresence is feature-rich but comes with complexities, mirrord offers a seamless experience and supports various functionalities, while Gefyra aims for simplicity and robustness.

Your choice between them should depend on the specific requirements of your project, your team's familiarity with the tools, and the desired development workflow. Whichever tool you choose, we believe the local Kubernetes development approach can provide an easy, effective, and cheap solution to the bottlenecks of the Kubernetes development cycle, and will become even more prevalent as these tools continue to innovate and evolve.
