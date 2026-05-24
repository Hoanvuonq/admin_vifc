# Article Schema

## JSON Content

```json
{
  "id": "post-uuid-1779608741492",
  "title": "Ngẫu nhiên hay có cơ sở? Vì sao các dự án này lọt hồ sơ của ZachXBT?",
  "description": "Thông tin từ ZachXBT về một cuộc điều tra lớn sắp được công bố đã thu hút sự chú ý rộng rãi trong cộng đồng crypto. Bài viết này không chỉ đi theo những diễn biến nóng hiện tại mà còn mở rộng góc nhìn để xem xét các nhóm thực thể bị nghi ngờ và lý do",
  "thumbnail": "https://vifc.s3.amazonaws.com/image/1779608558656-N_ngi_sao_mng_ngi_Vit.jpg",
  "slug": "ngu-nhin-hay-c-c-s-v-sao-cc-d-n-ny-lt-h-s-ca-zachxbt",
  "layouts": "2",
  "createdAt": "2026-05-24T07:45:41.492Z",
  "updatedAt": "2026-05-24T07:45:41.492Z",
  "blocks": [
    {
      "type": "heading",
      "level": "2",
      "content": "Nhóm thực thể nào bị nghi ngờ sau thông báo của ZachXBT?"
    },
    {
      "type": "text",
      "content": "Khi ZachXBT nói đến insider trading kéo dài bên trong “một trong những công ty có lợi nhuận cao nhất ngành”, phạm vi suy đoán thực tế không rộng."
    },
    {
      "type": "text",
      "content": "Nếu nhìn vào dữ liệu tài chính công khai đến tháng 1/2026, cộng đồng cho rằng chỉ một số rất ít thực thể trong crypto đạt quy mô doanh thu và lợi nhuận ở mức hệ thống."
    },
    {
      "type": "image",
      "url": "https://vifc.s3.amazonaws.com/image/1779608560000-content-image.jpg"
    },
    {
      "type": "pdf",
      "url": "https://vifc.s3.amazonaws.com/pdfs/1779608577254-WealthandAssetManagementOutlook.pdf",
      "thumbnail": "https://vifc.s3.amazonaws.com/pdfs/thumbnails/1779608577254-thumb.jpg",
      "activeRole": "base",
      "name": "Wealth and Asset Management Outlook - September 2024.pdf"
    }
  ],
  "seoTitle": "web3",
  "seoDescription": "web3",
  "seoKeywords": "web3"
}
```

---

## Type Definitions

### Article (Root)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | UUID định danh bài viết |
| `title` | `string` | ✅ | Tiêu đề bài viết |
| `description` | `string` | ✅ | Tóm tắt / mô tả ngắn bài viết |
| `thumbnail` | `string` | ✅ | URL ảnh bìa (Banner) trên S3 |
| `slug` | `string` | ✅ | URL-friendly slug |
| `layouts` | `string` | ✅ | ID của Layout hiển thị (VD: `"2"`) |
| `createdAt` | `string (ISO 8601)` | ✅ | Thời điểm tạo |
| `updatedAt` | `string (ISO 8601)` | ✅ | Thời điểm cập nhật |
| `content` | `string` | ✅ | Nội dung HTML đã được compile từ blocks |
| `blocks` | `ArticleBlock[]` | ✅ | Mảng block dữ liệu thô (để edit) |
| `seoTitle` | `string` | ❌ | Tiêu đề SEO |
| `seoDescription` | `string` | ❌ | Mô tả SEO |
| `seoKeywords` | `string` | ❌ | Từ khóa SEO |

---

### Block: `heading`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `"heading"` | ✅ | Loại block |
| `level` | `"2" \| "3" \| "4"` | ✅ | Cấp độ heading |
| `content` | `string` | ✅ | Nội dung tiêu đề |

### Block: `text`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `"text"` | ✅ | Loại block |
| `content` | `string` | ✅ | Nội dung đoạn văn |

### Block: `image`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `"image"` | ✅ | Loại block |
| `url` | `string` | ✅ | URL ảnh trên S3 |

### Block: `pdf`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `"pdf"` | ✅ | Loại block |
| `url` | `string` | ✅ | URL file PDF trên S3 |
| `thumbnail` | `string` | ❌ | URL ảnh bìa (page 1) trên S3 |
| `activeRole` | `"free" \| "base" \| "standard" \| "premium"` | ✅ | Quyền truy cập tối thiểu |
| `name` | `string` | ❌ | Tên hiển thị PDF |
