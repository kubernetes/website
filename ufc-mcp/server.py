"""
ufc-mcp/server.py — UFC data MCP server (scrapes UFC.com directly, no API key needed).

Run:
    python3 server.py              # stdio (Claude Desktop)
    python3 server.py --port 8080  # HTTP for testing
"""

import argparse
import html as html_lib
import json
import re
import time
from datetime import datetime, timezone
from typing import Any, Optional

import httpx
from fastmcp import FastMCP

CACHE_TTL_SECONDS = 900
HTTP_TIMEOUT_SECONDS = 20
# Limit cheap paragraph scanning to the page header area where UFC exposes profile summary text.
HTML_TEXT_SCAN_LIMIT = 12000
UFC_BASE = "https://www.ufc.com"
# UFC.com uses this fragment to jump to the "Past" events section on the events page.
PAST_EVENTS_HASH = "702702e1-80ec-4e69-8ad6-40eca8ff3e5c"
RANKINGS_CACHE_TTL_SECONDS = 3600
EVENTS_CACHE_TTL_SECONDS = 1800
MAX_RANKED_FIGHTERS = 15
MIN_NAME_LENGTH = 2
MAX_NICKNAME_WORDS = 4
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

_cache: dict[str, tuple[float, Any]] = {}

_DIVISION_KEYWORDS = (
    "strawweight",
    "flyweight",
    "bantamweight",
    "featherweight",
    "lightweight",
    "welterweight",
    "middleweight",
    "heavyweight",
    "women",
)
_BIO_LABELS = {
    "age",
    "born",
    "date of birth",
    "debut",
    "fighting out of",
    "height",
    "leg reach",
    "nickname",
    "place of birth",
    "reach",
    "stance",
    "team",
    "trains at",
    "weight",
    "weight class",
}


def _get(key: str) -> Optional[Any]:
    entry = _cache.get(key)
    if not entry:
        return None
    expiry, value = entry
    return value if time.time() < expiry else None


def _set(key: str, val: Any, ttl: int = CACHE_TTL_SECONDS) -> None:
    _cache[key] = (time.time() + ttl, val)


def _clean(text: str | None) -> str:
    if not text:
        return ""
    text = re.sub(r"<br\s*/?>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return html_lib.unescape(re.sub(r"\s+", " ", text)).strip()


def _slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def _unique(items: list[dict[str, Any]], key_fields: tuple[str, ...]) -> list[dict[str, Any]]:
    seen: set[tuple[Any, ...]] = set()
    out: list[dict[str, Any]] = []
    for item in items:
        marker = tuple(item.get(field) for field in key_fields)
        if marker in seen:
            continue
        seen.add(marker)
        out.append(item)
    return out


def _extract_meta(html: str, attr: str, value: str) -> Optional[str]:
    pattern = (
        rf'<meta[^>]+{attr}=["\']{re.escape(value)}["\'][^>]+content=["\'](.*?)["\']'
        rf"|<meta[^>]+content=[\"'](.*?)[\"'][^>]+{attr}=[\"']{re.escape(value)}[\"']"
    )
    match = re.search(pattern, html, re.I | re.S)
    if not match:
        return None
    return _clean(next(group for group in match.groups() if group is not None))


def _extract_json_ld_objects(html: str) -> list[dict[str, Any]]:
    found: list[dict[str, Any]] = []
    blocks = re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
        re.I | re.S,
    )
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        try:
            data = json.loads(block)
        except json.JSONDecodeError:
            continue
        stack = data if isinstance(data, list) else [data]
        while stack:
            current = stack.pop()
            if isinstance(current, dict):
                found.append(current)
                graph = current.get("@graph")
                if isinstance(graph, list):
                    stack.extend(graph)
            elif isinstance(current, list):
                stack.extend(current)
    return found


def _extract_text_candidates(html: str) -> list[str]:
    return [
        text
        for text in (
            _clean(value)
            for value in re.findall(r"<p[^>]*>(.*?)</p>", html[:HTML_TEXT_SCAN_LIMIT], re.I | re.S)
        )
        if text
    ]


def _guess_record(texts: list[str]) -> Optional[str]:
    for text in texts:
        if re.fullmatch(r"\d+\s*-\s*\d+(?:\s*-\s*\d+)?(?:\s*\([^)]*\))?", text):
            return text
    return None


def _guess_division(texts: list[str]) -> Optional[str]:
    for text in texts:
        lowered = text.lower()
        if any(keyword in lowered for keyword in _DIVISION_KEYWORDS):
            return text
    return None


def _guess_nickname(texts: list[str], excluded_texts: set[str]) -> Optional[str]:
    for text in texts:
        if text in excluded_texts or len(text) < MIN_NAME_LENGTH:
            continue
        if text.startswith('"') and text.endswith('"'):
            return text.strip('"')
        if not any(ch.isdigit() for ch in text) and len(text.split()) <= MAX_NICKNAME_WORDS:
            return text
    return None


def _extract_labeled_pairs(html: str) -> dict[str, str]:
    pairs: dict[str, str] = {}
    patterns = [
        (
            r"<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>",
            "label_first",
        ),
        (
            r'class="[^"]*(?:c-bio__label|field__label|c-overlap__stats-text|c-stat-3bar__label)[^"]*"[^>]*>(.*?)</[^>]+>\s*'
            r'<[^>]+class="[^"]*(?:c-bio__text|field__item|c-overlap__stats-value|c-stat-3bar__value)[^"]*"[^>]*>(.*?)</',
            "label_first",
        ),
        (
            r'class="[^"]*(?:c-overlap__stats-value|c-stat-compare__number)[^"]*"[^>]*>(.*?)</[^>]+>\s*'
            r'<[^>]+class="[^"]*(?:c-overlap__stats-text|c-stat-compare__label)[^"]*"[^>]*>(.*?)</',
            "value_first",
        ),
    ]
    for pattern, mode in patterns:
        for first, second in re.findall(pattern, html, re.I | re.S):
            label, value = (first, second) if mode == "label_first" else (second, first)
            clean_label = _clean(label).rstrip(":")
            clean_value = _clean(value)
            if clean_label and clean_value and clean_label not in pairs:
                pairs[clean_label] = clean_value
    return pairs


def _parse_fighter_page(html: str, slug: str) -> dict[str, Any]:
    ld_objects = _extract_json_ld_objects(html)
    person = next(
        (
            obj for obj in ld_objects
            if str(obj.get("@type", "")).lower() in {"person", "athlete"}
        ),
        {},
    )
    texts = _extract_text_candidates(html)
    h1_match = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S)

    name = _clean(person.get("name")) or (_clean(h1_match.group(1)) if h1_match else "")
    title = _extract_meta(html, "property", "og:title") or _extract_meta(html, "name", "title")
    if not name and title:
        name = title.split("|", 1)[0].strip()

    record = _guess_record(texts)
    division = _guess_division(texts)
    excluded_texts = {value for value in (name, record, division) if value}
    nickname = _clean(person.get("alternateName")) or _guess_nickname(texts, excluded_texts)

    pairs = _extract_labeled_pairs(html)
    bio: dict[str, str] = {}
    stats: dict[str, str] = {}
    for label, value in pairs.items():
        target = bio if label.lower() in _BIO_LABELS else stats
        target[label] = value

    if division and "Weight Class" not in bio:
        bio["Weight Class"] = division
    if nickname and "Nickname" not in bio:
        bio["Nickname"] = nickname

    return {
        "name": name or None,
        "slug": slug,
        "record": record,
        "division": division,
        "nickname": nickname,
        "striking_stats": stats,
        "bio": bio,
        "image": person.get("image"),
        "url": person.get("url") or f"{UFC_BASE}/athlete/{slug}",
        "description": _extract_meta(html, "name", "description"),
    }


def _parse_rankings(html: str) -> list[dict[str, Any]]:
    divisions: list[dict[str, Any]] = []
    blocks = re.split(r'class="view-grouping-header"[^>]*>', html, flags=re.I)
    seen_divisions: set[str] = set()
    for block in blocks[1:]:
        header_match = re.match(r"(.*?)</", block, re.S)
        if not header_match:
            continue
        division = _clean(header_match.group(1))
        if not division or division in seen_divisions:
            continue
        fighters = [
            _clean(name)
            for name in re.findall(r'href="/athlete/[^"]+"[^>]*>(.*?)</a>', block, re.I | re.S)
        ]
        fighters = [name for name in fighters if len(name) > MIN_NAME_LENGTH]
        fighters = list(dict.fromkeys(fighters))
        if not fighters:
            continue
        seen_divisions.add(division)
        divisions.append(
            {
                "division": division,
                "champion": fighters[0],
                "ranked": fighters[1 : MAX_RANKED_FIGHTERS + 1],
            }
        )
    return divisions


def _parse_event_date(value: str | None) -> Optional[str]:
    if not value:
        return None
    value = value.strip()
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%S", "%B %d, %Y"):
        try:
            dt = datetime.strptime(value, fmt)
            return dt.date().isoformat()
        except ValueError:
            continue
    if re.match(r"\d{4}-\d{2}-\d{2}", value):
        return value[:10]
    return value


def _parse_events(html: str) -> list[dict[str, Any]]:
    events: list[dict[str, Any]] = []

    for obj in _extract_json_ld_objects(html):
        type_name = str(obj.get("@type", "")).lower()
        if type_name not in {"event", "sportsevent"}:
            continue
        location = obj.get("location") or {}
        if isinstance(location, list):
            location = location[0] if location else {}
        location_name = None
        if isinstance(location, dict):
            location_name = _clean(location.get("name"))
            address = location.get("address")
            if not location_name and isinstance(address, dict):
                location_name = _clean(
                    ", ".join(
                        filter(
                            None,
                            [
                                address.get("addressLocality"),
                                address.get("addressRegion"),
                                address.get("addressCountry"),
                            ],
                        )
                    )
                )
        event = {
            "name": _clean(obj.get("name")),
            "date": _parse_event_date(obj.get("startDate")),
            "location": location_name,
            "url": obj.get("url"),
        }
        if event["name"]:
            events.append(event)

    if events:
        return _unique(events, ("name", "date"))

    card_pattern = re.compile(
        r'<a[^>]+href="(?P<href>/event/[^"]+)"[^>]*>.*?'
        r'<h3[^>]*>(?P<name>.*?)</h3>.*?'
        r'(?:<div[^>]*class="[^"]*date[^"]*"[^>]*>(?P<date>.*?)</div>)?.*?'
        r'(?:<div[^>]*class="[^"]*location[^"]*"[^>]*>(?P<location>.*?)</div>)?',
        re.I | re.S,
    )
    for match in card_pattern.finditer(html):
        events.append(
            {
                "name": _clean(match.group("name")),
                "date": _parse_event_date(_clean(match.group("date")) or None),
                "location": _clean(match.group("location")) or None,
                "url": f"{UFC_BASE}{match.group('href')}",
            }
        )
    return _unique([event for event in events if event["name"]], ("name", "date"))


def _sort_events(events: list[dict[str, Any]], reverse: bool) -> list[dict[str, Any]]:
    def sort_key(event: dict[str, Any]) -> tuple[int, str]:
        date = event.get("date")
        return (0, date) if date else (1, "")

    return sorted(events, key=sort_key, reverse=reverse)


async def _fetch(url: str) -> str:
    async with httpx.AsyncClient(follow_redirects=True, timeout=HTTP_TIMEOUT_SECONDS) as client:
        response = await client.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.text


mcp = FastMCP(
    "UFC Data",
    instructions=(
        "Live UFC fighter stats, rankings, and event data scraped directly from UFC.com. "
        "No API key required. Use get_fighter for profiles/stats, search_fighter if you do "
        "not know the exact slug, get_rankings for official rankings, and get_events for "
        "upcoming or past event listings."
    ),
)


@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_fighter(name: str) -> str:
    """
    Get a UFC fighter's profile, record, and career striking stats.

    Args:
        name: Fighter name as it appears in their UFC.com URL slug
              (e.g. 'jon-jones', 'conor-mcgregor', 'israel-adesanya').
              Spaces become hyphens, lowercase.
    Returns:
        JSON with name, record, division, nickname, striking stats, and bio.
    """
    slug = _slugify(name)
    cache_key = f"fighter:{slug}"
    if hit := _get(cache_key):
        return json.dumps({**hit, "cached": True}, ensure_ascii=False)

    try:
        html = await _fetch(f"{UFC_BASE}/athlete/{slug}")
        data = _parse_fighter_page(html, slug)
        if not data["name"]:
            return json.dumps(
                {
                    "error": f"Fighter '{name}' not found. Try the UFC.com URL slug format (e.g. 'jon-jones').",
                    "slug": slug,
                },
                ensure_ascii=False,
            )
        _set(cache_key, data)
        return json.dumps({**data, "cached": False, "source": "ufc.com"}, ensure_ascii=False)
    except httpx.HTTPStatusError as error:
        return json.dumps(
            {"error": f"HTTP {error.response.status_code}", "slug": slug},
            ensure_ascii=False,
        )
    except Exception as error:
        return json.dumps({"error": str(error), "slug": slug}, ensure_ascii=False)


@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def search_fighter(query: str) -> str:
    """
    Search for a UFC fighter by name. Tries common slug patterns.

    Args:
        query: Fighter name (e.g. 'Conor McGregor', 'Jon Jones', 'Adesanya')
    Returns:
        JSON with fighter profile if found, or suggestions to try.
    """
    slug = _slugify(query)
    attempts = [slug]
    parts = [part for part in slug.split("-") if part]
    if len(parts) > 1:
        attempts.extend([parts[-1], parts[0], "-".join(reversed(parts))])
    attempts = list(dict.fromkeys(filter(None, attempts)))

    for attempt in attempts:
        try:
            html = await _fetch(f"{UFC_BASE}/athlete/{attempt}")
            data = _parse_fighter_page(html, attempt)
            if data["name"]:
                _set(f"fighter:{attempt}", data)
                return json.dumps(
                    {**data, "slug": attempt, "cached": False, "source": "ufc.com"},
                    ensure_ascii=False,
                )
        except httpx.HTTPStatusError:
            continue
        except Exception as error:
            return json.dumps(
                {"error": str(error), "tried_slugs": attempts},
                ensure_ascii=False,
            )

    return json.dumps(
        {
            "error": f"Fighter '{query}' not found.",
            "tried_slugs": attempts,
            "tip": "Use the exact UFC.com URL slug (e.g. 'conor-mcgregor', 'israel-adesanya', 'jon-jones').",
        },
        ensure_ascii=False,
    )


@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_rankings() -> str:
    """
    Get current official UFC rankings for all divisions.

    Returns:
        JSON with each division's champion and top 15 ranked fighters.
    """
    cache_key = "rankings:all"
    if hit := _get(cache_key):
        return json.dumps({"rankings": hit, "cached": True}, ensure_ascii=False)

    try:
        html = await _fetch(f"{UFC_BASE}/rankings")
        rankings = _parse_rankings(html)
        if rankings:
            _set(cache_key, rankings, ttl=RANKINGS_CACHE_TTL_SECONDS)
        return json.dumps(
            {
                "rankings": rankings,
                "count": len(rankings),
                "cached": False,
                "source": "ufc.com",
            },
            ensure_ascii=False,
        )
    except Exception as error:
        return json.dumps({"error": str(error)}, ensure_ascii=False)


@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_events(event_type: str = "upcoming") -> str:
    """
    Get UFC events.

    Args:
        event_type: 'upcoming' or 'past' (default: 'upcoming')
    Returns:
        JSON list of events with name, date, and location.
    """
    if event_type not in {"upcoming", "past"}:
        return json.dumps(
            {"error": "event_type must be 'upcoming' or 'past'."},
            ensure_ascii=False,
        )

    url_map = {
        "upcoming": f"{UFC_BASE}/events",
        "past": f"{UFC_BASE}/events#{PAST_EVENTS_HASH}",
    }
    cache_key = f"events:{event_type}"
    if hit := _get(cache_key):
        return json.dumps({"events": hit, "cached": True}, ensure_ascii=False)

    try:
        html = await _fetch(url_map[event_type])
        events = _parse_events(html)
        now = datetime.now(timezone.utc).date().isoformat()
        if event_type == "upcoming":
            filtered = [event for event in events if not event.get("date") or event["date"] >= now]
            filtered = _sort_events(filtered, reverse=False)
        else:
            filtered = [event for event in events if event.get("date") and event["date"] < now]
            filtered = _sort_events(filtered, reverse=True)
        _set(cache_key, filtered, ttl=EVENTS_CACHE_TTL_SECONDS)
        return json.dumps(
            {
                "events": filtered,
                "count": len(filtered),
                "cached": False,
                "source": "ufc.com",
                "event_type": event_type,
            },
            ensure_ascii=False,
        )
    except Exception as error:
        return json.dumps({"error": str(error), "event_type": event_type}, ensure_ascii=False)


@mcp.tool(annotations={"readOnlyHint": True})
async def cache_status() -> str:
    """
    Show cached keys and remaining TTLs.

    Returns:
        JSON with entry count, default TTL, and per-key expiry.
    """
    now = time.time()
    entries = sorted(
        [
            {"key": key, "expires_in_seconds": max(0, int(expires_at - now))}
            for key, (expires_at, _) in _cache.items()
        ],
        key=lambda entry: entry["expires_in_seconds"],
    )
    return json.dumps(
        {
            "total_entries": len(_cache),
            "ttl_default_seconds": CACHE_TTL_SECONDS,
            "entries": entries,
        },
        ensure_ascii=False,
    )


@mcp.tool(annotations={"readOnlyHint": False, "destructiveHint": True})
async def clear_cache() -> str:
    """
    Flush all cached data.

    Returns:
        Number of cache entries cleared.
    """
    count = len(_cache)
    _cache.clear()
    return json.dumps({"flushed": count, "status": "Cache cleared."}, ensure_ascii=False)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UFC data MCP server (UFC.com scraper)")
    parser.add_argument("--port", type=int, default=None, help="HTTP port (omit for stdio mode)")
    args = parser.parse_args()

    print(f"[ufc-mcp] Source: {UFC_BASE}")
    print(
        "[ufc-mcp] Cache TTLs: "
        f"default={CACHE_TTL_SECONDS}s rankings={RANKINGS_CACHE_TTL_SECONDS}s "
        f"events={EVENTS_CACHE_TTL_SECONDS}s"
    )

    if args.port:
        print(f"[ufc-mcp] HTTP on 127.0.0.1:{args.port}")
        mcp.run(transport="streamable-http", host="127.0.0.1", port=args.port)
    else:
        print("[ufc-mcp] stdio transport")
        mcp.run(transport="stdio")
