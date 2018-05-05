---
reviewers:
- Random-Liu
title: Validate Node Setup
---

{{< toc >}}

## Node Conformance Test

*Node conformance test* is a containerized test framework that provides a system
verification and functionality test for a node. The test validates whether the
node meets the minimum requirements for Kubernetes; a node that passes the test
is qualified to join a Kubernetes cluster.

## Limitations

In Kubernetes version 1.5, node conformance test has the following limitations:

* Node conformance test only supports Docker as the container runtime.

## Node Prerequisite

To run node conformance test, a node must satisfy the same prerequisites as a
standard Kubernetes node. At a minimum, the node should have the following
daemons installed:

* Container Runtime (Docker)
* Kubelet

## Running Node Conformance Test

To run the node conformance test, perform the following steps:

1. Point your Kubelet to localhost `--api-servers="http://localhost:8080"`,
because the test framework starts a local master to test Kubelet. There are some
other Kubelet flags you may care:
  * `--pod-cidr`: If you are using `kubenet`, you should specify an arbitrary CIDR
    to Kubelet, for example `--pod-cidr=10.180.0.0/24`.
  * `--cloud-provider`: If you are using `--cloud-provider=gce`, you should
    remove the flag to run the test.

2. Run the node conformance test with command:

```shell
# $CONFIG_DIR is the pod manifest path of your Kubelet.
# $LOG_DIR is the test output path.
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  k8s.gcr.io/node-test:0.2
```

## Running Node Conformance Test for Other Architectures

Kubernetes also provides node conformance test docker images for other
architectures:

  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

## Running Selected Test

To run specific tests, overwrite the environment variable `FOCUS` with the
regular expression of tests you want to run.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  k8s.gcr.io/node-test:0.2
```

To skip specific tests, overwrite the environment variable `SKIP` with the
regular expression of tests you want to skip.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  k8s.gcr.io/node-test:0.2
```

Node conformance test is a containerized version of [node e2e test](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/e2e-node-tests.md).
By default, it runs all conformance tests.

Theoretically, you can run any node e2e test if you configure the container and
mount required volumes properly. But **it is strongly recommended to only run conformance
test**, because it requires much more complex configuration to run non-conformance test.

## Caveats

* The test leaves some docker images on the node, including the node conformance
  test image and images of containers used in the functionality
  test.
* The test leaves dead containers on the node. These containers are created
  during the functionality test.
