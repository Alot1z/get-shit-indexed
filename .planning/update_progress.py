# Progress update script for GSD workflows
# Calculates progress percentage from ROADMAP.md and updates STATE.md
import json
import sys

# Read ROADMAP.md
roadmap_path = '.planning/ROADMAP.md'
with open(roadmap_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
    phases = [p['phase'] for p in data]
    total = len(phases)
    completed = sum(1 for p in phases if 'summary' in open(p).lower() and 'SUMMARY.md' in open(p) else 0)
    # Count total plans across all phases
    # Calculate completed plans from summaries
    # Calculate progress

# Calculate percentage
completed = int((completed / total) * 100)
    blocks = "█" * completed + "░" * (total - completed)
    # Update progress string
    progress = f"Progress: [{\"█\" * completed // total if completed < total else \"\"}]"

# Print progress
print(progress)
print(f"Updated STATE.md with progress: {progress}")