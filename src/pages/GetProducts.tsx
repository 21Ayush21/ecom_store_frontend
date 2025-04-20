import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface Product {
  id: string;
  productId: string;
  productName: string;
  productDescription: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string | null;
  user?: { id: string; email: string } | null;
}

export const GetProduct = () => {
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchProducts = async () => {
    setLoading(true);
    setError(null);
    setProducts([]);

    try {
      const response = await axios.get("http://localhost:3000/api/get-product", {
        params: { productId },
      });
      setProducts(response.data);
    } catch (err) {
      setError(
        axios.isAxiosError(err) && err.response
          ? err.response.data.message || "Failed to fetch products"
          : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-10 my-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Find Products</CardTitle>
          <CardDescription>
            Enter a Product ID to fetch matching products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="product-id" className="text-lg">
                Product ID
              </Label>
              <Input
                id="product-id"
                placeholder="e.g., WBH-BLK-01"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-lg mt-2"
              />
            </div>
            <Button
              onClick={handleFetchProducts}
              disabled={loading || !productId}
              className="w-full"
            >
              {loading ? "Fetching..." : "Fetch Products"}
            </Button>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            {products.length > 0 && (
              <div className="space-y-4 mt-4">
                <h3 className="text-lg font-semibold">Found Products</h3>
                {products.map((product) => (
                  <Card key={product.id} className="p-4">
                    <CardHeader>
                      <CardTitle>{product.productName}</CardTitle>
                      <CardDescription>
                        Product ID: {product.productId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{product.productDescription}</p>
                      <p>Price: ₹{product.price}</p>
                      <p>Stock: {product.stockQuantity}</p>
                      <p>Category: {product.category}</p>
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.productName}
                          className="mt-2 max-w-xs rounded-lg"
                        />
                      )}
                      {product.user && (
                        <p>Uploaded by: {product.user.id} ({product.user.email})</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {products.length === 0 && !loading && !error && productId && (
              <p className="text-sm text-muted-foreground">
                No products found for this Product ID.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};