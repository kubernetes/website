---
title: Testing of CSI drivers
date: 2020-01-08
author: >
  Patrick Ohly (Intel)
---

When developing a [Container Storage Interface (CSI)
driver](https://kubernetes-csi.github.io/docs/), it is useful to leverage
as much prior work as possible. This includes source code (like the
[sample CSI hostpath
driver](https://github.com/kubernetes-csi/csi-driver-host-path/)) but
also existing tests. Besides saving time, using tests written by
someone else has the advantage that it can point out aspects of the
specification that might have been overlooked otherwise.

An earlier blog post about [end-to-end
testing](https://kubernetes.io/blog/2019/03/22/kubernetes-end-to-end-testing-for-everyone/)
already showed how to use the [Kubernetes storage
tests](https://github.com/kubernetes/kubernetes/tree/master/test/e2e/storage/testsuites)
for testing of a third-party CSI driver. That
approach makes sense when the goal to also add custom E2E tests, but
depends on quite a bit of effort for setting up and maintaining a test
suite.

When the goal is to merely run the existing tests, then there are
simpler approaches. This blog post introduces those.

## Sanity testing

[csi-test
sanity](https://github.com/kubernetes-csi/csi-test/tree/master/pkg/sanity)
ensures that a CSI driver conforms to the CSI specification by calling
the gRPC methods in various ways and checking that the outcome is as
required. Despite
its current hosting under the Kubernetes-CSI organization, it is
completely independent of Kubernetes. Tests connect to a running CSI
driver through its Unix domain socket, so although the tests are
written in Go, the driver itself can be implemented in any language.

The main
[README](https://github.com/kubernetes-csi/csi-test/blob/master/pkg/sanity/README.md)
explains how to include those tests into an existing Go test
suite. The simpler alternative is to just invoke the [csi-sanity](
https://github.com/kubernetes-csi/csi-test/tree/master/cmd/csi-sanity)
command.

### Installation

Starting with csi-test v3.0.0, you can build the `csi-sanity` command
with `go get github.com/kubernetes-csi/csi-test/cmd/csi-sanity` and
you'll find the compiled binary in `$GOPATH/bin/csi-sanity`.

`go get` always builds the latest revision from the master branch. To
build a certain release, [get the source
code](https://github.com/kubernetes-csi/csi-test/releases) and run
`make -C cmd/csi-sanity`. This produces `cmd/csi-sanity/csi-sanity`.

### Usage

The `csi-sanity` binary is a full [Ginkgo test
suite](http://onsi.github.io/ginkgo/) and thus has the usual `-gingko`
command line flags. In particular, `-ginkgo.focus` and
`-ginkgo.skip` can be used to select which tests are run resp. not
run.

During a test run, `csi-sanity` simulates the behavior of a container
orchestrator (CO) by creating staging and target directories as required by the CSI spec
and calling a CSI driver via gRPC. The driver must be started before
invoking `csi-sanity`. Although the tests currently only check the gRPC
return codes, that might change and so the driver really should make
the changes requested by a call, like mounting a filesystem. That may
mean that it has to run as root.

At least one [gRPC
endpoint](https://github.com/grpc/grpc/blob/master/doc/naming.md) must
be specified via the `-csi.endpoint` parameter when invoking
`csi-sanity`, either as absolute path (`unix:/tmp/csi.sock`) for a Unix
domain socket or as host name plus port (`dns:///my-machine:9000`) for
TCP. `csi-sanity` then uses that endpoint for both node and controller
operations. A separate endpoint for controller operations can be
specified with `-csi.controllerendpoint`. Directories are created in
`/tmp` by default. This can be changed via `-csi.mountdir` and
`-csi.stagingdir`.

Some drivers cannot be deployed such that everything is guaranteed to
run on the same host. In such a case, custom scripts have to be used
to handle directories: they log into the host where the CSI node
controller runs and create or remove the directories there.

For example, during CI testing the [CSI hostpath example
driver](https://github.com/kubernetes-csi/csi-driver-host-path) gets
deployed on a real Kubernetes cluster before invoking `csi-sanity` and then
`csi-sanity` connects to it through port forwarding provided by
[`socat`](https://github.com/kubernetes-csi/csi-driver-host-path/blob/v1.2.0/deploy/kubernetes-1.16/hostpath/csi-hostpath-testing.yaml).
[Scripts](https://github.com/kubernetes-csi/csi-driver-host-path/blob/v1.2.0/release-tools/prow.sh#L808-L859)
are used to create and remove the directories.

Here's how one can replicate that, using the v1.2.0 release of the CSI hostpath driver:

```
$ cd csi-driver-host-path
$ git describe --tags HEAD
v1.2.0
$ kubectl get nodes
NAME        STATUS   ROLES    AGE   VERSION
127.0.0.1   Ready    <none>   42m   v1.16.0

$ deploy/kubernetes-1.16/deploy-hostpath.sh 
applying RBAC rules
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-provisioner/v1.4.0/deploy/kubernetes/rbac.yaml
...
deploying hostpath components
   deploy/kubernetes-1.16/hostpath/csi-hostpath-attacher.yaml
        using           image: quay.io/k8scsi/csi-attacher:v2.0.0
service/csi-hostpath-attacher created
statefulset.apps/csi-hostpath-attacher created
   deploy/kubernetes-1.16/hostpath/csi-hostpath-driverinfo.yaml
csidriver.storage.k8s.io/hostpath.csi.k8s.io created
   deploy/kubernetes-1.16/hostpath/csi-hostpath-plugin.yaml
        using           image: quay.io/k8scsi/csi-node-driver-registrar:v1.2.0
        using           image: quay.io/k8scsi/hostpathplugin:v1.2.0
        using           image: quay.io/k8scsi/livenessprobe:v1.1.0
...
service/hostpath-service created
statefulset.apps/csi-hostpath-socat created
07:38:46 waiting for hostpath deployment to complete, attempt #0
deploying snapshotclass
volumesnapshotclass.snapshot.storage.k8s.io/csi-hostpath-snapclass created

$ cat >mkdir_in_pod.sh <<EOF
#!/bin/sh
kubectl exec csi-hostpathplugin-0 -c hostpath -- mktemp -d /tmp/csi-sanity.XXXXXX
EOF

$ cat >rmdir_in_pod.sh <<EOF
#!/bin/sh
kubectl exec csi-hostpathplugin-0 -c hostpath -- rmdir "\$@"
EOF

$ chmod u+x *_in_pod.sh
$ csi-sanity -ginkgo.v \
             -csi.endpoint dns:///127.0.0.1:$(kubectl get "services/hostpath-service" -o "jsonpath={..nodePort}") \
             -csi.createstagingpathcmd ./mkdir_in_pod.sh \
             -csi.createmountpathcmd ./mkdir_in_pod.sh \
             -csi.removestagingpathcmd ./rmdir_in_pod.sh \
             -csi.removemountpathcmd ./rmdir_in_pod.sh

Running Suite: CSI Driver Test Suite
====================================
Random Seed: 1570540138
Will run 72 of 72 specs
...
Controller Service [Controller Server] ControllerGetCapabilities 
  should return appropriate capabilities
  /nvme/gopath/src/github.com/kubernetes-csi/csi-test/pkg/sanity/controller.go:111
STEP: connecting to CSI driver
STEP: creating mount and staging directories
STEP: checking successful response
•
------------------------------
Controller Service [Controller Server] GetCapacity 
  should return capacity (no optional values added)
  /nvme/gopath/src/github.com/kubernetes-csi/csi-test/pkg/sanity/controller.go:149
STEP: reusing connection to CSI driver at dns:///127.0.0.1:30056
STEP: creating mount and staging directories
...
Ran 53 of 72 Specs in 148.206 seconds
SUCCESS! -- 53 Passed | 0 Failed | 0 Pending | 19 Skipped
PASS
```

Some comments:

* The source code of these tests is in the [`pkg/sanity`
  package](https://github.com/kubernetes-csi/csi-test/tree/master/pkg/sanity).
* How to determine the external IP address of the node depends on the
  cluster. In this example, the cluster was brought up with
  `hack/local-up-cluster.sh` and thus runs on the local host (`127.0.0.1`).
  It uses a port allocated by Kubernetes, obtained above with `kubectl get "services/hostpath-service"`.
  The Kubernetes-CSI CI uses
  [kind](https://kind.sigs.k8s.io/docs/user/quick-start/) and there [a
  Docker
  command](https://github.com/kubernetes-csi/csi-driver-host-path/blob/3488dc7f994e33485629b86b69a6f34ebb7ef2d9/release-tools/prow.sh#L850)
  can be used.
* The create script must print the final directory. Using a
  unique directory for each test case has the advantage that if
  something goes wrong in one test case, others still start with a
  clean slate.
* The "staging directory", aka `NodePublishVolumeRequest.target_path`
  in the CSI spec, must be created and deleted by the CSI driver while
  the CO is responsible for the parent directory. `csi-sanity` handles
  that by creating a directory and then giving the CSI driver that
  directory path with `/target` appended at the end. Kubernetes [got
  this wrong](https://github.com/kubernetes/kubernetes/issues/75535)
  and creates the actual `target_path` directory, so CSI drivers which
  want to work with Kubernetes currently have to be lenient and must
  not fail when that directory already exists.
* The "mount directory" corresponds to
  `NodeStageVolumeRequest.staging_target_path` and really gets created
  by the CO, i.e. `csi-sanity`.

## End-to-end testing

In contrast to `csi-sanity`, end-to-end testing interacts with the CSI
driver through the Kubernetes API, i.e. it simulates operations from a
normal user, like creating a PersistentVolumeClaim. Support for testing external CSI
drivers was
[added](https://github.com/kubernetes/kubernetes/commit/6644db9914379a4a7b3d3487b41b2010f226e4dc#diff-5b2d9461c960bc9b146c4ab3d77bcaa5)
in Kubernetes 1.14.0.

### Installation

For each Kubernetes release, a test tar archive is published. It's not
listed in the release notes (for example, the ones for
[1.16](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.16.md#downloads-for-v1161)),
so one has to know that the full URL is
`https://dl.k8s.io/<version>/kubernetes-test-linux-amd64.tar.gz` (like
for
[v1.16.0](https://dl.k8s.io/v1.16.0/kubernetes-test-linux-amd64.tar.gz)).

These include a `e2e.test` binary for Linux on x86-64. Archives for
other platforms are also available, see [this
KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-testing/20190118-breaking-apart-the-kubernetes-test-tarball.md#proposal). The
`e2e.test` binary is completely self-contained, so one can "install"
it and the [`ginkgo` test runner](https://onsi.github.io/ginkgo/) with:

```
curl --location https://dl.k8s.io/v1.16.0/kubernetes-test-linux-amd64.tar.gz | \
  tar --strip-components=3 -zxf - kubernetes/test/bin/e2e.test kubernetes/test/bin/ginkgo
```

Each `e2e.test` binary contains tests that match the features
available in the corresponding release. In particular, the `[Feature:
xyz]` tags change between releases: they separate tests of alpha
features from tests of non-alpha features. Also, the tests from an
older release might rely on APIs that were removed in more recent
Kubernetes releases. To avoid problems, it's best to simply use the
`e2e.test` binary that matches the Kubernetes release that is used for
testing.

### Usage

Not all features of a CSI driver can be discovered through the
Kubernetes API. Therefore a configuration file in YAML or JSON format
is needed which describes the driver that is to be tested. That file
is used to populate [the driverDefinition
struct](https://github.com/kubernetes/kubernetes/blob/v1.16.0/test/e2e/storage/external/external.go#L142-L211)
and [the DriverInfo
struct](https://github.com/kubernetes/kubernetes/blob/v1.16.0/test/e2e/storage/testsuites/testdriver.go#L139-L185)
that is embedded inside it. For detailed usage instructions of
individual fields refer to these structs.

A word of warning: tests are often only run when setting some fields and the
file parser does not warn about unknown fields, so always check that
the file really matches those structs.

Here is an example that tests the
[`csi-driver-host-path`](https://github.com/kubernetes-csi/csi-driver-host-path):

```
$ cat >test-driver.yaml <<EOF
StorageClass:
  FromName: true
SnapshotClass:
  FromName: true
DriverInfo:
  Name: hostpath.csi.k8s.io
  Capabilities:
    block: true
    controllerExpansion: true
    exec: true
    multipods: true
    persistence: true
    pvcDataSource: true
    snapshotDataSource: true
InlineVolumes:
- Attributes: {}
EOF
```

At a minimum, you need to define the storage class you want to use in
the test, the name of your driver, and what capabilities you want to
test.
As with `csi-sanity`, the driver has to be running in the cluster
before testing it.
The actual `e2e.test` invocation then enables tests for this driver
with `-storage.testdriver` and selects the storage tests for it with
`-ginkgo.focus`:

```
$ ./e2e.test -ginkgo.v \
             -ginkgo.focus='External.Storage' \
             -storage.testdriver=test-driver.yaml
Oct  8 17:17:42.230: INFO: The --provider flag is not set. Continuing as if --provider=skeleton had been used.
I1008 17:17:42.230210  648569 e2e.go:92] Starting e2e run "90b9adb0-a3a2-435f-80e0-640742d56104" on Ginkgo node 1
Running Suite: Kubernetes e2e suite
===================================
Random Seed: 1570547861 - Will randomize all specs
Will run 163 of 5060 specs

Oct  8 17:17:42.237: INFO: >>> kubeConfig: /var/run/kubernetes/admin.kubeconfig
Oct  8 17:17:42.241: INFO: Waiting up to 30m0s for all (but 0) nodes to be schedulable
...
------------------------------
SSSSSSSSSSSSSSSSSSSS
------------------------------
External Storage [Driver: hostpath.csi.k8s.io] [Testpattern: Dynamic PV (filesystem volmode)] multiVolume [Slow] 
  should access to two volumes with different volume mode and retain data across pod recreation on the same node
  /workspace/anago-v1.16.0-rc.2.1+2bd9643cee5b3b/src/k8s.io/kubernetes/_output/dockerized/go/src/k8s.io/kubernetes/test/e2e/storage/testsuites/multivolume.go:191
[BeforeEach] [Testpattern: Dynamic PV (filesystem volmode)] multiVolume [Slow]
...
```

You can use `ginkgo` to run some kinds of test in parallel.
Alpha feature tests or those that by design have to be run
sequentially then need to be run separately:

```
$ ./ginkgo -p -v \
         -focus='External.Storage' \
         -skip='\[Feature:|\[Disruptive\]|\[Serial\]' \
         ./e2e.test \
         -- \
         -storage.testdriver=test-driver.yaml
$ ./ginkgo -v \
         -focus='External.Storage.*(\[Feature:|\[Disruptive\]|\[Serial\])' \
         ./e2e.test \
         -- \
         -storage.testdriver=test-driver.yaml
```

## Getting involved

Both the Kubernetes storage tests and the sanity tests are meant to be
applicable to arbitrary CSI drivers. But perhaps tests are based on
additional assumptions and your driver does not pass the testing
although it complies with the CSI specification. If that happens then
please file issues (links below).

These are open source projects which depend on the help of those
using them, so once a problem has been acknowledged, a pull request
addressing it will be highly welcome.

The same applies to writing new tests. The following searches in the
issue trackers select issues that have been marked specifically as
something that needs someone's help:
- [csi-test](https://github.com/kubernetes-csi/csi-test/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
- [Kubernetes](https://github.com/kubernetes/kubernetes/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3Asig%2Fstorage+)

Happy testing! May the issues it finds be few and easy to fix.
