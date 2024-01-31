---
layout: blog
title: "WebAssembly on Kubernetes: From Containers to Wasm"
date: 2024-01-26
slug: webassembly-on-kubernetes-from-containers-to-wasm
---

**Author:** Seven Cheng (SAP)

_[WebAssembly](https://webassembly.org/)_ (Wasm) was originally created for the browser, and it has become increasingly popular on the server-side as well. In my view, WebAssembly is gaining popularity in the Cloud Native ecosystem due to its advantages over containers, including smaller size, faster speed, enhanced security, and greater portability.

In this article, I will provide a brief introduction to WebAssembly and explain its advantages. Additionally, I will discuss how Wasm modules can be executed using container toolings, including low-level container runtimes, high-level container runtimes, and Kubernetes.

## What is WebAssembly?

WebAssembly is a universal bytecode technology that allows programs written in various languages like Go, Rust, and C/C++ to be compiled into bytecode, which can be executed directly within web browsers and servers.

{{< figure src="01-webassembly-runs-on-browser-and-server.svg" alt="The diagram illustrates how programs written in languages like Go, Rust and C/C++ can be compiled to WebAssembly bytecode to run efficiently across browsers and servers." caption="Figure 1: WebAssembly runs on browser and server" >}}

WebAssembly is designed from the ground up to solve the performance problem of JavaScript. With WebAssembly, developers can compile code to a low-level binary format that can be executed by modern web browsers at near-native speeds.

In March 2019, Mozilla announced the _WebAssembly System Interface (_WASI_),_ an API specification that defines a standard interface between WebAssembly modules and their host environments. WASI allows Wasm modules to access system resources securely, including the network, filesystem, etc. This extremely expanded Webassembly's potential by enabling it to work not only in browsers but also on servers.

## The advantages of WebAssembly

WebAssembly stands out with several remarkable benefits over traditional containers:
- **Fast**: Wasm modules typically start within milliseconds, significantly faster than traditional containers, which is crucial for workloads requiring rapid startup, such as serverless functions.
- **Lightweight**: Compared to container images, Wasm modules generally occupy less space and demand fewer CPU and memory resources.
- **Secure**: Wasm modules run in a strict sandbox environment, isolated from the underlying host operating system, reducing potential security vulnerabilities.
- **Portable**: Wasm modules can run seamlessly across various platforms and CPU architectures, eliminating the need to maintain multiple container images tailored for different OS and CPU combinations.

You can refer to this table for a detailed comparison between WebAssembly and containers: [WebAssembly vs Linux Container](https://wasmedge.org/wasm_linux_container/)。

## Run Wasm modules in Linux containers

An easy method to execute Wasm modules within container ecosystems is to incorporate the Wasm bytecode into the Linux container image. Specifically, the Linux OS inside the container can be pared down to only the components necessary to support the Wasm runtime. Since Wasm modules are housed in standard containers, they can be integrated seamlessly with any existing container ecosystems.

The slimmed Linux OS presents a much smaller attack surface versus a regular Linux OS. Nonetheless, this approach still necessitates the launching of a Linux container. Although the Linux OS is trimmed down, it still takes up 80% of the container's image size.

## Run Wasm modules in container runtimes that have Wasm support

The advantage of embedding the Wasm modules into the Linux container is that it allows for seamless integration with existing environments while also benefiting from the performance improvements brought by Wasm. However, compared to running Wasm modules directly in Wasm-supported container runtimes, this method is less efficient and secure.

Generally, container runtimes can be categorized into two levels: high-level runtimes and low-level runtimes.
- **Low-level Container Runtime**: This refers to OCI-compliant implementations that can receive a runnable filesystem (rootfs) and a configuration file (config.json) to execute isolated processes. Low-level container runtimes directly manage and run containers, such as runc, crun, youki, gvisor, and kata.
- **High-level Container Runtime**: This is responsible for the transport and management of container images, unpacking the image, and passing it off to the low-level runtime to run the container. High-level container runtimes simplify container management by abstracting the complexities of low-level runtime, which allows users to manage various low-level runtimes through the same high-level runtime. Containerd and CRI-O are two popular high-level container runtimes.

{{< figure src="02-high-level-and-low-level-container-runtimes.svg" alt="The diagram illustrates high-level runtimes like containerd and CRI-O receiving API requests from container management platforms like Kubernetes and Docker, and calling low-level runtimes conforming to OCI specification such as crun and youki, which directly manage containers." caption="Figure 2: High-level and low-level container runtimes" >}}

We can enable Wasm support in both low-level and high-level container runtimes. 
When running Wasm modules directly via low-level container runtimes, there are several options available, such as crun and youki, which come with built-in support for Wasm.

When running Wasm modules through high-level container runtimes, both CRI-O and containerd are great options. There are two possible approaches: 
- One is that the high-level runtime still depends on low-level runtimes, invoking the low-level runtime to execute the Wasm module. 
- The other approach is that containerd has a subproject called _[runwasi](https://github.com/containerd/runwasi)_, which enables developing a containerd-wasm-shim that interacts directly with the Wasm runtime such as WasmEdge and Wasmtime. This allows containerd to run Wasm modules without relying on low-level runtimes, but rather by invoking the Wasm runtime directly. This not only shortens the invocation path, but also improves efficiency.

{{< figure src="03-use-containerd-shim-to-manage-wasm-modules.svg" alt="The diagram illustrates that containerd can manage WebAssembly modules in two ways: through container runtimes that support building with the WebAssembly runtime library via the containerd-shim-runc-v2, or directly through WebAssembly runtimes like WasmEdge and Wasmtime using the containerd-wasm-shim." caption="Figure 3: Use containerd shim to manage Wasm modules" >}}

## Run Wasm modules on Kubernetes

WebAssembly is driving the third wave of cloud computing. As the de facto standard in the realm of container orchestration, Kubernetes continuously evolves to leverage the advantages brought about by WebAssembly.

To run Wasm workloads on Kubernetes, two key components are needed:
- Worker nodes bootstrapped with a Wasm runtime. This setup can be achieved by integrating high-level container runtimes such as containerd and CRI-O with lower-level runtimes like crun and youki that support Wasm.
- RuntimeClass objects mapping to nodes with a WebAssembly runtime. RuntimeClass addresses the problem of having multiple container runtimes in a Kubernetes cluster, where some nodes might support a Wasm runtime while others support regular container runtimes. You can use RuntimeClass to schedule Wasm workloads specifically to nodes with Wasm runtimes.

{{< figure src="04-associate-with-wasm-nodes-using-runtimeclass.svg" alt="The diagram illustrates that we can assign Wasm workloads to the nodes with Wasm support using RuntimeClass." caption="Figure 4: Associate with Wasm nodes using RuntimeClass" >}}

To enable Wasm support on Kubernetes nodes, we can use the Kwasm Operator to automate the process instead of manually installing a container runtime with the Wasm runtime library. _[Kwasm](https://kwasm.sh/)_ is a Kubernetes Operator that automatically adds WebAssembly support to your Kubernetes nodes. The operator uses the _[kwasm-node-installer](https://github.com/KWasm/kwasm-node-installer)_ project to modify the underlying Kubernetes nodes.

## Conclusion

WebAssembly provides a fast, efficient, and secure way for executing code, while Kubernetes serves as a powerful container orchestration platform. "Cloud Native WebAssembly" uses Wasm on servers and in the cloud, employing orchestration tools like Kubernetes for the deployment and management of Wasm applications. By combining these technologies, we can create Cloud Native applications that are flexible, high-performance, scalable, and secure. This convergence opens up exciting possibilities for innovation, enabling the development of advanced serverless architectures, edge computing solutions, and more, while ensuring compatibility and portability across different environments.
