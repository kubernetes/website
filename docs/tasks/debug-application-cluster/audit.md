---
assignees:
- soltysh
- sttts
title: Auditing
redirect_from:
- "/docs/admin/audit/"
- "/docs/admin/audit.html"
- "/docs/concepts/cluster-administration/audit/"
- "/docs/concepts/cluster-administration/audit.html"
---

* TOC
{:toc}

Kubernetes Audit provides a security-relevant chronological set of records documenting
the sequence of activities that have affected system by individual users, administrators
or other components of the system. It allows cluster administrator to
answer the following questions:
    - what happened?
    - when did it happen?
    - who initiated it?
    - on what did it happen?
    - where was it observed?
    - from where was it initiated?
    - to where was it going?

NOTE: Currently, Kubernetes provides only basic audit capabilities, there is still a lot
of work going on to provide fully featured auditing capabilities (see [this issue](https://github.com/kubernetes/features/issues/22)).

Kubernetes audit is part of [kube-apiserver](/docs/admin/kube-apiserver) logging all requests
coming to the server. Each audit log contains two entries:

1. The request line containing:
    - unique id allowing to match the response line (see 2)
    - source ip of the request
    - HTTP method being invoked
    - original user invoking the operation
    - original user's groups info
    - impersonated user for the operation
    - impersonated groups info
    - namespace of the request or <none>
    - URI as requested
2. The response line containing:
    - the unique id from 1
    - response code

Example output for user `admin` asking for a list of pods:

```
2017-03-21T03:57:09.106841886-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" ip="127.0.0.1" method="GET" user="admin" groups="\"system:masters\",\"system:authenticated\"" as="<self>" asgroups="<lookup>" namespace="default" uri="/api/v1/namespaces/default/pods"
2017-03-21T03:57:09.108403639-04:00 AUDIT: id="c939d2a7-1c37-4ef1-b2f7-4ba9b1e43b53" response="200"
```

## Configuration

[Kube-apiserver](/docs/admin/kube-apiserver) provides following options which are responsible
for configuring where and how audit logs are handled:

- `audit-log-path` - enables the audit log pointing to a file where the requests are being logged to.
- `audit-log-maxage` - specifies maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
- `audit-log-maxbackup` - specifies maximum number of old audit log files to retain.
- `audit-log-maxsize` - specifies maximum size in megabytes of the audit log file before it gets rotated. Defaults to 100MB

If an audit log file already exists, Kubernetes appends new audit logs to that file.
Otherwise, Kubernetes creates an audit log file at the location you specified in
`audit-log-path`. If the audit log file exceeds the size you specify in `audit-log-maxsize`,
Kubernetes will rename the current log file by appending the current timestamp on
the file name (before the file extension) and create a new audit log file.
Kubernetes may delete old log files when creating a new log file; you can configure
how many files are retained and how old they can be by specifying the `audit-log-maxbackup`
and `audit-log-maxage` options.
