export const languages = ["vi", "en"] as const;
export type Language = (typeof languages)[number];

export const defaultLanguage: Language = "vi";
export const LANGUAGE_COOKIE = "lang";

export function isLanguage(value: unknown): value is Language {
  return languages.includes(value as Language);
}

const vi = {
  locale: "vi-VN",
  meta: {
    title: "Nến Thương – Nến thơm thủ công vì cộng đồng",
    description:
      "Nến Thương là doanh nghiệp xã hội do học sinh dẫn dắt, gây quỹ từ thiện qua việc sản xuất và bán nến thơm thủ công.",
    products: "Sản phẩm",
    about: "Về chúng mình",
    cart: "Giỏ hàng",
    orders: "Đơn hàng của tôi",
  },
  nav: {
    label: "Điều hướng chính",
    home: "Trang Chủ",
    products: "Sản Phẩm",
    about: "Về Chúng Mình",
    orders: "Đơn Hàng",
    signIn: "Đăng Nhập",
    signUp: "Đăng Ký",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    cart: (count: number) => `Giỏ hàng (${count} sản phẩm)`,
    // The language button offers the *other* language, labelled in that language.
    switchLanguage: "Switch to English",
    otherLanguageCode: "EN",
  },
  breadcrumb: {
    label: "Đường dẫn",
    home: "Trang Chủ",
    products: "Sản Phẩm",
    cart: "Giỏ Hàng",
    orders: "Đơn Hàng",
    about: "Về Chúng Mình",
  },
  impact: {
    title: "Những con số của Nến Thương",
    stats: [
      { value: "80+", label: "học sinh tham gia", detail: "tại Việt Nam, Mỹ và Úc" },
      { value: "4.000 USD", label: "doanh thu", detail: "từ cửa hàng online, mạng xã hội và gian hàng ở trường" },
      { value: "1.500 USD", label: "đã quyên góp", detail: "cho các trại trẻ mồ côi và UNICEF" },
      { value: "2.000+", label: "khán giả được tiếp cận", detail: "qua chuỗi “Empathize to Love”" },
    ],
  },
  home: {
    eyebrow: "Who Are We?",
    titleStart: "Chúng mình là\u00A0",
    titleAccent: "ai?",
    intro:
      "“Nến Thương” là dự án phi lợi nhuận được thành lập bởi các bạn trẻ cấp ba nhằm chia sẻ những điều tốt đẹp qua những chiếc nến thơm không chỉ tạo sự thư giãn trong không gian làm việc và học tập mà còn góp phần đem lại giá trị nhân văn trong cộng đồng.",
    shopNow: "Đặt Hàng",
    learnMore: "Tìm Hiểu Thêm",
    heroImageAlt: "Ba hũ nến thơm của Nến Thương",
    featuredEyebrow: "Featured",
    featuredTitle: "Sản phẩm nổi bật",
    viewAll: "Xem tất cả",
    missionTitle: "Nến Thương",
    missionText:
      "Qua lợi nhuận thu được từ việc bán sản phẩm nến, chúng mình sẽ dùng phần quỹ nhỏ với mong muốn chung tay giúp đỡ những mảnh đời kém may mắn hơn chúng ta. Bằng sự tận tâm, nhiệt huyết trong công việc và công tác thiện nguyện, chúng mình hi vọng có thể đem đến niềm hạnh phúc nho nhỏ đến với các em.",
    pillars: [
      {
        title: "Giúp Đỡ",
        text: "Tiếp nối những giá trị tốt đẹp của “Nến Thương Gen 1.0”, Gen 2.0 của chúng mình sẽ tiếp tục chia sẻ toàn bộ lợi nhuận thu được thông qua các sản phẩm nến thơm. Mỗi khi một chiếc nến thơm được trao đến tay bạn đồng nghĩa với một món quà đã được trao đến tay các bạn nhỏ.",
      },
      {
        title: "Sản Phẩm",
        text: "Mỗi ngọn nến của Nến Thương được tạo ra từ những nguyên liệu tự nhiên tinh khiết như sáp ong và sáp đậu nành. Sự an toàn cho sức khỏe và tính thân thiện với môi trường luôn là tiêu chí hàng đầu mà chúng mình theo đuổi.",
      },
      {
        title: "Tận Tâm",
        text: "Khi bạn mua sản phẩm, không chỉ là gửi đi yêu thương, mà bạn còn đang góp phần tạo nên những điều tốt đẹp. Toàn bộ lợi nhuận từ việc bán nến của chúng mình sẽ được quyên góp cho quỹ từ thiện dành cho các em nhỏ có hoàn cảnh khó khăn.",
      },
    ],
    journeyEyebrow: "Our Journey",
    journeyTitle: "Hành trình lan tỏa yêu thương",
    journeyText:
      "Không chỉ làm nến, chúng mình còn trực tiếp đến thăm, trò chuyện và vui chơi cùng các em nhỏ. Lợi nhuận từ mỗi chiếc nến được quyên góp cho các trại trẻ mồ côi và UNICEF.",
    journeyCta: "Về chúng mình",
  },
  photos: {
    team: { alt: "Đội ngũ Nến Thương chụp ảnh cùng nhau ngoài trời", caption: "Đội ngũ Nến Thương" },
    audience: { alt: "Các em nhỏ ngồi chăm chú theo dõi chương trình", caption: "Các em chăm chú theo dõi chương trình" },
    storytelling: { alt: "Tình nguyện viên cầm micro nói chuyện với các em nhỏ", caption: "Giao lưu cùng các em" },
    friends: { alt: "Một em nhỏ cười tươi trò chuyện cùng tình nguyện viên", caption: "Những cuộc trò chuyện nhỏ" },
    games: { alt: "Tình nguyện viên dẫn trò chơi, các em giơ tay hào hứng", caption: "Trò chơi tập thể" },
    conversation: { alt: "Hai tình nguyện viên trò chuyện vui vẻ cùng một cô", caption: "Niềm vui được sẻ chia" },
    boothSchool: { alt: "Học sinh giới thiệu nến tại gian hàng Nến Thương ở trường", caption: "Gian hàng tại trường" },
    boothSale: {
      alt: "Khách xem nến tại gian hàng có tấm biển “100% lợi nhuận được quyên góp”",
      caption: "100% lợi nhuận được quyên góp",
    },
  },
  about: {
    eyebrow: "About Us",
    title: "Về Chúng Mình",
    lead: "Nến Thương là doanh nghiệp xã hội do học sinh dẫn dắt. Chúng mình gây quỹ cho các hoạt động từ thiện bằng cách sản xuất và bán nến thơm thủ công, hướng đến cả những hoàn cảnh khó khăn trong nước lẫn các mục tiêu toàn cầu.",
    howEyebrow: "How It Works",
    howTitle: "Cách Nến Thương hoạt động",
    steps: [
      {
        title: "Tự tay làm nến",
        text: "Hơn 80 học sinh tại Việt Nam, Mỹ và Úc cùng nhau sản xuất những chiếc nến thơm thủ công.",
      },
      {
        title: "Bán hàng đa kênh",
        text: "Nến đến tay mọi người qua cửa hàng trực tuyến, mạng xã hội và các gian hàng tại trường, mang về 4.000 USD doanh thu.",
      },
      {
        title: "Trao gửi yêu thương",
        text: "1.500 USD đã được quyên góp cho các trại trẻ mồ côi và UNICEF.",
      },
    ],
    boothEyebrow: "On Campus",
    boothTitle: "Gian hàng Nến Thương",
    boothText: "Bên cạnh cửa hàng trực tuyến và mạng xã hội, chúng mình còn mở các gian hàng bán nến ngay tại trường.",
    seriesEyebrow: "Awareness Series",
    seriesTitle: "Empathize to Love",
    seriesText:
      "Chuỗi “Empathize to Love” dùng những câu chuyện để giáo dục và nâng cao nhận thức về việc hỗ trợ trẻ em có hoàn cảnh khó khăn.",
    seriesStat: "2.000+",
    seriesStatLabel: "khán giả được tiếp cận",
    galleryEyebrow: "Moments",
    galleryTitle: "Những khoảnh khắc thiện nguyện",
    galleryText: "Những chuyến đi thăm, trò chuyện và vui chơi cùng các em nhỏ.",
    ctaTitle: "Cùng Nến Thương lan tỏa yêu thương",
    ctaText: "Mỗi chiếc nến bạn chọn là một phần quà gửi đến các em nhỏ.",
    ctaShop: "Mua nến ngay",
    ctaFollow: "Theo dõi trên Facebook",
  },
  gallery: {
    open: (caption: string) => `Phóng to ảnh: ${caption}`,
    close: "Đóng",
    previous: "Ảnh trước",
    next: "Ảnh tiếp theo",
  },
  products: {
    allProducts: "Tất cả sản phẩm",
    count: (count: number) => `${count} sản phẩm`,
    categories: "Danh Mục",
    sizes: "Dung Tích",
    filterLabels: { category: "Danh mục", size: "Dung tích", origin: "Xuất xứ", isFeatured: "Nổi bật" } as Record<
      string,
      string
    >,
    featured: "Nổi bật",
    removeFilter: (label: string) => `Bỏ bộ lọc ${label}`,
    clearFilters: "Xóa bộ lọc",
    emptyFilteredTitle: "Không có sản phẩm phù hợp",
    emptyFilteredText: "Thử bỏ bớt bộ lọc để xem thêm sản phẩm nhé.",
    emptyTitle: "Sản phẩm đang được cập nhật",
    emptyText: "Bạn quay lại sau ít phút nữa nhé!",
    add: "Thêm",
    addLabel: (name: string) => `Thêm ${name} vào giỏ hàng`,
    like: (name: string) => `Yêu thích ${name}`,
    unlike: (name: string) => `Bỏ yêu thích ${name}`,
  },
  product: {
    category: "Danh mục",
    size: "Dung tích",
    origin: "Xuất xứ",
    quantity: "Số lượng",
    decrease: "Giảm số lượng",
    increase: "Tăng số lượng",
    addToCart: "Thêm vào giỏ",
    buyNow: "Mua ngay",
    donationNote: "Toàn bộ lợi nhuận được dùng để giúp đỡ các em nhỏ có hoàn cảnh khó khăn.",
    related: "Có thể bạn cũng thích",
    imageAlt: (name: string, index: number) => `${name} – ảnh ${index}`,
    viewImage: (index: number) => `Xem ảnh ${index}`,
    notFoundTitle: "Không tìm thấy sản phẩm",
    notFoundText: "Sản phẩm này không tồn tại hoặc tạm thời không tải được.",
    backToProducts: "Xem sản phẩm khác",
  },
  cart: {
    title: "Giỏ hàng",
    clear: "Xóa tất cả",
    emptyTitle: "Giỏ hàng của bạn đang trống",
    emptyText: "Hãy chọn một chiếc nến thơm — mỗi đơn hàng đều góp phần giúp đỡ các em nhỏ.",
    browse: "Xem sản phẩm",
    summary: "Tóm tắt đơn hàng",
    subtotal: (count: number) => `Tạm tính (${count} sản phẩm)`,
    total: "Tổng cộng",
    checkout: "Thanh toán",
    added: (name: string) => `Đã thêm “${name}” vào giỏ hàng`,
    removed: (name: string) => `Đã xóa “${name}” khỏi giỏ hàng`,
    cleared: "Đã xóa toàn bộ giỏ hàng",
    remove: (name: string) => `Xóa ${name} khỏi giỏ hàng`,
    paymentSuccess: "Thanh toán thành công! Cảm ơn bạn đã ủng hộ Nến Thương.",
    paymentCancelled: "Thanh toán chưa hoàn tất, bạn thử lại nhé.",
    checkoutFailed: "Không thể thanh toán lúc này, bạn thử lại sau nhé.",
  },
  orders: {
    title: "Đơn hàng của tôi",
    emptyTitle: "Bạn chưa có đơn hàng nào",
    emptyText: "Khi bạn đặt mua nến, đơn hàng sẽ hiển thị ở đây.",
    browse: "Xem sản phẩm",
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    statuses: {
      Processing: "Đang xử lý",
      Delivering: "Đang giao",
      Delivered: "Đã giao",
      Canceled: "Đã hủy",
    } as Record<string, string>,
  },
  footer: {
    tagline: "Nến thơm thủ công — toàn bộ lợi nhuận được dùng để giúp đỡ các em nhỏ có hoàn cảnh khó khăn.",
    explore: "Khám phá",
    contact: "Liên hệ",
    locations: "Việt Nam · Mỹ · Úc",
    rights: "Mọi quyền được bảo lưu.",
  },
  status: {
    notFoundTitle: "Không tìm thấy trang",
    notFoundText: "Trang bạn tìm có thể đã bị xóa hoặc không tồn tại.",
    backHome: "Về trang chủ",
    errorTitle: "Đã có lỗi xảy ra",
    errorText: "Xin lỗi, có gì đó chưa ổn. Bạn thử lại nhé.",
    retry: "Thử lại",
  },
};

export type Dictionary = typeof vi;

const en: Dictionary = {
  locale: "en-US",
  meta: {
    title: "Nến Thương – Handmade candles for a good cause",
    description:
      "Nến Thương is a student-led social enterprise that funds charitable donations by making and selling handmade scented candles.",
    products: "Products",
    about: "About us",
    cart: "Cart",
    orders: "My orders",
  },
  nav: {
    label: "Main navigation",
    home: "Home",
    products: "Products",
    about: "About Us",
    orders: "Orders",
    signIn: "Sign In",
    signUp: "Sign Up",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    cart: (count: number) => `Cart (${count} ${count === 1 ? "item" : "items"})`,
    switchLanguage: "Chuyển sang tiếng Việt",
    otherLanguageCode: "VI",
  },
  breadcrumb: {
    label: "Breadcrumb",
    home: "Home",
    products: "Products",
    cart: "Cart",
    orders: "Orders",
    about: "About Us",
  },
  impact: {
    title: "Nến Thương in numbers",
    stats: [
      { value: "80+", label: "student members", detail: "across Vietnam, the U.S., and Australia" },
      { value: "$4,000", label: "in revenue", detail: "from e-\u2060commerce, social media, and school booths" },
      { value: "$1,500", label: "donated", detail: "to orphanages and UNICEF" },
      { value: "2,000+", label: "people reached", detail: "through the “Empathize to Love” series" },
    ],
  },
  home: {
    eyebrow: "A Student-Led Social Enterprise",
    titleStart: "Who are\u00A0",
    titleAccent: "we?",
    intro:
      "“Nến Thương” is a non-profit project founded by high school students to share kindness through scented candles — candles that not only bring calm to your work and study space, but also bring real humanitarian value to the community.",
    shopNow: "Shop Now",
    learnMore: "Learn More",
    heroImageAlt: "Three jars of Nến Thương scented candles",
    featuredEyebrow: "Featured",
    featuredTitle: "Featured candles",
    viewAll: "View all",
    missionTitle: "Nến Thương",
    missionText:
      "With the profits from our candle sales, we build a small fund to help those less fortunate than us. Through dedication and passion in both our work and our volunteering, we hope to bring a little happiness to the children.",
    pillars: [
      {
        title: "Giving",
        text: "Carrying on the values of “Nến Thương Gen 1.0”, our Gen 2.0 keeps sharing all of the profits from our scented candles. Every candle that reaches your hands means a gift has reached a child's hands.",
      },
      {
        title: "Our Candles",
        text: "Every Nến Thương candle is made from pure, natural ingredients such as beeswax and soy wax. Your health and the environment are always our top priorities.",
      },
      {
        title: "Dedication",
        text: "When you buy from us, you're not just sending love — you're helping create something good. All profits from our candle sales are donated to a charity fund for children in difficult circumstances.",
      },
    ],
    journeyEyebrow: "Our Journey",
    journeyTitle: "Spreading love, one visit at a time",
    journeyText:
      "Beyond making candles, we visit, talk, and play with the children ourselves. The profits from every candle are donated to orphanages and UNICEF.",
    journeyCta: "About us",
  },
  photos: {
    team: { alt: "The Nến Thương team posing together outdoors", caption: "The Nến Thương team" },
    audience: { alt: "Children sitting on the floor, watching the program attentively", caption: "All eyes on the program" },
    storytelling: { alt: "A volunteer speaking into a microphone to a group of children", caption: "Getting to know the kids" },
    friends: { alt: "A smiling child chatting with a volunteer", caption: "Small conversations, big smiles" },
    games: { alt: "A volunteer leading a game while children raise their hands", caption: "Group games" },
    conversation: { alt: "Two volunteers laughing with an older woman", caption: "Sharing the joy" },
    boothSchool: { alt: "Students presenting candles at a Nến Thương booth at school", caption: "Our school booth" },
    boothSale: {
      alt: "Customers looking at candles at a booth with a “100% profits will be donated” sign",
      caption: "100% of profits donated",
    },
  },
  about: {
    eyebrow: "About Us",
    title: "About Nến Thương",
    lead: "Nến Thương is a student-led social enterprise. We fund charitable donations by making and selling handmade scented candles, championing both local and global causes.",
    howEyebrow: "How It Works",
    howTitle: "How Nến Thương works",
    steps: [
      {
        title: "Handmade by students",
        text: "An international team of 80+ students across Vietnam, the U.S., and Australia produces our handmade scented candles.",
      },
      {
        title: "Sold across many channels",
        text: "Our candles reach people through e-\u2060commerce, social media, and school booths, generating $4,000 in revenue.",
      },
      {
        title: "Giving back",
        text: "$1,500 has been donated to orphanages and UNICEF.",
      },
    ],
    boothEyebrow: "On Campus",
    boothTitle: "Nến Thương booths",
    boothText: "Alongside our online shop and social media, we also run candle booths right at school.",
    seriesEyebrow: "Awareness Series",
    seriesTitle: "Empathize to Love",
    seriesText:
      "The “Empathize to Love” series uses storytelling to educate and raise awareness about supporting disadvantaged children.",
    seriesStat: "2,000+",
    seriesStatLabel: "people reached",
    galleryEyebrow: "Moments",
    galleryTitle: "Moments from our visits",
    galleryText: "Visiting, talking, and playing with the children.",
    ctaTitle: "Spread love with Nến Thương",
    ctaText: "Every candle you choose is a gift for a child in need.",
    ctaShop: "Shop candles",
    ctaFollow: "Follow us on Facebook",
  },
  gallery: {
    open: (caption: string) => `Enlarge photo: ${caption}`,
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
  },
  products: {
    allProducts: "All products",
    count: (count: number) => `${count} ${count === 1 ? "product" : "products"}`,
    categories: "Categories",
    sizes: "Sizes",
    filterLabels: { category: "Category", size: "Size", origin: "Origin", isFeatured: "Featured" },
    featured: "Featured",
    removeFilter: (label: string) => `Remove ${label} filter`,
    clearFilters: "Clear filters",
    emptyFilteredTitle: "No matching products",
    emptyFilteredText: "Try removing a filter to see more products.",
    emptyTitle: "Our products are being updated",
    emptyText: "Please check back in a few minutes!",
    add: "Add",
    addLabel: (name: string) => `Add ${name} to cart`,
    like: (name: string) => `Add ${name} to favorites`,
    unlike: (name: string) => `Remove ${name} from favorites`,
  },
  product: {
    category: "Category",
    size: "Size",
    origin: "Origin",
    quantity: "Quantity",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    addToCart: "Add to cart",
    buyNow: "Buy now",
    donationNote: "All profits go to helping children in difficult circumstances.",
    related: "You may also like",
    imageAlt: (name: string, index: number) => `${name} – photo ${index}`,
    viewImage: (index: number) => `View photo ${index}`,
    notFoundTitle: "Product not found",
    notFoundText: "This product doesn't exist or couldn't be loaded right now.",
    backToProducts: "Browse other products",
  },
  cart: {
    title: "Your cart",
    clear: "Clear all",
    emptyTitle: "Your cart is empty",
    emptyText: "Pick a scented candle — every order helps support the children.",
    browse: "Browse products",
    summary: "Order summary",
    subtotal: (count: number) => `Subtotal (${count} ${count === 1 ? "item" : "items"})`,
    total: "Total",
    checkout: "Checkout",
    added: (name: string) => `Added “${name}” to your cart`,
    removed: (name: string) => `Removed “${name}” from your cart`,
    cleared: "Your cart has been cleared",
    remove: (name: string) => `Remove ${name} from cart`,
    paymentSuccess: "Payment complete! Thank you for supporting Nến Thương.",
    paymentCancelled: "Payment wasn't completed. Please try again.",
    checkoutFailed: "Checkout isn't available right now. Please try again later.",
  },
  orders: {
    title: "My orders",
    emptyTitle: "You don't have any orders yet",
    emptyText: "When you order candles, they'll show up here.",
    browse: "Browse products",
    paid: "Paid",
    unpaid: "Not paid",
    statuses: {
      Processing: "Processing",
      Delivering: "Delivering",
      Delivered: "Delivered",
      Canceled: "Canceled",
    },
  },
  footer: {
    tagline: "Handmade scented candles — all profits go to helping children in difficult circumstances.",
    explore: "Explore",
    contact: "Contact",
    locations: "Vietnam · U.S. · Australia",
    rights: "All rights reserved.",
  },
  status: {
    notFoundTitle: "Page not found",
    notFoundText: "The page you're looking for may have been removed or doesn't exist.",
    backHome: "Back to home",
    errorTitle: "Something went wrong",
    errorText: "Sorry, something didn't work. Please try again.",
    retry: "Try again",
  },
};

// Joins the last two words with a no-break space so a single word never
// wraps onto a line of its own. CSS `text-wrap: pretty` doesn't guarantee it.
function keepLastWordsTogether(text: string): string {
  return text.trim().split(" ").length < 3 ? text : text.replace(/ (\S+)(\s*)$/, " $1$2");
}

function withoutLoneWords<T>(value: T): T {
  if (typeof value === "string") return keepLastWordsTogether(value) as T;
  if (typeof value === "function") {
    const format = value as (...args: never[]) => string;
    return ((...args: never[]) => keepLastWordsTogether(format(...args))) as T;
  }
  if (Array.isArray(value)) return value.map(withoutLoneWords) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withoutLoneWords(item)])) as T;
  }
  return value;
}

// Applied to on-page copy only: buttons and accessible labels keep plain spaces.
function polish(dictionary: Dictionary): Dictionary {
  const { product, products, cart, orders } = dictionary;
  return {
    ...dictionary,
    impact: withoutLoneWords(dictionary.impact),
    home: withoutLoneWords(dictionary.home),
    photos: withoutLoneWords(dictionary.photos),
    about: withoutLoneWords(dictionary.about),
    footer: withoutLoneWords(dictionary.footer),
    status: withoutLoneWords(dictionary.status),
    product: {
      ...product,
      donationNote: keepLastWordsTogether(product.donationNote),
      notFoundText: keepLastWordsTogether(product.notFoundText),
    },
    products: {
      ...products,
      emptyText: keepLastWordsTogether(products.emptyText),
      emptyFilteredText: keepLastWordsTogether(products.emptyFilteredText),
    },
    cart: {
      ...cart,
      emptyText: keepLastWordsTogether(cart.emptyText),
      subtotal: withoutLoneWords(cart.subtotal),
    },
    orders: { ...orders, emptyText: keepLastWordsTogether(orders.emptyText) },
  };
}

export const dictionaries: Record<Language, Dictionary> = { vi: polish(vi), en: polish(en) };
