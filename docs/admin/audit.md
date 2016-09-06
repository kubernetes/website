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

Kubernetes audit is part of [kube-apiserver](kube-apiserver) logging all requests
comming to the server. Each audit log contains two entries:

1. The request line containing:
    - unique id allowing to match the response line (see 2)
    - source ip of the request
    - HTTP method being invoked
    - original user invoking the operation
    - impersonated user for the operation
    - namespace of the request or <none>
    - uri is the full URI as requested
2. The response line containing:
    - the unique id from 1
    - response code

## Configuration

[Kube-apiserver](kube-apiserver) provides following options which are responsible
for configuring where and how audit logs are handled:

- `audit-log-path` - enables the audit log pointing to a file where the requests are being logged to.
- `audit-log-maxage` - specifies maximum number of days to retain old audit log files based on the timestamp encoded in their filename.
- `audit-log-maxbackup` - specifies maximum number of old audit log files to retain.
- `audit-log-maxsize` - specifies maximum size in megabytes of the audit log file before it gets rotated. Defaults to 100MB
