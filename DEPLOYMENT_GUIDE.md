# 🚀 راهنمای انتقال TODO List به سرور

## 📋 پیش‌نیازها

### سرور:
- **Ubuntu 20.04+** یا **CentOS 7+**
- **Node.js 18+**
- **Nginx**
- **PM2** (برای مدیریت پروسه‌ها)
- **Domain** و **SSL Certificate**

---

## 🔧 مرحله 1: آماده‌سازی سرور

### نصب Node.js:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### نصب Nginx:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### نصب PM2:
```bash
npm install -g pm2
```

---

## 📦 مرحله 2: آپلود پروژه

### 1. فشرده‌سازی پروژه:
```bash
# روی کامپیوتر محلی
zip -r todo-app.zip . -x "*/node_modules/*" "*/dist/*" "*/.git/*"
```

### 2. آپلود به سرور:
```bash
# با SCP
scp todo-app.zip user@your-server:/home/user/

# یا با FTP/SFTP
```

### 3. استخراج در سرور:
```bash
cd /home/user
unzip todo-app.zip
cd TODO-LIST-main
```

---

## ⚙️ مرحله 3: تنظیمات محیطی

### 1. Backend Environment:
```bash
cd BACKEND
cp env.production.example .env
nano .env
```

**مقادیر مهم در `.env`:**
```env
DATABASE_URL="file:./production.db"
JWT_SECRET="your-super-secret-jwt-key-256-bit"
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"
CORS_ORIGINS="https://yourdomain.com"
```

### 2. Frontend Environment:
```bash
cd ../FRONT
cp env.production.example .env.local
nano .env.local
```

**مقادیر در `.env.local`:**
```env
NEXT_PUBLIC_API_URL="https://yourdomain.com/api"
```

---

## 🔨 مرحله 4: Build و نصب

### 1. Backend:
```bash
cd BACKEND
npm install --production
npx prisma generate
npx prisma db push
npm run build
```

### 2. Frontend:
```bash
cd ../FRONT
npm install --production
npm run build
```

---

## 🌐 مرحله 5: تنظیم Nginx

### 1. کپی تنظیمات:
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/todo-app
```

### 2. ویرایش فایل:
```bash
sudo nano /etc/nginx/sites-available/todo-app
```

**تغییر دامنه:**
- `yourdomain.com` → دامنه واقعی شما

### 3. فعال‌سازی:
```bash
sudo ln -s /etc/nginx/sites-available/todo-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔐 مرحله 6: SSL Certificate

### با Let's Encrypt:
```bash
# نصب Certbot
sudo apt install certbot python3-certbot-nginx

# دریافت گواهی
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🚀 مرحله 7: اجرای برنامه

### 1. شروع با PM2:
```bash
pm2 start ecosystem.config.js
```

### 2. مشاهده وضعیت:
```bash
pm2 status
pm2 logs
```

### 3. تنظیم Auto-start:
```bash
pm2 save
pm2 startup
# اجرای دستور نمایش داده شده
```

---

## 📊 مرحله 8: بررسی نهایی

### 1. تست Backend:
```bash
curl https://yourdomain.com/api/health
```

### 2. تست Frontend:
- مراجعه به `https://yourdomain.com`
- تست login/register
- تست Telegram bot

### 3. بررسی Logs:
```bash
pm2 logs todo-backend
pm2 logs todo-frontend
```

---

## 🔧 دستورات مفید

### مدیریت PM2:
```bash
pm2 restart all          # ری‌استارت همه
pm2 stop all             # متوقف کردن همه
pm2 delete all           # حذف همه پروسه‌ها
pm2 reload all           # بارگذاری مجدد بدون downtime
```

### مانیتورینگ:
```bash
pm2 monit               # مانیتور real-time
pm2 logs --lines 200    # آخرین 200 خط log
```

### آپدیت کد:
```bash
# 1. آپلود کد جدید
# 2. Build مجدد
cd BACKEND && npm run build
cd ../FRONT && npm run build

# 3. Restart
pm2 reload all
```

---

## 🚨 نکات امنیتی

### 1. Firewall:
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

### 2. تنظیمات پایگاه داده:
- فایل دیتابیس را در مسیر امن قرار دهید
- Backup منظم تنظیم کنید

### 3. تنظیمات Nginx:
- Rate limiting فعال کنید
- Security headers اضافه کنید

---

## 🆘 حل مشکلات رایج

### خطای Port در استفاده:
```bash
sudo lsof -i :3000
sudo lsof -i :3001
sudo kill -9 PID
```

### خطای Permission:
```bash
sudo chown -R $USER:$USER /path/to/todo-app
```

### خطای Nginx:
```bash
sudo nginx -t               # تست تنظیمات
sudo systemctl status nginx # بررسی وضعیت
sudo tail -f /var/log/nginx/error.log
```

### خطای PM2:
```bash
pm2 logs --lines 50        # بررسی logs
pm2 describe todo-backend  # جزئیات پروسه
```

---

## 📞 پشتیبانی

اگر با مشکلی مواجه شدید:

1. ✅ بررسی logs با `pm2 logs`
2. ✅ بررسی وضعیت سرویس‌ها با `pm2 status`
3. ✅ بررسی Nginx logs با `sudo tail -f /var/log/nginx/error.log`
4. ✅ تست اتصال API با `curl`

---

## 🎉 تبریک!

TODO List App شما روی سرور نصب شد! 🚀

**آدرس‌ها:**
- 🌐 **سایت:** https://yourdomain.com
- 📱 **API:** https://yourdomain.com/api
- 🤖 **Telegram Bot:** آماده دریافت اعلان‌ها

