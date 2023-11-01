---
layout: blog
title: "A demo of WebAssembly and WASI on Kubernetes"
date: 2023-11-11
slug: a-demo-of-webassembly-and-wasi-on-kubernetes
---

**Author:** Seven Cheng (SAP)

_[WebAssembly](https://webassembly.org/)_ (Wasm) was originally created for the browser, and it has become increasingly popular on the server-side as well. WebAssembly is gaining popularity in the Cloud Native ecosystem due to its advantages over containers, including smaller size, faster speed, enhanced security, and greater portability. 

In this blog article, I will walk you through building and deploying Wasm applications in the Cloud Native ecosystem.

## What is WebAssembly

WebAssembly is a universal bytecode technology that allows programs written in various languages like Go, Rust, and C/C++ to be compiled into bytecode, which can be executed directly within web browsers and servers.

{{< figure src="01-webassembly-runs-on-browser-and-server.png" alt="The diagram illustrates how programs written in languages like Go, Rust and C/C++ can be compiled to WebAssembly bytecode to run efficiently across browsers and servers." caption="Figure 1: WebAssembly runs on browser and server" >}}

WebAssembly is designed from the ground up to solve the performance problem of JavaScript. With WebAssembly, developers can compile code to a low-level binary format that can be executed by modern web browsers at near-native speeds.

In March 2019, Mozilla announced the WebAssembly System Interface (_WASI_), an API specification that defines a standard interface between WebAssembly modules and their host environments. WASI allows WebAssembly modules to access system resources securely, including the network, filesystem, etc. This extremely expanded Webassembly's potential by enabling it to work not only in browsers but also on servers.

## The Advantages of WebAssembly

WebAssembly stands out with several remarkable benefits over traditional containers:
- **Fast**: Wasm modules typically start within milliseconds, significantly faster than traditional containers, which is crucial for workloads requiring rapid startup, such as serverless functions.
- **Lightweight**: Compared to container images, Wasm modules generally occupy less space and demand fewer CPU and memory resources.
- **Secure**: Wasm modules run in a strict sandbox environment, isolated from the underlying host operating system, reducing potential security vulnerabilities.
- **Portable**: Wasm modules can run seamlessly across various platforms and CPU architectures, eliminating the need to maintain multiple container images tailored for different OS and CPU combinations.

You can refer to this table for a detailed comparison between WebAssembly and containers: [WebAssembly vs Linux Container](https://wasmedge.org/wasm_linux_container/)。

## Develop Wasm Application with Rust

Whether an application can be compiled to Wasm significantly depends on the programming language being used. Languages such as Rust, C, and C++ offer great support for Wasm, and Go provides preliminary support for WASI starting from version 1.21. Prior to this, third-party tools such as tinygo were needed for compilation. Due to Rust’s first-class support for Wasm, I use Rust for developing Wasm applications in this article.

### Install Rust

 Install Rust by running the following command in your terminal.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
### Add wasm32-wasi target for Rust

As mentioned earlier, WASI is a system-level interface for WebAssembly, designed to facilitate interactions between WebAssembly and the host system in various environments. It offers a standardized method enabling WebAssembly to access system-level functionalities such as file I/O, network, and system calls.

_Rustc_ is a cross-platform compiler with many compilation targets, including wasm32-wasi. This target compiles Rust code into Wasm modules that follow the WASI standard. Compiling Rust code to the wasm32-wasi target allows Rust's functionality and safety to be integrated into the WebAssembly environment while leveraging standardized system interfaces provided by wasm32-wasi for interaction with the host system.

Add the `wasm32-wasi` target to the Rust compiler.

```bash
rustup target add wasm32-wasi
```

### Write a Rust Program

Create a new Rust project using `cargo new` command.

```bash
cargo new http-server
```

Edit the `Cargo.toml` file to add the dependencies listed below. _[warp_wasi](https://crates.io/crates/warp_wasi)_ is specifically designed for WASI and is built upon the _[Warp](https://docs.rs/warp/latest/warp/)_ framework, which is a lightweight web server framework used to develop high-performance asynchronous web applications.

```bash
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

Compile the program into a Wasm module, it will be written to the `target/wasm32-wasi/release` directory of project.

```bash
cargo build --target wasm32-wasi --release
```

### Install WasmEdge

The compiled Wasm module requires an appropriate Wasm runtime for execution. Popular choices for this include WasmEdge, Wasmtime, and Wasmer, etc.

In this article, I use _[WasmEdge](https://wasmedge.org/docs/)_, a lightweight, high-performance, and extensible WebAssembly runtime. 

Install WasmEdge.

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
```

Make the installed binary available in the current session.

```bash
source $HOME/.wasmedge/env
```

### Run the Wasm Module

You can use the `wasmedge` command to run the Wasm module. 

```bash
wasmedge target/wasm32-wasi/release/http-server.wasm
```

Send a request to the service.

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

## Run Wasm Modules in the Container Ecosystem

### Run Wasm Modules in Linux Container

An easy way to run Wasm modules in the container ecosystem is to embed the Wasm bytecode file in a Linux container image. Precisely, you can trim down the Linux OS inside the container to the point where it is just enough to support the Wasm runtime. Since Wasm modules are housed in standard containers, they can be integrated seamlessly with any existing container ecosystem.

Compared to a regular Linux OS, the attack surface of the slimmed Linux OS is dramatically reduced. Nonetheless, this approach still necessitates the launching of a Linux container. Although the Linux OS is trimmed down, it still takes up 80% of the container's image size.

Build a Linux container image using the compiled Wasm module. Create a Dockerfile named `Dockerfile-wasmedge-slim` in the root directory of the `http-server` project. In the Dockerfile, include the Wasm module in a slim Linux image with wasmedge installed, and execute the Wasm module using the `wasmedge` command.

```yaml
FROM wasmedge/slim-runtime:0.10.1
COPY target/wasm32-wasi/release/http-server.wasm /
CMD ["wasmedge", "--dir", ".:/", "/http-server.wasm"]
```

Build the container image.

```bash
docker build -f Dockerfile-wasmedge-slim -t cr7258/wasm-demo-app:slim .
```

Start the container.

```bash
docker run -itd -p 8080:8080 \
--name wasm-demo-app \
docker.io/cr7258/wasm-demo-app:slim
```

Send a request to the service.

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

### Run Wasm Modules in Wasm-Supported Container Runtimes

In the last section, I showcased how to embed Wasm modules directly into a Linux container to run Wasm modules. The advantage of this approach is that it allows for seamless integration with existing environments while also benefiting from the performance improvements brought by Wasm. However, compared to running Wasm modules directly in Wasm-supported container runtimes, this method is less efficient and secure.

Next, I will introduce how to run Wasm modules in Wasm-supported container runtimes. Generally, container runtimes can be categorized into two levels: high-level runtimes and low-level runtimes.
- **Low-level Container Runtime**: This refers to OCI-compliant implementations that can receive a runnable filesystem (rootfs) and a configuration file (config.json) to execute isolated processes. Low-level container runtimes directly manage and run containers, such as runc, crun, youki, gvisor, and kata.
- **High-level Container Runtime**: This is responsible for the transport and management of container images, unpacking the image, and passing it off to the low-level runtime to run the container. High-level container runtimes simplify container management by abstracting the complexities of low-level runtime, which allows users to manage various low-level runtimes via the same high-level runtime. Containerd and CRI-O are two popular high-level container runtimes.

{{< figure src="02-high-level-and-low-level-container-runtimes.png" alt="The diagram illustrates high-level runtimes like containerd and CRI-O receiving API requests from container management platforms like Kubernetes and Docker, and calling low-level runtimes conforming to OCI specification such as crun and youki, which directly manage containers." caption="Figure 2: High-level and low-level container runtimes" >}}

Before running a Wasm module, build it into an image without a Linux OS. _scratch_ is the most minimal base image reserved in Docker. The Dockerfile looks like this:

```bash
FROM scratch
COPY target/wasm32-wasi/release/http-server.wasm /
CMD ["/http-server.wasm"]
```

Build the container image.

```bash
docker build -t docker.io/cr7258/wasm-demo-app:v1 .
```

To make it easier to use in the following tutorials, push the image to Docker Hub. Replace the repo  with your own.

```bash
docker push docker.io/cr7258/wasm-demo-app:v1
```

On Docker Hub, you can notice that the size of the image created this time is only 989.89 KB (after compression), which is only a quarter of the size of the previously built `wasm-demo-app:slim` image.

{{< figure src="03-wasm-module-image-vs-linux-container-image.png" alt="The diagram shows the size of the WebAssembly module image is a quarter of the Linux container image for the same application." caption="Figure 3: Wasm module image compared to Linux container image" >}}

Next, I will individually demonstrate how to run Wasm modules through both low-level and high-level container runtimes.

#### Low-level Container Runtime

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

Configure, build, and install a crun binary with WasmEdge support.

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

```bash
crun version 1.8.5.0.0.0.23-3856
commit: 385654125154075544e83a6227557bfa5b1f8cc5
rundir: /run/crun
spec: 1.0.0
+SYSTEMD +SELINUX +APPARMOR +CAP +SECCOMP +EBPF +WASM:wasmedge +YAJL
```

Create a directory to store the files required for running the container. (config.json and rootfs)

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

Start the container using crun. 

```shell
crun run wasm-demo-app
```

Send a request to the service.

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

#### High-level Container Runtime

The _container shim_ serves as a bridge between high and low-level container runtimes. Its main purpose is to abstract low-level runtime details, enabling uniform management of various runtimes in high-level runtime. In this section, I will use _[containerd](https://github.com/containerd/containerd)_ as an example. Containerd is an industry-standard container runtime with an emphasis on simplicity, robustness, and portability. 

Containerd can manage Wasm modules in two ways:
- 1.Manages Wasm modules through container runtimes like crun and youki that support building with the Wasm runtime library. These two runtimes can also run regular Linux containers. Containerd uses `containerd-shim-runc-v2` to interface with low-level container runtimes.
- 2.Manages Wasm modules directly through Wasm runtimes, such as WasmEdge, Wasmtime, Spin, and Slight. Containerd uses `containerd-wasm-shim(runwasi)` to interface with Wasm runtimes.

{{< figure src="04-use-containerd-shim-to-manage-wasm-modules.png" alt="The diagram illustrates that containerd can manage WebAssembly modules in two ways: through container runtimes that support building with the WebAssembly runtime library via the containerd-shim-runc-v2, or directly through WebAssembly runtimes like WasmEdge and Wasmtime using the containerd-wasm-shim." caption="Figure 4: Use containerd shim to manage Wasm modules" >}}

##### Containerd + Crun

In this section, I will demonstrate how to configure crun as runtime in containerd, enabling support for running Wasm modules.

{{< note >}}
Ensure that crun binary has been installed as per the instructions in the section: [Low-level Container Runtime](#low-level-container-runtime).
{{< /note >}}

Run the following commands to install containerd.

```shell
export VERSION="1.7.3"
sudo apt install -y libseccomp2
sudo apt install -y wget

wget https://github.com/containerd/containerd/releases/download/v${VERSION}/cri-containerd-cni-${VERSION}-linux-amd64.tar.gz
wget https://github.com/containerd/containerd/releases/download/v${VERSION}/cri-containerd-cni-${VERSION}-linux-amd64.tar.gz.sha256sum
sha256sum --check cri-containerd-cni-${VERSION}-linux-amd64.tar.gz.sha256sum

sudo tar --no-overwrite-dir -C / -xzf cri-containerd-cni-${VERSION}-linux-amd64.tar.gz
sudo systemctl daemon-reload
sudo systemctl start containerd
```

You can run Wasm modules through containerd:
- `--runc-binary`: Specifies to use `crun` as low-level runtime to start the container.
- `--runtime`: Specifies the version and name of the shim, which are converted by containerd into the binary name of the shim: `io.containerd.runc.v2 -> containerd-shim-runc-v2`. Containerd starts the shim by running `containerd-shim-runc-v2` binary file, which subsequently invokes crun to launch the container.
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

Send a request to the service.

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

##### Containerd + Runwasi

_[Runwasi](https://github.com/containerd/runwasi)_ is a library written in Rust and is a subproject of containerd. With runwasi, you can write a containerd wasm shim for integrating with Wasm runtimes, which facilitates running Wasm modules managed by containerd directly. There are several containerd wasm shims developed using runwasi, including:
- WasmEdge, Wasmtime and Wasmer, you can find them in the [runwasi](https://github.com/containerd/runwasi/tree/main/crates) repository.
- Spin, Slight, Wasm Workers Server, and Lunatic, you can find them in the [containerd-wasm-shims](https://github.com/deislabs/containerd-wasm-shims) repository.

{{< figure src="05-runwasi-is-the-bridge-between-containerd-and-wasm-runtime.png" alt="The diagram illustrates that runwasi facilitates integrating Wasm runtimes like WasmEdge, Wasmtime and Wasmer with containerd, enabling containerd to directly manage Wasm modules." caption="Figure 5: Runwasi is the bridge between containerd and a Wasm runtime" >}}

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

Send a request to the service.

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

### Run Wasm modules on Container Management Platforms

#### Run Wasm modules on Docker Desktop

Docker Desktop also uses runwasi to support the Wasm module. To run Wasm modules within Docker Desktop, ensure the following two options are enabled:
- Use containerd for pulling and storing images
- Enable Wasm

{{< figure src="06-enable-wasm-support-on-docker-desktop.png" alt="The diagram shows how to enable Wasm support on Docker Desktop." caption="Figure 6: Enable Wasm support on Docker Desktop" >}}

Click **Apply & restart** to apply the updates. Docker Desktop downloads and installs the following runtimes that can be used to run Wasm modules:
- `io.containerd.slight.v1`
- `io.containerd.spin.v1`
- `io.containerd.wasmedge.v1`
- `io.containerd.wasmtime.v1`

Use the following `docker run` command to start a Wasm container on your system. `--runtime=io.containerd.wasmedge.v1` informs the Docker engine that you want to use the Wasm containerd shim instead of the standard Linux container runtime.

```bash
docker run -d -p 8080:8080 \
--name=wasm-demo-app \
--runtime=io.containerd.wasmedge.v1 \
docker.io/cr7258/wasm-demo-app:v1
```

Send a request to the service.

```bash
curl http://localhost:8080
```

The output is:

```bash
Hello, World!
```

To delete the container, you can execute the following command.

```bash
docker rm -f wasm-demo-app
```

#### Run Wasm modules on Kubernetes

WebAssembly is [driving the third wave of cloud computing](https://nigelpoulton.com/webassembly-the-future-of-cloud-computing/). As the de facto standard in the realm of container orchestration, Kubernetes continuously evolves to leverage the advantages brought about by WebAssembly.

The major way to run Wasm modules on Kubernetes is adding Wasm support to the Kubernetes nodes. To achieve this, we can either manually install a container runtime build with the Wasm runtime library or use the Kwasm Operator to automate the process.

_[Kind](https://kind.sigs.k8s.io/)_ (Kubernetes in Docker) is a tool for running local Kubernetes clusters using Docker containers as "nodes". To facilitate the experiments, use kind to create Kubernetes cluster in the following sections. Run the following command to install Kind.

```bash
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

##### Kubernetes + Containerd + Crun

In this section, I will demonstrate the manual installation of crun with the WasmEdge runtime library, and adjust containerd config to use crun as the runtime, enabling Wasm support on the Kubernetes node.

Create a single-node Kubernetes cluster using kind.

```bash
kind create cluster --name wasm-demo
```

Each Kubernetes node created by kind is a Docker container, you can enter that node using the `docker exec` command.

```bash
docker exec -it  wasm-demo-control-plane bash
```

{{< note >}}
After entering the node, follow the instructions in the section: [Low-level Container Runtime](#low-level-container-runtime) to install crun binary on the node.
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

Restart containerd.

```bash
systemctl restart containerd
```

Create a RuntimeClass resource named `crun` to use the pre-configured crun handler in containerd. Specify the `runtimeClassName` in Pod Spec to use the `crun` RuntimeClass, instructing kubelet to run the Pod with the specified runtime. Additionally, set the annotation `module.wasm.image/variant: compat` to inform crun that this is a Wasm workload.

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: crun
handler: crun
---
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

You can use `port-forward` to forward traffics to your local machine for access.

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

Once the testing is complete, you can destroy the cluster using this command.

```bash
kind delete cluster --name wasm-demo
```
##### KWasm Operator

In this section, I will demostrate how to use Kwasm Operator to add Wasm support to Kubernetes nodes automatically. To enable Wasm support on a particular node, simply add the annotation `kwasm.sh/kwasm-node=true` on that node. This will trigger Kwasm to create a Job to deploy the necessary binary files needed to run Wasm on the node. Additionally, containerd's configuration will be modified accordingly.

{{< figure src="07-kwasm-operator.png" alt="The diagram illustrates that when Kwasm Operator detects the annotation kwasm.sh/kwasm-node=true on a Kubernetes node, it will create a Job to enable Wasm support on that node." caption="Figure 7: Kwasm Operator" >}}

Create a single-node Kubernetes cluster using kind.

```bash
kind create cluster --name kwasm-demo
```

A Helm chart is available to easily install the Kwasm operator. Install the Kwasm Operator using helm and enable Wasm support for all nodes by adding the annotation `kwasm.sh/kwasm-node=true`.

```bash
# Add HELM repository if not already done
helm repo add kwasm http://kwasm.sh/kwasm-operator/
# Install KWasm operator
helm install -n kwasm --create-namespace kwasm-operator kwasm/kwasm-operator
# Provision Nodes
kubectl annotate node --all kwasm.sh/kwasm-node=true
```

Create a RuntimeClass resource named `crun` to use the crun handler automatically set up by Kwasm in containerd. Specify the `runtimeClassName` in Pod spec to use the `crun` RuntimeClass, and set the annotation `module.wasm.image/variant: compat` to inform crun that this is a Wasm workload.

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: crun
handler: crun
---
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

You can use `port-forward` to forward traffics to your local machine for access.

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

Once the testing is complete, you can destroy the cluster using this command.

```bash
kind delete cluster --name kwasm-demo
```

In this article, the `"module.wasm.image/variant": "compat"` annotation is used to indicate to the container runtime that the workload is a Wasm workload. In this [PR](https://github.com/containers/crun/pull/886), crun has introduced a new annotation: `module.wasm.image/variant: compat-smart`. 

When the `compat-smart` annotation is used, crun can intelligently determine how to start the container based on whether it is a Wasm workload or an OCI container. That makes it possible to run WASM containers with sidecars. Here is an example of a Pod YAML file with a Wasm container and a Linux container:

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: crun
handler: crun
---
apiVersion: v1
kind: Pod
metadata:
  name: wasm-demo-app
  annotations:
    module.wasm.image/variant: compat-smart
spec:
  runtimeClassName: crun
  containers:
  - name: wasm-demo-app
    image: docker.io/cr7258/wasm-demo-app:v1
  - name: linux-demo-app
    image: nginx:1.20
```

## Conclusion

WebAssembly provides a fast, efficient, and secure way for executing code, while Kubernetes serves as a powerful container orchestration platform. "Cloud native WebAssembly" uses Wasm on servers and in the cloud, employing orchestration tools like Kubernetes for the deployment and management of Wasm applications. By combining these technologies, we can create Cloud Native applications that are flexible, high-performance, scalable, and secure. This convergence opens up exciting possibilities for innovation, enabling the development of advanced serverless architectures, edge computing solutions, and more, while ensuring compatibility and portability across different environments.
