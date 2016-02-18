---
title: "Kubernetes Developer Guide"
---
The developer guide is for anyone wanting to either write code which directly accesses the
Kubernetes API, or to contribute directly to the Kubernetes project.
It assumes some familiarity with concepts in the [User Guide](/{{page.version}}/docs/user-guide/) and the [Cluster Admin
Guide](/{{page.version}}/docs/admin/).


## The process of developing and contributing code to the Kubernetes project

* **On Collaborative Development** ([collab.md](collab)): Info on pull requests and code reviews.

* **GitHub Issues** ([issues.md](issues)): How incoming issues are reviewed and prioritized.

* **Pull Request Process** ([pull-requests.md](pull-requests)): When and why pull requests are closed.

* **Faster PR reviews** ([faster_reviews.md](faster_reviews)): How to get faster PR reviews.

* **Getting Recent Builds** ([getting-builds.md](getting-builds)): How to get recent builds including the latest builds that pass CI.

* **Automated Tools** ([automation.md](automation)): Descriptions of the automation that is running on our github repository.


## Setting up your dev environment, coding, and debugging

* **Development Guide** ([development.md](development)): Setting up your development environment.

* **Hunting flaky tests** ([flaky-tests.md](flaky-tests)): We have a goal of 99.9% flake free tests.
  Here's how to run your tests many times.

* **Logging Conventions** ([logging.md](logging)]: Glog levels.

* **Profiling Kubernetes** ([profiling.md](profiling)): How to plug in go pprof profiler to Kubernetes.

* **Instrumenting Kubernetes with a new metric**
  ([instrumentation.md](instrumentation)): How to add a new metrics to the
  Kubernetes code base.

* **Coding Conventions** ([coding-conventions.md](coding-conventions)):
  Coding style advice for contributors.


## Developing against the Kubernetes API

* API objects are explained at [http://kubernetes.io/third_party/swagger-ui/](http://kubernetes.io/third_party/swagger-ui/).

* **Annotations** ([docs/user-guide/annotations.md](/{{page.version}}/docs/user-guide/annotations)): are for attaching arbitrary non-identifying metadata to objects.
  Programs that automate Kubernetes objects may use annotations to store small amounts of their state.

* **API Conventions** ([api-conventions.md](api-conventions)):
  Defining the verbs and resources used in the Kubernetes API.

* **API Client Libraries** ([client-libraries.md](client-libraries)):
  A list of existing client libraries, both supported and user-contributed.


## Writing plugins

* **Authentication Plugins** ([docs/admin/authentication.md](/{{page.version}}/docs/admin/authentication)):
  The current and planned states of authentication tokens.

* **Authorization Plugins** ([docs/admin/authorization.md](/{{page.version}}/docs/admin/authorization)):
  Authorization applies to all HTTP requests on the main apiserver port.
  This doc explains the available authorization implementations.

* **Admission Control Plugins** ([admission_control](https://github.com/kubernetes/kubernetes/tree/master/docs/design/admission_control.md))


## Building releases

* **Making release notes** ([making-release-notes.md](making-release-notes)): Generating release nodes for a new release.

* **Releasing Kubernetes** ([releasing.md](releasing)): How to create a Kubernetes release (as in version)
  and how the version information gets embedded into the built binaries.



