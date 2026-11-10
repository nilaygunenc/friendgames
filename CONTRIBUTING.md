# 🤝 Katkıda Bulunma Rehberi

FriendGames projesine katkıda bulunmak istediğiniz için teşekkürler!

## 🚀 Başlamadan Önce

1. Projeyi fork edin
2. Local'e klonlayın
3. Dependencies yükleyin
4. `.env` dosyalarını oluşturun
5. Database'i kurun

## 💻 Geliştirme Süreci

### 1. Branch Oluşturun

```bash
git checkout -b feature/amazing-feature
# veya
git checkout -b fix/bug-fix
# veya
git checkout -b docs/update-readme
```

### 2. Değişikliklerinizi Yapın

- Clean code yazın
- TypeScript type safety'e dikkat edin
- Mevcut code style'a uyun
- Yorumlar ekleyin (gerekirse)

### 3. Test Edin

```bash
# Backend
cd backend
npm run dev

# Mobile
cd mobile
npm start
```

### 4. Commit Edin

Conventional Commits kullanın:

```bash
git commit -m "feat: Add new game engine"
git commit -m "fix: Fix admin panel login"
git commit -m "docs: Update installation guide"
git commit -m "style: Format code"
git commit -m "refactor: Improve database queries"
```

### 5. Push Edin

```bash
git push origin feature/amazing-feature
```

### 6. Pull Request Açın

- Açıklayıcı başlık yazın
- Ne değişti açıklayın
- Ekran görüntüsü ekleyin (gerekirse)
- Review bekleyin

## 📝 Commit Message Format

```
<type>: <subject>

<body> (opsiyonel)

<footer> (opsiyonel)
```

**Types:**
- `feat`: Yeni özellik
- `fix`: Bug fix
- `docs`: Dokümantasyon
- `style`: Formatting, missing semi colons, etc
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintain

**Örnekler:**
```
feat: Add tabu card management to admin panel
fix: Resolve database connection timeout
docs: Update API endpoint documentation
style: Format admin.html with prettier
refactor: Extract game engine logic to separate files
```

## 🐛 Bug Report

Bug bulduysanız:

1. GitHub Issues'a gidin
2. Bug report template'i kullanın
3. Detaylı açıklama yazın:
   - Ne oldu?
   - Ne olması gerekiyordu?
   - Nasıl reproduce edilir?
   - Environment (OS, Node version, etc.)
   - Ekran görüntüsü/log

## ✨ Feature Request

Yeni özellik önerisi:

1. GitHub Issues'a gidin
2. Feature request template'i kullanın
3. Detaylı açıklama yazın:
   - Ne yapmak istiyorsunuz?
   - Neden gerekli?
   - Nasıl çalışmalı?
   - Mockup/örnek (varsa)

## 📋 Code Review Checklist

Pull Request açmadan önce kontrol edin:

- [ ] Code çalışıyor
- [ ] Testler geçiyor (varsa)
- [ ] Dokümantasyon güncellendi
- [ ] TypeScript hataları yok
- [ ] Linting hataları yok
- [ ] `.env.example` güncellendi (gerekirse)
- [ ] Breaking change yok (veya belirtildi)

## 🎨 Code Style

- TypeScript kullanın
- Camel case (değişkenler, fonksiyonlar)
- Pascal case (components, classes)
- Kebab case (dosya isimleri)
- Anlamlı isimler kullanın
- Magic numbers yerine constants
- Arrow functions kullanın
- Async/await kullanın (Promise.then() yerine)

## 📂 Dosya Yapısı

```
backend/
  src/
    controllers/    # Route handlers
    routes/         # API routes
    middleware/     # Middleware functions
    db/             # Database related
    types/          # TypeScript types
    
mobile/
  src/
    screens/        # App screens
    components/     # Reusable components
    engines/        # Game engines
    utils/          # Helper functions
    types/          # TypeScript types
```

## 🧪 Testing

*(Test infrastructure yakında eklenecek)*

## 📖 Dokümantasyon

- README.md güncelleyin
- API endpoint değişikliklerini belirtin
- Inline comments ekleyin
- JSDoc kullanın (TypeScript için)

## 🚫 Yapılmaması Gerekenler

- ❌ Doğrudan `main` branch'e push etmeyin
- ❌ `.env` dosyalarını commit etmeyin
- ❌ Şifre/API key'leri commit etmeyin
- ❌ Binary files commit etmeyin (büyük resimler, videolar)
- ❌ `node_modules` commit etmeyin
- ❌ Büyük değişiklikler tek commit'te

## 📧 İletişim

Sorularınız için:
- GitHub Issues
- Email: dev@friendgames.app

## 🙏 Teşekkürler!

Her katkı değerlidir! ❤️
