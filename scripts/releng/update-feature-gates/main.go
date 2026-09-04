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
// Prerequisites:
//   - Go 1.24 or later
//   - Access to versioned_feature_list.yaml from kubernetes/kubernetes
//
// Usage:
//
// **Recommended** (via Makefile):
//
//	make update-feature-gates
//	make update-feature-gates TAG=v1.34.2
//
// **Wrapper script** (automatic):
//
//	./scripts/releng/update-feature-gates.sh
//
// **Manual** (local YAML file):
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

// update-feature-gates reads feature gate data from a YAML file
// (test/compatibility_lifecycle/reference/versioned_feature_list.yaml in kubernetes/kubernetes)
// and updates the corresponding markdown files in the website repository.

type FeatureGateYAML struct {
	Name           string          `yaml:"name"`
	VersionedSpecs []VersionedSpec `yaml:"versionedSpecs"`
}

type VersionedSpec struct {
	Default       bool   `yaml:"default"`
	LockToDefault bool   `yaml:"lockToDefault"`
	PreRelease    string `yaml:"preRelease"`
	Version       string `yaml:"version"`
}

type StageEntry struct {
	Stage        string
	DefaultValue bool
	Locked       bool
	FromVersion  string
	ToVersion    string
}

type FrontMatter = yaml.MapSlice

const defaultFeatureGatesDir = "content/en/docs/reference/command-line-tools-reference/feature-gates"

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

func updateFeatureGateFile(path string, fg FeatureGateYAML) (string, error) {
	existingContent, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		fm := generateFrontMatter(fg, nil)
		description := "<!-- FIXME: Add meaningful description for " + fg.Name + " feature gate -->\n"
		content := renderMarkdownFile(fm, description)

		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			return "", fmt.Errorf("failed to create file: %w", err)
		}
		placeholderGates = append(placeholderGates, fg.Name)
		return "created", nil
	} else if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}

	existingFM, existingFMRaw, description, err := parseMarkdownFile(string(existingContent))
	if err != nil {
		return "", fmt.Errorf("failed to parse file: %w", err)
	}

	if strings.Contains(description, "FIXME") || strings.Contains(description, "TODO") {
		if !contains(placeholderGates, fg.Name) {
			placeholderGates = append(placeholderGates, fg.Name)
		}
	}

	newFM := generateFrontMatter(fg, existingFM)
	newContent := renderMarkdownFile(newFM, description)
	newFMRaw := renderFrontMatter(newFM)

	if normalizeFrontMatter(existingFMRaw) == normalizeFrontMatter(newFMRaw) {
		return "unchanged", nil
	}

	if err := os.WriteFile(path, []byte(newContent), 0644); err != nil {
		return "", fmt.Errorf("failed to write file: %w", err)
	}

	return "updated", nil
}

func buildStages(fg FeatureGateYAML) []StageEntry {
	stages := make([]StageEntry, 0, len(fg.VersionedSpecs))

	for i, spec := range fg.VersionedSpecs {
		stage := StageEntry{
			Stage:        normalizeStage(spec.PreRelease),
			DefaultValue: spec.Default,
			Locked:       spec.LockToDefault,
			FromVersion:  spec.Version,
		}

		if i < len(fg.VersionedSpecs)-1 {
			nextVersion := fg.VersionedSpecs[i+1].Version
			stage.ToVersion = calculateToVersion(nextVersion)
		}

		stages = append(stages, stage)
	}

	return stages
}

func generateFrontMatter(fg FeatureGateYAML, existing FrontMatter) FrontMatter {
	var preserved []yaml.MapItem
	for _, item := range existing {
		key, ok := item.Key.(string)
		if !ok {
			continue
		}
		switch key {
		case "title", "content_type", "_build", "stages":
			continue
		default:
			preserved = append(preserved, item)
		}
	}

	fm := FrontMatter{
		{Key: "title", Value: fg.Name},
		{Key: "content_type", Value: "feature_gate"},
		{Key: "_build", Value: yaml.MapSlice{
			{Key: "list", Value: "never"},
			{Key: "render", Value: false},
		}},
	}

	for _, item := range preserved {
		fm = append(fm, item)
	}

	fm = append(fm, yaml.MapItem{
		Key:   "stages",
		Value: buildStages(fg),
	})

	return fm
}

func renderMarkdownFile(fm FrontMatter, description string) string {
	var sb strings.Builder
	sb.WriteString("---\n")
	sb.WriteString(renderFrontMatter(fm))
	sb.WriteString("---\n\n")
	sb.WriteString(description)
	if description != "" && !strings.HasSuffix(description, "\n") {
		sb.WriteString("\n")
	}
	return sb.String()
}

func renderFrontMatter(fm FrontMatter) string {
	var sb strings.Builder

	find := func(key string) (interface{}, bool) {
		for _, item := range fm {
			k, ok := item.Key.(string)
			if ok && k == key {
				return item.Value, true
			}
		}
		return nil, false
	}

	// title
	if title, ok := find("title"); ok {
		sb.WriteString(fmt.Sprintf("title: %v\n", title))
	}

	// former_titles immediately after title, with 2-space indentation
	if titles, ok := find("former_titles"); ok {
		sb.WriteString("former_titles:\n")
		switch v := titles.(type) {
		case []interface{}:
			for _, t := range v {
				sb.WriteString("  - " + fmt.Sprint(t) + "\n")
			}
		case []string:
			for _, t := range v {
				sb.WriteString("  - " + t + "\n")
			}
		}
	}

	// content_type
	if contentType, ok := find("content_type"); ok {
		sb.WriteString(fmt.Sprintf("content_type: %v\n", contentType))
	}

	// _build
	if build, ok := find("_build"); ok {
		sb.WriteString("_build:\n")
		if buildMap, ok := build.(yaml.MapSlice); ok {
			for _, sub := range buildMap {
				sb.WriteString(fmt.Sprintf("  %s: %v\n", sub.Key, sub.Value))
			}
		}
	}

	// preserve any extra keys except the handled ones
	for _, item := range fm {
		key, ok := item.Key.(string)
		if !ok {
			continue
		}

		switch key {
		case "title", "former_titles", "content_type", "_build", "stages":
			continue
		default:
			out, _ := yaml.Marshal(yaml.MapSlice{{Key: item.Key, Value: item.Value}})
			sb.Write(out)
		}
	}

	// blank line before stages
	if stages, ok := find("stages"); ok {
		sb.WriteString("\n")
		sb.WriteString("stages:\n")
		if stageList, ok := stages.([]StageEntry); ok {
			for _, stage := range stageList {
				sb.WriteString(fmt.Sprintf("  - stage: %s\n", stage.Stage))
				sb.WriteString(fmt.Sprintf("    defaultValue: %t\n", stage.DefaultValue))
				sb.WriteString(fmt.Sprintf("    locked: %t\n", stage.Locked))
				sb.WriteString(fmt.Sprintf("    fromVersion: %q\n", stage.FromVersion))
				if stage.ToVersion != "" {
					sb.WriteString(fmt.Sprintf("    toVersion: %q\n", stage.ToVersion))
				}
			}
		}
	}

	return sb.String()
}

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
		return strings.ToLower(stage)
	}
}

func parseMarkdownFile(content string) (FrontMatter, string, string, error) {
	scanner := bufio.NewScanner(strings.NewReader(content))

	if !scanner.Scan() {
		return nil, "", "", fmt.Errorf("file is empty")
	}

	if strings.TrimSpace(scanner.Text()) != "---" {
		return nil, "", "", fmt.Errorf("file does not start with ---")
	}

	var fmLines []string
	foundEnd := false

	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) == "---" {
			foundEnd = true
			break
		}
		fmLines = append(fmLines, line)
	}

	if !foundEnd {
		return nil, "", "", fmt.Errorf("no closing --- found for front matter")
	}

	var fm FrontMatter
	fmRaw := strings.Join(fmLines, "\n")
	if err := yaml.Unmarshal([]byte(fmRaw), &fm); err != nil {
		return nil, "", "", fmt.Errorf("failed to unmarshal front matter: %w", err)
	}

	var descLines []string
	for scanner.Scan() {
		descLines = append(descLines, scanner.Text())
	}
	description := strings.Join(descLines, "\n")
	if description != "" && !strings.HasSuffix(description, "\n") {
		description += "\n"
	}

	return fm, fmRaw, description, nil
}

func normalizeFrontMatter(fm string) string {
	var lines []string
	scanner := bufio.NewScanner(strings.NewReader(fm))
	for scanner.Scan() {
		line := strings.TrimRight(scanner.Text(), " \t")
		if line != "" {
			lines = append(lines, line)
		}
	}
	return strings.Join(lines, "\n")
}

func calculateToVersion(nextFromVersion string) string {
	parts := strings.Split(nextFromVersion, ".")
	if len(parts) != 2 {
		return nextFromVersion
	}

	minor := 0
	if _, err := fmt.Sscanf(parts[1], "%d", &minor); err != nil {
		return nextFromVersion
	}

	if minor > 0 {
		minor--
	}

	return fmt.Sprintf("%s.%d", parts[0], minor)
}

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
	fmt.Println("content, and the site won't build if you either")
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

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
