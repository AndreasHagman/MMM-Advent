# MMM-Advent

An advent countdown candle for [MagicMirror²](https://magicmirror.builders). Forked and overhauled from [Jopyth/MMM-Advent](https://github.com/Jopyth/MMM-Advent) (MIT licensed) — rewritten with SVG rendering and two selectable themes.

## Themes

- **`minimal-glow`** (default) — soft off-white wax, subtle radial flame glow, numbered tick marks. Blends into a dark mirror display.
- **`ornate-holiday`** — deep red & gold candle with a wreath garland and a gold "days remaining" badge.

## Installation

Already present in this MagicMirror install at `modules/MMM-Advent`, tracked on the fork at `https://github.com/AndreasHagman/MMM-Advent`.

## Configuration

```js
{
    module: 'MMM-Advent',
    position: 'bottom_center',
    config: {
        theme: 'minimal-glow' // or 'ornate-holiday'
    }
}
```

| Option | Default | Description |
| --- | --- | --- |
| `theme` | `"minimal-glow"` | `"minimal-glow"` or `"ornate-holiday"` |
| `start` | `null` | Burn start (`YYYY-MM-DD HH-MM-SS`). `null` auto-computes Dec 1, current year. |
| `end` | `null` | Burn end (`YYYY-MM-DD HH-MM-SS`). `null` auto-computes Dec 24, current year. |
| `marks` | `24` | Number of tick marks on the candle |
| `showMarkNumbers` | `true` | Show a number next to each tick mark |
| `showDaysBadge` | `true` | Show the gold "days remaining" badge (`ornate-holiday` only) |
| `height` | `425` | Candle height in pixels |
| `showFlameBeforeStart` | `false` | Show the flame before the start date |
| `enableAnimation` | `true` | Enable the flame flicker animation |
| `updateInterval` | `600000` | Refresh interval in milliseconds (10 sec minimum) |

## Local preview

Open `preview.html` directly in a browser to iterate on both themes across the full burn timeline, without running the MagicMirror server.
