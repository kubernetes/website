---
title: KYAML Reference
content_type: concept
weight: 40
draft: true
---

<!-- overview -->
**KYAML** is a safer and less ambiguous subset of YAML, initially introduced in Kubernetes v1.34 (alpha) and enabled by default in v1.35 (beta). Designed specifically for Kubernetes, KYAML addresses common YAML pitfalls such as whitespace sensitivity and implicit type coercion while maintaining full compatibility with existing YAML parsers and tooling. 

<!-- body -->
This reference describes KYAML syntax.

## Getting started with KYAML

YAML’s reliance on indentation and implicit type coercion often leads to configuration errors, especially in CI/CD pipelines and templating systems like Helm. KYAML eliminates these issues by enforcing explicit syntax and structure, making configurations more reliable and easier to debug.

### Basic Structure

KYAML uses **flow style** syntax with `{}` for objects and `[]` for arrays. All string values must be **double-quoted**.

```yaml
{
  apiVersion: "v1",
  kind: "Pod",
  metadata: {
    name: "my-pod",
    labels: {
      app: "demo"
    },
  },
  spec: {
    containers: [{
      name: "nginx",
      image: "nginx:1.20"
    }]
  }
}
```

### Explicit String Quoting

All strings must be enclosed in double quotes (`"`) to prevent type coercion issues.

```yaml
{
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    name: "example-config"
  },
  data: {
    country: "NO",       # Always a string, never a boolean
    version: "1.0",      # Always a string, never a number
    enabled: "true"      # Always a string, never a boolean
  }
}
```

For multi-line strings, start with ` `  and enclose in double quotes. To remove left trailing whitespace after a newline `\n` escape it with `\`

```yaml
{
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    name: "script-config"
  },
  data: {
    script.sh: 
      "#!/bin/sh\n\
      echo 'Hello, KYAML!'\n\
      exit 0\n\
      "
  }
}
```

Use `\` to escape special characters in strings.

```yaml
{
  apiVersion: "v1",
  kind: "ConfigMap",
  metadata: {
    name: "special-chars"
  },
  data: {
    message: "Hello, \"KYAML\"!",  # Escaped quotes
    path: "C:\\Program Files\\app"  # Escaped backslashes
  }
}
```

### Numbers and Booleans

Numbers and booleans are written as-is, without quotes.

```yaml
# Fake CRD NumberAndBoolean
{
  apiVersion: "fake.com/v1",
  kind: "NumberAndBoolean",
  metadata: {
    name: "settings"
  },
  data: {
    timeout: 30,       # Integer
    retries: 3,        # Integer
    enabled: true,     # Boolean
    debug: false       # Boolean
  }
}
```

### Objects and Arrays

- **Objects** use `{}` and **key-value pairs** separated by commas.
- **Arrays** use `[]` and elements are separated by commas.


```yaml
---
{
  apiVersion: "v1",
  kind: "Pod",
  metadata: {
    name: "empty-example",
    annotations: {},  # Empty object
    labels: {
      app: "demo"
    }
  },
  spec: {
    containers: [
      {
        name: "init-myservice",
        image: "busybox:1.28",
        command: ["sh", "-c", "echo 'init done'"]
      }
    ],  # Empty array
    initContainers: []
  }
}
```

Trailing commas are **allowed** (and recommended) for both objects and arrays, making diffs cleaner.

```yaml
{
  apiVersion: "v1",
  kind: "Secret",
  metadata: {
    name: "my-secret",
  },  # <-- Trailing comma
  data: {
    username: "YWRtaW4=",  # base64-encoded
    password: "MWYyZDFlMmU2N2Rm",  # base64-encoded
  },  # <-- Trailing comma
}
```

### Comments

KYAML supports **YAML-style comments** (`#`). Comments are ignored by parsers.

```yaml
{
  # This is a KYAML Deployment example
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    name: "nginx-deployment",
    # Labels for the Deployment
    labels: {
      app: "nginx"
    }
  },
  spec: {
    replicas: 3,  # Run 3 replicas
    selector: {
      matchLabels: {
        app: "nginx"
      }
    },
    template: {
      metadata: {
        labels: {
          app: "nginx"
        }
      },
      spec: {
        containers: [
          {
            name: "nginx",
            image: "nginx:1.20",
            ports: [
              {
                containerPort: 80  # Expose port 80
              }
            ]
          }
        ]
      }
    }
  }
}
```

### Examples

Configuration of a nginx Pod in KYAML.

```yaml
---
{
  apiVersion: "v1",
  kind: "Pod",
  metadata: {
    name: "complex-pod",
    annotations: {
      "kubernetes.io/limit-ranger": "LimitRanger plugin set: cpu request",
    },
    labels: {
      app: "complex-app"
    }
  },
  spec: {
    containers: [{
      name: "app",
      image: "nginx:1.20",
      resources: {
        requests: {
          cpu: "100m",
          memory: "128Mi",
        },
      },
      env: [{
        name: "DATABASE_URL",
        value: "postgresql://localhost:5432/mydb",
      }],
      ports: [{
        containerPort: 80  # Port exposed by the container
      }]
    }],
    restartPolicy: "Always",
  },
}
---
{
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    name: "complex-pod-service",
    annotations: {
      "kubernetes.io/service-description": "Service for complex-pod"
    }
  },
  spec: {
    selector: {
      app: "complex-app"  # Must match the Pod's labels
    },
    ports: [
      {
        name: "http",
        port: 80,
        targetPort: 80  # Targets the Pod's containerPort
      }
    ],
    type: "ClusterIP"  # Default type; use "NodePort" or "LoadBalancer" for external access
  }
}
```

## Comparing KYAML with other data formats

### Compared to YAML

KYAML is a **strict subset of YAML**, ensuring backward compatibility. Kubernetes does not require KYAML-formatted input, and there are no plans to enforce its use. It eliminates errors from significant whitespace and indentation. Prevents unexpected type coercion (e.g., "The Norway Bug"), where values like NO or off are incorrectly parsed as booleans.

For example, here is the configuration of a simple Service of a web application in YAML:

```yaml
# Traditional YAML
apiVersion: v1
kind: Service
metadata:
  name: my-service
  labels:
    app: web
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080
```

And its equivalent in KYAML:

```yaml
# KYAML Equivalent
{
  apiVersion: "v1",
  kind: "Service",
  metadata: {
    name: "my-service",
    labels: {
      app: "web",
    },
  },
  spec: {
    selector: {
      app: "web",
    },
    ports: [{
      port: 80,
      targetPort: 8080,
    }],
  },
}
```

### Compared to JSON

KYAML adds support for comments relaxing strict syntax requirements (e.g., trailing commas, quoted keys).


```yaml
{
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    name: "nginx-deployment",
    labels: {
      app: "nginx"
    },
  },
  spec: {
    replicas: 3,
    selector: {
      matchLabels: {
        app: "nginx"
      },
    },
    # NOTE template follows Pod spec
    template: {
      metadata: {
        labels: {
          app: "nginx"
        },
      },
      spec: {
        containers: [{
          name: "nginx",
          image: "nginx:1.20", # TODO change tag to alpine asap
          ports: [{
            containerPort: 80,
          }],
        }],
      },
    },
  },
}
```

```kyaml
{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "nginx-deployment",
    "labels": {
      "app": "nginx"
    }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": {
        "app": "nginx"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "app": "nginx"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "nginx",
            "image": "nginx:1.20",
            "ports": [
              {
                "containerPort": 80
              }
            ]
          }
        ]
      }
    }
  }
}
```

## {{% heading "whatsnext" %}}

More details about KYAML are available under [KEP-5295](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/5295-kyaml/README.md).
