"use client";

import { deleteProductAction, saveProductAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { useLanguage } from "@/providers/language-provider";
import type { Category, Products, Size } from "@/types-db";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { adminErrorMessage } from "./admin-errors";
import ImageUploader from "./image-uploader";

interface ProductFormProps {
  product: Products | null;
  categories: Category[];
  sizes: Size[];
}

export default function ProductForm({ product, categories, sizes }: ProductFormProps) {
  const { t } = useLanguage();
  const p = t.admin.products;
  const router = useRouter();
  const [images, setImages] = useState(product?.images.map((image) => image.url) ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<{ field: string; message: string } | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    startSaving(async () => {
      const result = await saveProductAction(product?.id ?? null, {
        name: String(form.get("name") ?? ""),
        description: String(form.get("description") ?? ""),
        price: Number(String(form.get("price") ?? "").replace(/[.,\s]/g, "")),
        categoryId: String(form.get("categoryId") ?? "") || null,
        sizeId: String(form.get("sizeId") ?? "") || null,
        origin: String(form.get("origin") ?? ""),
        isFeatured: form.get("isFeatured") === "on",
        isArchived: form.get("isArchived") === "on",
        images,
      });
      if (!result.ok) {
        const message = adminErrorMessage(t, result.error);
        setError({ field: result.error, message });
        toast.error(message);
        return;
      }
      toast.success(t.admin.saved);
      router.push("/admin/products");
      router.refresh();
    });
  };

  const remove = () => {
    if (!product || !window.confirm(t.admin.confirmDelete(product.name))) return;
    startDeleting(async () => {
      const result = await deleteProductAction(product.id);
      if (!result.ok) {
        toast.error(adminErrorMessage(t, result.error));
        return;
      }
      toast.success(t.admin.deleted);
      router.push("/admin/products");
      router.refresh();
    });
  };

  const fieldError = (field: string) =>
    error?.field === field ? (
      <p role="alert" className="text-sm text-red-600">
        {error.message}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm md:p-6 lg:col-span-7">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">{p.name}</span>
          <Input name="name" defaultValue={product?.name} required maxLength={120} aria-invalid={error?.field === "name"} />
          {fieldError("name")}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">{p.description}</span>
          <Textarea name="description" defaultValue={product?.description} maxLength={2000} className="min-h-[140px]" />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-neutral-700">{p.price}</span>
            <Input
              name="price"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              defaultValue={product?.price}
              required
              aria-invalid={error?.field === "price"}
            />
            {fieldError("price")}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-neutral-700">{p.origin}</span>
            <Input name="origin" defaultValue={product?.origin ?? "Việt Nam"} maxLength={80} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-neutral-700">{p.category}</span>
            <Select name="categoryId" defaultValue={product?.categoryId ?? ""}>
              <option value="">{p.none}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-neutral-700">{p.size}</span>
            <Select name="sizeId" defaultValue={product?.sizeId ?? ""}>
              <option value="">{p.none}</option>
              {sizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </Select>
          </label>
        </div>
        <div className="space-y-3 border-t border-neutral-100 pt-5">
          <label className="flex items-center gap-3 text-sm text-neutral-700">
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} className="h-4 w-4 accent-hero" />
            {p.featured}
          </label>
          <label className="flex items-center gap-3 text-sm text-neutral-700">
            <input type="checkbox" name="isArchived" defaultChecked={product?.isArchived} className="h-4 w-4 accent-hero" />
            {p.archived}
          </label>
        </div>
      </div>

      <div className="space-y-5 lg:col-span-5">
        <div className="space-y-3 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm md:p-6">
          <h3 className="text-sm font-medium text-neutral-700">{p.images}</h3>
          <ImageUploader images={images} onChange={setImages} onUploadingChange={setUploading} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={isSaving || uploading || isDeleting}
            className="flex-1 rounded-full bg-hero hover:bg-hero/90"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? t.admin.saving : t.admin.save}
          </Button>
          {product && (
            <Button
              type="button"
              size="lg"
              variant={"outline"}
              onClick={remove}
              disabled={isSaving || isDeleting}
              className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {t.admin.delete}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
