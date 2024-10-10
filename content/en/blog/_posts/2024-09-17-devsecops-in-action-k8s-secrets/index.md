---
layout: blog
title: "DevSecOps in Action: Kubernetes Secrets"
slug: devsecops-in-action-k8s-secrets
date: 2024-09-17
author: >
  Evgenii Frikin
---


The Secret is one of the basic resources that exists in the Kubernetes API. This
kind of resource is used for different purposes and despite the name Secret,
sensitive data is insecure to store in it. Recently considerable attention has
been paid to
[security improvement](/docs/tasks/administer-cluster/encrypt-data/)
for objects such as Secrets, but Kubernetes still doesn't include appropriate
solutions

According to
[Good practices for Kubernetes Secrets](/docs/concepts/security/secrets-good-practices/)
there are several options on how to improve security of this kind of Secret:
encrypt secrets in the etcd, restrict the access to them via RBAC, configure
access to external Secret, etc. However, this partially solves the security issue
because they are cluster-side solutions and they help to improve security of the
cluster overall.

In the modern world, unilateral solutions aren't effective enough and can hide
security issues known as
[Security through obscurity](https://en.m.wikipedia.org/wiki/Security_through_obscurity).
To avoid it, I'm sure it's necessary to integrate DevSecOps methodology
which implies integrated security as a shared responsibility throughout the
entire IT lifecycle. In other words, security solutions must start with the
development process and apply to all other levels correspondingly.

According to
[OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html#5-containers-orchestrators),
it's recommended to use Injection of Secret via file and in-memory. Provision of
sensitive data via environment variables isn't recommended, but at the same time
it's recommended in The
[Twelve Factors](https://12factor.net/config).
These are general recommendations which don't impact security issues that's why
their application should make sense, but passing config via environment variables
with sensitive data must be kept to a minimum.

Injection of Secret via file and in-memory has pros and cons and I would like to
show which security issues exist when using Injection of Secret via file and
suggest solutions. In fact, there will be a general solution and specific
implementation will be different in terms of specific management and delivery
secrets tools. To keep the examples simple I will use `spec.initContainers` to
simulate an injection agent for delivering secrets to Pod.

## Baseline application

Imagine there is a simple application which processes http requests. On request
to `root` location client receives environment variable value
`DEMO_SECRET__PASSWD` which is defined via
[`spec.containers.0.envFrom.secretRef.name`](assets/baseline/kustomization/overlays/demo/kustomization.yml)
in Pod resource. On request `/readiness` receives status application
(ready or not ready) and if the environment variable isn't defined Pod doesn't
change status to `READY`.

[`cmd/main.go`](assets/baseline/cmd/main.go)
```go
const (
	envVar = "DEMO_SECRET__PASSWD"
)

<skipped>

func httpHandle(w http.ResponseWriter, r *http.Request) {

	var isExist, ok bool
	var envVal string

	if envVal, ok = os.LookupEnv(envVar); ok {
		isExist = true
	}

	switch r.URL.Path {
	case "/":
		if isExist {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, envVal)
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintln(w, "Secret Not Found")
		}
	case "/readiness":
		if isExist {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "OK")
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintln(w, "Environment variable wasn't defined")
		}
	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintln(w, "404 Not Found")
	}
}
```

## Stage-01: Reject environment vars for storing sensitive data

According to OWASP recommendation, it's necessary to use file instead of env.
That's why it's necessary to make changes to implementation readiness probes
and deployment manifests.

[`cmd/main.go`](assets/stage-01/cmd/main.go)
```go
const (
	envVar = "DEMO_SECRET__PASSWD_FILE"
)

<skipped>

func fileExist(path string) bool {
	info, err := os.Stat(path)
	if err == nil {
		return !info.IsDir()
	}
	if errors.Is(err, os.ErrNotExist) {
		return false
	}
	return false
}

func httpHandle(w http.ResponseWriter, r *http.Request) {

<skipped>

	if envVal, ok = os.LookupEnv(envVar); ok {
		if fileExist(envVal) {
			isExist = true
		}
	}
}
```

Now applications check `DEMO_SECRET__PASSWD_FILE` was defined then application
checks whether the file exists by value from the environment variable.

[`kustomization.yaml`](assets/stage-01/kustomization/overlays/demo/kustomization.yml)
```yaml

<skipped>

spec:
  containers:
  - envFrom:
    - secretRef:
         name: demo-secret
    volumeMounts:
    - mountPath: /secrets
      name: demo-secret
      readOnly: true
  volumes:
  - name: demo-secret
    secret:
      optional: true
      secretName: demo-secret

<skipped>
```

`spec.containers.0.envFrom` defines all of the Secret's data as container
environment variables and `spec.volume/spec.containers.0.volumeMounts`
mounts the Secret as a volume to the Pod.

Excellent! Part of recommendations have been completed, but for the full picture
it's necessary to solve the following issues:

* The secret file is mounted as a volume and it's necessary to remove after it usage
(e.g reading)
* Kind Secret is insecure that's why it's necessary to minimize its use
* Additional implementation of environment variable such as:
`DEMO_SECRET__PASSWD_FILE` can Impede applications update.

## Stage-02: Injection of secret to Pod instead of mountpoint

In order to get rid of Secret as mountpoint it's necessary to use Injection of
Secret via file to Pod. Often secret manager tools perform these functions.
Also they provide functions such as: dynamic secrets, database credential
rotation, automated PKI infrastructure, data encryption and tokenization,
identity-based access, key management, etc.

In the example below, simulation of getting secret from secure storage and
delivery to Pod will be done via `spec.initContainers` then
`spec.containers.0.postStart` hook will clean the file after successful passing
of readiness probe in order to make file with sensitive data to Pod useless for
attacker.

[`kustomization.yaml`](assets/stage-02/kustomization/overlays/demo/kustomization.yml)
```yaml

<skipped>

  initContainers:
    - name: secret-injector
      image: alpine:3.19
      command:
        - sh
        - -c
        - cat /dev/urandom | base64 -w 0 | fold -w 16 | head -1 > ${DEMO_SECRET__PASSWD_FILE}
      envFrom:
         -  secretRef:
             name: demo-secret
      volumeMounts:
        - mountPath: /secrets
          name: demo-secret

<skipped>

    lifecycle:
      postStart:
        exec:
          command:
          - sh
          - -c
          - wget -qO- localhost:8080/readiness && echo > ${DEMO_SECRET__PASSWD_FILE}
```

The container must change status to `READY` after the application reads a file
with secret, otherwise `spec.containers.0.postStart` hook will clean it.

## Stage-03: Smooth update

So at the current moment, the application can be configured via the environment
variable `DEMO_SECRET__PASSWD_FILE` containing a path to a secret file and if
the file exists (checking via `/readianess` probe) then read it.

[`cmd/main.go`](assets/stage-03/cmd/main.go)
```go
func httpHandle(w http.ResponseWriter, r *http.Request) {

	if !changed {
		if envVal, isExistEnv = os.LookupEnv(envVar); isExistEnv {
			if filePath, isExistFile = fileExist(envVal); isExistFile {
				body, err := os.ReadFile(filePath)
				if err != nil {
					log.Fatalf("unable to read file: %v", err)
				}
				os.Setenv(envVar, string(body))
				envVal = os.Getenv(envVar)
				changed = true
			}
		}
	}

	switch r.URL.Path {
	case "/":
		if isExistFile {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, envVal)
		} else if isExistEnv {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, envVal)
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintln(w, "Secret Not Found")
		}
	case "/readiness":
		if isExistEnv && isExistFile {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "OK")
		} else if isExistEnv && isExistFile == false && strings.HasPrefix(envVal, filePrefix) {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "Environment variable was defined but file not found")
		} else if isExistEnv {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "Environment variable was defined")
		} else {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintln(w, "Environment variable wasn't defined")
		}
	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintln(w, "404 Not Found")
	}
}
```
In fact everything works and you can stop here. Unfortunately in the real world
there are a lot of already working services and they must have implementation of
additional environment variables. This isn't always possible and this approach
can have specific limitations. In order to reduce the amount of limitations it's
necessary to implement an approach based on support of both
functions (variables) but without additional environment variables.
This approach allows not to implement additional variable but to use the current
variable for two cases:

* legacy: using env variable for storing sensitive data
* new: using env variable for storing path to file with sensitive data and
override current value to value from the file

To distinguish sensitive data values from path to file, by using prefixes,
this will allow you to use the same variable and follow OWASP recommendations.

First let's define variables and constants:

[`cmd/main.go`](assets/stage-03/cmd/main.go)
```go
const (
	envVar = "DEMO_SECRET__PASSWD"
	filePrefix = "file://"
)

var (
	envVal, filePath string
	isExistFile, isExistEnv, changed bool
)
```

Next, it's necessary to change the `fileExist` function. It's supposed to return
a path to the file without a prefix if the file exists.

[`cmd/main.go`](assets/stage-03/cmd/main.go)
```go
func fileExist(path string) (string, bool) {
	if strings.HasPrefix(path, filePrefix) {
		path = strings.TrimPrefix(path, filePrefix)
		info, err := os.Stat(path)
		if err == nil {
			return path, !info.IsDir()
		}
		if errors.Is(err, os.ErrNotExist) {
			return "", false
		}
	}
	return "", false
}
```

Magic happens in the `httpHandle` function. Environment variable value is passed
into function, if it's a file it will be read and current environment variable
value will be overridden by a new value that was read from the file.

[`cmd/main.go`](assets/stage-03/cmd/main.go)
```go
func httpHandle(w http.ResponseWriter, r *http.Request) {
	if !changed {
		if envVal, isExistEnv = os.LookupEnv(envVar); isExistEnv {
			if filePath, isExistFile = fileExist(envVal); isExistFile {
				body, err := os.ReadFile(filePath)
				if err != nil {
					log.Fatalf("unable to read file: %v", err)
				}
				os.Setenv(envVar, string(body))
				envVal = os.Getenv(envVar)
				changed = true
			}
		}
	}
}
```

Finally, if define `DEMO_SECRET__PASSWD=file:///secrets/secret.file`, deploy
application and make request to `root` location, response will contain file
content which is defined in the environment variable:

```bash
curl -v localhost:8080
```

The output is similar to this:

```text

<skipped output>

> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.5.0
> Accept: */*
>
< HTTP/1.1 200 OK

<skipped output>

PVHBD5I21osTOX9i
```

Let's check process environment:

```bash
strings /proc/1/environ
```

The output is similar to this:

```text

<skipped output>

DEMO_SECRET__PASSWD=file:///secrets/secret.file

<skipped output>
```

Excellent! Environment variable still contains the value which was defined
during the deployment.

Let's check the secret file:

```bash
cat /secrets/secret.file
```

The file is empty! After readiness probe passed, the file was truncated.

If define `DEMO_SECRET__PASSWD=/secrets/secret.file` (without prefix) response
will contain the file name which was defined in the environment variable:

```bash
curl -v localhost:8080
```

The output is similar to this:

```text

<skipped output>

> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.5.0
> Accept: */*
>
< HTTP/1.1 200 OK

<skipped output>

/secrets/secret.file
```

```bash
strings /proc/1/environ
```

```text

<skipped output>

DEMO_SECRET__PASSWD=/secrets/secret.file

<skipped output>
```

```bash
cat /secrets/secret.file
```

```text
cat: /secrets/secret.file: No such file or directory
```

`/secrets/secret.file` is a string interpreted as sensitive data, that's why
the file wasn't injected.

The attacker's life has become more complicated because now in order to
access sensitive data it's necessary either to make a process dump or to use a
debugger tool. In order to show debug process, first it's necessary to make
build with disabled compiler optimization flags and run `gdb`:

```bash
go build -gcflags=all="-N -l" cmd/stage-03/main.go
```

```bash
echo 'MySecret' > secret.file
```

```bash
DEMO_SECRET__PASSWD=file://secret.file gdb main
```

Let's check current process environment:

```
(gdb) show environment DEMO_SECRET__PASSWD
```

```
DEMO_SECRET__PASSWD = file://secret.file

<skipped output>
```

Let's set a breakpoint and run debug. In other terminal tab or web browser it's
necessary to make request to `root`
location (the request is supposed to get stuck):

```
(gdb) break 48
```

```
Breakpoint 1 at 0x784cf5: file ..., line 48.
```

```
(gdb) run
```

Once the request is received, the process will be stopped (due to breakpoint).
`os.LookupEnv` function returns environment variable value if it is defined.

```
Thread 1 "main" hit Breakpoint 1, main.httpHandle (w=..., r=0xc0000c2000) at ...
```

```
48                      if envVal, isExistEnv = os.LookupEnv(envVar); isExistEnv {
```

Next,let's move on to checking for the file existence the path to which is
stored in the envVal variable:

```
(gdb) next
```

```
49                              if filePath, isExistFile = fileExist(envVal); isExistFile {

```

```
(gdb) print main.envVal

```

```
$1 = 0xc00001e0d4 "file://secret.file"
```

Next, `os.ReadFile` read file, `os.Setenv` makes override value of the
environment variable, but `os.Getenv` gets new value from recently-rewritten
environment variable:

```
(gdb) next

```

```
50                                      body, err := os.ReadFile(filePath)

<skipped output>

54                                      os.Setenv(envVar, string(body))

```

```
(gdb) next
```

```
55                                      envVal = os.Getenv(envVar)
```

In conclusion, let's make sure, that the same variable has different values:

```
(gdb) next
```

```
56                                      changed = true
```

```
(gdb) print main.envVal
```

```
$2 = 0xc0000ea014 "MySecret\n"
```

```
(gdb) show environment DEMO_SECRET__PASSWD
```

```
DEMO_SECRET__PASSWD = file://secret.file
```

As you can see, the debug process requires a few conditions such as: disabled
compiler optimization, access to source code and debug tool existence, but if
application runs into container and is managed by orchestrator such as:
Kubernetes, then it generates additional problems which have to be solved in
order to use debug tool.

For more details please see [Debugging Go Code with GDB](https://go.dev/doc/gdb).

All source code, deployment files and Installation guide to local environment
can be found in the article folder to
[kubernetes/website project](https://github.com/kubernetes/website/tree/main/content/en/blog/_posts).

## Next Stages

In the section I would like to share my reflections about next stages of
development of the described approach. Below there are a few breadcrumbs:

Firstly, it's necessary to consider the possibility of restricting applications
in the runtime container to precisely what's necessary for the app. This is the
best practice. That's why distroless images contain only application and its
runtime dependencies. They do not contain package managers, shells or any other
programs you would expect to find in an OS distribution.

Secondly, it's necessary to consider mechanisms of cleanup/removal of files by
TTL. Maybe it also makes sense to truncate runtime environment variables after
usage.

Thirdly, after smooth upgrading of all applications it's necessary to consider
the possibility of rejection of environment variables usage as sensitive data
passing way to container. Application must ignore any environment variables
except the ones whose values start with prefix

Fourthly, it's necessary to consider the possibility of using popular libraries,
which allow us to work effectively with environment variables, flags, configs,
etc. e.g this allows a faster
[implementation of the described approach](assets/viper/main.go).

## Acknowledgement

Special thanks to Konstantin Misyutin (ikeeip) who provided technical input,
great reviews, feedbacks and remarks related with my ideas.
