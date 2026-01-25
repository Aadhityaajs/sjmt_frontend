# Quick Start Guide

## 🚀 Get Running in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Backend URL
Edit `src/services/authApi.ts` line 3:
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```
Change to your backend URL if different.

### Step 3: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173/login`

## 🔑 Login

Use your backend credentials:
- **Admin account**: Gets full access to all 8 pages
- **Staff account**: Gets access to 5 pages (no Users, Staff, Analytics)

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `src/services/authApi.ts` | API endpoints and backend URL |
| `src/router.tsx` | Route configuration |
| `src/contexts/AuthContext.tsx` | Authentication logic |
| `src/pages/Users.tsx` | User management page |
| `src/components/layout/` | Layout components |

## 🎯 Test User Management

1. Login as Admin
2. Click "Users" in sidebar
3. Click "Add User" button
4. Fill form and submit
5. Edit user by clicking "Edit"
6. Delete user by clicking "Delete"

## 🐛 Common Issues

**Login not working?**
```bash
# Check backend is running
curl http://localhost:3000/api/auth/login

# Check browser console for CORS errors
```

**Routes not loading?**
```bash
# Clear browser session storage
localStorage.clear()
sessionStorage.clear()

# Refresh page
```

**Build failing?**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📱 Features Overview

### Authentication
- ✅ JWT-based login/logout
- ✅ Auto token refresh
- ✅ Session expires on browser close

### Dashboard
- ✅ Stats cards
- ✅ Collapsible sidebar
- ✅ User avatar & menu
- ✅ Dark mode toggle

### User Management (Admin Only)
- ✅ Add users (password auto-generated)
- ✅ Edit role & privileges
- ✅ Delete with confirmation
- ✅ Form validation

### Pages
- Dashboard, Inventory, Billing, Quotation, Users, Staff, Analytics, Expense

## 🎨 UI Components

**Sidebar:**
- Click arrow icon to collapse/expand
- Icons remain visible when collapsed
- Role-based menu items

**Header:**
- Shows username and role
- Click avatar for dropdown menu
- Logout button in dropdown

**Users Page:**
- Cards show user details
- Green badge = ACTIVE user
- Purple badge = ADMIN role
- Blue badge = STAFF role

## 🔐 Roles & Privileges

**Roles:**
- `ADMIN` - Access to all pages
- `STAFF` - Limited page access

**Privileges:**
- `READ` - View only
- `CREATE` - Can add new items
- `UPDATE` - Can modify (highest)

**Note:** ADMIN role always has full privileges regardless of assigned privilege.

## 📖 Documentation

- **SETUP.md** - Detailed setup and architecture
- **IMPLEMENTATION_SUMMARY.md** - Complete feature list
- **QUICK_START.md** - This file (quick reference)

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## ✅ Production Checklist

Before deploying:
- [ ] Update `API_BASE_URL` to production backend
- [ ] Test all user flows (admin and staff)
- [ ] Run `npm run build` successfully
- [ ] Configure CORS on backend
- [ ] Set up HTTPS for production
- [ ] Test on mobile devices
- [ ] Verify dark mode works
- [ ] Check all toast notifications
- [ ] Test form validations

## 🎯 Next Steps

1. **Customize:** Update branding, colors, logo
2. **Implement:** Build out placeholder pages (Inventory, Billing, etc.)
3. **Enhance:** Add more features (search, filters, pagination)
4. **Deploy:** Build and deploy to hosting platform

## 📞 Need Help?

1. Check browser console for errors
2. Review `SETUP.md` for detailed info
3. Verify backend is running
4. Check API responses in Network tab

---

**Happy Coding! 🎉**
