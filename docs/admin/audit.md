---
assignees:
- soltysh
- sttts

---

* TOC
{:toc}

## Audit in Kubernetes

Kubernetes currently provides only basic audit capabilities, there is still a lot
of work going on to provide fully featured auditing capabilities (see https://github.com/kubernetes/features/issues/22).

Kubernetes audit is part of [kube-apiserver](/docs/admin/kube-apiserver) logging all requests
coming to the server. Each audit log contains two entries:

1. The request line containing:
    - unique id allowing to match the response line (see 2)
    - source ip of the request
    - HTTP method being invoked
    - original user invoking the operation
    - impersonated user for the operation
    - namespace of the request or <none>
    - URI as requested
2. The response line containing:
    - the unique id from 1
    - response code

Example output for user `admin` asking for a list of pods:

```
2016-09-07T13:03:57.400333046Z AUDIT: id="5c3b8227-4af9-4322-8a71-542231c3887b" ip="127.0.0.1" method="GET" user="admin" as="<self>" namespace="default" uri="/api/v1/namespaces/default/pods"
2016-09-07T13:03:57.400710987Z AUDIT: id="5c3b8227-4af9-4322-8a71-542231c3887b" response="200"
```

NOTE: The audit capabilities are available *only* for the secured endpoint of the API server.

## Configuration

[Kube-apiserver](/docs/admin/kube-apiserver) provides following options which are responsible
for configuring where and how audit logs are handled:

- `audit-log-path` - enables the audit log pointing to a file where the requests are being logged to.
- `audit-log-maxage` - specifies maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
- `audit-log-maxbackup` - specifies maximum number of old audit log files to retain.
- `audit-log-maxsize` - specifies maximum size in megabytes of the audit log file before it gets rotated. Defaults to 100MB

Audit logs are being appended if the file already existed or a new one will be
created at given location. If file size exceeds `audit-log-maxsize` the file is
renamed by putting the current timestamp at the end name of the file name (before
the file's extension)
Whenever a new logfile get created, old log files may be deleted. This policy is
configured using `audit-log-maxbackup` and `audit-log-maxage` flags.
