#!/usr/bin/env python3
import os
import argparse
import re
import sys
import subprocess
from datetime import datetime
from collections import Counter
try:
    from tabulate import tabulate
except ImportError:
    sys.exit("'tabulate' package is required. Please install it with 'pip install tabulate'")

def get_file_info(directory, file_extension=".md"):
    """Get last modified time, line count, and size of files in a directory"""
    file_info = {}
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(file_extension):
                full_path = os.path.join(root, file)
                last_modified_time = os.path.getmtime(full_path)
                # last_modified_time_by_osget = os.path.getmtime(full_path)
                # print(f"last_modified by git: {last_modified_time} by os.get: {last_modified_time_by_osget}\n")

                size = os.path.getsize(full_path)
                
                # Remove comments and empty lines
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
                    lines = content.split('\n')
                    line_count = len([line for line in lines if line.strip()])
                
                relative_path = os.path.relpath(full_path, directory)
                file_info[relative_path] = {
                    'last_modified_time': last_modified_time,
                    'line_count': line_count,
                    'size': size
                }
    return file_info

def get_last_commit_time(full_path):
    """Return the last commit time of a file using Git"""
    try:
        output = subprocess.check_output(
            ['git', 'log', '-1', '--format=%cI', full_path],
            stderr=subprocess.STDOUT,
            # timeout 10 seconds
            timeout=10 
        ).decode('utf-8').strip()
        return datetime.fromisoformat(output)
    except subprocess.TimeoutExpired:
        print("Git command timed out.")
        return None
    except FileNotFoundError:
        print("Git command not found. Ensure that Git is installed on your system.")
        return None
    except subprocess.CalledProcessError:
        print("Failed to execute git command. The path may not be a Git repository.")
        return None

def seconds_to_days_decimal(seconds):
    """Convert seconds to days, with hours as decimal part of days."""
    days = seconds / 86400  # 86400 seconds in a day
    return round(days, 2)

def colored_text(text, color_code):
    """Wrap the text with ANSI color code"""
    return f"\033[{color_code}m{text}\033[0m"

def calculate_similarity(english_file, localized_file):
    with open(english_file, 'r', encoding='utf-8') as f:
        english_content = f.read()
    with open(localized_file, 'r', encoding='utf-8') as f:
        localized_content = f.read()

    english_content = re.sub(r'<!--.*?-->', '', english_content, flags=re.DOTALL)
    localized_content = re.sub(r'<!--.*?-->', '', localized_content, flags=re.DOTALL)

    pattern = re.compile(r'[^\w\s.,;]')
    english_special_combinations = Counter(pattern.findall(english_content))
    localized_special_combinations = Counter(pattern.findall(localized_content))

    mismatched_special = sum((localized_special_combinations - english_special_combinations).values())
    if mismatched_special == 0 :
        mismatched_special = - sum((english_special_combinations - localized_special_combinations).values())

    pattern = re.compile(r'\b[a-zA-Z]+\b')
    english_words = Counter(pattern.findall(english_content))
    localized_english_words = Counter(pattern.findall(localized_content))
    mismatched_english_words  = sum((localized_english_words - english_words).values())

    return mismatched_special, mismatched_english_words

def compare_directories(path, target_langs):
    dir1 = os.path.join(path, "en")
    dir1_info = get_file_info(dir1)

    global_stats = []

    for target_lang in target_langs:
        dir2 = os.path.join(path, target_lang)
        dir2_info = get_file_info(dir2)

        # Initialize statistics
        stats = {
            "Language": target_lang.upper(),
            "Files in EN": len(dir1_info),
            "Files in Lang": len(dir2_info),
            "Outdated alerts": 0,
            "False alerts (suspected)": 0    
        }

        print(f"\nComparing files between EN and {target_lang.upper()}")

        table_data = []

        for file, info1 in dir1_info.items():
            info2 = dir2_info.get(file, None)
            if info2 is not None:
                time_diff = info1['last_modified_time'] - info2['last_modified_time']
                if time_diff > 0:
                    days = seconds_to_days_decimal(time_diff)
                    line_diff = info2['line_count'] - info1['line_count'] 
                    size_diff = info2['size'] - info1['size']
                    stats["Outdated alerts"] += 1
                    full_path = os.path.join(path, target_lang, file)
                    mismatched_special, mismatched_english_words = calculate_similarity(os.path.join(dir1, file), os.path.join(dir2, file))

                    last_mod_colored = colored_text(f"{days} days", 91) if days > 30 else f"{days} days"
                    line_diff_colored = colored_text(line_diff, 94) if line_diff < 10 else line_diff
                    size_diff_colored = colored_text(f"{size_diff} bytes", 94) if size_diff == 0 else f"{size_diff} bytes"
                    special_diff_colored = colored_text(mismatched_special, 94) if abs(mismatched_special) < 10 else mismatched_special
                    english_words_diff_colored = colored_text(mismatched_english_words, 94) if mismatched_english_words < 10 else mismatched_english_words

                    if abs(mismatched_special) < 10 :
                        stats["False alerts (suspected)"] += 1

                    table_data.append([full_path, last_mod_colored, line_diff_colored, size_diff_colored, special_diff_colored, english_words_diff_colored])

        print(tabulate(table_data, headers=["File", "Time(D)", "Line(D)", "Size(D)", "SpecialChar(D)", "Words(D)"], tablefmt="grid"))

        global_stats.append(stats)

    # Sort the global statistics by "Language" in ascending order
    sorted_global_stats = sorted(global_stats, key=lambda x: x["Language"])

    # Print global statistics
    print("\n--- Global Statistics ---")
    print(tabulate(sorted_global_stats, headers="keys", tablefmt="grid"))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="""
    This script compares markdown files across different language directories
    to identify and report localized documents that may be outdated,
    based on modification date differences.

    It focuses primarily on:
    1. Reporting outdated documents based on modification date differences.
    2. Estimating false alerts.
    3. Calculating the similarity between the English version and localized versions of documents.
    (similarity analysis includes line counts, special character patterns, and English word usage patterns.)

    Users can specify target languages for comparison against the English base.
    If no languages are specified, all directories will be compared.

    The path to the content directory can be specified using the --path parameter; 
    if not provided, './content' or '../content' is used as the default.
    """)
    parser.add_argument("target_lang", nargs="*", default=[], help="Target language directories (e.g., ko ja fr). If empty, all directories will be compared.")
    parser.add_argument("--path", default="./content", help="Base content directory. Default is './content'")
    args = parser.parse_args()

    path = args.path

    if not os.path.isdir(path):
        print(f"Specified directory '{path}' does not exist. Searching for an alternative path.")
        if os.path.isdir("../content"):
            print("Use '../content'")
            path = "../content"
        else:
            raise FileNotFoundError("Please provide valid path")

    available_langs = os.listdir(path)

    if args.target_lang:
        target_langs = args.target_lang
        if all(lang in available_langs for lang in target_langs):
            print(f"Target_language: {target_langs}\n")
        else:
            print(f"Please provide a vailid language code {available_langs}\n")
            exit()

    else:
        target_langs = [d for d in available_langs if os.path.isdir(os.path.join(path, d)) and d != 'en']

    compare_directories(path, target_langs)
