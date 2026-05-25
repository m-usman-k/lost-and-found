"""
Start demo API with seeded data, run the React dev server, capture screenshots,
and generate the Word document.

Usage (from repo root): python docs/build_submission.py
"""
import os
import subprocess
import sys
import time
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
DOCS = Path(__file__).resolve().parent
API_URL = "http://127.0.0.1:5000/"
APP_URL = "http://127.0.0.1:3000/"
APP_PORTS = (3000, 3001)


def wait_for(url, timeout=90):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urlopen(url, timeout=2) as res:
                if res.status < 500:
                    return True
        except Exception:
            pass
        time.sleep(0.5)
    return False


def spawn(cmd, cwd=None, env=None):
    return subprocess.Popen(
        cmd,
        cwd=cwd or ROOT,
        env=env or os.environ.copy(),
        shell=isinstance(cmd, str),
    )


def main():
    procs = []
    try:
        print("Seeding database and starting API...")
        api_proc = spawn(["node", "docs/demo_server.js"])
        procs.append(api_proc)

        if not wait_for(API_URL):
            raise RuntimeError("API did not start on port 5000")

        print("Starting Vite front end...")
        vite_bin = ROOT / "frontend" / "node_modules" / ".bin" / "vite"
        if os.name == "nt":
            vite_bin = vite_bin.with_suffix(".cmd")
        vite_proc = spawn(
            [str(vite_bin), "--host", "127.0.0.1", "--port", "3000", "--strictPort"],
            cwd=ROOT / "frontend",
        )
        procs.append(vite_proc)

        app_url = None
        for port in APP_PORTS:
            url = f"http://127.0.0.1:{port}/"
            if wait_for(url, timeout=30):
                app_url = url
                break
        if not app_url:
            raise RuntimeError("Front end did not start on port 3000 or 3001")

        print("Capturing screenshots...")
        env = os.environ.copy()
        env["APP_BASE_URL"] = app_url.rstrip("/")
        subprocess.check_call(
            [sys.executable, str(DOCS / "capture_screenshots.py")],
            cwd=ROOT,
            env=env,
        )

        print("Generating Word document...")
        subprocess.check_call([sys.executable, str(DOCS / "generate_submission_doc.py")], cwd=ROOT)

        print("Done:", DOCS / "AWT_Lab_Terminal_MERN_Submission.docx")
    finally:
        for p in procs:
            if p.poll() is None:
                p.terminate()
                try:
                    p.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    p.kill()


if __name__ == "__main__":
    main()
