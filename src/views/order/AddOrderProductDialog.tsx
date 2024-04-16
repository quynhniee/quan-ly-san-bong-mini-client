import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  Form,
  FormLayout,
  Modal,
  Grid,
} from "@shopify/polaris";
import axios from "axios";
import { Category, OrderProduct, Product } from "../../interface";

interface AddOrderProductDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateItem: (orderProduct: OrderProduct, id: number) => void;
  data: OrderProduct;
}

const AddOrderProductDialog: React.FC<AddOrderProductDialogProps> = ({
  open,
  setOpen,
  handleUpdateItem,
  data,
}: AddOrderProductDialogProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderProduct, setOrderProduct] = useState<OrderProduct>(data);
  const [product, setProduct] = useState<Product | null>(data?.product);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<number | null>(
    data?.product?.category?.id || null
  );
  const [displayProducts, setDisplayProducts] = useState<Product[]>(
    data?.id ? [data?.product] : []
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://54.199.68.197:8081/api/v1/products"
      );
      setProducts(response?.data?.data?.data);
      const newProducts = response?.data?.data?.data.filter(
        (item: Product) => item.category.id == category
      );
      setDisplayProducts(newProducts);
      setProduct(newProducts[0]);
      setOrderProduct({
        id: data?.id,
        product: newProducts[0],  
        quantity: data?.quantity,
        price: data?.price,
      })
    };
    fetchData();
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://54.199.68.197:8081/api/v1/category",
        {
          params: {
            page: 0,
            size: 1000,
          },
        }
      );
      setCategories(response?.data?.data?.data);
      if (!data) setCategory(response?.data?.data?.data[0].id.toString())
    };
    fetchData();
  }, []);

  const handleChangeQuantity = (value: string) => {
    setOrderProduct({
      ...orderProduct,
      quantity: parseInt(value),
    });
  };

  const handleChangePrice = (value: string) => {
    setOrderProduct({
      ...orderProduct,
      price: parseInt(value),
    });
  }

  const handleChangeProduct = (value: string) => {
    const selectedProduct = products.find(
      (item: Product) => item.id === parseInt(value)
    );
    if (selectedProduct) {
      setProduct(selectedProduct);
      setOrderProduct({ ...orderProduct, product: selectedProduct});
    }
  };

  const handleChangeCategory = (value: string) => {
    setCategory(+value);
  };

  return (
    <Modal
      size="small"
      open={open}
      onClose={() => setOpen(false)}
      title={data?.id ? "Sửa thông tin mặt hàng" : "Thêm Mặt Hàng"}
      primaryAction={{
        content: data?.id ? "Lưu" : "Thêm",
        onAction: () => handleUpdateItem(orderProduct, data?.id),
      }}
      secondaryActions={[
        {
          content: "Hủy",
          onAction: () => setOpen(false),
        },
      ]}
    >
      <Form onSubmit={() => handleUpdateItem(orderProduct, data?.id)}>
        <Modal.Section>
          <FormLayout>
            <Select
              id="select-category"
              label="Chọn loại mặt hàng"
              options={categories.map((item: Category) => ({
                label: item.name,
                value: item.id.toString(),
              }))}
              value={category?.toString()}
              onChange={(value) => handleChangeCategory(value as string)}
              disabled={data?.id ? true : false}
            />
            <Select
              id="select-product"
              label="Chọn mặt hàng"
              options={displayProducts.map((item: Product) => ({
                label: item.name,
                value: item.id ? item.id.toString() : "",
              }))}
              value={product?.id?.toString() || ""}
              onChange={(value) => handleChangeProduct(value as string)}
              disabled={data?.id ? true : false}
            />
             <TextField
              id="price"
              label="Giá"
              type="number"
              value={orderProduct?.price ? orderProduct?.price?.toString() : ""}
              onChange={value => handleChangePrice(value)}
              autoComplete="off"
            />
            <TextField
              id="quantity"
              label="Số Lượng"
              type="number"
              min={1}
              value={
                orderProduct?.quantity ? orderProduct?.quantity?.toString() : ""
              }
              onChange={(value) => handleChangeQuantity(value)}
              disabled={!category}
              autoComplete="off"
            />
           
          </FormLayout>
        </Modal.Section>
      </Form>
    </Modal>
  );
};

export default AddOrderProductDialog;
