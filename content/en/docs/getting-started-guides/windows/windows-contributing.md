# Document 2: Windows Node contribution specifics

[https://github.com/kubernetes/community/tree/master/contributors/guide](https://github.com/kubernetes/community/tree/master/contributors/guide) Under Contributing section


## Joining the SIG-Windows Mailing List and Slack Channel

The best way to get in contact with the contributors working on Windows support is through the Kubernetes Slack. To get a Slack invite, visit [http://slack.k8s.io/](http://slack.k8s.io/) . Once you're logged in, join us in the [#SIG-Windows](https://kubernetes.slack.com/messages/C0SJ4AFB7) channel.

To get access to shared documents, meeting calendar, and additional discussions, be sure to also join the [SIG-Windows Google Group](https://groups.google.com/forum/#!forum/kubernetes-sig-windows). 


## Building Kubernetes for Windows from Source

The Kubernetes build scripts have not been ported to Windows, so it's best to run in a Linux VM where you can run the same Docker container used in the official Kubernetes builds. This simplifies the steps, but means that you cannot build under Windows Subsystem for Linux (WSL). 

It's best to skim over the [Building Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/build/README.md) guide if you have never built Kubernetes before to get the latest info. These steps are a summary focused on cross-building the Windows node binaries (kubelet & kube-proxy).


### ​Build Prerequisites

At least 60GB of disk space is required, and 16GB of memory (or memory + swap).

Once you have a VM, install Git, [Docker-CE](https://docs.docker.com/install/), and make. The build scripts will pull a Docker container with the required version of golang and other needed tools preinstalled.

If you're using Ubuntu, then install the following packages: git, build-essential, [Docker-CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/).


### ​Pulling a PR (optional)

If there is a PR you would like to build, it's easy. You can create a working branch, pull the changes from GitHub in a patch, apply, then build.

The examples here are based off a patch on GitHub: [https://github.com/kubernetes/kubernetes/pull/74788](https://github.com/kubernetes/kubernetes/pull/74788) . Be sure to replace the URL with the PR you want to test.

First, make sure your local clone is up-to-date with master: `git checkout master ; git pull master`

Next, create a branch in your repo: `git checkout -b pr74788`

Now, get the patch for the PR you want. Append .patch to the URL, and download it with curl: `curl -L -o pr74788.patch https://github.com/kubernetes/kubernetes/pull/74788.patch`

Merge it with ``patch -p1 < pr74788.patch``

If there are errors, fix them as needed. Once you're done, delete the .patch file and then `git commit` the rest to your local branch.


### Building Kubernetes binaries for Windows

You can build individual components such as kubelet, kube-proxy, or kubectl by running `./build/run.sh make <binary name> KUBE_BUILD_PLATFORMS=windows/amd64` such as `./build/run.sh make kubelet KUBE_BUILD_PLATFORMS=windows/amd64`

If you would like to build all binaries at once, then run `./build/run.sh make cross KUBE_BUILD_PLATFORMS=windows/amd64`

Once the build completes, the files will be in _output/dockerized/bin.


## Running Your Own Cluster


## Testing Your Changes


### Updating the Node binaries

Once you have binaries built (see Building Kubernetes binaries for Windows), the easiest way to test them is to replace them on an existing cluster. Use the steps above to build a cluster in your cloud of choice. To update the binaries on an existing node, follow these steps:



1. Drain & cordon a node with `kubectl drain <nodename>`
2. Connect to the node with SSH or Windows Remote Desktop, and start PowerShell
3. On the node, run `Stop-Service kubelet -Force`
4. Copy kubelet.exe and kube-proxy.exe to a cloud storage account, or use SSH to copy them directly to the node.
5. Overwrite the existing kubelet & kube-proxy binaries. If you don't know where they are, run `sc.exe qc kubelet` or `sc.exe qc kube-proxy` and look at the BINARY_PATH_NAME returned.
6. Start the updated kubelet & kube-proxy with `Start-Service kubelet`


### ​Running Tests

For the most up-to-date steps on how to build and run tests, please go to [https://github.com/kubernetes-sigs/windows-testing](https://github.com/kubernetes-sigs/windows-testing) . It has everything you need to build and run tests, as well as links to the SIG-Windows configurations used on [TestGrid](https://testgrid.k8s.io/sig-windows).


## Reporting Issues


### Gathering Logs

Gathering trouble shooting info for CNI. [https://github.com/kubernetes/kubernetes/issues/74766#issuecomment-468736127](https://github.com/kubernetes/kubernetes/issues/74766#issuecomment-468736127) 

On the node before creating the pod for the first time.

start-birstranfer [https://raw.githubusercontent.com/Microsoft/SDN/master/Kubernetes/windows/debug/collectlogs.ps1](https://raw.githubusercontent.com/Microsoft/SDN/master/Kubernetes/windows/debug/collectlogs.ps1)

run collectlogs.ps1

then start the trace by running the following command

C:\k\debug\starthnstrace.cmd

repro the issue

run "netsh trace stop"

then do again collectlogs.ps1

and send us both before and after collectlogs.ps1 and C:\server.etl
