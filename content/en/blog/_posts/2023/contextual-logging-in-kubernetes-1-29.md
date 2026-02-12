---
layout: blog
title: "Contextual logging in Kubernetes 1.29: Better troubleshooting and enhanced logging"
slug: contextual-logging-in-kubernetes-1-29
date: 2023-12-20T09:30:00-08:00
canonicalUrl: https://www.kubernetes.dev/blog/2023/12/20/contextual-logging/
author: >
  [Mengjiao Liu](https://github.com/mengjiao-liu/) (DaoCloud), 
  [Patrick Ohly](https://github.com/pohly) (Intel)
---

On behalf of the [Structured Logging Working Group](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md) 
and [SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation#readme), 
we are pleased to announce that the contextual logging feature
introduced in Kubernetes v1.24 has now been successfully migrated to
two components (kube-scheduler and kube-controller-manager)
as well as some directories. This feature aims to provide more useful logs 
for better troubleshooting of Kubernetes and to empower developers to enhance Kubernetes.

## What is contextual logging?

[Contextual logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
is based on the [go-logr](https://github.com/go-logr/logr#a-minimal-logging-api-for-go) API. 
The key idea is that libraries are passed a logger instance by their caller
and use that for logging instead of accessing a global logger.
The binary decides the logging implementation, not the libraries.
The go-logr API is designed around structured logging and supports attaching
additional information to a logger.

This enables additional use cases:

- The caller can attach additional information to a logger:
  - [WithName](<https://pkg.go.dev/github.com/go-logr/logr#Logger.WithName>) adds a "logger" key with the names concatenated by a dot as value
  - [WithValues](<https://pkg.go.dev/github.com/go-logr/logr#Logger.WithValues>) adds key/value pairs

  When passing this extended logger into a function, and the function uses it
  instead of the global logger, the additional information is then included 
  in all log entries, without having to modify the code that generates the log entries. 
  This is useful in highly parallel applications where it can become hard to identify 
  all log entries for a certain operation, because the output from different operations gets interleaved.

- When running unit tests, log output can be associated with the current test.
  Then, when a test fails, only the log output of the failed test gets shown by go test.
  That output can also be more verbose by default because it will not get shown for successful tests.
  Tests can be run in parallel without interleaving their output.

One of the design decisions for contextual logging was to allow attaching a logger as value to a `context.Context`.
Since the logger encapsulates all aspects of the intended logging for the call,
it is *part* of the context, and not just *using* it. A practical advantage is that many APIs
already have a `ctx` parameter or can add one. This provides additional advantages, like being able to
get rid of `context.TODO()` calls inside the functions.

## How to use it

The contextual logging feature is alpha starting from Kubernetes v1.24,
so it requires the `ContextualLogging` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to be enabled.
If you want to test the feature while it is alpha, you need to enable this feature gate
on the `kube-controller-manager` and the `kube-scheduler`.

For the `kube-scheduler`, there is one thing to note, in addition to enabling 
the `ContextualLogging` feature gate, instrumentation also depends on log verbosity.
To avoid slowing down the scheduler with the logging instrumentation for contextual logging added for 1.29,
it is important to choose carefully when to add additional information:
- At `-v3` or lower, only `WithValues("pod")` is used once per scheduling cycle.
  This has the intended effect that all log messages for the cycle include the pod information. 
  Once contextual logging is GA, "pod" key/value pairs can be removed from all log calls.
- At `-v4` or higher, richer log entries get produced where `WithValues` is also used for the node (when applicable)
  and `WithName` is used for the current operation and plugin.

Here is an example that demonstrates the effect:
> I1113 08:43:37.029524   87144 default_binder.go:53] "Attempting to bind pod to node" **logger="Bind.DefaultBinder"** **pod**="kube-system/coredns-69cbfb9798-ms4pq" **node**="127.0.0.1"

The immediate benefit is that the operation and plugin name are visible in `logger`.
`pod` and `node` are already logged as parameters in individual log calls in `kube-scheduler` code.
Once contextual logging is supported by more packages outside of `kube-scheduler`, 
they will also be visible there (for example, client-go). Once it is GA,
log calls can be simplified to avoid repeating those values.

In `kube-controller-manager`, `WithName` is used to add the user-visible controller name to log output, 
for example:

> I1113 08:43:29.284360   87141 graph_builder.go:285] "garbage controller monitor not synced: no monitors" **logger="garbage-collector-controller"**

The `logger=”garbage-collector-controller”` was added by the `kube-controller-manager` core
when instantiating that controller and appears in all of its log entries - at least as long as the code
that it calls supports contextual logging. Further work is needed to convert shared packages like client-go.

## Performance impact

Supporting contextual logging in a package, i.e. accepting a logger from a caller, is cheap. 
No performance impact was observed for the `kube-scheduler`. As noted above, 
adding `WithName` and `WithValues` needs to be done more carefully.

In Kubernetes 1.29, enabling contextual logging at production verbosity (`-v3` or lower)
caused no measurable slowdown for the `kube-scheduler` and is not expected for the `kube-controller-manager` either.
At debug levels, a 28% slowdown for some test cases is still reasonable given that the resulting logs make debugging easier. 
For details, see the [discussion around promoting the feature to beta](https://github.com/kubernetes/enhancements/pull/4219#issuecomment-1807811995).

## Impact on downstream users
Log output is not part of the Kubernetes API and changes regularly in each release,
whether it is because developers work on the code or because of the ongoing conversion
to structured and contextual logging.

If downstream users have dependencies on specific logs, 
they need to be aware of how this change affects them.

## Further reading

- Read the [Contextual Logging in Kubernetes 1.24](https://www.kubernetes.dev/blog/2022/05/25/contextual-logging/) article.
- Read the [KEP-3077: contextual logging](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging).

## Get involved

If you're interested in getting involved, we always welcome new contributors to join us.
Contextual logging provides a fantastic opportunity for you to contribute to Kubernetes development and make a meaningful impact.
By joining [Structured Logging WG](https://github.com/kubernetes/community/tree/master/wg-structured-logging),
you can actively participate in the development of Kubernetes and make your first contribution.
It's a great way to learn and engage with the community while gaining valuable experience.

We encourage you to explore the repository and familiarize yourself with the ongoing discussions and projects. 
It's a collaborative environment where you can exchange ideas, ask questions, and work together with other contributors.

If you have any questions or need guidance, don't hesitate to reach out to us 
and you can do so on our [public Slack channel](https://kubernetes.slack.com/messages/wg-structured-logging). 
If you're not already part of that Slack workspace, you can visit [https://slack.k8s.io/](https://slack.k8s.io/)
for an invitation.

We would like to express our gratitude to all the contributors who provided excellent reviews, 
shared valuable insights, and assisted in the implementation of this feature (in alphabetical order):

- Aldo Culquicondor ([alculquicondor](https://github.com/alculquicondor))
- Andy Goldstein ([ncdc](https://github.com/ncdc))
- Feruzjon Muyassarov ([fmuyassarov](https://github.com/fmuyassarov))
- Freddie ([freddie400](https://github.com/freddie400))
- JUN YANG ([yangjunmyfm192085](https://github.com/yangjunmyfm192085))
- Kante Yin ([kerthcet](https://github.com/kerthcet))
- Kiki ([carlory](https://github.com/carlory))
- Lucas Severo Alve ([knelasevero](https://github.com/knelasevero))
- Maciej Szulik ([soltysh](https://github.com/soltysh))
- Mengjiao Liu ([mengjiao-liu](https://github.com/mengjiao-liu))
- Naman Lakhwani ([Namanl2001](https://github.com/Namanl2001))
- Oksana Baranova ([oxxenix](https://github.com/oxxenix))
- Patrick Ohly ([pohly](https://github.com/pohly))
- songxiao-wang87 ([songxiao-wang87](https://github.com/songxiao-wang87))
- Tim Allclai ([tallclair](https://github.com/tallclair))
- ZhangYu ([Octopusjust](https://github.com/Octopusjust))
- Ziqi Zhao ([fatsheep9146](https://github.com/fatsheep9146))
- Zac ([249043822](https://github.com/249043822))
