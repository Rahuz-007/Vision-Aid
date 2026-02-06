# Accessibility Features

This Vision Aid application has been designed with accessibility in mind, specifically for color-blind users and users with visual impairments.

## Features Implemented

### 1. High Contrast Mode
- **WCAG AAA Compliant**: Meets the highest contrast ratio standards (7:1 for normal text, 4.5:1 for large text)
- **Toggle Control**: Users can enable/disable high contrast mode via a checkbox in the accessibility settings
- **Visual Indicators**: All UI elements maintain clear visibility in both normal and high contrast modes

### 2. Color-Blind Friendly Design
- **Shape-Based Indicators**: Traffic signals are indicated using shapes in addition to colors:
  - **Red**: Circle (●)
  - **Yellow**: Triangle (▲)
  - **Green**: Square (■)
  - **Unknown**: Question mark (?)
- **Text Labels**: All color information is conveyed through text labels
- **Icon Support**: Buttons include icons/symbols alongside text labels

### 3. Enhanced Voice Alerts
- **Text-to-Speech (TTS)**: Automatic voice announcements for:
  - Webcam start/stop
  - Image capture confirmation
  - Detection results with detailed descriptions
- **Customizable Speed**: Voice speed can be adjusted from 0.5x to 2.0x
- **Toggle Control**: Users can enable/disable voice alerts
- **Repeat Function**: Users can replay the last announcement
- **Stop Function**: Users can stop ongoing announcements

### 4. Screen Reader Support
- **ARIA Labels**: All interactive elements have proper ARIA labels
- **Live Regions**: Dynamic content updates are announced to screen readers
- **Semantic HTML**: Proper use of HTML5 semantic elements (main, section, etc.)
- **Skip Links**: "Skip to main content" link for keyboard navigation
- **Screen Reader Only Text**: Additional context provided via `.sr-only` class

### 5. Keyboard Navigation
- **Full Keyboard Support**: All functionality accessible via keyboard
- **Focus Indicators**: Clear, high-contrast focus outlines (3px solid border)
- **Logical Tab Order**: Elements are navigated in a logical sequence
- **Keyboard Shortcuts**: Space/Enter keys activate focused buttons

### 6. Visual Accessibility
- **Minimum Touch Targets**: All interactive elements meet 48x48px minimum size
- **Large Text**: Font sizes are scalable and meet WCAG standards
- **Clear Borders**: All interactive elements have visible borders (3-4px)
- **Reduced Motion**: Respects `prefers-reduced-motion` media query

### 7. Error Handling
- **Clear Error Messages**: Errors are announced both visually and audibly
- **Success Feedback**: Confirmation messages for successful actions
- **Status Indicators**: Visual and auditory feedback for all actions

## Usage

### Enabling High Contrast Mode
1. Look for the "High Contrast Mode" checkbox in the Accessibility Settings section
2. Check the box to enable high contrast
3. The entire interface will switch to high contrast colors
4. Uncheck to return to normal mode

### Adjusting Voice Settings
1. Ensure "Enable Voice Alerts" is checked
2. Use the "Voice Speed" slider to adjust speech rate
3. Speed ranges from 0.5x (slow) to 2.0x (fast)
4. Changes take effect immediately

### Keyboard Navigation
- **Tab**: Move between interactive elements
- **Shift+Tab**: Move backwards
- **Space/Enter**: Activate focused button
- **Escape**: Close dialogs (if applicable)

## WCAG Compliance

This application aims to meet **WCAG 2.1 Level AAA** standards:

- ✅ **Perceivable**: High contrast, text alternatives, captions
- ✅ **Operable**: Keyboard accessible, no seizure-inducing content, sufficient time
- ✅ **Understandable**: Readable, predictable, input assistance
- ✅ **Robust**: Compatible with assistive technologies

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Note: Voice synthesis features require browser support for Web Speech API.

## Testing with Screen Readers

Tested with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

## Color Contrast Ratios

### Normal Mode
- Text on background: 21:1 (black on white)
- Buttons: Minimum 4.5:1
- Focus indicators: High visibility

### High Contrast Mode
- Text on background: 21:1 (white on black)
- All elements: Minimum 7:1 contrast ratio
- Enhanced borders: 4-5px solid borders

## Feedback

If you encounter any accessibility issues, please report them so we can continue to improve the application.
