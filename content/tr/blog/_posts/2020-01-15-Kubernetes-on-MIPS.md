---
layout: blog
title: "Kubernetes on MIPS"
date: 2020-01-15
slug: Kubernetes-on-MIPS
author: >
  TimYin Shi,
  Dominic Yin, 
  Wang Zhan,
  Jessica Jiang,
  Will Cai,
  Jeffrey Gao, 
  Simon Sun (Inspur)
---

## Background

[MIPS](https://en.wikipedia.org/wiki/MIPS_architecture) (Microprocessor without Interlocked Pipelined Stages) is a reduced instruction set computer (RISC) instruction set architecture (ISA), appeared in 1981 and developed by MIPS Technologies. Now MIPS architecture is widely used in many electronic products.

[Kubernetes](https://kubernetes.io) has officially supported a variety of CPU architectures such as x86, arm/arm64, ppc64le, s390x. However, it's a pity that Kubernetes doesn't support MIPS. With the widespread use of cloud native technology, users under MIPS architecture also have an urgent demand for Kubernetes on MIPS.

## Achievements

For many years, to enrich the ecology of the open-source community, we have been working on adjusting MIPS architecture for Kubernetes use cases. With the continuous iterative optimization and the performance improvement of the MIPS CPU, we have made some breakthrough progresses on the mips64el platform.

Over the years, we have been actively participating in the Kubernetes community and have rich experience in the using and optimization of Kubernetes technology. Recently, we tried to adapt the MIPS architecture platform for Kubernetes and achieved a new a stage on that journey. The team has completed migration and adaptation of Kubernetes and related components, built not only a stable and highly available MIPS cluster but also completed the conformance test for Kubernetes v1.16.2.

![Kubernetes on MIPS](/images/blog/2020-01-15-Kubernetes-on-MIPS/kubernetes-on-mips.png)

_Figure 1 Kubernetes on MIPS_

## K8S-MIPS component build

Almost all native cloud components related to Kubernetes do not provide a MIPS version installation package or image. The prerequisite of deploying Kubernetes on the MIPS platform is to compile and build all required components on the mips64el platform. These components include:

- golang
- docker-ce
- hyperkube
- pause
- etcd
- calico
- coredns
- metrics-server

Thanks to the excellent design of Golang and its good support for the MIPS platform, the compilation processes of the above cloud native components are greatly simplified. First of all, we compiled Golang on the latest stable version for the mips64el platform, and then we compiled most of the above components with source code.

During the compilation processes, we inevitably encountered many platform compatibility problems, such as a Golang system call compatibility problem (syscall), typecasting of syscall. Stat_t from uint32 to uint64, patching for EpollEvent, and so on.

To build K8S-MIPS components, we used cross-compilation technology. Our process involved integrating a QEMU tool to translate MIPS CPU instructions and modifying the build script of Kubernetes and E2E image script of Kubernetes, Hyperkube, and E2E test images on MIPS architecture.

After successfully building the above components, we use tools such as kubespray and kubeadm to complete kubernetes cluster construction.

| Name                           | Version | MIPS Repository                                                                                                                                                                                                                                                                   |
| ------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| golang on MIPS                 | 1.12.5  | -                                                                                                                                                                                                                                                                                 |
| docker-ce on MIPS              | 18.09.8 | -                                                                                                                                                                                                                                                                                 |
| metrics-server for CKE on MIPS | 0.3.2   | `registry.inspurcloud.cn/library/cke/kubernetes/metrics-server-mips64el:v0.3.2`                                                                                                                                                                                                   |
| etcd for CKE on MIPS           | 3.2.26  | `registry.inspurcloud.cn/library/cke/etcd/etcd-mips64el:v3.2.26`                                                                                                                                                                                                                  |
| pause for CKE on MIPS          | 3.1     | `registry.inspurcloud.cn/library/cke/kubernetes/pause-mips64el:3.1`                                                                                                                                                                                                               |
| hyperkube for CKE on MIPS      | 1.14.3  | `registry.inspurcloud.cn/library/cke/kubernetes/hyperkube-mips64el:v1.14.3`                                                                                                                                                                                                       |
| coredns for CKE on MIPS        | 1.6.5   | `registry.inspurcloud.cn/library/cke/kubernetes/coredns-mips64el:v1.6.5`                                                                                                                                                                                                          |
| calico for CKE on MIPS         | 3.8.0   | `registry.inspurcloud.cn/library/cke/calico/cni-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/ctl-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/node-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/kube-controllers-mips64el:v3.8.0` |

**Note**: CKE is a Kubernetes-based cloud container engine launched by Inspur

![K8S-MIPS Cluster Components](/images/blog/2020-01-15-Kubernetes-on-MIPS/k8s-mips-cluster-components.png)

_Figure 2 K8S-MIPS Cluster Components_

![CPU Architecture](/images/blog/2020-01-15-Kubernetes-on-MIPS/cpu-architecture.png)

_Figure 3 CPU Architecture_

![Cluster Node Information](/images/blog/2020-01-15-Kubernetes-on-MIPS/cluster-node-information.png)

_Figure 4 Cluster Node Information_

## Run K8S Conformance Test

The most straightforward way to verify the stability and availability of the K8S-MIPS cluster is to run a Kubernetes [conformance test](https://github.com/kubernetes/kubernetes/blob/v1.16.2/cluster/images/conformance/README.md).

Conformance is a standalone container to launch Kubernetes end-to-end tests for conformance testing.

Once the test has started, it launches several pods for various end-to-end tests. The source code of those images used by these pods is mostly from `kubernetes/test/images`, and the built images are at `gcr.io/kubernetes-e2e-test-images`. Since there are no MIPS images in the repository, we must first build all needed images to run the test.

### Build needed images for test

The first step is to find all needed images for the test. We can run `sonobuoy images-p e2e` command to list all images, or we can find those images in [/test/utils/image/manifest.go](https://github.com/kubernetes/kubernetes/blob/master/test/utils/image/manifest.go). Although Kubernetes officially has a complete Makefile and shell-script that provides commands for building test images, there are still a number of architecture-related issues that have not been resolved, such as the incompatibilities of base images and dependencies. So we cannot directly build mips64el architecture images by executing these commands.

Most test images are in golang, then compiled into binaries and built as Docker image based on the corresponding Dockerfile. These images are easy to build. But note that most images are using alpine as their base image, which does not officially support mips64el architecture for now. For this moment, we are unable to make mips64el version of [alpine](https://www.alpinelinux.org/), so we have to replace the alpine to existing MIPS images, such as Debian-stretch, fedora, ubuntu. Replacing the base image also requires replacing the command to install the dependencies, even the version of these dependencies.

Some images are not in `kubernetes/test/images`, such as `gcr.io/google-samples/gb-frontend:v6`. There is no clear documentation explaining where these images are locaated, though we found the source code in repository [github.com/GoogleCloudPlatform/kubernetes-engine-samples](https://github.com/GoogleCloudPlatform/kubernetes-engine-samples). We soon ran into new problems: to build these google sample images, we have to build the base image it uses, even the base image of the base images, such as `php:5-apache`, `redis`, and `perl`.

After a long process of building an image, we finished with about four dozen images, including the images used by the test pod, and the base images. The last step before we run the tests is to place all those images into every node in the cluster and make sure the Pod image pull policy is `imagePullPolicy: ifNotPresent`.

Here are some of the images we built：

- `docker.io/library/busybox:1.29`
- `docker.io/library/nginx:1.14-alpine`
- `docker.io/library/nginx:1.15-alpine`
- `docker.io/library/perl:5.26`
- `docker.io/library/httpd:2.4.38-alpine`
- `docker.io/library/redis:5.0.5-alpine`
- `gcr.io/google-containers/conformance:v1.16.2`
- `gcr.io/google-containers/hyperkube:v1.16.2`
- `gcr.io/google-samples/gb-frontend:v6`
- `gcr.io/kubernetes-e2e-test-images/agnhost:2.6`
- `gcr.io/kubernetes-e2e-test-images/apparmor-loader:1.0`
- `gcr.io/kubernetes-e2e-test-images/dnsutils:1.1`
- `gcr.io/kubernetes-e2e-test-images/echoserver:2.2`
- `gcr.io/kubernetes-e2e-test-images/ipc-utils:1.0`
- `gcr.io/kubernetes-e2e-test-images/jessie-dnsutils:1.0`
- `gcr.io/kubernetes-e2e-test-images/kitten:1.0`
- `gcr.io/kubernetes-e2e-test-images/metadata-concealment:1.2`
- `gcr.io/kubernetes-e2e-test-images/mounttest-user:1.0`
- `gcr.io/kubernetes-e2e-test-images/mounttest:1.0`
- `gcr.io/kubernetes-e2e-test-images/nautilus:1.0`
- `gcr.io/kubernetes-e2e-test-images/nonewprivs:1.0`
- `gcr.io/kubernetes-e2e-test-images/nonroot:1.0`
- `gcr.io/kubernetes-e2e-test-images/resource-consumer-controller:1.0`
- `gcr.io/kubernetes-e2e-test-images/resource-consumer:1.5`
- `gcr.io/kubernetes-e2e-test-images/sample-apiserver:1.10`
- `gcr.io/kubernetes-e2e-test-images/test-webserver:1.0`
- `gcr.io/kubernetes-e2e-test-images/volume/gluster:1.0`
- `gcr.io/kubernetes-e2e-test-images/volume/iscsi:2.0`
- `gcr.io/kubernetes-e2e-test-images/volume/nfs:1.0`
- `gcr.io/kubernetes-e2e-test-images/volume/rbd:1.0.1`
- `registry.k8s.io/etcd:3.3.15` (image changed since publication - previously used registry "k8s.gcr.io")
- `registry.k8s.io/pause:3.1` (image changed since publication - previously used registry "k8s.gcr.io")

Finally, we ran the tests and got the test result, include `e2e.log`, which showed that all test cases passed. Additionally, we submitted our test result to [k8s-conformance](https://github.com/cncf/k8s-conformance) as a [pull request](https://github.com/cncf/k8s-conformance/pull/779).

![Pull request for conformance test results](/images/blog/2020-01-15-Kubernetes-on-MIPS/pull-request-for-conformance-test-results.png)

_Figure 5 Pull request for conformance test results_

## What's next

We built the kubernetes-MIPS component manually and finished the conformance test, which verified the feasibility of Kubernetes On the MIPS platform and greatly enhanced our confidence in promoting the support of the MIPS architecture by Kubernetes.

In the future, we plan to actively contribute our experience and achievements to the community, submit PR, and patch for MIPS. We hope that more developers and companies in the community join us and promote Kubernetes on MIPS.

Contribution plan：

- contribute the source of e2e test images for MIPS
- contribute the source of hyperkube for MIPS
- contribute the source of deploy tools like kubeadm for MIPS

---
