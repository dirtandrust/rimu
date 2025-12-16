# Keyboard Navigation

This document describes the keyboard navigation system implemented in The Recruitment Thing.

## Overview

The keyboard navigation system provides efficient keyboard shortcuts for navigating through the application, particularly in drawer interfaces where recruiters need to quickly review multiple candidate assessments.

## Implementation

### Hook: `useKeyboardNavigation`

Location: `/hooks/useKeyboardNavigation.ts`

A custom React hook that handles keyboard events for drawer navigation.

**Features:**
- Listens for keyboard events globally
- Prevents interference with text input fields (input, textarea, contenteditable)
- Allows customization of keyboard actions
- Can be enabled/disabled via the `enabled` prop

**API:**
```typescript
useKeyboardNavigation({
  onNext?: () => void;       // Called when Right Arrow is pressed
  onPrevious?: () => void;   // Called when Left Arrow is pressed
  onEscape?: () => void;     // Called when Escape key is pressed
  enabled?: boolean;         // Enable/disable the hook (default: true)
})
```

**Keyboard Mappings:**
- `←` (Left Arrow) - Navigate to previous item
- `→` (Right Arrow) - Navigate to next item
- `Esc` (Escape) - Close drawer/modal
- `↑↓` (Up/Down Arrows) - Native scroll behavior (not intercepted)

### Component: `KeyboardKey`

Location: `/components/KeyboardKey.tsx`

A presentational component that displays keyboard shortcuts in a keyboard-key-styled box.

**Usage:**
```tsx
<KeyboardKey>←</KeyboardKey>  // Displays a left arrow in a key box
<KeyboardKey>Ctrl</KeyboardKey>  // Displays "Ctrl" in a key box
```

**Styling:**
- White background with border and shadow
- Monospace font for keyboard character display
- Small, compact size suitable for tooltips

## Current Implementations

### Assessment Drawer

Location: `/components/AssessmentDrawer.tsx`

The Assessment Drawer uses keyboard navigation to allow recruiters to quickly move between candidate assessments.

**Active Shortcuts:**
- `←` - Go to previous candidate assessment
- `→` - Go to next candidate assessment  
- `Esc` - Close the drawer

**Visual Indicators:**
- Tooltips on Previous/Next buttons show the keyboard shortcuts
- Keyboard key symbols are styled in the KeyboardKey component

**Behavior:**
- Auto-saves changes before navigating to the next/previous candidate
- Only works when a candidate assessment is open
- Doesn't interfere with typing in input fields or textareas

## Future Enhancements

Potential keyboard shortcuts that could be added:

- **Number Keys (1-5)**: Quick scoring for competencies
- **Tab**: Navigate between competencies
- **S**: Save current assessment
- **N**: Create new note
- **Global Shortcuts**: 
  - `Cmd/Ctrl + K`: Quick search
  - `Cmd/Ctrl + N`: New assessment
  - `Cmd/Ctrl + ,`: Settings

## Best Practices

When implementing keyboard navigation:

1. **Don't interfere with form inputs** - Always check if the user is typing
2. **Provide visual indicators** - Use tooltips or help text to show available shortcuts
3. **Use standard conventions** - Follow platform conventions (Escape to close, arrows to navigate)
4. **Make it optional** - Allow users to disable keyboard shortcuts if needed
5. **Document clearly** - Show users what keyboard shortcuts are available

## Accessibility

- Keyboard navigation improves accessibility for users who prefer or require keyboard input
- Visible keyboard shortcut indicators (in tooltips) help with discoverability
- The `<kbd>` HTML element is semantically correct for keyboard input representation
