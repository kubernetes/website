# Kubernetes API Reference Dynamic Redirects

This directory contains scripts to automatically generate dynamic redirects for the Kubernetes API reference documentation.

## Problem

The Kubernetes website needs to provide a stable URL (`/docs/reference/generated/kubernetes-api/latest/`) that automatically redirects to the latest version of the API reference (e.g., `/docs/reference/generated/kubernetes-api/v1.33/`).

## Solution

### Scripts

1. **`generate-api-redirects.sh`** - Main script that:
   - Reads the latest version from `hugo.toml`
   - Updates the `static/_redirects` file with the appropriate redirect rule
   - Removes any existing redirect to prevent duplicates
   - Validates version format and file existence

2. **`test-api-redirects.sh`** - Test script that validates the redirect generation works correctly

### Integration

The redirect generation is integrated into the build process via the `Makefile`. The script runs automatically during:
- `make build`
- `make production-build` 
- `make non-production-build`
- `make deploy-preview`

### Hugo Shortcode

A Hugo shortcode `api-reference-link` is provided to generate version-aware API reference links:

```hugo
{{< api-reference-link >}}                    <!-- /docs/reference/generated/kubernetes-api/latest/ -->
{{< api-reference-link version="latest" >}}   <!-- /docs/reference/generated/kubernetes-api/latest/ -->
{{< api-reference-link version="v1.33" >}}    <!-- /docs/reference/generated/kubernetes-api/v1.33/ -->
```

## Usage

### Manual Execution
```bash
# From the website root directory
./scripts/generate-api-redirects.sh
```

### Testing
```bash
# Run the test suite
./scripts/test-api-redirects.sh
```

### Build Integration
The script runs automatically during builds, but you can also run specific build targets:
```bash
make build                # Includes redirect generation
make production-build     # Includes redirect generation
```

## Configuration

The script reads the latest version from the `latest` parameter in `hugo.toml`:
```toml
latest = "v1.33"
```

## Generated Redirect

The script generates a redirect rule in `static/_redirects`:
```
/docs/reference/generated/kubernetes-api/latest/   /docs/reference/generated/kubernetes-api/v1.33/   301!
```

This redirect:
- Uses HTTP 301 (permanent redirect)
- Includes the `!` flag for Netlify to force the redirect
- Is placed after the header comments in the `_redirects` file

## Validation

The script includes validation for:
- Existence of `hugo.toml` and `static/_redirects` files
- Proper version format (e.g., `v1.33`)
- Prevention of duplicate redirects
- Idempotent execution (can be run multiple times safely)

## Troubleshooting

If the script fails:
1. Ensure you're running from the website root directory
2. Check that `hugo.toml` contains a valid `latest = "v1.xx"` line
3. Verify `static/_redirects` file exists and is writable
4. Run the test script to validate functionality