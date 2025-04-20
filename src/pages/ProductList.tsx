import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import React, { useEffect, useState } from "react";


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

const ProductList = () => {
  const user = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        params: { userId: user.user?.id },
      });
      setProducts(response.data);   
      console.log("user id", user.user?.id)
      console.log("products", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect( () => {
    fetchProducts();
  }, [user.user?.id])
  return (
    <div className="p-5">
      <Table>
        <TableHeader>
          <TableHead>Product Name</TableHead>
          <TableHead>Product ID</TableHead>
          <TableHead>Stock Quantity</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
        </TableHeader>
        <TableBody>
            {products.map((product) => (
                <TableRow key={product.id}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
