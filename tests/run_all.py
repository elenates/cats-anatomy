"""Run every test_*.py in this folder. Exit code 1 if any fails. Usage: python3 tests/run_all.py"""
import glob, os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
failed = []
for t in sorted(glob.glob(os.path.join(here, "test_*.py"))):
    res = subprocess.run([sys.executable, t], capture_output=True, text=True)
    out = (res.stdout + res.stderr).strip()
    print(f"{'ok  ' if res.returncode == 0 else 'FAIL'} {os.path.basename(t)}")
    if res.returncode: failed.append(t); print("\n".join("     " + l for l in out.splitlines()[-15:]))
print(f"\n{len(failed)} failed" if failed else "\nall passed")
sys.exit(1 if failed else 0)
