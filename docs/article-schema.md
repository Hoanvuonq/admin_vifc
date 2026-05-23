# Article Schema

## JSON Content

```json
{
  "id": "post-uuid-12345",
  "title": "Web3 Commerce: Xu hướng mua sắm tương lai",
  "slug": "web3-commerce-xu-huong-mua-sam",
  "layouts": ["1", "2", "3", "4", "5"],
  "summary": "Bài viết này phân tích sâu về cách Web3 đang thay đổi ngành thương mại điện tử...",
  "createdAt": "2026-05-23T14:00:00.000Z",
  "updatedAt": "2026-05-23T14:30:00.000Z",
  "blocks": [
    {
      "type": "heading",
      "level": "2",
      "content": "1. Giới thiệu về Web3 Commerce"
    },
    {
      "type": "text",
      "content": "Trong hệ sinh thái mới này, người dùng hoàn toàn kiểm soát dữ liệu..."
    },
    {
      "type": "text",
      "content": "Blockchain mang lại sự minh bạch và phi tập trung cho thương mại..."
    },
    {
      "type": "image",
      "url": "https://example.com/uploads/thumbnail.jpg"
    },
    {
      "type": "pdf",
      "url": "https://example.com/uploads/file.pdf",
      "thumbnail": "https://example.com/uploads/thumbnail.jpg",
      "activeRole": "free",
      "name": "Báo cáo Web3 Commerce 2026"
    }
  ],
  "seoTitle": "Tương lai Web3 Commerce 2026",
  "seoDescription": "Khám phá cách Web3 thay đổi thương mại điện tử với tính minh bạch cao...",
  "seoKeywords": "web3, ecommerce"
}
```

---

## Type Definitions

### Article (Root)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | UUID định danh bài viết |
| `title` | `string` | ✅ | Tiêu đề bài viết |
| `slug` | `string` | ✅ | URL-friendly slug |
| `layouts` | `string[]` | ✅ | Layout hiển thị (`"1"` → `"5"`) |
| `summary` | `string` | ✅ | Tóm tắt ngắn bài viết |
| `createdAt` | `string (ISO 8601)` | ✅ | Thời điểm tạo |
| `updatedAt` | `string (ISO 8601)` | ✅ | Thời điểm cập nhật |
| `blocks` | `ArticleBlock[]` | ✅ | Mảng block nội dung |
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
| `thumbnail` | `string` | ❌ | URL ảnh bìa (page 1) |
| `activeRole` | `"free" \| "base" \| "standard" \| "premium"` | ✅ | Quyền truy cập tối thiểu |
| `name` | `string` | ❌ | Tên hiển thị PDF |
