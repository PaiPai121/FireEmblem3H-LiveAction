from pathlib import Path

from PIL import Image, ImageDraw


EP_ROOT = Path("episodes/EP03")
DATE_SUFFIX = "2026-07-29"
ROLES = [
    ("START", f"start_frame_imagegen_candidate_{DATE_SUFFIX}.png"),
    ("KEY", f"key_frame_imagegen_candidate_{DATE_SUFFIX}.png"),
    ("END", f"end_frame_imagegen_candidate_{DATE_SUFFIX}.png"),
]


def build_sheet(shot_dir: Path) -> bool:
    frame_paths = [(label, shot_dir / filename) for label, filename in ROLES]
    if not all(path.exists() for _, path in frame_paths):
        return False

    width = 620
    label_height = 38
    gap = 12
    background = (12, 12, 12)
    panels = []
    for label, frame_path in frame_paths:
        image = Image.open(frame_path).convert("RGB")
        height = int(image.height * width / image.width)
        panels.append((label, image.resize((width, height), Image.Resampling.LANCZOS)))

    height = max(image.height for _, image in panels) + label_height + 24
    sheet = Image.new("RGB", (width * len(panels) + gap * (len(panels) - 1), height), background)
    draw = ImageDraw.Draw(sheet)
    shot_id = shot_dir.name

    for index, (label, image) in enumerate(panels):
        x = index * (width + gap)
        draw.text((x + 8, 8), f"{shot_id} {label} - imagegen candidate / monitor_required", fill=(230, 230, 230))
        sheet.paste(image, (x, label_height))

    sheet.save(shot_dir / f"imagegen_frameset_contact_sheet_{DATE_SUFFIX}.jpg", quality=92)
    return True


def main() -> None:
    count = 0
    for shot_dir in sorted((EP_ROOT / "storyboards").glob("Shot*")):
        if shot_dir.is_dir() and build_sheet(shot_dir):
            count += 1
    print(f"built {count} EP03 imagegen contact sheets")


if __name__ == "__main__":
    main()
