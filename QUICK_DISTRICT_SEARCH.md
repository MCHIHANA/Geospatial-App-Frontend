# Quick Start: District Search Feature

## 🎯 What It Does
Search for any district in Malawi and instantly see all schools and health facilities within that district boundary.

## ⚡ Quick Setup (2 Steps)

### 1. Import Districts
Double-click: **`4-import-districts.bat`**

### 2. Start App
Double-click: **`start-dev.bat`**

## 🔍 How to Use

1. **Find the search bar** at the top center of the page
2. **Type a district name** (e.g., "Lilongwe")
3. **Select from dropdown**
4. **View results:**
   - Blue boundary shows district
   - Info panel shows facility counts
   - Map zooms to district
   - All facilities displayed

## 📍 Try These Districts
- Lilongwe
- Blantyre  
- Mzuzu
- Zomba
- Mangochi

## 🎨 What You'll See

### Search Bar (Top Center)
```
🔍 Search district (e.g., Lilongwe, Blantyre)...
```

### Info Panel (Top Right)
```
┌─────────────────────────┐
│ Lilongwe                │
├─────────────────────────┤
│ 🏥 Health Facilities: 45│
│ 🏫 Schools: 123         │
│ 📍 Total Facilities: 168│
└─────────────────────────┘
```

### Map Display
- 🔵 Blue boundary = District area
- 🔴 Red markers = Health facilities
- 🟢 Green markers = Schools

## ❌ Clear Search
Click the **X** button in search bar to return to full map

## 🆘 Issues?

**No districts showing?**
→ Run `4-import-districts.bat`

**No facilities?**
→ Make sure facilities are imported (check existing data)

**Backend not running?**
→ Run `start-dev.bat`

That's it! 🎉
