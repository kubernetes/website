/*
Copyright 2026 The Kubernetes Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// update-feature-gates reads feature gate data from a YAML file
// (test/compatibility_lifecycle/reference/versioned_feature_list.yaml in kubernetes/kubernetes)
// and updates the corresponding markdown files in the website repository.
//
// Usage:
//
//	go run ./scripts/releng/update-feature-gates /path/to/versioned_feature_list.yaml
//
// The tool preserves existing descriptions in the markdown files and only
// updates the YAML front matter with the latest stage information.
package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"go.yaml.in/yaml/v2"
)

// FeatureGateYAML represents a feature gate from the YAML input.
type FeatureGateYAML struct {
	Name           string          `yaml:"name"`
	VersionedSpecs []VersionedSpec `yaml:"versionedSpecs"`
}

// VersionedSpec represents a versioned specification of a feature gate.
type VersionedSpec struct {
	Default       bool   `yaml:"default"`
	LockToDefault bool   `yaml:"lockToDefault"`
	PreRelease    string `yaml:"preRelease"` // Alpha, Beta, GA, Deprecated
	Version       string `yaml:"version"`
}

const defaultFeatureGatesDir = "content/en/docs/reference/command-line-tools-reference/feature-gates"

// placeholderGates tracks feature gates with FIXME placeholders.
var placeholderGates []string

func main() {
	var outputDir string
	flag.StringVar(&outputDir, "output-dir", defaultFeatureGatesDir, "Directory containing feature gate markdown files")
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: %s [flags] <versioned_feature_list.yaml>\n\n", os.Args[0])
		fmt.Fprintf(os.Stderr, "Updates feature gate markdown files from YAML data.\n\n")
		fmt.Fprintf(os.Stderr, "Flags:\n")
		flag.PrintDefaults()
	}
	flag.Parse()

	if flag.NArg() != 1 {
		flag.Usage()
		os.Exit(1)
	}

	yamlPath := flag.Arg(0)

	yamlData, err := os.ReadFile(yamlPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading YAML file: %v\n", err)
		os.Exit(1)
	}

	var features []FeatureGateYAML
	if err := yaml.Unmarshal(yamlData, &features); err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing YAML: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Processing %d feature gates...\n", len(features))

	var created, updated, unchanged, skipped int
	for _, fg := range features {
		if shouldSkipFeatureGate(fg) {
			skipped++
			continue
		}

		mdPath := filepath.Join(outputDir, fg.Name+".md")

		action, err := updateFeatureGateFile(mdPath, fg)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error processing %s: %v\n", fg.Name, err)
			continue
		}

		switch action {
		case "created":
			created++
		case "updated":
			updated++
		case "unchanged":
			unchanged++
		}
	}

	fmt.Printf("\nDone!\n")
	fmt.Printf("  Created: %d\n", created)
	fmt.Printf("  Updated: %d\n", updated)
	fmt.Printf("  Unchanged: %d\n", unchanged)
	fmt.Printf("  Skipped: %d\n", skipped)
	fmt.Printf("  Files in: %s\n", outputDir)

	printInstructions()
}

// shouldSkipFeatureGate applies heuristics to filter out feature gates with
// invalid lifecycle data. Specifically, it skips gates marked as GA from v1.0
// that are later deprecated, as this violates the "never deprecate stable" rule.
func shouldSkipFeatureGate(fg FeatureGateYAML) bool {
	if len(fg.VersionedSpecs) == 0 {
		return true
	}

	hasGAFromV1_0 := false
	hasDeprecation := false

	for _, spec := range fg.VersionedSpecs {
		if spec.PreRelease == "GA" && spec.Version == "1.0" {
			hasGAFromV1_0 = true
		}
		if spec.PreRelease == "Deprecated" {
			hasDeprecation = true
		}
	}

	if hasGAFromV1_0 && hasDeprecation {
		fmt.Fprintf(os.Stderr, "Skipping %s: GA from v1.0 but later deprecated\n", fg.Name)
		return true
	}

	return false
}

// updateFeatureGateFile updates or creates a feature gate markdown file.
// It preserves existing descriptions and comments while updating the front matter.
// Returns the action taken: "created", "updated", or "unchanged".
func updateFeatureGateFile(path string, fg FeatureGateYAML) (string, error) {
	newFrontMatter := generateFrontMatter(fg)

	existingContent, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		content := newFrontMatter + "---\n<!-- FIXME: Add meaningful description for " + fg.Name + " feature gate -->\n"
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			return "", fmt.Errorf("failed to create file: %w", err)
		}
		placeholderGates = append(placeholderGates, fg.Name)
		return "created", nil
	} else if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}

	// Parse existing file to extract comments, description
	existingFrontMatter, comments, description, err := parseMarkdownFile(string(existingContent))
	if err != nil {
		return "", fmt.Errorf("failed to parse file: %w", err)
	}

	// Check if description has FIXME (still a placeholder)
	if strings.Contains(description, "FIXME") || strings.Contains(description, "TODO") {
		if !contains(placeholderGates, fg.Name) {
			placeholderGates = append(placeholderGates, fg.Name)
		}
	}

	// Build the new front matter with preserved comments
	finalFrontMatter := newFrontMatter
	if comments != "" {
		finalFrontMatter += "\n" + comments + "\n"
	}

	// Check if front matter changed (ignoring whitespace and comments for comparison)
	if normalizeFrontMatter(existingFrontMatter) == normalizeFrontMatter(finalFrontMatter) {
		return "unchanged", nil
	}

	// Write updated file preserving comments and description
	content := finalFrontMatter + "---\n" + description
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		return "", fmt.Errorf("failed to write file: %w", err)
	}

	return "updated", nil
}

// generateFrontMatter creates the YAML front matter for a feature gate.
// It normalizes stage names and calculates toVersion for each stage.
func generateFrontMatter(fg FeatureGateYAML) string {
	var sb strings.Builder

	sb.WriteString("---\n")
	sb.WriteString("title: " + fg.Name + "\n")
	sb.WriteString("content_type: feature_gate\n")
	sb.WriteString("_build:\n")
	sb.WriteString("  list: never\n")
	sb.WriteString("  render: false\n")
	sb.WriteString("\n")
	sb.WriteString("stages:\n")

	for i, spec := range fg.VersionedSpecs {
		stageName := normalizeStage(spec.PreRelease)

		sb.WriteString("  - stage: " + stageName + "\n")
		sb.WriteString(fmt.Sprintf("    defaultValue: %t\n", spec.Default))
		if spec.LockToDefault {
			sb.WriteString("    locked: true\n")
		}
		sb.WriteString("    fromVersion: \"" + spec.Version + "\"\n")
		if i < len(fg.VersionedSpecs)-1 {
			nextVersion := fg.VersionedSpecs[i+1].Version
			toVersion := calculateToVersion(nextVersion)
			sb.WriteString("    toVersion: \"" + toVersion + "\"\n")
		}
	}

	return sb.String()
}

// normalizeStage converts stage names to lowercase and maps GA to stable.
func normalizeStage(stage string) string {
	switch stage {
	case "GA":
		return "stable"
	case "Alpha":
		return "alpha"
	case "Beta":
		return "beta"
	case "Deprecated":
		return "deprecated"
	default:
		// Fallback: lowercase whatever we got
		return strings.ToLower(stage)
	}
}

// parseMarkdownFile extracts front matter, YAML comments, and description
// from a markdown file. YAML comments are preserved separately to maintain
// them during updates.
func parseMarkdownFile(content string) (frontMatter, comments, description string, err error) {
	scanner := bufio.NewScanner(strings.NewReader(content))

	if !scanner.Scan() {
		return "", "", "", fmt.Errorf("file is empty")
	}

	firstLine := strings.TrimSpace(scanner.Text())
	if firstLine != "---" {
		return "", "", "", fmt.Errorf("file does not start with ---")
	}

	var fmLines []string
	var commentLines []string
	fmLines = append(fmLines, "---")
	foundEnd := false

	for scanner.Scan() {
		line := scanner.Text()
		// Closing delimiter must be exactly "---" (no leading whitespace)
		trimmedLine := strings.TrimSpace(line)
		if trimmedLine == "---" {
			foundEnd = true
			break
		}
		// Check if this is a YAML comment (starts with # after optional whitespace)
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "#") {
			commentLines = append(commentLines, line)
		} else {
			fmLines = append(fmLines, line)
		}
	}

	if !foundEnd {
		return "", "", "", fmt.Errorf("no closing --- found for front matter")
	}

	frontMatter = strings.Join(fmLines, "\n") + "\n"
	comments = strings.Join(commentLines, "\n")

	// Rest is description
	var descLines []string
	for scanner.Scan() {
		descLines = append(descLines, scanner.Text())
	}

	description = strings.Join(descLines, "\n")
	// Ensure description ends with newline if non-empty
	if description != "" && !strings.HasSuffix(description, "\n") {
		description += "\n"
	}

	return frontMatter, comments, description, nil
}

// normalizeFrontMatter normalizes front matter for comparison by removing
// trailing whitespace and empty lines.
func normalizeFrontMatter(fm string) string {
	var lines []string
	scanner := bufio.NewScanner(strings.NewReader(fm))
	for scanner.Scan() {
		line := strings.TrimRight(scanner.Text(), " \t")
		// Skip empty lines for comparison
		if line != "" {
			lines = append(lines, line)
		}
	}
	return strings.Join(lines, "\n")
}

// calculateToVersion derives the toVersion by decrementing the minor version
// of the next stage's fromVersion (e.g., "1.34" becomes "1.33").
func calculateToVersion(nextFromVersion string) string {
	parts := strings.Split(nextFromVersion, ".")
	if len(parts) != 2 {
		return nextFromVersion
	}

	minor := 0
	if _, err := fmt.Sscanf(parts[1], "%d", &minor); err != nil {
		return nextFromVersion
	}

	// Decrement minor version
	if minor > 0 {
		minor--
	}

	return fmt.Sprintf("%s.%d", parts[0], minor)
}

// printInstructions provides guidance to the user after the script completes.
func printInstructions() {
	if len(placeholderGates) == 0 {
		fmt.Println("\n✅ All feature gates have descriptions!")
		fmt.Println("\nNext steps:")
		fmt.Println("  1. Review changes: git diff content/en/docs/reference/command-line-tools-reference/feature-gates")
		fmt.Println("  2. Add changes: git add content/en/docs/reference/command-line-tools-reference/feature-gates")
		fmt.Println("  3. Commit with a descriptive message")
		return
	}

	fmt.Printf("\nThis script has just added %d placeholder Markdown files.\n", len(placeholderGates))
	fmt.Println("Because they are placeholders you will see the word FIXME in their")
	fmt.Println("front matter, and the site won't build if you either")
	fmt.Println("run \"make container-serve\" or run Hugo manually.")
	fmt.Println()
	fmt.Println("Before you commit the change, you should update the following")
	fmt.Println("feature gates to have a meaningful description:")

	for _, gate := range placeholderGates {
		fmt.Printf("  • %s\n", gate)
	}

	fmt.Println()
	fmt.Println("(you can then delete the FIXME line)")
	fmt.Println()
	fmt.Println("If you cannot provide a description, you can also delete the")
	fmt.Println("new file for that feature gate; if you do that, please")
	fmt.Println("file a feature request issue about adding the missing documentation.")
}

// contains checks if a string is in a slice
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
