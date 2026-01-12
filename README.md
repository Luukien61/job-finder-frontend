## Nguyên tắc quản lý assets trong Vite để build không lỗi

### 1. Cấu trúc thư mục chuẩn

```
src/
├── assets/           ← Assets được import trong code
│   ├── images/
│   │   ├── logo.svg
│   │   ├── banner.png
│   │   └── icons/
│   ├── fonts/
│   └── styles/
├── components/
├── pages/
└── main.tsx

public/              ← Assets tĩnh, không qua bundler
├── favicon.ico
├── robots.txt
└── images/          ← Ảnh dùng động (optional)
    └── uploads/
```

### 2. Nguyên tắc chính

#### ✅ **Thư mục `src/assets/` - Import vào code**

**Khi nào dùng:**
- Ảnh được import trực tiếp trong component
- Logo, icons, banner
- Ảnh cần optimize/process bởi Vite

**Cách dùng:**

```tsx
// ✅ ĐÚNG - Import từ src/assets
import logo from '@/assets/images/logo.svg'
import banner from '../assets/images/banner.png'

function Header() {
  return (
    <div>
      <img src={logo} alt="Logo" />
      <img src={banner} alt="Banner" />
    </div>
  )
}
```

**Vite sẽ:**
- Hash filename: `logo.svg` → `logo-a1b2c3d4.svg`
- Optimize ảnh
- Copy vào `dist/assets/`

#### ✅ **Thư mục `public/` - Assets tĩnh**

**Khi nào dùng:**
- File không thay đổi: `favicon.ico`, `robots.txt`
- Ảnh được load động từ API
- File cần URL tuyệt đối
- External libraries

**Cách dùng:**

```tsx
// ✅ ĐÚNG - Reference từ public/
function Avatar({ user }) {
  return (
    <div>
      {/* Favicon - luôn để trong public */}
      <link rel="icon" href="/favicon.ico" />
      
      {/* Ảnh động từ API */}
      <img src={`/images/users/${user.id}.jpg`} alt={user.name} />
      
      {/* Hoặc dùng biến */}
      <img src={`/uploads/${imageFileName}`} />
    </div>
  )
}
```

**Lưu ý:**
- Path bắt đầu bằng `/` (root)
- Vite sẽ copy nguyên xi vào `dist/`
- Không được hash filename

### 3. Các trường hợp cụ thể

#### 📷 **Case 1: Logo/Icons cố định**

```tsx
// ✅ ĐÚNG - Để trong src/assets, import vào
import logo from '@/assets/images/logo.svg'
import iconHome from '@/assets/icons/home.svg'

<img src={logo} />
<img src={iconHome} />
```

#### 📷 **Case 2: Background image trong CSS**

```css
/* ✅ ĐÚNG - Relative path từ CSS file */
.hero {
  background-image: url('../assets/images/hero-bg.jpg');
}

/* hoặc dùng alias */
.hero {
  background-image: url('@/assets/images/hero-bg.jpg');
}
```

```tsx
// ✅ ĐÚNG - Inline style với import
import heroBg from '@/assets/images/hero-bg.jpg'

<div style={{ backgroundImage: `url(${heroBg})` }} />
```

#### 📷 **Case 3: Ảnh động từ API/User upload**

```tsx
// ✅ ĐÚNG - Dùng public/ hoặc CDN
function ProductImage({ product }) {
  // Option 1: Public folder
  return <img src={`/uploads/products/${product.image}`} />
  
  // Option 2: CDN (khuyên dùng)
  return <img src={`https://cdn.yourdomain.com/${product.image}`} />
  
  // Option 3: S3 direct
  return <img src={product.imageUrl} />
}
```

#### 📷 **Case 4: Multiple images mapping**

```tsx
// ✅ ĐÚNG - Import all images
import avatar1 from '@/assets/avatars/avatar-1.png'
import avatar2 from '@/assets/avatars/avatar-2.png'
import avatar3 from '@/assets/avatars/avatar-3.png'

const avatars = {
  1: avatar1,
  2: avatar2,
  3: avatar3,
}

<img src={avatars[userId]} />
```

```tsx
// ✅ HOẶC - Dùng import.meta.glob (Vite)
const avatars = import.meta.glob('@/assets/avatars/*.png', { eager: true })

// Usage
Object.entries(avatars).map(([path, module]) => (
  <img key={path} src={module.default} />
))
```

#### 📷 **Case 5: Lazy load images**

```tsx
// ✅ ĐÚNG - Dynamic import
const loadImage = async (name: string) => {
  const image = await import(`@/assets/images/${name}.png`)
  return image.default
}

// Usage
const [imgSrc, setImgSrc] = useState('')

useEffect(() => {
  loadImage('banner').then(setImgSrc)
}, [])

<img src={imgSrc} />
```

### 4. Setup Path Alias (Khuyên dùng)

**`vite.config.ts`**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
})
```

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@assets/*": ["./src/assets/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

**Usage:**
```tsx
// Thay vì
import logo from '../../../assets/images/logo.svg'

// Dùng
import logo from '@assets/images/logo.svg'
```

### 5. Optimize Images

**Install image optimizer:**
```bash
npm install -D vite-plugin-image-optimizer
```

**`vite.config.ts`**
```typescript
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 80 },
    }),
  ],
})
```

### 6. Best Practices

#### ✅ DO's:

```tsx
// ✅ Import static assets
import logo from '@/assets/logo.svg'
<img src={logo} />

// ✅ Use public for dynamic paths
<img src={`/uploads/${filename}`} />

// ✅ Use CDN for user-uploaded content
<img src={`https://cdn.example.com/${image}`} />

// ✅ Alt text cho accessibility
<img src={logo} alt="Company Logo" />

// ✅ Lazy load images
<img src={src} loading="lazy" />
```

#### ❌ DON'T's:

```tsx
// ❌ SAI - Hardcode absolute path
<img src="/src/assets/logo.svg" />

// ❌ SAI - Path không tồn tại sau build
<img src="./assets/logo.svg" />

// ❌ SAI - Import từ public
import logo from '../../public/logo.svg' // Không work

// ❌ SAI - Template literal với import
const name = 'logo'
import img from `@/assets/${name}.svg` // Không work
```

### 7. Handling Different Environments

```tsx
// utils/imageUrl.ts
export const getImageUrl = (path: string) => {
  const isDev = import.meta.env.DEV
  const baseUrl = import.meta.env.VITE_CDN_URL || ''
  
  if (isDev) {
    return `/uploads/${path}`
  }
  
  return `${baseUrl}/${path}`
}

// Usage
<img src={getImageUrl('product.jpg')} />
```

### 8. Testing Before Deploy

```bash
# Build
npm run build

# Check dist/ structure
ls -la dist/
ls -la dist/assets/

# Preview build
npm run preview

# Test trong browser:
# - Mở DevTools > Network
# - Check tất cả images load được
# - Không có 404 errors
```

### 9. Common Errors & Solutions

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `404 Not Found` | Path sai | Dùng import hoặc `/public/...` |
| Ảnh không hiện sau build | Dùng relative path | Import hoặc dùng `/` prefix |
| `Cannot find module` | Path alias chưa config | Setup `@` alias trong vite.config |
| Ảnh bị duplicate | Import sai cách | Chỉ import 1 lần, reuse biến |

### 10. Production Checklist

```bash
✅ Assets Structure:
  - [ ] Static images trong src/assets/
  - [ ] Dynamic images trong public/ hoặc CDN
  - [ ] Favicon trong public/
  - [ ] Path alias configured

✅ Code:
  - [ ] Import images từ src/assets
  - [ ] Public assets dùng /path
  - [ ] Không hardcode absolute paths
  - [ ] Alt text cho tất cả images

✅ Build:
  - [ ] npm run build thành công
  - [ ] Check dist/assets/ có images
  - [ ] npm run preview test OK
  - [ ] No 404 errors trong console
```

## Tóm tắt nhanh:

1. **`src/assets/`** → Import vào code → Được hash & optimize
2. **`public/`** → Reference bằng `/path` → Copy nguyên xi
3. Luôn dùng `import` cho assets tĩnh
4. Dùng `/public/...` cho dynamic content
5. Setup path alias `@` cho clean imports

Bạn có case cụ thể nào cần xử lý không? 😊