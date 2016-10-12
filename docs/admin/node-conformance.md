---
assignees:
- Random-Liu

---

* TOC
{:toc}

## Node Conformance Test

*Node conformance test* is a test framework validating whether a node meets the
minimum requirement of Kubernetes with a set of system verification and
functionality test. A node which passes the tests is qualified to join a
Kubernetes cluster.

## Limitations

There are following limitations in the current implementation of node
conformance test. They'll be improved in future version.

* Node conformance test only supports Docker as the container runtime.
* Node conformance test doesn't validate network related system configurations
  and functionalities.

## Prerequisite

Node conformance test is used to test whether a node is ready to join a
Kubernetes cluster, so the prerequisite is the same with a standard Kubernetes
node. At least, the node should have properly installed:

* Container Runtime (Docker)
* Kubelet

Node conformance test validates kernel configurations. If the kenrel module
`configs` is built as module in your environment, it must be loaded before the
test. (See [Caveats #3](#caveats) for more information)

## Usage

### Run Node Conformance Test

* **Step 1:** Point your Kubelet to localhost `--api-servers="http://localhost:8080"`,
because the test framework starts a local master to test Kubelet.

* **Step 2:** Run the node conformance test with command:

```shell
# $CONFIG_DIR is the pod manifest path of your kubelet.
# $LOG_DIR is the test output path.
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v /var/run:/var/run \
  -v $CONFIG_DIR:/etc/manifest -v $LOG_DIR:/var/result \
  gcr.io/google_containers/node-test-amd64:v0.1
```

### Run Node Conformance Test for Other Architectures

We also build node conformance test docker images for other architectures:

  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

### Run Selected Test

In fact, Node conformance test is a containerized version of [node e2e
test](https://github.com/kubernetes/kubernetes/blob/release-1.4/docs/devel/e2e-node-tests.md).
By default, it runs all conformance test.

Theoretically, you can run any node e2e test if you configure the container and
mount required volumes properly. But **it is strongly recommended to only run conformance
test**, because the non-conformance test needs much more complex framework configuration.

To run specific tests, overwrite the environment variable `FOCUS` with the
regular expression of tests you want to run.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v /var/run:/var/run \
  -v $CONFIG_DIR:/etc/manifest -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  gcr.io/google_containers/node-test-amd64:v0.1
```

To skip specific tests, overwrite the environment variable `SKIP` with the
regular expression of tests you want to skip.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v /var/run:/var/run \
  -v $CONFIG_DIR:/etc/manifest -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance test and skip MirrorPod test
  gcr.io/google_containers/node-test-amd64:v0.1
```

### Caveats

* The test will leave some docker images on the node, including the node
  conformance test image and images of containers used in the functionality
  test.
* The test will leave dead containers on the node, these containers are created
  during the functionality test.
* Node conformance test validates kernel configuration. However, in some os
  distro the kernel module `configs` may not be loaded by default, and you will get
  the error `no config path in [POSSIBLE KERNEL CONFIG FILE PATHS] is
  available`. In that case please do either of the followings:
  * Manually load/unload `configs` kernel module: run `sudo modprobe configs` to
    load the kernel module, and `sudo modprobe -r configs` to unload it after the test.
  * Mount `modprobe` into the container: Add option `-v /bin/kmod:/bin/kmod
    -v /sbin/modprobe:/sbin/modprobe -v /lib/modules:/lib/modules` when starting
    the test container.
