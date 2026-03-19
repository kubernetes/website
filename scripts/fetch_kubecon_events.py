#!/usr/bin/env python3
"""
Fetch KubeCon events from Linux Foundation website and generate Hugo data file.
Requirements: pip install requests beautifulsoup4 pyyaml
"""

import requests
from bs4 import BeautifulSoup
import yaml
import re
from datetime import datetime
from typing import Optional

# Configuration
EVENT_URL = "https://events.linuxfoundation.org/about/calendar/?_sf_s=kubecon"
EVENT_LIMIT = 2
OUTPUT_PATH = "data/events/kubecon.yaml"

def _is_valid_kubecon_title(title: str) -> bool:
    """Check if title is a valid KubeCon event"""
    if not title.startswith('KubeCon + CloudNativeCon'):
        print(f"Skipped (wrong format): {title}")
        return False

    if title.count('+') > 1:
        print(f"Skipped (joint conference): {title}")
        return False

    colocated_keywords = [
        'ArgoCon', 'BackstageCon', 'CiliumCon', 'FluxCon',
        'WasmCon', 'Observability', 'Platform Engineering',
        'Cloud Native AI', 'Telco', 'Edge', 'Keycloak',
        'Kyverno', 'OpenTofu', 'Security', 'Agentics'
    ]

    if any(keyword in title for keyword in colocated_keywords):
        print(f"Skipped (co-located event): {title}")
        return False

    return True

def _extract_region(title: str) -> str:
    """Extract region from event title"""
    regions = {
        "North America": "North America",
        "Europe": "Europe",
        "India": "India",
        "Japan": "Japan",
        "China": "China",
    }
    return next((region for key, region in regions.items() if key in title), "Event")

def _parse_date_range(date_text: str) -> Optional[tuple[str, str]]:
    print(f"  Parsing date: {date_text}")
    """Parse date range text like 'Mar 23–26, 2026' into ISO 8601 dates."""
    text = re.sub(r'[–—]', '-', date_text)
    # Match: "Mon DD - [Mon] DD, YYYY"
    m = re.match(r'(\w+)\s+(\d+)\s*-\s*(?:(\w+)\s+)?(\d+),?\s*(\d{4})', text)
    if not m:
        print(f"  Warning: Could not parse date range: {date_text}")
        return None
    start_month, start_day, end_month, end_day, year = m.groups()
    end_month = end_month or start_month
    try:
        start = datetime.strptime(f"{start_month} {start_day} {year}", "%b %d %Y")
        end = datetime.strptime(f"{end_month} {end_day} {year}", "%b %d %Y")
        return start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")
    except ValueError:
        print(f"  Warning: Could not parse date range: {date_text}")
        return None


def _extract_event_data(article) -> Optional[dict]:
    """Extract event data from article element"""
    title_elem = article.find('h5')
    if not title_elem:
        return None

    link_elem = title_elem.find('a')
    if not link_elem:
        return None

    title = link_elem.get_text(strip=True)

    if not _is_valid_kubecon_title(title):
        return None

    url = link_elem.get('href', '')

    # Extract date and parse to ISO 8601
    start_date = ""
    end_date = ""
    date_span = article.find('span', class_='date')
    if date_span:
        date_text = re.sub(r'\s+', ' ', date_span.get_text(strip=True)).strip()
        parsed = _parse_date_range(date_text)
        if parsed:
            start_date, end_date = parsed

    # Extract location
    location = "TBA"
    country_span = article.find('span', class_='country')
    if country_span:
        location = re.sub(r'\s+', ' ', country_span.get_text(strip=True)).strip()

    return {
        'name': title,
        'region': _extract_region(title),
        'start_date': start_date,
        'end_date': end_date,
        'location': location,
        'url': url,
    }

def fetch_kubecon_events(url: str = EVENT_URL) -> list[dict]:
    """Scrape KubeCon events from Linux Foundation calendar"""

    headers = {
        'User-Agent': 'kubernetes-website-bot/1.0 (+https://github.com/kubernetes/website)'
    }

    print(f"Fetching from: {url}")
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')
    events = []

    # Find all event articles in the search results
    event_articles = soup.find_all('article', class_='callout')
    print(f"Found {len(event_articles)} total events on page\n")

    for article in event_articles:
        try:
            event_data = _extract_event_data(article)
            if event_data:
                events.append(event_data)
                print(f"Matched: {event_data['name']}")
        except Exception as e:
            print(f"Error parsing event: {e}")
            continue

    return events

def generate_yaml_file(events: list[dict], output_path: str = OUTPUT_PATH, limit: int = EVENT_LIMIT) -> None:
    """Generate Hugo data file"""

    # Limit events if specified
    if limit and limit > 0:
        events = events[:limit]
        print(f"\nLimiting to first {limit} events")

    data = {
        'events': events,
        'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'source': EVENT_URL
    }

    with open(output_path, 'w') as f:
        f.write("# Do not manually edit this file\n")
        f.write("# This file is auto-generated by scripts/fetch_kubecon_events.py\n")
        f.write("# To update, run:\n")
        f.write("#   python3 scripts/fetch_kubecon_events.py\n")
        f.write("#\n")
        f.write(f"# Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"# Source: {EVENT_URL}\n")
        f.write("\n")
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    print(f"\nGenerated {output_path}")
    print(f"  {len(events)} KubeCon events")

if __name__ == '__main__':
    print("=" * 60)
    print("KubeCon Events Fetcher")
    print("=" * 60)

    try:
        events = fetch_kubecon_events()

        if not events:
            print("\nNo matching KubeCon events found!")
            print(" Looking for: 'KubeCon + CloudNativeCon <region>'")
            exit(1)

        print(f"\n{'=' * 60}")
        print("Generating YAML data file...")
        print("=" * 60)

        generate_yaml_file(events)

        print("\n" + "=" * 60)
        print("Success!")
        print("=" * 60)
        print("\nMatched events:")
        for i, event in enumerate(events[:EVENT_LIMIT], 1):
            print(f"  {i}. {event['name']}")
            print(f"     {event['location']} - {event['start_date']} to {event['end_date']}")

    except requests.exceptions.RequestException as e:
        print(f"\nNetwork Error: {e}")
        print("  Could not fetch the events page.")
        exit(1)
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
