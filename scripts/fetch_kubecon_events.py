#!/usr/bin/env python3
"""
Fetch KubeCon events from Linux Foundation website and generate Hugo data file.

Uses JSON-LD structured data (schema.org/Event) from individual event pages
for reliable date/location extraction, and CSS custom properties for event colors.

Requirements: pip install requests beautifulsoup4 pyyaml
"""

import json
import requests
from bs4 import BeautifulSoup
import yaml
import re
from datetime import datetime
from typing import Optional

# Configuration
CALENDAR_URL = "https://events.linuxfoundation.org/about/calendar/?_sf_s=kubecon"
EVENT_LIMIT = 2
OUTPUT_PATH = "data/events/kubecon.yaml"

HEADERS = {
    'User-Agent': 'kubernetes-website-bot/1.0 (+https://github.com/kubernetes/website)'
}

REGIONS = {
    "North America": "North America",
    "Europe": "Europe",
    "India": "India",
    "Japan": "Japan",
    "China": "China",
}

KUBECON_TITLE_MATCH_RE = re.compile(
    r'^KubeCon \+ CloudNativeCon (' + '|'.join(re.escape(r) for r in REGIONS) + r')\s*\d*$'
)

def _is_valid_kubecon_title(title: str) -> bool:
    """Check if title matches the expected KubeCon event pattern."""
    if KUBECON_TITLE_MATCH_RE.match(title):
        return True
    print(f"  Skipped (not a main KubeCon event): {title}")
    return False


def _extract_region(title: str) -> str:
    """Extract region from event title."""
    m = KUBECON_TITLE_MATCH_RE.match(title)
    return REGIONS[m.group(1)] if m else "Event"


def _extract_json_ld_event(soup: BeautifulSoup) -> Optional[dict]:
    """Extract schema.org Event from JSON-LD script tags."""
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            data = json.loads(script.string)
        except (json.JSONDecodeError, TypeError):
            continue

        # Direct Event object
        if isinstance(data, dict) and data.get('@type') == 'Event':
            return data

        # Check inside @graph arrays
        if isinstance(data, dict) and '@graph' in data:
            for item in data['@graph']:
                if isinstance(item, dict) and item.get('@type') == 'Event':
                    return item

        # Array of objects
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and item.get('@type') == 'Event':
                    return item

    return None


def _extract_event_colors(soup: BeautifulSoup) -> Optional[list[str]]:
    """Extract event brand colors from CSS custom properties."""
    colors = []
    for style in soup.find_all('style'):
        if not style.string:
            continue
        for match in re.findall(r'--event-color-\d+:\s*(#[0-9a-fA-F]{3,8})', style.string):
            if match not in colors:
                colors.append(match)
    return colors if colors else None


def _parse_address(addr) -> Optional[dict]:
    """Parse a JSON-LD address into a location dict."""
    if isinstance(addr, dict):
        city = addr.get('addressLocality', '')
        country = addr.get('addressCountry', '')
        if city or country:
            result = {'announced': True}
            if city:
                result['city'] = city
            if country:
                result['country'] = country
            return result
    if isinstance(addr, str) and addr:
        return {'announced': True, 'city': addr}
    return None


def _build_location(ld_event: dict) -> dict:
    """Build structured location dict from JSON-LD location field."""
    location = ld_event.get('location')
    if not location:
        return {'announced': False}

    places = location if isinstance(location, list) else [location]

    for place in places:
        if not isinstance(place, dict):
            continue
        result = _parse_address(place.get('address', {}))
        if result:
            return result

    return {'announced': False}


def _fetch_event_detail(url: str) -> Optional[dict]:
    """Fetch an individual event page and extract JSON-LD + colors."""
    print(f"  Fetching event page: {url}")
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')
    ld_event = _extract_json_ld_event(soup)
    if not ld_event:
        print(f"  Warning: No JSON-LD Event found at {url}")
        return None

    colors = _extract_event_colors(soup)

    result = {
        'name': ld_event.get('name', ''),
        'start_date': ld_event.get('startDate', ''),
        'end_date': ld_event.get('endDate', ''),
        'location': _build_location(ld_event),
        'url': url,
    }

    if colors:
        result['colors'] = colors

    return result


def _discover_event_urls(calendar_url: str = CALENDAR_URL) -> list[tuple[str, str]]:
    """Scrape calendar page for KubeCon event URLs. Returns list of (title, url)."""
    print(f"Fetching calendar: {calendar_url}")
    response = requests.get(calendar_url, headers=HEADERS)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')
    event_articles = soup.find_all('article', class_='callout')
    print(f"Found {len(event_articles)} total events on page\n")

    results = []
    for article in event_articles:
        title_elem = article.find('h5')
        if not title_elem:
            continue
        link_elem = title_elem.find('a')
        if not link_elem:
            continue

        title = link_elem.get_text(strip=True)
        url = link_elem.get('href', '')

        if _is_valid_kubecon_title(title) and url:
            results.append((title, url))
            print(f"  Matched: {title}")

    return results


def fetch_kubecon_events(calendar_url: str = CALENDAR_URL) -> list[dict]:
    """Fetch KubeCon events using JSON-LD structured data from event pages."""
    event_urls = _discover_event_urls(calendar_url)

    events = []
    for _, url in event_urls:
        try:
            event_data = _fetch_event_detail(url)
            if event_data:
                event_data['region'] = _extract_region(event_data['name'])
                events.append(event_data)
                print(f"  -> {event_data['name']} ({event_data['start_date']} to {event_data['end_date']})\n")
        except Exception as e:
            print(f"  Error fetching {url}: {e}")
            continue

    return events


def generate_yaml_file(events: list[dict], output_path: str = OUTPUT_PATH, limit: int = EVENT_LIMIT) -> None:
    """Generate Hugo data file."""
    if limit and limit > 0:
        events = events[:limit]
        print(f"\nLimiting to first {limit} events")

    data = {
        'events': events,
        'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'source': CALENDAR_URL
    }

    with open(output_path, 'w') as f:
        f.write("# Do not manually edit this file\n")
        f.write("# This file is auto-generated by scripts/fetch_kubecon_events.py\n")
        f.write("# To update, run:\n")
        f.write("#   python3 scripts/fetch_kubecon_events.py\n")
        f.write("#\n")
        f.write(f"# Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"# Source: {CALENDAR_URL}\n")
        f.write("\n")
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    print(f"\nGenerated {output_path}")
    print(f"  {len(events)} KubeCon events")


if __name__ == '__main__':
    print("=" * 60)
    print("KubeCon Events Fetcher (JSON-LD)")
    print("=" * 60)

    try:
        events = fetch_kubecon_events()

        if not events:
            print("\nNo matching KubeCon events found!")
            print("  Looking for: 'KubeCon + CloudNativeCon <region>'")
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
            loc = event['location']
            loc_str = f"{loc.get('city', 'TBA')}, {loc.get('country', '')}" if loc.get('announced') else "TBA"
            print(f"     {loc_str} - {event['start_date']} to {event['end_date']}")
            if 'colors' in event:
                print(f"     Colors: {', '.join(event['colors'])}")

    except requests.exceptions.RequestException as e:
        print(f"\nNetwork Error: {e}")
        print("  Could not fetch the events page.")
        exit(1)
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
