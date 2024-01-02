---
layout: blog
title: "WebAssembly on Kubernetes: The Practice Guide"
date: 2024-01-26
slug: webassembly-on-kubernetes-the-practice-guide
---

**Author:** Seven Cheng (SAP)

In the [previous article](/blog/2024/01/26/webassembly-on-kubernetes-from-containers-to-wasm), I gave an overview of Wasm's features and advantages. I also explained how to run Wasm modules within container environments. In this article, I will guide you through building and deploying Wasm applications in the Cloud Native ecosystems. You'll need:
- a login to Docker Hub (you can also adapt the walkthrough to use a different container image registry.
- a Rust development environment (the article tells you how to find installation instructions).
- a PC running Debian, Ubuntu, or a similar Linux distribution based on Debian.
  The PC should have an AMD64 or compatible CPU.
  Again, you can adapt the advice if you use a different flavor of Linux or a different kind of CPU. If you use a different operating system (not Linux), set up a local Linux environment inside a virtual machine.

## Write an example application using Rust and WebAssembly

Whether an application can be compiled to Wasm significantly depends on the programming language being used. Languages such as Rust, C, and C++ offer great support for Wasm, and Go provides preliminary support for WASI starting from version 1.21. Prior to this, third-party tools such as tinygo were needed for compilation. Due to Rust’s first-class support for Wasm, I use Rust for developing Wasm applications in this article.

### Install Rust

Please refer to the [Rust installation instruction](https://www.rust-lang.org/tools/install) to install Rust.
Make sure to install Cargo (Rust's package manager) as well as Rust itself.

### Add wasm32-wasi target for Rust

As mentioned earlier, WASI is a system-level interface for WebAssembly, designed to facilitate interactions between WebAssembly and the host system in various environments. It offers a standardized method enabling WebAssembly to access system-level functionalities such as file I/O, network, and system calls.

`Rustc` is a cross-platform compiler with many compilation targets, including _wasm32-wasi_. This target compiles Rust code into Wasm modules that follow the WASI standard. Compiling Rust code to the wasm32-wasi target allows Rust's functionality and safety to be integrated into the WebAssembly environment while leveraging standardized system interfaces provided by wasm32-wasi for interaction with the host system.

Add the `wasm32-wasi` target to the Rust compiler.

```bash
rustup target add wasm32-wasi
```

### Write a Rust program

Create a new Rust project named `http-server` using `cargo new` command:

```bash
cargo new http-server
```

Edit the `Cargo.toml` file to add the dependencies listed below. _[warp_wasi](https://crates.io/crates/warp_wasi)_ is specifically designed for WASI and is built upon the _[Warp](https://docs.rs/warp/latest/warp/)_ framework, which is a lightweight web server framework used to develop high-performance asynchronous web applications.

```
[dependencies]
tokio_wasi = { version = "1", features = ["rt", "macros", "net", "time", "io-util"]}
warp_wasi = "0.3"
```

Create a simple HTTP server that exposes services on port 8080 and returns "Hello, World!" when a request is received.

```rust
use warp::Filter;

#[tokio::main(flavor = "current_thread")]
async fn main() {
    let hello = warp::get()
        .and(warp::path::end())
        .map(|| "Hello, World!");

    println!("Listening on http://0.0.0.0:8080");
    warp::serve(hello).run(([0, 0, 0, 0], 8080)).await;
}
```

Save that file as `main.rs` onto your PC.
Compile the program into a Wasm module, it will be written to the `target/wasm32-wasi/release` directory of project.

```bash
cargo build --target wasm32-wasi --release
```

### Install WasmEdge

The compiled Wasm module requires an appropriate Wasm runtime for execution. Popular choices for this include WasmEdge, Wasmtime, and Wasmer, etc.

In this article, I use _[WasmEdge](https://wasmedge.org/docs/)_, a lightweight, high-performance, and extensible WebAssembly runtime. 

Install WasmEdge by running:

```bash
# Running scripts directly via curl | bash has security implications.  
# Carefully examine the script content and only execute if you completely understand and trust the source.
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

Make the installed binary available in the current session:

```bash
source $HOME/.wasmedge/env
```

### Run the Wasm Module

You can use the `wasmedge` command to run the Wasm module:

```bash
wasmedge target/wasm32-wasi/release/http-server.wasm
```

Send a request to the service running locally:

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

## Run Wasm modules in Linux containers

The simplest way to run Wasm modules seamlessly within the current container ecosystems is by embedding the Wasm modules into Linux container images. Next, I will demonstrate how to accomplish this.

Build a Linux container image using the compiled Wasm module. I'll explain doing that using Docker, which is a really common way to make container images. Create a _Dockerfile_ named `Dockerfile-wasmedge-slim` in the root directory of the `http-server` project. In the Dockerfile, include the Wasm module in a slim Linux image with wasmedge installed, and execute the Wasm module using the `wasmedge` command.

```yaml
FROM wasmedge/slim-runtime:0.10.1
COPY target/wasm32-wasi/release/http-server.wasm /
CMD ["wasmedge", "--dir", ".:/", "/http-server.wasm"]
```

Build the container image:

```bash
# replace cr7258 with your own Docker Hub repository name
docker build -f Dockerfile-wasmedge-slim -t cr7258/wasm-demo-app:slim .
```

To test the code locally, I'll run the container using Docker:

```bash
docker run -itd -p 8080:8080 \
--name wasm-demo-app \
docker.io/cr7258/wasm-demo-app:slim
```

Send a request to the service running in the local test container:

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

## Run Wasm modules in container runtimes that have Wasm support

In the last section, I showcased how to embed Wasm modules into a Linux container to run Wasm modules. Next, I will demonstrate how to run Wasm modules directly using a container runtime with Wasm support from the perspective of both low-level and high-level container runtimes. This approach provides better security and performance.

Before running a Wasm module, build it into an image without a Linux OS. _scratch_ is the most minimal base image reserved in Docker. The Dockerfile looks like this:

```bash
FROM scratch
COPY target/wasm32-wasi/release/http-server.wasm /
CMD ["/http-server.wasm"]
```

Build the container image. The image created this time is approximately only 1/4 the size of the previously built `wasm-demo-app:slim` image.

```bash
# replace cr7258 with your own Docker Hub repository name
docker build -t docker.io/cr7258/wasm-demo-app:v1 .
```

To make it easier to use in the following demos, push the image to Docker Hub. Replace the repo with your own.

```bash
# replace cr7258 with your own Docker Hub repository name
docker push docker.io/cr7258/wasm-demo-app:v1
```

Next, I will individually demonstrate how to run Wasm modules through both low-level and high-level container runtimes.

### Run Wasm modules via low-level container runtimes

_[Crun](https://github.com/containers/crun)_ is a fast and lightweight OCI container runtime written in C, which has built-in support for WasmEdge. In this section, I will demonstrate how to utilize crun to directly launch a Wasm module using the provided config.json and rootfs files, without depending on high-level container runtimes.

{{< note >}}
Ensure that you have installed WasmEdge as instructed in the section: [Install WasmEdge](#install-wasmedge).
{{< /note >}}

Install the necessary dependencies for the compilation.

```shell
apt update
apt install -y make git gcc build-essential pkgconf libtool \
     libsystemd-dev libprotobuf-c-dev libcap-dev libseccomp-dev libyajl-dev \
     go-md2man libtool autoconf python3 automake
```

Configure, build, and install a `crun` binary that includes WasmEdge support:

```shell
git clone https://github.com/containers/crun
cd crun
./autogen.sh
./configure --with-wasmedge
make
make install
```

Run `crun -v` to check if the installation was successful. 

```bash
crun -v
```

Seeing `+WASM:wasmedge` indicates that WasmEdge has been installed in crun.

```
crun version 1.8.5.0.0.0.23-3856
commit: 385654125154075544e83a6227557bfa5b1f8cc5
rundir: /run/crun
spec: 1.0.0
+SYSTEMD +SELINUX +APPARMOR +CAP +SECCOMP +EBPF +WASM:wasmedge +YAJL
```

Create a directory to store the files and directories required for running the container (`config.json` and `rootfs`),
then copy in the root filesystem:

```bash
mkdir test-crun
cd test-crun
mkdir rootfs
# Copy the compiled Wasm module to the rootfs directory, replace it with the appropriate directory path for your system.
cp ~/hands-on-lab/wasm/runtime/http-server/target/wasm32-wasi/release/http-server.wasm rootfs
```

Run `crun spec` command to generate the default `config.json` configuration file, and then make the following modifications:
- Replace `sh` with `/http-server.wasm` in the `args` field.
- Add `"module.wasm.image/variant": "compat"` in the `annotations` field to indicate that this is a Wasm application without a guest OS.
- Add `"path": "/proc/1/ns/net"` in `network namespace` to allow the program to share the network namespace with the host machine. This will allow us to access the container locally.

The configuration file should look like this after modifications:

```json
{
	"ociVersion": "1.0.0",
	"process": {
		"terminal": true,
		"user": {
			"uid": 0,
			"gid": 0
		},
		"args": [
			"/http-server.wasm"
		],
		"env": [
			"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
			"TERM=xterm"
		],
		"cwd": "/",
		"capabilities": {
			"bounding": [
				"CAP_AUDIT_WRITE",
				"CAP_KILL",
				"CAP_NET_BIND_SERVICE"
			],
			"effective": [
				"CAP_AUDIT_WRITE",
				"CAP_KILL",
				"CAP_NET_BIND_SERVICE"
			],
			"inheritable": [
			],
			"permitted": [
				"CAP_AUDIT_WRITE",
				"CAP_KILL",
				"CAP_NET_BIND_SERVICE"
			],
			"ambient": [
				"CAP_AUDIT_WRITE",
				"CAP_KILL",
				"CAP_NET_BIND_SERVICE"
			]
		},
		"rlimits": [
			{
				"type": "RLIMIT_NOFILE",
				"hard": 1024,
				"soft": 1024
			}
		],
		"noNewPrivileges": true
	},
	"root": {
		"path": "rootfs",
		"readonly": true
	},
	"hostname": "crun",
	"mounts": [
		{
			"destination": "/proc",
			"type": "proc",
			"source": "proc"
		},
		{
			"destination": "/dev",
			"type": "tmpfs",
			"source": "tmpfs",
			"options": [
				"nosuid",
				"strictatime",
				"mode=755",
				"size=65536k"
			]
		},
		{
			"destination": "/dev/pts",
			"type": "devpts",
			"source": "devpts",
			"options": [
				"nosuid",
				"noexec",
				"newinstance",
				"ptmxmode=0666",
				"mode=0620",
				"gid=5"
			]
		},
		{
			"destination": "/dev/shm",
			"type": "tmpfs",
			"source": "shm",
			"options": [
				"nosuid",
				"noexec",
				"nodev",
				"mode=1777",
				"size=65536k"
			]
		},
		{
			"destination": "/dev/mqueue",
			"type": "mqueue",
			"source": "mqueue",
			"options": [
				"nosuid",
				"noexec",
				"nodev"
			]
		},
		{
			"destination": "/sys",
			"type": "sysfs",
			"source": "sysfs",
			"options": [
				"nosuid",
				"noexec",
				"nodev",
				"ro"
			]
		},
		{
			"destination": "/sys/fs/cgroup",
			"type": "cgroup",
			"source": "cgroup",
			"options": [
				"nosuid",
				"noexec",
				"nodev",
				"relatime",
				"ro"
			]
		}
	],
	"annotations": {
		"module.wasm.image/variant": "compat"
	},
	"linux": {
		"resources": {
			"devices": [
				{
					"allow": false,
					"access": "rwm"
				}
			]
		},
		"namespaces": [
			{
				"type": "pid"
			},
			{
				"type": "network",
				"path": "/proc/1/ns/net"
			},
			{
				"type": "ipc"
			},
			{
				"type": "uts"
			},
			{
				"type": "cgroup"
			},
			{
				"type": "mount"
			}
		],
		"maskedPaths": [
			"/proc/acpi",
			"/proc/asound",
			"/proc/kcore",
			"/proc/keys",
			"/proc/latency_stats",
			"/proc/timer_list",
			"/proc/timer_stats",
			"/proc/sched_debug",
			"/sys/firmware",
			"/proc/scsi"
		],
		"readonlyPaths": [
			"/proc/bus",
			"/proc/fs",
			"/proc/irq",
			"/proc/sys",
			"/proc/sysrq-trigger"
		]
	}
}
```

Start the container using `crun`:

```shell
crun run wasm-demo-app
```

Send a request to the demo service in that container:

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

To delete the container, you can execute the following command:

```bash
crun kill wasm-demo-app SIGKILL
```

### Run Wasm modules via high-level container runtimes

The _container shim_ serves as a bridge between high-level and low-level container runtimes. Its main purpose is to abstract low-level runtime details, enabling uniform management of various low-level runtimes in high-level runtime. In this section, I will use _[containerd](https://github.com/containerd/containerd)_ as an example. Containerd is an industry-standard container runtime with an emphasis on simplicity, robustness, and portability. 

Containerd can manage Wasm modules in two ways:
1. Manages Wasm modules through container runtimes like crun and youki that support building with the Wasm runtime library. These two runtimes can also run regular Linux containers. Containerd uses `containerd-shim-runc-v2` to interface with low-level container runtimes.
1. Manages Wasm modules directly through Wasm runtimes, such as Slight, Spin, WasmEdge, and Wasmtime. Containerd uses `containerd-wasm-shim(runwasi)` to interface with Wasm runtimes.

#### Containerd + Crun

In this section, I will demonstrate how to configure crun as runtime in containerd, enabling support for running Wasm modules.

{{< note >}}
Ensure that crun binary with Wasm support has been installed as per the instructions in the section: [Run Wasm modules via low-level container runtimes](#run-wasm-modules-via-low-level-container-runtimes).
{{< /note >}}

Run the following commands to install containerd:

```shell
export VERSION="1.7.3"
sudo apt install -y libseccomp2
sudo apt install -y wget

wget https://github.com/containerd/containerd/releases/download/v${VERSION}/cri-containerd-cni-${VERSION}-linux-amd64.tar.gz
wget https://github.com/containerd/containerd/releases/download/v${VERSION}/cri-containerd-cni-${VERSION}-linux-amd64.tar.gz.sha256sum
# expected checksum: ea70faeb6c5d656fa0787dfc7d88a48daf961482c46bb22953cb5396289fd5b8
sha256sum --check cri-containerd-cni-${VERSION}-linux-amd64.tar.gz.sha256sum

sudo tar --no-overwrite-dir -C / -xzf cri-containerd-cni-${VERSION}-linux-amd64.tar.gz
sudo systemctl daemon-reload
sudo systemctl enable containerd --now
```

You can run Wasm modules through containerd:
- `--runc-binary`: Specifies to use `crun` as low-level runtime to start the container.
- `--runtime`: Specifies the version and name of the shim, which are converted by containerd into the binary name of the shim. For example: `io.containerd.runc.v2` → `containerd-shim-runc-v2`. Containerd starts the shim by running the `containerd-shim-runc-v2` binary file, which subsequently invokes `crun` to launch the container.
- `--label`: Adds `"module.wasm.image/variant": "compat"` to indicate that this is a Wasm application without a guest OS.

```bash
# Pull the image
ctr i pull docker.io/cr7258/wasm-demo-app:v1 

# Run the container
ctr run --rm --net-host \
--runc-binary crun \
--runtime io.containerd.runc.v2 \
--label module.wasm.image/variant=compat \
docker.io/cr7258/wasm-demo-app:v1 \
wasm-demo-app
```

Send a request to the demo service in that container:

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

To delete the container, you can execute the following command.

```bash
ctr task kill wasm-demo-app --signal SIGKILL
```

#### Containerd + Runwasi

_[Runwasi](https://github.com/containerd/runwasi)_ is a library written in Rust and is a subproject of containerd. With runwasi, you can write a containerd wasm shim for integrating with Wasm runtimes, which facilitates running Wasm modules managed by containerd directly. There are several containerd wasm shims developed using runwasi, including:
- WasmEdge, Wasmtime and Wasmer, you can find them in the [runwasi](https://github.com/containerd/runwasi/tree/main/crates) repository.
- Spin, Slight, Wasm Workers Server, and Lunatic, you can find them in the [containerd-wasm-shims](https://github.com/deislabs/containerd-wasm-shims) repository.

{{< figure src="01-runwasi-is-the-bridge-between-containerd-and-wasm-runtime.svg" alt="The diagram illustrates that runwasi facilitates integrating Wasm runtimes like WasmEdge, Wasmtime and Wasmer with containerd, enabling containerd to directly manage Wasm modules." caption="Figure 1: Runwasi is the bridge between containerd and a Wasm runtime" >}}

In this article, I use WasmEdge containerd shim to run the Wasm modules. 

Clone the runwasi repository.

```bash
git clone https://github.com/containerd/runwasi.git
cd runwasi
```

Install the necessary dependencies for compilation.

```bash
sudo apt-get -y install    \
      pkg-config          \
      libsystemd-dev      \
      libdbus-glib-1-dev  \
      build-essential     \
      libelf-dev          \
      libseccomp-dev      \
      libclang-dev        \
      libssl-dev
```

Build and install the shims.

```
make build
sudo make install
```

Specify `--runtime=io.containerd.wasmedge.v1` to run the Wasm module through WasmEdge shim.

```bash
ctr run --rm --net-host \
--runtime=io.containerd.wasmedge.v1 \
docker.io/cr7258/wasm-demo-app:v1 \
wasm-demo-app
```

Send a request to the demo service in that container:

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

To delete the container, you can execute the following command.

```bash
ctr task kill wasm-demo-app --signal SIGKILL
```

## Run Wasm modules on container management platforms

### Run Wasm modules on Docker Desktop

When you're developing software, you want to try it out locally as well as in the cloud. I'll use Docker Desktop as an example of a tool you can use to run your code locally inside a container.

Docker Desktop also uses runwasi to support the Wasm module. Follow the instructions in the [Docker Wasm documentation](https://docs.docker.com/desktop/wasm/#turn-on-wasm-workloads) to enable Wasm support on Docker Desktop.

Use the following `docker run` command to start a Wasm container on your system. `--runtime=io.containerd.wasmedge.v1` informs the Docker engine that you want to use the Wasm containerd shim instead of the standard Linux container runtime.

```bash
docker run -d -p 8080:8080 \
--name=wasm-demo-app \
--runtime=io.containerd.wasmedge.v1 \
docker.io/cr7258/wasm-demo-app:v1
```

Send a request to the demo service in that container:

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

To delete the container, you can execute the following command:

```bash
docker rm -f wasm-demo-app
```

### Run Wasm modules on Kubernetes

To run Wasm workloads on Kubernetes, worker nodes need to be bootstrapped with a Wasm runtime, and RuntimeClass objects are used to assign workloads to nodes with Wasm support.

_[Kind](https://kind.sigs.k8s.io/)_ (Kubernetes in Docker) is a tool for running local Kubernetes clusters using local containers as "nodes", usually within Docker. To facilitate the experiments, use kind to create a Kubernetes cluster for use in the following sections. Run the following command to install kind:

```bash
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

#### Set up your cluster for Wasm manually, then run the app inside a pod

In this section, I will demonstrate the manual installation of crun with the WasmEdge runtime library, and adjust containerd config to use crun as the runtime, enabling Wasm support on the Kubernetes node.

Create a single-node Kubernetes cluster using kind.

```bash
kind create cluster --name wasm-demo
```

Each Kubernetes node created by kind is a container, typically running within Docker. you can enter that node using the `docker exec` command.

```bash
docker exec -it wasm-demo-control-plane bash
```

{{< note >}}
After entering a shell on the node, follow the instructions in the section: [Run Wasm modules via low-level container runtimes](#run-wasm-modules-via-low-level-container-runtimes) to install the crun binary with Wasm support on the node.
{{< /note >}}

Modify the containerd configuration file `/etc/containerd/config.toml`, add the following content at the end:
- Configure `crun` as the runtime handler for containerd. The format is `[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]`.
- `pod_annotations` allows passing the annotation `module.wasm.image/variant` to crun, which is set in Pod metadata to identify the Wasm workload. 

```bash
cat >> /etc/containerd/config.toml << EOF
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.crun]
    runtime_type = "io.containerd.runc.v2"
    pod_annotations = ["module.wasm.image/variant"]
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.crun.options]
    BinaryName = "crun"
EOF
```

Restart containerd:

```bash
systemctl restart containerd
```

Set the label `runtime=crun` on the node:

```bash
kubectl label nodes wasm-demo-control-plane runtime=crun
```

Create a RuntimeClass resource named `crun` to use the pre-configured `crun` handler in containerd, the `scheduling.nodeSelector` property sends pod to nodes with the `runtime=crun` label. 

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: crun
scheduling:
  nodeSelector:
    runtime: crun
handler: crun
```

Next, run the Wasm app inside a Kubernetes pod. Set `.spec.runtimeClassName` for the pod to target the pod at the `crun` RuntimeClass. This will ensure the pod gets assigned to a node and runtime specified in the `crun` RuntimeClass. Additionally, set the annotation `module.wasm.image/variant: compat` to inform crun that this is a Wasm workload.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: wasm-demo-app
  annotations:
    module.wasm.image/variant: compat
spec:
  runtimeClassName: crun
  containers:
  - name: wasm-demo-app
    image: docker.io/cr7258/wasm-demo-app:v1
```

You can use `kubectl port-forward` to forward traffic from your local machine into the Kubernetes cluster:

```bash
kubectl port-forward pod/wasm-demo-app 8080:8080
```

Open a new terminal, send a request to the service.

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

Once the testing is complete, you can destroy the cluster by running:

```bash
kind delete cluster --name wasm-demo
```

In this article, the `module.wasm.image/variant: compat` annotation is used to indicate to the container runtime that the workload is a Wasm workload. In this [PR](https://github.com/containers/crun/pull/886), crun has introduced a new annotation: `module.wasm.image/variant: compat-smart`. 

When the `compat-smart` annotation is used, crun can intelligently determine how to start the container based on whether it is a Wasm workload or an OCI container. That makes it possible to run WASM containers with sidecars. Here is an example of a Pod YAML file with a Wasm container and a Linux container:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: wasm-demo-app
  annotations:
    module.wasm.image/variant: compat-smart # Kubernetes copies Pod annotations to container runtime labels, which is why this works.
spec:
  runtimeClassName: crun
  containers:
  - name: wasm-demo-app
    image: docker.io/cr7258/wasm-demo-app:v1
  - name: linux-demo-app
    image: nginx:1.20
```

#### Set up your cluster for Wasm automatically using Kwasm, then run the app inside a pod

_[Kwasm](https://kwasm.sh/)_ is a Kubernetes Operator that automatically adds WebAssembly support to your Kubernetes nodes. In this section, I will demostrate how to use Kwasm Operator to add Wasm support to Kubernetes nodes automatically. 

To enable Wasm support on a particular node, simply add the annotation `kwasm.sh/kwasm-node=true` on that node. This will trigger Kwasm to create a Job to deploy the necessary binary files needed to run Wasm on the node. Additionally, containerd's configuration will be modified accordingly.

{{< figure src="02-kwasm-operator.svg" alt="The diagram illustrates that when Kwasm Operator detects the annotation kwasm.sh/kwasm-node=true on a Kubernetes node, it will create a Job to enable Wasm support on that node." caption="Figure 2: Kwasm Operator" >}}

Create a single-node Kubernetes cluster using kind.

```bash
kind create cluster --name kwasm-demo
```

A Helm chart is available to easily install the Kwasm operator. Install the Kwasm Operator using helm and enable Wasm support for the node `kwasm-demo-control-plane` by adding the annotation `kwasm.sh/kwasm-node=true`.

```bash
# Add Helm repository if not already done
helm repo add kwasm http://kwasm.sh/kwasm-operator/
# Install KWasm operator
helm install -n kwasm --create-namespace kwasm-operator kwasm/kwasm-operator
# Provision Nodes
kubectl annotate node kwasm-demo-control-plane kwasm.sh/kwasm-node=true
```

Add label `runtime=wasmedge` on the node.

```bash
kubectl label nodes kwasm-demo-control-plane runtime=wasmedge
```

kwasm-node-installer version v0.3.0 has removed crun in favor of the WasmEdge shim. The WasmEdge shim has the same behavior as the `module.wasm.image/variant: compat-smart` annotation for crun + Wasmedge, but no annotation is required. 

Create a RuntimeClass resource named `wasmedge` to use the wasmedge handler automatically set up by Kwasm in containerd, the `scheduling.nodeSelector` property sends pod to nodes with the `runtime=wasmedge` label. 

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: wasmedge
scheduling:
  nodeSelector:
    runtime: wasmedge
handler: wasmedge
```

Next, run the Wasm app inside a Kubernetes pod. Set `.spec.runtimeClassName` for the pod to target the pod at the `wasmedge` RuntimeClass. This will ensure the pod gets assigned to a node and runtime specified in the `wasmedge` RuntimeClass. 

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: wasm-demo-app
spec:
  runtimeClassName: wasmedge
  containers:
  - name: wasm-demo-app
    image: docker.io/cr7258/wasm-demo-app:v1
```

You can use `kubectl port-forward` to forward traffic from your local machine into the Kubernetes cluster:

```bash
kubectl port-forward pod/wasm-demo-app 8080:8080
```

Open a new terminal, send a request to the service.

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

Once the testing is complete, you can destroy the cluster by running:

```bash
kind delete cluster --name kwasm-demo
```

## Conclusion

As WebAssembly continues to evolve, its adoption in Kubernetes represents a significant step forward in the Cloud Native application development.

Thank you for reading this article. I hope it was useful to understand the potential of WebAssembly and how it can work with container ecosystems. 