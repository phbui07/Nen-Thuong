import getProducts from "@/actions/get-products";
import Container from "@/components/container";
import PopularContent from "@/components/popular-content";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FileHeart, Salad, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

export default async function HomePage() {
  const products = await getProducts({ isFeatured: true });

  return (
    <>
      <Container className="px-4 md:px-12">
        <section className="grid grid-cols-1 md:grid-cols-2 py-12 pt-16">
          <div className="flex flex-col items-start justify-start gap-4">
            <p className="px-6 py-1 rounded-full text-neutral-500 border border-gray-300">
              Who Are We?
            </p>
            <h2 className="text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4">
              Chúng mình là <span>Ai?</span>
            </h2>
            <p className="text-base text-center md:text-left text-neutral-500 my-4">
            “Nến Thương” là dự án phi lợi nhuận được thành lập bởi các bạn trẻ cấp ba nhằm chia sẻ những điều tốt đẹp qua những chiếc nến thơm không chỉ tạo sự thư giãn trong không gian làm việc và học tập mà còn góp phần đem lại giá trị nhân văn trong cộng đồng.
            </p>
            <div className="my-4 flex text-center items-center justify-center gap-6 w-full md:w-auto">
              <Link href={"/menu"}>
                <Button className="px-8 md:px-16 py-4 md:py-6 rounded-full bg-hero duration-500">
                  Đặt Hàng
                </Button>
              </Link>
              <Link href={"https://www.facebook.com/profile.php?id=61555347850926"}>
                <Button
                  className="px-8 md:px-16 py-4 md:py-6 rounded-full duration-500"
                  variant={"outline"}
                >
                  Tìm Hiểu Thêm
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <div className="w-full relative h-[560px] flex items-center justify-center">
              <Image
                src={"/img/bannner.png"}
                alt="Hero"
                className="object-contain w-full h-full absolute"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>
        {/* Popular section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 gap-y-20 md:gap-12 my-4 py-12">
          {products.slice(0, 4).map((item) => (
            <PopularContent data={item} key={item.id} />
          ))}
        </section>
        {/* Why choose us */}
        <section className="my-4 py-12 flex flex-col items-center justify-center">
          <h2 className="text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4">
            Nến Thương
          </h2>
          <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2">
          Qua lợi nhuận thu được từ việc bán sản phẩm nến, chúng mình sẽ dùng phần quỹ nhỏ với mong muốn chung tay giúp đỡ những mảnh đời kém may mắn hơn chúng ta. Bằng sự tận tâm, nhiệt huyết trong công việc và công tác thiện nguyện, chúng mình hi vọng có thể đem đến niềm hạnh phúc nho nhỏ đến với các em .  
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-6 mt-20">
            <Card className="shadow-lg rounded-md border-none p-4 py-12 flex flex-col items-center justify-center gap-4">
              <Salad className="w-8 h-8 text-hero" />
              <CardTitle>Giúp Đỡ</CardTitle>
              <CardDescription className="text-center">
              Tiếp nối những giá trị tốt đẹp của “Nến Thương Gen 1.0”, Gen 2.0 của chúng mình sẽ tiếp tục chia sẻ toàn bộ lợi nhuận thu được thông qua các sản phẩm nến thơm. Mỗi khi một chiếc nến thơm được trao đến tay bạn đồng nghĩa với một món quà đã được trao đến tay các bạn nhỏ.
              </CardDescription>
            </Card>
            <Card className="shadow-lg rounded-md border-none p-4 py-12 flex flex-col items-center justify-center gap-4">
              <FileHeart className="w-8 h-8 text-hero" />
              <CardTitle>Sản Phẩm</CardTitle>
              <CardDescription className="text-center">
              Mỗi ngọn nến của Nến Thương được tạo ra từ những nguyên liệu tự nhiên tinh khiết như sáp ong và sáp đậu nành. Sự an toàn cho sức khỏe và tính thân thiện với môi trường luôn là tiêu chí hàng đầu mà chúng mình theo đuổi.
              </CardDescription>
            </Card>
            <Card className="shadow-lg rounded-md border-none p-4 py-12 flex flex-col items-center justify-center gap-4">
              <Truck className="w-8 h-8 text-hero" />
              <CardTitle>Tận Tâm</CardTitle>
              <CardDescription className="text-center">
              Khi bạn mua sản phẩm, không chỉ là gửi đi yêu thương, mà bạn còn đang góp phần tạo nên những điều tốt đẹp. Toàn bộ lợi nhuận từ việc bán nến của chúng mình sẽ được quyên góp cho quỹ từ thiện dành cho các em nhỏ có hoàn cảnh khó khăn. 
              </CardDescription>
            </Card>
          </div>
        </section>

        {/* Our chef sections */}
      </Container>
    </>
  );
}
