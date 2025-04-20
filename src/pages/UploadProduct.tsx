import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProductRegisterValidator } from "@/lib/ZodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type ProductRegisterValidatorType = z.infer<typeof ProductRegisterValidator>;

export const UploadProduct = () => {
  const user = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductRegisterValidatorType>({
    resolver: zodResolver(ProductRegisterValidator),
  });

  const onSubmit = async (data: ProductRegisterValidator) => {
    const formData = new FormData();

    formData.append("productName", data.productName);
    formData.append("productDescription", data.productDescription);
    formData.append("price", data.price.toString());
    formData.append("stockQuantity", data.stockQuantity.toString());
    formData.append("category", data.category);
    formData.append("productId", data.productId);

    formData.append('userId',user.user?.id as string)

    if (data.productImages && data.productImages.length > 0) {
      for (let i = 0; i < data.productImages.length; i++) {
        formData.append("productImages", data.productImages[i]);
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload-product",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Product added: ", response.data);
    } catch (error) {
      console.log("error adding product:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-10 my-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Product</CardTitle>
          <CardDescription>
            Fill in the details for your new product.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            {/* Product Name */}
            <div>
              <Label htmlFor="product-name" className="text-lg">
                Product Name
              </Label>
              <Input
                id="product-name"
                required
                placeholder="Mai Figure"
                {...register("productName")}
                className={cn(
                  " block w-full p-2 border border-gray-300 rounded-lg mt-2",
                  errors.productName
                    ? "focus-visible:ring-red-500"
                    : "focus-visible:ring-blue-500"
                )}
              />
            </div>

            {/* Product Description */}
            <div className="pt-4">
              <Label htmlFor="product-description" className="text-lg">
                Product Description
              </Label>
              <Textarea
                id="product-description"
                required
                placeholder="Provide a detailed description"
                {...register("productDescription")}
                className={cn(
                  " block w-full p-2 border border-gray-300 rounded-lg mt-2",
                  errors.productName
                    ? "focus-visible:ring-red-500"
                    : "focus-visible:ring-blue-500"
                )}
              />
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <Label htmlFor="price" className="text-lg">
                  Price (₹)
                </Label>
                <Input
                  id="price"
                  required
                  placeholder="eg. 99.99"
                  {...register("price")}
                  className={cn(
                    " block w-full p-2 border border-gray-300 rounded-lg mt-2",
                    errors.price
                      ? "focus-visible:ring-red-500"
                      : "focus-visible:ring-blue-500"
                  )}
                />
              </div>

              <div>
                <Label htmlFor="stock-quantity" className="text-lg">
                  Stock Quantity
                </Label>
                <Input
                  id="stock-quantity"
                  required
                  placeholder="eg: 150"
                  {...register("stockQuantity")}
                  className={cn(
                    " block w-full p-2 border border-gray-300 rounded-lg mt-2",
                    errors.stockQuantity
                      ? "focus-visible:ring-red-500"
                      : "focus-visible:ring-blue-500"
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <Label htmlFor="category" className="text-lg">
                  Category
                </Label>
                <Input
                  id="category"
                  required
                  placeholder="Anime Figure"
                  {...register("category")}
                  className={cn(
                    " block w-full p-2 border border-gray-300 rounded-lg mt-2",
                    errors.category
                      ? "focus-visible:ring-red-500"
                      : "focus-visible:ring-blue-500"
                  )}
                />
              </div>

              <div>
                <Label htmlFor="product-id" className="text-lg">
                  Product ID
                </Label>
                <Input
                  id="product-id"
                  required
                  placeholder="e.g., WBH-BLK-01"
                  {...register("productId")}
                  className={cn(
                    " block w-full p-2 border border-gray-300 rounded-lg mt-2",
                    errors.productId
                      ? "focus-visible:ring-red-500"
                      : "focus-visible:ring-blue-500"
                  )}
                />
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-2 pt-4">
              <Label htmlFor="product-images" className="text-lg">
                Product Images
              </Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                {...register("productImages")}
              />
              <p className="text-sm text-muted-foreground">
                Upload one or more images (e.g., JPG, PNG, GIF).
              </p>
            </div>

            <CardFooter className="px-0 pt-4">
              <Button type="submit">Add Product</Button>

              <Link to="/get-product">test</Link>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
