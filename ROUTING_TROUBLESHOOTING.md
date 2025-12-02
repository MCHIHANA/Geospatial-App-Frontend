# 🔧 Routing Troubleshooting Guide

## Current Issue

You're seeing: **"No route found between these points. The road network may not connect these locations."**

This error appears when the A* pathfinding algorithm can't find a connected path between two points in the road network.

## Most Likely Cause

**❗ Backend server not restarted after code changes**

The routing service loads the graph into memory when the server starts. Code changes won't take effect until you restart.

## Step-by-Step Fix

### 1. Stop Current Backend

In the terminal running your backend:
- Press **Ctrl+C** to stop the server

### 2. Restart Backend

```bash
cd c:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\geospatial-app\server
npm run start:dev
```

### 3. Wait for Confirmation

You MUST see this message before testing:
```
Initializing Routing Graph...
Graph built with 708790 nodes and 893934 links.
[Nest] ... LOG [NestApplication] Nest application successfully started
```

> [!IMPORTANT]
> If you see fewer nodes (like 0 nodes), the road data isn't loaded. Run `npm run import:data` first.

### 4. Test with Known Good Coordinates

Use these coordinates that are guaranteed to work:

**Test 1: Lilongwe to Blantyre**
- Origin: `-13.9833, 33.7833`
- Destination: `-15.7861, 35.0058`
- Expected: ~245km, ~3-4 hours driving

**Test 2: Zomba to Mzuzu**
- Origin: `-15.3850, 35.3188`
- Destination: `-11.4500, 34.0200`
- Expected: ~400km, ~6-7 hours driving

## Other Possible Issues

### Issue 2: Coordinates Outside Malawi

**Symptoms:** Error mentions points are too far from roads

**Solution:** Verify coordinates are in Malawi:
- Latitude: between -9° and -17°
- Longitude: between 32° and 36°

### Issue 3: Road Data Not Loaded

**Symptoms:** Backend shows "Graph built with 0 nodes"

**Solution:**
```bash
cd server
npm run import:data
```

Wait for import to complete (~5-10 minutes), then restart backend.

### Issue 4: Disconnected Road Networks

**Symptoms:** Both points snap to roads but no route found

**Explanation:** Some remote areas may have roads that don't connect to the main network.

**Solution:** Try coordinates closer to major cities or main roads.

## Quick Diagnostic

Run this to check your setup:

```bash
cd c:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\geospatial-app
test-routing.bat
```

This will:
- ✅ Check if database exists
- ✅ Count roads in database
- ✅ Show sample coordinates
- ✅ Display road network bounds

## Verification Checklist

- [ ] Backend server restarted after code changes
- [ ] Saw "Graph built with 708790 nodes" message
- [ ] Using coordinates within Malawi bounds
- [ ] Tried the test coordinates above
- [ ] Checked backend console for error logs

## What the Fix Changed

The code changes increased the snap-to-road threshold from 5km to 15km. But these changes are **only in the code files**. The running server still has the old code in memory until you restart it.

**Before restart:** Old code (5km threshold) ❌  
**After restart:** New code (15km threshold) ✅

## Still Not Working?

If routing still fails after restart, check:

1. **Backend console logs** - Look for:
   - `⚠️ No road found within...` messages
   - `❌ Routing failed:` messages
   - These show which point failed and why

2. **Browser console** (F12) - Check for:
   - Network errors
   - API response details

3. **Run diagnostic:**
   ```bash
   cd server
   npm run check:routing
   ```

Share the output and I can help further!

## Example: Successful Routing

When working correctly, you should see:

**Backend console:**
```
✅ Route calculated: 245.32km, 367.9 min (driving), 1234 nodes
```

**Browser UI:**
- Travel time: 6h 8min
- Distance: 245.32 km
- Snap to Road: Origin: 0.2 km from road, Destination: 0.5 km from road

---

**TL;DR: Restart your backend server and try the test coordinates above!**
