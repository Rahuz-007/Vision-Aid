"""
Example usage of the color_matcher module
"""

from color_matcher import load_color_database, find_nearest_color


def match_color_example():
    """Example function showing how to use the color matcher"""
    # Load the color database
    color_db = load_color_database('colors.csv')
    
    # Example: Find nearest color for a custom RGB value
    custom_rgb = (150, 75, 0)  # Brown-ish color
    
    result = find_nearest_color(custom_rgb, color_db)
    
    print(f"Looking for nearest match to RGB: {custom_rgb}")
    print(f"\nFound match:")
    print(f"  Color Name: {result['name']}")
    print(f"  Color ID: {result['id']}")
    print(f"  Hex Code: {result['hex']}")
    print(f"  RGB: {result['rgb']}")
    print(f"  Distance: {result['distance']:.2f}")


if __name__ == '__main__':
    match_color_example()
