"""Capture UI screenshots for the lab submission document."""
import os
from pathlib import Path

import requests
from playwright.sync_api import sync_playwright

BASE = os.environ.get("APP_BASE_URL", "http://127.0.0.1:3000")
API = "http://127.0.0.1:5000/api"
OUT = Path(__file__).resolve().parent / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)


def login(email, password):
    res = requests.post(
        f"{API}/auth/login",
        json={"email": email, "password": password},
        timeout=10,
    )
    res.raise_for_status()
    data = res.json()
    return {"token": data["token"], "user": data["user"]}


def main():
    auth_admin = login("usman@example.com", "password123")
    auth_user = login("hassam@example.com", "password123")

    pages = [
        ("01-home.png", "/", None),
        ("02-login.png", "/login", None),
        ("03-register.png", "/register", None),
        ("04-report-item.png", "/report", auth_user),
        ("05-my-items.png", "/my-items", auth_user),
        ("06-my-claims.png", "/my-claims", auth_user),
        ("07-profile.png", "/profile", auth_user),
        ("08-admin-claims.png", "/admin/claims", auth_admin),
        ("09-admin-stats.png", "/admin/stats", auth_admin),
    ]

    item_id = None
    try:
        res = requests.get(f"{API}/items", timeout=3)
        if res.status_code == 200 and res.json().get("data"):
            item_id = res.json()["data"][0]["_id"]
    except requests.RequestException:
        pass
    if item_id:
        pages.insert(3, ("03b-item-detail.png", f"/items/{item_id}", None))

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        for filename, path, auth in pages:
            page.goto(BASE + "/")
            page.evaluate("() => { localStorage.clear(); }")
            if auth:
                page.evaluate(
                    """(auth) => {
                        localStorage.setItem('token', auth.token);
                        localStorage.setItem('user', JSON.stringify(auth.user));
                    }""",
                    auth,
                )
            page.goto(BASE + path, wait_until="networkidle")
            page.wait_for_timeout(1200)
            page.screenshot(path=str(OUT / filename), full_page=False)
            print("saved", filename)
        browser.close()


if __name__ == "__main__":
    main()
