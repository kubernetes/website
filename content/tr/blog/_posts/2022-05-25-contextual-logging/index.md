---
layout: blog
title: "Contextual Logging in Kubernetes 1.24"
date: 2022-05-25
slug: contextual-logging
canonicalUrl: https://kubernetes.dev/blog/2022/05/25/contextual-logging/
author: >
   Patrick Ohly (Intel)
---

The [Structured Logging Working
Group](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md)
has added new capabilities to the logging infrastructure in Kubernetes
1.24. This blog post explains how developers can take advantage of those to
make log output more useful and how they can get involved with improving Kubernetes.

## Structured logging

The goal of [structured
logging](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/1602-structured-logging/README.md)
is to replace C-style formatting and the resulting opaque log strings with log
entries that have a well-defined syntax for storing message and parameters
separately, for example as a JSON struct.

When using the traditional klog text output format for structured log calls,
strings were originally printed with `\n` escape sequences, except when
embedded inside a struct. For structs, log entries could still span multiple
lines, with no clean way to split the log stream into individual entries:

```
I1112 14:06:35.783529  328441 structured_logging.go:51] "using InfoS" longData={Name:long Data:Multiple
lines
with quite a bit
of text. internal:0}
I1112 14:06:35.783549  328441 structured_logging.go:52] "using InfoS with\nthe message across multiple lines" int=1 stringData="long: Multiple\nlines\nwith quite a bit\nof text." str="another value"
```

Now, the `<` and `>` markers along with indentation are used to ensure that splitting at a
klog header at the start of a line is reliable and the resulting output is human-readable:

```
I1126 10:31:50.378204  121736 structured_logging.go:59] "using InfoS" longData=<
	{Name:long Data:Multiple
	lines
	with quite a bit
	of text. internal:0}
 >
I1126 10:31:50.378228  121736 structured_logging.go:60] "using InfoS with\nthe message across multiple lines" int=1 stringData=<
	long: Multiple
	lines
	with quite a bit
	of text.
 > str="another value"
```

Note that the log message itself is printed with quoting. It is meant to be a
fixed string that identifies a log entry, so newlines should be avoided there.

Before Kubernetes 1.24, some log calls in kube-scheduler still used `klog.Info`
for multi-line strings to avoid the unreadable output. Now all log calls have
been updated to support structured logging.

## Contextual logging

[Contextual logging](https://github.com/kubernetes/enhancements/blob/master/keps/sig-instrumentation/3077-contextual-logging/README.md)
is based on the [go-logr API](https://github.com/go-logr/logr#a-minimal-logging-api-for-go). The key
idea is that libraries are passed a logger instance by their caller and use
that for logging instead of accessing a global logger. The binary decides about
the logging implementation, not the libraries. The go-logr API is designed
around structured logging and supports attaching additional information to a
logger.

This enables additional use cases:

- The caller can attach additional information to a logger:
  - [`WithName`](https://pkg.go.dev/github.com/go-logr/logr#Logger.WithName) adds a prefix
  - [`WithValues`](https://pkg.go.dev/github.com/go-logr/logr#Logger.WithValues) adds key/value pairs

  When passing this extended logger into a function and a function uses it
  instead of the global logger, the additional information is
  then included in all log entries, without having to modify the code that
  generates the log entries. This is useful in highly parallel applications
  where it can become hard to identify all log entries for a certain operation
  because the output from different operations gets interleaved.

- When running unit tests, log output can be associated with the current test.
  Then when a test fails, only the log output of the failed test gets shown
  by `go test`. That output can also be more verbose by default because it
  will not get shown for successful tests. Tests can be run in parallel
  without interleaving their output.

One of the design decisions for contextual logging was to allow attaching a
logger as value to a `context.Context`. Since the logger encapsulates all
aspects of the intended logging for the call, it is *part* of the context and
not just *using* it. A practical advantage is that many APIs already have a
`ctx` parameter or adding one has additional advantages, like being able to get
rid of `context.TODO()` calls inside the functions.

Another decision was to not break compatibility with klog v2:

- Libraries that use the traditional klog logging calls in a binary that has
  set up contextual logging will work and log through the logging backend
  chosen by the binary. However, such log output will not include the
  additional information and will not work well in unit tests, so libraries
  should be modified to support contextual logging. The [migration guide](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/migration-to-structured-logging.md)
  for structured logging has been extended to also cover contextual logging.

- When a library supports contextual logging and retrieves a logger from its
  context, it will still work in a binary that does not initialize contextual
  logging because it will get a logger that logs through klog.

In Kubernetes 1.24, contextual logging is a new alpha feature with
`ContextualLogging` as feature gate. When disabled (the default), the new klog
API calls for contextual logging (see below) become no-ops to avoid performance
or functional regressions.

No Kubernetes component has been converted yet. An [example program](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go)
in the Kubernetes repository demonstrates how to enable contextual logging in a
binary and how the output depends on the binary's parameters:

```console
$ cd $GOPATH/src/k8s.io/kubernetes/staging/src/k8s.io/component-base/logs/example/cmd/
$ go run . --help
...
      --feature-gates mapStringBool  A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                     AllAlpha=true|false (ALPHA - default=false)
                                     AllBeta=true|false (BETA - default=false)
                                     ContextualLogging=true|false (ALPHA - default=false)
$ go run . --feature-gates ContextualLogging=true
...
I0404 18:00:02.916429  451895 logger.go:94] "example/myname: runtime" foo="bar" duration="1m0s"
I0404 18:00:02.916447  451895 logger.go:95] "example: another runtime" foo="bar" duration="1m0s"
```

The `example` prefix and `foo="bar"` were added by the caller of the function
which logs the `runtime` message and `duration="1m0s"` value.

The sample code for klog includes an
[example](https://github.com/kubernetes/klog/blob/v2.60.1/ktesting/example/example_test.go)
for a unit test with per-test output.

## klog enhancements

### Contextual logging API

The following calls manage the lookup of a logger:

[`FromContext`](https://pkg.go.dev/k8s.io/klog/v2#FromContext)
: from a `context` parameter, with fallback to the global logger

[`Background`](https://pkg.go.dev/k8s.io/klog/v2#Background)
: the global fallback, with no intention to support contextual logging

[`TODO`](https://pkg.go.dev/k8s.io/klog/v2#TODO)
: the global fallback, but only as a temporary solution until the function gets extended to accept
  a logger through its parameters

[`SetLoggerWithOptions`](https://pkg.go.dev/k8s.io/klog/v2#SetLoggerWithOptions)
: changes the fallback logger; when called with [`ContextualLogger(true)`](https://pkg.go.dev/k8s.io/klog/v2#ContextualLogger),
  the logger is ready to be called directly, in which case logging will be done
  without going through klog

To support the feature gate mechanism in Kubernetes, klog has wrapper calls for
the corresponding go-logr calls and a global boolean controlling their behavior:

- [`LoggerWithName`](https://pkg.go.dev/k8s.io/klog/v2#LoggerWithName)
- [`LoggerWithValues`](https://pkg.go.dev/k8s.io/klog/v2#LoggerWithValues)
- [`NewContext`](https://pkg.go.dev/k8s.io/klog/v2#NewContext)
- [`EnableContextualLogging`](https://pkg.go.dev/k8s.io/klog/v2#EnableContextualLogging)

Usage of those functions in Kubernetes code is enforced with a linter
check. The klog default for contextual logging is to enable the functionality
because it is considered stable in klog. It is only in Kubernetes binaries
where that default gets overridden and (in some binaries) controlled via the
`--feature-gate` parameter.

### ktesting logger

The new [ktesting](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/ktesting) package
implements logging through `testing.T` using klog's text output format. It has
a [single API call](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/ktesting#NewTestContext) for
instrumenting a test case and [support for command line flags](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/ktesting/init).

### klogr

[`klog/klogr`](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/klogr) continues to be
supported and it's default behavior is unchanged: it formats structured log
entries using its own, custom format and prints the result via klog.

However, this usage is discouraged because that format is neither
machine-readable (in contrast to real JSON output as produced by zapr, the
go-logr implementation used by Kubernetes) nor human-friendly (in contrast to
the klog text format).

Instead, a klogr instance should be created with
[`WithFormat(FormatKlog)`](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/klogr#WithFormat)
which chooses the klog text format. A simpler construction method with the same
result is the new
[`klog.NewKlogr`](https://pkg.go.dev/k8s.io/klog/v2#NewKlogr). That is the
logger that klog returns as fallback when nothing else is configured.

### Reusable output test

A lot of go-logr implementations have very similar unit tests where they check
the result of certain log calls. If a developer didn't know about certain
caveats like for example a `String` function that panics when called, then it
is likely that both the handling of such caveats and the unit test are missing.

[`klog.test`](https://pkg.go.dev/k8s.io/klog/v2@v2.60.1/test) is a reusable set
of test cases that can be applied to a go-logr implementation.

### Output flushing

klog used to start a goroutine unconditionally during `init` which flushed
buffered data at a hard-coded interval. Now that goroutine is only started on
demand (i.e. when writing to files with buffering) and can be controlled with
[`StopFlushDaemon`](https://pkg.go.dev/k8s.io/klog/v2#StopFlushDaemon) and
[`StartFlushDaemon`](https://pkg.go.dev/k8s.io/klog/v2#StartFlushDaemon).

When a go-logr implementation buffers data, flushing that data can be
integrated into [`klog.Flush`](https://pkg.go.dev/k8s.io/klog/v2#Flush) by
registering the logger with the
[`FlushLogger`](https://pkg.go.dev/k8s.io/klog/v2#FlushLogger) option.

### Various other changes

For a description of all other enhancements see in the [release notes](https://github.com/kubernetes/klog/releases).

## logcheck

Originally designed as a linter for structured log calls, the
 [`logcheck`](https://github.com/kubernetes/klog/tree/788efcdee1e9be0bfbe5b076343d447314f2377e/hack/tools/logcheck)
tool has been enhanced to support also contextual logging and traditional klog
log calls. These enhanced checks already found bugs in Kubernetes, like calling
`klog.Info` instead of `klog.Infof` with a format string and parameters.

It can be included as a plugin in a `golangci-lint` invocation, which is how
[Kubernetes uses it now](https://github.com/kubernetes/kubernetes/commit/17e3c555c5115f8c9176bae10ba45baa04d23a7b),
or get invoked stand-alone.

We are in the process of [moving the tool](https://github.com/kubernetes/klog/issues/312) into a new repository because it isn't
really related to klog and its releases should be tracked and tagged properly.

## Next steps

The [Structured Logging WG](https://github.com/kubernetes/community/tree/master/wg-structured-logging)
is always looking for new contributors. The migration
away from C-style logging is now going to target structured, contextual logging
in one step to reduce the overall code churn and number of PRs. Changing log
calls is good first contribution to Kubernetes and an opportunity to get to
know code in various different areas.
