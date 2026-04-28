---
title: Kubernetes End-to-end Testing for Everyone
date: 2019-03-22
author: >
  Patrick Ohly (Intel)
---

More and more components that used to be part of Kubernetes are now
being developed outside of Kubernetes. For example, storage drivers
used to be compiled into Kubernetes binaries, then were moved into
[stand-alone FlexVolume
binaries](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
on the host, and now are delivered as [Container Storage Interface
(CSI) drivers](https://github.com/container-storage-interface/spec)
that get deployed in pods inside the Kubernetes cluster itself.

This poses a challenge for developers who work on such components: how
can end-to-end (E2E) testing on a Kubernetes cluster be done for such
external components? The E2E framework that is used for testing
Kubernetes itself has all the necessary functionality. However, trying
to use it outside of Kubernetes was difficult and only possible by
carefully selecting the right versions of a large number of
dependencies. E2E testing has become a lot simpler in Kubernetes 1.13.

This blog post summarizes the changes that went into Kubernetes
1.13. For CSI driver developers, it will cover the ongoing effort to
also make the storage tests available for testing of third-party CSI
drivers. How to use them will be shown based on two Intel CSI drivers:

* [Open Infrastructure Manager (OIM)](https://github.com/intel/oim/)
* [PMEM-CSI](https://github.com/intel/pmem-csi)

Testing those drivers was the main motivation behind most of these
enhancements.

## E2E overview

E2E testing consists of several phases:

* Implementing a test suite. This is the main focus of this blog
  post. The Kubernetes E2E framework is written in Go. It relies on
  [Ginkgo](https://onsi.github.io/ginkgo/) for managing tests and
  [Gomega](http://onsi.github.io/gomega/) for assertions. These tools
  support “behavior driven development”, which describes expected
  behavior in “specs”. In this blog post, “test” is used to reference
  an individual `Ginkgo.It` spec. Tests interact with the Kubernetes
  cluster using
  [client-go](https://godoc.org/k8s.io/client-go/kubernetes).
* Bringing up a test cluster. Tools like
  [kubetest](https://github.com/kubernetes/test-infra/blob/master/kubetest/README.md)
  can help here.
* Running an E2E test suite against that cluster. Ginkgo test suites
  can be run with the `ginkgo` tool or as a normal Go test with `go
  test`. Without any parameters, a Kubernetes E2E test suite will
  connect to the default cluster based on environment variables like
  KUBECONFIG, exactly like kubectl. Kubetest also knows how to run the
  Kubernetes E2E suite.

## E2E framework enhancements in Kubernetes 1.13

All of the following enhancements follow the same basic pattern: they
make the E2E framework more useful and easier to use outside of
Kubernetes, without changing the behavior of the original Kubernetes
e2e.test binary.

### Splitting out provider support

The main reason why using the E2E framework from Kubernetes <= 1.12
was difficult were the dependencies on provider-specific SDKs, which
pulled in a large number of packages. Just getting it compiled was
non-trivial.

Many of these packages are only needed for certain tests. For example,
testing the mounting of a pre-provisioned volume must first provision
such a volume the same way as an administrator would, by talking
directly to a specific storage backend via some non-Kubernetes API.

There is an effort to [remove cloud provider-specific
tests](https://github.com/kubernetes/kubernetes/issues/70194) from
core Kubernetes. The approach taken in [PR
#68483](https://github.com/kubernetes/kubernetes/pull/68483) can be
seen as an incremental step towards that goal: instead of ripping out
the code immediately and breaking all tests that depend on it, all
cloud provider-specific code was moved into optional packages under
[test/e2e/framework/providers](https://github.com/kubernetes/kubernetes/tree/release-1.13/test/e2e/framework/providers). The
E2E framework then accesses it via [an
interface](https://github.com/kubernetes/kubernetes/blob/6c1e64b94a3e111199c934c39a0c25bc219ed5f9/test/e2e/framework/provider.go#L79-L99)
that gets implemented separately by each vendor package.

The author of a E2E test suite decides which of these packages get
imported into the test suite. The vendor support is then activated via
the `--provider` command line flag. The Kubernetes e2e.test binary in
1.13 and 1.14 still contains support for the same providers as in
1.12. It is also okay to include no packages, which means that only
the generic providers will be available:

* “skeleton”: cluster is accessed via the Kubernetes API and nothing
  else
* “local”: like “skeleton”, but in addition the scripts in
  kubernetes/kubernetes/cluster can retrieve logs via ssh after a test
  suite is run

### External files

Tests may have to read additional files at runtime, like .yaml
manifests. But the Kubernetes e2e.test binary is supposed to be usable
and entirely stand-alone because that simplifies shipping and running
it. The solution in the Kubernetes build system is to link all files
under `test/e2e/testing-manifests` into the binary with
[go-bindata](https://github.com/jteeuwen/go-bindata). The
E2E framework used to have a hard dependency on the output of
`go-bindata`, now [bindata support is
optional](https://github.com/kubernetes/kubernetes/pull/69103). When
accessing a file via the [testfiles
package](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/e2e/framework/testfiles/testfiles.go),
files will be retrieved from different sources:

* relative to the directory specified with `--repo-root` parameter
* zero or more bindata chunks

### Test parameters

The e2e.test binary takes additional parameters which control test
execution. In 2016, an effort was started to replace all E2E command
line parameters with a Viper configuration file. But that effort
[stalled](https://github.com/kubernetes/kubernetes/blob/0ed33881dc4355495f623c6f22e7dd0b7632b7c0/test/e2e/framework/test_context.go#L318-L319
), which left developers without clear guidance how they should handle
test-specific parameters.

The approach in v1.12 was to add all flags to the central
[test/e2e/framework/test_context.go](https://github.com/kubernetes/kubernetes/blob/v1.12.0/test/e2e/framework/test_context.go),
which does not work for tests developed independently from the
framework.  Since [PR
#69105](https://github.com/kubernetes/kubernetes/pull/69105) the
recommendation has been to use the normal `flag` package to
define its parameters, in its own source code. Flag names must be
hierarchical with dots separating different levels, for example
`my.test.parameter`, and must be unique. Uniqueness is enforced by the
`flag` package which panics when registering a flag a second time. The
new
[config](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/e2e/framework/config/config.go)
package simplifies the definition of multiple options, which are
stored in a single struct.

To summarize, this is how parameters are handled now:

* The init code in test packages defines tests and parameters. The
  actual parameter *values* are not available yet, so test definitions
  cannot use them.
* The init code of the test suite parses parameters and (optionally)
  the configuration file.
* The tests run and now can use parameter values.

However, recently it [was pointed
out](https://github.com/kubernetes/kubernetes/pull/69105#discussion_r267960062)
that it is desirable and was possible to not expose test settings as
command line flags and only set them via a configuration file. There
is an [open bug](https://github.com/kubernetes/kubernetes/issues/75590) and a
[pending PR](https://github.com/kubernetes/kubernetes/pull/75593)
about this.

Viper support has been enhanced. Like the provider support, it is
completely optional. It gets pulled into a e2e.test binary by
importing the `viperconfig` package and [calling
it](https://github.com/kubernetes/kubernetes/blob/ddf47ac13c1a9483ea035a79cd7c10005ff21a6d/test/e2e/e2e_test.go#L49-L57)
after parsing the normal command line flags. This has been implemented
so that all variables which can be set via command line flags are also
set when the flag appears in a Viper config file. For example, the
Kubernetes v1.13 `e2e.test` binary accepts
`--viper-config=/tmp/my-config.yaml` and that file will set the
`my.test.parameter` to `value` when it has this content: my: test:
parameter: value

In older Kubernetes releases, that option could only load a file from
the current directory, the suffix had to be left out, and only a few
parameters actually could be set this way. Beware that one limitation
of Viper still exists: it works by matching config file entries
against known flags, without warning about unknown config file entries
and thus leaving typos undetected. A [better config file
parser](https://github.com/kubernetes/kubeadm/issues/1040) for
Kubernetes is still work in progress.

### Creating items from .yaml manifests

In Kubernetes 1.12, there was some support for loading individual
items from a .yaml file, but then creating that item had to be done by
hand-written code. Now the framework has [new
methods](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/e2e/framework/create.go)
for loading a .yaml file that has multiple items, patching those items
(for example, setting the namespace created for the current test), and
creating them.  This is currently [used to deploy CSI
drivers](https://github.com/kubernetes/kubernetes/blob/ddf47ac13c1a9483ea035a79cd7c10005ff21a6d/test/e2e/storage/drivers/csi.go#L192-L209
) anew for each test from exactly the same .yaml files that are also
used for deployment via kubectl. If the CSI driver supports running
under different names, then tests are completely independent and can
run in parallel.

However, redeploying a driver slows down test execution and it does
not cover concurrent operations against the driver. A more realistic
test scenario is to deploy a driver once when bringing up the test
cluster, then run all tests against that deployment. Eventually the
Kubernetes E2E testing will move to that model, once it is clearer how
test cluster bringup can be extended such that it also includes
installing additional entities like CSI drivers.

## Upcoming enhancements in Kubernetes 1.14

### Reusing storage tests

Being able to use the framework outside of Kubernetes enables building
a custom test suite. But a test suite without tests is still
useless. Several of the existing tests, in particular for storage, can
also be applied to out-of-tree components. Thanks to the work done by
Masaki Kimura, [storage
tests](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/e2e/storage/testsuites)
in Kubernetes 1.13 are defined such that they can be instantiated
multiple times for different drivers.

But history has a habit of repeating itself. As with providers, the
package defining these tests also pulled in driver definitions for all
in-tree storage backends, which in turn pulled in more additional
packages than were needed. This has been
[fixed](https://github.com/kubernetes/kubernetes/pull/70862) for the
upcoming Kubernetes 1.14.

### Skipping unsupported tests

Some of the storage tests depend on features of the cluster (like
running on a host that supports XFS) or of the driver (like supporting
block volumes). These conditions are checked while the test runs,
leading to skipped tests when they are not satisfied. The good thing
is that this records an explanation why the test did not run.

Starting a test is slow, in particular when it must first deploy the
CSI driver, but also in other scenarios. Creating the namespace for a
test has been measured at 5 seconds on a fast cluster, and it produces
a lot of noisy test output. It would have been possible to address
that by [skipping the definition of unsupported
tests](https://github.com/kubernetes/kubernetes/pull/70992), but then
reporting why a test isn’t even part of the test suite becomes
tricky. This approach has been dropped in favor of reorganizing the
storage test suite such that it [first checks
conditions](https://github.com/kubernetes/kubernetes/pull/72434)
before doing the more expensive test setup steps.

### More readable test definitions

The same PR also rewrites the tests to operate like conventional
Ginkgo tests, with test cases and their local variables in [a single
function](https://github.com/pohly/kubernetes/blob/ec3655a1d40ced6b1873e627b736aae1cf242477/test/e2e/storage/testsuites/provisioning.go#L82).

### Testing external drivers

Building a custom E2E test suite is still quite a bit of work. The
e2e.test binary that will get distributed in the [Kubernetes 1.14 test
archive](https://dl.k8s.io/v1.14.0/kubernetes-test.tar.gz) will have
the [ability to
test](https://github.com/kubernetes/kubernetes/pull/72836) already
installed storage drivers without rebuilding the test suite. See this
[README](https://github.com/pohly/kubernetes/blob/6644db9914379a4a7b3d3487b41b2010f226e4dc/test/e2e/storage/external/README.md)
for further instructions.

## E2E test suite HOWTO

### Test suite initialization

The first step is to set up the necessary boilerplate code that
defines the test suite. [In Kubernetes
E2E](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/e2e),
this is done in the `e2e.go` and `e2e_test.go` files. It could also be
done in a single `e2e_test.go` file. Kubernetes imports all of the
various providers, in-tree tests, Viper configuration support, and
bindata file lookup in `e2e_test.go`. `e2e.go` controls the actual
execution, including some cluster preparations and metrics collection.

A simpler starting point are the `e2e_[test].go` files [from
PMEM-CSI](https://github.com/intel/pmem-csi/tree/586ae281ac2810cb4da6f1e160cf165c7daf0d80/test/e2e). It
doesn’t use any providers, no Viper, no bindata, and imports just the
storage tests.

Like PMEM-CSI, OIM drops all of the extra features, but is a bit more
complex because it integrates a custom cluster startup directly into
the [test
suite](https://github.com/intel/pmem-csi/blob/a7b0d66b59771bf615e07fcd3d4f0ba08cfdf90f/test/e2e/e2e.go),
which was useful in this case because some additional components have
to run on the host side. By running them directly in the E2E binary,
interactive debugging with `dlv` becomes easier.

Both CSI drivers follow the Kubernetes example and use the `test/e2e`
directory for their test suites, but any other directory and other
file names would also work.

### Adding E2E storage tests

Tests are defined by packages that get imported into a test suite. The
only thing specific to E2E tests is that they instantiate a
`framework.Framework` pointer (usually called `f`) with
`framework.NewDefaultFramework`. This variable gets initialized anew
in a `BeforeEach` for each test and freed in an `AfterEach`. It has a
`f.ClientSet` and `f.Namespace` at runtime (and only at runtime!)
which can be used by a test.

The [PMEM-CSI storage
test](https://github.com/intel/pmem-csi/blob/devel/test/e2e/storage/csi_volumes.go#L51)
imports the Kubernetes storage test suite and sets up one instance of
the provisioning tests for a PMEM-CSI driver which must be already
installed in the test cluster. The storage test suite changes the
storage class to run tests with different filesystem types. Because of
this requirement, the storage class is created from a .yaml file.

Explaining all the various utility methods available in the framework
is out of scope for this blog post. Reading existing tests and the
source code of the framework is a good way to get started.

### Vendoring 

Vendoring Kubernetes code is still not trivial, even after eliminating
many of the unnecessary dependencies. `k8s.io/kubernetes` is not meant
to be included in other projects and does not define its dependencies
in a way that is understood by tools like `dep`. The other `k8s.io`
packages are meant to be included, but [don’t follow semantic
versioning
yet](https://github.com/kubernetes/kubernetes/issues/72638) or don’t
tag any releases (`k8s.io/kube-openapi`, `k8s.io/utils`).

PMEM-CSI uses [dep](https://golang.github.io/dep/). It’s
[Gopkg.toml](https://github.com/intel/pmem-csi/blob/0ad8251c064b1010c91e7fc1dd423b95d5594bba/Gopkg.toml)
file is a good starting point. It enables pruning (not enabled in dep
by default) and locks certain projects onto versions that are
compatible with the Kubernetes version that is used. When `dep`
doesn’t pick a compatible version, then checking Kubernetes’
[Godeps.json](https://github.com/kubernetes/kubernetes/blob/master/Godeps/Godeps.json)
helps to determine which revision might be the right one.

### Compiling and running the test suite

`go test ./test/e2e -args -help` is the fastest way to test that the
test suite compiles.

Once it does compile and a cluster has been set up, the command `go
test -timeout=0 -v ./test/e2e -ginkgo.v` runs all tests. In order to
run tests in parallel, use the `ginkgo -p ./test/e2e` command instead.

## Getting involved

The Kubernetes E2E framework is owned by the testing-commons
sub-project in
[SIG-testing](https://github.com/kubernetes/community/tree/master/sig-testing). See
that page for contact information.

There are various tasks that could be worked on, including but not
limited to:

* Moving test/e2e/framework into a staging repo and restructuring it
  so that it is more modular
  ([#74352](https://github.com/kubernetes/kubernetes/issues/74352)).
* Simplifying `e2e.go` by moving more of its code into
  `test/e2e/framework`
  ([#74353](https://github.com/kubernetes/kubernetes/issues/74353)).
* Removing provider-specific code from the Kubernetes E2E test suite
  ([#70194](https://github.com/kubernetes/kubernetes/issues/70194)).

Special thanks to the reviewers of this article:

- Olev Kartau (https://github.com/okartau)
- Mary Camp (https://github.com/MCamp859)
