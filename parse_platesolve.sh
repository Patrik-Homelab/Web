#!/usr/bin/env python3
import sys
import re

def hms_to_deg(h, m, s):
    return (float(h) + float(m)/60.0 + float(s)/3600.0) * 15.0

def dms_to_deg(d, m, s):
    sign = -1.0 if '-' in str(d) else 1.0
    d_abs = abs(float(d))
    return sign * (d_abs + float(m)/60.0 + float(s)/3600.0)

def parse_fov(fov_str):
    # Matches patterns like 2d 29' 20.7"
    match = re.search(r"(\d+)d\s+(\d+)'\s+([\d.]+)\"", fov_str)
    if match:
        d, m, s = match.groups()
        return float(d) + float(m)/60.0 + float(s)/3600.0
    return None

def main():
    if len(sys.argv) > 1 and sys.argv[1] in ("-h", "--help"):
        print("Usage: ./parse_platesolve.sh < platesolve_output.txt")
        print("Or:    pbpaste | ./parse_platesolve.sh")
        return

    content = sys.stdin.read()
    if not content.strip():
        print("Error: Input is empty. Please pipe or paste the platesolving text into this script.")
        return
    
    # Extract Image Center: RA: 21 35 46.446  Dec: +57 26 31.78
    center_match = re.search(
        r"Image center\s*\.+\s*RA:\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+Dec:\s*([+-]?[\d.]+)\s+([\d.]+)\s+([\d.]+)",
        content
    )
    
    # Extract Field of view: 2d 29' 20.7" x 1d 22' 2.6"
    fov_match = re.search(r"Field of view\s*\.+\s*([^x\n]+)\s*x\s*([^\n]+)", content)
    
    # Extract Rotation: 62.169 deg
    rot_match = re.search(r"Rotation\s*\.+\s*([+-]?[\d.]+)\s*deg", content)
    
    print("\n" + "=" * 40)
    print("Parsed Decimal Values for Form Inputs")
    print("=" * 40)
    
    if center_match:
        ra_h, ra_m, ra_s, dec_d, dec_m, dec_s = center_match.groups()
        ra_deg = hms_to_deg(ra_h, ra_m, ra_s)
        dec_deg = dms_to_deg(dec_d, dec_m, dec_s)
        print(f"RA:       {ra_deg:.5f}")
        print(f"Dec:      {dec_deg:.5f}")
    else:
        print("RA/Dec:   Could not find 'Image center' coordinates.")
        
    if fov_match:
        w_str, h_str = fov_match.groups()
        w_deg = parse_fov(w_str)
        h_deg = parse_fov(h_str)
        if w_deg is not None and h_deg is not None:
            print(f"Width:    {w_deg:.5f}")
            print(f"Height:   {h_deg:.5f}")
        else:
            print("FOV:      Found 'Field of view' but failed to parse degrees/minutes/seconds.")
    else:
        print("FOV:      Could not find 'Field of view' details.")
        
    if rot_match:
        rot_deg = float(rot_match.group(1))
        print(f"Rotation: {rot_deg:.3f}")
    else:
        print("Rotation: Could not find 'Rotation' degrees.")
    print("=" * 40 + "\n")

if __name__ == '__main__':
    main()
