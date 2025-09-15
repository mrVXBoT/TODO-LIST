# 🤝 راهنمای مشارکت در پروژه TODO List

خوش آمدید! از اینکه می‌خواهید در بهبود این پروژه مشارکت کنید، بسیار خوشحالیم! 🎉

## 📋 فهرست مطالب

- [کد رفتار](#-کد-رفتار)
- [نحوه مشارکت](#-نحوه-مشارکت)
- [گزارش باگ](#-گزارش-باگ)
- [درخواست ویژگی](#-درخواست-ویژگی)
- [ارسال Pull Request](#-ارسال-pull-request)
- [استانداردهای کد](#-استانداردهای-کد)
- [راه‌اندازی محیط توسعه](#-راهاندازی-محیط-توسعه)

## 📜 کد رفتار

با مشارکت در این پروژه، شما موافقت می‌کنید که:

- ✅ با احترام و مودبانه برخورد کنید
- ✅ از زبان مناسب و حرفه‌ای استفاده کنید
- ✅ نظرات سازنده ارائه دهید
- ✅ به یادگیری و بهبود کمک کنید
- ❌ از رفتار توهین‌آمیز خودداری کنید

## 🚀 نحوه مشارکت

### روش‌های مشارکت:

1. **🐛 گزارش باگ**: یافتن و گزارش مشکلات
2. **✨ پیشنهاد ویژگی**: ارائه ایده‌های جدید
3. **💻 بهبود کد**: ارسال Pull Request
4. **📖 بهبود مستندات**: کمک به مستندنویسی
5. **🧪 تست**: کمک به تست پروژه

## 🐛 گزارش باگ

قبل از گزارش باگ:

### ✅ چک‌لیست:
- [ ] مطمئن شوید که باگ قبلاً گزارش نشده ([Issues](https://github.com/mrVXBoT/TODO-LIST/issues))
- [ ] آخرین نسخه پروژه را استفاده می‌کنید
- [ ] مراحل باز تولید باگ را تست کرده‌اید

### 📝 قالب گزارش باگ:

```markdown
## 🐛 توضیح باگ
توضیح واضح و مختصر از مشکل

## 🔄 مراحل باز تولید
1. برو به '...'
2. کلیک کن روی '....'
3. اسکرول کن تا '....'
4. مشکل را ببین

## ✅ رفتار مورد انتظار
توضیح اینکه چه چیزی باید اتفاق می‌افتاد

## ❌ رفتار فعلی
توضیح اینکه چه چیزی در واقع اتفاق می‌افتد

## 📱 محیط:
- OS: [مثلاً iOS, Windows 10]
- Browser: [مثلاً Chrome, Safari]
- Version: [مثلاً 22]

## 📎 اطلاعات اضافی
Screenshot، log files، یا هر چیز مفید دیگری
```

## ✨ درخواست ویژگی

### 📝 قالب درخواست ویژگی:

```markdown
## 🚀 ویژگی پیشنهادی
توضیح واضح از ویژگی پیشنهادی

## 🎯 مشکل حل شده
این ویژگی چه مشکلی را حل می‌کند؟

## 💡 راه‌حل پیشنهادی
توضیح اینکه چطور این ویژگی باید کار کند

## 🔄 جایگزین‌های در نظر گرفته شده
راه‌حل‌های جایگزین که در نظر گرفته‌اید

## 📎 اطلاعات اضافی
Screenshot، mockup، یا هر چیز مفید دیگری
```

## 📥 ارسال Pull Request

### مراحل:

1. **🍴 Fork کنید** پروژه را
2. **🌿 ایجاد Branch** جدید:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **✏️ تغییرات** خود را commit کنید:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **📤 Push کنید** به branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **📬 باز کنید** یک Pull Request

### 📋 چک‌لیست Pull Request:

- [ ] کد تست شده است
- [ ] مستندات به‌روزرسانی شده (در صورت نیاز)
- [ ] تغییرات با استانداردهای کد مطابقت دارد
- [ ] Commit message های واضح و توضیحی
- [ ] PR description کامل است

### 📝 قالب Pull Request:

```markdown
## 📋 تغییرات
- ✅ ویژگی A اضافه شد
- 🐛 باگ B برطرف شد
- 📖 مستندات C به‌روزرسانی شد

## 🔗 مرتبط با Issue
Fixes #(issue number)

## 🧪 نحوه تست
توضیح اینکه چطور تغییرات را تست کرده‌اید

## 📱 تست شده روی:
- [ ] Desktop
- [ ] Mobile
- [ ] Chrome
- [ ] Firefox

## 📎 Screenshot ها
(در صورت نیاز)
```

## 🎨 استانداردهای کد

### Frontend (React/Next.js):
```typescript
// ✅ Good
const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await onComplete(task.id);
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-card">
      {/* Component JSX */}
    </div>
  );
};
```

### Backend (Node.js/Express):
```typescript
// ✅ Good
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### قوانین کلی:
- 📝 **TypeScript**: همیشه type ها را مشخص کنید
- 🎯 **نام‌گذاری**: نام‌های واضح و توصیفی
- 📖 **کامنت**: کد پیچیده را توضیح دهید
- 🧹 **Clean Code**: کد تمیز و خوانا بنویسید
- ⚡ **Performance**: عملکرد را در نظر بگیرید

## 🛠️ راه‌اندازی محیط توسعه

### 1. Clone و Setup:
```bash
git clone https://github.com/mrVXBoT/TODO-LIST.git
cd TODO-LIST
```

### 2. Backend Setup:
```bash
cd BACKEND
npm install
cp .env.example .env
# ویرایش فایل .env
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup:
```bash
cd ../FRONT
npm install
cp .env.example .env.local
# ویرایش فایل .env.local
npm run dev
```

### 4. تست:
```bash
# Backend tests
cd BACKEND
npm test

# Frontend tests
cd ../FRONT
npm test
```

## 🎯 اولویت‌های فعلی

### 🚨 High Priority:
- [ ] بهبود Mobile Responsiveness
- [ ] اضافه کردن Tests
- [ ] بهینه‌سازی Performance

### 🔄 Medium Priority:
- [ ] PWA Support
- [ ] Dark/Light Theme
- [ ] Multi-language Support

### 💡 Low Priority:
- [ ] Social Login
- [ ] Advanced Analytics
- [ ] Team Collaboration

## 📞 سوالات؟

اگر سوالی دارید:

- 🐛 **مشکل فنی**: [GitHub Issues](https://github.com/mrVXBoT/TODO-LIST/issues)
- 💬 **بحث عمومی**: [GitHub Discussions](https://github.com/mrVXBoT/TODO-LIST/discussions)
- 📱 **تماس مستقیم**: [@koxvx](https://t.me/koxvx)

## 🙏 تشکر

از مشارکت شما در بهبود این پروژه متشکریم! هر کمک کوچک یا بزرگی ارزشمند است. 🌟

---

**ساخته شده با ❤️ توسط [VX Developer](https://github.com/mrVXBoT)**
