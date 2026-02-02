"""
Color Matcher - Find the nearest color match from a CSV file of RGB values
"""

import csv
import math
from typing import Tuple, Dict, List


def load_color_database(csv_path: str = 'colors.csv') -> List[Dict]:
    """
    Load the color database from CSV file.
    
    Args:
        csv_path: Path to the CSV file containing color data
        
    Returns:
        List of dictionaries with color information
    """
    colors = []
    with open(csv_path, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        for row in reader:
            if len(row) >= 6:
                colors.append({
                    'id': row[0],
                    'name': row[1],
                    'hex': row[2],
                    'r': int(row[3]),
                    'g': int(row[4]),
                    'b': int(row[5])
                })
    return colors


def calculate_rgb_distance(rgb1: Tuple[int, int, int], rgb2: Tuple[int, int, int]) -> float:
    """
    Calculate Euclidean distance between two RGB values.
    
    Args:
        rgb1: First RGB tuple (R, G, B)
        rgb2: Second RGB tuple (R, G, B)
        
    Returns:
        Euclidean distance between the two colors
    """
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(rgb1, rgb2)))


def find_nearest_color(rgb_input: Tuple[int, int, int], 
                       color_db: List[Dict]) -> Dict:
    """
    Find the nearest color match for a given RGB input.
    
    Args:
        rgb_input: RGB tuple (R, G, B) with values 0-255
        color_db: List of dictionaries containing color database
        
    Returns:
        Dictionary with matched color information and distance
    """
    min_distance = float('inf')
    nearest_color = None
    
    # Calculate distance to each color in the database
    for color in color_db:
        rgb_db = (color['r'], color['g'], color['b'])
        distance = calculate_rgb_distance(rgb_input, rgb_db)
        
        if distance < min_distance:
            min_distance = distance
            nearest_color = color
    
    return {
        'id': nearest_color['id'],
        'name': nearest_color['name'],
        'hex': nearest_color['hex'],
        'rgb': (nearest_color['r'], nearest_color['g'], nearest_color['b']),
        'distance': min_distance,
        'input_rgb': rgb_input
    }


def main():
    """Main function to demonstrate usage"""
    # Load color database
    print("Loading color database...")
    color_db = load_color_database('colors.csv')
    print(f"Loaded {len(color_db)} colors from database.\n")
    
    # Example usage
    test_colors = [
        (255, 0, 0),      # Red
        (0, 255, 0),      # Green
        (0, 0, 255),      # Blue
        (128, 128, 128),  # Gray
        (255, 192, 203),  # Pink
    ]
    
    print("Finding nearest color matches:\n")
    for rgb in test_colors:
        result = find_nearest_color(rgb, color_db)
        print(f"Input RGB: {rgb}")
        print(f"  Matched: {result['name']}")
        print(f"  Hex: {result['hex']}")
        print(f"  RGB: {result['rgb']}")
        print(f"  Distance: {result['distance']:.2f}")
        print()


if __name__ == '__main__':
    main()
