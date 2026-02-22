---
title: Previewing locally
content_type: concept
weight: 11
---

<!-- overview -->

Before you're going to [open a new PR](/docs/contribute/new-content/open-a-pr/),
previewing your changes is recommended. A preview lets you catch build
errors or markdown formatting problems.

## Preview your changes locally {#preview-locally}

You can either build the website's container image or run Hugo locally. Building the container
image is slower but displays [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/), which can
be useful for debugging.

{{< tabs name="tab_with_hugo" >}}
{{% tab name="Hugo in a container" %}}

{{< note >}}
The commands below use Docker as default container engine. Set the `CONTAINER_ENGINE` environment
variable to override this behaviour.
{{< /note >}}

1. Build the container image locally  
   _You only need this step if you are testing a change to the Hugo tool itself_

   ```shell
   # Run this in a terminal (if required)
   make container-image
   ```

1. Fetch submodule dependencies in your local repository:

   ```shell
   # Run this in a terminal
   make module-init
   ```

1. Start Hugo in a container:

   ```shell
   # Run this in a terminal
   make container-serve
   ```

1. In a web browser, navigate to `http://localhost:1313`. Hugo watches the
   changes and rebuilds the site as needed.

1. To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`,
   or close the terminal window.

{{% /tab %}}
{{% tab name="Hugo on the command line" %}}

Alternately, install and use the `hugo` command on your computer:

1. Install the [Hugo (Extended edition)](https://gohugo.io/getting-started/installing/) and [Node](https://nodejs.org/en) version specified in
   [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml).

1. Install any dependencies:

   ```shell
   npm ci
   ```

1. In a terminal, go to your Kubernetes website repository and start the Hugo server:

   ```shell
   cd <path_to_your_repo>/website
   make serve
   ```
   If you're on a Windows machine or unable to run the `make` command, use the following command:

   ```
   hugo server --buildFuture
   ```

1. In a web browser, navigate to `http://localhost:1313`. Hugo watches the
   changes and rebuilds the site as needed.

1. To stop the local Hugo instance, go back to the terminal and type `Ctrl+C`,
   or close the terminal window.

{{% /tab %}}
{{< /tabs >}}

## Troubleshooting {#troubleshooting}

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo is shipped in two set of binaries for technical reasons. The current
website runs based on the **Hugo Extended** version only. In the [release page](https://github.com/gohugoio/hugo/releases)
 look for archives with `extended` in the name. To confirm, run `hugo version`
 and look for the word `extended`.

### Troubleshooting macOS for too many open files

If you run `make serve` on macOS and receive the following error:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Try checking the current limit for open files:

`launchctl limit maxfiles`

Then run the following commands (adapted from <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

This works for Catalina as well as Mojave macOS.

### Unable to find image 'gcr.io/k8s-staging-sig-docs/k8s-website-hugo:VERSION' locally

If you run `make container-serve` and see this error, it might be due to 
the local changes made to specific files [defined](https://github.com/kubernetes/website/blob/main/Makefile#L10)
in the `$IMAGE_VERSION` of `Makefile`.

The website image versioning includes a hash, which is generated based on
the content of the listed files. E.g., if `1b9242684415` is the hash 
for these files, the website image will be called `k8s-website-hugo:v0.133.0-1b9242684415`.
Executing `make container-serve` will try to pull such an image from
the Kubernetes website’s GCR. If it’s not a current version, you’ll see
an error saying this image is absent.

If you need to make changes in these files and preview the website,
you’ll have to build your local image instead of pulling a pre-built one.
To do so, proceed with running `make container-image`.

### Other issues

If you experience other problems with running website locally and/or
previewing your changes, feel free to [open an issue](https://github.com/kubernetes/website/issues/new/choose)
in the `kubernetes/website` GitHub repo.
