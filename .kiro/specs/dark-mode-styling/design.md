# Dark Mode Styling Design Document

## Overview

This design document outlines the implementation of comprehensive dark mode styling for the inventory management application. The current application has a solid foundation with Tailwind CSS and CSS custom properties, but lacks complete dark mode support for the table component and some UI elements. The implementation will extend the existing dark mode infrastructure to provide a cohesive dark theme experience.

## Architecture

### Current State Analysis

The application currently uses:
- Tailwind CSS with custom dark mode variant (`@custom-variant dark (&:is(.dark *))`)
- CSS custom properties for theming in `globals.css`
- Existing dark mode support for Header and Sidebar components
- AG-Grid table with basic light theme styling
- Manual theme toggle functionality

### Design Approach

The implementation will follow these architectural principles:

1. **Extend Existing Infrastructure**: Build upon the current CSS custom properties and dark mode class system
2. **Component-Level Styling**: Maintain component isolation while ensuring consistency
3. **AG-Grid Theme Extension**: Create dark mode variants for the ag-theme-alpine styling
4. **Accessibility First**: Ensure proper contrast ratios and visual hierarchy
5. **Performance Optimized**: Use CSS custom properties for efficient theme switching

## Components and Interfaces

### 1. Global Dark Mode Variables

Extend the existing CSS custom properties in `globals.css` to include table-specific dark mode variables:

```css
.dark {
  /* Table-specific variables */
  --ag-background-color: #1f2937;
  --ag-foreground-color: #f9fafb;
  --ag-border-color: #374151;
  --ag-header-background-color: #111827;
  --ag-row-hover-color: #374151;
  --ag-row-selected-background-color: #1e40af;
  --ag-cell-focus-border-color: #60a5fa;
  
  /* Status indicator colors */
  --status-in-stock-bg: #065f46;
  --status-in-stock-text: #10b981;
  --status-low-stock-bg: #92400e;
  --status-low-stock-text: #f59e0b;
  --status-out-stock-bg: #991b1b;
  --status-out-stock-text: #ef4444;
}
```

### 2. AG-Grid Dark Theme

Create a comprehensive dark theme for AG-Grid that includes:

- Dark background colors for table body and headers
- Proper border colors for visual separation
- Hover and focus states with appropriate contrast
- Status indicator styling that maintains semantic meaning
- Responsive behavior that works across screen sizes

### 3. Table Action Bar

Enhance the table header action bar with dark mode styling:

- Dark background with proper contrast
- Button hover states that work in dark mode
- Icon colors that remain visible
- Border and shadow adjustments

### 4. Status Indicators

Redesign status badges to work effectively in dark mode:

- Darker background colors with lighter text
- Maintain color semantics (green for good, yellow for warning, red for danger)
- Ensure accessibility compliance with contrast ratios

### 5. Interactive Elements

Update all interactive table elements:

- Cell focus indicators with proper visibility
- Hover states for rows and cells
- Selection highlighting that stands out
- Comment tool integration with dark theme

## Data Models

### Theme Configuration

```typescript
interface DarkModeTheme {
  table: {
    background: string;
    foreground: string;
    border: string;
    headerBackground: string;
    rowHover: string;
    cellFocus: string;
  };
  status: {
    inStock: { bg: string; text: string };
    lowStock: { bg: string; text: string };
    outOfStock: { bg: string; text: string };
  };
  interactive: {
    buttonHover: string;
    inputBackground: string;
    inputBorder: string;
  };
}
```

### CSS Custom Properties Structure

The design will maintain the existing CSS custom properties pattern:

```css
:root {
  /* Light mode values */
}

.dark {
  /* Dark mode overrides */
}
```

## Error Handling

### Theme Transition Issues

- Implement smooth transitions between light and dark modes
- Handle cases where CSS custom properties might not be supported
- Provide fallback colors for older browsers

### Accessibility Compliance

- Ensure all color combinations meet WCAG AA contrast requirements
- Provide alternative indicators beyond color for status information
- Maintain keyboard navigation visibility in dark mode

### Visual Consistency

- Implement validation to ensure all components follow the same dark mode patterns
- Handle edge cases where custom styling might override theme colors
- Ensure third-party components (AG-Grid, Velt) integrate properly

## Testing Strategy

### Visual Testing

1. **Cross-Component Consistency**: Verify all components use consistent dark mode colors
2. **Theme Switching**: Test smooth transitions between light and dark modes
3. **Status Indicators**: Ensure status badges maintain semantic meaning and visibility
4. **Interactive States**: Verify hover, focus, and active states work properly

### Accessibility Testing

1. **Contrast Ratios**: Validate all text/background combinations meet WCAG AA standards
2. **Keyboard Navigation**: Ensure focus indicators are visible in dark mode
3. **Screen Reader Compatibility**: Verify status information is properly conveyed

### Browser Compatibility

1. **CSS Custom Properties**: Test fallbacks for older browsers
2. **Dark Mode Detection**: Verify system preference detection works correctly
3. **Performance**: Ensure theme switching doesn't cause layout shifts

### Integration Testing

1. **AG-Grid Integration**: Test table functionality with dark theme
2. **Velt Comments**: Ensure comment tools work properly in dark mode
3. **Responsive Behavior**: Verify dark mode works across all screen sizes

## Implementation Phases

### Phase 1: Core Table Styling
- Extend CSS custom properties for table colors
- Implement AG-Grid dark theme
- Update table action bar styling

### Phase 2: Status and Interactive Elements
- Redesign status indicators for dark mode
- Update interactive element styling
- Implement proper focus and hover states

### Phase 3: Integration and Polish
- Ensure smooth theme transitions
- Test accessibility compliance
- Optimize performance and browser compatibility

## Technical Considerations

### Performance
- Use CSS custom properties for efficient theme switching
- Minimize repaints during theme transitions
- Leverage existing Tailwind CSS infrastructure

### Maintainability
- Keep dark mode styles organized and well-documented
- Use consistent naming conventions for CSS variables
- Maintain separation between component-specific and global styles

### Scalability
- Design system that can easily accommodate new components
- Establish patterns that other developers can follow
- Create reusable dark mode utilities