---
layout: blog
title: "Forensic container analysis"
date: 2023-03-10
slug: forensic-container-analysis
author: >
  Adrian Reber (Red Hat)
---

In my previous article, [Forensic container checkpointing in
Kubernetes][forensic-blog], I introduced checkpointing in Kubernetes
and how it has to be setup and how it can be used. The name of the
feature is Forensic container checkpointing, but I did not go into
any details how to do the actual analysis of the checkpoint created by
Kubernetes. In this article I want to provide details how the
checkpoint can be analyzed.

Checkpointing is still an alpha feature in Kubernetes and this article
wants to provide a preview how the feature might work in the future.

## Preparation

Details about how to configure Kubernetes and the underlying CRI implementation
to enable checkpointing support can be found in my [Forensic container
checkpointing in Kubernetes][forensic-blog] article.

As an example I prepared a container image (`quay.io/adrianreber/counter:blog`)
which I want to checkpoint and then analyze in this article. This container allows
me to create files in the container and also store information in memory which
I later want to find in the checkpoint.

To run that container I need a pod, and for this example I am using the following Pod manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: counters
spec:
  containers:
  - name: counter
    image: quay.io/adrianreber/counter:blog
```

This results in a container called `counter` running in a pod called `counters`.

Once the container is running I am performing following actions with that
container:

```console
$ kubectl get pod counters --template '{{.status.podIP}}'
10.88.0.25
$ curl 10.88.0.25:8088/create?test-file
$ curl 10.88.0.25:8088/secret?RANDOM_1432_KEY
$ curl 10.88.0.25:8088
```

The first access creates a file called `test-file` with the content `test-file`
in the container and the second access stores my secret information
(`RANDOM_1432_KEY`) somewhere in the container's memory. The last access just
adds an additional line to the internal log file.

The last step before I can analyze the checkpoint it to tell Kubernetes to create
the checkpoint. As described in the previous article this requires access to the
*kubelet* only `checkpoint` API endpoint.

For a container named *counter* in a pod named *counters* in a namespace named
*default* the *kubelet* API endpoint is reachable at:

```shell
# run this on the node where that Pod is executing
curl -X POST "https://localhost:10250/checkpoint/default/counters/counter"
```

For completeness the following `curl` command-line options are necessary to
have `curl` accept the *kubelet*'s self signed certificate and authorize the
use of the *kubelet* `checkpoint` API:

```shell
--insecure --cert /var/run/kubernetes/client-admin.crt --key /var/run/kubernetes/client-admin.key
```

Once the checkpointing has finished the checkpoint should be available at
`/var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar`

In the following steps of this article I will use the name `checkpoint.tar`
when analyzing the checkpoint archive.

## Checkpoint archive analysis using `checkpointctl`

To get some initial information about the checkpointed container I am using the
tool [checkpointctl][checkpointctl] like this:

```console
$ checkpointctl show checkpoint.tar --print-stats
+-----------+----------------------------------+--------------+---------+---------------------+--------+------------+------------+-------------------+
| CONTAINER |              IMAGE               |      ID      | RUNTIME |       CREATED       | ENGINE |     IP     | CHKPT SIZE | ROOT FS DIFF SIZE |
+-----------+----------------------------------+--------------+---------+---------------------+--------+------------+------------+-------------------+
| counter   | quay.io/adrianreber/counter:blog | 059a219a22e5 | runc    | 2023-03-02T06:06:49 | CRI-O  | 10.88.0.23 | 8.6 MiB    | 3.0 KiB           |
+-----------+----------------------------------+--------------+---------+---------------------+--------+------------+------------+-------------------+
CRIU dump statistics
+---------------+-------------+--------------+---------------+---------------+---------------+
| FREEZING TIME | FROZEN TIME | MEMDUMP TIME | MEMWRITE TIME | PAGES SCANNED | PAGES WRITTEN |
+---------------+-------------+--------------+---------------+---------------+---------------+
| 100809 us     | 119627 us   | 11602 us     | 7379 us       |          7800 |          2198 |
+---------------+-------------+--------------+---------------+---------------+---------------+
```

This gives me already some information about the checkpoint in that checkpoint
archive.  I can see the name of the container, information about the container
runtime and container engine.  It also lists the size of the checkpoint (`CHKPT
SIZE`). This is mainly the size of the memory pages included in the checkpoint,
but there is also information about the size of all changed files in the
container (`ROOT FS DIFF SIZE`).

The additional parameter `--print-stats` decodes information in the checkpoint
archive and displays them in the second table (*CRIU dump statistics*). This
information is collected during checkpoint creation and gives an overview how much
time CRIU needed to checkpoint the processes in the container and how many
memory pages were analyzed and written during checkpoint creation.

## Digging deeper

With the help of `checkpointctl` I am able to get some high level information
about the checkpoint archive. To be able to analyze the checkpoint archive
further I have to extract it. The checkpoint archive is a *tar* archive and can
be extracted with the help of `tar xf checkpoint.tar`.

Extracting the checkpoint archive will result in following files and directories:

* `bind.mounts` - this file contains information about bind mounts and is needed
  during restore to mount all external files and directories at the right location
* `checkpoint/` - this directory contains the actual checkpoint as created by
  CRIU
* `config.dump` and `spec.dump` - these files contain metadata about the container
  which is needed during restore
* `dump.log` - this file contains the debug output of CRIU created during
  checkpointing
* `stats-dump` - this file contains the data which is used by `checkpointctl`
  to display dump statistics (`--print-stats`)
* `rootfs-diff.tar` - this file contains all changed files on the container's
  file-system

### File-system changes - `rootfs-diff.tar`

The first step to analyze the container's checkpoint further is to look at
the files that have changed in my container. This can be done by looking at the
file `rootfs-diff.tar`:

```console
$ tar xvf rootfs-diff.tar
home/counter/logfile
home/counter/test-file
```

Now the files that changed in the container can be studied:

```console
$ cat home/counter/logfile
10.88.0.1 - - [02/Mar/2023 06:07:29] "GET /create?test-file HTTP/1.1" 200 -
10.88.0.1 - - [02/Mar/2023 06:07:40] "GET /secret?RANDOM_1432_KEY HTTP/1.1" 200 -
10.88.0.1 - - [02/Mar/2023 06:07:43] "GET / HTTP/1.1" 200 -
$ cat home/counter/test-file
test-file 
```

Compared to the container image (`quay.io/adrianreber/counter:blog`) this
container is based on, I can see that the file `logfile` contains information
about all access to the service the container provides and the file `test-file`
was created just as expected.

With the help of `rootfs-diff.tar` it is possible to inspect all files that
were created or changed compared to the base image of the container.

### Analyzing the checkpointed processes - `checkpoint/`

The directory `checkpoint/` contains data created by CRIU while checkpointing
the processes in the container. The content in the directory `checkpoint/`
consists of different [image files][image-files] which can be analyzed with the
help of the tool [CRIT][crit] which is distributed as part of CRIU.

First lets get an overview of the processes inside of the container:

```console
$ crit show checkpoint/pstree.img | jq .entries[].pid
1
7
8
```

This output means that I have three processes inside of the container's PID
namespace with the PIDs: 1, 7, 8

This is only the view from the inside of the container's PID namespace. During
restore exactly these PIDs will be recreated. From the outside of the
container's PID namespace the PIDs will change after restore.

The next step is to get some additional information about these three processes:

```console
$ crit show checkpoint/core-1.img | jq .entries[0].tc.comm
"bash"
$ crit show checkpoint/core-7.img | jq .entries[0].tc.comm
"counter.py"
$ crit show checkpoint/core-8.img | jq .entries[0].tc.comm
"tee"
```

This means the three processes in my container are `bash`, `counter.py` (a Python
interpreter) and `tee`. For details about the parent child relations of these processes there
is more data to be analyzed in `checkpoint/pstree.img`.

Let's compare the so far collected information to the still running container:

```console
$ crictl inspect --output go-template --template "{{(index .info.pid)}}" 059a219a22e56
722520
$ ps auxf | grep -A 2 722520
fedora    722520  \_ bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile
fedora    722541      \_ /usr/bin/python3 /home/counter/counter.py
fedora    722542      \_ /usr/bin/coreutils --coreutils-prog-shebang=tee /usr/bin/tee /home/counter/logfile
$ cat /proc/722520/comm
bash
$ cat /proc/722541/comm
counter.py
$ cat /proc/722542/comm
tee
```

In this output I am first retrieving the PID of the first process in the
container and then I am looking for that PID and child processes on the system
where the container is running. I am seeing three processes and the first one is
"bash" which is PID 1 inside of the containers PID namespace.  Then I am looking
at `/proc/<PID>/comm` and I can find the exact same value
as in the checkpoint image.

Important to remember is that the checkpoint will contain the view from within the
container's PID namespace because that information is important to restore the
processes.

One last example of what `crit` can tell us about the container is the information
about the UTS namespace:

```console
$ crit show checkpoint/utsns-12.img
{
    "magic": "UTSNS",
    "entries": [
        {
            "nodename": "counters",
            "domainname": "(none)"
        }
    ]
}
```

This tells me that the hostname inside of the UTS namespace is `counters`.

For every resource CRIU collected during checkpointing the `checkpoint/`
directory contains corresponding image files which can be analyzed with the help
of `crit`.

#### Looking at the memory pages

In addition to the information from CRIU that can be decoded with the help
of CRIT, there are also files containing the raw memory pages written by
CRIU to disk:

```console
$ ls  checkpoint/pages-*
checkpoint/pages-1.img  checkpoint/pages-2.img  checkpoint/pages-3.img
```

When I initially used the container I stored a random key (`RANDOM_1432_KEY`)
somewhere in the memory. Let see if I can find it:

```console
$ grep -ao RANDOM_1432_KEY checkpoint/pages-*
checkpoint/pages-2.img:RANDOM_1432_KEY
```

And indeed, there is my data. This way I can easily look at the content
of all memory pages of the processes in the container, but it is also
important to remember that anyone that can access the checkpoint
archive has access to all information that was stored in the memory of the
container's processes.

#### Using gdb for further analysis

Another possibility to look at the checkpoint images is `gdb`. The CRIU repository
contains the script [coredump][criu-coredump] which can convert a checkpoint
into a coredump file:

```console
$ /home/criu/coredump/coredump-python3
$ ls -al core*
core.1  core.7  core.8
```

Running the `coredump-python3` script will convert the checkpoint images into
one coredump file for each process in the container. Using `gdb` I can also look
at the details of the processes:

```console
$ echo info registers | gdb --core checkpoint/core.1 -q

[New LWP 1]

Core was generated by `bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile'.

#0  0x00007fefba110198 in ?? ()
(gdb)
rax            0x3d                61
rbx            0x8                 8
rcx            0x7fefba11019a      140667595587994
rdx            0x0                 0
rsi            0x7fffed9c1110      140737179816208
rdi            0xffffffff          4294967295
rbp            0x1                 0x1
rsp            0x7fffed9c10e8      0x7fffed9c10e8
r8             0x1                 1
r9             0x0                 0
r10            0x0                 0
r11            0x246               582
r12            0x0                 0
r13            0x7fffed9c1170      140737179816304
r14            0x0                 0
r15            0x0                 0
rip            0x7fefba110198      0x7fefba110198
eflags         0x246               [ PF ZF IF ]
cs             0x33                51
ss             0x2b                43
ds             0x0                 0
es             0x0                 0
fs             0x0                 0
gs             0x0                 0
```

In this example I can see the value of all registers as they were during
checkpointing and I can also see the complete command-line of my container's PID
1 process: `bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile`

## Summary

With the help of container checkpointing, it is possible to create a
checkpoint of a running container without stopping the container and without the
container knowing that it was checkpointed. The result of checkpointing a
container in Kubernetes is a checkpoint archive; using different tools like
`checkpointctl`, `tar`, `crit` and `gdb` the checkpoint can be analyzed. Even
with simple tools like `grep` it is possible to find information in the
checkpoint archive.

The different examples I have shown in this article how to analyze a checkpoint
are just the starting point. Depending on your requirements it is possible to
look at certain things in much more detail, but this article should give you an
introduction how to start the analysis of your checkpoint.

## How do I get involved?

You can reach SIG Node by several means:

* Slack: [#sig-node][slack-sig-node]
* Slack: [#sig-security][slack-sig-security]
* [Mailing list][sig-node-ml]

[forensic-blog]: https://kubernetes.io/blog/2022/12/05/forensic-container-checkpointing-alpha/
[checkpointctl]: https://github.com/checkpoint-restore/checkpointctl
[image-files]: https://criu.org/Images
[crit]: https://criu.org/CRIT
[slack-sig-node]: https://kubernetes.slack.com/messages/sig-node
[slack-sig-security]: https://kubernetes.slack.com/messages/sig-security
[sig-node-ml]: https://groups.google.com/forum/#!forum/kubernetes-sig-node
[criu-coredump]: https://github.com/checkpoint-restore/criu/tree/criu-dev/coredump
