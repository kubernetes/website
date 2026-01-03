---
layout: blog
title: "Having fun with seccomp profiles on the edge"
date: 2023-05-18
slug: seccomp-profiles-edge
author: >
  Sascha Grunert
---

The [Security Profiles Operator (SPO)][spo] is a feature-rich
[operator][operator] for Kubernetes to make managing seccomp, SELinux and
AppArmor profiles easier than ever. Recording those profiles from scratch is one
of the key features of this operator, which usually involves the integration
into large CI/CD systems. Being able to test the recording capabilities of the
operator in edge cases is one of the recent development efforts of the SPO and
makes it excitingly easy to play around with seccomp profiles.

[spo]: https://github.com/kubernetes-sigs/security-profiles-operator
[operator]: https://kubernetes.io/docs/concepts/extend-kubernetes/operator

## Recording seccomp profiles with `spoc record`

The [v0.8.0][spo-latest] release of the Security Profiles Operator shipped a new
command line interface called `spoc`, a little helper tool for recording and
replaying seccomp profiles among various other things that are out of scope of
this blog post.

[spo-latest]: https://github.com/kubernetes-sigs/security-profiles-operator/releases/v0.8.0

Recording a seccomp profile requires a binary to be executed, which can be a
simple golang application which just calls [`uname(2)`][uname]:

```go
package main

import (
	"syscall"
)

func main() {
	utsname := syscall.Utsname{}
	if err := syscall.Uname(&utsname); err != nil {
		panic(err)
	}
}
```

[uname]: https://man7.org/linux/man-pages/man2/uname.2.html

Building a binary from that code can be done by:

```console
> go build -o main main.go
> ldd ./main
        not a dynamic executable
```

Now it's possible to download the latest binary of [`spoc` from
GitHub][spoc-latest] and run the application on Linux with it:

[spoc-latest]: https://github.com/kubernetes-sigs/security-profiles-operator/releases/download/v0.8.0/spoc.amd64

```console
> sudo ./spoc record ./main
10:08:25.591945 Loading bpf module
10:08:25.591958 Using system btf file
libbpf: loading object 'recorder.bpf.o' from buffer
…
libbpf: prog 'sys_enter': relo #3: patched insn #22 (ALU/ALU64) imm 16 -> 16
10:08:25.610767 Getting bpf program sys_enter
10:08:25.610778 Attaching bpf tracepoint
10:08:25.611574 Getting syscalls map
10:08:25.611582 Getting pid_mntns map
10:08:25.613097 Module successfully loaded
10:08:25.613311 Processing events
10:08:25.613693 Running command with PID: 336007
10:08:25.613835 Received event: pid: 336007, mntns: 4026531841
10:08:25.613951 No container ID found for PID (pid=336007, mntns=4026531841, err=unable to find container ID in cgroup path)
10:08:25.614856 Processing recorded data
10:08:25.614975 Found process mntns 4026531841 in bpf map
10:08:25.615110 Got syscalls: read, close, mmap, rt_sigaction, rt_sigprocmask, madvise, nanosleep, clone, uname, sigaltstack, arch_prctl, gettid, futex, sched_getaffinity, exit_group, openat
10:08:25.615195 Adding base syscalls: access, brk, capget, capset, chdir, chmod, chown, close_range, dup2, dup3, epoll_create1, epoll_ctl, epoll_pwait, execve, faccessat2, fchdir, fchmodat, fchown, fchownat, fcntl, fstat, fstatfs, getdents64, getegid, geteuid, getgid, getpid, getppid, getuid, ioctl, keyctl, lseek, mkdirat, mknodat, mount, mprotect, munmap, newfstatat, openat2, pipe2, pivot_root, prctl, pread64, pselect6, readlink, readlinkat, rt_sigreturn, sched_yield, seccomp, set_robust_list, set_tid_address, setgid, setgroups, sethostname, setns, setresgid, setresuid, setsid, setuid, statfs, statx, symlinkat, tgkill, umask, umount2, unlinkat, unshare, write
10:08:25.616293 Wrote seccomp profile to: /tmp/profile.yaml
10:08:25.616298 Unloading bpf module
```

I have to execute `spoc` as root because it will internally run an [ebpf][ebpf]
program by reusing the same code parts from the Security Profiles Operator
itself. I can see that the bpf module got loaded successfully and `spoc`
attached the required tracepoint to it. Then it will track the main application
by using its [mount namespace][mntns] and process the recorded syscall data. The
nature of ebpf programs is that they see the whole context of the Kernel, which
means that `spoc` tracks all syscalls of the system, but does not interfere with
their execution.

[ebpf]: https://ebpf.io
[mntns]: https://man7.org/linux/man-pages/man7/mount_namespaces.7.html

The logs indicate that `spoc` found the syscalls `read`, `close`,
`mmap` and so on, including `uname`. All other syscalls than `uname` are coming
from the golang runtime and its garbage collection, which already adds overhead
to a basic application like in our demo. I can also see from the log line
`Adding base syscalls: …` that `spoc` adds a bunch of base syscalls to the
resulting profile. Those are used by the OCI runtime (like [runc][runc] or
[crun][crun]) in order to be able to run a container. This means that `spoc`
can be used to record seccomp profiles which then can be containerized directly.
This behavior can be disabled in `spoc` by using the `--no-base-syscalls`/`-n`
or customized via the `--base-syscalls`/`-b` command line flags. This can be
helpful in cases where different OCI runtimes other than crun and runc are used,
or if I just want to record the seccomp profile for the application and stack
it with another [base profile][base].

[runc]: https://github.com/opencontainers/runc
[crun]: https://github.com/containers/crun
[base]: https://github.com/kubernetes-sigs/security-profiles-operator/blob/35ebdda/installation-usage.md#base-syscalls-for-a-container-runtime

The resulting profile is now available in `/tmp/profile.yaml`, but the default
location can be changed using the `--output-file value`/`-o` flag:

```console
> cat /tmp/profile.yaml
```

```yaml
apiVersion: security-profiles-operator.x-k8s.io/v1beta1
kind: SeccompProfile
metadata:
  creationTimestamp: null
  name: main
spec:
  architectures:
    - SCMP_ARCH_X86_64
  defaultAction: SCMP_ACT_ERRNO
  syscalls:
    - action: SCMP_ACT_ALLOW
      names:
        - access
        - arch_prctl
        - brk
        - …
        - uname
        - …
status: {}
```

The seccomp profile Custom Resource Definition (CRD) can be directly used
together with the Security Profiles Operator for managing it within Kubernetes.
`spoc` is also capable of producing raw seccomp profiles (as JSON), by using the
`--type`/`-t` `raw-seccomp` flag:

```console
> sudo ./spoc record --type raw-seccomp ./main
…
52.628827 Wrote seccomp profile to: /tmp/profile.json
```

```console
> jq . /tmp/profile.json
```

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64"],
  "syscalls": [
    {
      "names": ["access", "…", "write"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

The utility `spoc record` allows us to record complex seccomp profiles directly
from binary invocations in any Linux system which is capable of running the ebpf
code within the Kernel. But it can do more: How about modifying the seccomp
profile and then testing it by using `spoc run`.

## Running seccomp profiles with `spoc run`

`spoc` is also able to run binaries with applied seccomp profiles, making it
easy to test any modification to it. To do that, just run:

```console
> sudo ./spoc run ./main
10:29:58.153263 Reading file /tmp/profile.yaml
10:29:58.153311 Assuming YAML profile
10:29:58.154138 Setting up seccomp
10:29:58.154178 Load seccomp profile
10:29:58.154189 Starting audit log enricher
10:29:58.154224 Enricher reading from file /var/log/audit/audit.log
10:29:58.155356 Running command with PID: 437880
>
```

It looks like that the application exited successfully, which is anticipated
because I did not modify the previously recorded profile yet. I can also
specify a custom location for the profile by using the `--profile`/`-p` flag,
but this was not necessary because I did not modify the default output location
from the record. `spoc` will automatically determine if it's a raw (JSON) or CRD
(YAML) based seccomp profile and then apply it to the process.

The Security Profiles Operator supports a [log enricher feature][enricher],
which provides additional seccomp related information by parsing the audit logs.
`spoc run` uses the enricher in the same way to provide more data to the end
users when it comes to debugging seccomp profiles.

[enricher]: https://github.com/kubernetes-sigs/security-profiles-operator/blob/35ebdda/installation-usage.md#using-the-log-enricher

Now I have to modify the profile to see anything valuable in the output. For
example, I could remove the allowed `uname` syscall:

```console
> jq 'del(.syscalls[0].names[] | select(. == "uname"))' /tmp/profile.json > /tmp/no-uname-profile.json
```

And then try to run it again with the new profile `/tmp/no-uname-profile.json`:

```console
> sudo ./spoc run -p /tmp/no-uname-profile.json ./main
10:39:12.707798 Reading file /tmp/no-uname-profile.json
10:39:12.707892 Setting up seccomp
10:39:12.707920 Load seccomp profile
10:39:12.707982 Starting audit log enricher
10:39:12.707998 Enricher reading from file /var/log/audit/audit.log
10:39:12.709164 Running command with PID: 480512
panic: operation not permitted

goroutine 1 [running]:
main.main()
        /path/to/main.go:10 +0x85
10:39:12.713035 Unable to run: launch runner: wait for command: exit status 2
```

Alright, that was expected! The applied seccomp profile blocks the `uname`
syscall, which results in an "operation not permitted" error. This error is
pretty generic and does not provide any hint on what got blocked by seccomp.
It is generally extremely difficult to predict how applications behave if single
syscalls are forbidden by seccomp. It could be possible that the application
terminates like in our simple demo, but it could also lead to a strange
misbehavior and the application does not stop at all.

If I now change the default seccomp action of the profile from `SCMP_ACT_ERRNO`
to `SCMP_ACT_LOG` like this:

```console
> jq '.defaultAction = "SCMP_ACT_LOG"' /tmp/no-uname-profile.json > /tmp/no-uname-profile-log.json
```

Then the log enricher will give us a hint that the `uname` syscall got blocked
when using `spoc run`:

```console
> sudo ./spoc run -p /tmp/no-uname-profile-log.json ./main
10:48:07.470126 Reading file /tmp/no-uname-profile-log.json
10:48:07.470234 Setting up seccomp
10:48:07.470245 Load seccomp profile
10:48:07.470302 Starting audit log enricher
10:48:07.470339 Enricher reading from file /var/log/audit/audit.log
10:48:07.470889 Running command with PID: 522268
10:48:07.472007 Seccomp: uname (63)
```

The application will not terminate any more, but seccomp will log the behavior
to `/var/log/audit/audit.log` and `spoc` will parse the data to correlate it
directly to our program. Generating the log messages to the audit subsystem
comes with a large performance overhead and should be handled with care in
production systems. It also comes with a security risk when running untrusted
apps in audit mode in production environments.

This demo should give you an impression how to debug seccomp profile issues with
applications, probably by using our shiny new helper tool powered by the
features of the Security Profiles Operator. `spoc` is a flexible and portable
binary suitable for edge cases where resources are limited and even Kubernetes
itself may not be available with its full capabilities.

Thank you for reading this blog post! If you're interested in more, providing
feedback or asking for help, then feel free to get in touch with us directly via
[Slack (#security-profiles-operator)][slack] or the [mailing list][mail].

[slack]: https://kubernetes.slack.com/messages/security-profiles-operator
[mail]: https://groups.google.com/forum/#!forum/kubernetes-dev
