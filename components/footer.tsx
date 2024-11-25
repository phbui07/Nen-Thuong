import Container from "@/components/container";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-hero">
      <Container>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 px-4 md:px-12 py-8">
          <div className="flex flex-col items-start justify-start gap-3">
            <h2 className="text-3xl font-semibold">Sản Phẩm</h2>
            <p className="text-white text-sm">Trang Chủ</p>
            <p className="text-white text-sm">Why Us?</p>
            <p className="text-white text-sm">Sản Phẩm Đặc Biệt</p>
            <p className="text-white text-sm">Sản Phẩm Thường</p>
          </div>

          <div className="flex flex-col items-start justify-start gap-3">
            <h2 className="text-3xl font-semibold">Hỗ Trợ</h2>
            <p className="text-white text-sm">Quyền Riêng Tư</p>
            <p className="text-white text-sm">Điều Khoản</p>
            <p className="text-white text-sm">Chính Sách</p>
          </div>

          <div className="flex flex-col items-start justify-start gap-3">
            <h2 className="text-3xl font-semibold">Liên Hệ</h2>
            <p className="text-white text-sm">+000 0000 0000</p>
            <p className="text-white text-sm">nenthuong2024@gmail.com</p>
            <p className="text-white text-sm">Nen Thuong, Vietnam</p>
          </div>

          <div className="flex flex-col items-start justify-start gap-3">
            <h2 className="text-3xl font-semibold">Nhận Thông Tin</h2>
            <div className="w-full rounded-md border-2 border-white flex items-center justify-center">
              <input
                type="text"
                placeholder="Enter your Email"
                className="h-full bg-transparent pl-4 text-sm text-white w-full outline-none border-none"
              />
              <Button className="bg-[#000] rounded-tr-none rounded-br-none border-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto py-8 ">
          <p className="text-center text-xs text-white">
            &copy; 2024 Nến Thương, Inc. All rights reserved
          </p>
        </div>
      </Container>
    </footer>
  );
}
