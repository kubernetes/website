"""
ufc_mcp/server.py  —  Live UFC data MCP server
================================================
Data sources (tiered, best-first):

  1. Cito API          https://citoapi.com/ufc-api/
                       Real REST JSON — fighters, events, bouts, stats, rankings
                       Free: 500 req/month  |  env: CITO_API_KEY  (required)

  2. RapidAPI UFC-Data https://rapidapi.com/dolphinnoirbusiness/api/ufc-data1
                       Free tier available  |  env: RAPIDAPI_KEY  (optional)

  3. Unofficial Tapology RapidAPI
                       https://rapidapi.com/YannAries/api/unofficial-tapology-api
                       env: TAPOLOGY_KEY  (optional, enriches records/streaks)

Get a free Cito API key at https://citoapi.com — it's the primary source.
Without CITO_API_KEY the server will still start but all queries will error.

Run:
    python server.py              # stdio (Claude Desktop / Claude Code)
    python server.py --port 8080  # HTTP for testing
"""

import asyncio
import json
import os
import time
import argparse
from datetime import datetime
from typing import Any, Optional

import httpx
from fastmcp import FastMCP

# ── Keys & config ─────────────────────────────────────────────────────────────
CITO_KEY     = os.getenv("CITO_API_KEY", "")        # primary — required
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")        # secondary UFC-Data on RapidAPI
TAPOLOGY_KEY = os.getenv("TAPOLOGY_KEY", "")        # optional Tapology enrichment
CACHE_TTL    = int(os.getenv("UFC_CACHE_TTL", "3600"))

CITO_BASE     = "https://api.citoapi.com/api/v1/ufc"
RAPIDAPI_UFC  = "https://ufc-data1.p.rapidapi.com"
TAPOLOGY_BASE = "https://unofficial-tapology-api.p.rapidapi.com"

HEADERS = {"User-Agent": "ufc-mcp/1.0 (lesslikely.com; zad@lesslikely.com)"}

# ── In-memory cache ───────────────────────────────────────────────────────────
_cache: dict[str, tuple[float, Any]] = {}

def _get(key: str) -> Optional[Any]:
    e = _cache.get(key)
    return e[1] if e and time.time() < e[0] else None

def _set(key: str, val: Any, ttl: int = CACHE_TTL) -> None:
    _cache[key] = (time.time() + ttl, val)

def _bust(key: str) -> None:
    _cache.pop(key, None)

# ── HTTP helpers ──────────────────────────────────────────────────────────────
async def _json(url: str, headers: dict | None = None, params: dict | None = None) -> Any:
    h = {**HEADERS, "Accept": "application/json", **(headers or {})}
    async with httpx.AsyncClient(follow_redirects=True, timeout=20) as c:
        r = await c.get(url, headers=h, params=params)
        r.raise_for_status()
        return r.json()

def _cito_headers() -> dict:
    return {"x-api-key": CITO_KEY}

def _rapid_ufc_headers() -> dict:
    return {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "ufc-data1.p.rapidapi.com",
    }

def _tap_headers() -> dict:
    return {
        "x-rapidapi-key": TAPOLOGY_KEY,
        "x-rapidapi-host": "unofficial-tapology-api.p.rapidapi.com",
    }

def _no_key_error(name: str, env: str, url: str) -> str:
    return json.dumps({
        "error": f"{name} key not configured.",
        "fix": f"Set the {env} environment variable.",
        "get_key_at": url,
    })

# ── MCP server ────────────────────────────────────────────────────────────────
mcp = FastMCP(
    name="ufc-data",
    instructions=(
        "Live UFC fighter, event, bout, and ranking data. "
        "Primary source: Cito API (requires CITO_API_KEY). "
        "Optional: RAPIDAPI_KEY for the RapidAPI UFC-Data endpoint, "
        "TAPOLOGY_KEY for Tapology enrichment via RapidAPI. "
        "Always search_fighter first to get IDs, then use those IDs for detailed queries. "
        "Call refresh_fighter or clear_cache after a UFC event to get updated records."
    ),
)

# ── Tool: search fighters ─────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def search_fighter(name: str, limit: int = 10) -> str:
    """
    Search UFC fighters by name using Cito API.

    Args:
        name:  Partial or full fighter name ('khabib', 'jon jones', 'poirier')
        limit: Max results (default 10)

    Returns:
        JSON list with fighter id, name, record, weight class, ranking, and profile URL.
        Use the returned 'id' with get_fighter_profile and get_fighter_stats.
    """
    if not CITO_KEY:
        return _no_key_error("Cito API", "CITO_API_KEY", "https://citoapi.com")

    cache_key = f"search:{name.lower()}:{limit}"
    if hit := _get(cache_key):
        return json.dumps({"results": hit, "cached": True})

    try:
        data = await _json(f"{CITO_BASE}/fighters/search",
                           headers=_cito_headers(),
                           params={"q": name, "limit": limit})
        _set(cache_key, data, ttl=1800)
        return json.dumps({"results": data, "cached": False, "source": "cito-api"})
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return json.dumps({"results": [], "message": "No fighters found."})
        return json.dumps({"error": str(e), "status": e.response.status_code})
    except Exception as e:
        return json.dumps({"error": str(e)})


# ── Tool: fighter profile ─────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_fighter_profile(fighter_id: str) -> str:
    """
    Get full fighter profile: record, bio, weight class, rankings, image.

    Args:
        fighter_id: Cito API fighter ID from search_fighter results
                    (e.g. "islam-makhachev" or a numeric ID)

    Returns:
        JSON with name, nickname, record (W-L-D), weight class, ranking,
        height, reach, stance, date of birth, and image URL.
    """
    if not CITO_KEY:
        return _no_key_error("Cito API", "CITO_API_KEY", "https://citoapi.com")

    cache_key = f"fighter:{fighter_id}"
    if hit := _get(cache_key):
        return json.dumps({**hit, "cached": True})

    try:
        data = await _json(f"{CITO_BASE}/fighters/{fighter_id}",
                           headers=_cito_headers())
        _set(cache_key, data)
        return json.dumps({**data, "cached": False, "source": "cito-api"})
    except Exception as e:
        return json.dumps({"error": str(e), "fighter_id": fighter_id})


# ── Tool: fighter stats ───────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_fighter_stats(fighter_id: str) -> str:
    """
    Get career striking and grappling statistics for a fighter.

    Args:
        fighter_id: Cito API fighter ID

    Returns:
        JSON with sig strikes landed/min, accuracy, absorbed, takedown avg/acc/def,
        submission avg, and win method breakdown (KO, SUB, DEC).
    """
    if not CITO_KEY:
        return _no_key_error("Cito API", "CITO_API_KEY", "https://citoapi.com")

    cache_key = f"stats:{fighter_id}"
    if hit := _get(cache_key):
        return json.dumps({**hit, "cached": True})

    try:
        data = await _json(f"{CITO_BASE}/fighters/{fighter_id}/stats",
                           headers=_cito_headers())
        _set(cache_key, data)
        return json.dumps({**data, "cached": False, "source": "cito-api"})
    except Exception as e:
        return json.dumps({"error": str(e), "fighter_id": fighter_id})


# ── Tool: fighter bouts ───────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_fighter_bouts(fighter_id: str, limit: int = 20) -> str:
    """
    Get complete UFC fight history for a fighter.

    Args:
        fighter_id: Cito API fighter ID
        limit:      Max bouts to return (default 20, chronological desc)

    Returns:
        JSON list of bouts with opponent, event, date, result, method, round, time.
    """
    if not CITO_KEY:
        return _no_key_error("Cito API", "CITO_API_KEY", "https://citoapi.com")

    cache_key = f"bouts:{fighter_id}:{limit}"
    if hit := _get(cache_key):
        return json.dumps({"bouts": hit, "cached": True})

    try:
        data = await _json(f"{CITO_BASE}/fighters/{fighter_id}/bouts",
                           headers=_cito_headers(),
                           params={"limit": limit})
        _set(cache_key, data)
        return json.dumps({"bouts": data, "cached": False,
                           "source": "cito-api", "fighter_id": fighter_id})
    except Exception as e:
        return json.dumps({"error": str(e), "fighter_id": fighter_id})


# ── Tool: fighter refresh ─────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": False})
async def refresh_fighter(fighter_id: str) -> str:
    """
    Force-refresh cached data for a fighter (bust profile, stats, and bouts cache).
    Use immediately after a UFC event to pull the updated record.

    Args:
        fighter_id: Cito API fighter ID

    Returns:
        Updated fighter profile JSON.
    """
    for prefix in ("fighter:", "stats:", f"bouts:{fighter_id}:"):
        _bust(prefix + fighter_id)
        _bust(f"bouts:{fighter_id}:20")
    return await get_fighter_profile(fighter_id)


# ── Tool: rankings ────────────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_rankings(weight_class: Optional[str] = None) -> str:
    """
    Get current UFC rankings, optionally filtered to one division.

    Args:
        weight_class: Optional filter — e.g. 'Lightweight', 'Middleweight',
                      'Welterweight', 'Heavyweight', "Women's Strawweight", etc.
                      Omit to get all divisions.

    Returns:
        JSON rankings grouped by division with fighter name, rank, and record.
    """
    if not CITO_KEY:
        return _no_key_error("Cito API", "CITO_API_KEY", "https://citoapi.com")

    cache_key = f"rankings:{(weight_class or 'all').lower()}"
    if hit := _get(cache_key):
        return json.dumps({"rankings": hit, "cached": True})

    try:
        params = {}
        if weight_class:
            params["division"] = weight_class
        data = await _json(f"{CITO_BASE}/rankings",
                           headers=_cito_headers(), params=params)
        _set(cache_key, data, ttl=3600)
        return json.dumps({"rankings": data, "cached": False, "source": "cito-api"})
    except Exception as e:
        return json.dumps({"error": str(e)})


# ── Tool: recent events ───────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_recent_events(limit: int = 10) -> str:
    """
    Get the most recent completed UFC events.

    Args:
        limit: Number of events (default 10, max 50)

    Returns:
        JSON list with event name, date, location, slug/id for get_event_card.
    """
    if not CITO_KEY:
        return _no_key_error("Cito API", "CITO_API_KEY", "https://citoapi.com")

    limit = min(limit, 50)
    cache_key = f"events:recent:{limit}"
    if hit := _get(cache_key):
        return json.dumps({"events": hit, "cached": True})

    try:
        data = await _json(f"{CITO_BASE}/events",
                           headers=_cito_headers(),
                           params={"hasStats": "true", "page": 1, "limit": limit})
        _set(cache_key, data, ttl=3600)
        return json.dumps({"events": data, "cached": False, "source": "cito-api"})
    except Exception as e:
        return json.dumps({"error": str(e)})


# ── Tool: upcoming events ─────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_upcoming_events(limit: int = 10) -> str:
    """
    Get upcoming scheduled UFC events.

    Args:
        limit: Number of events (default 10)

    Returns:
        JSON list with event name, date, location, and card details if announced.
    """
    if not CITO_KEY:
        return _no_key_error("Cito API", "CITO_API_KEY", "https://citoapi.com")

    limit = min(limit, 20)
    cache_key = f"events:upcoming:{limit}"
    if hit := _get(cache_key):
        return json.dumps({"events": hit, "cached": True})

    try:
        data = await _json(f"{CITO_BASE}/events/upcoming",
                           headers=_cito_headers(),
                           params={"limit": limit})
        _set(cache_key, data, ttl=900)
        return json.dumps({"events": data, "cached": False, "source": "cito-api"})
    except Exception as e:
        return json.dumps({"error": str(e)})


# ── Tool: event card ──────────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_event_card(event_id: str) -> str:
    """
    Get the full fight card and results for a UFC event.

    Args:
        event_id: Cito API event slug or ID from get_recent_events / get_upcoming_events
                  (e.g. "ufc-300-jones-vs-pereira" or a numeric ID)

    Returns:
        JSON with event name, date, location, and all bouts with fighters,
        weight class, result, method, round, time, and per-bout stats if available.
    """
    if not CITO_KEY:
        return _no_key_error("Cito API", "CITO_API_KEY", "https://citoapi.com")

    cache_key = f"event:{event_id}"
    if hit := _get(cache_key):
        return json.dumps({**hit, "cached": True})

    try:
        data = await _json(f"{CITO_BASE}/events/{event_id}/stats",
                           headers=_cito_headers())
        _set(cache_key, data)
        return json.dumps({**data, "cached": False, "source": "cito-api"})
    except Exception as e:
        return json.dumps({"error": str(e), "event_id": event_id})


# ── Tool: bout stats ──────────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_bout_stats(bout_id: str, round_: Optional[int] = None) -> str:
    """
    Get detailed per-fighter statistics for a specific bout.

    Args:
        bout_id:  Cito API bout ID (from get_event_card results)
        round_:   Optional — filter to a specific round (1-5). Omit for totals.

    Returns:
        JSON with significant strikes (total/head/body/leg), takedowns,
        knockdowns, control time, and submission attempts per fighter.
    """
    if not CITO_KEY:
        return _no_key_error("Cito API", "CITO_API_KEY", "https://citoapi.com")

    cache_key = f"bout:{bout_id}:r{round_}"
    if hit := _get(cache_key):
        return json.dumps({**hit, "cached": True})

    try:
        params = {}
        if round_ is not None:
            params["round"] = round_
        data = await _json(f"{CITO_BASE}/bouts/{bout_id}/stats",
                           headers=_cito_headers(), params=params)
        _set(cache_key, data)
        return json.dumps({**data, "cached": False, "source": "cito-api"})
    except Exception as e:
        return json.dumps({"error": str(e), "bout_id": bout_id})


# ── Tool: Tapology enrichment ─────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_tapology_fighter(tapology_slug: str) -> str:
    """
    Enrich fighter data with Tapology record, streaks, and finish breakdown.
    Requires TAPOLOGY_KEY env var (RapidAPI key from
    https://rapidapi.com/YannAries/api/unofficial-tapology-api).

    Args:
        tapology_slug: Tapology fighter slug from their URL, e.g.
                       "14607-conor-mcgregor" from tapology.com/rankings/14607-conor-mcgregor

    Returns:
        JSON with full_record (W-L-D), current_streak, tko_ko, submission,
        decision wins/losses, weight_class, born, and nickname.
    """
    if not TAPOLOGY_KEY:
        return _no_key_error("Tapology RapidAPI", "TAPOLOGY_KEY",
                             "https://rapidapi.com/YannAries/api/unofficial-tapology-api")

    cache_key = f"tapology:{tapology_slug}"
    if hit := _get(cache_key):
        return json.dumps({**hit, "cached": True})

    try:
        data = await _json(f"{TAPOLOGY_BASE}/fighter/{tapology_slug}",
                           headers=_tap_headers())
        _set(cache_key, data)
        return json.dumps({**data, "cached": False, "source": "tapology-rapidapi"})
    except Exception as e:
        return json.dumps({"error": str(e), "tapology_slug": tapology_slug})


# ── Tool: RapidAPI UFC fighter (fallback) ─────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": True})
async def get_rapidapi_fighter(fighter_name: str) -> str:
    """
    Look up a fighter by exact name via the RapidAPI UFC-Data endpoint.
    Requires RAPIDAPI_KEY. Use as a fallback or cross-check against Cito API.

    Args:
        fighter_name: Exact case-sensitive name (e.g. 'Jon Jones', 'Khabib Nurmagomedov')

    Returns:
        JSON with career stats: TotalFights, Wins, WinRate, AvgKnockdowns,
        KOs/TKOs, AvgSignificantStrikes, AvgTakedowns, AvgSubmissionAttempts.
    """
    if not RAPIDAPI_KEY:
        return _no_key_error("RapidAPI UFC-Data", "RAPIDAPI_KEY",
                             "https://rapidapi.com/dolphinnoirbusiness/api/ufc-data1")

    cache_key = f"rapid_fighter:{fighter_name.lower()}"
    if hit := _get(cache_key):
        return json.dumps({**hit, "cached": True})

    try:
        data = await _json(
            f"{RAPIDAPI_UFC}/Fighters/FindStatsByFighterName/{fighter_name}",
            headers=_rapid_ufc_headers()
        )
        _set(cache_key, data)
        return json.dumps({**data, "cached": False, "source": "rapidapi-ufc-data"})
    except Exception as e:
        return json.dumps({"error": str(e)})


# ── Tool: cache inspection ────────────────────────────────────────────────────
@mcp.tool(annotations={"readOnlyHint": True})
async def cache_status() -> str:
    """
    Show all cached keys and their remaining TTLs.

    Returns:
        JSON with entry count, default TTL, which data sources are configured,
        and per-key expiry countdowns.
    """
    now = time.time()
    entries = sorted(
        [{"key": k, "expires_in_seconds": max(0, int(v[0] - now))}
         for k, v in _cache.items()],
        key=lambda e: e["expires_in_seconds"]
    )
    return json.dumps({
        "total_entries": len(_cache),
        "ttl_default_seconds": CACHE_TTL,
        "sources_configured": {
            "cito_api": bool(CITO_KEY),
            "rapidapi_ufc": bool(RAPIDAPI_KEY),
            "tapology": bool(TAPOLOGY_KEY),
        },
        "entries": entries,
    })


@mcp.tool(annotations={"readOnlyHint": False, "destructiveHint": False})
async def clear_cache() -> str:
    """
    Flush the entire in-memory cache. Run right after a UFC event ends
    to force fresh data on the next query.

    Returns:
        Confirmation with count of flushed entries.
    """
    count = len(_cache)
    _cache.clear()
    return json.dumps({"flushed_entries": count, "status": "Cache cleared."})


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="UFC MCP Server")
    ap.add_argument("--port", type=int, default=None,
                    help="HTTP port (omit for stdio)")
    args = ap.parse_args()

    configured = []
    if CITO_KEY: configured.append("Cito API ✓")
    else:         configured.append("Cito API ✗ (set CITO_API_KEY)")
    if RAPIDAPI_KEY: configured.append("RapidAPI UFC-Data ✓")
    if TAPOLOGY_KEY: configured.append("Tapology RapidAPI ✓")
    print(f"[ufc-mcp] Sources: {', '.join(configured)}")

    if args.port:
        print(f"[ufc-mcp] HTTP on 127.0.0.1:{args.port}")
        mcp.run(transport="streamable-http", host="127.0.0.1", port=args.port)
    else:
        print("[ufc-mcp] stdio transport")
        mcp.run(transport="stdio")
