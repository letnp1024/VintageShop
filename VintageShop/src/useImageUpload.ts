import imageCompression from 'browser-image-compression'

export const uploadImageToCloudinary = async (
  file: File,
  identifier: string,
  index: number,
  folder = 'products',
  prefix = 'product'
): Promise<string> => {
  console.log('File truyền vào uploadImageToCloudinary:', file)
  const timestamp = Date.now()
  const fileName = `${prefix}_${identifier}_${timestamp}_${index + 1}`

  // ⚡️ Tùy chọn nén ảnh
  const options = {
    maxSizeMB: 1,           // Dung lượng tối đa (MB)
    maxWidthOrHeight: 1000,   // Resize nếu quá lớn
    useWebWorker: true        // Dùng Web Worker cho hiệu suất
  }

  // 🧱 Nén ảnh
  const compressedFile = await imageCompression(file, options)

  // 📤 Tạo form data
  const formData = new FormData()
  formData.append("file", compressedFile)
  formData.append("upload_preset", "VintageShop")
  formData.append("public_id", `${folder}/${fileName}`)

  // 📡 Upload
  const response = await fetch("https://api.cloudinary.com/v1_1/dhcren7tz/image/upload", {
    method: "POST",
    body: formData
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || "Upload thất bại")

  return data.secure_url
}
