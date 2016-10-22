---
---

<style>
li>.highlighter-rouge {position:relative; top:3px;}
</style>

## Overview

kubectl is the command line tool you use to interact with Kubernetes clusters.

You should use a version of kubectl that is at least as new as your server.
`kubectl version` will print the server and client versions.  Using the same version of kubectl
as your server naturally works; using a newer kubectl than your server also works; but if you use
an older kubectl with a newer server you may see odd validation errors .

## Download a release

Download kubectl from the [official Kubernetes releases](https://console.cloud.google.com/storage/browser/kubernetes-release/release/):

On MacOS:

```shell
wget https://storage.googleapis.com/kubernetes-release/release/v1.4.4/bin/darwin/amd64/kubectl
chmod +x kubectl
mv kubectl /usr/local/bin/kubectl
```

On Linux:

```shell
wget https://storage.googleapis.com/kubernetes-release/release/v1.4.4/bin/linux/amd64/kubectl
chmod +x kubectl
mv kubectl /usr/local/bin/kubectl
```


You may need to `sudo` the `mv`; you can put it anywhere in your `PATH` - some people prefer to install to `~/bin`.


## Alternatives

### Download as part of the Google Cloud SDK

kubectl can be installed as part of the Google Cloud SDK:

First install the [Google Cloud SDK](https://cloud.google.com/sdk/).

After Google Cloud SDK installs, run the following command to install `kubectl`:

```shell
gcloud components install kubectl
```

Do check that the version is sufficiently up-to-date using `kubectl version`.

### Install with brew

If you are on MacOS and using brew, you can install with:

```shell
brew install kubectl
```

The homebrew project is independent from kubernetes, so do check that the version is
sufficiently up-to-date using `kubectl version`.