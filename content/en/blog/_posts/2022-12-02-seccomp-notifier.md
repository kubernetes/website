---
layout: blog
title: "Finding suspicious syscalls with the seccomp notifier"
date: 2022-12-02
slug: seccomp-notifier
author: >
  Sascha Grunert
---

Debugging software in production is one of the biggest challenges we have to
face in our containerized environments. Being able to understand the impact of
the available security options, especially when it comes to configuring our
deployments, is one of the key aspects to make the default security in
Kubernetes stronger. We have all those logging, tracing and metrics data already
at hand, but how do we assemble the information they provide into something
human readable and actionable?

[Seccomp][seccomp] is one of the standard mechanisms to protect a Linux based
Kubernetes application from malicious actions by interfering with its [system
calls][syscalls]. This allows us to restrict the application to a defined set of
actionable items, like modifying files or responding to HTTP requests. Linking
the knowledge of which set of syscalls is required to, for example, modify a
local file, to the actual source code is in the same way non-trivial. Seccomp
profiles for Kubernetes have to be written in [JSON][json] and can be understood
as an architecture specific allow-list with superpowers, for example:

[seccomp]: https://en.wikipedia.org/wiki/Seccomp
[syscalls]: https://en.wikipedia.org/wiki/Syscall
[json]: https://www.json.org

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 38,
  "defaultErrno": "ENOSYS",
  "syscalls": [
    {
      "names": ["chmod", "chown", "open", "write"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

The above profile errors by default specifying the `defaultAction` of
`SCMP_ACT_ERRNO`. This means we have to allow a set of syscalls via
`SCMP_ACT_ALLOW`, otherwise the application would not be able to do anything at
all. Okay cool, for being able to allow file operations, all we have to do is
adding a bunch of file specific syscalls like `open` or `write`, and probably
also being able to change the permissions via `chmod` and `chown`, right?
Basically yes, but there are issues with the simplicity of that approach:

Seccomp profiles need to include the minimum set of syscalls required to start
the application. This also includes some syscalls from the lower level
[Open Container Initiative (OCI)][oci] container runtime, for example
[runc][runc] or [crun][crun]. Beside that, we can only guarantee the required
syscalls for a very specific version of the runtimes and our application,
because the code parts can change between releases. The same applies to the
termination of the application as well as the target architecture we're
deploying on. Features like executing commands within containers also require
another subset of syscalls. Not to mention that there are multiple versions for
syscalls doing slightly different things and the seccomp profiles are able to
modify their arguments. It's also not always clearly visible to the developers
which syscalls are used by their own written code parts, because they rely on
programming language abstractions or frameworks.

[oci]: https://opencontainers.org
[runc]: https://github.com/opencontainers/runc
[crun]: https://github.com/containers/crun

_How can we know which syscalls are even required then? Who should create and
maintain those profiles during its development life-cycle?_

Well, recording and distributing seccomp profiles is one of the problem domains
of the [Security Profiles Operator][spo], which is already solving that. The
operator is able to record [seccomp][seccomp], [SELinux][selinux] and even
[AppArmor][apparmor] profiles into a [Custom Resource Definition (CRD)][crd],
reconciles them to each node and makes them available for usage.

[spo]: https://github.com/kubernetes-sigs/security-profiles-operator
[selinux]: https://en.wikipedia.org/wiki/Security-Enhanced_Linux
[apparmor]: https://en.wikipedia.org/wiki/AppArmor
[crd]: https://k8s.io/docs/concepts/extend-kubernetes/api-extension/custom-resources

The biggest challenge about creating security profiles is to catch all code
paths which execute syscalls. We could achieve that by having **100%** logical
coverage of the application when running an end-to-end test suite. You get the
problem with the previous statement: It's too idealistic to be ever fulfilled,
even without taking all the moving parts during application development and
deployment into account.

Missing a syscall in the seccomp profiles' allow list can have tremendously
negative impact on the application. It's not only that we can encounter crashes,
which are trivially detectable. It can also happen that they slightly change
logical paths, change the business logic, make parts of the application
unusable, slow down performance or even expose security vulnerabilities. We're
simply not able to see the whole impact of that, especially because blocked
syscalls via `SCMP_ACT_ERRNO` do not provide any additional [audit][audit]
logging on the system.

[audit]: https://linux.die.net/man/8/auditd

Does that mean we're lost? Is it just not realistic to dream about a Kubernetes
where [everyone uses the default seccomp profile][seccomp-default]? Should we
stop striving towards maximum security in Kubernetes and accept that it's not
meant to be secure by default?

[seccomp-default]: https://github.com/kubernetes/enhancements/issues/2413

**Definitely not.** Technology evolves over time and there are many folks
working behind the scenes of Kubernetes to indirectly deliver features to
address such problems. One of the mentioned features is the _seccomp notifier_,
which can be used to find suspicious syscalls in Kubernetes.

The seccomp notify feature consists of a set of changes introduced in Linux 5.9.
It makes the kernel capable of communicating seccomp related events to the user
space. That allows applications to act based on the syscalls and opens for a
wide range of possible use cases. We not only need the right kernel version,
but also at least runc v1.1.0 (or crun v0.19) to be able to make the notifier
work at all. The Kubernetes container runtime [CRI-O][cri-o] gets [support for
the seccomp notifier in v1.26.0][cri-o-notifier]. The new feature allows us to
identify possibly malicious syscalls in our application, and therefore makes it
possible to verify profiles for consistency and completeness. Let's give that a
try.

[cri-o]: https://cri-o.io
[cri-o-notifier]: https://github.com/cri-o/cri-o/pull/6120

First of all we need to run the latest `main` version of CRI-O, because v1.26.0
has not been released yet at time of writing. You can do that by either
compiling it from the [source code][sources] or by using the pre-built binary
bundle via [the get-script][script]. The seccomp notifier feature of CRI-O is
guarded by an annotation, which has to be explicitly allowed, for example by
using a configuration drop-in like this:

```console
> cat /etc/crio/crio.conf.d/02-runtimes.conf
```

```toml
[crio.runtime]
default_runtime = "runc"

[crio.runtime.runtimes.runc]
allowed_annotations = [ "io.kubernetes.cri-o.seccompNotifierAction" ]
```

[sources]: https://github.com/cri-o/cri-o/blob/main/install.md#build-and-install-cri-o-from-source
[script]: https://github.com/cri-o/cri-o#installing-cri-o

If CRI-O is up and running, then it should indicate that the seccomp notifier is
available as well:

```console
> sudo ./bin/crio --enable-metrics
…
INFO[…] Starting seccomp notifier watcher
INFO[…] Serving metrics on :9090 via HTTP
…
```

We also enable the metrics, because they provide additional telemetry data about
the notifier. Now we need a running Kubernetes cluster for demonstration
purposes. For this demo, we mainly stick to the
[`hack/local-up-cluster.sh`][local-up] approach to locally spawn a single node
Kubernetes cluster.

[local-up]: https://github.com/cri-o/cri-o#running-kubernetes-with-cri-o

If everything is up and running, then we would have to define a seccomp profile
for testing purposes. But we do not have to create our own, we can just use the
`RuntimeDefault` profile which gets shipped with each container runtime. For
example the `RuntimeDefault` profile for CRI-O can be found in the
[containers/common][runtime-default] library.

[runtime-default]: https://github.com/containers/common/blob/afff1d6/pkg/seccomp/seccomp.json

Now we need a test container, which can be a simple [nginx][nginx] pod like
this:

[nginx]: https://www.nginx.com

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  annotations:
    io.kubernetes.cri-o.seccompNotifierAction: "stop"
spec:
  restartPolicy: Never
  containers:
    - name: nginx
      image: nginx:1.23.2
      securityContext:
        seccompProfile:
          type: RuntimeDefault
```

Please note the annotation `io.kubernetes.cri-o.seccompNotifierAction`, which
enables the seccomp notifier for this workload. The value of the annotation can
be either `stop` for stopping the workload or anything else for doing nothing
else than logging and throwing metrics. Because of the termination we also use
the `restartPolicy: Never` to not automatically recreate the container on
failure.

Let's run the pod and check if it works:

```console
> kubectl apply -f nginx.yaml
```

```console
> kubectl get pods -o wide
NAME    READY   STATUS    RESTARTS   AGE     IP          NODE        NOMINATED NODE   READINESS GATES
nginx   1/1     Running   0          3m39s   10.85.0.3   127.0.0.1   <none>           <none>
```

We can also test if the web server itself works as intended:

```console
> curl 10.85.0.3
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
…
```

While everything is now up and running, CRI-O also indicates that it has started
the seccomp notifier:

```
…
INFO[…] Injecting seccomp notifier into seccomp profile of container 662a3bb0fdc7dd1bf5a88a8aa8ef9eba6296b593146d988b4a9b85822422febb
…
```

If we would now run a forbidden syscall inside of the container, then we can
expect that the workload gets terminated. Let's give that a try by running
`chroot` in the containers namespaces:

```console
> kubectl exec -it nginx -- bash
```

```console
root@nginx:/# chroot /tmp
chroot: cannot change root directory to '/tmp': Function not implemented
root@nginx:/# command terminated with exit code 137
```

The exec session got terminated, so it looks like the container is not running
any more:

```console
> kubectl get pods
NAME    READY   STATUS           RESTARTS   AGE
nginx   0/1     seccomp killed   0          96s
```

Alright, the container got killed by seccomp, do we get any more information
about what was going on?

```console
> kubectl describe pod nginx
Name:             nginx
…
Containers:
  nginx:
    …
    State:          Terminated
      Reason:       seccomp killed
      Message:      Used forbidden syscalls: chroot (1x)
      Exit Code:    137
      Started:      Mon, 14 Nov 2022 12:19:46 +0100
      Finished:     Mon, 14 Nov 2022 12:20:26 +0100
…
```

The seccomp notifier feature of CRI-O correctly set the termination reason and
message, including which forbidden syscall has been used how often (`1x`). How
often? Yes, the notifier gives the application up to 5 seconds after the last
seen syscall until it starts the termination. This means that it's possible to
catch multiple forbidden syscalls within one test by avoiding time-consuming
trial and errors.

```console
> kubectl exec -it nginx -- chroot /tmp
chroot: cannot change root directory to '/tmp': Function not implemented
command terminated with exit code 125
> kubectl exec -it nginx -- chroot /tmp
chroot: cannot change root directory to '/tmp': Function not implemented
command terminated with exit code 125
> kubectl exec -it nginx -- swapoff -a
command terminated with exit code 32
> kubectl exec -it nginx -- swapoff -a
command terminated with exit code 32
```

```console
> kubectl describe pod nginx | grep Message
      Message:      Used forbidden syscalls: chroot (2x), swapoff (2x)
```

The CRI-O metrics will also reflect that:

```console
> curl -sf localhost:9090/metrics | grep seccomp_notifier
# HELP container_runtime_crio_containers_seccomp_notifier_count_total Amount of containers stopped because they used a forbidden syscalls by their name
# TYPE container_runtime_crio_containers_seccomp_notifier_count_total counter
container_runtime_crio_containers_seccomp_notifier_count_total{name="…",syscalls="chroot (1x)"} 1
container_runtime_crio_containers_seccomp_notifier_count_total{name="…",syscalls="chroot (2x), swapoff (2x)"} 1
```

How does it work in detail? CRI-O uses the chosen seccomp profile and injects
the action `SCMP_ACT_NOTIFY` instead of `SCMP_ACT_ERRNO`, `SCMP_ACT_KILL`,
`SCMP_ACT_KILL_PROCESS` or `SCMP_ACT_KILL_THREAD`. It also sets a local listener
path which will be used by the lower level OCI runtime (runc or crun) to create
the seccomp notifier socket. If the connection between the socket and CRI-O has
been established, then CRI-O will receive notifications for each syscall being
interfered by seccomp. CRI-O stores the syscalls, allows a bit of timeout for
them to arrive and then terminates the container if the chosen
`seccompNotifierAction=stop`. Unfortunately, the seccomp notifier is not able to
notify on the `defaultAction`, which means that it's required to have
a list of syscalls to test for custom profiles. CRI-O does also state that
limitation in the logs:

```log
INFO[…] The seccomp profile default action SCMP_ACT_ERRNO cannot be overridden to SCMP_ACT_NOTIFY,
        which means that syscalls using that default action can't be traced by the notifier
```

As a conclusion, the seccomp notifier implementation in CRI-O can be used to
verify if your applications behave correctly when using `RuntimeDefault` or any
other custom profile. Alerts can be created based on the metrics to create long
running test scenarios around that feature. Making seccomp understandable and
easier to use will increase adoption as well as help us to move towards a more
secure Kubernetes by default!

Thank you for reading this blog post. If you'd like to read more about the
seccomp notifier, checkout the following resources:

- The Seccomp Notifier - New Frontiers in Unprivileged Container Development: https://brauner.io/2020/07/23/seccomp-notify.html
- Bringing Seccomp Notify to Runc and Kubernetes: https://kinvolk.io/blog/2022/03/bringing-seccomp-notify-to-runc-and-kubernetes
- Seccomp Agent reference implementation: https://github.com/opencontainers/runc/tree/6b16d00/contrib/cmd/seccompagent
