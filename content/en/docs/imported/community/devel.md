---
title: Kubernetes Developer Guide
---

The developer guide is for anyone wanting to either write code which directly accesses the
Kubernetes API, or to contribute directly to the Kubernetes project.
It assumes some familiarity with concepts in the [User Guide](http://kubernetes.io/docs/user-guide/) and the [Cluster Admin
Guide](http://kubernetes.io/docs/admin/).


## The process of developing and contributing code to the Kubernetes project

* **Contributor Guide**
  ([Please start here](https://github.com/kubernetes/community/tree/master/contributors/guide/README.md)) to learn about how to contribute to Kubernetes

* **GitHub Issues** ([issues.md](https://github.com/kubernetes/community/tree/master/contributors/devel/issues.md)): How incoming issues are triaged.

* **Pull Request Process** ([/contributors/guide/pull-requests.md](https://github.com/kubernetes/community/tree/master/contributors/guide/pull-requests.md)): When and why pull requests are closed.

* **Getting Recent Builds** ([getting-builds.md](https://github.com/kubernetes/community/tree/master/contributors/devel/getting-builds.md)): How to get recent builds including the latest builds that pass CI.

* **Automated Tools** ([automation.md](https://github.com/kubernetes/community/tree/master/contributors/devel/automation.md)): Descriptions of the automation that is running on our github repository.


## Setting up your dev environment, coding, and debugging

* **Development Guide** ([development.md](https://github.com/kubernetes/community/tree/master/contributors/devel/development.md)): Setting up your development environment.

* **Testing** ([testing.md](https://github.com/kubernetes/community/tree/master/contributors/devel/testing.md)): How to run unit, integration, and end-to-end tests in your development sandbox.

* **Hunting flaky tests** ([flaky-tests.md](https://github.com/kubernetes/community/tree/master/contributors/devel/flaky-tests.md)): We have a goal of 99.9% flake free tests.
  Here's how to run your tests many times.

* **Logging Conventions** ([logging.md](https://github.com/kubernetes/community/tree/master/contributors/devel/logging.md)): Glog levels.

* **Profiling Kubernetes** ([profiling.md](https://github.com/kubernetes/community/tree/master/contributors/devel/profiling.md)): How to plug in go pprof profiler to Kubernetes.

* **Instrumenting Kubernetes with a new metric**
  ([instrumentation.md](https://github.com/kubernetes/community/tree/master/contributors/devel/instrumentation.md)): How to add a new metrics to the
  Kubernetes code base.

* **Coding Conventions** ([coding-conventions.md](https://github.com/kubernetes/community/tree/master/contributors/devel/../guide/coding-conventions.md)):
  Coding style advice for contributors.

* **Document Conventions** ([how-to-doc.md](https://github.com/kubernetes/community/tree/master/contributors/devel/how-to-doc.md))
  Document style advice for contributors.

* **Running a cluster locally** ([running-locally.md](https://github.com/kubernetes/community/tree/master/contributors/devel/running-locally.md)):
  A fast and lightweight local cluster deployment for development.

## Developing against the Kubernetes API

* The [REST API documentation](http://kubernetes.io/docs/reference/) explains the REST
  API exposed by apiserver.

* **Annotations** ([Annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)): are for attaching arbitrary non-identifying metadata to objects.
  Programs that automate Kubernetes objects may use annotations to store small amounts of their state.

* **API Conventions** ([api-conventions.md](https://github.com/kubernetes/community/tree/master/contributors/devel/api-conventions.md)):
  Defining the verbs and resources used in the Kubernetes API.

* **API Client Libraries** ([client-libraries.md](https://github.com/kubernetes/community/tree/master/contributors/devel/client-libraries.md)):
  A list of existing client libraries, both supported and user-contributed.


## Writing plugins

* **Authentication** ([Authentication](http://kubernetes.io/docs/admin/authentication/)):
  The current and planned states of authentication tokens.

* **Authorization Plugins** ([Authorization](http://kubernetes.io/docs/admin/authorization/)):
  Authorization applies to all HTTP requests on the main apiserver port.
  This doc explains the available authorization implementations.

* **Admission Control Plugins** ([admission_control](https://github.com/kubernetes/community/tree/master/contributors/design-proposals/api-machinery/admission_control.md))


## Building releases

See the [kubernetes/release](https://github.com/kubernetes/release) repository for details on creating releases and related tools and helper scripts.
