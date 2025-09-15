<div align="center">

# 📋 TODO LIST APP

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=30&duration=3000&pause=1000&color=36BCF7&center=true&vCenter=true&width=500&lines=🚀+Modern+Todo+App;📱+With+Telegram+Bot;⚡+Next.js+%2B+Express;🎯+Task+Management" alt="Typing SVG" />

[![GitHub stars](https://img.shields.io/github/stars/mrVXBoT/TODO-LIST?style=for-the-badge&logo=github&color=yellow)](https://github.com/mrVXBoT/TODO-LIST/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mrVXBoT/TODO-LIST?style=for-the-badge&logo=github&color=blue)](https://github.com/mrVXBoT/TODO-LIST/network)
[![GitHub issues](https://img.shields.io/github/issues/mrVXBoT/TODO-LIST?style=for-the-badge&logo=github&color=red)](https://github.com/mrVXBoT/TODO-LIST/issues)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="700">

</div>

---

## 🌟 **ویژگی‌های کلیدی**

<table>
<tr>
<td width="50%">

### 🎯 **مدیریت وظایف**
- ✅ ایجاد، ویرایش و حذف وظایف
- 📅 تنظیم زمان سررسید
- ⏰ تنظیم زمان یادآوری
- 🎨 سطح اولویت (فوری، مهم، عادی)
- 📊 نمایش پیشرفت

</td>
<td width="50%">

### 📝 **سیستم یادداشت**
- 📄 دسته‌بندی بر اساس موضوع
- ✍️ ویرایشگر متن غنی
- 🔍 جستجوی سریع
- 📋 مدیریت یادداشت‌ها
- 🗂️ سازماندهی بهتر

</td>
</tr>
<tr>
<td width="50%">

### 🤖 **ربات تلگرام**
- 📲 اعلان‌های هوشمند
- 💬 مدیریت از طریق تلگرام
- ⚡ پاسخ‌های فوری
- 🔔 یادآوری‌های به‌موقع
- 🌐 دکمه‌های تعاملی

</td>
<td width="50%">

### 🎨 **رابط کاربری**
- 🌙 حالت تاریک/روشن
- 📱 طراحی ریسپانسیو
- 🇮🇷 پشتیبانی کامل فارسی
- ⚡ عملکرد بالا
- 🎭 انیمیشن‌های زیبا

</td>
</tr>
</table>

---

## 🛠️ **تکنولوژی‌های استفاده شده**

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

### Tools & Services
![Telegram Bot API](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

</div>

---

## 📱 **تصاویر و نمایش**

<div align="center">

### 🖥️ **رابط کاربری وب**

<img src="https://user-images.githubusercontent.com/74038190/212284136-03988914-d42b-4b24-b09c-7646307bbdc6.gif" width="200">

*تصاویر Screenshots در اینجا قرار می‌گیرد*

### 🤖 **ربات تلگرام**

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="200">

*تصاویر ربات تلگرام در اینجا قرار می‌گیرد*

</div>

---

## 🚀 **نصب و راه‌اندازی**

<details>
<summary><b>📦 نصب محلی (Development)</b></summary>

### پیش‌نیازها:
- Node.js 18+
- npm یا yarn
- Git

### مراحل نصب:

```bash
# 1. کلون پروژه
git clone https://github.com/mrVXBoT/TODO-LIST.git
cd TODO-LIST

# 2. نصب وابستگی‌ها - Backend
cd BACKEND
npm install
cp .env.example .env
# ویرایش فایل .env

# 3. راه‌اندازی دیتابیس
npx prisma generate
npx prisma db push

# 4. اجرای backend
npm run dev

# 5. نصب وابستگی‌ها - Frontend (Terminal جدید)
cd ../FRONT
npm install
cp .env.example .env.local
# ویرایش فایل .env.local

# 6. اجرای frontend
npm run dev
```

### 🌐 دسترسی:
- **Frontend**: http://localhost:9002
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/health

</details>

<details>
<summary><b>🚀 استقرار روی سرور (Production)</b></summary>

### روش آسان:
```bash
# اجرای اسکریپت آماده‌سازی
chmod +x setup-production.sh
./setup-production.sh

# یا برای Windows
powershell -ExecutionPolicy Bypass -File setup-production.ps1
```

### مراحل دستی:
```bash
# 1. نصب PM2
npm install -g pm2

# 2. Build پروژه
cd BACKEND && npm run build
cd ../FRONT && npm run build

# 3. تنظیم Environment Variables
# ویرایش فایل‌های .env

# 4. اجرا با PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

📖 [راهنمای کامل استقرار](DEPLOYMENT_GUIDE.md)

</details>

---

## 🤖 **تنظیم ربات تلگرام**

<details>
<summary><b>⚙️ راه‌اندازی ربات</b></summary>

### 1. ایجاد ربات:
1. به [@BotFather](https://t.me/botfather) در تلگرام پیام دهید
2. دستور `/newbot` را ارسال کنید
3. نام و username ربات را تعیین کنید
4. توکن دریافتی را کپی کنید

### 2. تنظیم در سایت:
1. وارد پنل کاربری شوید
2. بخش "تنظیمات" را باز کنید
3. توکن ربات و شناسه کاربری خود را وارد کنید
4. روی "تست اتصال" کلیک کنید

### 3. استفاده:
- ✅ دریافت اعلان وظایف
- 📋 مشاهده لیست وظایف
- 📝 دسترسی به یادداشت‌ها
- ⚡ تکمیل وظایف از تلگرام

</details>

---

## 📚 **مستندات API**

<details>
<summary><b>🔗 Endpoints اصلی</b></summary>

### احراز هویت:
```http
POST /api/auth/register    # ثبت‌نام
POST /api/auth/login       # ورود
GET  /api/auth/profile     # پروفایل کاربر
```

### وظایف:
```http
GET    /api/tasks          # لیست وظایف
POST   /api/tasks          # ایجاد وظیفه
PUT    /api/tasks/:id      # ویرایش وظیفه
DELETE /api/tasks/:id      # حذف وظیفه
```

### یادداشت‌ها:
```http
GET    /api/notes          # لیست یادداشت‌ها
POST   /api/notes          # ایجاد یادداشت
PUT    /api/notes/:id      # ویرایش یادداشت
DELETE /api/notes/:id      # حذف یادداشت
```

### تلگرام:
```http
GET  /api/users/telegram-settings    # تنظیمات تلگرام
PUT  /api/users/telegram-settings    # ویرایش تنظیمات
POST /api/users/test-telegram        # تست اتصال
```

</details>

---

## 🤝 **مشارکت در پروژه**

<div align="center">

### 💡 روش‌های مشارکت:

| نوع مشارکت | توضیح | نحوه انجام |
|------------|--------|------------|
| 🐛 **گزارش باگ** | یافتن و گزارش مشکلات | [Issue جدید](https://github.com/mrVXBoT/TODO-LIST/issues/new) |
| ✨ **ویژگی جدید** | پیشنهاد قابلیت‌های جدید | [Feature Request](https://github.com/mrVXBoT/TODO-LIST/issues/new) |
| 🔧 **بهبود کد** | بهبود کیفیت کد | [Pull Request](https://github.com/mrVXBoT/TODO-LIST/pulls) |
| 📖 **مستندات** | بهبود مستندات | [Documentation](https://github.com/mrVXBoT/TODO-LIST/wiki) |

</div>

### قوانین مشارکت:
1. 🍴 Fork کردن پروژه
2. 🌿 ایجاد branch جدید
3. ✏️ انجام تغییرات
4. ✅ تست تغییرات
5. 📬 ارسال Pull Request

---

## 📊 **آمار پروژه**

<div align="center">

![GitHub stats](https://github-readme-stats.vercel.app/api?username=mrVXBoT&repo=TODO-LIST&show_icons=true&theme=radical)

![Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=mrVXBoT&layout=compact&theme=radical)

</div>

---

## 🎯 **نقشه راه آینده**

<details>
<summary><b>🚧 ویژگی‌های در دست توسعه</b></summary>

### نسخه 2.0:
- [ ] 📊 Dashboard تحلیلی
- [ ] 👥 کار تیمی و اشتراک وظایف
- [ ] 🔗 ادغام با سرویس‌های خارجی
- [ ] 📱 اپلیکیشن موبایل
- [ ] 🎨 Theme های بیشتر

### نسخه 2.1:
- [ ] 🤖 هوش مصنوعی برای پیشنهاد وظایف
- [ ] 📈 گزارش‌گیری پیشرفته
- [ ] 🔔 اعلان‌های پیشرفته‌تر
- [ ] 🌍 پشتیبانی چندزبانه
- [ ] ☁️ همگام‌سازی ابری

</details>

---

## 🐛 **مشکلات شناخته شده**

<details>
<summary><b>⚠️ مسائل فعلی</b></summary>

| مشکل | وضعیت | راه حل موقت |
|------|--------|------------|
| SSL در development | 🔄 در حال بررسی | استفاده از ngrok |
| Timezone در notifications | ✅ حل شده | تنظیم منطقه زمانی |
| Mobile responsiveness | 🔄 در حال کار | استفاده از Desktop |

</details>

---

## 📞 **پشتیبانی و ارتباط**

<div align="center">

### 🌟 **سازنده پروژه**

<img src="https://user-images.githubusercontent.com/74038190/212284087-bbe7e430-757e-4901-90bf-4cd2ce3e1852.gif" width="100">

**VX Developer**

[![Telegram](https://img.shields.io/badge/Telegram-@koxvx-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/koxvx)
[![GitHub](https://img.shields.io/badge/GitHub-mrVXBoT-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mrVXBoT)

### 📧 **راه‌های ارتباط:**

| نوع درخواست | راه ارتباط |
|-------------|------------|
| 🐛 **گزارش باگ** | [GitHub Issues](https://github.com/mrVXBoT/TODO-LIST/issues) |
| 💡 **پیشنهادات** | [GitHub Discussions](https://github.com/mrVXBoT/TODO-LIST/discussions) |
| 📞 **پشتیبانی** | [@koxvx](https://t.me/koxvx) |
| 🤝 **همکاری** | [Pull Requests](https://github.com/mrVXBoT/TODO-LIST/pulls) |

</div>

---

## 📄 **مجوز استفاده**

<div align="center">

```
MIT License

Copyright (c) 2050 VX Developer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**🎉 این پروژه تحت مجوز MIT منتشر شده و استفاده از آن رایگان است!**

</div>

---

<div align="center">

### 🌟 **اگر پروژه مفید بود، یک ستاره بدهید!**

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="400">

**⭐ Star | 🍴 Fork | 📢 Share**

---

**ساخته شده با ❤️ توسط [VX Developer](https://github.com/mrVXBoT)**

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=20&duration=3000&pause=1000&color=36BCF7&center=true&vCenter=true&width=600&lines=Thanks+for+visiting!+⭐;Happy+Coding!+🚀;Don't+forget+to+star+the+repo!+🌟" alt="Thanks" />

</div>
