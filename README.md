# 🔐 KTTTTB Verification Demo

Demo web React để giả lập luồng xác thực thông tin thuê bao theo tài liệu API KTTTTB của Wiinvent.

## ✨ Tính năng

- ✅ **Luồng xác thực 3 bước hoàn chỉnh**
  - Bước 1: Nhập số điện thoại và thông tin cần xác thực → Gửi OTP
  - Bước 2: Xác thực mã OTP
  - Bước 3: Lấy dữ liệu xác thực và hiển thị kết quả

- 🎨 **Giao diện đẹp mắt**
  - Progress bar theo dõi tiến trình
  - Responsive design (mobile-friendly)
  - Hiệu ứng chuyển động mượt mà

- 🔧 **Mock API đầy đủ**
  - Giả lập 3 API endpoints: get-otp, verify-otp, get-data
  - Xử lý các trường hợp lỗi (4xx, 5xx)
  - Validation đầy đủ theo tài liệu

- 🔐 **Signature Generation**
  - Implement thuật toán HMAC-SHA256
  - Tạo headers theo đúng spec (X-Timestamp, X-Signature)

## 🚀 Cài đặt và chạy

### Cài đặt dependencies

\`\`\`bash
npm install
\`\`\`

### Cấu hình API credentials

1. Copy file `.env.example` thành `.env`:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Mở file `.env` và điền thông tin xác thực của bạn:
\`\`\`env
VITE_TENANT_CODE=your_tenant_code
VITE_BUSINESS_CODE=your_business_code
VITE_SECRET_KEY=your_secret_key
\`\`\`

**Lưu ý:** Nếu không có credentials, bạn có thể để giá trị mặc định nhưng API sẽ trả về lỗi xác thực.

### Chạy development server

\`\`\`bash
npm run dev
\`\`\`

Ứng dụng sẽ tự động mở tại: http://localhost:3000

### Build production

\`\`\`bash
npm run build
\`\`\`

### Preview production build

\`\`\`bash
npm run preview
\`\`\`

## 📖 Hướng dẫn sử dụng

### Sử dụng với API thật

1. **Bước 1 - Nhập số điện thoại:**
   - Nhập số điện thoại thật của bạn
   - Chọn loại thông tin cần xác thực (CMND/CCCD, Họ tên, Ngày sinh, v.v.)
   - Nhập giá trị tương ứng
   - Click "Gửi mã OTP"
   - Hệ thống sẽ gửi OTP qua SMS đến số điện thoại của bạn

2. **Bước 2 - Xác thực OTP:**
   - Nhập mã OTP nhận được từ SMS
   - Click "Xác thực OTP"
   - Hệ thống sẽ xác thực và trả về consent reference

3. **Bước 3 - Lấy dữ liệu:**
   - Xem thông tin consent reference và thời gian hết hạn
   - Click "Lấy dữ liệu" để xem kết quả xác thực

4. **Kết quả:**
   - Xem trạng thái đối chiếu từng trường thông tin
   - Khớp (✓) hoặc Không khớp (✗)

### Tính năng tự động loại bỏ option đã chọn

Khi thêm nhiều trường thông tin:
- Click "+" để thêm trường mới
- Các option đã chọn ở trường khác sẽ tự động bị ẩn
- Không thể chọn trùng loại thông tin
- Nút "+" sẽ bị disable khi đã chọn hết các option

## 📁 Cấu trúc dự án

\`\`\`
demo/
├── src/
│   ├── components/
│   │   ├── VerificationFlow.tsx    # Component chính
│   │   └── VerificationFlow.css    # Styles
│   ├── services/
│   │   └── kttttbApi.ts            # API service với mock
│   ├── types/
│   │   └── api.ts                  # TypeScript types
│   ├── utils/
│   │   └── signature.ts            # HMAC-SHA256 signature
│   ├── App.tsx                     # Root component
│   └── main.tsx                    # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
\`\`\`

## 🔑 API Endpoints (theo tài liệu)

### 1. Get OTP
- **URL:** `POST /v1/tenant/get-otp`
- **Headers:** X-Tenant-Code, X-Business-Code, X-Timestamp, X-Signature
- **Body:** requestId, msisdn, paramDetail
- **Response:** sessionOtp

### 2. Verify OTP
- **URL:** `POST /v1/tenant/verify-otp`
- **Headers:** X-Tenant-Code, X-Business-Code, X-Timestamp, X-Signature
- **Body:** requestId, msisdn, otp, sessionOtp
- **Response:** consentRef, timeToLife, expireTime

### 3. Get Data
- **URL:** `POST /v1/tenant/get-data`
- **Headers:** X-Tenant-Code, X-Business-Code, X-Timestamp, X-Signature
- **Body:** requestId, msisdn, consentRef, paramDetail
- **Response:** results[] (code, status, statusMessage)

## 🛠 Công nghệ sử dụng

- **React 19** - UI framework
- **TypeScript 6** - Type safety
- **Vite 6** - Build tool
- **Web Crypto API** - HMAC-SHA256 signature
- **CSS3** - Styling với gradient và animations

## 📝 Ghi chú

- Ứng dụng sử dụng API thật của KTTTTB
- Cần cấu hình credentials trong file `.env`
- OTP sẽ được gửi qua SMS đến số điện thoại thật
- Signature generation đã implement đầy đủ theo tài liệu
- Tự động loại bỏ các option đã chọn khi thêm trường mới

## 📄 License

ISC

## 👨‍💻 Author

Wiinvent - KTTTTB API Integration Demo
